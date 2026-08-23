"""
Encryption – Data encryption and security utilities
"""

import hashlib
import hmac
import base64
import secrets
from typing import Union, Optional

try:
    from cryptography.fernet import Fernet
    _KEY = Fernet.generate_key()
    _CIPHER = Fernet(_KEY)
    _HAS_CRYPTOGRAPHY = True
except ImportError:
    _KEY = secrets.token_bytes(32)
    _CIPHER = None
    _HAS_CRYPTOGRAPHY = False


def encrypt_data(data: str) -> str:
    """Encrypt data using Fernet (with base64 obfuscation fallback)"""
    if not data:
        return data
    if _HAS_CRYPTOGRAPHY and _CIPHER:
        encrypted = _CIPHER.encrypt(data.encode())
        return base64.urlsafe_b64encode(encrypted).decode()
    # Pure python fallback
    return base64.b64encode(data.encode()).decode()


def decrypt_data(encrypted_data: str) -> str:
    """Decrypt data using Fernet (with base64 fallback)"""
    if not encrypted_data:
        return encrypted_data
    if _HAS_CRYPTOGRAPHY and _CIPHER:
        encrypted_bytes = base64.urlsafe_b64decode(encrypted_data.encode())
        decrypted = _CIPHER.decrypt(encrypted_bytes)
        return decrypted.decode()
    # Pure python fallback
    return base64.b64decode(encrypted_data.encode()).decode()


def hash_data(data: str, algorithm: str = 'sha256') -> str:
    """Hash data using specified algorithm"""
    if algorithm == 'sha256':
        return hashlib.sha256(data.encode()).hexdigest()
    elif algorithm == 'sha512':
        return hashlib.sha512(data.encode()).hexdigest()
    elif algorithm == 'md5':
        return hashlib.md5(data.encode()).hexdigest()
    else:
        raise ValueError(f"Unsupported algorithm: {algorithm}")


def verify_hash(data: str, hashed: str, algorithm: str = 'sha256') -> bool:
    """Verify data against hash"""
    return hash_data(data, algorithm) == hashed


def generate_key() -> str:
    """Generate a random key"""
    return base64.urlsafe_b64encode(secrets.token_bytes(32)).decode()


def secure_random(length: int = 16) -> str:
    """Generate cryptographically secure random string"""
    return secrets.token_hex(length)


def hmac_sign(data: str, key: str) -> str:
    """Generate HMAC signature"""
    return hmac.new(key.encode(), data.encode(), hashlib.sha256).hexdigest()


def hmac_verify(data: str, signature: str, key: str) -> bool:
    """Verify HMAC signature"""
    return hmac.compare_digest(hmac_sign(data, key), signature)
