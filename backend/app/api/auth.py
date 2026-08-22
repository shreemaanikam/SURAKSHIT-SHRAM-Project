from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.exceptions import AuthenticationError, DuplicateEntityError
from app.database.connection import get_db
from app.middleware.auth import get_current_user, require_admin
from app.models.user import User, UserRole
from app.schemas.auth import UserRegister, AdminUserCreate, UserLogin, UserResponse, Token
from app.services.audit_service import AuditService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new company user account",
    description="Public registration for company representatives. Role is strictly assigned to COMPANY."
)
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        (User.email == payload.email) | (User.username == payload.username)
    ).first()
    if existing:
        raise DuplicateEntityError("Username or Email already registered.")

    hashed_pw = get_password_hash(payload.password)
    new_user = User(
        email=payload.email,
        username=payload.username,
        password_hash=hashed_pw,
        role=UserRole.COMPANY
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    AuditService.log_action(
        db=db,
        action="USER_REGISTER",
        resource_type="User",
        resource_id=str(new_user.id),
        user_id=new_user.id
    )

    return new_user


@router.post(
    "/login",
    response_model=Token,
    summary="Authenticate user and issue JWT access token",
    description="Supports authentication via username or email."
)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.username == payload.username_or_email) | (User.email == payload.username_or_email)
    ).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise AuthenticationError("Invalid username/email or password.")

    if not user.is_active:
        raise AuthenticationError("User account is inactive.")

    token = create_access_token(subject=user.id, role=user.role.value)

    AuditService.log_action(
        db=db,
        action="USER_LOGIN",
        resource_type="User",
        resource_id=str(user.id),
        user_id=user.id
    )

    return Token(
        access_token=token,
        token_type="bearer",
        role=user.role.value,
        user_id=user.id,
        company_id=user.company_id
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current logged-in user profile"
)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post(
    "/admin/users",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Provision a new user account with specific role (Admin Only)",
    description="Admin endpoint for creating INSPECTOR, GOVERNMENT, ADMIN, or COMPANY users."
)
def admin_create_user(
    payload: AdminUserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    existing = db.query(User).filter(
        (User.email == payload.email) | (User.username == payload.username)
    ).first()
    if existing:
        raise DuplicateEntityError("Username or Email already registered.")

    hashed_pw = get_password_hash(payload.password)
    new_user = User(
        email=payload.email,
        username=payload.username,
        password_hash=hashed_pw,
        role=payload.role,
        company_id=payload.company_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    AuditService.log_action(
        db=db,
        action="ADMIN_USER_CREATE",
        resource_type="User",
        resource_id=str(new_user.id),
        user_id=current_user.id,
        metadata={"assigned_role": payload.role.value, "assigned_company_id": payload.company_id}
    )

    return new_user
