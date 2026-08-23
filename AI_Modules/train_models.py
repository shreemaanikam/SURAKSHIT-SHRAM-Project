"""
Training script for Surakshit Shram AI models
Run this after collecting training data
"""

import os
import json
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, r2_score, mean_absolute_error
import joblib
import cv2
import re


class SurakshitModelTrainer:
    """Train all AI models for Surakshit Shram"""
    
    def __init__(self):
        self.models_dir = "./models"
        os.makedirs(self.models_dir, exist_ok=True)
        print("=" * 60)
        print("🏋️ Surakshit Shram - AI Model Trainer")
        print("=" * 60)
    
    # ============ FRAUD DETECTION MODEL ============
    
    def train_fraud_detection_model(self):
        """
        Train Isolation Forest for fraud detection
        """
        print("\n🚨 Training Fraud Detection Model...")
        
        # Check if training data exists
        data_path = "./training_data/fraud_dataset.csv"
        if not os.path.exists(data_path):
            print(f"⚠️ Training data not found at {data_path}")
            print("📝 Please create training data with the following structure:")
            print("  - Columns: document_text, is_fraud (0/1)")
            print("  - Or use: word_count, numeric_count, unique_words_ratio, repeated_lines, is_fraud")
            return None
        
        try:
            df = pd.read_csv(data_path)
            
            # Extract features
            if 'document_text' in df.columns:
                # Extract features from text
                df['word_count'] = df['document_text'].apply(lambda x: len(str(x).split()))
                df['numeric_count'] = df['document_text'].apply(lambda x: len(re.findall(r'\d+', str(x))))
                df['unique_words_ratio'] = df['document_text'].apply(
                    lambda x: len(set(str(x).split())) / max(1, len(str(x).split()))
                )
                df['repeated_lines'] = df['document_text'].apply(self._count_repeated_lines)
            elif 'is_fraud' in df.columns:
                # Direct features
                feature_cols = ['word_count', 'numeric_count', 'unique_words_ratio', 'repeated_lines']
                if not all(col in df.columns for col in feature_cols):
                    print("❌ Missing required columns:", feature_cols)
                    print("📝 Expected columns: word_count, numeric_count, unique_words_ratio, repeated_lines, is_fraud")
                    return None
            else:
                print("❌ No is_fraud column found. Please label your data.")
                return None
            
            # Prepare features and target
            X = df[['word_count', 'numeric_count', 'unique_words_ratio', 'repeated_lines']].fillna(0)
            y = df['is_fraud']
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Train model
            model = IsolationForest(
                contamination=0.1,
                random_state=42,
                n_estimators=100
            )
            
            # Fit on training data (for anomaly detection, we use all training data)
            model.fit(X_train)
            
            # For evaluation, convert to fraud classification
            # We'll compare predictions with labels
            y_pred = model.predict(X_test)
            # Convert -1 to 1 (fraud) and 1 to 0 (normal)
            y_pred_binary = [1 if p == -1 else 0 for p in y_pred]
            
            # Evaluate
            if len(np.unique(y_test)) > 1:
                accuracy = accuracy_score(y_test, y_pred_binary)
                precision = precision_score(y_test, y_pred_binary, zero_division=0)
                recall = recall_score(y_test, y_pred_binary, zero_division=0)
                
                print(f"  ✅ Model trained successfully!")
                print(f"  📊 Accuracy: {accuracy:.4f}")
                print(f"  📊 Precision: {precision:.4f}")
                print(f"  📊 Recall: {recall:.4f}")
            else:
                print(f"  ✅ Model trained successfully on {len(X_train)} samples")
                print(f"  ⚠️ Limited evaluation due to imbalanced data")
            
            # Save model
            model_path = os.path.join(self.models_dir, "fraud_detection_model.pkl")
            joblib.dump(model, model_path)
            print(f"  💾 Model saved to: {model_path}")
            
            # Save scaler/feature info
            feature_info = {
                'feature_names': ['word_count', 'numeric_count', 'unique_words_ratio', 'repeated_lines'],
                'contamination': 0.1,
                'n_estimators': 100
            }
            with open(os.path.join(self.models_dir, "fraud_model_info.json"), 'w') as f:
                json.dump(feature_info, f, indent=2)
            
            return model
            
        except Exception as e:
            print(f"❌ Error training fraud detection model: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    # ============ RISK SCORECARD MODEL ============
    
    def train_risk_scorecard_model(self):
        """
        Train Random Forest for risk scoring
        """
        print("\n📈 Training Risk Scorecard Model...")
        
        data_path = "./training_data/risk_dataset.csv"
        if not os.path.exists(data_path):
            print(f"⚠️ Training data not found at {data_path}")
            print("📝 Please create training data with the following structure:")
            print("  - Features: payment_delay_days, missing_documents_count,")
            print("    previous_violations, employee_count, company_age_years")
            print("  - Target: actual_risk_score (0-100)")
            return None
        
        try:
            df = pd.read_csv(data_path)
            
            # Identify features
            feature_cols = ['payment_delay_days', 'missing_documents_count', 
                          'previous_violations', 'employee_count', 'company_age_years']
            
            # Check if all features exist
            existing_features = [col for col in feature_cols if col in df.columns]
            if not existing_features:
                print("❌ No expected features found. Please check your data.")
                print(f"📝 Expected columns: {feature_cols}")
                return None
            
            X = df[existing_features].fillna(0)
            y = df['actual_risk_score']
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            # Train model
            model = RandomForestRegressor(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                n_jobs=-1
            )
            model.fit(X_train, y_train)
            
            # Evaluate
            y_pred = model.predict(X_test)
            r2 = r2_score(y_test, y_pred)
            mae = mean_absolute_error(y_test, y_pred)
            
            print(f"  ✅ Model trained successfully!")
            print(f"  📊 R² Score: {r2:.4f}")
            print(f"  📊 MAE: {mae:.4f}")
            
            # Feature importance
            if hasattr(model, 'feature_importances_'):
                print("  📊 Feature Importance:")
                for feat, imp in zip(existing_features, model.feature_importances_):
                    print(f"    - {feat}: {imp:.4f}")
            
            # Save model
            model_path = os.path.join(self.models_dir, "risk_scorecard_model.pkl")
            joblib.dump(model, model_path)
            print(f"  💾 Model saved to: {model_path}")
            
            # Save feature info
            feature_info = {
                'feature_names': existing_features,
                'n_estimators': 100,
                'max_depth': 10
            }
            with open(os.path.join(self.models_dir, "risk_model_info.json"), 'w') as f:
                json.dump(feature_info, f, indent=2)
            
            return model
            
        except Exception as e:
            print(f"❌ Error training risk scorecard model: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    # ============ BIAS DETECTION MODEL (FIXED) ============
    
    def train_bias_detection_model(self):
        """
        Train bias detection model - FIXED JSON serialization
        """
        print("\n⚖️ Training Bias Detection Model...")
        
        data_path = "./training_data/bias_dataset.csv"
        if not os.path.exists(data_path):
            print(f"⚠️ Training data not found at {data_path}")
            print("📝 Please create training data with the following structure:")
            print("  - Columns: region, industry, business_size, risk_score, actual_decision")
            return None
        
        try:
            df = pd.read_csv(data_path)
            
            # Analyze bias in data
            bias_analysis = {}
            
            for dimension in ['region', 'industry', 'business_size']:
                if dimension in df.columns:
                    group_scores = {}
                    for group in df[dimension].unique():
                        mask = df[dimension] == group
                        if mask.sum() >= 10:
                            avg_score = df[mask]['risk_score'].mean()
                            group_scores[group] = float(avg_score)  # Convert to float
                    
                    if len(group_scores) >= 2:
                        max_score = max(group_scores.values())
                        min_score = min(group_scores.values())
                        
                        # Convert all values to native Python types for JSON serialization
                        bias_analysis[dimension] = {
                            'group_averages': {str(k): float(v) for k, v in group_scores.items()},
                            'max_score': float(max_score),
                            'min_score': float(min_score),
                            'disparity_ratio': float(max_score / min_score) if min_score > 0 else float('inf'),
                            'bias_detected': bool(max_score / min_score > 1.5) if min_score > 0 else False
                        }
            
            # Save bias analysis - with default=str to handle any remaining non-serializable types
            bias_path = os.path.join(self.models_dir, "bias_analysis.json")
            with open(bias_path, 'w') as f:
                json.dump(bias_analysis, f, indent=2, default=str)
            print(f"  ✅ Bias analysis completed!")
            print(f"  💾 Results saved to: {bias_path}")
            
            # Check for bias
            bias_detected = False
            for dimension, analysis in bias_analysis.items():
                if analysis.get('bias_detected', False):
                    bias_detected = True
                    print(f"  ⚠️ Bias detected in {dimension}:")
                    print(f"    Disparity ratio: {analysis['disparity_ratio']:.2f}")
                    print(f"    Group averages: {analysis['group_averages']}")
            
            if not bias_detected:
                print("  ✅ No significant bias detected in the data")
            
            return bias_analysis
            
        except Exception as e:
            print(f"❌ Error training bias detection model: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    # ============ HELPER FUNCTIONS ============
    
    def _count_repeated_lines(self, text):
        """Count repeated lines in text"""
        lines = str(text).split('\n')
        line_counts = {}
        for line in lines:
            if line.strip():
                line_counts[line] = line_counts.get(line, 0) + 1
        return sum(1 for count in line_counts.values() if count > 2)
    
    # ============ GENERATE SAMPLE DATA ============
    
    def generate_sample_data(self):
        """
        Generate sample training data for demonstration
        """
        print("\n📝 Generating sample training data...")
        
        os.makedirs("./training_data", exist_ok=True)
        
        # Sample fraud dataset
        np.random.seed(42)
        n_samples = 200
        
        fraud_data = []
        for i in range(n_samples):
            if i < n_samples // 2:  # Real documents
                word_count = np.random.randint(50, 500)
                numeric_count = np.random.randint(10, 80)
                unique_words_ratio = np.random.uniform(0.3, 0.7)
                repeated_lines = np.random.randint(0, 3)
                is_fraud = 0
            else:  # Fake documents
                word_count = np.random.randint(20, 200)
                numeric_count = np.random.randint(5, 40)
                unique_words_ratio = np.random.uniform(0.1, 0.4)
                repeated_lines = np.random.randint(3, 10)
                is_fraud = 1
            
            fraud_data.append({
                'word_count': word_count,
                'numeric_count': numeric_count,
                'unique_words_ratio': unique_words_ratio,
                'repeated_lines': repeated_lines,
                'is_fraud': is_fraud
            })
        
        fraud_df = pd.DataFrame(fraud_data)
        fraud_df.to_csv("./training_data/fraud_dataset.csv", index=False)
        print(f"  ✅ Fraud dataset created: {len(fraud_df)} samples")
        
        # Sample risk dataset
        risk_data = []
        for i in range(200):
            payment_delay = np.random.randint(0, 60)
            missing_docs = np.random.randint(0, 5)
            violations = np.random.randint(0, 10)
            employees = np.random.randint(5, 500)
            age_years = np.random.randint(1, 20)
            
            # Calculate risk score (with some noise)
            risk_score = (
                payment_delay * 1.2 +
                missing_docs * 5 +
                violations * 4 +
                np.random.normal(0, 5)
            )
            risk_score = max(0, min(100, risk_score))
            
            risk_data.append({
                'payment_delay_days': payment_delay,
                'missing_documents_count': missing_docs,
                'previous_violations': violations,
                'employee_count': employees,
                'company_age_years': age_years,
                'actual_risk_score': risk_score
            })
        
        risk_df = pd.DataFrame(risk_data)
        risk_df.to_csv("./training_data/risk_dataset.csv", index=False)
        print(f"  ✅ Risk dataset created: {len(risk_df)} samples")
        
        # Sample bias dataset
        regions = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata']
        industries = ['Manufacturing', 'IT', 'Construction', 'Healthcare', 'Retail']
        sizes = ['small', 'medium', 'large']
        
        bias_data = []
        for i in range(200):
            region = np.random.choice(regions)
            industry = np.random.choice(industries)
            size = np.random.choice(sizes)
            
            # Simulate some regional bias
            if region == 'Delhi':
                risk_score = np.random.randint(50, 80)
            elif region == 'Mumbai':
                risk_score = np.random.randint(30, 60)
            else:
                risk_score = np.random.randint(20, 50)
            
            # Simulate some industry bias
            if industry == 'Construction':
                risk_score += 10
            elif industry == 'IT':
                risk_score -= 5
            
            # Simulate size bias
            if size == 'small':
                risk_score += 8
            elif size == 'large':
                risk_score -= 5
            
            risk_score = max(0, min(100, risk_score))
            
            bias_data.append({
                'region': region,
                'industry': industry,
                'business_size': size,
                'risk_score': risk_score,
                'actual_decision': 'inspected' if risk_score > 60 else 'clear'
            })
        
        bias_df = pd.DataFrame(bias_data)
        bias_df.to_csv("./training_data/bias_dataset.csv", index=False)
        print(f"  ✅ Bias dataset created: {len(bias_df)} samples")
        
        print("  📁 Sample data saved to ./training_data/")
        return True
    
    # ============ TRAIN ALL MODELS ============
    
    def train_all(self, generate_samples=True):
        """
        Train all models
        """
        # Generate sample data if requested
        if generate_samples:
            if not os.path.exists("./training_data"):
                self.generate_sample_data()
            else:
                print("📁 Training data already exists. Skipping sample generation.")
        
        print("\n" + "=" * 60)
        print("🏋️ Training All Models")
        print("=" * 60)
        
        results = {}
        
        # Train fraud detection
        results['fraud_model'] = self.train_fraud_detection_model()
        
        # Train risk scorecard
        results['risk_model'] = self.train_risk_scorecard_model()
        
        # Train bias detection
        results['bias_analysis'] = self.train_bias_detection_model()
        
        print("\n" + "=" * 60)
        print("✅ Training Complete!")
        print("=" * 60)
        
        # Print summary
        print("\n📊 Training Summary:")
        print(f"  🚨 Fraud Detection Model: {'✅ Trained' if results['fraud_model'] else '❌ Failed'}")
        print(f"  📈 Risk Scorecard Model: {'✅ Trained' if results['risk_model'] else '❌ Failed'}")
        print(f"  ⚖️ Bias Analysis: {'✅ Completed' if results['bias_analysis'] else '❌ Failed'}")
        
        return results


# ============ MAIN ============

if __name__ == "__main__":
    trainer = SurakshitModelTrainer()
    
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--generate', '-g', action='store_true', help='Generate sample data')
    parser.add_argument('--skip-samples', '-s', action='store_true', help='Skip sample generation')
    args = parser.parse_args()
    
    if args.generate:
        trainer.generate_sample_data()
    
    trainer.train_all(generate_samples=not args.skip_samples)
