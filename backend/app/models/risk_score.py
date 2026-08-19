from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base


class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Float, nullable=False)  # 0.0 to 100.0 (higher = higher risk)
    risk_level = Column(String(50), nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    reasons = Column(Text, nullable=False)  # JSON or comma-separated reasons
    calculated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    model_version = Column(String(50), default="v1.0-rules-engine", nullable=False)

    # Relationships
    company = relationship("Company", back_populates="risk_scores")
