from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.base import Base


class ComplianceRecord(Base):
    __tablename__ = "compliance_records"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    compliance_type = Column(String(100), nullable=False)  # EPFO, ESIC, MINIMUM_WAGES, FACTORIES_ACT, CLRA
    status = Column(String(50), nullable=False)  # COMPLIANT, NON_COMPLIANT, PENDING_REVIEW, PARTIAL
    reporting_period = Column(String(50), nullable=False)  # e.g., "2026-Q1", "2026-03"
    source = Column(String(100), nullable=False)  # EPFO_MOCK, ESIC_MOCK, LIN_MOCK, MANUAL
    evidence_document_id = Column(Integer, ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    verified = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Database-level unique constraint preventing duplicate period entries per company
    __table_args__ = (
        UniqueConstraint("company_id", "compliance_type", "reporting_period", name="uq_company_compliance_period"),
    )

    # Relationships
    company = relationship("Company", back_populates="compliance_records")
    evidence_document = relationship("Document")
