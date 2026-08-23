"""
Model Trainer – Train and optimize risk prediction models
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib
import os
from typing import Dict, Any, Optional

class RiskModelTrainer:
    """Train and optimize risk prediction models"""
    
    def __init__(self, model_path: Optional[str] = None):
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
        self.results = {}
        
        if model_path and os.path.exists(model_path):
            self.model = joblib.load(model_path)
    
    def train(self, data_path: str, target_col: str = 'actual_risk_score') -> Dict[str, Any]:
        """
        Train Random Forest model on historical data
        
        Args:
            data_path: Path to CSV training data
            target_col: Name of the target column
        
        Returns:
            Training results with metrics
        """
        # Load data
        df = pd.read_csv(data_path)
        
        # Prepare features and target
        X = df[self.feature_names].fillna(0)
        y = df[target_col]
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Hyperparameter tuning
        param_grid = {
            'n_estimators': [50, 100, 150],
            'max_depth': [5, 8, 10, 12],
            'min_samples_split': [2, 5, 10],
            'min_samples_leaf': [1, 2, 4],
            'max_features': ['sqrt', 'log2', None]
        }
        
        print("🔍 Searching for optimal hyperparameters...")
        
        grid_search = GridSearchCV(
            RandomForestRegressor(random_state=42),
            param_grid,
            cv=5,
            scoring='neg_mean_squared_error',
            n_jobs=-1,
            verbose=1
        )
        grid_search.fit(X_train, y_train)
        
        # Best model
        self.model = grid_search.best_estimator_
        
        # Evaluate
        y_pred = self.model.predict(X_test)
        
        results = {
            'best_params': grid_search.best_params_,
            'best_score': abs(grid_search.best_score_),
            'r2_score': r2_score(y_test, y_pred),
            'mae': mean_absolute_error(y_test, y_pred),
            'rmse': np.sqrt(mean_squared_error(y_test, y_pred)),
            'feature_importances': dict(zip(self.feature_names, self.model.feature_importances_)),
            'train_size': len(X_train),
            'test_size': len(X_test)
        }
        
        self.results = results
        
        print("\n" + "=" * 50)
        print("📊 TRAINING RESULTS")
        print("=" * 50)
        print(f"✅ Best Parameters: {results['best_params']}")
        print(f"📈 R² Score: {results['r2_score']:.4f}")
        print(f"📉 MAE: {results['mae']:.4f}")
        print(f"📉 RMSE: {results['rmse']:.4f}")
        print("\n📊 Feature Importances:")
        for feat, imp in sorted(results['feature_importances'].items(), key=lambda x: x[1], reverse=True):
            print(f"  - {feat}: {imp:.4f}")
        print("=" * 50)
        
        return results
    
    def cross_validate(self, data_path: str, cv: int = 5) -> Dict[str, float]:
        """Perform cross-validation"""
        df = pd.read_csv(data_path)
        X = df[self.feature_names].fillna(0)
        y = df['actual_risk_score']
        
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        
        scores = cross_val_score(model, X, y, cv=cv, scoring='r2')
        
        return {
            'cv_scores': scores.tolist(),
            'cv_mean': scores.mean(),
            'cv_std': scores.std()
        }
    
    def save_model(self, model_path: str):
        """Save trained model"""
        if self.model:
            joblib.dump(self.model, model_path)
            print(f"✅ Model saved to: {model_path}")
        else:
            print("⚠️ No model to save. Train first.")
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get model information"""
        if self.model is None:
            return {'status': 'No model trained'}
        
        return {
            'status': 'Trained',
            'model_type': type(self.model).__name__,
            'feature_names': self.feature_names,
            'results': self.results
        }
