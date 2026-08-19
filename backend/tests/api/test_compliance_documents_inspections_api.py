import pytest
import io

def test_compliance_and_document_workflow(client, company_headers, inspector_headers, admin_headers):
    # 1. Create company for test
    comp_res = client.post("/api/v1/companies", json={
        "legal_name": "Test Auto Components Ltd",
        "registration_number": "REG-TEST-8888",
        "industry": "Automotive Manufacturing",
        "state": "Haryana",
        "district": "Gurugram",
        "address": "45 Cyber City, Gurugram",
        "company_size": "LARGE",
        "employee_count": 320,
        "establishment_date": "2019-06-01"
    }, headers=company_headers)
    comp_id = comp_res.json()["id"]

    # 2. Compliance Record Creation
    comp_record_res = client.post(f"/api/v1/companies/{comp_id}/compliance", json={
        "compliance_type": "EPFO",
        "status": "COMPLIANT",
        "reporting_period": "2026-Q1",
        "source": "MANUAL",
        "verified": True
    }, headers=company_headers)
    assert comp_record_res.status_code == 201

    # 3. Document Upload
    file_content = b"%PDF-1.4 Mock PDF Content for ECR Challan verification..."
    file_obj = io.BytesIO(file_content)
    doc_res = client.post(
        "/api/v1/documents",
        data={"company_id": comp_id, "document_type": "ECR_CHALLAN"},
        files={"file": ("ecr_challan_2026.pdf", file_obj, "application/pdf")},
        headers=company_headers
    )
    assert doc_res.status_code == 201
    doc_data = doc_res.json()
    assert doc_data["document_hash"] is not None
    assert doc_data["verification_status"] == "VERIFIED"

    # 4. Schedule Inspection (Inspector role)
    insp_res = client.post("/api/v1/inspections", json={
        "company_id": comp_id,
        "inspection_date": "2026-09-01T10:00:00Z",
        "status": "SCHEDULED",
        "findings": "Initial routine inspection."
    }, headers=inspector_headers)
    assert insp_res.status_code == 201
    insp_id = insp_res.json()["id"]

    # 5. Log Violation & Issue Improvement Notice
    viol_res = client.post(f"/api/v1/companies/{comp_id}/violations", json={
        "violation_type": "MINIMUM_WAGES_SHORTFALL",
        "severity": "HIGH",
        "description": "Shortfall of wage payment detected for 12 contract workers.",
        "status": "OPEN"
    }, headers=inspector_headers)
    assert viol_res.status_code == 201
    viol_id = viol_res.json()["id"]

    notice_res = client.post(f"/api/v1/companies/{comp_id}/improvement-notices", json={
        "violation_id": viol_id,
        "deadline": "2026-09-30T17:00:00Z",
        "status": "ISSUED"
    }, headers=inspector_headers)
    assert notice_res.status_code == 201

    # 6. Calculate Risk Score
    risk_res = client.post(f"/api/v1/companies/{comp_id}/risk", headers=company_headers)
    assert risk_res.status_code == 201
    assert risk_res.json()["risk_level"] in ("LOW", "MEDIUM", "HIGH", "CRITICAL")
