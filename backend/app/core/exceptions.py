from typing import Any, Dict, Optional
from fastapi import Request, status
from fastapi.responses import JSONResponse


class BaseAppException(Exception):
    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        code: str = "BAD_REQUEST",
        details: Optional[Any] = None
    ):
        self.message = message
        self.status_code = status_code
        self.code = code
        self.details = details
        super().__init__(message)


class AuthenticationError(BaseAppException):
    def __init__(self, message: str = "Invalid credentials or token expired", details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_401_UNAUTHORIZED,
            code="UNAUTHORIZED",
            details=details
        )


class PermissionDeniedError(BaseAppException):
    def __init__(self, message: str = "Access denied for this resource", details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_403_FORBIDDEN,
            code="FORBIDDEN",
            details=details
        )


class NotFoundError(BaseAppException):
    def __init__(self, resource_name: str = "Resource", identifier: Optional[Any] = None):
        msg = f"{resource_name} not found"
        if identifier:
            msg += f" (ID: {identifier})"
        super().__init__(
            message=msg,
            status_code=status.HTTP_404_NOT_FOUND,
            code="NOT_FOUND"
        )


class DuplicateEntityError(BaseAppException):
    def __init__(self, message: str = "Entity already exists", details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_409_CONFLICT,
            code="DUPLICATE_ENTITY",
            details=details
        )


class SynchronizationError(BaseAppException):
    def __init__(self, message: str = "Data synchronization failed", details: Optional[Any] = None):
        super().__init__(
            message=message,
            status_code=status.HTTP_502_BAD_GATEWAY,
            code="SYNC_ERROR",
            details=details
        )


def app_exception_handler(request: Request, exc: BaseAppException) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "unknown")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
                "request_id": request_id
            }
        }
    )


def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    request_id = getattr(request.state, "request_id", "unknown")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected server error occurred.",
                "details": None,
                "request_id": request_id
            }
        }
    )
