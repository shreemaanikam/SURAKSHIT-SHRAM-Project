"""
Compliance Checker – Unified compliance checking with both central and state rules
"""

from typing import Dict, Any, List, Optional
from .central_rules import CentralRules
from .state_adaptive_rules import StateAdaptiveRules

class ComplianceChecker:
    """
    Unified compliance checker that combines central and state rules
    """
    
    def __init__(self):
        self.central_rules = CentralRules()
        self.state_rules = StateAdaptiveRules()
    
    def check_full_compliance(self, company_data: Dict[str, Any], state: str) -> Dict[str, Any]:
        """
        Check compliance with both central and state rules
        
        Args:
            company_data: Company data with compliance information
            state: State name
        
        Returns:
            Complete compliance report
        """
        # Central rules check
        central_results = self._check_central_rules(company_data)
        
        # State rules check
        state_results = self.state_rules.check_compliance(company_data, state)
        
        # Combine results
        all_violations = central_results['violations'] + state_results['violations']
        
        # Determine overall compliance
        is_compliant = len(all_violations) == 0
        
        # Determine overall severity
        severity = 'none'
        if any(v['severity'] == 'high' for v in all_violations):
            severity = 'high'
        elif any(v['severity'] == 'medium' for v in all_violations):
            severity = 'medium'
        elif all_violations:
            severity = 'low'
        
        return {
            'compliant': is_compliant,
            'violations': all_violations,
            'violation_count': len(all_violations),
            'central_check': central_results,
            'state_check': state_results,
            'overall_severity': severity,
            'recommendations': self._generate_recommendations(all_violations)
        }
    
    def _check_central_rules(self, company_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check compliance with central rules"""
        violations = []
        
        # Check wages
        if 'avg_wage' in company_data and 'payment_days' in company_data:
            wage_check = self.central_rules.check_wage_compliance(
                company_data['avg_wage'],
                company_data['payment_days']
            )
            violations.extend(wage_check['violations'])
        
        # Check PF
        if 'employee_count' in company_data and 'pf_remittance_rate' in company_data:
            pf_check = self.central_rules.check_pf_compliance(
                company_data['employee_count'],
                company_data['pf_remittance_rate']
            )
            violations.extend(pf_check['violations'])
        
        # Check ESI
        if 'employee_count' in company_data and 'esi_remittance_rate' in company_data:
            esi_check = self.central_rules.check_esi_compliance(
                company_data['employee_count'],
                company_data['esi_remittance_rate']
            )
            violations.extend(esi_check['violations'])
        
        # Check working hours
        if 'avg_working_hours' in company_data:
            hours_check = self.central_rules.check_working_hours(
                company_data['avg_working_hours']
            )
            violations.extend(hours_check['violations'])
        
        return {
            'compliant': len(violations) == 0,
            'violations': violations,
            'violation_count': len(violations)
        }
    
    def _generate_recommendations(self, violations: List[Dict]) -> List[str]:
        """Generate recommendations based on violations"""
        recommendations = []
        
        for violation in violations:
            rule = violation.get('rule', '')
            
            if 'Minimum Wage' in rule:
                recommendations.append(
                    f"Increase wages to at least {violation.get('expected', 'minimum')} per day "
                    f"(current: {violation.get('actual', 'unknown')})."
                )
            elif 'Delayed Payment' in rule:
                recommendations.append(
                    f"Ensure wages are paid within {violation.get('expected', 7)} days. "
                    f"Current delay: {violation.get('actual', 0)} days."
                )
            elif 'PF' in rule:
                recommendations.append(
                    f"Ensure 100% PF remittance. Current rate: {violation.get('actual', 'unknown')}."
                )
            elif 'ESI' in rule:
                recommendations.append(
                    f"Ensure 100% ESI remittance. Current rate: {violation.get('actual', 'unknown')}."
                )
            elif 'Working Hours' in rule:
                recommendations.append(
                    f"Reduce working hours to {violation.get('expected', 48)} hours per week. "
                    f"Current: {violation.get('actual', 'unknown')} hours."
                )
            elif 'Overtime' in rule:
                recommendations.append(
                    f"Pay correct overtime rates. Expected: {violation.get('expected', 'standard')}."
                )
            else:
                recommendations.append(f"Review {rule}: {violation.get('description', '')}")
        
        return list(set(recommendations))  # Remove duplicates
    
    def get_compliance_score(self, company_data: Dict[str, Any], state: str) -> float:
        """
        Calculate a compliance score (0-100) based on violations
        
        Returns:
            Compliance score (higher is better)
        """
        result = self.check_full_compliance(company_data, state)
        
        if result['compliant']:
            return 100.0
        
        # Deduct points based on violations
        score = 100.0
        
        for violation in result['violations']:
            severity = violation.get('severity', 'medium')
            if severity == 'high':
                score -= 15
            elif severity == 'medium':
                score -= 10
            else:
                score -= 5
        
        return max(0, min(100, score))
