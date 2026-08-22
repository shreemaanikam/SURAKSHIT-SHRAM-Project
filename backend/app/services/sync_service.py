import time
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple
from sqlalchemy.orm import Session

from app.connectors.epfo_mock import MockEPFOConnector
from app.connectors.esic_mock import MockESICConnector
from app.connectors.lin_mock import MockLINConnector
from app.connectors.state_mock import MockStateConnector
from app.models.company import Company
from app.models.compliance import ComplianceRecord
from app.models.data_source import DataSource
from app.schemas.sync import (
    CompanyGovernmentRecord,
    ComplianceGovernmentRecord,
    WorkerContributionSummary,
    GovernmentDataResponse
)
from app.core.exceptions import SynchronizationError, NotFoundError
from app.core.logging import logger

CONNECTORS = {
    "EPFO": MockEPFOConnector(),
    "ESIC": MockESICConnector(),
    "LIN": MockLINConnector(),
    "STATE_LABOR": MockStateConnector()
}


class DataNormalizer:
    """Validator & Normalizer transforming heterogeneous raw responses into standardized internal schemas."""

    @staticmethod
    def normalize_company_record(source: str, reg_number: str, raw: Dict[str, Any]) -> CompanyGovernmentRecord:
        legal_name = raw.get("establishment_name") or raw.get("unit_name") or f"Company {reg_number}"
        emp_count = raw.get("active_members_count") or raw.get("insured_persons_count") or raw.get("verified_employee_count") or 0
        status = raw.get("coverage_status") or raw.get("status") or "ACTIVE"
        
        return CompanyGovernmentRecord(
            registration_number=reg_number,
            legal_name=legal_name,
            status=status,
            employee_count=emp_count,
            last_return_filed=raw.get("registration_date"),
            raw_source=source
        )

    @staticmethod
    def normalize_compliance_records(source: str, raw_records: List[Dict[str, Any]]) -> List[ComplianceGovernmentRecord]:
        normalized = []
        for rec in raw_records:
            comp_type = rec.get("compliance_type") or source
            period = rec.get("reporting_period") or "2026-Q1"
            status = rec.get("status") or "COMPLIANT"
            amount = float(rec.get("amount_paid") or 0.0)
            due_date = rec.get("due_date") or "2026-04-15"
            payment_date = rec.get("payment_date") or rec.get("filing_date")
            receipt = rec.get("trrn_number") or rec.get("challan_number") or rec.get("return_reference")

            normalized.append(
                ComplianceGovernmentRecord(
                    compliance_type=comp_type,
                    reporting_period=period,
                    status=status,
                    amount_paid=amount,
                    due_date=due_date,
                    payment_date=payment_date,
                    receipt_number=receipt
                )
            )
        return normalized

    @staticmethod
    def normalize_worker_summary(source: str, raw_records: List[Dict[str, Any]]) -> WorkerContributionSummary:
        total_emp = 0
        amount_paid = 0.0
        defaults = 0
        for rec in raw_records:
            total_emp = max(total_emp, rec.get("total_members") or rec.get("insured_persons") or 0)
            amount_paid += float(rec.get("amount_paid") or 0.0)
            defaults += int(rec.get("defaulting_months") or 0)

        # 50-50 share split simulation for demonstration
        employer_share = round(amount_paid * 0.5, 2)
        employee_share = round(amount_paid * 0.5, 2)

        return WorkerContributionSummary(
            total_employees_covered=total_emp,
            total_employer_contribution=employer_share,
            total_employee_contribution=employee_share,
            defaulting_months=defaults
        )


