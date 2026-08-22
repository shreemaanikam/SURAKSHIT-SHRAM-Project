import pytest
import io

def test_compliance_and_document_workflow(client, test_company_a, test_company_b, company_headers, company_b_headers, inspector_headers, admin_headers):
    comp_id = test_company_a.id

    # 1. Compliance Record Creation
    comp_record_res = client.post(f"/api/v1/companies/{comp_id}/compliance", json={
        "compliance_type": "EPFO",
        "status": "COMPLIANT",
        "reporting_period": "2026-Q1",
        "source": "MANUAL",
        "verified": True
    }, headers=company_headers)
    assert comp_record_res.status_code == 201

    # Duplicate compliance creation for same period -> 409 Conflict
    dup_res = client.post(f"/api/v1/companies/{comp_id}/compliance", json={
        "compliance_type": "EPFO",
        "status": "COMPLIANT",
        "reporting_period": "2026-Q1",
        "source": "MANUAL",
        "verified": True
    }, headers=company_headers)
    assert dup_res.status_code == 409

    # Tenant B attempting to read Company A compliance -> 403 Forbidden
    comp_b_cross = client.get(f"/api/v1/companies/{comp_id}/compliance", headers=company_b_headers)
    assert comp_b_cross.status_code == 403

    # 2. Document Upload
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

    # Tenant B attempting to read Company A document -> 403 Forbidden
    doc_b_cross = client.get(f"/api/v1/documents/{doc_data['id']}", headers=company_b_headers)
    assert doc_b_cross.status_code == 403

    # 3. Schedule Inspection (Inspector role)
    insp_res = client.post("/api/v1/inspections", json={
        "company_id": comp_id,
        "inspection_date": "2026-09-01T10:00:00Z",
        "status": "SCHEDULED",
        "findings": "Initial routine inspection."
    }, headers=inspector_headers)
    assert insp_res.status_code == 201
    insp_id = insp_res.json()["id"]

    # 4. Log Violation & Issue Improvement Notice
    viol_res = client.post(f"/api/v1/companies/{comp_id}/violations", json={
        "violation_type": "MINIMUM_WAGES_SHORTFALL",
        "severity": "HIGH",
        "description": "Shortfall of wage payment detected for 12 contract workers.",
        "status": "OPEN"
    }, headers=inspector_headers)
    assert viol_res.status_code == 201
    viol_id = viol_res.json()["id"]

    # Cross-company violation mismatch test: Trying to issue improvement notice for Company B using Company A's violation -> 400 Bad Request
    mismatch_notice = client.post(f"/api/v1/companies/{test_company_b.id}/improvement-notices", json={
        "violation_id": viol_id,
        "deadline": "2026-09-30T17:00:00Z",
        "status": "ISSUED"
    }, headers=inspector_headers)
    assert mismatch_notice.status_code == 400

    # Valid Improvement Notice for Company A -> 201 Created
    notice_res = client.post(f"/api/v1/companies/{comp_id}/improvement-notices", json={
        "violation_id": viol_id,
        "deadline": "2026-09-30T17:00:00Z",
        "status": "ISSUED"
    }, headers=inspector_headers)
    assert notice_res.status_code == 201

    # 5. Calculate Risk Score & Tenant Isolation Check
    risk_res = client.post(f"/api/v1/companies/{comp_id}/risk", headers=company_headers)
    assert risk_res.status_code == 201

    risk_cross_b = client.get(f"/api/v1/companies/{comp_id}/risk", headers=company_b_headers)
    assert risk_cross_b.status_code == 403
