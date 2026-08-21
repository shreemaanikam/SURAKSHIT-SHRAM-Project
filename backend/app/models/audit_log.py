from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from app.database.base import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    action = Column(String(100), nullable=False)  # CREATE, READ, UPDATE, DELETE, LOGIN, SYNC
    resource_type = Column(String(100), nullable=False)  # User, Company, Document, Inspection, etc.
    resource_id = Column(String(100), nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    request_id = Column(String(100), nullable=True)
    metadata_json = Column(Text, nullable=True)
