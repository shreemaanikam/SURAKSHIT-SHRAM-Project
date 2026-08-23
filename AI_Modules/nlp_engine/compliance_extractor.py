"""
Compliance Extractor – Extract compliance-related information from payroll documents
"""

import re
from typing import Dict, List, Any

class ComplianceExtractor:
    """Extract compliance-related data from payroll documents"""
    
    def __init__(self):
        self.compliance_indicators = {
            'minimum_wage': [
                r'min(?:imum)?\s*wage',
                r'wage\s*below',
                r'statutory\s*wage',
                r'minimum\s*pay'
            ],
            'overtime': [
                r'ot\s*pay',
                r'overtime',
                r'over\s*time',
                r'extra\s*hours'
            ],
            'pf_compliance': [
                r'provident\s*fund',
                r'pf\s*deduction',
                r'epf',
                r'pf\s*remittance'
            ],
            'esi_compliance': [
                r'employee\s*state\s*insurance',
                r'esi\s*deduction',
                r'esi\s*remittance'
            ],
            'gratuity': [
                r'gratuity',
                r'grat\s*payable',
                r'gratuity\s*fund'
            ],
            'bonus': [
                r'bonus\s*payable',
                r'performance\s*bonus',
                r'incentive\s*pay'
            ],
            'attendance': [
                r'attendance\s*record',
                r'present\s*days',
                r'absent\s*days',
                r'leave\s*record'
            ],
            'contract_labor': [
                r'contract\s*labor',
                r'contractor',
                r'temporary\s*worker',
                r'outsourced'
            ]
        }
        
        self.violation_patterns = {
            'late_payment': r'late\s*(?:payment|salary|wage)',
            'missing_document': r'(?:missing|not\s*found|unavailable)\s*(?:document|record|sheet)',
            'insufficient_wage': r'(?:below|less\s*than|less\s*than)\s*(?:minimum|statutory)',
            'unpaid_ot': r'(?:unpaid|not\s*paid)\s*(?:ot|overtime|over\s*time)',
            'no_pf': r'(?:no|not\s*provided|missing)\s*(?:pf|provident\s*fund)',
            'no_esi': r'(?:no|not\s*provided|missing)\s*(?:esi|insurance)'
        }
    
    def extract_compliance_indicators(self, text: str) -> Dict[str, List[str]]:
        """Extract compliance indicators from text"""
        result = {}
        text_lower = text.lower()
        
        for category, patterns in self.compliance_indicators.items():
            matches = []
            for pattern in patterns:
                if re.search(pattern, text_lower, re.IGNORECASE):
                    matches.append(pattern)
            if matches:
                result[category] = matches
        
        return result
    
    def detect_violations(self, text: str) -> List[Dict[str, Any]]:
        """Detect compliance violations in text"""
        violations = []
        text_lower = text.lower()
        
        for violation_type, pattern in self.violation_patterns.items():
            if re.search(pattern, text_lower, re.IGNORECASE):
                violations.append({
                    'type': violation_type,
                    'severity': self._get_severity(violation_type),
                    'description': self._get_description(violation_type)
                })
        
        return violations
    
    def _get_severity(self, violation_type: str) -> str:
        """Get severity for violation type"""
        severity_map = {
            'late_payment': 'high',
            'missing_document': 'medium',
            'insufficient_wage': 'high',
            'unpaid_ot': 'high',
            'no_pf': 'high',
            'no_esi': 'high'
        }
        return severity_map.get(violation_type, 'medium')
    
    def _get_description(self, violation_type: str) -> str:
        """Get description for violation type"""
        description_map = {
            'late_payment': 'Salary/wage payment appears to be delayed',
            'missing_document': 'Required document appears to be missing',
            'insufficient_wage': 'Wage appears to be below minimum requirements',
            'unpaid_ot': 'Overtime appears to be unpaid',
            'no_pf': 'Provident Fund appears to be missing',
            'no_esi': 'ESI appears to be missing'
        }
        return description_map.get(violation_type, 'Compliance violation detected')
    
    def extract_compliance_summary(self, text: str) -> Dict[str, Any]:
        """
        Generate a comprehensive compliance summary
        
        Returns:
            Dict with all compliance findings
        """
        result = {
            'indicators': self.extract_compliance_indicators(text),
            'violations': self.detect_violations(text),
            'is_compliant': True,
            'risk_level': 'Low',
            'recommendations': []
        }
        
        # Determine compliance status
        if result['violations']:
            result['is_compliant'] = False
            
            # Determine risk level
            high_count = sum(1 for v in result['violations'] if v['severity'] == 'high')
            if high_count >= 2:
                result['risk_level'] = 'High'
            elif high_count >= 1:
                result['risk_level'] = 'Medium'
            else:
                result['risk_level'] = 'Medium'
        
        # Generate recommendations
        for violation in result['violations']:
            result['recommendations'].append(self._get_recommendation(violation['type']))
        
        return result
    
    def _get_recommendation(self, violation_type: str) -> str:
        """Get recommendation for violation type"""
        recommendation_map = {
            'late_payment': 'Ensure timely salary/wage payments. Set up automated payment reminders.',
            'missing_document': 'Upload missing documents immediately. Check document requirements.',
            'insufficient_wage': 'Review wage structure. Ensure compliance with minimum wage laws.',
            'unpaid_ot': 'Calculate and pay overtime dues. Maintain OT records.',
            'no_pf': 'Register for PF. Ensure PF deductions and remittances are made.',
            'no_esi': 'Register for ESI. Ensure ESI deductions and remittances are made.'
        }
        return recommendation_map.get(violation_type, 'Review and ensure compliance')
