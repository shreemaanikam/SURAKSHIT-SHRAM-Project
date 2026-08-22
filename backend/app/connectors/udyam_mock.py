import random
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.connectors.base import GovernmentDataConnector


class MockUdyamConnector(GovernmentDataConnector):
    """
    Mock connector for UDYAM Registered MSME Units.
    Dataset source: https://www.data.gov.in/resource/list-msme-registered-units-under-udyam
    """

    def __init__(self):
        super().__init__(
            source_name="UDYAM_MSME",
            api_base_url="https://api.data.gov.in/resource/udyam-msme-units"
        )

    def authenticate(self) -> bool:
        self.authenticated = True
        return True

    def fetch_company_data(self, registration_number: str) -> Dict[str, Any]:
        self.authenticate()
        cleaned = registration_number.replace("-", "").replace(" ", "").upper()
        udyam_reg_no = f"UDYAM-DL-01-{cleaned[-7:]}"
        msme_category = random.choice(["MICRO", "SMALL", "MEDIUM"])

        return {
            "udyam_registration_number": udyam_reg_no,
            "enterprise_name": f"MSME-Unit-{registration_number}",
            "organisation_type": "Private Limited Company",
            "msme_category": msme_category,
            "major_activity": "MANUFACTURING",
            "nic_code": "1410 - Manufacture of wearing apparel",
            "date_of_udyam_registration": "2020-07-15",
            "district": "North Delhi",
            "state": "Delhi",
            "investment_in_plant_inr": 4500000.0 if msme_category == "MICRO" else 25000000.0,
            "turnover_inr": 18000000.0 if msme_category == "MICRO" else 85000000.0,
            "raw_source": "UDYAM_DATA_GOV_IN"
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
                "compliance_type": "MSME_SAMADHAAN_FILING",
                "reporting_period": period,
                "udyam_acknowledgement": f"ACK-UDYAM-2026-{random.randint(10000, 99999)}",
                "delayed_payments_flagged": 0,
                "status": "COMPLIANT",
                "due_date": "2026-03-31",
                "filing_date": "2026-03-20",
                "amount_paid": 0.0
            }
        ]

    def check_status(self) -> Dict[str, Any]:
        return {
            "source_name": self.source_name,
            "status": "ONLINE",
            "latency_ms": 28,
            "dataset_url": "https://www.data.gov.in/resource/list-msme-registered-units-under-udyam",
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
