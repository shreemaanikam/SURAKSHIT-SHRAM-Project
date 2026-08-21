import random
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.connectors.base import GovernmentDataConnector


class MockLINConnector(GovernmentDataConnector):
    """Mock connector for Labor Identification Number (Central Shram Suvidha Portal)."""

    def __init__(self):
        super().__init__(source_name="LIN", api_base_url="https://shramsuvidha.gov.in/mock-api/v1")

    def authenticate(self) -> bool:
        self.authenticated = True
        return True

    def fetch_company_data(self, registration_number: str) -> Dict[str, Any]:
        self.authenticate()
        lin_id = f"1{random.randint(100000000, 999999999)}"
        return {
            "lin_id": lin_id,
            "establishment_name": f"LIN-Est-{registration_number}",
            "primary_act": "Factories Act, 1948",
            "central_license_number": f"CL/{lin_id}/2024",
            "license_valid_until": "2027-12-31",
            "verified_employee_count": 150,
            "status": "VERIFIED",
            "raw_source": "LIN"
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
                "compliance_type": "FACTORIES_ACT",
                "reporting_period": period,
                "return_reference": f"UR-2025-{random.randint(10000, 99999)}",
                "unified_return_status": "FILED",
                "filing_date": "2026-02-01",
                "due_date": "2026-02-15",
                "amount_paid": 0.0,
                "status": "COMPLIANT"
            },
            {
                "compliance_type": "CLRA",
                "reporting_period": period,
                "return_reference": f"CLRA-2025-{random.randint(10000, 99999)}",
                "unified_return_status": "FILED",
                "filing_date": "2026-01-28",
                "due_date": "2026-02-15",
                "amount_paid": 15000.0,
                "status": "COMPLIANT"
            }
        ]

    def check_status(self) -> Dict[str, Any]:
        return {
            "source_name": self.source_name,
            "status": "ONLINE",
            "latency_ms": 25,
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
