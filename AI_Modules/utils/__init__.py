"""
Utils Module for Surakshit Shram
Helper functions for various tasks
"""

from .helpers import (
    clean_amount, extract_date, format_risk_level,
    get_timestamp, generate_id, truncate_text,
    safe_divide, calculate_percentage, format_currency,
    merge_dicts, sanitize_text, normalize_text
)

from .validators import (
    validate_lin, validate_phone, validate_email,
    validate_pan, validate_aadhaar, validate_date,
    validate_amount, validate_file_type, validate_file_size
)

from .file_handlers import (
    read_json, write_json, read_csv, write_csv,
    read_text, write_text, ensure_directory,
    get_file_size, get_file_extension, list_files
)

from .logger import Logger, get_logger

from .date_utils import (
    parse_date, format_date, get_date_diff,
    get_month_year, get_quarter, get_financial_year,
    add_days, add_months, get_week_start, get_month_start
)

from .encryption import (
    encrypt_data, decrypt_data, hash_data,
    verify_hash, generate_key, secure_random
)

from .api_client import APIClient, fetch_data, retry_request

__all__ = [
    # Helpers
    'clean_amount', 'extract_date', 'format_risk_level',
    'get_timestamp', 'generate_id', 'truncate_text',
    'safe_divide', 'calculate_percentage', 'format_currency',
    'merge_dicts', 'sanitize_text', 'normalize_text',
    
    # Validators
    'validate_lin', 'validate_phone', 'validate_email',
    'validate_pan', 'validate_aadhaar', 'validate_date',
    'validate_amount', 'validate_file_type', 'validate_file_size',
    
    # File Handlers
    'read_json', 'write_json', 'read_csv', 'write_csv',
    'read_text', 'write_text', 'ensure_directory',
    'get_file_size', 'get_file_extension', 'list_files',
    
    # Logger
    'Logger', 'get_logger',
    
    # Date Utils
    'parse_date', 'format_date', 'get_date_diff',
    'get_month_year', 'get_quarter', 'get_financial_year',
    'add_days', 'add_months', 'get_week_start', 'get_month_start',
    
    # Encryption
    'encrypt_data', 'decrypt_data', 'hash_data',
    'verify_hash', 'generate_key', 'secure_random',
    
    # API Client
    'APIClient', 'fetch_data', 'retry_request'
]
