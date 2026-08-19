import hashlib
import os
import uuid
from abc import ABC, abstractmethod
from typing import List, Tuple, Optional
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.exceptions import BaseAppException, NotFoundError
from app.models.company import Company
from app.models.document import Document
from app.schemas.document import DocumentCreate, DocumentResponse


class StorageProvider(ABC):
    """Abstract storage provider interface (Local File System, S3, GCS)."""

    @abstractmethod
    def save_file(self, file_bytes: bytes, filename: str) -> Tuple[str, str]:
        """Save file bytes and return (storage_reference, sha256_hash)."""
        pass

    @abstractmethod
    def get_file_path(self, storage_reference: str) -> str:
        """Get accessible path or URL for document."""
        pass


class LocalStorageProvider(StorageProvider):
    """Local disk storage implementation."""

    def __init__(self, upload_dir: str = settings.UPLOAD_DIR):
        self.upload_dir = upload_dir
        os.makedirs(self.upload_dir, exist_ok=True)

    def save_file(self, file_bytes: bytes, filename: str) -> Tuple[str, str]:
        sha256_hash = hashlib.sha256(file_bytes).hexdigest()
        ext = filename.split(".")[-1] if "." in filename else "bin"
        unique_name = f"{uuid.uuid4().hex}_{sha256_hash[:10]}.{ext}"
        target_path = os.path.join(self.upload_dir, unique_name)

        with open(target_path, "wb") as f:
            f.write(file_bytes)

        return target_path, sha256_hash

    def get_file_path(self, storage_reference: str) -> str:
        return storage_reference


class DocumentService:
    """Service handling compliance document metadata, validation, SHA-256 hashing, and storage."""

    def __init__(self, db: Session, storage: Optional[StorageProvider] = None):
        self.db = db
        self.storage = storage or LocalStorageProvider()

    async def upload_document(
        self,
        company_id: int,
        document_type: str,
        file: UploadFile,
        uploaded_by_user_id: Optional[int] = None
    ) -> Document:
        # Validate company exists
        company = self.db.query(Company).filter(Company.id == company_id).first()
        if not company:
            raise NotFoundError("Company", company_id)

        # Validate file extension
        filename = file.filename or "file.pdf"
        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
        if ext not in settings.ALLOWED_EXTENSIONS:
            raise BaseAppException(
                message=f"Invalid file extension '.{ext}'. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}",
                status_code=400,
                code="INVALID_FILE_TYPE"
            )

        # Read contents and validate file size
        contents = await file.read()
        if len(contents) > settings.MAX_UPLOAD_SIZE_BYTES:
            raise BaseAppException(
                message=f"File size exceeds maximum limit of {settings.MAX_UPLOAD_SIZE_BYTES / (1024*1024):.1f}MB.",
                status_code=400,
                code="FILE_TOO_LARGE"
            )

        # Store file & compute SHA-256 hash
        storage_ref, doc_hash = self.storage.save_file(contents, filename)

        doc = Document(
            company_id=company_id,
            document_type=document_type.upper(),
            filename=filename,
            storage_reference=storage_ref,
            document_hash=doc_hash,
            uploaded_by=uploaded_by_user_id,
            verification_status="VERIFIED"
        )
        self.db.add(doc)
        self.db.commit()
        self.db.refresh(doc)
        return doc

    def get_document_by_id(self, document_id: int) -> Document:
        doc = self.db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            raise NotFoundError("Document", document_id)
        return doc

    def get_company_documents(self, company_id: int) -> List[Document]:
        company = self.db.query(Company).filter(Company.id == company_id).first()
        if not company:
            raise NotFoundError("Company", company_id)

        return self.db.query(Document).filter(
            Document.company_id == company_id
        ).order_by(Document.upload_date.desc()).all()
