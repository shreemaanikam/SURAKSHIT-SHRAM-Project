"""
Centralized Configuration for Surakshit Shram
All paths, thresholds, and settings in one place
"""

import os
from typing import Dict, Any

class Config:
    """Central configuration class for Surakshit Shram"""
    
    def __init__(self):
        # ===== BASE PATHS =====
        self.BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.MODELS_DIR = os.path.join(self.BASE_DIR, 'models')
        self.TRAINING_DATA_DIR = os.path.join(self.BASE_DIR, 'training_data')
        self.DATA_DIR = os.path.join(self.BASE_DIR, 'data')
        self.LOGS_DIR = os.path.join(self.BASE_DIR, 'logs')
        self.OUTPUT_DIR = os.path.join(self.BASE_DIR, 'output')
        
        # ===== MODEL PATHS =====
        self.FRAUD_MODEL_PATH = os.path.join(self.MODELS_DIR, 'fraud_detection_model.pkl')
        self.RISK_MODEL_PATH = os.path.join(self.MODELS_DIR, 'risk_scorecard_model.pkl')
        self.BIAS_ANALYSIS_PATH = os.path.join(self.MODELS_DIR, 'bias_analysis.json')
        self.RULE_CACHE_PATH = os.path.join(self.MODELS_DIR, 'rule_cache.json')
        
        # ===== TRAINING DATA PATHS =====
        self.FRAUD_DATASET_PATH = os.path.join(self.TRAINING_DATA_DIR, 'fraud_dataset.csv')
        self.RISK_DATASET_PATH = os.path.join(self.TRAINING_DATA_DIR, 'risk_dataset.csv')
        self.BIAS_DATASET_PATH = os.path.join(self.TRAINING_DATA_DIR, 'bias_dataset.csv')
        self.COMPLIANCE_DATASET_PATH = os.path.join(self.TRAINING_DATA_DIR, 'compliance_dataset.csv')
        
        # ===== LOG PATHS =====
        self.API_LOG_PATH = os.path.join(self.LOGS_DIR, 'api.log')
        self.PROCESS_LOG_PATH = os.path.join(self.LOGS_DIR, 'process.log')
        self.ERROR_LOG_PATH = os.path.join(self.LOGS_DIR, 'error.log')
        
        # ===== OCR SETTINGS =====
        self.TESSERACT_LANG = 'eng+hin'
        self.EASYOCR_LANGUAGES = ['en', 'hi']
        self.OCR_GPU_ENABLED = True
        self.OCR_BATCH_SIZE = 4
        self.OCR_MIN_CONFIDENCE = 0.5
        
        # ===== RISK SCORECARD SETTINGS =====
        self.RISK_THRESHOLDS = {
            'low': 30,      # 0-30: Low risk
            'medium': 60,   # 31-60: Medium risk
            'high': 100     # 61-100: High risk
        }
        
        self.RISK_WEIGHTS = {
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
        
        # ===== BIAS DETECTION SETTINGS =====
        self.FAIRNESS_THRESHOLD = 1.5  # Max disparity ratio
        self.MIN_SAMPLE_SIZE = 10       # Minimum samples for bias detection
        self.BIAS_CORRECTION_FACTOR = 0.85  # Reduction factor for biased groups
        
        # ===== API SETTINGS =====
        self.API_HOST = '0.0.0.0'
        self.API_PORT = 8000
        self.API_DEBUG = False
        self.API_TIMEOUT = 60  # Seconds
        self.API_MAX_REQUESTS = 100  # Per minute
        
        # ===== EPFO INTEGRATION =====
        self.EPFO_API_URL = 'https://api.epfo.gov.in/v1'
        self.EPFO_TIMEOUT = 30
        self.EPFO_RETRY_COUNT = 3
        
        # ===== ESIC INTEGRATION =====
        self.ESIC_API_URL = 'https://api.esic.gov.in/v1'
        self.ESIC_TIMEOUT = 30
        self.ESIC_RETRY_COUNT = 3
        
        # ===== COMPLIANCE SETTINGS =====
        self.IMPROVEMENT_NOTICE_DAYS = 30
        self.INSPECTION_DAYS = 15
        self.REVIEW_PERIOD_DAYS = 365
        self.REPEAT_VIOLATION_THRESHOLD = 3
        
        # ===== CACHE SETTINGS =====
        self.CACHE_ENABLED = True
        self.CACHE_TTL = 3600  # Seconds (1 hour)
        self.CACHE_MAX_SIZE = 1000
        
        # ===== LOGGING SETTINGS =====
        self.LOG_LEVEL = 'INFO'
        self.LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        self.LOG_MAX_SIZE = 10 * 1024 * 1024  # 10 MB
        self.LOG_BACKUP_COUNT = 5
        
        # ===== SECURITY SETTINGS =====
        self.ENCRYPTION_ENABLED = True
        self.DIFFERENTIAL_PRIVACY_EPSILON = 0.1
        self.DIFFERENTIAL_PRIVACY_DELTA = 0.01
        self.ACCESS_TOKEN_EXPIRY = 3600  # Seconds (1 hour)
        
        # ===== FRONTEND SETTINGS =====
        self.FRONTEND_URL = 'http://localhost:3000'
        self.CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000']
        
        # ===== STATE-SPECIFIC DEFAULTS =====
        self.DEFAULT_STATE = 'Maharashtra'
        self.SUPPORTED_STATES = [
            'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu',
            'Uttar Pradesh', 'Gujarat', 'Rajasthan', 'West Bengal',
            'Punjab', 'Haryana', 'Bihar', 'Odisha', 'Kerala',
            'Madhya Pradesh', 'Chhattisgarh', 'Jharkhand', 'Assam'
        ]
        
        # ===== GIG WORKER SETTINGS =====
        self.GIG_PLATFORMS = ['Zomato', 'Swiggy', 'Uber', 'Ola', 'Amazon Flex', 'Flipkart']
        self.GIG_COVERAGE_TARGET = 100.0  # Percentage
        self.GIG_TRACKING_ENABLED = True
        
        # ===== SMALL BUSINESS SETTINGS =====
        self.SMALL_BUSINESS_EMPLOYEES_THRESHOLD = 10
        self.MICRO_BUSINESS_EMPLOYEES_THRESHOLD = 5
        self.CSC_INTEGRATION_ENABLED = True
        
        # ===== WORKER COMPLAINT SETTINGS =====
        self.COMPLAINT_RESOLUTION_DAYS = 7
        self.COMPLAINT_ESCALATION_DAYS = 14
        self.COMPLAINT_MAX_ATTACHMENTS = 5
        self.COMPLAINT_ALLOWED_TYPES = [
            'Delayed Wages',
            'Unsafe Working Conditions',
            'Denial of Benefits',
            'Unfair Termination',
            'Other'
        ]
        
        # ===== INDUSTRY AVERAGES =====
        self.INDUSTRY_AVG_WAGES = {
            'Manufacturing': 22000,
            'IT': 45000,
            'Construction': 18000,
            'Healthcare': 25000,
            'Retail': 18000,
            'Hospitality': 16000,
            'Education': 20000,
            'Transportation': 19000,
            'Agriculture': 12000,
            'Mining': 26000,
            'Textiles': 15000,
            'Food Processing': 17000,
            'Pharma': 28000,
            'Banking': 35000,
            'Telecom': 32000,
            'default': 20000
        }
        
        # ===== DOCUMENT REQUIREMENTS =====
        self.REQUIRED_DOCUMENTS = [
            'salary_sheet',
            'attendance_log',
            'contractor_list',
            'pf_challan',
            'esi_challan',
            'minimum_wage_record',
            'overtime_record',
            'bonus_record',
            'gratuity_record',
            'workplace_safety_certificate'
        ]
        
        # ===== VIOLATION SEVERITY =====
        self.VIOLATION_SEVERITY = {
            'high': ['minimum_wage_violation', 'no_pf', 'no_esi', 'unsafe_conditions'],
            'medium': ['delayed_payment', 'missing_documents', 'working_hours_exceeded'],
            'low': ['minor_discrepancy', 'incomplete_record', 'delayed_filing']
        }
    
    def get_risk_thresholds(self) -> Dict[str, int]:
        """Get risk score thresholds"""
        return self.RISK_THRESHOLDS
    
    def get_industry_avg_wage(self, industry: str) -> float:
        """Get average wage for an industry"""
        return self.INDUSTRY_AVG_WAGES.get(industry, self.INDUSTRY_AVG_WAGES['default'])
    
    def get_supported_states(self) -> list:
        """Get list of supported states"""
        return self.SUPPORTED_STATES
    
    def get_required_documents(self) -> list:
        """Get list of required compliance documents"""
        return self.REQUIRED_DOCUMENTS
    
    def get_violation_severity(self, violation_type: str) -> str:
        """Get severity level for a violation type"""
        for severity, types in self.VIOLATION_SEVERITY.items():
            if violation_type in types:
                return severity
        return 'medium'
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert config to dictionary"""
        return {
            key: value for key, value in self.__dict__.items()
            if not key.startswith('_')
        }
    
    def update(self, updates: Dict[str, Any]) -> None:
        """Update configuration with dictionary"""
        for key, value in updates.items():
            if hasattr(self, key):
                setattr(self, key, value)
    
    def create_directories(self) -> None:
        """Create all required directories"""
        directories = [
            self.MODELS_DIR,
            self.TRAINING_DATA_DIR,
            self.DATA_DIR,
            self.LOGS_DIR,
            self.OUTPUT_DIR
        ]
        
        for directory in directories:
            os.makedirs(directory, exist_ok=True)
    
    def get_model_info(self) -> Dict[str, str]:
        """Get model file paths info"""
        return {
            'fraud_model': self.FRAUD_MODEL_PATH,
            'risk_model': self.RISK_MODEL_PATH,
            'bias_analysis': self.BIAS_ANALYSIS_PATH,
            'rule_cache': self.RULE_CACHE_PATH
        }

# Create a singleton instance
config = Config()
