from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class DocumentCreate(BaseModel):
    company_id: int
    document_type: str  # ECR_CHALLAN, ESI_RETURN, WAGE_REGISTER, INSPECTION_REPORT
    filename: str
    storage_reference: str
    document_hash: str
    verification_status: str = "PENDING"


class DocumentResponse(BaseModel):
    id: int
    company_id: int
    document_type: str
    filename: str
    storage_reference: str
    document_hash: str
    uploaded_by: Optional[int]
    upload_date: datetime
    verification_status: str

    model_config = ConfigDict(from_attributes=True)
