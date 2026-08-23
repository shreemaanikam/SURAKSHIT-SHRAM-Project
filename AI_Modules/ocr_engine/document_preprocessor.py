"""
Document Preprocessor for OCR
Handles image cleaning, deskewing, contrast enhancement, and noise removal
"""

import os
from PIL import Image

try:
    import cv2
    import numpy as np
    _HAS_CV2 = True
except ImportError:
    cv2 = None
    np = None
    _HAS_CV2 = False


class DocumentPreprocessor:
    """Preprocess scanned documents for better OCR accuracy"""
    
    def __init__(self):
        self.supported_formats = ['.jpg', '.jpeg', '.png', '.tiff', '.bmp']
    
    def load_image(self, image_path: str):
        """Load image from file path using OpenCV or Pillow"""
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found: {image_path}")
        
        if _HAS_CV2:
            image = cv2.imread(image_path)
            if image is not None:
                return image

        # Pillow fallback
        return Image.open(image_path)

    def convert_to_grayscale(self, image):
        """Convert image to grayscale"""
        if _HAS_CV2 and isinstance(image, np.ndarray):
            if len(image.shape) == 3:
                return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            return image
        if hasattr(image, 'convert'):
            return image.convert('L')
        return image

    def preprocess_image(self, image_path: str):
        """Full preprocessing pipeline"""
        img = self.load_image(image_path)
        img = self.convert_to_grayscale(img)
        return img
