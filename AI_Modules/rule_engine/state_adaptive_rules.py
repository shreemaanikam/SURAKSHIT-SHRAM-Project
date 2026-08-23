"""
State-Adaptive Rules – State-specific labor law amendments
Each state has its own minimum wage, overtime rates, and special provisions
"""

from typing import Dict, Any, List, Optional
from .central_rules import CentralRules


class StateAdaptiveRules:
    """State-specific labor law rules"""
    
    def __init__(self):
        self.state_rules = self._load_state_rules()
        self.central_rules = CentralRules()
    
    def _load_state_rules(self) -> Dict[str, Any]:
        """Load state-specific rules for all states"""
        return {
            # ===== MAHARASHTRA =====
            'Maharashtra': {
                'minimum_wage': {
                    'daily': 220,
                    'monthly': 5720,
                    'classification': 'skill_based'
                },
                'overtime_rate': 2.5,
                'weekly_holiday': 'Sunday',
                'special_allowances': ['house_rent_allowance', 'city_compensatory_allowance'],
                'festival_bonus': 0.0833,  # 8.33% of salary
                'local_holidays': ['Gudi Padwa', 'Maharashtra Day', 'Dussehra'],
                'special_provisions': {
                    'contract_labor': 'registration_required',
                    'women_night_shift': 'permitted_with_consent',
                    'shops_act': 'applicable'
                },
                'penalties': {
                    'minimum_wage_violation': 60000,
                    'delayed_payment': 0.015  # 1.5% per day
                }
            },
            
            # ===== DELHI =====
            'Delhi': {
                'minimum_wage': {
                    'unskilled': 650,
                    'semi_skilled': 715,
                    'skilled': 785
                },
                'overtime_rate': 2.0,
                'weekly_holiday': 'Sunday',
                'special_allowances': ['dearness_allowance'],
                'local_holidays': ['Republic Day', 'Independence Day', 'Gandhi Jayanti', 'Diwali'],
                'special_provisions': {
                    'contract_labor': 'strict_compliance',
                    'women_night_shift': 'permitted_with_cab_facility',
                    'shops_act': 'applicable_24_7_for_it'
                },
                'penalties': {
                    'minimum_wage_violation': 50000,
                    'delayed_payment': 0.01
                }
            },
            
            # ===== KARNATAKA =====
            'Karnataka': {
                'minimum_wage': {
                    'daily': 210,
                    'monthly': 5460
                },
                'overtime_rate': 2.0,
                'weekly_holiday': 'Sunday',
                'special_allowances': ['vda'],  # Variable Dearness Allowance
                'festival_bonus': 0.0833,
                'local_holidays': ['Kannada Rajyotsava', 'Ayudha Puja', 'Deepavali'],
                'special_provisions': {
                    'it_sector_exemption': 'standing_orders_exempted',
                    'women_night_shift': 'permitted_with_security',
                    'contract_labor': 'online_registration'
                },
                'penalties': {
                    'minimum_wage_violation': 50000,
                    'delayed_payment': 0.01
                }
            },
            
            # ===== TAMIL NADU =====
            'Tamil Nadu': {
                'minimum_wage': {
                    'daily': 200,
                    'monthly': 5200
                },
                'overtime_rate': 2.0,
                'weekly_holiday': 'Sunday',
                'special_allowances': ['cpi_linked_vda'],
                'local_holidays': ['Pongal', 'Tamil New Year', 'Ayudha Puja'],
                'special_provisions': {
                    'catering_establishments': 'special_rules',
                    'women_night_shift': 'permitted_with_transport',
                    'catering_act': 'applicable'
                },
                'penalties': {
                    'minimum_wage_violation': 50000,
                    'delayed_payment': 0.01
                }
            },
            
            # ===== GUJARAT =====
            'Gujarat': {
                'minimum_wage': {
                    'daily': 190,
                    'monthly': 4940
                },
                'overtime_rate': 2.0,
                'weekly_holiday': 'Sunday',
                'special_allowances': ['special_allowance_vda'],
                'local_holidays': ['Uttarayan', 'Diwali', 'New Year'],
                'special_provisions': {
                    'sez_units': 'labor_flexibility',
                    'women_night_shift': 'permitted',
                    'self_certification': 'available_for_msme'
                },
                'penalties': {
                    'minimum_wage_violation': 45000,
                    'delayed_payment': 0.01
                }
            },
            
            # ===== HARYANA =====
            'Haryana': {
                'minimum_wage': {
                    'daily': 230,
                    'monthly': 5980
                },
                'overtime_rate': 2.0,
                'weekly_holiday': 'Sunday',
                'special_allowances': ['consumer_price_index_allowance'],
                'local_holidays': ['Haryana Day', 'Diwali', 'Holi'],
                'special_provisions': {
                    'local_candidate_employment': '75_percent_quota',  # Local hiring rule
                    'women_night_shift': 'permitted_with_safety',
                    'auto_cluster': 'special_inspection_norms'
                },
                'penalties': {
                    'minimum_wage_violation': 50000,
                    'delayed_payment': 0.01
                }
            }
        }
    
    def get_state_rules(self, state: str) -> Optional[Dict[str, Any]]:
        """Get rules for a specific state"""
        return self.state_rules.get(state)
    
    def calculate_state_minimum_wage(self, state: str, skill_level: str = 'unskilled') -> float:
        """Calculate state-specific minimum wage"""
        state_data = self.get_state_rules(state)
        if not state_data:
            return self.central_rules.rules['wages']['minimum_wage_central']
            
        wages = state_data['minimum_wage']
        if isinstance(wages, dict):
            if skill_level in wages:
                return float(wages[skill_level])
            elif 'daily' in wages:
                return float(wages['daily'])
        return float(wages)
