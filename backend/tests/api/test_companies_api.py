import pytest

def test_company_crud_flow(client, company_headers, admin_headers):
    # Create company via admin
    comp_payload = {
        "legal_name": "Test Garments Pvt Ltd",
        "registration_number": "REG-TEST-9999",
        "industry": "Textiles & Garments",
        "state": "Maharashtra",
        "district": "Pune",
        "address": "123 Industrial Area, Pune",
        "company_size": "MEDIUM",
        "employee_count": 150,
        "establishment_date": "2020-01-15"
    }
    create_res = client.post("/api/v1/companies", json=comp_payload, headers=admin_headers)
    assert create_res.status_code == 201
    comp_id = create_res.json()["id"]

    # Read company via admin
    get_res = client.get(f"/api/v1/companies/{comp_id}", headers=admin_headers)
    assert get_res.status_code == 200
    assert get_res.json()["legal_name"] == comp_payload["legal_name"]

    # Update company via admin
    update_res = client.put(f"/api/v1/companies/{comp_id}", json={"employee_count": 180}, headers=admin_headers)
    assert update_res.status_code == 200
    assert update_res.json()["employee_count"] == 180

    # Soft-delete company (Requires Admin role)
    del_res = client.delete(f"/api/v1/companies/{comp_id}", headers=admin_headers)
    assert del_res.status_code == 204

    # Verify soft-deleted company returns 404
    get_deleted = client.get(f"/api/v1/companies/{comp_id}", headers=admin_headers)
    assert get_deleted.status_code == 404


def test_tenant_data_isolation(client, test_company_a, test_company_b, company_headers, company_b_headers, admin_headers):
    # Company User A accessing Company A profile -> 200 OK
    res_a = client.get(f"/api/v1/companies/{test_company_a.id}", headers=company_headers)
    assert res_a.status_code == 200

    # Company User B attempting to access Company A profile -> 403 FORBIDDEN (Tenant Isolation Violation)
    res_b_access_a = client.get(f"/api/v1/companies/{test_company_a.id}", headers=company_b_headers)
    assert res_b_access_a.status_code == 403

    # Admin accessing Company A profile -> 200 OK (Cross-tenant authorized role)
    res_admin = client.get(f"/api/v1/companies/{test_company_a.id}", headers=admin_headers)
    assert res_admin.status_code == 200
