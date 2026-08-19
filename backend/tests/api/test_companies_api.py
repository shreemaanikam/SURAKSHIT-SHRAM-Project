import pytest

def test_company_crud_flow(client, company_headers, admin_headers):
    # Create company
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
    create_res = client.post("/api/v1/companies", json=comp_payload, headers=company_headers)
    assert create_res.status_code == 201
    comp_id = create_res.json()["id"]

    # Read company
    get_res = client.get(f"/api/v1/companies/{comp_id}", headers=company_headers)
    assert get_res.status_code == 200
    assert get_res.json()["legal_name"] == comp_payload["legal_name"]

    # List companies with pagination and filtering
    list_res = client.get("/api/v1/companies?industry=Textiles&page=1&size=10", headers=company_headers)
    assert list_res.status_code == 200
    assert list_res.json()["total"] >= 1

    # Update company
    update_res = client.put(f"/api/v1/companies/{comp_id}", json={"employee_count": 180}, headers=company_headers)
    assert update_res.status_code == 200
    assert update_res.json()["employee_count"] == 180

    # Delete company (Requires Admin role)
    del_res = client.delete(f"/api/v1/companies/{comp_id}", headers=admin_headers)
    assert del_res.status_code == 204
