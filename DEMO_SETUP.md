# SURAKSHIT-SHRAM — DEMO SETUP & HACKATHON PRESENTATION GUIDE

This guide provides step-by-step instructions for running a live demonstration of **SURAKSHIT SHRAM** across all four application roles: **Company**, **Inspector**, **Government Officer**, and **System Administrator**.

---

## 1. Environment Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24+ recommended)
- **Python**: v3.11 or higher (v3.14 recommended)
- **Git**

### Environment Configuration
1. Copy `.env.example` to `.env` in the root directory:
   ```bash
   cp .env.example .env
   ```
2. Configure your demo seed passwords in `.env`:
   ```env
   DEMO_ADMIN_PASSWORD=your_secure_admin_password
   DEMO_COMPANY_PASSWORD=your_secure_company_password
   DEMO_INSPECTOR_PASSWORD=your_secure_inspector_password
   DEMO_GOVERNMENT_PASSWORD=your_secure_government_password
   ```

---

## 2. Database Seeding & Startup

1. **Activate Python Virtual Environment & Install Dependencies**:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r backend/requirements.txt
   ```

2. **Run Database Migrations & Seed Script**:
   ```bash
   python -m alembic upgrade head
   python backend/scripts/seed_database.py
   ```

3. **Launch Backend Gateway**:
   ```bash
   python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8009
   ```
   - OpenAPI Swagger UI: `http://127.0.0.1:8009/docs`
   - Health Check: `http://127.0.0.1:8009/api/v1/health`

4. **Launch Frontend Application**:
   ```bash
   npm install
   npm run dev
   ```
   - Frontend Portal: `http://localhost:3000`

---

## 3. Demo User Accounts

| Role | Username | Email | Environment Password Variable |
|---|---|---|---|
| **COMPANY** | `bharat_textiles` | `compliance@bharattextiles.synth` | `<DEMO_COMPANY_PASSWORD>` |
| **INSPECTOR** | `inspector_sharma` | `inspector.sharma@labour.gov.in` | `<DEMO_INSPECTOR_PASSWORD>` |
| **GOVERNMENT** | `gov_nodal` | `nodal.officer@labour.gov.in` | `<DEMO_GOVERNMENT_PASSWORD>` |
| **ADMIN** | `sysadmin` | `admin@surakshit.gov.in` | `<DEMO_ADMIN_PASSWORD>` |

---

## 4. Live Hackathon Demonstration Flow

### Step 1: Establishment Compliance Portal (`COMPANY` Role)
1. Open `http://localhost:3000/login` and log in as `bharat_textiles`.
2. **Dashboard Overview**: View establishment risk meter, compliance rate, and missing document alerts.
3. **Upload Compliance Document**: Navigate to `/company/documents` and submit an ECR Challan / Payroll Sheet.
4. **AI Document OCR**: View extracted challan fields and OCR confidence score (`POST /api/v1/ai/document-analysis`).
5. **State-Adaptive Compliance Audit**: View state rules evaluation for Delhi (`DL`) vs Maharashtra (`MH`) (`POST /api/v1/ai/compliance-analysis`).
6. **ML Risk Scorecard & Bias Check**: View Random Forest risk score and fairness auditor calibration.
7. **Explainable AI (SHAP)**: View feature contribution breakdown and recommended statutory interventions (`POST /api/v1/ai/risk-explanation`).

### Step 2: Enforcement Portal (`INSPECTOR` Role)
1. Open `/login` and log in as `inspector_sharma`.
2. **Establishment Search**: Search for `Synthetic Enterprise 01 Ltd`.
3. **Schedule Inspection**: Click **Schedule Inspection** and update inspection status.
4. **Log Statutory Violation**: Log a minimum wage / overtime discrepancy violation.
5. **Issue 30-Day Improvement Notice**: Issue notice tracking 30-day compliance remediation.

### Step 3: National Dashboard (`GOVERNMENT` Role)
1. Open `/login` and log in as `gov_nodal`.
2. **National Overview**: View state-by-state compliance map and high-risk establishment distribution.
3. **Open Data Sync**: Trigger connector sync across Data.gov.in ROC Company Data & UDYAM MSME datasets (`POST /api/v1/sync/all`).
4. **Sandbox Simulators**: View EPFO and ESIC sandbox connector metrics.

---

## 5. Connector Classification Reference

- **Data.gov.in ROC Company Master Data**: **REAL OPEN DATA API**
- **Data.gov.in UDYAM MSME**: **REAL OPEN DATA API**
- **EPFO ECR Gateway**: **SANDBOX / SIMULATED CONNECTOR**
- **ESIC Contribution Portal**: **SANDBOX / SIMULATED CONNECTOR**
- **LIN Factories Act Portal**: **SANDBOX / SIMULATED CONNECTOR**
- **State Labor Department**: **SANDBOX / SIMULATED CONNECTOR**
