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

    # 1. Trigger Sync for Company A across EPFO, ROC, and UDYAM
    sync_epfo = client.post(f"/api/v1/sync/EPFO?company_id={comp_id}", headers=admin_headers)
    assert sync_epfo.status_code == 200
    assert sync_epfo.json()["status"] == "SUCCESS"

    sync_roc = client.post(f"/api/v1/sync/ROC?company_id={comp_id}", headers=admin_headers)
    assert sync_roc.status_code == 200
    assert sync_roc.json()["status"] == "SUCCESS"

    sync_udyam = client.post(f"/api/v1/sync/UDYAM_MSME?company_id={comp_id}", headers=admin_headers)
    assert sync_udyam.status_code == 200
    assert sync_udyam.json()["status"] == "SUCCESS"

    # 2. Check Sync Status across all connectors
    status_res = client.get("/api/v1/sync/status", headers=company_headers)
    assert status_res.status_code == 200
    assert status_res.json()["total_sources"] >= 6

    # 3. Fetch Government Data View for ROC and UDYAM
    roc_gov = client.get(f"/api/v1/government-data/{comp_id}?source=ROC", headers=company_headers)
    assert roc_gov.status_code == 200
    roc_data = roc_gov.json()
    assert roc_data["source"] == "ROC"
    assert roc_data["company_record"]["cin"] is not None

    udyam_gov = client.get(f"/api/v1/government-data/{comp_id}?source=UDYAM_MSME", headers=company_headers)
    assert udyam_gov.status_code == 200
    udyam_data = udyam_gov.json()
    assert udyam_data["source"] == "UDYAM_MSME"
    assert udyam_data["company_record"]["udyam_registration_number"] is not None

    # 4. Tenant B attempting to access Company A government data -> 403 Forbidden
    gov_b_cross = client.get(f"/api/v1/government-data/{comp_id}?source=ROC", headers=company_b_headers)
    assert gov_b_cross.status_code == 403
