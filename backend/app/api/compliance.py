from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.middleware.auth import get_current_user, require_company_user
from app.models.user import User
from app.schemas.compliance import ComplianceCreate, ComplianceUpdate, ComplianceResponse
from app.services.compliance_service import ComplianceService
from app.services.audit_service import AuditService

router = APIRouter(tags=["Labor Compliance Records"])


@router.post(
    "/companies/{company_id}/compliance",
    response_model=ComplianceResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create compliance record for a company"
)
def create_compliance(
    company_id: int,
    payload: ComplianceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company_user)
):
    service = ComplianceService(db)
    record = service.create_compliance_record(company_id, payload)
    
    AuditService.log_action(
        db=db,
        action="COMPLIANCE_CREATE",
        resource_type="ComplianceRecord",
        resource_id=str(record.id),
        user_id=current_user.id
    )
    return record


@router.get(
    "/companies/{company_id}/compliance",
    response_model=List[ComplianceResponse],
    summary="Get all compliance records for a company"
)
def list_compliance(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = ComplianceService(db)
    return service.list_company_compliance(company_id)


@router.put(
    "/compliance/{id}",
    response_model=ComplianceResponse,
    summary="Update a compliance record status"
)
def update_compliance(
    id: int,
    payload: ComplianceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company_user)
):
    service = ComplianceService(db)
    record = service.update_compliance_record(id, payload)
    
    AuditService.log_action(
        db=db,
        action="COMPLIANCE_UPDATE",
        resource_type="ComplianceRecord",
        resource_id=str(id),
        user_id=current_user.id
    )
    return record
