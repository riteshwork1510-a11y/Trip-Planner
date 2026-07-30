from typing import Any, Dict, Optional
from fastapi import HTTPException, status


class BaseAIException(HTTPException):
    def __init__(
        self,
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        message: str = "An AI infrastructure error occurred.",
        error_code: str = "AI_ERROR",
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(
            status_code=status_code,
            detail={
                "success": False,
                "error": {
                    "code": error_code,
                    "message": message,
                    "details": details or {},
                },
            },
        )


class GeminiAPIException(BaseAIException):
    def __init__(self, message: str = "Failed to communicate with Google Gemini API.", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            message=message,
            error_code="GEMINI_API_ERROR",
            details=details,
        )


class RateLimitException(BaseAIException):
    def __init__(self, message: str = "Rate limit exceeded. Please try again later.", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            message=message,
            error_code="RATE_LIMIT_EXCEEDED",
            details=details,
        )


class RequestValidationException(BaseAIException):
    def __init__(self, message: str = "Invalid request payload.", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=message,
            error_code="VALIDATION_ERROR",
            details=details,
        )


class ResponseValidationException(BaseAIException):
    def __init__(self, message: str = "AI model response validation failed.", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            message=message,
            error_code="RESPONSE_VALIDATION_ERROR",
            details=details,
        )


class ResourceNotFoundException(BaseAIException):
    def __init__(self, message: str = "Requested resource not found.", details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            message=message,
            error_code="RESOURCE_NOT_FOUND",
            details=details,
        )
