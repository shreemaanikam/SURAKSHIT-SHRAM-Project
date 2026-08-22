import random
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.connectors.base import GovernmentDataConnector


class MockESICConnector(GovernmentDataConnector):
    """Mock connector for Employees' State Insurance Corporation (ESIC)."""

    def __init__(self):
        super().__init__(source_name="ESIC", api_base_url="https://mock.gov.in/esic/v1")

    def authenticate(self) -> bool:
        self.authenticated = True
        return True

    def fetch_company_data(self, registration_number: str) -> Dict[str, Any]:
        self.authenticate()
        code_number = f"11000{random.randint(10000, 99999)}"
        return {
            "employer_code": code_number,
            "unit_name": f"Unit-{registration_number}",
            "regional_office": "Sub-Regional Office Okhla",
            "insured_persons_count": 130,
            "status": "ACTIVE",
            "raw_source": "ESIC"
        }

    def fetch_compliance_data(
        self,
        registration_number: str,
        reporting_period: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        self.authenticate()
        period = reporting_period or "2026-Q1"
        return [
            {
                "compliance_type": "ESIC",
                "reporting_period": period,
                "challan_number": f"01126{random.randint(1000000, 9999999)}",
                "contribution_period": "Nov 2025 - Apr 2026",
                "insured_persons": 130,
                "amount_paid": 86125.0,
                "payment_date": "2026-04-14",
                "due_date": "2026-04-15",
                "status": "COMPLIANT",
                "defaulting_months": 0
            }
        ]

    def check_status(self) -> Dict[str, Any]:
        return {
            "source_name": self.source_name,
            "status": "ONLINE",
            "latency_ms": 38,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    def synchronize(self, registration_number: str) -> Dict[str, Any]:
        company_raw = self.fetch_company_data(registration_number)
        compliance_raw = self.fetch_compliance_data(registration_number)
        return {
            "source": self.source_name,
            "company_raw": company_raw,
            "compliance_raw": compliance_raw
        }
