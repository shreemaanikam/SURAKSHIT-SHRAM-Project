from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.security import decode_access_token
from app.core.exceptions import AuthenticationError, PermissionDeniedError
from app.database.connection import get_db
from app.models.user import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Extract and validate JWT token from Bearer header and fetch active user."""
    payload = decode_access_token(token)
    if not payload:
        raise AuthenticationError("Invalid or expired JWT token")

    user_id = payload.get("sub")
    if not user_id:
        raise AuthenticationError("Malformed token payload")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise AuthenticationError("User associated with token not found")

    if not user.is_active:
        raise PermissionDeniedError("User account is deactivated")

    return user


def verify_company_access(company_id: int, current_user: User) -> None:
    """
    Enforce multi-tenant data isolation.
    ADMIN, INSPECTOR, and GOVERNMENT roles have multi-company access privileges.
    COMPANY role users are strictly restricted to their assigned company_id.
    """
    if current_user.role == UserRole.COMPANY:
        if current_user.company_id is None or current_user.company_id != company_id:
            raise PermissionDeniedError(
                f"Tenant Isolation Violation: Company user (ID: {current_user.id}) is not authorized to access Company ID {company_id}."
            )


def require_roles(allowed_roles: List[UserRole]):
    """Factory dependency for role-based authorization checking."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles and current_user.role != UserRole.ADMIN:
            raise PermissionDeniedError(
                f"Role '{current_user.role.value}' is not authorized to access this resource. Allowed: {[r.value for r in allowed_roles]}"
            )
        return current_user
    return role_checker


# Specific convenience authorization dependencies
require_company_user = require_roles([UserRole.COMPANY, UserRole.ADMIN])
require_inspector = require_roles([UserRole.INSPECTOR, UserRole.ADMIN])
require_government_user = require_roles([UserRole.GOVERNMENT, UserRole.ADMIN])
require_admin = require_roles([UserRole.ADMIN])
