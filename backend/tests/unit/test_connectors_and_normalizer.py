import pytest
from app.connectors.epfo_mock import MockEPFOConnector
from app.connectors.esic_mock import MockESICConnector
from app.connectors.lin_mock import MockLINConnector
from app.connectors.state_mock import MockStateConnector
from app.services.sync_service import DataNormalizer


def test_epfo_mock_connector():
    connector = MockEPFOConnector()
    assert connector.check_status()["status"] == "ONLINE"
    
    comp_raw = connector.fetch_company_data("REG-12345")
    assert comp_raw["raw_source"] == "EPFO"
    assert "est_code" in comp_raw
    
    comp_records = connector.fetch_compliance_data("REG-12345", "2026-Q1")
    assert len(comp_records) > 0
    assert comp_records[0]["compliance_type"] == "EPFO"


def test_data_normalizer():
    connector = MockEPFOConnector()
    raw_bundle = connector.synchronize("REG-1001")
    
    company_norm = DataNormalizer.normalize_company_record("EPFO", "REG-1001", raw_bundle["company_raw"])
    assert company_norm.registration_number == "REG-1001"
    assert company_norm.raw_source == "EPFO"
    
    compliance_norm = DataNormalizer.normalize_compliance_records("EPFO", raw_bundle["compliance_raw"])
    assert len(compliance_norm) == 1
    assert compliance_norm[0].compliance_type == "EPFO"
    
    worker_norm = DataNormalizer.normalize_worker_summary("EPFO", raw_bundle["compliance_raw"])
    assert worker_norm.total_employees_covered == 145
    assert worker_norm.total_employer_contribution > 0
