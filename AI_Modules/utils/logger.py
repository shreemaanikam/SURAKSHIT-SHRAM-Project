"""
Logger – Custom logging for Surakshit Shram
"""

import logging
import os
from datetime import datetime
from config.config import config

class Logger:
    """Custom logger for Surakshit Shram"""
    
    def __init__(self, name: str = 'surakshit'):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(config.LOG_LEVEL)
        
        # Avoid duplicate handlers
        if not self.logger.handlers:
            self._setup_handlers()
    
    def _setup_handlers(self):
        """Setup log handlers"""
        # File handler
        log_dir = os.path.dirname(config.PROCESS_LOG_PATH)
        if log_dir:
            os.makedirs(log_dir, exist_ok=True)
        
        file_handler = logging.FileHandler(config.PROCESS_LOG_PATH)
        file_handler.setLevel(logging.INFO)
        
        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        
        # Formatter
        formatter = logging.Formatter(config.LOG_FORMAT)
        file_handler.setFormatter(formatter)
        console_handler.setFormatter(formatter)
        
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)
    
    def info(self, message: str):
        """Log info message"""
        self.logger.info(message)
    
    def error(self, message: str):
        """Log error message"""
        self.logger.error(message)
    
    def warning(self, message: str):
        """Log warning message"""
        self.logger.warning(message)
    
    def debug(self, message: str):
        """Log debug message"""
        self.logger.debug(message)
    
    def critical(self, message: str):
        """Log critical message"""
        self.logger.critical(message)

def get_logger(name: str = 'surakshit') -> Logger:
    """Get logger instance"""
    return Logger(name)
