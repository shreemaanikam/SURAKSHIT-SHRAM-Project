"""
OCR Engine Module for Document Text Extraction
"""

from .document_preprocessor import DocumentPreprocessor
from .tesseract_ocr import TesseractEngine
from .easyocr_engine import EasyOCREngine

__all__ = ['DocumentPreprocessor', 'TesseractEngine', 'EasyOCREngine']
