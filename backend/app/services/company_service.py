from datetime import datetime, timezone
from typing import List, Tuple, Optional
from sqlalchemy.orm import Session
from app.models.company import Company
from app.models.user import User, UserRole
from app.schemas.company import CompanyCreate, CompanyUpdate
from app.core.exceptions import NotFoundError, DuplicateEntityError
from app.services.cache_service import cache_service


class CompanyService:
    """Service handling company business logic, filtering, pagination, caching, and soft-delete."""

    def __init__(self, db: Session):
        self.db = db

    def create_company(self, data: CompanyCreate, creating_user: Optional[User] = None) -> Company:
        existing = self.db.query(Company).filter(
            Company.registration_number == data.registration_number,
            Company.is_deleted == False
        ).first()
        if existing:
            raise DuplicateEntityError(
                f"Company with registration number '{data.registration_number}' already exists."
            )

        company = Company(**data.model_dump())
        self.db.add(company)
        self.db.commit()
        self.db.refresh(company)

        # If created by a company user, automatically link their account to this company_id
        if creating_user and creating_user.role == UserRole.COMPANY and creating_user.company_id is None:
            creating_user.company_id = company.id
            self.db.commit()

        return company

    def get_company_by_id(self, company_id: int) -> Company:
        cache_key = f"company:detail:{company_id}"
        cached = cache_service.get_json(cache_key)
        if cached and not cached.get("is_deleted"):
            # Reconstruct or return if un-deleted
            pass

        company = self.db.query(Company).filter(
            Company.id == company_id,
            Company.is_deleted == False
        ).first()
        if not company:
            raise NotFoundError("Company", company_id)

        # Store in cache for 5 minutes
        cache_service.set_json(cache_key, {
            "id": company.id,
            "legal_name": company.legal_name,
            "registration_number": company.registration_number,
            "industry": company.industry,
            "state": company.state,
            "district": company.district,
            "address": company.address,
            "company_size": company.company_size,
            "employee_count": company.employee_count,
            "establishment_date": str(company.establishment_date) if company.establishment_date else None,
            "created_at": company.created_at.isoformat(),
            "updated_at": company.updated_at.isoformat()
        }, ttl_seconds=300)

        return company

    def list_companies(
        self,
        page: int = 1,
        size: int = 10,
        industry: Optional[str] = None,
        state: Optional[str] = None,
        search: Optional[str] = None,
        current_user: Optional[User] = None
    ) -> Tuple[List[Company], int]:
        query = self.db.query(Company).filter(Company.is_deleted == False)

        # Tenant isolation for COMPANY users
        if current_user and current_user.role == UserRole.COMPANY:
            if current_user.company_id:
                query = query.filter(Company.id == current_user.company_id)
            else:
                return [], 0

        if industry:
            query = query.filter(Company.industry.ilike(f"%{industry}%"))
        if state:
            query = query.filter(Company.state.ilike(f"%{state}%"))
        if search:
            query = query.filter(Company.legal_name.ilike(f"%{search}%"))

        total = query.count()
        offset = (page - 1) * size
        companies = query.order_by(Company.id.desc()).offset(offset).limit(size).all()
        return companies, total

    def update_company(self, company_id: int, data: CompanyUpdate) -> Company:
        company = self.get_company_by_id(company_id)
        update_data = data.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(company, field, value)

        self.db.commit()
        self.db.refresh(company)

        # Invalidate cache
        cache_service.invalidate(f"company:detail:{company_id}")
        return company

    def delete_company(self, company_id: int) -> bool:
        """Soft-delete company to preserve statutory legal audit records."""
        company = self.get_company_by_id(company_id)
        company.is_deleted = True
        company.deleted_at = datetime.now(timezone.utc)
        self.db.commit()

        # Invalidate cache
        cache_service.invalidate(f"company:detail:{company_id}")
        return True
