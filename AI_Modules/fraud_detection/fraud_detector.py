"""
Fraud Detection Module
Detects fake or manipulated wage documents using anomaly detection
"""

import re
import json
import numpy as np
from sklearn.ensemble import IsolationForest

class FraudDetector:
    """Detect fraudulent salary sheets and compliance documents"""
    
    def __init__(self):
        self.model = None
        self._initialize_model()
    
    def _initialize_model(self):
        """Initialize Isolation Forest for anomaly detection"""
        self.model = IsolationForest(
            contamination=0.1,
            random_state=42,
            n_estimators=100
        )
    
    def extract_features(self, document_text):
        """Extract features from document for fraud detection"""
        features = {
            'word_count': len(document_text.split()),
            'line_count': len(document_text.split('\n')),
            'numeric_count': len(re.findall(r'\d+', document_text)),
            'decimal_count': len(re.findall(r'\d+\.\d+', document_text)),
            'unique_words_ratio': len(set(document_text.split())) / max(1, len(document_text.split())),
            'repeated_lines': self._count_repeated_lines(document_text),
            'suspicious_rounding': len(re.findall(r'\d{4,}\.00', document_text))
        }
        return features
    
    def _count_repeated_lines(self, text):
        """Count how many lines are repeated"""
        lines = text.split('\n')
        line_counts = {}
        for line in lines:
            if line.strip():
                line_counts[line] = line_counts.get(line, 0) + 1
        
        repeated = sum(1 for count in line_counts.values() if count > 2)
        return repeated
    
    def check_fraudulent_document(self, document_text):
        """
        Check if a document is likely fraudulent
        
        Returns:
            dict: {
                'is_fraud': bool,
                'confidence': float,
                'reasons': list,
                'features': dict
            }
        """
        reasons = []
        
        # Rule-based checks
        if len(document_text.strip()) < 50:
            reasons.append('Document too short')
        
        round_numbers = re.findall(r'\d{4,}\.00', document_text)
        if len(round_numbers) > 5:
            reasons.append(f'Excessive round numbers found: {len(round_numbers)}')
        
        salaries = re.findall(r'₹?\s*[\d,]+\.?\d*', document_text)
        if salaries and len(set(salaries)) == 1 and len(salaries) > 2:
            reasons.append('All salaries are identical - suspicious')
        
        required = ['employee', 'salary', 'month']
        missing = [kw for kw in required if kw not in document_text.lower()]
        if missing:
            reasons.append(f'Missing keywords: {", ".join(missing)}')
        
        repeated = self._count_repeated_lines(document_text)
        if repeated > 5:
            reasons.append(f'Excessive repeated lines: {repeated}')
        
        # Feature-based anomaly detection
        features = self.extract_features(document_text)
        feature_vector = np.array([[
            features['word_count'],
            features['numeric_count'],
            features['unique_words_ratio'],
            features['repeated_lines'],
            features['suspicious_rounding']
        ]])
        
        try:
            prediction = self.model.fit_predict(feature_vector)
            if prediction[0] == -1:
                reasons.append('Statistical anomaly detected')
        except:
            pass
        
        is_fraud = len(reasons) > 0
        confidence = min(1.0, len(reasons) * 0.2)
        
        return {
            'is_fraud': is_fraud,
            'confidence': confidence,
            'reasons': reasons,
            'features': features
        }
    
    def analyze_document(self, document_text):
        """Analyze document and return detailed fraud report"""
        result = self.check_fraudulent_document(document_text)
        
        # Generate risk level
        if result['is_fraud']:
            if result['confidence'] > 0.6:
                risk_level = 'High'
            elif result['confidence'] > 0.3:
                risk_level = 'Medium'
            else:
                risk_level = 'Low'
        else:
            risk_level = 'Low'
        
        result['risk_level'] = risk_level
        
        return result
