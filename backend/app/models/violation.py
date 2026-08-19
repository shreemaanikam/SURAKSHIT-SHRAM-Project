from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base


class Violation(Base):
    __tablename__ = "violations"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    violation_type = Column(String(100), nullable=False)
    severity = Column(String(50), nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    description = Column(Text, nullable=False)
    evidence_reference = Column(String(255), nullable=True)
    status = Column(String(50), default="OPEN", nullable=False)  # OPEN, UNDER_REVIEW, RESOLVED, ESCALATED

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    company = relationship("Company", back_populates="violations")
    improvement_notices = relationship("ImprovementNotice", back_populates="violation", cascade="all, delete-orphan")
