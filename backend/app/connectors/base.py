from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List


class GovernmentDataConnector(ABC):
    """Abstract Base Class for all Government Data Connectors (EPFO, ESIC, LIN, State)."""

    def __init__(self, source_name: str, api_base_url: Optional[str] = None):
        self.source_name = source_name
        self.api_base_url = api_base_url or "https://mock.gov.in/api"
        self.authenticated = False

    @abstractmethod
    def authenticate(self) -> bool:
        """Simulate authentication against government API gateway."""
        pass

    @abstractmethod
    def fetch_company_data(self, registration_number: str) -> Dict[str, Any]:
        """Fetch raw company registration payload from government source."""
        pass

    @abstractmethod
    def fetch_compliance_data(
        self,
        registration_number: str,
        reporting_period: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Fetch raw compliance records from government source."""
        pass

    @abstractmethod
    def check_status(self) -> Dict[str, Any]:
        """Check connector health and external system status."""
        pass

    @abstractmethod
    def synchronize(self, registration_number: str) -> Dict[str, Any]:
        """Orchestrate full data fetch for synchronization pipeline."""
        pass
