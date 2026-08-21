from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base


class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    inspector_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    inspection_date = Column(DateTime, nullable=False)
    status = Column(String(50), default="SCHEDULED", nullable=False)  # SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
    findings = Column(Text, nullable=True)
    report_reference = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    company = relationship("Company", back_populates="inspections")
    inspector = relationship("User")
