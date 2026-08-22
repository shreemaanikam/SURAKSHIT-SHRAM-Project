import logging
import re
import sys
from typing import Any, Dict
from app.core.config import settings
from app.middleware.request_id import request_id_ctx

# Sensitive field patterns to redact from logs
SENSITIVE_PATTERNS = [
    (re.compile(r'(?i)"?password"?\s*[:=]\s*"?[^"\s,}]*"?'), 'password="[REDACTED]"'),
    (re.compile(r'(?i)"?token"?\s*[:=]\s*"?[^"\s,}]*"?'), 'token="[REDACTED]"'),
    (re.compile(r'(?i)bearer\s+[a-zA-Z0-9\-\._~\+\/]+=*'), 'Bearer [REDACTED]'),
    (re.compile(r'(?i)"?secret"?\s*[:=]\s*"?[^"\s,}]*"?'), 'secret="[REDACTED]"'),
    (re.compile(r'\b[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}\b'), '[AADHAAR_REDACTED]'),
    (re.compile(r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b'), '[PAN_REDACTED]'),
]


class RequestIdAndSanitizerFilter(logging.Filter):
    """Filter that auto-injects request_id from contextvar and sanitizes sensitive data."""

    def filter(self, record: logging.LogRecord) -> bool:
        # Inject request_id attribute if missing
        if not hasattr(record, "request_id") or not record.request_id:
            record.request_id = request_id_ctx.get()

        # Sanitize log message
        if isinstance(record.msg, str):
            record.msg = self.sanitize(record.msg)
        if record.args:
            if isinstance(record.args, dict):
                record.args = {k: self.sanitize(str(v)) for k, v in record.args.items()}
            elif isinstance(record.args, tuple):
                record.args = tuple(self.sanitize(str(arg)) for arg in record.args)
        return True

    @staticmethod
    def sanitize(text: str) -> str:
        if not isinstance(text, str):
            text = str(text)
        for pattern, replacement in SENSITIVE_PATTERNS:
            text = pattern.sub(replacement, text)
        return text


# Backwards compatibility alias
SensitiveDataSanitizerFilter = RequestIdAndSanitizerFilter


def setup_logging() -> logging.Logger:
    """Configure structured logger with request ID injection and sensitive data sanitization."""
    logger = logging.getLogger("surakshit_shram")
    logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))
    
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            fmt='[%(asctime)s] [%(levelname)s] [ReqID: %(request_id)s] %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        handler.setFormatter(formatter)
        handler.addFilter(RequestIdAndSanitizerFilter())
        logger.addHandler(handler)
        logger.propagate = False
        
    return logger


logger = setup_logging()
