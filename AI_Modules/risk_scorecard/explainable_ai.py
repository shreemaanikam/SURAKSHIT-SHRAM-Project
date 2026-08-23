"""
Explainable AI – Provides SHAP/LIME explanations for risk scores
"""

import numpy as np
import pandas as pd
import joblib
from typing import Dict, Any, List, Optional
from utils.helpers import format_risk_level

try:
    import shap
    _HAS_SHAP = True
except ImportError:
    shap = None
    _HAS_SHAP = False


class ExplainableAI:
    """
    Explainable AI module that generates human-readable explanations
    for risk scores using SHAP or feature importance fallback.
    """
    
    def __init__(self):
        self.explainer = None
        self.model = None
        self.background_data = None
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
        
        # Human-readable feature descriptions
        self.feature_descriptions = {
            'payment_delay_days': 'Number of days payment was delayed',
            'missing_documents_count': 'Number of missing compliance documents',
            'previous_violations': 'Number of previous compliance violations',
            'employee_count': 'Total number of employees',
            'company_age_years': 'Age of the company in years',
            'pf_remittance_rate': 'Provident Fund remittance rate (0-1)',
            'esi_remittance_rate': 'ESI remittance rate (0-1)',
            'wage_to_industry_ratio': 'Wage compared to industry average',
            'inspection_history_score': 'Historical inspection score',
            'grievance_count': 'Number of worker grievances filed'
        }
    
    def attach_model(self, model, background_data: Optional[pd.DataFrame] = None):
        """Attach a trained model to the explainer"""
        self.model = model
        self.background_data = background_data
        
        if _HAS_SHAP and model is not None:
            try:
                if hasattr(model, 'predict_proba'):
                    if background_data is not None:
                        self.explainer = shap.TreeExplainer(model, background_data)
                    else:
                        self.explainer = shap.TreeExplainer(model)
            except Exception as e:
                print(f"SHAP initialization notice: {e}. Using feature importance fallback.")
                self.explainer = None

    def explain_instance(self, instance: pd.DataFrame) -> Dict[str, Any]:
        """Generate explanations for a single instance"""
        if self.model is None:
            return self._generate_rule_based_explanation(instance)
            
        try:
            if _HAS_SHAP and self.explainer is not None:
                shap_values = self.explainer.shap_values(instance)
                if isinstance(shap_values, list):
                    shap_values = shap_values[1]  # positive class
                
                vals = shap_values[0]
                feature_importance = []
                for i, col in enumerate(instance.columns):
                    feature_importance.append({
                        'feature': col,
                        'description': self.feature_descriptions.get(col, col),
                        'value': float(instance.iloc[0][col]),
                        'impact': float(vals[i]),
                        'abs_impact': float(abs(vals[i]))
                    })
                feature_importance.sort(key=lambda x: x['abs_impact'], reverse=True)
                return {
                    'explanation_type': 'SHAP',
                    'top_factors': feature_importance[:5],
                    'all_factors': feature_importance
                }
        except Exception as e:
            print(f"SHAP calculation fallback: {e}")
            
        return self._generate_rule_based_explanation(instance)

    def _generate_rule_based_explanation(self, instance: pd.DataFrame) -> Dict[str, Any]:
        """Generate rule-based explanation when SHAP model is unattached/unavailable"""
        factors = []
        for col in instance.columns:
            val = float(instance.iloc[0][col])
            impact = 0.0
            if col in ('payment_delay_days', 'missing_documents_count', 'previous_violations', 'grievance_count'):
                impact = val * 2.5
            elif col in ('pf_remittance_rate', 'esi_remittance_rate'):
                impact = (1.0 - val) * 20.0
            
            factors.append({
                'feature': col,
                'description': self.feature_descriptions.get(col, col),
                'value': val,
                'impact': round(impact, 2),
                'abs_impact': round(abs(impact), 2)
            })
        factors.sort(key=lambda x: x['abs_impact'], reverse=True)
        return {
            'explanation_type': 'RULE_BASED_FEATURE_IMPORTANCE',
            'top_factors': factors[:5],
            'all_factors': factors
        }
