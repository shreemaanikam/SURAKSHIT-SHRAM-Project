"""
Validators – Input validation functions for Surakshit Shram
"""

import re
from datetime import datetime
from typing import Any, Optional

def validate_lin(lin: str) -> bool:
    """Validate Labour Identification Number"""
    if not lin:
        return False
    pattern = r'^LIN-\d{4}-\d{4}$'
    return bool(re.match(pattern, lin))

def validate_phone(phone: str) -> bool:
    """Validate Indian phone number"""
    if not phone:
        return False
    pattern = r'^[6-9]\d{9}$'
    return bool(re.match(pattern, phone))

def validate_email(email: str) -> bool:
    """Validate email address"""
    if not email:
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_pan(pan: str) -> bool:
    """Validate Indian PAN card number"""
    if not pan:
        return False
    pattern = r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$'
    return bool(re.match(pattern, pan.upper()))

def validate_aadhaar(aadhaar: str) -> bool:
    """Validate Indian Aadhaar number"""
    if not aadhaar:
        return False
    pattern = r'^\d{12}$'
    return bool(re.match(pattern, aadhaar))

def validate_date(date_str: str, format: str = '%Y-%m-%d') -> bool:
    """Validate date string"""
    try:
        datetime.strptime(date_str, format)
        return True
    except ValueError:
        return False

def validate_amount(amount: Any) -> bool:
    """Validate amount is positive number"""
    try:
        amount = float(amount)
        return amount >= 0
    except (TypeError, ValueError):
        return False

def validate_file_type(filename: str, allowed_types: list) -> bool:
    """Validate file type by extension"""
    if not filename:
        return False
    ext = filename.split('.')[-1].lower()
    return ext in allowed_types

def validate_file_size(file_size: int, max_size: int = 10 * 1024 * 1024) -> bool:
    """Validate file size (default 10 MB)"""
    return file_size <= max_size

def validate_pincode(pincode: str) -> bool:
    """Validate Indian pincode"""
    if not pincode:
        return False
    pattern = r'^\d{6}$'
    return bool(re.match(pattern, pincode))

def validate_gst(gst: str) -> bool:
    """Validate Indian GST number"""
    if not gst:
        return False
    pattern = r'^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$'
    return bool(re.match(pattern, gst))

def validate_company_name(name: str) -> bool:
    """Validate company name"""
    if not name:
        return False
    return len(name) >= 3

def validate_year(year: Any) -> bool:
    """Validate year"""
    try:
        year = int(year)
        return 1900 <= year <= datetime.now().year + 1
    except (TypeError, ValueError):
        return False

def validate_month(month: Any) -> bool:
    """Validate month"""
    try:
        month = int(month)
        return 1 <= month <= 12
    except (TypeError, ValueError):
        return False
