from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base


class ImprovementNotice(Base):
    __tablename__ = "improvement_notices"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    violation_id = Column(Integer, ForeignKey("violations.id", ondelete="CASCADE"), nullable=False, index=True)
    notice_date = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    deadline = Column(DateTime, nullable=False)
    status = Column(String(50), default="ISSUED", nullable=False)  # ISSUED, COMPLIED, OVERDUE, APPEALED
    response_reference = Column(String(255), nullable=True)
    escalation_status = Column(String(50), default="NONE", nullable=False)  # NONE, WARNING_SENT, ESCALATED_TO_MAGISTRATE

    # Relationships
    company = relationship("Company", back_populates="improvement_notices")
    violation = relationship("Violation", back_populates="improvement_notices")
