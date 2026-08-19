from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    document_type = Column(String(100), nullable=False)  # ECR_CHALLAN, ESI_RETURN, WAGE_REGISTER, INSPECTION_REPORT
    filename = Column(String(255), nullable=False)
    storage_reference = Column(String(500), nullable=False)
    document_hash = Column(String(64), nullable=False)  # SHA-256 hash
    uploaded_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    upload_date = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    verification_status = Column(String(50), default="PENDING", nullable=False)  # PENDING, VERIFIED, REJECTED

    # Relationships
    company = relationship("Company", back_populates="documents")
    uploader = relationship("User")
