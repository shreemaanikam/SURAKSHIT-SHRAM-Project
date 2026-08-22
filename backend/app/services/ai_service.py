from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session

from app.models.company import Company
from app.models.document import Document
from app.schemas.ai import (
    AIDocumentAnalysisRequest, AIDocumentAnalysisResponse,
    AIComplianceAnalysisRequest, AIComplianceAnalysisResponse, RuleEvaluationDetail,
    AIRiskExplanationRequest, AIRiskExplanationResponse, RiskFactorDetail
)
from app.core.exceptions import NotFoundError, BaseAppException


class AIService:
    """
    AI Integration Service Gateway.
    Provides structured interfaces & mock responses for future Team Member 2 AI modules:
    - OCR & Fraud Detection
    - NLP & State-Adaptive Compliance Rules Engine
    - ML Risk Engine & Explainable AI (SHAP / Feature Importance)
    """

    def __init__(self, db: Session):
        self.db = db

    def analyze_document(self, request: AIDocumentAnalysisRequest) -> AIDocumentAnalysisResponse:
        doc = None
        if request.document_id:
            doc = self.db.query(Document).filter(Document.id == request.document_id).first()
            if not doc:
                raise NotFoundError("Document", request.document_id)

        doc_type = request.document_type.upper()
        
        # Mock OCR & Entity Extraction Payload
        ocr_text = f"[OCR EXTRACTED TEXT for {doc_type}]: Establishment Registration REG-SYNTH-2026. TRRN: 10126482910. Wage Month: March 2026. Amount Paid: ₹261,000. Verified E-Signature present."
        
        key_entities = {
            "trrn_or_challan": "10126482910",
            "establishment_name": "Synthetic Enterprise Ltd",
            "period": "2026-Q1",
            "extracted_amount": 261000.0,
            "signature_verified": True
        }

        return AIDocumentAnalysisResponse(
            document_id=request.document_id,
            document_type=doc_type,
            ocr_extracted_text=ocr_text,
            confidence_score=0.96,
            key_fields=key_entities,
            fraud_risk_level="LOW",
            processing_timestamp=datetime.now(timezone.utc).isoformat()
        )

    def analyze_compliance_rules(self, request: AIComplianceAnalysisRequest) -> AIComplianceAnalysisResponse:
        company = self.db.query(Company).filter(
            Company.id == request.company_id,
            Company.is_deleted == False
        ).first()
        if not company:
            raise NotFoundError("Company", request.company_id)

        # Mock State-Adaptive Rules Engine Evaluation
        rules = [
            RuleEvaluationDetail(
                rule_id="RULE-EPFO-01",
                rule_name="EPF Monthly Contribution Filing",
                act_name="Employees' Provident Funds and Miscellaneous Provisions Act, 1952",
                compliance_status="COMPLIANT",
                penalty_estimate_inr=0.0,
                description="ECR filed within 15 days of wage month end."
            ),
            RuleEvaluationDetail(
                rule_id="RULE-ESIC-02",
                rule_name="ESI Half-Yearly Return Filing",
                act_name="Employees' State Insurance Act, 1948",
                compliance_status="COMPLIANT",
                penalty_estimate_inr=0.0,
                description="Insured persons contribution paid regularly."
            ),
            RuleEvaluationDetail(
                rule_id=f"RULE-{request.state_code}-MINWAGE",
                rule_name=f"{request.state_code} State Minimum Wage Audit",
                act_name=f"{request.state_code} Minimum Wages Rules, 1950",
                compliance_status="ACTION_REQUIRED",
                penalty_estimate_inr=15000.0,
                description="Overtime wage register requires formal inspector signature update."
            )
        ]

        compliant_count = sum(1 for r in rules if r.compliance_status == "COMPLIANT")
        overall_rate = round((compliant_count / len(rules)) * 100.0, 1)

        return AIComplianceAnalysisResponse(
            company_id=company.id,
            state_code=request.state_code.upper(),
            overall_compliance_rate=overall_rate,
            evaluated_rules_count=len(rules),
            rule_evaluations=rules,
            analysis_timestamp=datetime.now(timezone.utc).isoformat()
        )

    def explain_risk(self, request: AIRiskExplanationRequest) -> AIRiskExplanationResponse:
        company = self.db.query(Company).filter(
            Company.id == request.company_id,
            Company.is_deleted == False
        ).first()
        if not company:
            raise NotFoundError("Company", request.company_id)

        # Mock SHAP Explainable AI Feature Breakdown
        factors = [
            RiskFactorDetail(
                factor_name="Historical Filing Timeliness",
                weight=0.35,
                contribution_score=5.2,
                explanation="Timely ECR and ESIC filings in recent 4 quarters."
            ),
            RiskFactorDetail(
                factor_name="Worker Scale vs Workplace Size",
                weight=0.25,
                contribution_score=12.5,
                explanation="High worker density in shop floor increases inspection priority weight."
            ),
            RiskFactorDetail(
                factor_name="Unresolved Violation Notices",
                weight=0.40,
                contribution_score=18.0,
                explanation="Active open improvement notice recorded in factory inspection log."
            )
        ]

        composite_score = sum(f.contribution_score for f in factors) + 10.0
        risk_level = "LOW" if composite_score < 25 else "MEDIUM" if composite_score < 50 else "HIGH" if composite_score < 75 else "CRITICAL"

        return AIRiskExplanationResponse(
            company_id=company.id,
            composite_risk_score=round(composite_score, 2),
            risk_level=risk_level,
            shap_explainability_factors=factors,
            recommended_interventions=[
                "Upload updated PPE distribution receipts.",
                "Schedule follow-up compliance verification with State Labor Nodal Officer."
            ],
            model_metadata={
                "model_name": "surakshit-shram-risk-ml",
                "version": "v2.0-shap-explainable",
                "last_trained": "2026-08-01"
            }
        )
