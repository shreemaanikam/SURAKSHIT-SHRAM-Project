import json
from datetime import datetime, timezone
from typing import Any, Optional
from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog
from app.core.logging import logger
from app.middleware.request_id import request_id_ctx


class AuditService:
    """Service to create audit logs for security and data modifications."""

    @staticmethod
    def log_action(
        db: Session,
        action: str,
        resource_type: str,
        resource_id: Optional[str] = None,
        user_id: Optional[int] = None,
        request_id: Optional[str] = None,
        metadata: Optional[dict] = None
    ) -> AuditLog:
        req_id = request_id or request_id_ctx.get()
        metadata_str = json.dumps(metadata) if metadata else None
        
        log_entry = AuditLog(
            user_id=user_id,
            action=action,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id else None,
            timestamp=datetime.now(timezone.utc),
            request_id=req_id,
            metadata_json=metadata_str
        )
        db.add(log_entry)
        db.commit()
        logger.info(f"AUDIT LOG: [{action}] [{resource_type}:{resource_id}] User:{user_id} ReqID:{req_id}")
        return log_entry
