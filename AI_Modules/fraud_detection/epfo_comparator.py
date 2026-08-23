"""
EPFO Comparator Module
Compares uploaded wage documents with EPFO records to detect discrepancies
"""

import re
import json
import requests

class EPFOComparator:
    """Compare wage documents with EPFO records"""
    
    def __init__(self, api_base_url=None):
        """Initialize EPFO comparator"""
        self.api_base_url = api_base_url or "https://api.epfo.gov.in/v1"
    
    def extract_wage_data(self, document_text):
        """Extract wage data from document text"""
        data = {
            'employees': [],
            'total_wages': 0,
            'month': None,
            'year': None
        }
        
        lines = document_text.split('\n')
        
        # Simple extraction patterns
        name_pattern = r'[A-Z][a-z]+\s+[A-Z][a-z]+'
        amount_pattern = r'₹?\s*[\d,]+\.?\d*'
        month_pattern = r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*[-/]?\s*(\d{4})'
        
        # Extract month/year
        for line in lines:
            month_match = re.search(month_pattern, line, re.IGNORECASE)
            if month_match:
                data['month'] = month_match.group(1)
                data['year'] = month_match.group(2)
                break
        
        # Extract employee data
        for line in lines:
            names = re.findall(name_pattern, line)
            amounts = re.findall(amount_pattern, line)
            
            if names and amounts:
                employee = {
                    'name': names[0],
                    'salary': self._clean_amount(amounts[0]) if amounts else 0
                }
                data['employees'].append(employee)
        
        data['total_wages'] = sum(e['salary'] for e in data['employees'])
        return data
    
    def _clean_amount(self, amount_str):
        """Clean amount string to float"""
        if isinstance(amount_str, (int, float)):
            return float(amount_str)
        cleaned = re.sub(r'[₹,\s]', '', str(amount_str))
        try:
            return float(cleaned)
        except:
            return 0
    
    def fetch_epfo_record(self, company_lin, month, year):
        """
        Fetch EPFO record for a company
        
        Note: This is a placeholder. Actual implementation requires EPFO API access.
        """
        # Placeholder implementation - returns sample data
        # In production, this would call the actual EPFO API
        
        # Simulate API response
        return {
            'success': True,
            'company_lin': company_lin,
            'month': month,
            'year': year,
            'total_employees': 15,
            'total_wages': 450000,
            'pf_contribution': 54000
        }
    
    def compare_with_epfo(self, document_text, company_lin):
        """
        Compare document data with EPFO records
        
        Returns:
            dict: Comparison results with discrepancies
        """
        # Extract data from document
        doc_data = self.extract_wage_data(document_text)
        
        # Fetch EPFO record
        epfo_data = self.fetch_epfo_record(
            company_lin,
            doc_data.get('month'),
            doc_data.get('year')
        )
        
        discrepancies = {
            'found': False,
            'issues': [],
            'doc_data': doc_data,
            'epfo_data': epfo_data
        }
        
        # Compare employee count
        doc_employees = len(doc_data['employees'])
        epfo_employees = epfo_data.get('total_employees', 0)
        
        if doc_employees > 0 and epfo_employees > 0:
            diff_percent = abs(doc_employees - epfo_employees) / epfo_employees
            if diff_percent > 0.2:  # More than 20% difference
                discrepancies['issues'].append({
                    'type': 'employee_count',
                    'document_count': doc_employees,
                    'epfo_count': epfo_employees,
                    'severity': 'high' if diff_percent > 0.5 else 'medium'
                })
        
        # Compare total wages
        doc_wages = doc_data['total_wages']
        epfo_wages = epfo_data.get('total_wages', 0)
        
        if doc_wages > 0 and epfo_wages > 0:
            wage_diff = abs(doc_wages - epfo_wages) / epfo_wages
            if wage_diff > 0.15:  # More than 15% difference
                discrepancies['issues'].append({
                    'type': 'wage_mismatch',
                    'document_wages': doc_wages,
                    'epfo_wages': epfo_wages,
                    'severity': 'high' if wage_diff > 0.4 else 'medium'
                })
        
        if discrepancies['issues']:
            discrepancies['found'] = True
        
        return discrepancies
    
    def get_discrepancy_report(self, document_text, company_lin):
        """
        Get detailed discrepancy report
        """
        comparison = self.compare_with_epfo(document_text, company_lin)
        
        report = {
            'has_discrepancy': comparison['found'],
            'severity': 'low',
            'issues': comparison['issues'],
            'summary': ''
        }
        
        # Determine severity
        if comparison['issues']:
            high_severity = any(i['severity'] == 'high' for i in comparison['issues'])
            if high_severity:
                report['severity'] = 'high'
            else:
                report['severity'] = 'medium'
        
        # Generate summary
        if not comparison['found']:
            report['summary'] = 'No discrepancies found. Document matches EPFO records.'
        else:
            report['summary'] = f"Found {len(comparison['issues'])} discrepancy(ies)."
            for issue in comparison['issues']:
                report['summary'] += f" {issue['type']}: document={issue.get('document_count', issue.get('document_wages'))}, EPFO={issue.get('epfo_count', issue.get('epfo_wages'))}"
        
        return report
