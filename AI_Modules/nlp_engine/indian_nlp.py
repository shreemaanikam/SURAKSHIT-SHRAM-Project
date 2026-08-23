"""
Indian NLP – Language understanding for Indian payroll documents
Handles regional languages, Indian English, and compliance terminology
"""

import re
import spacy
from typing import Dict, List, Any, Optional

class IndianNLP:
    """NLP processor for Indian payroll documents with regional language support"""
    
    def __init__(self, language='en'):
        self.language = language
        self.nlp = self._load_model(language)
        
        # Indian English payroll terminology
        self.indian_terms = {
            'salary_terms': {
                'basic': ['basic', 'base', 'bpay'],
                'hra': ['hra', 'rent', 'house rent'],
                'da': ['da', 'dearness'],
                'pf': ['pf', 'epf', 'provident fund'],
                'esi': ['esi', 'insurance'],
                'gratuity': ['gratuity', 'grat'],
                'bonus': ['bonus', 'incentive', 'performance pay'],
                'allowance': ['allowance', 'allowances', 'special allowance'],
                'deduction': ['deduction', 'deductions', 'less', 'total deduction'],
                'net': ['net', 'take home', 'in hand']
            },
            'compliance_terms': {
                'minimum_wage': ['min wage', 'minimum wage', 'minwage', 'statutory wage'],
                'overtime': ['ot', 'overtime', 'over time', 'extra hours'],
                'attendance': ['attendance', 'present', 'absent', 'leave', 'holiday'],
                'contract': ['contract', 'contractor', 'temporary', 'consultant']
            }
        }
        
        # Regional language keywords (for detection)
        self.regional_keywords = {
            'hi': ['वेतन', 'मजदूरी', 'कर्मचारी', 'उपस्थिति'],
            'ta': ['சம்பளம்', 'ஊழியர்', 'வருகை'],
            'te': ['జీతం', 'ఉద్యోగి', 'హాజరు'],
            'bn': ['বেতন', 'কর্মচারী', 'উপস্থিতি'],
            'mr': ['पगार', 'कर्मचारी', 'उपस्थिती']
        }
    
    def _load_model(self, language):
        """Load spaCy model for Indian English"""
        try:
            return spacy.load("en_core_web_sm")
        except:
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
            return spacy.load("en_core_web_sm")
    
    def detect_language(self, text: str) -> str:
        """Detect if text contains regional Indian language"""
        text_lower = text.lower()
        
        for lang, keywords in self.regional_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    return lang
        
        return 'en'  # Default to English
    
    def extract_payroll_entities(self, text: str) -> Dict[str, List[str]]:
        """
        Extract payroll-related entities from text
        
        Returns:
            Dict with categorized entities
        """
        result = {
            'salary_components': [],
            'compliance_terms': [],
            'dates': [],
            'amounts': [],
            'names': [],
            'violations': []
        }
        
        text_lower = text.lower()
        
        # Extract salary components
        for category, terms in self.indian_terms['salary_terms'].items():
            for term in terms:
                if term in text_lower:
                    result['salary_components'].append(category)
                    break
        
        # Extract compliance terms
        for category, terms in self.indian_terms['compliance_terms'].items():
            for term in terms:
                if term in text_lower:
                    result['compliance_terms'].append(category)
                    break
        
        # Extract amounts
        amounts = re.findall(r'₹?\s*[\d,]+\.?\d*', text)
        result['amounts'] = [a for a in amounts if float(re.sub(r'[₹,\s]', '', a)) > 0]
        
        # Extract names using spaCy
        doc = self.nlp(text)
        for ent in doc.ents:
            if ent.label_ == 'PERSON':
                result['names'].append(ent.text)
            elif ent.label_ == 'DATE':
                result['dates'].append(ent.text)
        
        # Detect potential violations
        violations = self._detect_violations(text)
        result['violations'] = violations
        
        return result
    
    def _detect_violations(self, text: str) -> List[str]:
        """Detect potential compliance violations in text"""
        violations = []
        text_lower = text.lower()
        
        # Minimum wage violations
        if 'min wage' in text_lower or 'minimum wage' in text_lower:
            if 'below' in text_lower or 'less' in text_lower:
                violations.append('Possible minimum wage violation')
        
        # Late payment
        if 'late' in text_lower and ('payment' in text_lower or 'salary' in text_lower):
            violations.append('Possible late payment detected')
        
        # Missing attendance
        if not re.search(r'attendance|present|absent', text_lower):
            violations.append('Attendance records may be missing')
        
        # PF issues
        if 'pf' in text_lower or 'provident fund' in text_lower:
            if 'not paid' in text_lower or 'pending' in text_lower:
                violations.append('PF payment may be pending')
        
        return list(set(violations))
    
    def normalize_payroll_text(self, text: str) -> str:
        """Normalize payroll text for processing"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Standardize Indian payroll terms
        replacements = {
            'basic salary': 'basic',
            'base salary': 'basic',
            'house rent allowance': 'hra',
            'provident fund': 'pf',
            'employee state insurance': 'esi',
            'take home': 'net',
            'in hand': 'net'
        }
        
        for old, new in replacements.items():
            text = text.replace(old, new)
        
        return text
    
    def extract_key_phrases(self, text: str, top_n: int = 10) -> List[str]:
        """Extract key phrases from payroll document"""
        doc = self.nlp(text)
        
        # Extract noun phrases
        phrases = []
        for chunk in doc.noun_chunks:
            if len(chunk.text.split()) >= 2:
                phrases.append(chunk.text)
        
        # Rank by frequency
        from collections import Counter
        phrase_counts = Counter(phrases)
        
        return [phrase for phrase, _ in phrase_counts.most_common(top_n)]
    
    def parse_multilingual_text(self, text: str) -> Dict[str, Any]:
        """
        Parse text that may contain multiple Indian languages
        
        Returns:
            Dict with text parts in different languages
        """
        result = {
            'detected_language': 'en',
            'english_parts': [],
            'regional_parts': [],
            'translated_text': text
        }
        
        # Detect language
        detected_lang = self.detect_language(text)
        result['detected_language'] = detected_lang
        
        # Split text into words and classify
        words = text.split()
        
        for word in words:
            # Check if word has Devanagari or other Indic scripts
            if any('\u0900' <= c <= '\u097F' for c in word):  # Devanagari
                result['regional_parts'].append(word)
            elif any('\u0B80' <= c <= '\u0BFF' for c in word):  # Tamil
                result['regional_parts'].append(word)
            elif any('\u0C00' <= c <= '\u0C7F' for c in word):  # Telugu
                result['regional_parts'].append(word)
            else:
                result['english_parts'].append(word)
        
        return result
