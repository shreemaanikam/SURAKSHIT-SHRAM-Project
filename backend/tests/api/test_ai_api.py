import pytest

def test_ai_document_analysis(client, company_headers):
    payload = {
        "document_type": "ECR_CHALLAN"
    }
    res = client.post("/api/v1/ai/document-analysis", json=payload, headers=company_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["document_type"] == "ECR_CHALLAN"
    assert data["confidence_score"] >= 0.80
    assert "ocr_extracted_text" in data
    assert data["fraud_risk_level"] in ("LOW", "MEDIUM", "HIGH", "CRITICAL")


def test_ai_compliance_analysis(client, test_company_a, test_company_b, company_headers, company_b_headers):
    comp_id = test_company_a.id

    # Authorized company user A request
    payload = {
        "company_id": comp_id,
        "state_code": "DL",
        "reporting_period": "2026-Q1"
    }
    res = client.post("/api/v1/ai/compliance-analysis", json=payload, headers=company_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["company_id"] == comp_id
    assert data["state_code"] == "DL"
    assert len(data["rule_evaluations"]) > 0

    # Tenant B attempting cross-company AI evaluation -> 403 Forbidden
    cross_res = client.post("/api/v1/ai/compliance-analysis", json=payload, headers=company_b_headers)
    assert cross_res.status_code == 403


def test_state_adaptive_rules_execution(client, test_company_a, company_headers):
    comp_id = test_company_a.id

    # Evaluate Delhi (DL)
    res_dl = client.post("/api/v1/ai/compliance-analysis", json={"company_id": comp_id, "state_code": "DL"}, headers=company_headers)
    assert res_dl.status_code == 200
    data_dl = res_dl.json()
    assert data_dl["state_code"] == "DL"

    # Evaluate Maharashtra (MH)
    res_mh = client.post("/api/v1/ai/compliance-analysis", json={"company_id": comp_id, "state_code": "MH"}, headers=company_headers)
    assert res_mh.status_code == 200
    data_mh = res_mh.json()
    assert data_mh["state_code"] == "MH"

    # Evaluate Tamil Nadu (TN)
    res_tn = client.post("/api/v1/ai/compliance-analysis", json={"company_id": comp_id, "state_code": "TN"}, headers=company_headers)
    assert res_tn.status_code == 200
    data_tn = res_tn.json()
    assert data_tn["state_code"] == "TN"

    # Prove dynamic evaluation adapts rules per state definition
    dl_rules = [r["rule_id"] for r in data_dl["rule_evaluations"]]
    mh_rules = [r["rule_id"] for r in data_mh["rule_evaluations"]]
    tn_rules = [r["rule_id"] for r in data_tn["rule_evaluations"]]

    assert "RULE-DL-MINWAGE" in dl_rules
    assert "RULE-MH-MINWAGE" in mh_rules
    assert "RULE-TN-MINWAGE" in tn_rules



def test_ai_risk_analysis(client, test_company_a, test_company_b, company_headers, company_b_headers):
    comp_id = test_company_a.id

    payload = {
        "company_id": comp_id
    }
    res = client.post("/api/v1/ai/risk-analysis", json=payload, headers=company_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["company_id"] == comp_id
    assert "adjusted_risk_score" in data
    assert "risk_level" in data

    # Tenant B cross-company access -> 403
    cross_res = client.post("/api/v1/ai/risk-analysis", json=payload, headers=company_b_headers)
    assert cross_res.status_code == 403


def test_ai_risk_explanation(client, test_company_a, test_company_b, company_headers, company_b_headers):
    comp_id = test_company_a.id

    payload = {
        "company_id": comp_id
    }
    res = client.post("/api/v1/ai/risk-explanation", json=payload, headers=company_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["company_id"] == comp_id
    assert "shap_explainability_factors" in data
    assert len(data["shap_explainability_factors"]) > 0

    # Tenant B attempting cross-company AI risk explanation -> 403 Forbidden
    cross_res = client.post("/api/v1/ai/risk-explanation", json=payload, headers=company_b_headers)
    assert cross_res.status_code == 403


def test_ai_fraud_analysis(client, test_company_a, test_company_b, company_headers, company_b_headers):
    comp_id = test_company_a.id

    payload = {
        "company_id": comp_id,
        "document_text": "Salary sheet March 2026. Employee John. Basic Salary ₹18000."
    }
    res = client.post("/api/v1/ai/fraud-analysis", json=payload, headers=company_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["company_id"] == comp_id
    assert "is_fraud" in data
    assert "confidence_score" in data

    # Tenant B cross-company access -> 403
    cross_res = client.post("/api/v1/ai/fraud-analysis", json=payload, headers=company_b_headers)
    assert cross_res.status_code == 403
