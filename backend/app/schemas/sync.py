from datetime import datetime
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, ConfigDict


class DataSourceResponse(BaseModel):
    id: int
    source_name: str
    source_type: str
    status: str
    last_sync: Optional[datetime]
    sync_status: str
    error_message: Optional[str]

    model_config = ConfigDict(from_attributes=True)


class SyncTriggerResponse(BaseModel):
    source: str
    status: str
    message: str
    records_synced: int
    timestamp: datetime


class SyncStatusResponse(BaseModel):
    sources: List[DataSourceResponse]
    total_sources: int
    active_sources: int


class CompanyGovernmentRecord(BaseModel):
    registration_number: str
    legal_name: str
    status: str
    employee_count: int
    last_return_filed: Optional[str]
    raw_source: str


class ComplianceGovernmentRecord(BaseModel):
    compliance_type: str
    reporting_period: str
    status: str
    amount_paid: float
    due_date: str
    payment_date: Optional[str]
    receipt_number: Optional[str]


class WorkerContributionSummary(BaseModel):
    total_employees_covered: int
    total_employer_contribution: float
    total_employee_contribution: float
    defaulting_months: int


class GovernmentDataResponse(BaseModel):
    company_id: int
    registration_number: str
    source: str
    company_record: CompanyGovernmentRecord
    compliance_records: List[ComplianceGovernmentRecord]
    worker_summary: WorkerContributionSummary
