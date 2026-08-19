from typing import List
from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.middleware.auth import get_current_user, require_company_user
from app.models.user import User
from app.schemas.document import DocumentResponse
from app.services.document_service import DocumentService
from app.services.audit_service import AuditService

router = APIRouter(tags=["Compliance Documents"])


@router.post(
    "/documents",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload compliance document with SHA-256 hash calculation",
    description="Validates file type/size, calculates SHA-256 hash, and stores metadata."
)
async def upload_document(
    company_id: int = Form(...),
    document_type: str = Form(...),  # ECR_CHALLAN, ESI_RETURN, WAGE_REGISTER, INSPECTION_REPORT
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_company_user)
):
    service = DocumentService(db)
    doc = await service.upload_document(
        company_id=company_id,
        document_type=document_type,
        file=file,
        uploaded_by_user_id=current_user.id
    )

    AuditService.log_action(
        db=db,
        action="DOCUMENT_UPLOAD",
        resource_type="Document",
        resource_id=str(doc.id),
        user_id=current_user.id,
        metadata={"filename": doc.filename, "hash": doc.document_hash}
    )
    return doc


@router.get(
    "/documents/{id}",
    response_model=DocumentResponse,
    summary="Get document metadata by ID"
)
def get_document(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = DocumentService(db)
    return service.get_document_by_id(id)


@router.get(
    "/companies/{company_id}/documents",
    response_model=List[DocumentResponse],
    summary="List all uploaded compliance documents for a company"
)
def list_company_documents(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    service = DocumentService(db)
    return service.get_company_documents(company_id)
