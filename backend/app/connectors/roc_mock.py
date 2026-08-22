import random
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from app.connectors.base import GovernmentDataConnector


class MockROCConnector(GovernmentDataConnector):
    """
    Mock connector for Registrars of Companies (ROC) Wise Company Master Data.
    Dataset source: https://www.data.gov.in/resource/registrars-companies-roc-wise-company-master-data#api
    """

    def __init__(self):
        super().__init__(
            source_name="ROC",
            api_base_url="https://api.data.gov.in/resource/roc-company-master-data"
        )

    def authenticate(self) -> bool:
        self.authenticated = True
        return True

    def fetch_company_data(self, registration_number: str) -> Dict[str, Any]:
        self.authenticate()
        cleaned_reg = registration_number.replace("-", "").replace(" ", "").upper()
        cin = f"U74999DL2018PTC{cleaned_reg[-6:]}"
        auth_cap = float(random.choice([1000000, 2500000, 5000000, 10000000, 25000000]))
        paid_cap = float(round(auth_cap * random.uniform(0.6, 1.0), 2))

        return {
            "cin": cin,
            "company_name": f"Enterprise-{registration_number}",
            "roc_code": "ROC Delhi",
            "registration_number": registration_number,
            "company_category": "Company limited by Shares",
            "company_subcategory": "Non-govt company",
            "class_of_company": "Private",
            "authorized_capital_inr": auth_cap,
            "paid_up_capital_inr": paid_cap,
            "date_of_incorporation": "2018-05-14",
            "company_status": "ACTIVE",
            "registered_address": f"Plot {random.randint(10, 99)}, Okhla Industrial Estate Phase III, New Delhi 110020",
            "raw_source": "ROC_DATA_GOV_IN"
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
                "compliance_type": "ROC_ANNUAL_RETURN",
                "reporting_period": period,
                "form_name": "MGT-7A / AOC-4",
                "srn_number": f"F{random.randint(10000000, 99999999)}",
                "filing_date": "2025-10-28",
                "due_date": "2025-10-30",
                "amount_paid": 600.0,
                "status": "COMPLIANT"
            }
        ]

    def check_status(self) -> Dict[str, Any]:
        return {
            "source_name": self.source_name,
            "status": "ONLINE",
            "latency_ms": 32,
            "dataset_url": "https://www.data.gov.in/resource/registrars-companies-roc-wise-company-master-data#api",
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
