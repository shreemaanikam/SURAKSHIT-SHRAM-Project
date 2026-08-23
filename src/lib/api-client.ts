/**
 * SURAKSHIT SHRAM — Full-Stack API Client Utility
 * Integrates Next.js Frontend pages with FastAPI Backend Gateway (/api/v1).
 * Supports automatic JWT bearer token handling and graceful fallback.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface ApiUser {
  id: number;
  email: string;
  username: string;
  role: "ADMIN" | "INSPECTOR" | "GOVERNMENT" | "COMPANY";
  company_id?: number | null;
  is_active: boolean;
}

export interface ApiCompany {
  id: number;
  legal_name: string;
  registration_number: string;
  industry: string;
  state: string;
  district: string;
  address: string;
  company_size: string;
  employee_count: number;
  establishment_date: string;
  is_deleted?: boolean;
}

export interface ApiComplianceRecord {
  id: number;
  company_id: number;
  compliance_type: string;
  status: "COMPLIANT" | "NON_COMPLIANT" | "PARTIAL" | "UNDER_REVIEW";
  reporting_period: string;
  source: string;
  verified: boolean;
  created_at: string;
}

export interface ApiDocument {
  id: number;
  company_id: number;
  document_type: string;
  filename: string;
  document_hash: string;
  upload_date: string;
  verification_status: string;
}

export interface ApiInspection {
  id: number;
  company_id: number;
  inspector_id?: number;
  inspection_date: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  findings?: string;
  report_reference?: string;
}

export interface ApiRiskScore {
  id: number;
  company_id: number;
  score: number;
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  reasons: string[];
  calculated_at: string;
}

export interface ApiSyncStatus {
  sources: Array<{
    id: number;
    source_name: string;
    source_type: string;
    status: string;
    last_sync?: string;
    sync_status: string;
    error_message?: string;
  }>;
  total_sources: number;
  active_sources: number;
}

export interface ApiAIDocumentResponse {
  document_id?: number;
  document_type: string;
  ocr_extracted_text: string;
  confidence_score: number;
  key_fields: Record<string, any>;
  fraud_risk_level: string;
  processing_timestamp: string;
}

export interface ApiAIComplianceResponse {
  company_id: number;
  state_code: string;
  overall_compliance_rate: number;
  evaluated_rules_count: number;
  rule_evaluations: Array<{
    rule_id: string;
    rule_name: string;
    act_name: string;
    compliance_status: string;
    penalty_estimate_inr: number;
    description: string;
  }>;
  analysis_timestamp: string;
}

export interface ApiAIRiskResponse {
  company_id: number;
  raw_risk_score: number;
  adjusted_risk_score: number;
  risk_level: string;
  bias_adjustment_applied: boolean;
  adjustment_reason: string;
  model_version: string;
  timestamp: string;
}

export interface ApiAIRiskExplanationResponse {
  company_id: number;
  composite_risk_score: number;
  risk_level: string;
  shap_explainability_factors: Array<{
    factor_name: string;
    weight: number;
    contribution_score: number;
    explanation: string;
  }>;
  recommended_interventions: string[];
  model_metadata: Record<string, any>;
}

export interface ApiAIFraudResponse {
  company_id: number;
  is_fraud: boolean;
  confidence_score: number;
  anomaly_reasons: string[];
  features_extracted: Record<string, any>;
  analysis_timestamp: string;
}

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
    }
    return {};
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      "Content-Type": "application/json",
      ...this.getAuthHeader(),
      ...((options.headers as Record<string, string>) || {}),
    };

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error?.message || errorData?.detail || `HTTP Error ${response.status}`;
      throw new Error(message);
    }

    return response.json();
  }

  // Auth Methods
  async login(username_or_email: string, password: string): Promise<{ access_token: string; role: string; user: ApiUser }> {
    const data = await this.request<{ access_token: string; role: string; user: ApiUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username_or_email, password }),
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_role", data.role);
    }
    return data;
  }

  async getMe(): Promise<ApiUser> {
    return this.request<ApiUser>("/auth/me");
  }

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_role");
    }
  }

  // Company Methods
  async getCompanies(page = 1, size = 10, search?: string): Promise<{ items: ApiCompany[]; total: number }> {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
    return this.request<{ items: ApiCompany[]; total: number }>(`/companies?page=${page}&size=${size}${searchParam}`);
  }

  async getCompany(id: number): Promise<ApiCompany> {
    return this.request<ApiCompany>(`/companies/${id}`);
  }

  // Compliance Methods
  async getCompanyCompliance(companyId: number): Promise<ApiComplianceRecord[]> {
    return this.request<ApiComplianceRecord[]>(`/companies/${companyId}/compliance`);
  }

  // Documents Methods
  async getCompanyDocuments(companyId: number): Promise<ApiDocument[]> {
    return this.request<ApiDocument[]>(`/companies/${companyId}/documents`);
  }

  // Inspection Methods
  async getCompanyInspections(companyId: number): Promise<ApiInspection[]> {
    return this.request<ApiInspection[]>(`/companies/${companyId}/inspections`);
  }

  // Risk Score Methods
  async getCompanyRisk(companyId: number): Promise<ApiRiskScore> {
    return this.request<ApiRiskScore>(`/companies/${companyId}/risk`);
  }

  // AI Engine Gateway Methods
  async analyzeAIDocument(document_id?: number, document_type = "ECR_CHALLAN"): Promise<ApiAIDocumentResponse> {
    return this.request<ApiAIDocumentResponse>("/ai/document-analysis", {
      method: "POST",
      body: JSON.stringify({ document_id, document_type }),
    });
  }

  async analyzeAICompliance(companyId: number, stateCode = "DL"): Promise<ApiAIComplianceResponse> {
    return this.request<ApiAIComplianceResponse>("/ai/compliance-analysis", {
      method: "POST",
      body: JSON.stringify({ company_id: companyId, state_code: stateCode }),
    });
  }

  async calculateAIRisk(companyId: number): Promise<ApiAIRiskResponse> {
    return this.request<ApiAIRiskResponse>("/ai/risk-analysis", {
      method: "POST",
      body: JSON.stringify({ company_id: companyId }),
    });
  }

  async getAIRiskExplanation(companyId: number): Promise<ApiAIRiskExplanationResponse> {
    return this.request<ApiAIRiskExplanationResponse>("/ai/risk-explanation", {
      method: "POST",
      body: JSON.stringify({ company_id: companyId }),
    });
  }

  async analyzeAIFraud(companyId: number, document_text?: string): Promise<ApiAIFraudResponse> {
    return this.request<ApiAIFraudResponse>("/ai/fraud-analysis", {
      method: "POST",
      body: JSON.stringify({ company_id: companyId, document_text }),
    });
  }

  // Sync Methods
  async triggerSync(source: string, companyId?: number): Promise<{ message: string; records_synced: number }> {
    const query = companyId ? `?company_id=${companyId}` : "";
    return this.request<{ message: string; records_synced: number }>(`/sync/${source}${query}`, {
      method: "POST",
    });
  }

  async getSyncStatus(): Promise<ApiSyncStatus> {
    return this.request<ApiSyncStatus>("/sync/status");
  }

  // Health Check
  async checkHealth(): Promise<{ status: string; version: string; database: string; cache: string }> {
    return this.request<{ status: string; version: string; database: string; cache: string }>("/health");
  }
}

export const apiClient = new ApiClient();
