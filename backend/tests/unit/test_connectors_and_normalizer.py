import pytest
from app.connectors.epfo_mock import MockEPFOConnector
from app.connectors.esic_mock import MockESICConnector
from app.connectors.lin_mock import MockLINConnector
from app.connectors.state_mock import MockStateConnector
from app.connectors.roc_mock import MockROCConnector
from app.connectors.udyam_mock import MockUdyamConnector
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


def test_roc_mock_connector():
    connector = MockROCConnector()
    assert connector.check_status()["status"] == "ONLINE"
    
    comp_raw = connector.fetch_company_data("REG-9999")
    assert comp_raw["raw_source"] == "ROC_DATA_GOV_IN"
    assert "cin" in comp_raw
    assert "authorized_capital_inr" in comp_raw
    
    norm = DataNormalizer.normalize_company_record("ROC", "REG-9999", comp_raw)
    assert norm.cin is not None
    assert norm.authorized_capital_inr > 0


def test_udyam_mock_connector():
    connector = MockUdyamConnector()
    assert connector.check_status()["status"] == "ONLINE"
    
    comp_raw = connector.fetch_company_data("REG-8888")
    assert comp_raw["raw_source"] == "UDYAM_DATA_GOV_IN"
    assert "udyam_registration_number" in comp_raw
    assert "msme_category" in comp_raw
    
    norm = DataNormalizer.normalize_company_record("UDYAM_MSME", "REG-8888", comp_raw)
    assert norm.udyam_registration_number.startswith("UDYAM-")
    assert norm.msme_category in ("MICRO", "SMALL", "MEDIUM")


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
