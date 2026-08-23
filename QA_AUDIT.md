# SURAKSHIT SHRAM — QA Audit & Feature Inventory

Comprehensive discovery and feature inventory report for the **SURAKSHIT SHRAM** labor compliance platform.

---

## 1. System Overview

**SURAKSHIT SHRAM** is a full-stack, AI-powered government labor compliance management platform consisting of:
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Recharts, Lucide Icons.
- **Backend**: FastAPI (Python 3.14), SQLAlchemy ORM, Alembic migrations, Pytest.
- **Database**: PostgreSQL (with SQLite fallback for local development).
- **Caching**: Redis (with in-memory fallback for local development).
- **AI Engine (`AI_Modules/`)**: Tesseract OCR, EasyOCR, Indian Legal NLP, State-Adaptive Labor Code Rule Engine, ML Risk Scorecard, SHAP Explainable AI, Isolation Forest Fraud Detector, and Bias Checker.
- **Data Connectors (`backend/app/connectors/`)**: EPFO, ESIC, LIN, State Labor/Treasury, ROC Company Master Data, UDYAM MSME units.

---

## 2. Comprehensive Feature Inventory

### A. Frontend Routes & Dashboards
1. **Landing & Auth**:
   - `/` — Homepage landing page
   - `/login` — Multi-role authentication page (`COMPANY`, `INSPECTOR`, `GOVERNMENT`, `ADMIN`)
2. **Company Portal (`/company`)**:
   - `/company/dashboard` — Enterprise Overview, Risk Meter, Compliance Summary
   - `/company/compliance` — EPFO/ESIC/LIN Compliance Records
   - `/company/documents` — ECR Challans & Document Upload Workflow
   - `/company/inspections` — Scheduled & Historical Inspections
   - `/company/notices` — 30-Day Improvement Notices & Remediation
   - `/company/grievances` — Worker Grievances & Resolution Status
3. **Inspector Portal (`/inspector`)**:
   - `/inspector/dashboard` — Active Assignments, High-Risk Map, Daily Plan
   - `/inspector/inspections` — Inspection Records List & Filters
   - `/inspector/inspections/[id]` — Detailed Inspection Execution, Evidence Upload & Findings
   - `/inspector/profile` — Inspector Credential & Jurisdiction Profile
4. **Government Portal (`/government`)**:
   - `/government/dashboard` — Executive Command Center, State Risk Map
   - `/government/analytics` — Regional & Industry Compliance Trends
   - `/government/establishments` — National Establishment Master Registry & ROC/UDYAM Data
   - `/government/alerts` — Escalated Violations & High-Risk Anomaly Alerts
5. **Specialized Views**:
   - `/gig-worker/dashboard` — Gig/Platform Worker Coverage Portal
   - `/small-business/dashboard` — MSME / Small Business Simplified View
   - `/worker/grievances` & `/worker/grievances/new` — Worker Complaint Submission Portal
   - `/design-system` — UI Component Gallery & Tokens

### B. Backend API Routers (`backend/app/api/`)
1. `auth.py`:
   - `POST /api/v1/auth/login` — JWT Authentication
   - `POST /api/v1/auth/register` — Company Self-Registration
   - `GET /api/v1/auth/me` — Current Authenticated Profile
   - `POST /api/v1/auth/admin/create-user` — Admin User Provisioning
2. `companies.py`:
   - `GET /api/v1/companies` — Search & Paginate Establishments
   - `POST /api/v1/companies` — Create Establishment Profile
   - `GET /api/v1/companies/{id}` — Fetch Establishment Detail
   - `PUT /api/v1/companies/{id}` — Update Profile
   - `DELETE /api/v1/companies/{id}` — Soft Delete Establishment
3. `compliance.py`:
   - `GET /api/v1/companies/{id}/compliance` — List Compliance Records
   - `POST /api/v1/compliance` — Log New Compliance Record
4. `documents.py`:
   - `GET /api/v1/companies/{id}/documents` — List Company Documents
   - `POST /api/v1/documents/upload` — Multipart File Upload & Document Hashing
