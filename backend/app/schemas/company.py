from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class CompanyBase(BaseModel):
    legal_name: str = Field(..., min_length=2, max_length=255)
    registration_number: str = Field(..., min_length=3, max_length=100)
    industry: str
    state: str
    district: str
    address: str
    company_size: str  # MICRO, SMALL, MEDIUM, LARGE
    employee_count: int = Field(..., ge=0)
    establishment_date: Optional[date] = None


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    legal_name: Optional[str] = None
    industry: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    address: Optional[str] = None
    company_size: Optional[str] = None
    employee_count: Optional[int] = Field(None, ge=0)
    establishment_date: Optional[date] = None


class CompanyResponse(CompanyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CompanyListResponse(BaseModel):
    items: List[CompanyResponse]
    total: int
    page: int
    size: int
