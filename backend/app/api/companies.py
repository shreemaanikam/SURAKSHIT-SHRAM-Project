from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.middleware.auth import get_current_user, require_company_user, require_admin, verify_company_access
from app.models.user import User
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse, CompanyListResponse
from app.services.company_service import CompanyService
from app.services.audit_service import AuditService

router = APIRouter(prefix="/companies", tags=["Companies"])


@router.post(
    "",
    response_model=CompanyResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new company profile",
    description="Requires COMPANY or ADMIN user role."
)
def create_company(
    payload: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company_user)
):
    service = CompanyService(db)
    company = service.create_company(payload, creating_user=current_user)
    
    AuditService.log_action(
        db=db,
        action="COMPANY_CREATE",
        resource_type="Company",
        resource_id=str(company.id),
        user_id=current_user.id
    )
    return company


@router.get(
    "",
    response_model=CompanyListResponse,
    summary="List companies with pagination and filtering",
    description="Filter by industry, state, or search legal name."
)
def list_companies(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    industry: Optional[str] = None,
    state: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = CompanyService(db)
    items, total = service.list_companies(
        page=page,
        size=size,
        industry=industry,
        state=state,
        search=search,
        current_user=current_user
    )
    return CompanyListResponse(
        items=items,
        total=total,
        page=page,
        size=size
    )


@router.get(
    "/{company_id}",
    response_model=CompanyResponse,
    summary="Get company profile by ID"
)
def get_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_company_access(company_id, current_user)
    service = CompanyService(db)
    return service.get_company_by_id(company_id)


@router.put(
    "/{company_id}",
    response_model=CompanyResponse,
    summary="Update company profile",
    description="Requires COMPANY or ADMIN user role."
)
def update_company(
    company_id: int,
    payload: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company_user)
):
    verify_company_access(company_id, current_user)
    service = CompanyService(db)
    updated = service.update_company(company_id, payload)
    
    AuditService.log_action(
        db=db,
        action="COMPANY_UPDATE",
        resource_type="Company",
        resource_id=str(company_id),
        user_id=current_user.id
    )
    return updated


@router.delete(
    "/{company_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Soft-delete company profile",
    description="Requires ADMIN user role."
)
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = CompanyService(db)
    service.delete_company(company_id)
    
    AuditService.log_action(
        db=db,
        action="COMPANY_DELETE",
        resource_type="Company",
        resource_id=str(company_id),
        user_id=current_user.id
    )
    return None
