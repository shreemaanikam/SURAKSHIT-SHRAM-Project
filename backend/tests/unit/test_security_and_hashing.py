import pytest
from app.core.security import verify_password, get_password_hash, create_access_token, decode_access_token
from app.core.logging import SensitiveDataSanitizerFilter


def test_password_hashing():
    pw = "SuperSecurePassword2026!"
    hashed = get_password_hash(pw)
    assert hashed != pw
    assert verify_password(pw, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_creation_and_decoding():
    token = create_access_token(subject=42, role="ADMIN")
    assert isinstance(token, str)
    
    payload = decode_access_token(token)
    assert payload is not None
    assert payload["sub"] == "42"
    assert payload["role"] == "ADMIN"


def test_log_sanitization_privacy():
    raw_log = 'User logged in with password="MySecretPass123" token="eyJhbGciOi..." Aadhaar 2345 6789 0123 and PAN ABCDE1234F'
    sanitized = SensitiveDataSanitizerFilter.sanitize(raw_log)
    
    assert "MySecretPass123" not in sanitized
    assert "eyJhbGciOi" not in sanitized
    assert "2345 6789 0123" not in sanitized
    assert "ABCDE1234F" not in sanitized
    assert "[REDACTED]" in sanitized
