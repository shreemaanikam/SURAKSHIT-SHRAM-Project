"""
Surakshit Shram - AI Engine Main Entry Point
Complete AI-Driven Smart Inspection System for Labour Code Compliance

This is the main file that integrates all modules:
1. OCR Engine (Tesseract + EasyOCR)
2. Fraud Detection Model
3. Bias Detection and Correction System
4. Model Integration with Backend
"""

import os
import sys
import json
import argparse
from datetime import datetime
import cv2
import numpy as np

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import all modules
from ocr_engine import TesseractEngine, EasyOCREngine, DocumentPreprocessor
from fraud_detection import FraudDetector, EPFOComparator
from bias_detection import BiasChecker
from model_integration import ModelAPIIntegration


class SurakshitAI:
    """
    Main AI Engine Class
    Integrates all components into a single unified system
    """
    
    def __init__(self):
        """Initialize all AI components"""
        print("=" * 60)
        print("🚀 Initializing Surakshit Shram AI Engine...")
        print("=" * 60)
        
        # Initialize all components
        self.preprocessor = DocumentPreprocessor()
        self.tesseract = TesseractEngine(lang='eng+hin')
        self.easyocr = EasyOCREngine(languages=['en', 'hi'], gpu=True)
        self.fraud_detector = FraudDetector()
        self.epfo_comparator = EPFOComparator()
        self.bias_checker = BiasChecker()
        self.api_integration = ModelAPIIntegration()
        
        # Statistics tracking
        self.stats = {
            'documents_processed': 0,
            'frauds_detected': 0,
            'bias_corrections_applied': 0,
            'errors': 0
        }
        
        print("✅ All components initialized successfully!")
        print("=" * 60)
    
    # ============ DOCUMENT PROCESSING ============
    
    def process_salary_sheet(self, image_path, company_lin=None):
        """
        Process a salary sheet document
        
        Args:
            image_path: Path to the scanned salary sheet
            company_lin: Company LIN for EPFO comparison
        
        Returns:
            dict: Complete analysis results
        """
        print(f"\n📄 Processing Salary Sheet: {image_path}")
        result = {
            'document_type': 'salary_sheet',
            'timestamp': datetime.now().isoformat(),
            'status': 'processing'
        }
        
        try:
            # Step 1: OCR Extraction
            print("  🔍 Step 1: OCR Extraction...")
            text = self.tesseract.extract_text(image_path, psm=6)
            
            if not text or len(text.strip()) < 50:
                print("  ⚠️ Tesseract low confidence, trying EasyOCR...")
                easy_result = self.easyocr.extract_text(image_path)
                if easy_result:
                    text = ' '.join(easy_result)
            
            if not text or len(text.strip()) < 50:
                print("  ❌ OCR failed - text extraction unsuccessful")
                result['status'] = 'failed'
                result['error'] = 'Could not extract text from document'
                return result
            
            print(f"  ✅ Text extracted ({len(text)} characters)")
            result['extracted_text'] = text[:2000]  # Store first 2000 chars
            
            # Step 2: Parse salary data
            print("  📊 Step 2: Parsing salary data...")
            salary_data = self._parse_salary_data(text)
            result['salary_data'] = salary_data
            
            # Step 3: Fraud Detection
            print("  🚨 Step 3: Fraud Detection...")
            fraud_result = self.fraud_detector.analyze_document(text)
            result['fraud_detection'] = fraud_result
            if fraud_result.get('is_fraud'):
                self.stats['frauds_detected'] += 1
            
            # Step 4: EPFO Comparison (if LIN provided)
            if company_lin:
                print("  🔗 Step 4: EPFO Comparison...")
                epfo_result = self.epfo_comparator.get_discrepancy_report(text, company_lin)
                result['epfo_comparison'] = epfo_result
            
            # Step 5: Risk Score
            print("  📈 Step 5: Calculating Risk Score...")
            risk_score = self._calculate_risk_score(result)
            result['risk_score'] = risk_score
            result['risk_level'] = self._get_risk_level(risk_score)
            
            # Step 6: Status
            result['status'] = 'completed'
            self.stats['documents_processed'] += 1
            
            print(f"  ✅ Processing complete! Risk Score: {risk_score} ({result['risk_level']})")
            
        except Exception as e:
            print(f"  ❌ Error processing document: {e}")
            result['status'] = 'error'
            result['error'] = str(e)
            self.stats['errors'] += 1
        
        return result
    
    def process_attendance_log(self, image_path):
        """
        Process an attendance log document
        """
        print(f"\n📄 Processing Attendance Log: {image_path}")
        
        result = {
            'document_type': 'attendance_log',
            'timestamp': datetime.now().isoformat(),
            'status': 'processing'
        }
        
        try:
            # Use EasyOCR for handwriting
            print("  🔍 Step 1: OCR Extraction (handwriting optimized)...")
            results = self.easyocr.extract_handwritten(image_path)
            
            if not results:
                # Fallback to Tesseract
                text = self.tesseract.extract_text(image_path)
                if text:
                    results = text.split('\n')
            
            if not results:
                result['status'] = 'failed'
                result['error'] = 'Could not extract text from attendance log'
                return result
            
            result['extracted_text'] = '\n'.join(results) if isinstance(results, list) else results
            result['status'] = 'completed'
            self.stats['documents_processed'] += 1
            
        except Exception as e:
            print(f"  ❌ Error: {e}")
            result['status'] = 'error'
            result['error'] = str(e)
            self.stats['errors'] += 1
        
        return result
    
    def process_contractor_sheet(self, image_path):
        """
        Process a contractor list document
        """
        print(f"\n📄 Processing Contractor Sheet: {image_path}")
        
        result = {
            'document_type': 'contractor_sheet',
            'timestamp': datetime.now().isoformat(),
            'status': 'processing'
        }
        
        try:
            # Use Tesseract with table extraction
            print("  🔍 Step 1: OCR Extraction...")
            text = self.tesseract.extract_text(image_path, psm=6)
            
            if not text:
                easy_result = self.easyocr.extract_text(image_path)
                if easy_result:
                    text = ' '.join(easy_result)
            
            if not text:
                result['status'] = 'failed'
                result['error'] = 'Could not extract text from contractor sheet'
                return result
            
            # Parse contractor data
            result['extracted_text'] = text[:2000]
            result['status'] = 'completed'
            self.stats['documents_processed'] += 1
            
        except Exception as e:
            print(f"  ❌ Error: {e}")
            result['status'] = 'error'
            result['error'] = str(e)
            self.stats['errors'] += 1
        
        return result
    
    # ============ FRAUD DETECTION ============
    
    def check_fraud(self, document_text):
        """
        Check a document for fraud
        """
        print("\n🚨 Running Fraud Detection...")
        result = self.fraud_detector.analyze_document(document_text)
        
        print(f"  🔍 Fraud Detected: {result.get('is_fraud', False)}")
        print(f"  📊 Confidence: {result.get('confidence', 0):.2f}")
        print(f"  📋 Risk Level: {result.get('risk_level', 'Unknown')}")
        
        if result.get('reasons'):
            print("  📝 Reasons:")
            for reason in result['reasons']:
                print(f"    - {reason}")
        
        return result
    
    def compare_with_epfo(self, document_text, company_lin):
        """
        Compare document with EPFO records
        """
        print(f"\n🔗 Comparing with EPFO records for LIN: {company_lin}...")
        result = self.epfo_comparator.get_discrepancy_report(document_text, company_lin)
        
        print(f"  📊 Has Discrepancy: {result.get('has_discrepancy', False)}")
        print(f"  ⚠️ Severity: {result.get('severity', 'none')}")
        print(f"  📝 Summary: {result.get('summary', 'No issues found')}")
        
        return result
    
    # ============ BIAS DETECTION ============
    
    def check_and_correct_bias(self, company_id, region, industry, business_size, risk_score):
        """
        Check and correct bias in risk scoring
        """
        print(f"\n⚖️ Bias Check for Company: {company_id}")
        
        # Log decision
        self.bias_checker.log_decision(
            company_id, region, industry, business_size, risk_score, 'assessed'
        )
        
        # Check for bias
        bias_report = self.bias_checker.check_bias()
        
        # Apply correction
        adjusted = self.bias_checker.adjust_risk_score(
            company_id, region, industry, business_size, risk_score
        )
        
        print(f"  📊 Original Score: {adjusted['original_score']:.2f}")
        print(f"  🔄 Adjusted Score: {adjusted['adjusted_score']:.2f}")
        print(f"  ⚖️ Adjustment Applied: {adjusted['adjustment_applied']}")
        
        if adjusted['adjustment_applied']:
            print(f"  📝 Reason: {adjusted['reason']}")
            self.stats['bias_corrections_applied'] += 1
        
        return adjusted
    
    def get_bias_report(self):
        """
        Get comprehensive bias report
        """
        return self.bias_checker.get_fairness_report()
    
    # ============ INTERNAL HELPERS ============
    
    def _parse_salary_data(self, text):
        """Parse salary data from extracted text"""
        import re
        
        data = {
            'employees': [],
            'total_employees': 0,
            'month': None,
            'year': None,
            'total_wages': 0
        }
        
        lines = text.split('\n')
        amount_pattern = r'₹?\s*[\d,]+\.?\d*'
        month_pattern = r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*[-/]?\s*(\d{4})'
        name_pattern = r'[A-Z][a-z]+\s+[A-Z][a-z]+'
        
        for line in lines:
            month_match = re.search(month_pattern, line, re.IGNORECASE)
            if month_match:
                data['month'] = month_match.group(1)
                data['year'] = month_match.group(2)
            
            names = re.findall(name_pattern, line)
            amounts = re.findall(amount_pattern, line)
            
            if names and amounts:
                try:
                    salary = float(amounts[0].replace('₹', '').replace(',', '').strip())
                    data['employees'].append({
                        'name': names[0],
                        'salary': salary
                    })
                    data['total_wages'] += salary
                except:
                    pass
        
        data['total_employees'] = len(data['employees'])
        return data
    
    def _calculate_risk_score(self, analysis):
        """Calculate risk score from analysis results"""
        score = 0
        max_score = 100
        
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
        
        return min(score, 100)
    
    def _get_risk_level(self, score):
        """Get risk level from score"""
        if score >= 70:
            return 'High'
        elif score >= 40:
            return 'Medium'
        else:
            return 'Low'
    
    # ============ INTEGRATION WITH BACKEND ============
    
    def get_api_response(self, image_path, company_id, company_lin, region, industry, business_size):
        """
        Generate complete API response for backend integration
        """
        print(f"\n🌐 Generating API Response for Company: {company_id}")
        
        response = self.api_integration.get_integration_response(
            image_path, company_id, company_lin, region, industry, business_size
        )
        
        # Log bias correction if applied
        if response.get('risk_assessment', {}).get('bias_correction_applied'):
            self.stats['bias_corrections_applied'] += 1
        
        return response
    
    def process_batch(self, documents):
        """
        Process multiple documents in batch
        """
        print(f"\n📦 Processing Batch of {len(documents)} documents...")
        results = []
        
        for i, doc in enumerate(documents):
            print(f"\n  [{i+1}/{len(documents)}]")
            result = self.process_salary_sheet(doc['path'], doc.get('company_lin'))
            result['company_id'] = doc.get('company_id')
            results.append(result)
        
        return results
    
    # ============ STATISTICS ============
    
    def get_stats(self):
        """
        Get system statistics
        """
        stats = {
            'documents_processed': self.stats['documents_processed'],
            'frauds_detected': self.stats['frauds_detected'],
            'bias_corrections_applied': self.stats['bias_corrections_applied'],
            'errors': self.stats['errors']
        }
        
        # Add bias report
        bias_report = self.get_bias_report()
        stats['bias_detected'] = bias_report.get('bias_detected', False)
        stats['total_decisions_logged'] = bias_report.get('total_decisions', 0)
        
        return stats
    
    def print_stats(self):
        """
        Print system statistics
        """
        print("\n" + "=" * 60)
        print("📊 SYSTEM STATISTICS")
        print("=" * 60)
        stats = self.get_stats()
        print(f"  📄 Documents Processed: {stats['documents_processed']}")
        print(f"  🚨 Frauds Detected: {stats['frauds_detected']}")
        print(f"  ⚖️ Bias Corrections Applied: {stats['bias_corrections_applied']}")
        print(f"  ❌ Errors: {stats['errors']}")
        print(f"  ⚖️ Bias Detected in System: {stats['bias_detected']}")
        print(f"  📝 Decisions Logged: {stats['total_decisions_logged']}")
        print("=" * 60)

    # ============ DEMO FUNCTIONS ============
    
    def run_demo(self, sample_image_path):
        """
        Run a complete demo with a sample image
        """
        print("\n" + "=" * 60)
        print("🎬 RUNNING COMPLETE DEMO")
        print("=" * 60)
        
        # Process document
        result = self.process_salary_sheet(sample_image_path)
        
        # Print summary
        print("\n" + "=" * 60)
        print("📋 DEMO RESULTS SUMMARY")
        print("=" * 60)
        print(f"  Status: {result.get('status')}")
        
        if result.get('risk_score') is not None:
            print(f"  Risk Score: {result.get('risk_score')}")
            print(f"  Risk Level: {result.get('risk_level')}")
        
        if result.get('fraud_detection'):
            fraud = result['fraud_detection']
            print(f"  Fraud Detected: {fraud.get('is_fraud', False)}")
            print(f"  Fraud Confidence: {fraud.get('confidence', 0):.2f}")
            if fraud.get('reasons'):
                print("  Reasons:")
                for reason in fraud['reasons']:
                    print(f"    - {reason}")
        
        if result.get('salary_data'):
            print(f"  Total Employees: {result['salary_data'].get('total_employees', 0)}")
            print(f"  Total Wages: ₹{result['salary_data'].get('total_wages', 0):,.2f}")
        
        print("=" * 60)
        
        return result


