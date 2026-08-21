from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.config import settings
from app.database.connection import get_db
from app.services.cache_service import cache_service

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    summary="Application Health Check Endpoint",
    description="Returns operational status of API application, database connectivity, and Redis cache."
)
def health_check(db: Session = Depends(get_db)):
    # Check Database connection
    db_status = "HEALTHY"
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        db_status = "UNHEALTHY"

    # Check Cache connection
    cache_info = cache_service.get_status()

    overall_status = "HEALTHY" if db_status == "HEALTHY" else "DEGRADED"

    return {
        "status": overall_status,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database": {
            "status": db_status
        },
        "cache": cache_info
    }
