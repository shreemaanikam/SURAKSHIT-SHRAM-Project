import pytest
import sys
import os

AI_MODULES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "AI_Modules"))
if AI_MODULES_DIR not in sys.path:
    sys.path.insert(0, AI_MODULES_DIR)

from rule_engine.central_rules import CentralRules
from rule_engine.state_adaptive_rules import StateAdaptiveRules
from rule_engine.compliance_checker import ComplianceChecker
from risk_scorecard.risk_scorecard import RiskScorecard
from risk_scorecard.explainable_ai import ExplainableAI
from fraud_detection.fraud_detector import FraudDetector
from fraud_detection.epfo_comparator import EPFOComparator
from bias_detection.bias_checker import BiasChecker


def test_central_rules_initialization():
    cr = CentralRules()
    assert "wages" in cr.rules
    assert "social_security" in cr.rules
    assert cr.rules["wages"]["minimum_wage_central"] == 176


def test_state_adaptive_rules():
    sr = StateAdaptiveRules()
    assert "Maharashtra" in sr.state_rules
    assert "Delhi" in sr.state_rules
    assert sr.state_rules["Maharashtra"]["minimum_wage"]["daily"] == 220


def test_fraud_detector():
    fd = FraudDetector()
    res = fd.analyze_document("Salary slip March 2026. Employee John Doe. Basic Salary ₹25,000. PF ₹3,000.")
    assert "is_fraud" in res
    assert "confidence" in res
    assert "reasons" in res


def test_bias_checker_adjustment():
    bc = BiasChecker()
    res = bc.adjust_risk_score(
        company_id="101",
        region="Delhi",
        industry="Manufacturing",
        business_size="Small",
        risk_score=45.0
    )
    assert "adjusted_score" in res
    assert "adjustment_applied" in res
