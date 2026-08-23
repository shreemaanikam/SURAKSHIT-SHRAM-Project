"""
Central Rules – Central labor laws applicable across India
Based on the 4 new labor codes:
1. Code on Wages, 2019
2. Industrial Relations Code, 2020
3. Social Security Code, 2020
4. Occupational Safety, Health and Working Conditions Code, 2020
"""

from typing import Dict, Any, List

class CentralRules:
    """Central labor laws applicable across all states"""
    
    def __init__(self):
        self.rules = self._load_central_rules()
    
    def _load_central_rules(self) -> Dict[str, Any]:
        """Load all central labor laws"""
        return {
            # ===== CODE ON WAGES, 2019 =====
            'wages': {
                'minimum_wage_central': 176,  # Daily rate in INR
                'floor_wage': 160,  # Minimum floor wage
                'payment_due_days': 7,  # Wages must be paid within 7 days
                'payment_frequency': 'monthly',  # Monthly payment
                'equal_pay': True,  # No gender discrimination
                'overtime_rate': 2.0,  # Twice the normal rate
                'overtime_eligibility': 'hours',  # Per hour basis
                'bonus_eligibility': 21000,  # Monthly salary threshold for bonus
                'bonus_percentage': 8.33,  # Minimum bonus percentage
                'gratuity_years': 5,  # Years of service for gratuity
                'gratuity_formula': 'last_drawn_salary * 15/26 * years_of_service'
            },
            
            # ===== INDUSTRIAL RELATIONS CODE, 2020 =====
            'industrial_relations': {
                'workmen_definition': '10',  # Minimum employees for workmen status
                'notice_period': 60,  # Days of notice for layoff
                'layoff_compensation': '50%',  # Compensation during layoff
                'strike_notice': 14,  # Days of notice before strike
                'closing_notice': 60,  # Days of notice for closing
                'retrenchment_compensation': '15_days_per_year',  # Compensation formula
                'fixed_term_benefits': True,  # Fixed-term employees get gratuity
                'fixed_term_eligibility': 1  # Years for fixed-term eligibility
            },
            
            # ===== SOCIAL SECURITY CODE, 2020 =====
            'social_security': {
                'pf_rate': 0.12,  # 12% of basic wages
                'pf_eligible_salary': 15000,  # Salary threshold for PF
                'pf_eligibility_employees': 20,  # Minimum employees for PF
                'esi_rate_employer': 0.0325,  # 3.25% employer contribution
                'esi_rate_employee': 0.0075,  # 0.75% employee contribution
                'esi_eligible_salary': 21000,  # Salary threshold for ESI
                'esi_eligibility_employees': 10,  # Minimum employees for ESI
                'gig_worker_coverage': True,  # Gig workers covered
                'platform_worker_coverage': True,  # Platform workers covered
                'gig_contribution_aggregator': 0.02,  # Aggregator contribution
                'maternity_benefit_days': 26,  # Weeks of maternity benefit
                'maternity_benefit_rate': '100%',  # Full salary during maternity
            },
            
            # ===== OCCUPATIONAL SAFETY, HEALTH AND WORKING CONDITIONS CODE, 2020 =====
            'safety_health': {
                'max_working_hours_weekly': 48,  # Maximum working hours per week
                'max_working_hours_daily': 9,  # Maximum working hours per day
                'weekly_holiday_compulsory': True,  # One day weekly off mandatory
                'rest_interval': 5,  # Rest interval after 5 hours
                'rest_interval_duration': 30,  # Minimum 30 minutes rest
                'night_shift_definition': '22:00-06:00',  # Night shift hours
                'night_shift_extra': 0.1,  # 10% extra for night shift
                'hazardous_industry_min_employees': 1,  # Even 1 employee needs ESIC
                'registration_threshold': 10,  # Minimum employees for registration
                'annual_health_checkup_age': 40,  # Health checkup for workers over 40
                'contract_labor_core_activity': True,  # Prohibited for core activities
                'contract_labor_workmen': False  # Allowed for non-core activities
            },
            
            # ===== PENALTIES AND COMPLIANCE =====
            'penalties': {
                'minimum_wage_violation': 50000,  # Penalty in INR
                'delayed_payment': 0.01,  # 1% per day of delay
                'pf_violation': 5000,  # Penalty in INR
                'esi_violation': 5000,  # Penalty in INR
                'safety_violation': 25000,  # Penalty in INR
                'repeated_violation': 'double',  # Double penalty for repeat
                'compliance_period': 30,  # Days to comply
                'improvement_notice_days': 30  # Days for improvement notice
            },
            
            # ===== EXEMPTIONS AND EXCEPTIONS =====
            'exemptions': {
                'small_business_employees': 10,  # Small business exemption threshold
                'micro_business_employees': 5,  # Micro business exemption threshold
                'startup_exemption_years': 3,  # Years of exemption for startups
                'women_empowerment': ['maternity', 'equal_pay', 'night_shift_protection']
            }
        }
    
    def get_rule(self, category: str, rule_name: str) -> Any:
        """Get a specific central rule"""
        try:
            return self.rules[category][rule_name]
        except KeyError:
            return None
    
    def get_category(self, category: str) -> Dict[str, Any]:
        """Get all rules in a category"""
        return self.rules.get(category, {})
    
    def get_all_rules(self) -> Dict[str, Any]:
        """Get all central rules"""
        return self.rules
    
    def check_wage_compliance(self, actual_wage: float, actual_payment_days: int) -> Dict[str, Any]:
        """Check compliance with wage laws"""
        violations = []
        
        # Check minimum wage
        min_wage = self.rules['wages']['minimum_wage_central']
        if actual_wage < min_wage:
            violations.append({
                'rule': 'Minimum Wage Violation',
                'expected': min_wage,
                'actual': actual_wage,
                'severity': 'high'
            })
        
        # Check payment delay
        due_days = self.rules['wages']['payment_due_days']
        if actual_payment_days > due_days:
            violations.append({
                'rule': 'Delayed Payment',
                'expected': due_days,
                'actual': actual_payment_days,
                'severity': 'medium'
            })
        
        return {
            'compliant': len(violations) == 0,
            'violations': violations,
            'severity': 'high' if any(v['severity'] == 'high' for v in violations) else 'medium'
        }
    
    def check_pf_compliance(self, employee_count: int, pf_remittance_rate: float) -> Dict[str, Any]:
        """Check compliance with PF laws"""
        violations = []
        eligibility = self.rules['social_security']['pf_eligibility_employees']
        
        if employee_count >= eligibility:
            if pf_remittance_rate < 0.9:  # Less than 90% remittance
                violations.append({
                    'rule': 'PF Compliance',
                    'expected': '100% remittance',
                    'actual': f"{pf_remittance_rate * 100:.1f}%",
                    'severity': 'high'
                })
        
        return {
            'compliant': len(violations) == 0,
            'violations': violations,
            'applicable': employee_count >= eligibility
        }
    
    def check_esi_compliance(self, employee_count: int, esi_remittance_rate: float) -> Dict[str, Any]:
        """Check compliance with ESI laws"""
        violations = []
        eligibility = self.rules['social_security']['esi_eligibility_employees']
        
        if employee_count >= eligibility:
            if esi_remittance_rate < 0.85:  # Less than 85% remittance
                violations.append({
                    'rule': 'ESI Compliance',
                    'expected': '100% remittance',
                    'actual': f"{esi_remittance_rate * 100:.1f}%",
                    'severity': 'high'
                })
        
        return {
            'compliant': len(violations) == 0,
            'violations': violations,
            'applicable': employee_count >= eligibility
        }
    
    def check_working_hours(self, avg_working_hours: float) -> Dict[str, Any]:
        """Check compliance with working hour laws"""
        violations = []
        max_hours = self.rules['safety_health']['max_working_hours_weekly']
        
        if avg_working_hours > max_hours:
            violations.append({
                'rule': 'Working Hours Exceeded',
                'expected': max_hours,
                'actual': avg_working_hours,
                'severity': 'medium'
            })
        
        return {
            'compliant': len(violations) == 0,
            'violations': violations
        }