# ============ COMMAND LINE INTERFACE ============

def main():
    """Command line interface for Surakshit AI Engine"""
    
    parser = argparse.ArgumentParser(
        description="Surakshit Shram - AI-Driven Smart Inspection System for Labour Code Compliance"
    )
    
    parser.add_argument(
        '--mode', '-m',
        choices=['process', 'fraud', 'epfo', 'bias', 'demo', 'stats'],
        default='demo',
        help='Operation mode'
    )
    
    parser.add_argument(
        '--image', '-i',
        type=str,
        help='Path to document image'
    )
    
    parser.add_argument(
        '--lin', '-l',
        type=str,
        help='Company LIN for EPFO comparison'
    )
    
    parser.add_argument(
        '--company_id', '-c',
        type=str,
        help='Company ID for bias tracking'
    )
    
    parser.add_argument(
        '--region', '-r',
        type=str,
        default='Mumbai',
        help='Company region for bias tracking'
    )
    
    parser.add_argument(
        '--industry', '-ind',
        type=str,
        default='Manufacturing',
        help='Company industry for bias tracking'
    )
    
    parser.add_argument(
        '--business_size', '-bs',
        type=str,
        choices=['small', 'medium', 'large'],
        default='medium',
        help='Company business size for bias tracking'
    )
    
    args = parser.parse_args()
    
    # Initialize AI Engine
    ai_engine = SurakshitAI()
    
    if args.mode == 'process':
        if not args.image:
            print("❌ Error: --image is required for process mode")
            sys.exit(1)
        
        result = ai_engine.process_salary_sheet(args.image, args.lin)
        print("\n📋 Result:")
        print(json.dumps(result, indent=2, default=str))
    
    elif args.mode == 'fraud':
        if not args.image:
            print("❌ Error: --image is required for fraud mode")
            sys.exit(1)
        
        text = ai_engine.tesseract.extract_text(args.image)
        if text:
            result = ai_engine.check_fraud(text)
            print("\n📋 Result:")
            print(json.dumps(result, indent=2, default=str))
        else:
            print("❌ Could not extract text from image")
    
    elif args.mode == 'epfo':
        if not args.image or not args.lin:
            print("❌ Error: --image and --lin are required for epfo mode")
            sys.exit(1)
        
        text = ai_engine.tesseract.extract_text(args.image)
        if text:
            result = ai_engine.compare_with_epfo(text, args.lin)
            print("\n📋 Result:")
            print(json.dumps(result, indent=2, default=str))
        else:
            print("❌ Could not extract text from image")
    
    elif args.mode == 'bias':
        if not args.company_id:
            print("❌ Error: --company_id is required for bias mode")
            sys.exit(1)
        
        result = ai_engine.check_and_correct_bias(
            args.company_id, args.region, args.industry,
            args.business_size, 50.0  # sample risk score
        )
        print("\n📋 Result:")
        print(json.dumps(result, indent=2, default=str))
    
    elif args.mode == 'demo':
        if args.image:
            ai_engine.run_demo(args.image)
        else:
            print("⚠️ No image provided. Running with sample analysis...")
            print("   Use --image to process a real document.")
            # Run with sample text
            sample_text = """
            Salary Sheet - September 2024
            Employee Name    Basic    HRA    PF    Net
            Rahul Sharma    25000    8000   3000   30000
            Priya Patel     30000    10000  3600   36400
            Amit Singh      28000    9000   3360   33640
            """
            fraud_result = ai_engine.check_fraud(sample_text)
            print(json.dumps(fraud_result, indent=2, default=str))
    
    elif args.mode == 'stats':
        ai_engine.print_stats()
    
    else:
        print("❌ Invalid mode. Use --help for options.")


if __name__ == "__main__":
    main()
