"""
Regional Language Utilities – Support for Indian languages in payroll documents
"""

import re
from typing import Dict, List, Any

class RegionalLanguageUtils:
    """Utilities for handling regional Indian languages in payroll"""
    
    def __init__(self):
        self.script_ranges = {
            'Devanagari': (0x0900, 0x097F),  # Hindi, Marathi, etc.
            'Bengali': (0x0980, 0x09FF),
            'Tamil': (0x0B80, 0x0BFF),
            'Telugu': (0x0C00, 0x0C7F),
            'Kannada': (0x0C80, 0x0CFF),
            'Malayalam': (0x0D00, 0x0D7F),
            'Gujarati': (0x0A80, 0x0AFF),
            'Odia': (0x0B00, 0x0B7F),
            'Punjabi': (0x0A00, 0x0A7F)
        }
        
        # Common payroll terms in regional languages
        self.regional_payroll_terms = {
            'hi': {
                'salary': 'वेतन',
                'wage': 'मजदूरी',
                'employee': 'कर्मचारी',
                'attendance': 'उपस्थिति',
                'present': 'उपस्थित',
                'absent': 'अनुपस्थित',
                'month': 'महीना',
                'year': 'वर्ष'
            },
            'ta': {
                'salary': 'சம்பளம்',
                'employee': 'ஊழியர்',
                'attendance': 'வருகை',
                'present': 'வந்தவர்',
                'absent': 'வராதவர்',
                'month': 'மாதம்',
                'year': 'ஆண்டு'
            },
            'te': {
                'salary': 'జీతం',
                'employee': 'ఉద్యోగి',
                'attendance': 'హాజరు',
                'present': 'హాజరు',
                'absent': 'లేని',
                'month': 'నెల',
                'year': 'సంవత్సరం'
            },
            'bn': {
                'salary': 'বেতন',
                'employee': 'কর্মচারী',
                'attendance': 'উপস্থিতি',
                'present': 'উপস্থিত',
                'absent': 'অনুপস্থিত',
                'month': 'মাস',
                'year': 'বছর'
            },
            'mr': {
                'salary': 'पगार',
                'employee': 'कर्मचारी',
                'attendance': 'उपस्थिती',
                'present': 'उपस्थित',
                'absent': 'अनुपस्थित',
                'month': 'महिना',
                'year': 'वर्ष'
            }
        }
    
    def detect_script(self, text: str) -> str:
        """Detect which Indian script is used in text"""
        for script, (start, end) in self.script_ranges.items():
            for char in text:
                if start <= ord(char) <= end:
                    return script
        return 'Latin'
    
    def detect_language(self, text: str) -> str:
        """Detect Indian language from text"""
        # Check for regional keywords
        text_lower = text.lower()
        
        for lang, terms in self.regional_payroll_terms.items():
            for term in terms.values():
                if term in text_lower:
                    return lang
        
        return 'en'
    
    def extract_regional_numbers(self, text: str) -> List[int]:
        """
        Extract numbers from regional language text
        
        Example: "१२३" → 123
        """
        # Devanagari digit mapping
        devanagari_digits = {
            '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
            '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
        }
        
        numbers = []
        
        # Find all digit sequences
        digit_pattern = r'[०-९]+'
        matches = re.findall(digit_pattern, text)
        
        for match in matches:
            # Convert Devanagari digits to ASCII
            converted = ''
            for char in match:
                if char in devanagari_digits:
                    converted += devanagari_digits[char]
                else:
                    converted += char
            numbers.append(int(converted))
        
        return numbers
    
    def translate_payroll_term(self, term: str, source_lang: str, target_lang: str = 'en') -> str:
        """Translate payroll term between languages"""
        # Simple mapping for common terms
        if source_lang in self.regional_payroll_terms and target_lang == 'en':
            for key, value in self.regional_payroll_terms[source_lang].items():
                if value == term:
                    return key
        
        # Reverse mapping (English to regional)
        if source_lang == 'en' and target_lang in self.regional_payroll_terms:
            if term in self.regional_payroll_terms[target_lang]:
                return self.regional_payroll_terms[target_lang][term]
        
        return term
    
    def normalize_regional_text(self, text: str) -> str:
        """Normalize regional text for processing"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Remove special characters
        text = re.sub(r'[^\w\s\d.₹]', ' ', text)
        
        return text
