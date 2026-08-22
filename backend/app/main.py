from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.exceptions import BaseAppException, app_exception_handler, generic_exception_handler
from app.database.connection import init_db
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.rate_limit import PrototypeRateLimitMiddleware

from app.api.auth import router as auth_router
from app.api.companies import router as companies_router
from app.api.compliance import router as compliance_router
from app.api.documents import router as documents_router
from app.api.inspections import router as inspections_router
from app.api.risk import router as risk_router
from app.api.government_data import router as gov_router
from app.api.health import router as health_router
from app.api.ai import router as ai_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables on startup
    init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
    description="""
# SURAKSHIT SHRAM — Labor Compliance Platform API

Backend & Data Integration Layer managing:
* **Company Profiles** & Multi-Tenant Labor Registration
* **Compliance Records** (EPFO, ESIC, LIN, State Laws)
* **Document Verification** & Metadata Hashing (SHA-256)
* **Inspection Workflow**, Violations & Improvement Notices
* **Risk Engine Integrations**
* **Government Data Connectors** (EPFO, ESIC, LIN, State Mock Interfaces)
* **Data Normalization & Resilient Idempotent Sync Pipeline**
* **Privacy Controls & Audit Logging**
* **AI Gateway Interfaces** (OCR, State-Adaptive Rule Engine, SHAP Explainable Risk)
"""
)

# CORS Configuration handling explicit origins without credential conflicts
origins = [str(origin) for origin in settings.BACKEND_CORS_ORIGINS]
has_wildcard = "*" in origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=not has_wildcard,  # Disable allow_credentials if wildcard '*' is configured
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Middleware stack
app.add_middleware(RequestIDMiddleware)
app.add_middleware(PrototypeRateLimitMiddleware, max_requests=120, window_seconds=60)

# Exception Handlers
app.add_exception_handler(BaseAppException, app_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Include API Routers under API_V1_STR (/api/v1)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(companies_router, prefix=settings.API_V1_STR)
app.include_router(compliance_router, prefix=settings.API_V1_STR)
app.include_router(documents_router, prefix=settings.API_V1_STR)
app.include_router(inspections_router, prefix=settings.API_V1_STR)
app.include_router(risk_router, prefix=settings.API_V1_STR)
app.include_router(gov_router, prefix=settings.API_V1_STR)
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)


@app.get("/", include_in_schema=False)
def root():
    return {
        "message": "Welcome to SURAKSHIT SHRAM Backend API Gateway",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }
