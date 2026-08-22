import random
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.connectors.base import GovernmentDataConnector


class MockEPFOConnector(GovernmentDataConnector):
    """Mock connector for Employees' Provident Fund Organisation (Central EPFO System)."""

    def __init__(self):
        super().__init__(source_name="EPFO", api_base_url="https://mock.gov.in/epfo/v1")

    def authenticate(self) -> bool:
        self.authenticated = True
        return True

    def fetch_company_data(self, registration_number: str) -> Dict[str, Any]:
        self.authenticate()
        est_code = f"DL/CPM/{registration_number.replace('-', '')[:7]}/000"
        return {
            "est_code": est_code,
            "establishment_name": f"Est-{registration_number}",
            "epfo_office": "Delhi North",
            "registration_date": "2018-04-15",
            "active_members_count": 145,
            "coverage_status": "ACTIVE",
            "exemption_status": "UNEXEMPTED",
            "raw_source": "EPFO"
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
                "compliance_type": "EPFO",
                "reporting_period": period,
                "trrn_number": f"10126{random.randint(1000000, 9999999)}",
                "wage_month": "2026-03",
                "total_members": 145,
                "total_wages": 2175000.0,
                "amount_paid": 261000.0,
                "payment_date": "2026-04-12",
                "due_date": "2026-04-15",
                "status": "COMPLIANT",
                "defaulting_months": 0
            }
        ]

    def check_status(self) -> Dict[str, Any]:
        return {
            "source_name": self.source_name,
            "status": "ONLINE",
            "latency_ms": 42,
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
