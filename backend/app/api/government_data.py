from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.middleware.auth import get_current_user, require_admin, verify_company_access
from app.models.user import User
from app.schemas.sync import (
    SyncTriggerResponse, SyncStatusResponse, GovernmentDataResponse, DataSourceResponse
)
from app.services.sync_service import SynchronizationService, CONNECTORS
from app.services.audit_service import AuditService

router = APIRouter(tags=["Government Data & Synchronization Services"])


@router.post(
    "/sync/{source}",
    response_model=SyncTriggerResponse,
    summary="Trigger government data synchronization",
    description="Idempotent sync for EPFO, ESIC, LIN, STATE_LABOR, or ALL sources. Requires ADMIN role."
)
def trigger_sync(
    source: str,
    company_id: Optional[int] = Query(None, description="Optional target company ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    service = SynchronizationService(db)
    source_upper = source.upper()

    if source_upper == "ALL":
        total_synced = 0
        last_res = None
        for src in CONNECTORS.keys():
            res = service.sync_source(src, company_id=company_id)
            total_synced += res["records_synced"]
            last_res = res
        
        AuditService.log_action(
            db=db,
            action="SYNC_TRIGGER_ALL",
            resource_type="DataSource",
            resource_id="ALL",
            user_id=current_user.id
        )
        return SyncTriggerResponse(
            source="ALL",
            status="SUCCESS",
            message=f"Synchronized all government sources ({total_synced} total records)",
            records_synced=total_synced,
            timestamp=last_res["timestamp"]
        )

    res = service.sync_source(source_upper, company_id=company_id)

    AuditService.log_action(
        db=db,
        action=f"SYNC_TRIGGER_{source_upper}",
        resource_type="DataSource",
        resource_id=source_upper,
        user_id=current_user.id
    )

    return SyncTriggerResponse(
        source=res["source"],
        status=res["status"],
        message=res["message"],
        records_synced=res["records_synced"],
        timestamp=res["timestamp"]
    )


@router.get(
    "/sync/status",
    response_model=SyncStatusResponse,
    summary="Get sync status across all government connectors"
)
def get_sync_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = SynchronizationService(db)
    sources = service.get_sync_status()
    active_count = sum(1 for s in sources if s.status == "ACTIVE")
    
    return SyncStatusResponse(
        sources=[DataSourceResponse.model_validate(s) for s in sources],
        total_sources=len(sources),
        active_sources=active_count
    )


@router.get(
    "/government-data/{company_id}",
    response_model=GovernmentDataResponse,
    summary="Get normalized government compliance records for a company",
    description="Fetches raw payload via mock connector, runs normalizer, and returns normalized schema."
)
def get_company_government_data(
    company_id: int,
    source: str = Query("EPFO", description="Source connector (EPFO, ESIC, LIN, STATE_LABOR)"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_company_access(company_id, current_user)
    service = SynchronizationService(db)
    return service.get_government_data(company_id=company_id, source_name=source)