class SynchronizationService:
    """Service handling resilient government data synchronization with retries and batching."""

    def __init__(self, db: Session):
        self.db = db

    def _execute_connector_with_retry(
        self, connector: Any, reg_number: str, max_retries: int = 3
    ) -> Dict[str, Any]:
        """Execute connector synchronization with retry attempts and backoff."""
        last_error = None
        for attempt in range(1, max_retries + 1):
            try:
                return connector.synchronize(reg_number)
            except Exception as e:
                last_error = e
                logger.warning(f"Connector {connector.source_name} sync attempt {attempt}/{max_retries} failed for {reg_number}: {e}")
                time.sleep(0.1 * (2 ** (attempt - 1)))
        raise last_error

    def sync_source(self, source_name: str, company_id: Optional[int] = None) -> Dict[str, Any]:
        """Synchronize data for a specific source idempotently across one or all companies."""
        source_name_upper = source_name.upper()
        if source_name_upper not in CONNECTORS:
            raise SynchronizationError(f"Unsupported government data source: {source_name}")

        connector = CONNECTORS[source_name_upper]

        # Ensure DataSource entry exists in DB
        db_source = self.db.query(DataSource).filter(DataSource.source_name == source_name_upper).first()
        if not db_source:
            db_source = DataSource(
                source_name=source_name_upper,
                source_type="MOCK_CONNECTOR",
                status="ACTIVE",
                sync_status="IN_PROGRESS"
            )
            self.db.add(db_source)
            self.db.commit()
            self.db.refresh(db_source)

        db_source.sync_status = "IN_PROGRESS"
        self.db.commit()

        synced_count = 0
        try:
            query = self.db.query(Company).filter(Company.is_deleted == False)
            if company_id:
                query = query.filter(Company.id == company_id)
            companies = query.all()

            if not companies:
                db_source.last_sync = datetime.now(timezone.utc)
                db_source.sync_status = "SUCCESS"
                db_source.error_message = None
                self.db.commit()
                return {
                    "source": source_name_upper,
                    "status": "SUCCESS",
                    "message": "No active companies found for sync",
                    "records_synced": 0,
                    "timestamp": datetime.now(timezone.utc)
                }

            company_ids = [c.id for c in companies]

            # Batch query existing compliance records to prevent N+1 queries
            existing_records = self.db.query(ComplianceRecord).filter(
                ComplianceRecord.company_id.in_(company_ids)
            ).all()

            # Build index lookup map: (company_id, compliance_type, reporting_period) -> ComplianceRecord
            existing_map: Dict[Tuple[int, str, str], ComplianceRecord] = {
                (rec.company_id, rec.compliance_type, rec.reporting_period): rec
                for rec in existing_records
            }

            for company in companies:
                raw_bundle = self._execute_connector_with_retry(connector, company.registration_number)
                norm_records = DataNormalizer.normalize_compliance_records(
                    source_name_upper, raw_bundle.get("compliance_raw", [])
                )

                for norm in norm_records:
                    key = (company.id, norm.compliance_type, norm.reporting_period)
                    if key in existing_map:
                        existing = existing_map[key]
                        existing.status = norm.status
                        existing.source = f"{source_name_upper}_MOCK"
                        existing.verified = True
                        existing.updated_at = datetime.now(timezone.utc)
                    else:
                        new_record = ComplianceRecord(
                            company_id=company.id,
                            compliance_type=norm.compliance_type,
                            status=norm.status,
                            reporting_period=norm.reporting_period,
                            source=f"{source_name_upper}_MOCK",
                            verified=True
                        )
                        self.db.add(new_record)
                        existing_map[key] = new_record
                    synced_count += 1

            db_source.last_sync = datetime.now(timezone.utc)
            db_source.sync_status = "SUCCESS"
            db_source.error_message = None
            self.db.commit()

            logger.info(f"Sync successful for source {source_name_upper}: {synced_count} records processed")
            return {
                "source": source_name_upper,
                "status": "SUCCESS",
                "message": f"Successfully synchronized {synced_count} compliance records",
                "records_synced": synced_count,
                "timestamp": datetime.now(timezone.utc)
            }

        except Exception as e:
            self.db.rollback()
            db_source.sync_status = "FAILED"
            db_source.error_message = str(e)
            self.db.commit()
            logger.error(f"Sync failed for source {source_name_upper}: {str(e)}")
            raise SynchronizationError(f"Sync execution failed: {str(e)}")

    def get_government_data(self, company_id: int, source_name: str = "EPFO") -> GovernmentDataResponse:
        """Fetch normalized government data view for a given company."""
        company = self.db.query(Company).filter(
            Company.id == company_id,
            Company.is_deleted == False
        ).first()
        if not company:
            raise NotFoundError("Company", company_id)

        source_upper = source_name.upper()
        connector = CONNECTORS.get(source_upper, CONNECTORS["EPFO"])
        raw_bundle = self._execute_connector_with_retry(connector, company.registration_number)

        company_norm = DataNormalizer.normalize_company_record(
            source_upper, company.registration_number, raw_bundle["company_raw"]
        )
        compliance_norm = DataNormalizer.normalize_compliance_records(
            source_upper, raw_bundle["compliance_raw"]
        )
        worker_norm = DataNormalizer.normalize_worker_summary(
            source_upper, raw_bundle["compliance_raw"]
        )

        return GovernmentDataResponse(
            company_id=company.id,
            registration_number=company.registration_number,
            source=source_upper,
            company_record=company_norm,
            compliance_records=compliance_norm,
            worker_summary=worker_norm
        )

    def get_sync_status(self) -> List[DataSource]:
        """Fetch sync status for all government data connectors."""
        for name in CONNECTORS.keys():
            existing = self.db.query(DataSource).filter(DataSource.source_name == name).first()
            if not existing:
                ds = DataSource(
                    source_name=name,
                    source_type="MOCK_CONNECTOR",
                    status="ACTIVE",
                    sync_status="NEVER_RUN"
                )
                self.db.add(ds)
        self.db.commit()
        return self.db.query(DataSource).all()
