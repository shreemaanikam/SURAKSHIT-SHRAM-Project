from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.inspection import Inspection
from app.models.violation import Violation
from app.models.improvement_notice import ImprovementNotice
from app.models.company import Company
from app.schemas.inspection import (
    InspectionCreate, InspectionUpdate,
    ViolationCreate, ImprovementNoticeCreate
)
from app.core.exceptions import NotFoundError, BaseAppException


class InspectionService:
    """Service handling labor inspections, violations, and improvement notices."""

    def __init__(self, db: Session):
        self.db = db

    def create_inspection(self, data: InspectionCreate, inspector_id: Optional[int] = None) -> Inspection:
        company = self.db.query(Company).filter(
            Company.id == data.company_id,
            Company.is_deleted == False
        ).first()
        if not company:
            raise NotFoundError("Company", data.company_id)

        inspection = Inspection(
            company_id=data.company_id,
            inspector_id=inspector_id,
            inspection_date=data.inspection_date,
            status=data.status,
            findings=data.findings,
            report_reference=data.report_reference
        )
        self.db.add(inspection)
        self.db.commit()
        self.db.refresh(inspection)
        return inspection

    def get_inspection_by_id(self, inspection_id: int) -> Inspection:
        inspection = self.db.query(Inspection).filter(Inspection.id == inspection_id).first()
        if not inspection:
            raise NotFoundError("Inspection", inspection_id)
        return inspection

    def list_company_inspections(self, company_id: int) -> List[Inspection]:
        company = self.db.query(Company).filter(
            Company.id == company_id,
            Company.is_deleted == False
        ).first()
        if not company:
            raise NotFoundError("Company", company_id)

        return self.db.query(Inspection).filter(
            Inspection.company_id == company_id
        ).order_by(Inspection.inspection_date.desc()).all()

    def update_inspection(self, inspection_id: int, data: InspectionUpdate) -> Inspection:
        inspection = self.get_inspection_by_id(inspection_id)
        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(inspection, field, value)

        self.db.commit()
        self.db.refresh(inspection)
        return inspection

    def create_violation(self, company_id: int, data: ViolationCreate) -> Violation:
        company = self.db.query(Company).filter(
            Company.id == company_id,
            Company.is_deleted == False
        ).first()
        if not company:
            raise NotFoundError("Company", company_id)

        violation = Violation(
            company_id=company_id,
            **data.model_dump()
        )
        self.db.add(violation)
        self.db.commit()
        self.db.refresh(violation)
        return violation

    def list_company_violations(self, company_id: int) -> List[Violation]:
        return self.db.query(Violation).filter(
            Violation.company_id == company_id
        ).order_by(Violation.created_at.desc()).all()

    def create_improvement_notice(self, company_id: int, data: ImprovementNoticeCreate) -> ImprovementNotice:
        violation = self.db.query(Violation).filter(Violation.id == data.violation_id).first()
        if not violation:
            raise NotFoundError("Violation", data.violation_id)

        # Cross-company violation check (MEDIUM-8 fix)
        if violation.company_id != company_id:
            raise BaseAppException(
                message=f"Violation ID {data.violation_id} does not belong to Company ID {company_id}.",
                status_code=400,
                code="VIOLATION_COMPANY_MISMATCH"
            )

        notice = ImprovementNotice(
            company_id=company_id,
            violation_id=data.violation_id,
            deadline=data.deadline,
            status=data.status,
            response_reference=data.response_reference,
            escalation_status=data.escalation_status
        )
        self.db.add(notice)
        self.db.commit()
        self.db.refresh(notice)
        return notice
