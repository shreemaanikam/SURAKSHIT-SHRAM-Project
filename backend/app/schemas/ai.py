from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class AIDocumentAnalysisRequest(BaseModel):
    document_id: Optional[int] = Field(None, description="Internal document ID")
    document_url: Optional[str] = Field(None, description="Document reference URL or storage path")
    document_type: str = Field(..., description="Document category (e.g. ECR_CHALLAN, WAGE_REGISTER, ESI_RETURN)")


class AIDocumentAnalysisResponse(BaseModel):
    document_id: Optional[int]
    document_type: str
    ocr_extracted_text: str
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    key_fields: Dict[str, Any] = Field(..., description="Extracted key-value entities")
    fraud_risk_level: str = Field(..., description="LOW, MEDIUM, HIGH, CRITICAL")
    processing_timestamp: str


class AIComplianceAnalysisRequest(BaseModel):
    company_id: int
    state_code: str = Field("DL", description="Two-letter state jurisdiction code (e.g. DL, MH, KA)")
    reporting_period: str = Field("2026-Q1", description="Target reporting period")
    ruleset_version: Optional[str] = Field("v2.1-state-adaptive", description="Rule engine model version")


class RuleEvaluationDetail(BaseModel):
    rule_id: str
    rule_name: str
    act_name: str
    compliance_status: str  # COMPLIANT, NON_COMPLIANT, ACTION_REQUIRED
    penalty_estimate_inr: float
    description: str


class AIComplianceAnalysisResponse(BaseModel):
    company_id: int
    state_code: str
    overall_compliance_rate: float = Field(..., ge=0.0, le=100.0)
    evaluated_rules_count: int
    rule_evaluations: List[RuleEvaluationDetail]
    analysis_timestamp: str


class AIRiskExplanationRequest(BaseModel):
    company_id: int
    risk_score: Optional[float] = None


class RiskFactorDetail(BaseModel):
    factor_name: str
    weight: float
    contribution_score: float
    explanation: str


class AIRiskExplanationResponse(BaseModel):
    company_id: int
    composite_risk_score: float
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    shap_explainability_factors: List[RiskFactorDetail]
    recommended_interventions: List[str]
    model_metadata: Dict[str, Any]
