// API Service Client for SURAKSHIT SHRAM FastAPI Backend

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'https://surakshit-shram-api.onrender.com/api/v1';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    role: string;
    company_id?: number;
  };
}

export interface DocumentAnalysisResponse {
  document_id?: string;
  document_type: string;
  extracted_text: string;
  extracted_fields: Record<string, any>;
  confidence_score: number;
  fraud_risk_level: string;
  is_valid: boolean;
  warnings: string[];
}

export interface ComplianceAnalysisResponse {
  company_id: number;
  state_code: string;
  jurisdiction: string;
  overall_compliance_score: number;
  evaluated_rules_count: number;
  violations_count: number;
  violations: Array<{
    rule_id: string;
    title: string;
    severity: string;
    description: string;
    statute: string;
    penalty: string;
  }>;
}

export interface RiskAnalysisResponse {
  company_id: number;
  raw_risk_score: number;
  adjusted_risk_score: number;
  risk_level: string;
  model_name: string;
  bias_adjustment_applied: boolean;
  bias_details?: Record<string, any>;
}

export interface RiskExplanationResponse {
  company_id: number;
  risk_score: number;
  top_risk_factors: Array<{
    feature: string;
    importance_score: number;
    impact: string;
    description: string;
  }>;
  recommended_actions: string[];
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('surakshit_jwt_token');
  }

  public setToken(token: string) {
    this.token = token;
    localStorage.setItem('surakshit_jwt_token', token);
  }

  public getToken(): string | null {
    return this.token || localStorage.getItem('surakshit_jwt_token');
  }

  public logout() {
    this.token = null;
    localStorage.removeItem('surakshit_jwt_token');
  }

  private getHeaders(extraHeaders: Record<string, string> = {}): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...extraHeaders,
    };

    const currentToken = this.getToken();
    if (currentToken) {
      headers['Authorization'] = `Bearer ${currentToken}`;
    }

    return headers;
  }

  public async getHealth(): Promise<{ status: string; version: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) throw new Error(`Health status ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API Health Check offline fallback:', err);
      return { status: 'ONLINE_LOCAL_FALLBACK', version: '1.0.0' };
    }
  }

  public async login(username: string, password: string): Promise<LoginResponse | null> {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      if (data.access_token) {
        this.setToken(data.access_token);
      }
      return data;
    } catch (err) {
      console.warn('Backend login fallback:', err);
      return null;
    }
  }

  public async analyzeDocument(fileContent: string, fileName: string): Promise<DocumentAnalysisResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/document-analysis`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          raw_text: fileContent,
          file_name: fileName,
          document_type: fileName.includes('salary') ? 'PAYROLL' : 'ATTENDANCE',
        }),
      });

      if (!res.ok) throw new Error(`OCR Document analysis status ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('AI Document Analysis API fallback:', err);
      return null;
    }
  }

  public async analyzeCompliance(companyId: number, stateCode: string): Promise<ComplianceAnalysisResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/compliance-analysis`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          company_id: companyId,
          state_code: stateCode,
        }),
      });

      if (!res.ok) throw new Error(`Compliance analysis status ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('AI Compliance Rules API fallback:', err);
      return null;
    }
  }

  public async calculateRiskScore(companyId: number): Promise<RiskAnalysisResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/risk-analysis`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          company_id: companyId,
        }),
      });

      if (!res.ok) throw new Error(`Risk Scorecard status ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('AI Risk Scorecard API fallback:', err);
      return null;
    }
  }

  public async explainRiskScore(companyId: number): Promise<RiskExplanationResponse | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/risk-explanation`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          company_id: companyId,
        }),
      });

      if (!res.ok) throw new Error(`Risk Explanation status ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('AI Explainability API fallback:', err);
      return null;
    }
  }

  public async syncGovernmentData(): Promise<{ status: string; records_synced: number } | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/sync/all`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!res.ok) throw new Error(`Government data sync status ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Government Data Sync API fallback:', err);
      return null;
    }
  }
}

export const api = new ApiService();
