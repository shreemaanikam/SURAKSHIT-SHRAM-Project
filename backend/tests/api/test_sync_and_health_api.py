import pytest

def test_health_check_endpoint(client):
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ("HEALTHY", "DEGRADED")
    assert "version" in data
    assert "database" in data
    assert "cache" in data


def test_government_sync_and_data_api(client, test_company_a, test_company_b, admin_headers, company_headers, company_b_headers):
    comp_id = test_company_a.id

    # 1. Trigger Sync for Company A
    sync_res = client.post(f"/api/v1/sync/EPFO?company_id={comp_id}", headers=admin_headers)
    assert sync_res.status_code == 200
    assert sync_res.json()["status"] == "SUCCESS"

    # 2. Check Sync Status
    status_res = client.get("/api/v1/sync/status", headers=company_headers)
    assert status_res.status_code == 200
    assert status_res.json()["total_sources"] >= 4

    # 3. Fetch Government Data View (Company A user accessing Company A -> 200 OK)
    gov_res = client.get(f"/api/v1/government-data/{comp_id}?source=EPFO", headers=company_headers)
    assert gov_res.status_code == 200
    data = gov_res.json()
    assert data["source"] == "EPFO"
    assert data["worker_summary"]["total_employees_covered"] > 0

    # 4. Tenant B attempting to access Company A government data -> 403 Forbidden
    gov_b_cross = client.get(f"/api/v1/government-data/{comp_id}?source=EPFO", headers=company_b_headers)
    assert gov_b_cross.status_code == 403
