"""
Model Integration with Backend
Provides APIs for frontend and backend integration
"""

import json
from typing import Dict, Any
from ocr_engine import TesseractEngine, EasyOCREngine
from fraud_detection import FraudDetector, EPFOComparator
from bias_detection import BiasChecker

class ModelAPIIntegration:
    """API Integration class for all AI models"""
    
    def __init__(self):
        # Initialize all models
        self.tesseract = TesseractEngine(lang='eng+hin')
        self.easyocr = EasyOCREngine(languages=['en', 'hi'])
        self.fraud_detector = FraudDetector()
        self.epfo_comparator = EPFOComparator()
        self.bias_checker = BiasChecker()
    
    def process_document(self, image_path: str, company_lin: str = None) -> Dict[str, Any]:
        """
        Process a document through the entire pipeline
        
        Args:
            image_path: Path to uploaded document
            company_lin: Company LIN for EPFO comparison
            
        Returns:
            dict: Complete analysis result
        """
        result = {
            'document_analysis': {},
            'fraud_detection': {},
            'epfo_comparison': {},
            'risk_assessment': {}
        }
        
        # Step 1: OCR Extraction
        text = self.tesseract.extract_text(image_path)
        
        if not text or len(text.strip()) < 10:
            # Try EasyOCR as fallback
            easy_result = self.easyocr.extract_text(image_path)
            if easy_result:
                text = ' '.join(easy_result)
        
        result['document_analysis'] = {
            'extracted_text': text[:1000],  # Truncate for display
            'text_length': len(text),
            'ocr_success': len(text) > 50
        }
        
        # Step 2: Fraud Detection
        if text:
            fraud_result = self.fraud_detector.analyze_document(text)
            result['fraud_detection'] = fraud_result
        
        # Step 3: EPFO Comparison
        if text and company_lin:
            epfo_result = self.epfo_comparator.get_discrepancy_report(text, company_lin)
            result['epfo_comparison'] = epfo_result
        
        # Step 4: Risk Assessment
        risk_score = self.calculate_risk_score(result)
        result['risk_assessment'] = {
            'risk_score': risk_score,
            'risk_level': self.get_risk_level(risk_score)
        }
        
        return result
    
    def calculate_risk_score(self, analysis: Dict) -> float:
        """
        Calculate overall risk score from analysis results
        """
        score = 0
        
        # Fraud detection contribution
        if analysis.get('fraud_detection', {}).get('is_fraud'):
            score += 30
            
        fraud_confidence = analysis.get('fraud_detection', {}).get('confidence', 0)
        score += fraud_confidence * 30
        
        # EPFO contribution
        if analysis.get('epfo_comparison', {}).get('has_discrepancy'):
            score += 20
            
        severity = analysis.get('epfo_comparison', {}).get('severity', 'low')
        if severity == 'high':
            score += 15
        elif severity == 'medium':
            score += 8
        
        # Normalize to 0-100
        return min(score, 100)
    
    def get_risk_level(self, score: float) -> str:
        """Get risk level from score"""
        if score >= 70:
            return 'High'
        elif score >= 40:
            return 'Medium'
        else:
            return 'Low'
    
    def apply_bias_correction(self, company_id: str, region: str, 
                             industry: str, business_size: str, 
                             risk_score: float) -> Dict:
        """
        Apply bias correction to risk score
        """
        # Log the decision
        self.bias_checker.log_decision(
            company_id, region, industry, business_size, risk_score, 'assessed'
        )
        
        # Apply adjustment
        adjusted = self.bias_checker.adjust_risk_score(
            company_id, region, industry, business_size, risk_score
        )
        
        return adjusted
    
    def get_integration_response(self, image_path: str, company_id: str, 
                                company_lin: str, region: str, 
                                industry: str, business_size: str) -> Dict:
        """
        Complete integration response for backend
        """
        # Process document
        analysis = self.process_document(image_path, company_lin)
        
        # Apply bias correction
        risk_score = analysis['risk_assessment']['risk_score']
        corrected = self.apply_bias_correction(
            company_id, region, industry, business_size, risk_score
        )
        
        # Build final response
        response = {
            'success': True,
            'company_id': company_id,
            'risk_assessment': {
                'original_score': analysis['risk_assessment']['risk_score'],
                'adjusted_score': corrected['adjusted_score'],
                'risk_level': self.get_risk_level(corrected['adjusted_score']),
                'bias_correction_applied': corrected['adjustment_applied'],
                'correction_reason': corrected['reason']
            },
            'fraud_detection': {
                'is_fraud': analysis['fraud_detection'].get('is_fraud', False),
                'confidence': analysis['fraud_detection'].get('confidence', 0),
                'reasons': analysis['fraud_detection'].get('reasons', [])
            },
            'epfo_comparison': analysis.get('epfo_comparison', {}),
            'document_analysis': analysis['document_analysis']
        }
        
        return response
