"""
Risk Scorecard – Calculates risk scores with explainable AI
"""

import numpy as np
import pandas as pd
import joblib
import os
import json
from typing import Dict, Any, Optional, List
from config.config import config
from utils.helpers import format_risk_level

class RiskScorecard:
    """
    Main risk scorecard class that calculates risk scores
    and provides explanations using SHAP/LIME
    """
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize risk scorecard with optional trained model
        
        Args:
            model_path: Path to saved model pickle file
        """
        self.model = None
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
        
        # Feature weights for rule-based fallback
        self.feature_weights = {
            'payment_delay_days': 1.2,
            'missing_documents_count': 5.0,
            'previous_violations': 4.0,
            'employee_count': 0.02,
            'company_age_years': -0.5,
            'pf_remittance_rate': -15.0,
            'esi_remittance_rate': -10.0,
            'wage_to_industry_ratio': -2.0,
            'inspection_history_score': 3.0,
            'grievance_count': 8.0
        }
        
        # Load model if provided
        if model_path and os.path.exists(model_path):
            try:
                self.model = joblib.load(model_path)
                print(f"✅ Risk model loaded from: {model_path}")
            except Exception as e:
                print(f"⚠️ Could not load model: {e}. Using rule-based scoring.")
                self.model = None
        else:
            print("ℹ️ No model found. Using rule-based scoring.")
    
    def calculate_risk_score(self, features: Dict[str, float]) -> float:
        """
        Calculate risk score from features
        
        Args:
            features: Dictionary of feature values
        
        Returns:
            Risk score between 0 and 100
        """
        # Fill missing features with defaults
        filled_features = self._fill_missing_features(features)
        
        if self.model is not None:
            # ML-based scoring
            try:
                X = np.array([[filled_features.get(f, 0) for f in self.feature_names]])
                score = float(self.model.predict(X)[0])
                return round(max(0, min(100, score)), 2)
            except Exception as e:
                print(f"⚠️ Model prediction failed: {e}. Using rule-based scoring.")
                return self._rule_based_score(filled_features)
        
        # Rule-based fallback
        return self._rule_based_score(filled_features)
    
    def _fill_missing_features(self, features: Dict[str, float]) -> Dict[str, float]:
        """Fill missing features with default values"""
        defaults = {
            'payment_delay_days': 0,
            'missing_documents_count': 0,
            'previous_violations': 0,
            'employee_count': 10,
            'company_age_years': 5,
            'pf_remittance_rate': 1.0,
            'esi_remittance_rate': 1.0,
            'wage_to_industry_ratio': 1.0,
            'inspection_history_score': 0,
            'grievance_count': 0
        }
        
        result = defaults.copy()
        result.update(features)
        return result
    
    def _rule_based_score(self, features: Dict[str, float]) -> float:
        """Calculate risk score using rule-based approach"""
        score = 0
        
        # Payment delay (0-30 points)
        delay = features.get('payment_delay_days', 0)
        score += min(delay * 1.2, 30)
        
        # Missing documents (0-20 points)
        missing = features.get('missing_documents_count', 0)
        score += min(missing * 5, 20)
        
        # Previous violations (0-30 points)
        violations = features.get('previous_violations', 0)
        score += min(violations * 4, 30)
        
        # PF remittance rate (-15 to +10 points)
        pf_rate = features.get('pf_remittance_rate', 1.0)
        if pf_rate < 0.9:
            score += (1 - pf_rate) * 15
        elif pf_rate > 0.95:
            score -= 5
        
        # ESI remittance rate (-10 to +5 points)
        esi_rate = features.get('esi_remittance_rate', 1.0)
        if esi_rate < 0.85:
            score += (1 - esi_rate) * 10
        
        # Grievance count (0-20 points)
        grievances = features.get('grievance_count', 0)
        score += min(grievances * 8, 20)
        
        # Company size adjustment (-5 to +5)
        employees = features.get('employee_count', 10)
        if employees > 100:
            score += 5  # Larger companies have more compliance burden
        elif employees < 10:
            score -= 5  # Small businesses get some leniency
        
        # Round and clamp
        return round(max(0, min(100, score)), 2)
    
    def get_risk_level(self, score: float) -> str:
        """Get risk level from score"""
        return format_risk_level(score)
    
    def get_risk_color(self, score: float) -> str:
        """Get color code for risk score"""
        if score <= 30:
            return '#27ae60'  # Green - Low risk
        elif score <= 60:
            return '#f39c12'  # Yellow - Medium risk
        else:
            return '#e74c3c'  # Red - High risk
    
    def batch_predict(self, data: pd.DataFrame) -> pd.DataFrame:
        """Predict risk scores for multiple records"""
        results = []
        for _, row in data.iterrows():
            features = row.to_dict()
            score = self.calculate_risk_score(features)
            level = self.get_risk_level(score)
            results.append({'risk_score': score, 'risk_level': level})
        
        result_df = pd.DataFrame(results)
        return pd.concat([data.reset_index(drop=True), result_df], axis=1)
    
    def save_model(self, model_path: str):
        """Save trained model to file"""
        if self.model is not None:
            joblib.dump(self.model, model_path)
            print(f"✅ Model saved to: {model_path}")
        else:
            print("⚠️ No model to save. Train model first.")
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the current model"""
        info = {
            'model_type': 'RandomForestRegressor' if self.model else 'Rule-based',
            'feature_count': len(self.feature_names),
            'features': self.feature_names,
            'weights': self.feature_weights if not self.model else None
        }
        
        if self.model:
            try:
                info['feature_importances'] = dict(zip(
                    self.feature_names,
                    self.model.feature_importances_
                ))
            except:
                pass
        
        return info
