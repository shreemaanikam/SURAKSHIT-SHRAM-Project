from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.compliance import ComplianceRecord
from app.models.company import Company
from app.schemas.compliance import ComplianceCreate, ComplianceUpdate
from app.core.exceptions import NotFoundError, DuplicateEntityError
from app.services.cache_service import cache_service


class ComplianceService:
    """Service for labor compliance records."""

    def __init__(self, db: Session):
        self.db = db

    def create_compliance_record(self, company_id: int, data: ComplianceCreate) -> ComplianceRecord:
        company = self.db.query(Company).filter(Company.id == company_id).first()
        if not company:
            raise NotFoundError("Company", company_id)

        # Check existing
        existing = self.db.query(ComplianceRecord).filter(
            ComplianceRecord.company_id == company_id,
            ComplianceRecord.compliance_type == data.compliance_type,
            ComplianceRecord.reporting_period == data.reporting_period
        ).first()

        if existing:
            raise DuplicateEntityError(
                f"Compliance record for {data.compliance_type} period {data.reporting_period} already exists."
            )

        record = ComplianceRecord(
            company_id=company_id,
            **data.model_dump()
        )
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)

        # Invalidate cache
        cache_service.invalidate_prefix(f"compliance:{company_id}")
        return record

    def list_company_compliance(self, company_id: int) -> List[ComplianceRecord]:
        company = self.db.query(Company).filter(Company.id == company_id).first()
        if not company:
            raise NotFoundError("Company", company_id)

        return self.db.query(ComplianceRecord).filter(
            ComplianceRecord.company_id == company_id
        ).order_by(ComplianceRecord.created_at.desc()).all()

    def update_compliance_record(self, record_id: int, data: ComplianceUpdate) -> ComplianceRecord:
        record = self.db.query(ComplianceRecord).filter(ComplianceRecord.id == record_id).first()
        if not record:
            raise NotFoundError("ComplianceRecord", record_id)

        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(record, field, value)

        self.db.commit()
        self.db.refresh(record)

        # Invalidate cache
        cache_service.invalidate_prefix(f"compliance:{record.company_id}")
        return record
