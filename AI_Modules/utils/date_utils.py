"""
Date Utilities – Date handling functions for Surakshit Shram
"""

from datetime import datetime, timedelta, date
from typing import Optional, Tuple

def parse_date(date_str: str, formats: list = None) -> Optional[datetime]:
    """Parse date string with multiple formats"""
    if formats is None:
        formats = [
            '%Y-%m-%d', '%d-%m-%Y', '%m-%d-%Y',
            '%Y/%m/%d', '%d/%m/%Y', '%m/%d/%Y',
            '%Y%m%d', '%d%m%Y', '%m%d%Y'
        ]
    
    for fmt in formats:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return None

def format_date(date_obj: datetime, format_str: str = '%Y-%m-%d') -> str:
    """Format date object"""
    return date_obj.strftime(format_str)

def get_date_diff(date1: datetime, date2: datetime) -> int:
    """Get difference in days between two dates"""
    return abs((date1 - date2).days)

def get_month_year(date_obj: datetime) -> Tuple[str, int]:
    """Get month name and year from date"""
    months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return months[date_obj.month - 1], date_obj.year

def get_quarter(date_obj: datetime) -> int:
    """Get quarter number (1-4) from date"""
    return (date_obj.month - 1) // 3 + 1

def get_financial_year(date_obj: datetime) -> str:
    """Get financial year (e.g., '2024-25')"""
    year = date_obj.year
    if date_obj.month >= 4:
        return f"{year}-{str(year+1)[-2:]}"
    else:
        return f"{year-1}-{str(year)[-2:]}"

def add_days(date_obj: datetime, days: int) -> datetime:
    """Add days to date"""
    return date_obj + timedelta(days=days)

def add_months(date_obj: datetime, months: int) -> datetime:
    """Add months to date"""
    year = date_obj.year + (date_obj.month + months - 1) // 12
    month = (date_obj.month + months - 1) % 12 + 1
    day = min(date_obj.day, [31, 29 if year % 4 == 0 else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month-1])
    return datetime(year, month, day)

def get_week_start(date_obj: datetime) -> datetime:
    """Get start of week (Monday)"""
    return date_obj - timedelta(days=date_obj.weekday())

def get_month_start(date_obj: datetime) -> datetime:
    """Get start of month"""
    return datetime(date_obj.year, date_obj.month, 1)

def get_current_financial_year() -> str:
    """Get current financial year"""
    return get_financial_year(datetime.now())

def get_date_range(start_date: datetime, end_date: datetime) -> list:
    """Get list of dates between start and end"""
    dates = []
    current = start_date
    while current <= end_date:
        dates.append(current)
        current += timedelta(days=1)
    return dates
