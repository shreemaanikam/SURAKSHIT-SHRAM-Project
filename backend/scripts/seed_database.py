import json
import random
import sys
import os
from datetime import datetime, date, timedelta, timezone

# Add backend root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.connection import init_db, SessionLocal
from app.models.user import User, UserRole
from app.models.company import Company
from app.models.compliance import ComplianceRecord
from app.models.document import Document
from app.models.inspection import Inspection
from app.models.violation import Violation
from app.models.risk_score import RiskScore
from app.models.improvement_notice import ImprovementNotice
from app.models.data_source import DataSource
from app.core.security import get_password_hash


def seed_database():
    """Generates synthetic seed data for local testing and demonstration."""
    print("🌱 Initializing database tables...")
    init_db()

    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(Company).count() > 0:
            print("⚡ Database already contains seed data. Skipping seeding.")
            return

        print("🏢 Creating 20 synthetic companies...")
        industries = ["Textiles & Garments", "Automotive Manufacturing", "Pharmaceuticals", "IT Services", "Food Processing", "Construction"]
        states_districts = [
            ("Delhi", "North Delhi"), ("Maharashtra", "Pune"), ("Karnataka", "Bengaluru Urban"),
            ("Tamil Nadu", "Chennai"), ("Gujarat", "Ahmedabad"), ("Haryana", "Gurugram")
        ]

        companies = []
        for i in range(1, 21):
            st, dist = states_districts[i % len(states_districts)]
            ind = industries[i % len(industries)]
            c = Company(
                legal_name=f"Synthetic Enterprise {i:02d} Ltd",
                registration_number=f"REG-SYNTH-2026-{1000 + i}",
                industry=ind,
                state=st,
                district=dist,
                address=f"Plot {10 + i}, Industrial Area Phase-{i%3 + 1}, {dist}, {st}",
                company_size="MEDIUM" if i % 2 == 0 else "LARGE" if i % 5 == 0 else "SMALL",
                employee_count=random.randint(25, 450),
                establishment_date=date(2015 + (i % 8), (i % 12) + 1, 15)
            )
            db.add(c)
            companies.append(c)
        db.commit()

        # Refresh to get IDs
        for c in companies:
            db.refresh(c)

        print("👤 Creating synthetic default users across roles...")
        admin_user = User(
            email="admin@surakshit.gov.in",
            username="sysadmin",
            password_hash=get_password_hash("AdminSecret2026!"),
            role=UserRole.ADMIN,
            is_active=True
        )
        inspector_user = User(
            email="inspector.sharma@labour.gov.in",
            username="inspector_sharma",
            password_hash=get_password_hash("InspectorSecret2026!"),
            role=UserRole.INSPECTOR,
            is_active=True
        )
        gov_user = User(
            email="nodal.officer@labour.gov.in",
            username="gov_nodal",
            password_hash=get_password_hash("GovOfficerSecret2026!"),
            role=UserRole.GOVERNMENT,
            is_active=True
        )
        company_user = User(
            email="compliance@bharattextiles.synth",
            username="bharat_textiles",
            password_hash=get_password_hash("CompanySecret2026!"),
            role=UserRole.COMPANY,
            company_id=companies[0].id,
            is_active=True
        )
        db.add_all([admin_user, inspector_user, gov_user, company_user])
        db.commit()
        db.refresh(inspector_user)
        db.refresh(company_user)

        print("📜 Seeding compliance records, inspections, violations, and risk scores...")
        for comp in companies:
            # Compliance Records
            epfo_rec = ComplianceRecord(
                company_id=comp.id,
                compliance_type="EPFO",
                status="COMPLIANT" if comp.id % 4 != 0 else "NON_COMPLIANT",
                reporting_period="2026-Q1",
                source="EPFO_MOCK",
                verified=True
            )
            esic_rec = ComplianceRecord(
                company_id=comp.id,
                compliance_type="ESIC",
                status="COMPLIANT" if comp.id % 3 != 0 else "PARTIAL",
                reporting_period="2026-Q1",
                source="ESIC_MOCK",
                verified=True
            )
            lin_rec = ComplianceRecord(
                company_id=comp.id,
                compliance_type="FACTORIES_ACT",
                status="COMPLIANT",
                reporting_period="2026-Q1",
                source="LIN_MOCK",
                verified=True
            )
            roc_rec = ComplianceRecord(
                company_id=comp.id,
                compliance_type="ROC_ANNUAL_RETURN",
                status="COMPLIANT",
                reporting_period="2026-Q1",
                source="ROC_MOCK",
                verified=True
            )
            udyam_rec = ComplianceRecord(
                company_id=comp.id,
                compliance_type="MSME_SAMADHAAN_FILING",
                status="COMPLIANT",
                reporting_period="2026-Q1",
                source="UDYAM_MSME_MOCK",
                verified=True
            )
            db.add_all([epfo_rec, esic_rec, lin_rec, roc_rec, udyam_rec])

            # Synthetic Document Metadata
            doc = Document(
                company_id=comp.id,
                document_type="ECR_CHALLAN",
                filename=f"ECR_Challan_2026_Q1_{comp.id}.pdf",
                storage_reference=f"./storage/documents/synth_doc_{comp.id}.pdf",
                document_hash=f"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85{comp.id % 10}",
                uploaded_by=company_user.id,
                verification_status="VERIFIED"
            )
            db.add(doc)

            # Inspections & Violations for non-compliant companies
            if comp.id % 3 == 0:
                insp = Inspection(
                    company_id=comp.id,
                    inspector_id=inspector_user.id,
                    inspection_date=datetime.now(timezone.utc) - timedelta(days=random.randint(5, 45)),
                    status="COMPLETED",
                    findings="Minor safety equipment irregularities and missing overtime register entry.",
                    report_reference=f"INS-REP-2026-{comp.id:03d}"
                )
                db.add(insp)
                db.commit()
                db.refresh(insp)

                viol = Violation(
                    company_id=comp.id,
                    violation_type="SAFETY_EQUIPMENT_DEFICIENCY",
                    severity="MEDIUM" if comp.id % 6 == 0 else "HIGH",
                    description="Inadequate Personal Protective Equipment (PPE) provided to factory workers in shop floor B.",
                    status="OPEN"
                )
                db.add(viol)
                db.commit()
                db.refresh(viol)

                notice = ImprovementNotice(
                    company_id=comp.id,
                    violation_id=viol.id,
                    deadline=datetime.now(timezone.utc) + timedelta(days=30),
                    status="ISSUED",
                    escalation_status="NONE"
                )
                db.add(notice)

            # Risk Score
            score_val = 15.0 + (comp.id * 3.8) % 75.0
            r_level = "LOW" if score_val < 25 else "MEDIUM" if score_val < 50 else "HIGH" if score_val < 75 else "CRITICAL"
            r_score = RiskScore(
                company_id=comp.id,
                score=round(score_val, 2),
                risk_level=r_level,
                reasons=json.dumps([f"Compliance history status evaluation for {comp.legal_name}"]),
                model_version="v1.0-rules-engine"
            )
            db.add(r_score)

        print("🔌 Initializing Government DataSource entries...")
        sources = [
            DataSource(source_name="EPFO", source_type="MOCK_CONNECTOR", status="ACTIVE", sync_status="SUCCESS", last_sync=datetime.now(timezone.utc)),
            DataSource(source_name="ESIC", source_type="MOCK_CONNECTOR", status="ACTIVE", sync_status="SUCCESS", last_sync=datetime.now(timezone.utc)),
            DataSource(source_name="LIN", source_type="MOCK_CONNECTOR", status="ACTIVE", sync_status="SUCCESS", last_sync=datetime.now(timezone.utc)),
            DataSource(source_name="STATE_LABOR", source_type="MOCK_CONNECTOR", status="ACTIVE", sync_status="SUCCESS", last_sync=datetime.now(timezone.utc)),
            DataSource(source_name="ROC", source_type="MOCK_CONNECTOR", status="ACTIVE", sync_status="SUCCESS", last_sync=datetime.now(timezone.utc)),
            DataSource(source_name="UDYAM_MSME", source_type="MOCK_CONNECTOR", status="ACTIVE", sync_status="SUCCESS", last_sync=datetime.now(timezone.utc)),
        ]
        db.add_all(sources)

        db.commit()
        print("✅ Database successfully seeded with 20 synthetic companies, ROC, and UDYAM datasets!")

    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
