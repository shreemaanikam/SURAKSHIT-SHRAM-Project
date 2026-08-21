import random
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.connectors.base import GovernmentDataConnector


class MockStateConnector(GovernmentDataConnector):
    """Mock connector for State Labor Department & Treasury Systems (Shops & Establishments, Local Labor Laws)."""

    def __init__(self):
        super().__init__(source_name="STATE_LABOR", api_base_url="https://labour.state.gov.in/mock-api/v1")

    def authenticate(self) -> bool:
        self.authenticated = True
        return True

    def fetch_company_data(self, registration_number: str) -> Dict[str, Any]:
        self.authenticate()
        state_reg = f"SEA/{registration_number}/2022"
        return {
            "state_registration_number": state_reg,
            "establishment_type": "Commercial Establishment",
            "state_code": "DL",
            "district": "New Delhi",
            "active_status": "ACTIVE",
            "raw_source": "STATE_LABOR"
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
                "compliance_type": "MINIMUM_WAGES",
                "reporting_period": period,
                "inspection_or_filing_ref": f"MW-RET-{random.randint(1000, 9999)}",
                "status": "COMPLIANT",
                "due_date": "2026-03-31",
                "filing_date": "2026-03-25",
                "amount_paid": 0.0
            }
        ]

    def check_status(self) -> Dict[str, Any]:
        return {
            "source_name": self.source_name,
            "status": "ONLINE",
            "latency_ms": 55,
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
