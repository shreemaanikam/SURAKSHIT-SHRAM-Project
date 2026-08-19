from datetime import datetime
from typing import List, Union, Any, Dict
from pydantic import BaseModel, ConfigDict


class RiskScoreCreate(BaseModel):
    company_id: int
    score: float
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    reasons: str  # JSON string or description
    model_version: str = "v1.0-rules-engine"


class RiskScoreResponse(BaseModel):
    id: int
    company_id: int
    score: float
    risk_level: str
    reasons: str
    calculated_at: datetime
    model_version: str

    model_config = ConfigDict(from_attributes=True)
