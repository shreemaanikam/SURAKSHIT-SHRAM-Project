"""
API Client – HTTP client for external API calls
"""

import requests
import time
from typing import Dict, Any, Optional
from config.config import config

class APIClient:
    """Generic API client with retry and timeout support"""
    
    def __init__(self, base_url: str = None, timeout: int = 30):
        self.base_url = base_url
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'SurakshitShram/1.0',
            'Accept': 'application/json'
        })
    
    def get(self, endpoint: str, params: Dict = None) -> Dict[str, Any]:
        """Send GET request"""
        url = self._build_url(endpoint)
        response = self.session.get(url, params=params, timeout=self.timeout)
        return self._handle_response(response)
    
    def post(self, endpoint: str, data: Dict = None, json_data: Dict = None) -> Dict[str, Any]:
        """Send POST request"""
        url = self._build_url(endpoint)
        response = self.session.post(url, data=data, json=json_data, timeout=self.timeout)
        return self._handle_response(response)
    
    def put(self, endpoint: str, json_data: Dict = None) -> Dict[str, Any]:
        """Send PUT request"""
        url = self._build_url(endpoint)
        response = self.session.put(url, json=json_data, timeout=self.timeout)
        return self._handle_response(response)
    
    def delete(self, endpoint: str) -> Dict[str, Any]:
        """Send DELETE request"""
        url = self._build_url(endpoint)
        response = self.session.delete(url, timeout=self.timeout)
        return self._handle_response(response)
    
    def _build_url(self, endpoint: str) -> str:
        """Build full URL"""
        if endpoint.startswith('http'):
            return endpoint
        if self.base_url:
            return f"{self.base_url.rstrip('/')}/{endpoint.lstrip('/')}"
        return endpoint
    
    def _handle_response(self, response) -> Dict[str, Any]:
        """Handle HTTP response"""
        try:
            response.raise_for_status()
            return response.json()
        except requests.exceptions.JSONDecodeError:
            return {'success': False, 'error': 'Invalid JSON response', 'status': response.status_code}
        except requests.exceptions.HTTPError as e:
            return {'success': False, 'error': str(e), 'status': response.status_code}

def fetch_data(url: str, params: Dict = None, retries: int = 3, delay: int = 1) -> Dict[str, Any]:
    """Fetch data with retry logic"""
    client = APIClient(timeout=30)
    for attempt in range(retries):
        try:
            return client.get(url, params)
        except Exception:
            if attempt < retries - 1:
                time.sleep(delay * (attempt + 1))
            else:
                return {'success': False, 'error': f'Failed after {retries} retries'}

def retry_request(func, retries: int = 3, delay: int = 1):
    """Decorator for retry logic"""
    def wrapper(*args, **kwargs):
        for attempt in range(retries):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                if attempt < retries - 1:
                    time.sleep(delay * (attempt + 1))
                else:
                    raise e
    return wrapper
