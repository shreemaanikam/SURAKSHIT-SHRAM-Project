"""
Payroll Parser – Extracts structured data from payroll documents
Handles Indian payroll terms, salary sheets, and attendance logs
"""

import re
from typing import Dict, List, Any, Optional
from utils.helpers import clean_amount, extract_date

class PayrollParser:
    """Parse Indian payroll documents and extract structured data"""
    
    def __init__(self):
        # Indian payroll terminology mapping
        self.payroll_terms = {
            'basic': ['basic', 'basic salary', 'base pay', 'basic pay', 'bpay', 'basic wage'],
            'hra': ['hra', 'house rent allowance', 'rent allowance'],
            'da': ['da', 'dearness allowance'],
            'pf': ['pf', 'provident fund', 'epf', 'epf deduction'],
            'esi': ['esi', 'employee state insurance'],
            'gross': ['gross', 'gross salary', 'total earnings', 'gross pay'],
            'net': ['net', 'net pay', 'take home', 'net salary', 'in hand'],
            'deduction': ['deduction', 'deductions', 'less', 'total deduction'],
            'allowance': ['allowance', 'allowances', 'special allowance'],
            'bonus': ['bonus', 'incentive', 'performance bonus'],
            'leave': ['leave', 'lwp', 'loss of pay', 'absent'],
            'present': ['present', 'present days', 'working days'],
            'attendance': ['attendance', 'present', 'absent', 'holiday']
        }
        
        # Name patterns for Indian names
        self.name_patterns = [
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})',  # Standard name
            r'([A-Z]\.\s?[A-Z]\.\s?[A-Z][a-z]+)',      # Initials + surname
            r'([A-Z][a-z]+\s+[A-Z])',                   # First name + initial
            r'([A-Z]{2,}\s+[A-Z][a-z]+)'                # Short first + last
        ]
    
    def parse_salary_sheet(self, text: str) -> Dict[str, Any]:
        """
        Parse salary sheet text and extract employee data
        
        Args:
            text: Raw text from OCR
        
        Returns:
            Dict with employees, month, year, total wages
        """
        result = {
            'employees': [],
            'month': None,
            'year': None,
            'company': None,
            'total_employees': 0,
            'total_basic_wages': 0,
            'total_net_wages': 0,
            'total_pf_deductions': 0,
            'total_esi_deductions': 0,
            'compliance_terms_found': [],
            'warnings': []
        }
        
        lines = text.split('\n')
        lines = [line.strip() for line in lines if line.strip()]
        
        # Extract month and year
        result['month'], result['year'] = self._extract_month_year(lines)
        
        # Extract company name
        result['company'] = self._extract_company_name(lines)
        
        # Parse employee rows
        for line in lines:
            employee = self._parse_employee_row(line)
            if employee and employee.get('name'):
                result['employees'].append(employee)
                result['total_basic_wages'] += employee.get('basic', 0)
                result['total_net_wages'] += employee.get('net', 0)
                result['total_pf_deductions'] += employee.get('pf', 0)
                result['total_esi_deductions'] += employee.get('esi', 0)
        
        result['total_employees'] = len(result['employees'])
        
        # Check if any employees were found
        if result['total_employees'] == 0:
            result['warnings'].append('No employees found in document. Check OCR quality.')
        
        return result
    
    def _extract_month_year(self, lines: List[str]) -> tuple:
        """Extract month and year from document"""
        month_patterns = [
            r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*[-/]?\s*(\d{4})',
            r'(\d{1,2})[/-](\d{1,2})[/-](\d{4})',
            r'(January|February|March|April|May|June|July|August|September|October|November|December)\s*(\d{4})'
        ]
        
        month_map = {
            'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 'April': 'Apr',
            'May': 'May', 'June': 'Jun', 'July': 'Jul', 'August': 'Aug',
            'September': 'Sep', 'October': 'Oct', 'November': 'Nov', 'December': 'Dec'
        }
        
        for line in lines:
            for pattern in month_patterns:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    groups = match.groups()
                    if len(groups) == 2:
                        if groups[0] in month_map:
                            return month_map[groups[0]], groups[1]
                        return groups[0], groups[1]
                    elif len(groups) == 3:
                        return groups[1], groups[2]
        
        return None, None
    
    def _extract_company_name(self, lines: List[str]) -> Optional[str]:
        """Extract company name from document"""
        company_indicators = ['company', 'ltd', 'private', 'pvt', 'limited', 'corp', 'incorporated']
        
        for line in lines[:10]:  # Check first 10 lines
            line_lower = line.lower()
            if any(indicator in line_lower for indicator in company_indicators):
                # Look for capitalized words
                words = re.findall(r'[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*', line)
                if len(words) >= 2:
                    return ' '.join(words[:3])  # Return first 2-3 words
                elif len(words) == 1 and len(words[0]) > 3:
                    return words[0]
        
        return None
    
    def _parse_employee_row(self, line: str) -> Dict[str, Any]:
        """Parse a single employee row from salary sheet"""
        employee = {}
        
        # Try each name pattern
        name = None
        for pattern in self.name_patterns:
            match = re.search(pattern, line)
            if match:
                name = match.group(1).strip()
                break
        
        if not name:
            return {}
        
        employee['name'] = name
        
        # Extract amounts (salary components)
        amounts = re.findall(r'₹?\s*[\d,]+\.?\d*', line)
        amounts = [clean_amount(a) for a in amounts if clean_amount(a) > 0]
        
        # Map amounts to components based on position and keywords
        if amounts:
            # Try to identify components
            comp_index = 0
            
            # Basic salary - usually first or marked with "Basic"
            if 'basic' in line.lower() or 'base' in line.lower():
                employee['basic'] = amounts[comp_index] if comp_index < len(amounts) else 0
                comp_index += 1
            else:
                employee['basic'] = amounts[comp_index] if comp_index < len(amounts) else 0
                comp_index += 1
            
            # HRA - usually second or marked with "HRA"
            if 'hra' in line.lower() or 'rent' in line.lower():
                employee['hra'] = amounts[comp_index] if comp_index < len(amounts) else 0
                comp_index += 1
            
            # DA - usually third
            if 'da' in line.lower() or 'dearness' in line.lower():
                employee['da'] = amounts[comp_index] if comp_index < len(amounts) else 0
                comp_index += 1
            
            # PF - marked with "PF" or "Provident"
            if 'pf' in line.lower() or 'provident' in line.lower():
                employee['pf'] = amounts[comp_index] if comp_index < len(amounts) else 0
                comp_index += 1
            
            # ESI - marked with "ESI"
            if 'esi' in line.lower() or 'state insurance' in line.lower():
                employee['esi'] = amounts[comp_index] if comp_index < len(amounts) else 0
                comp_index += 1
            
            # Net salary - usually last or marked with "Net"
            if 'net' in line.lower() or 'take home' in line.lower() or 'in hand' in line.lower():
                employee['net'] = amounts[-1] if amounts else 0
            else:
                employee['net'] = amounts[-1] if amounts else 0
        
        return employee
    
    def parse_attendance_log(self, text: str) -> Dict[str, Any]:
        """
        Parse attendance log and extract attendance data
        
        Args:
            text: Raw text from OCR
        
        Returns:
            Dict with attendance records
        """
        result = {
            'records': [],
            'month': None,
            'year': None,
            'total_employees': 0
        }
        
        lines = text.split('\n')
        lines = [line.strip() for line in lines if line.strip()]
        
        # Extract month/year
        result['month'], result['year'] = self._extract_month_year(lines)
        
        # Parse attendance records
        for line in lines:
            # Look for name + numbers pattern
            names = re.findall(r'[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*', line)
            numbers = re.findall(r'\d+', line)
            
            if names and len(numbers) >= 2:
                record = {
                    'name': names[0],
                    'present': int(numbers[0]) if len(numbers) >= 1 else 0,
                    'absent': int(numbers[1]) if len(numbers) >= 2 else 0,
                    'total_days': int(numbers[0]) + int(numbers[1]) if len(numbers) >= 2 else 0
                }
                result['records'].append(record)
        
        result['total_employees'] = len(result['records'])
        return result
    
    def parse_contractor_sheet(self, text: str) -> Dict[str, Any]:
        """
        Parse contractor sheet and extract contractor data
        
        Args:
            text: Raw text from OCR
        
        Returns:
            Dict with contractor records
        """
        result = {
            'contractors': [],
            'total_contractors': 0,
            'total_workers': 0,
            'total_wages': 0
        }
        
        lines = text.split('\n')
        lines = [line.strip() for line in lines if line.strip()]
        
        for line in lines:
            names = re.findall(r'[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*', line)
            numbers = re.findall(r'\d+', line)
            
            if names and len(numbers) >= 1:
                contractor = {
                    'name': names[0],
                    'workers': int(numbers[0]) if len(numbers) >= 1 else 0,
                    'contract_period': 'Not specified'
                }
                
                if len(numbers) >= 2:
                    contractor['total_wages'] = float(numbers[1])
                    result['total_wages'] += float(numbers[1])
                
                result['contractors'].append(contractor)
                result['total_workers'] += contractor['workers']
        
        result['total_contractors'] = len(result['contractors'])
        return result
