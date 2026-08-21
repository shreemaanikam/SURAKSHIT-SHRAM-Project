from datetime import datetime, date, timezone
from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.orm import relationship
from app.database.base import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    legal_name = Column(String(255), index=True, nullable=False)
    registration_number = Column(String(100), unique=True, index=True, nullable=False)
    industry = Column(String(100), index=True, nullable=False)
    state = Column(String(100), index=True, nullable=False)
    district = Column(String(100), nullable=False)
    address = Column(String(500), nullable=False)
    company_size = Column(String(50), nullable=False)  # MICRO, SMALL, MEDIUM, LARGE
    employee_count = Column(Integer, nullable=False, default=0)
    establishment_date = Column(Date, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    compliance_records = relationship("ComplianceRecord", back_populates="company", cascade="all, delete-orphan")
    documents = relationship("Document", back_populates="company", cascade="all, delete-orphan")
    inspections = relationship("Inspection", back_populates="company", cascade="all, delete-orphan")
    violations = relationship("Violation", back_populates="company", cascade="all, delete-orphan")
    risk_scores = relationship("RiskScore", back_populates="company", cascade="all, delete-orphan")
    improvement_notices = relationship("ImprovementNotice", back_populates="company", cascade="all, delete-orphan")
