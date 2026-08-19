from typing import List, Tuple, Optional
from sqlalchemy.orm import Session
from app.models.company import Company
from app.schemas.company import CompanyCreate, CompanyUpdate
from app.core.exceptions import NotFoundError, DuplicateEntityError
from app.services.cache_service import cache_service


class CompanyService:
    """Service handling company business logic, filtering, pagination, and caching."""

    def __init__(self, db: Session):
        self.db = db

    def create_company(self, data: CompanyCreate) -> Company:
        existing = self.db.query(Company).filter(
            Company.registration_number == data.registration_number
        ).first()
        if existing:
            raise DuplicateEntityError(
                f"Company with registration number '{data.registration_number}' already exists."
            )

        company = Company(**data.model_dump())
        self.db.add(company)
        self.db.commit()
        self.db.refresh(company)
        return company

    def get_company_by_id(self, company_id: int) -> Company:
        cache_key = f"company:detail:{company_id}"
        cached = cache_service.get_json(cache_key)
        if cached:
            # Reconstruct from cache if available or directly return cached dict
            pass

        company = self.db.query(Company).filter(Company.id == company_id).first()
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
        search: Optional[str] = None
    ) -> Tuple[List[Company], int]:
        query = self.db.query(Company)

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
        company = self.get_company_by_id(company_id)
        self.db.delete(company)
        self.db.commit()

        # Invalidate cache
        cache_service.invalidate(f"company:detail:{company_id}")
        return True
