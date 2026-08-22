import pytest

def test_user_registration_and_login(client):
    reg_payload = {
        "email": "newcompany@test.synth",
        "username": "newcompany_user",
        "password": "Password123!"
    }
    response = client.post("/api/v1/auth/register", json=reg_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == reg_payload["email"]
    assert data["username"] == reg_payload["username"]
    # Public registration MUST force role to COMPANY
    assert data["role"] == "COMPANY"

    # Login
    login_payload = {
        "username_or_email": "newcompany_user",
        "password": "Password123!"
    }
    login_res = client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    token_data = login_res.json()
    assert "access_token" in token_data
    assert token_data["role"] == "COMPANY"

    # Fetch Me
    headers = {"Authorization": f"Bearer {token_data['access_token']}"}
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["username"] == "newcompany_user"


def test_admin_user_provisioning(client, admin_headers, company_headers):
    # Non-admin trying to provision inspector should be forbidden (403)
    forbidden_res = client.post("/api/v1/auth/admin/users", json={
        "email": "hacked_inspector@test.synth",
        "username": "hacked_inspector",
        "password": "Password123!",
        "role": "INSPECTOR"
    }, headers=company_headers)
    assert forbidden_res.status_code == 403

    # Admin provisioning inspector should succeed (201)
    admin_res = client.post("/api/v1/auth/admin/users", json={
        "email": "valid_inspector@test.synth",
        "username": "valid_inspector",
        "password": "Password123!",
        "role": "INSPECTOR"
    }, headers=admin_headers)
    assert admin_res.status_code == 201
    assert admin_res.json()["role"] == "INSPECTOR"


def test_unauthorized_access(client):
    res = client.get("/api/v1/auth/me")
    assert res.status_code == 401
