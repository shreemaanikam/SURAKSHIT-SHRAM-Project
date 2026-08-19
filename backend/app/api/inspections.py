from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.middleware.auth import get_current_user, require_inspector
from app.models.user import User
from app.schemas.inspection import (
    InspectionCreate, InspectionUpdate, InspectionResponse,
    ViolationCreate, ViolationResponse,
    ImprovementNoticeCreate, ImprovementNoticeResponse
)
from app.services.inspection_service import InspectionService
from app.services.audit_service import AuditService

router = APIRouter(tags=["Inspections, Violations & Improvement Notices"])


@router.post(
    "/inspections",
    response_model=InspectionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Schedule a new labor inspection",
    description="Requires INSPECTOR or ADMIN role."
)
def create_inspection(
    payload: InspectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_inspector)
):
    service = InspectionService(db)
    inspection = service.create_inspection(payload, inspector_id=current_user.id)
    
    AuditService.log_action(
        db=db,
        action="INSPECTION_CREATE",
        resource_type="Inspection",
        resource_id=str(inspection.id),
        user_id=current_user.id
    )
    return inspection


@router.get(
    "/inspections/{id}",
    response_model=InspectionResponse,
    summary="Get inspection details by ID"
)
def get_inspection(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = InspectionService(db)
    return service.get_inspection_by_id(id)


@router.get(
    "/companies/{company_id}/inspections",
    response_model=List[InspectionResponse],
    summary="List all inspections for a company"
)
def list_company_inspections(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = InspectionService(db)
    return service.list_company_inspections(company_id)


@router.put(
    "/inspections/{id}",
    response_model=InspectionResponse,
    summary="Update inspection status and findings",
    description="Requires INSPECTOR or ADMIN role."
)
def update_inspection(
    id: int,
    payload: InspectionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_inspector)
):
    service = InspectionService(db)
    updated = service.update_inspection(id, payload)
    
    AuditService.log_action(
        db=db,
        action="INSPECTION_UPDATE",
        resource_type="Inspection",
        resource_id=str(id),
        user_id=current_user.id
    )
    return updated


@router.post(
    "/companies/{company_id}/violations",
    response_model=ViolationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Log a labor compliance violation against a company",
    description="Requires INSPECTOR or ADMIN role."
)
def create_violation(
    company_id: int,
    payload: ViolationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_inspector)
):
    service = InspectionService(db)
    violation = service.create_violation(company_id, payload)
    
    AuditService.log_action(
        db=db,
        action="VIOLATION_LOG",
        resource_type="Violation",
        resource_id=str(violation.id),
        user_id=current_user.id
    )
    return violation


@router.get(
    "/companies/{company_id}/violations",
    response_model=List[ViolationResponse],
    summary="List violations recorded for a company"
)
def list_violations(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = InspectionService(db)
    return service.list_company_violations(company_id)


@router.post(
    "/companies/{company_id}/improvement-notices",
    response_model=ImprovementNoticeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Issue an official improvement notice for a violation",
    description="Requires INSPECTOR or ADMIN role."
)
def create_improvement_notice(
    company_id: int,
    payload: ImprovementNoticeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_inspector)
):
    service = InspectionService(db)
    notice = service.create_improvement_notice(company_id, payload)
    
    AuditService.log_action(
        db=db,
        action="IMPROVEMENT_NOTICE_ISSUE",
        resource_type="ImprovementNotice",
        resource_id=str(notice.id),
        user_id=current_user.id
    )
    return notice
