import pytest

def test_ai_document_analysis(client, company_headers):
    payload = {
        "document_type": "ECR_CHALLAN"
    }
    res = client.post("/api/v1/ai/document-analysis", json=payload, headers=company_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["document_type"] == "ECR_CHALLAN"
    assert data["confidence_score"] >= 0.90
    assert "ocr_extracted_text" in data
    assert data["fraud_risk_level"] == "LOW"


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
