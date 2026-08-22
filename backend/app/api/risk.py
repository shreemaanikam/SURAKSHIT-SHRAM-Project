from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.middleware.auth import get_current_user, verify_company_access
from app.models.user import User
from app.schemas.risk import RiskScoreResponse
from app.services.risk_service import RiskService
from app.services.audit_service import AuditService

router = APIRouter(prefix="/companies/{company_id}/risk", tags=["Risk Scoring Engine"])


@router.post(
    "",
    response_model=RiskScoreResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Trigger risk score re-calculation for a company",
    description="Evaluates compliance history, violations, employee scale, and generates updated risk metrics."
)
def calculate_risk(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_company_access(company_id, current_user)
    service = RiskService(db)
    score = service.calculate_company_risk(company_id)
    
    AuditService.log_action(
        db=db,
        action="RISK_SCORE_CALCULATE",
        resource_type="RiskScore",
        resource_id=str(score.id),
        user_id=current_user.id
    )
    return score


@router.get(
    "",
    response_model=RiskScoreResponse,
    summary="Get latest risk score for a company"
)
def get_latest_risk(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    verify_company_access(company_id, current_user)
    service = RiskService(db)
    return service.get_latest_risk_score(company_id)
