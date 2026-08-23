import sys
import os
import json
from datetime import datetime, timezone
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.risk_score import RiskScore
from app.models.company import Company
from app.models.compliance import ComplianceRecord
from app.models.violation import Violation
from app.core.exceptions import NotFoundError

# Ensure AI_Modules is accessible
AI_MODULES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "AI_Modules"))
if not os.path.exists(AI_MODULES_DIR):
    AI_MODULES_DIR = os.path.abspath("AI_Modules")
if AI_MODULES_DIR not in sys.path:
    sys.path.insert(0, AI_MODULES_DIR)

from bias_detection.bias_checker import BiasChecker


class RiskService:
    """Risk calculation service for evaluating labor compliance risk scores with AI Fairness adjustments."""

    def __init__(self, db: Session):
        self.db = db
        self.bias_checker = BiasChecker()

    def calculate_company_risk(self, company_id: int) -> RiskScore:
        company = self.db.query(Company).filter(Company.id == company_id).first()
        if not company:
            raise NotFoundError("Company", company_id)

        compliance_records = self.db.query(ComplianceRecord).filter(
            ComplianceRecord.company_id == company_id
        ).all()
        violations = self.db.query(Violation).filter(
            Violation.company_id == company_id
        ).all()

        score = 10.0  # Baseline score
        reasons = []

        # Evaluate compliance records
        if not compliance_records:
            score += 30.0
            reasons.append("No compliance records registered or synchronized.")
        else:
            non_compliant = [r for r in compliance_records if r.status == "NON_COMPLIANT"]
            partial = [r for r in compliance_records if r.status == "PARTIAL"]
            
            if non_compliant:
                score += len(non_compliant) * 20.0
                reasons.append(f"{len(non_compliant)} non-compliant records detected (EPFO/ESIC/LIN).")
            if partial:
                score += len(partial) * 10.0
                reasons.append(f"{len(partial)} partially compliant records detected.")

        # Evaluate violations
        open_violations = [v for v in violations if v.status in ("OPEN", "UNDER_REVIEW", "ESCALATED")]
        if open_violations:
            for v in open_violations:
                if v.severity == "CRITICAL":
                    score += 35.0
                elif v.severity == "HIGH":
                    score += 25.0
                elif v.severity == "MEDIUM":
                    score += 15.0
                else:
                    score += 5.0
            reasons.append(f"{len(open_violations)} open/unresolved violations present.")

        # Evaluate company scale factor
        if company.employee_count > 500:
            score += 5.0
            reasons.append("Large scale establishment (>500 workers) increases risk exposure.")

        # Apply AI Bias Checker Adjustment
        bias_res = self.bias_checker.adjust_risk_score(
            company_id=str(company.id),
            region=company.state,
            industry=company.industry,
            business_size=company.company_size,
            risk_score=score
        )
        score = float(bias_res.get("adjusted_score", score))
        if bias_res.get("adjustment_applied"):
            reasons.append(f"AI Bias Correction: {bias_res.get('reason')}")

        # Cap score between 0.0 and 100.0
        score = min(100.0, max(0.0, score))

        if score < 25.0:
            risk_level = "LOW"
        elif score < 50.0:
            risk_level = "MEDIUM"
        elif score < 75.0:
            risk_level = "HIGH"
        else:
            risk_level = "CRITICAL"

        if not reasons:
            reasons.append("All checked compliance metrics are within healthy limits.")

        risk_entry = RiskScore(
            company_id=company_id,
            score=round(score, 2),
            risk_level=risk_level,
            reasons=json.dumps(reasons),
            calculated_at=datetime.now(timezone.utc),
            model_version="v2.1-ai-risk-scorecard"
        )
        self.db.add(risk_entry)
        self.db.commit()
        self.db.refresh(risk_entry)
        return risk_entry

    def get_latest_risk_score(self, company_id: int) -> RiskScore:
        company = self.db.query(Company).filter(Company.id == company_id).first()
        if not company:
            raise NotFoundError("Company", company_id)

        latest = self.db.query(RiskScore).filter(
            RiskScore.company_id == company_id
        ).order_by(RiskScore.calculated_at.desc()).first()

        if not latest:
            return self.calculate_company_risk(company_id)
        return latest
