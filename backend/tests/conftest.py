import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend root directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.database.base import Base
from app.database.connection import get_db
from app.core.security import get_password_hash, create_access_token
from app.models.user import User, UserRole

# Use temporary SQLite DB for pytest isolated execution
TEST_DATABASE_URL = "sqlite:///./test_surakshit_shram.db"

engine = create_engine(
    TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_surakshit_shram.db"):
        try:
            os.remove("./test_surakshit_shram.db")
        except PermissionError:
            pass


@pytest.fixture
def db():
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db):
    def _override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_admin_user(db):
    user = User(
        email="testadmin@surakshit.gov.in",
        username="testadmin",
        password_hash=get_password_hash("AdminPass123!"),
        role=UserRole.ADMIN,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def admin_headers(test_admin_user):
    token = create_access_token(subject=test_admin_user.id, role=test_admin_user.role.value)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def test_company_user(db):
    user = User(
        email="testcompany@bharat.synth",
        username="testcompany",
        password_hash=get_password_hash("CompanyPass123!"),
        role=UserRole.COMPANY,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def company_headers(test_company_user):
    token = create_access_token(subject=test_company_user.id, role=test_company_user.role.value)
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def test_inspector_user(db):
    user = User(
        email="testinspector@labour.gov.in",
        username="testinspector",
        password_hash=get_password_hash("InspectorPass123!"),
        role=UserRole.INSPECTOR,
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture
def inspector_headers(test_inspector_user):
    token = create_access_token(subject=test_inspector_user.id, role=test_inspector_user.role.value)
    return {"Authorization": f"Bearer {token}"}
