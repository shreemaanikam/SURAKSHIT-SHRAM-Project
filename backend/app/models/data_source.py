from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database.base import Base


class DataSource(Base):
    __tablename__ = "data_sources"

    id = Column(Integer, primary_key=True, index=True)
    source_name = Column(String(100), unique=True, index=True, nullable=False)  # EPFO, ESIC, LIN, STATE_LABOR
    source_type = Column(String(50), nullable=False)  # MOCK_CONNECTOR, GOVERNMENT_API, STATE_PORTAL
    status = Column(String(50), default="ACTIVE", nullable=False)  # ACTIVE, INACTIVE, ERROR
    last_sync = Column(DateTime, nullable=True)
    sync_status = Column(String(50), default="NEVER_RUN", nullable=False)  # SUCCESS, FAILED, IN_PROGRESS
    error_message = Column(Text, nullable=True)
