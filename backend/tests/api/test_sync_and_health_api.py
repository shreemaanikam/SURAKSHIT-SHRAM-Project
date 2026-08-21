import pytest

def test_health_check_endpoint(client):
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ("HEALTHY", "DEGRADED")
    assert "version" in data
    assert "database" in data
    assert "cache" in data


def test_government_sync_and_data_api(client, admin_headers, company_headers):
    # 1. Create company first
    comp_res = client.post("/api/v1/companies", json={
        "legal_name": "Test Sync Enterprise Ltd",
        "registration_number": "REG-TEST-7777",
        "industry": "IT Services",
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "address": "100 MG Road, Bengaluru",
        "company_size": "MEDIUM",
        "employee_count": 200,
        "establishment_date": "2021-03-10"
    }, headers=company_headers)
    comp_id = comp_res.json()["id"]

    # 2. Trigger Sync
    sync_res = client.post("/api/v1/sync/EPFO", headers=admin_headers)
    assert sync_res.status_code == 200
    assert sync_res.json()["status"] == "SUCCESS"

    # 3. Check Sync Status
    status_res = client.get("/api/v1/sync/status", headers=company_headers)
    assert status_res.status_code == 200
    assert status_res.json()["total_sources"] >= 4

    # 4. Fetch Government Data View
    gov_res = client.get(f"/api/v1/government-data/{comp_id}?source=EPFO", headers=company_headers)
    assert gov_res.status_code == 200
    data = gov_res.json()
    assert data["source"] == "EPFO"
    assert data["worker_summary"]["total_employees_covered"] > 0
