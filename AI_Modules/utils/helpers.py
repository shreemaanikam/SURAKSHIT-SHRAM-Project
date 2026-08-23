"""
Helper Functions – Common utilities for Surakshit Shram
"""

import re
import json
import random
import string
from datetime import datetime
from typing import Any, Dict, List, Optional, Union

def clean_amount(value: Any) -> float:
    """
    Clean amount string and convert to float
    
    Examples:
        "₹25,000" -> 25000.0
        "25,000.50" -> 25000.5
        "25000" -> 25000.0
    """
    if isinstance(value, (int, float)):
        return float(value)
    
    if value is None:
        return 0.0
    
    # Remove currency symbols, commas, and extra spaces
    cleaned = re.sub(r'[₹\s,]', '', str(value))
    
    try:
        return float(cleaned)
    except ValueError:
        return 0.0

def extract_date(text: str) -> Optional[str]:
    """Extract date from text"""
    patterns = [
        r'(\d{1,2})[/-](\d{1,2})[/-](\d{4})',
        r'(\d{4})[/-](\d{1,2})[/-](\d{1,2})',
        r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*[-/]?\s*(\d{4})',
        r'(\d{1,2})\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*(\d{4})'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            groups = match.groups()
            if len(groups) == 3:
                # Try to identify date format
                if groups[0].isdigit() and groups[1].isdigit() and groups[2].isdigit():
                    # Numeric date
                    if len(groups[0]) == 4:  # YYYY-MM-DD
                        return f"{groups[0]}-{groups[1]}-{groups[2]}"
                    else:  # DD-MM-YYYY or MM-DD-YYYY
                        return f"{groups[2]}-{groups[1]}-{groups[0]}"
                elif groups[1].isdigit() and groups[2].isdigit():
                    # Month name date
                    month_map = {
                        'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
                        'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
                        'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
                    }
                    return f"{groups[2]}-{month_map.get(groups[0], '01')}-{groups[1]}"
    
    return None

def format_risk_level(score: Union[int, float]) -> str:
    """Format risk level from score"""
    if score <= 30:
        return 'Low'
    elif score <= 60:
        return 'Medium'
    else:
        return 'High'

def get_timestamp() -> str:
    """Get current timestamp in ISO format"""
    return datetime.now().isoformat()

def generate_id(prefix: str = 'ID', length: int = 8) -> str:
    """Generate a unique ID with prefix"""
    chars = string.ascii_uppercase + string.digits
    random_part = ''.join(random.choices(chars, k=length))
    return f"{prefix}-{random_part}"

def truncate_text(text: str, max_length: int = 100) -> str:
    """Truncate text to max length"""
    if len(text) <= max_length:
        return text
    return text[:max_length] + '...'

def safe_divide(a: Union[int, float], b: Union[int, float]) -> float:
    """Safe division with zero handling"""
    if b == 0:
        return 0.0
    return a / b

def calculate_percentage(part: Union[int, float], total: Union[int, float]) -> float:
    """Calculate percentage"""
    if total == 0:
        return 0.0
    return (part / total) * 100

def format_currency(amount: Union[int, float], currency: str = '₹') -> str:
    """Format currency with symbol"""
    if amount is None:
        return f"{currency}0"
    return f"{currency}{amount:,.2f}"

def merge_dicts(dict1: Dict, dict2: Dict) -> Dict:
    """Merge two dictionaries (dict2 overwrites dict1)"""
    result = dict1.copy()
    result.update(dict2)
    return result

def sanitize_text(text: str) -> str:
    """Sanitize text (remove special characters)"""
    return re.sub(r'[^\w\s\d.₹]', ' ', text)

def normalize_text(text: str) -> str:
    """Normalize text (lowercase, remove extra spaces)"""
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def validate_lin(lin: str) -> bool:
    """Validate Labour Identification Number format"""
    pattern = r'^LIN-\d{4}-\d{4}$'
    return bool(re.match(pattern, lin))

def extract_number(text: str) -> float:
    """Extract first number from text"""
    match = re.search(r'[\d,]+\.?\d*', text)
    if match:
        return clean_amount(match.group())
    return 0.0

def extract_employee_name(text: str) -> Optional[str]:
    """Extract employee name from text"""
    pattern = r'[A-Z][a-z]+\s+[A-Z][a-z]+'
    match = re.search(pattern, text)
    return match.group() if match else None

def chunk_list(lst: List, chunk_size: int) -> List[List]:
    """Split list into chunks"""
    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]

def remove_duplicates(lst: List) -> List:
    """Remove duplicates while preserving order"""
    seen = set()
    result = []
    for item in lst:
        if item not in seen:
            seen.add(item)
            result.append(item)
    return result

def get_month_name(month_num: int) -> str:
    """Get month name from number"""
    months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    if 1 <= month_num <= 12:
        return months[month_num - 1]
    return 'Unknown'

def get_weekday_name(weekday_num: int) -> str:
    """Get weekday name from number"""
    weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    if 0 <= weekday_num <= 6:
        return weekdays[weekday_num]
    return 'Unknown'
