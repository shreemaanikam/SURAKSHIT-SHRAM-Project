from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class ViolationCreate(BaseModel):
    violation_type: str
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    description: str
    evidence_reference: Optional[str] = None
    status: str = "OPEN"


class ViolationResponse(BaseModel):
    id: int
    company_id: int
    violation_type: str
    severity: str
    description: str
    evidence_reference: Optional[str]
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ImprovementNoticeCreate(BaseModel):
    violation_id: int
    deadline: datetime
    status: str = "ISSUED"
    response_reference: Optional[str] = None
    escalation_status: str = "NONE"


class ImprovementNoticeResponse(BaseModel):
    id: int
    company_id: int
    violation_id: int
    notice_date: datetime
    deadline: datetime
    status: str
    response_reference: Optional[str]
    escalation_status: str

    model_config = ConfigDict(from_attributes=True)


class InspectionCreate(BaseModel):
    company_id: int
    inspection_date: datetime
    status: str = "SCHEDULED"  # SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
    findings: Optional[str] = None
    report_reference: Optional[str] = None


class InspectionUpdate(BaseModel):
    status: Optional[str] = None
    findings: Optional[str] = None
    report_reference: Optional[str] = None
    inspection_date: Optional[datetime] = None


class InspectionResponse(BaseModel):
    id: int
    company_id: int
    inspector_id: Optional[int]
    inspection_date: datetime
    status: str
    findings: Optional[str]
    report_reference: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
