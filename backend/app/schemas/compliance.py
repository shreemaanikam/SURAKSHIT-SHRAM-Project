from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class ComplianceCreate(BaseModel):
    compliance_type: str  # EPFO, ESIC, MINIMUM_WAGES, FACTORIES_ACT, CLRA
    status: str  # COMPLIANT, NON_COMPLIANT, PENDING_REVIEW, PARTIAL
    reporting_period: str  # e.g., "2026-Q1"
    source: str = "MANUAL"
    evidence_document_id: Optional[int] = None
    verified: bool = False


class ComplianceUpdate(BaseModel):
    status: Optional[str] = None
    reporting_period: Optional[str] = None
    evidence_document_id: Optional[int] = None
    verified: Optional[bool] = None


class ComplianceResponse(BaseModel):
    id: int
    company_id: int
    compliance_type: str
    status: str
    reporting_period: str
    source: str
    evidence_document_id: Optional[int]
    verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
