from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.middleware.auth import get_current_user, verify_company_access
from app.models.user import User
from app.schemas.ai import (
    AIDocumentAnalysisRequest, AIDocumentAnalysisResponse,
    AIComplianceAnalysisRequest, AIComplianceAnalysisResponse,
    AIRiskExplanationRequest, AIRiskExplanationResponse,
    AIRiskAnalysisRequest, AIRiskAnalysisResponse,
    AIFraudAnalysisRequest, AIFraudAnalysisResponse
)
from app.services.ai_service import AIService
from app.services.audit_service import AuditService

router = APIRouter(prefix="/ai", tags=["AI Engine Gateway (OCR, Rules & Risk Models)"])


@router.post(
    "/document-analysis",
    response_model=AIDocumentAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Trigger AI OCR and document fraud analysis",
    description="Extracts structured entities, verifies e-signatures, and assesses fraud risk level."
)
def analyze_document(
    payload: AIDocumentAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = AIService(db)
    res = service.analyze_document(payload, user_id=current_user.id)
    
    AuditService.log_action(
        db=db,
        action="AI_DOCUMENT_ANALYSIS",
        resource_type="Document",
        resource_id=str(payload.document_id) if payload.document_id else "STREAM",
        user_id=current_user.id
    )
    return res


@router.post(
    "/compliance-analysis",
    response_model=AIComplianceAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Trigger state-adaptive AI compliance rule evaluation",
    description="Evaluates labor statutes across central and state-specific jurisdiction rulesets."
)
def analyze_compliance_rules(
    payload: AIComplianceAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_company_access(payload.company_id, current_user)
    service = AIService(db)
    res = service.analyze_compliance_rules(payload, user_id=current_user.id)
    
    AuditService.log_action(
        db=db,
        action="AI_RULE_EVALUATION",
        resource_type="Company",
        resource_id=str(payload.company_id),
        user_id=current_user.id
    )
    return res


@router.post(
    "/risk-analysis",
    response_model=AIRiskAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Calculate ML risk score with fairness bias adjustment",
    description="Computes company risk score via Random Forest ML model and applies regional/scale fairness corrections."
)
def calculate_risk(
    payload: AIRiskAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_company_access(payload.company_id, current_user)
    service = AIService(db)
    res = service.calculate_risk(payload, user_id=current_user.id)
    
    AuditService.log_action(
        db=db,
        action="AI_RISK_CALCULATION",
        resource_type="Company",
        resource_id=str(payload.company_id),
        user_id=current_user.id
    )
    return res


@router.post(
    "/risk-explanation",
    response_model=AIRiskExplanationResponse,
    status_code=status.HTTP_200_OK,
    summary="Fetch explainable AI (SHAP) risk factor breakdown",
    description="Generates feature contribution scores, risk levels, and recommended interventions."
)
def explain_risk(
    payload: AIRiskExplanationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_company_access(payload.company_id, current_user)
    service = AIService(db)
    res = service.explain_risk(payload, user_id=current_user.id)
    
    AuditService.log_action(
        db=db,
        action="AI_RISK_EXPLANATION",
        resource_type="Company",
        resource_id=str(payload.company_id),
        user_id=current_user.id
    )
    return res


@router.post(
    "/fraud-analysis",
    response_model=AIFraudAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Run Isolation Forest anomaly and EPFO discrepancy detector",
    description="Detects statistical anomalies in payroll documents and flags discrepancies."
)
def analyze_fraud(
    payload: AIFraudAnalysisRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_company_access(payload.company_id, current_user)
    service = AIService(db)
    res = service.analyze_fraud(payload, user_id=current_user.id)
    
    AuditService.log_action(
        db=db,
        action="AI_FRAUD_ANALYSIS",
        resource_type="Company",
        resource_id=str(payload.company_id),
        user_id=current_user.id
    )
    return res
