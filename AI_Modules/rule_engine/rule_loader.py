"""
Rule Loader – Load and manage rules from JSON/CSV files
Supports dynamic rule updates from government gazettes
"""

import json
import os
import pandas as pd
from typing import Dict, Any, List, Optional
from config.config import config

class RuleLoader:
    """Load and manage rules from external sources"""
    
    def __init__(self, rules_dir: Optional[str] = None):
        self.rules_dir = rules_dir or os.path.join(config.BASE_DIR, 'data', 'rules')
        os.makedirs(self.rules_dir, exist_ok=True)
        self.cached_rules = {}
    
    def load_central_rules_from_file(self) -> Dict[str, Any]:
        """Load central rules from JSON file"""
        filepath = os.path.join(self.rules_dir, 'central_rules.json')
        
        if os.path.exists(filepath):
            with open(filepath, 'r') as f:
                return json.load(f)
        
        # Return default rules if file doesn't exist
        return self._get_default_central_rules()
    
    def load_state_rules_from_file(self, state: str) -> Dict[str, Any]:
        """Load state-specific rules from JSON file"""
        filepath = os.path.join(self.rules_dir, f'state_rules_{state.lower()}.json')
        
        if os.path.exists(filepath):
            with open(filepath, 'r') as f:
                return json.load(f)
        
        return None
    
    def save_central_rules(self, rules: Dict[str, Any]) -> bool:
        """Save central rules to JSON file"""
        try:
            filepath = os.path.join(self.rules_dir, 'central_rules.json')
            with open(filepath, 'w') as f:
                json.dump(rules, f, indent=2, default=str)
            return True
        except Exception as e:
            print(f"Error saving central rules: {e}")
            return False
    
    def save_state_rules(self, state: str, rules: Dict[str, Any]) -> bool:
        """Save state-specific rules to JSON file"""
        try:
            filepath = os.path.join(self.rules_dir, f'state_rules_{state.lower()}.json')
            with open(filepath, 'w') as f:
                json.dump(rules, f, indent=2, default=str)
            return True
        except Exception as e:
            print(f"Error saving state rules: {e}")
            return False
    
    def load_rules_from_csv(self, filepath: str) -> pd.DataFrame:
        """Load rules from CSV file"""
        if os.path.exists(filepath):
            return pd.read_csv(filepath)
        return pd.DataFrame()
    
    def _get_default_central_rules(self) -> Dict[str, Any]:
        """Get default central rules"""
        return {
            'wages': {
                'minimum_wage_central': 176,
                'payment_due_days': 7,
                'overtime_rate': 2.0,
                'bonus_threshold': 21000,
                'bonus_percentage': 8.33,
                'gratuity_years': 5
            },
            'social_security': {
                'pf_rate': 0.12,
                'pf_eligible_salary': 15000,
                'pf_eligibility_employees': 20,
                'esi_rate_employer': 0.0325,
                'esi_rate_employee': 0.0075,
                'esi_eligible_salary': 21000,
                'esi_eligibility_employees': 10,
                'gig_worker_coverage': True
            },
            'safety_health': {
                'max_working_hours_weekly': 48,
                'max_working_hours_daily': 9,
                'weekly_holiday_compulsory': True,
                'rest_interval_hours': 5,
                'rest_interval_duration': 30,
                'registration_threshold': 10
            }
        }
    
    def update_rules_from_gazette(self, gazette_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update rules from government gazette notification
        
        Args:
            gazette_data: JSON data from gazette notification
        
        Returns:
            Updated rules
        """
        updated_rules = {}
        
        # Check for minimum wage updates
        if 'minimum_wage' in gazette_data:
            updated_rules['minimum_wage_central'] = gazette_data['minimum_wage']
        
        # Check for PF rate updates
        if 'pf_rate' in gazette_data:
            updated_rules['pf_rate'] = gazette_data['pf_rate']
        
        # Check for ESI rate updates
        if 'esi_rate' in gazette_data:
            updated_rules['esi_rate'] = gazette_data['esi_rate']
        
        # Check for working hours updates
        if 'max_working_hours' in gazette_data:
            updated_rules['max_working_hours'] = gazette_data['max_working_hours']
        
        # Save updated rules
        if updated_rules:
            current_rules = self.load_central_rules_from_file()
            current_rules.update(updated_rules)
            self.save_central_rules(current_rules)
        
        return updated_rules
    
    def get_state_rules_from_api(self, state: str) -> Optional[Dict[str, Any]]:
        """
        Fetch state rules from government API
        
        Note: This is a placeholder. Actual implementation would call
        an external API for real-time rule updates.
        """
        # Placeholder - returns None for now
        return None
