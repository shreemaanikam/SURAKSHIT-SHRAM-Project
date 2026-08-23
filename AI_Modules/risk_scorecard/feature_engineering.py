"""
Feature Engineering – Create and transform features for risk scoring
"""

import pandas as pd
import numpy as np
from typing import Dict, Any, List

class FeatureEngineer:
    """Feature engineering for risk scorecard"""
    
    def __init__(self):
        self.feature_names = [
            'payment_delay_days',
            'missing_documents_count',
            'previous_violations',
            'employee_count',
            'company_age_years',
            'pf_remittance_rate',
            'esi_remittance_rate',
            'wage_to_industry_ratio',
            'inspection_history_score',
            'grievance_count'
        ]
    
    def create_features(self, raw_data: Dict[str, Any]) -> Dict[str, float]:
        """
        Create engineered features from raw data
        
        Args:
            raw_data: Raw company data
        
        Returns:
            Engineered features
        """
        features = {}
        
        # Basic features
        features['payment_delay_days'] = self._calculate_payment_delay(raw_data)
        features['missing_documents_count'] = self._count_missing_documents(raw_data)
        features['previous_violations'] = raw_data.get('previous_violations', 0)
        features['employee_count'] = raw_data.get('employee_count', 10)
        features['company_age_years'] = self._calculate_company_age(raw_data)
        
        # Derived features
        features['pf_remittance_rate'] = self._calculate_pf_rate(raw_data)
        features['esi_remittance_rate'] = self._calculate_esi_rate(raw_data)
        features['wage_to_industry_ratio'] = self._calculate_wage_ratio(raw_data)
        features['inspection_history_score'] = self._calculate_inspection_score(raw_data)
        features['grievance_count'] = raw_data.get('grievance_count', 0)
        
        return features
    
    def _calculate_payment_delay(self, data: Dict) -> float:
        """Calculate average payment delay in days"""
        delays = data.get('payment_delays', [])
        if delays:
            return np.mean(delays)
        return data.get('payment_delay_days', 0)
    
    def _count_missing_documents(self, data: Dict) -> float:
        """Count missing compliance documents"""
        required_docs = ['salary_sheet', 'attendance_log', 'contractor_list', 'pf_challan', 'esi_challan']
        uploaded = data.get('uploaded_documents', [])
        return len([doc for doc in required_docs if doc not in uploaded])
    
    def _calculate_company_age(self, data: Dict) -> float:
        """Calculate company age in years"""
        if 'incorporation_date' in data:
            from datetime import datetime
            try:
                inc_date = pd.to_datetime(data['incorporation_date'])
                return (datetime.now() - inc_date).days / 365.25
            except:
                pass
        return data.get('company_age_years', 5)
    
    def _calculate_pf_rate(self, data: Dict) -> float:
        """Calculate PF remittance rate"""
        if 'pf_remittance_rate' in data:
            return data['pf_remittance_rate']
        
        expected_pf = data.get('expected_pf', 0)
        actual_pf = data.get('actual_pf', 0)
        
        if expected_pf > 0:
            return min(1.0, actual_pf / expected_pf)
        return 1.0
    
    def _calculate_esi_rate(self, data: Dict) -> float:
        """Calculate ESI remittance rate"""
        if 'esi_remittance_rate' in data:
            return data['esi_remittance_rate']
        
        expected_esi = data.get('expected_esi', 0)
        actual_esi = data.get('actual_esi', 0)
        
        if expected_esi > 0:
            return min(1.0, actual_esi / expected_esi)
        return 1.0
    
    def _calculate_wage_ratio(self, data: Dict) -> float:
        """Calculate wage to industry ratio"""
        if 'wage_to_industry_ratio' in data:
            return data['wage_to_industry_ratio']
        
        avg_wage = data.get('avg_wage', 0)
        industry_avg = data.get('industry_avg_wage', 20000)
        
        if industry_avg > 0:
            return avg_wage / industry_avg
        return 1.0
    
    def _calculate_inspection_score(self, data: Dict) -> float:
        """Calculate historical inspection score"""
        if 'inspection_history_score' in data:
            return data['inspection_history_score']
        
        inspections = data.get('past_inspections', [])
        if not inspections:
            return 0
        
        # Score based on inspection outcomes
        scores = []
        for inspection in inspections:
            if inspection.get('status') == 'compliant':
                scores.append(0)
            elif inspection.get('status') == 'notice':
                scores.append(30)
            elif inspection.get('status') == 'violation':
                scores.append(60)
            elif inspection.get('status') == 'penalty':
                scores.append(90)
        
        return np.mean(scores) if scores else 0
    
    def standardize_features(self, X: pd.DataFrame) -> pd.DataFrame:
        """Standardize features (z-score normalization)"""
        return (X - X.mean()) / X.std() if X.std().sum() > 0 else X