5. `inspections.py`:
   - `GET /api/v1/inspections` — List Inspections (Filtered by role)
   - `POST /api/v1/inspections` — Schedule New Inspection
   - `GET /api/v1/inspections/{id}` — Inspection Details
   - `PUT /api/v1/inspections/{id}` — Update Status & Findings
   - `POST /api/v1/inspections/{id}/report` — Upload Official Report
   - `POST /api/v1/violations` — Log Violation Record
   - `POST /api/v1/improvement-notices` — Issue 30-Day Improvement Notice
6. `government_data.py`:
   - `POST /api/v1/sync/{source_name}` — Sync EPFO, ESIC, LIN, State, ROC, UDYAM Data
   - `GET /api/v1/sync/status` — Connector Health & Sync Metrics
   - `GET /api/v1/government/companies` — Government National Master Registry
7. `risk.py`:
   - `GET /api/v1/companies/{id}/risk` — Calculate & Fetch Composite Risk Score
8. `ai.py`:
   - `POST /api/v1/ai/document-analysis` — OCR Entity Extraction & Fraud Risk
   - `POST /api/v1/ai/compliance-analysis` — State-Adaptive Labor Code Rule Engine
   - `POST /api/v1/ai/risk-analysis` — ML Risk Score + Bias Fairness Adjustment
   - `POST /api/v1/ai/risk-explanation` — SHAP Explainability Factor Breakdown
   - `POST /api/v1/ai/fraud-analysis` — Isolation Forest Anomaly Detection
9. `health.py`:
   - `GET /api/v1/health` — System Health & Service Status

### C. Database Models (`backend/app/models/`)
1. `User` (`users` table): User authentication, JWT roles (`ADMIN`, `INSPECTOR`, `GOVERNMENT`, `COMPANY`), `company_id`.
2. `Company` (`companies` table): Establishment registration info, LIN, CIN, Udyam ID, state, district, size, worker count, soft-delete flag.
3. `ComplianceRecord` (`compliance_records` table): EPFO, ESIC, LIN filings, wage period, status, verification flags.
4. `Document` (`documents` table): File metadata, SHA-256 hash, storage path, upload date, verification status.
5. `Inspection` (`inspections` table): Scheduled/completed inspections, inspector ID, findings, report reference.
6. `Violation` (`violations` table): Statute violation details, severity (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), status.
7. `ImprovementNotice` (`improvement_notices` table): 30-day compliance notices, deadline, company response.
8. `RiskScore` (`risk_scores` table): Calculated risk score (0-100), risk level, explanation reasons JSON.
9. `DataSource` (`data_sources` table): Government API source metadata, sync status, last sync timestamp.
10. `AuditLog` (`audit_logs` table): Cryptographically traceable action logs, user ID, request ID, resource ID.
11. `AIAnalysis` (`ai_analyses` table): Persisted AI OCR, state rules, risk scorecards, and fraud analyses.

### D. AI Modules (`AI_Modules/`)
1. **OCR Engine**: Tesseract + EasyOCR with OpenCV/Pillow preprocessing.
2. **NLP Engine**: Indian legal NLP, payroll item parser (Basic, DA, HRA, PF, ESI, Net Pay).
3. **State-Adaptive Rule Engine**: Evaluates Central Labour Codes (Wages, SS, OSH, IR) and state amendments (MH, DL, KA, TN, GJ, HR).
4. **Risk Scorecard & SHAP**: Pre-trained Random Forest model (`risk_scorecard_model.pkl`) & feature contribution breakdown.
5. **Fraud Detection**: Pre-trained Isolation Forest anomaly detector (`fraud_detection_model.pkl`) & EPFO/ESIC discrepancy comparator.
6. **Bias & Fairness Checker**: Algorithmic fairness auditor adjusting risk scores across regions and company scale.

### E. Government Data Connectors (`backend/app/connectors/`)
- `epfo_mock.py` — Mock EPFO ECR filing connector
- `esic_mock.py` — Mock ESIC contribution connector
- `lin_mock.py` — Mock Labor Identification Number connector
- `state_mock.py` — Mock State Treasury & Minimum Wage connector
- `roc_mock.py` — Data.gov.in ROC Company Master Data connector
- `udyam_mock.py` — Data.gov.in UDYAM MSME Registration connector
