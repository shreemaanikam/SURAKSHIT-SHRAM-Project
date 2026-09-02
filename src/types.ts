export type UserRole = 'company' | 'inspector' | 'government' | 'worker' | 'admin';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'ta' | 'te';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  organization: string;
  maskedAadhaar?: string;
  maskedPan?: string;
  maskedMobile?: string;
  establishmentId?: string;
  district?: string;
  state?: string;
  badgeNumber?: string;
  phone?: string;
  avatarUrl?: string;
  uanNumber?: string;
}

export type ComplianceCategory =
  | 'EPFO'
  | 'ESIC'
  | 'Wages'
  | 'Attendance'
  | 'Working Hours'
  | 'Leave'
  | 'Safety'
  | 'Documents';

export type RiskLevel = 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical';

export interface RiskFactor {
  id: string;
  type: 'missing_docs' | 'wage_inconsistency' | 'unresolved_notice' | 'attendance_anomaly' | 'inspection_history';
  title: string;
  description: string;
  impactScore: number; // e.g. -12 points
  codeReference: string; // e.g. "Code on Wages 2019, Sec 18(2)"
  severity: 'critical' | 'high' | 'medium' | 'low';
  resolved: boolean;
  detectedDate: string;
}

export interface CategoryCompliance {
  category: ComplianceCategory;
  score: number; // 0 - 100
  status: 'Compliant' | 'Needs Attention' | 'Non-Compliant';
  lastAuditDate: string;
  openIssuesCount: number;
  benchmarkScore: number;
  description: string;
}

export interface ScoreTrendPoint {
  month: string;
  score: number;
  stateAverage: number;
  industryBenchmark: number;
}

export interface CompanyDetails {
  id: string;
  name: string;
  linNumber: string; // Labour Identification Number
  establishmentId: string;
  panNumberMasked: string;
  industry: string;
  sector: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  totalWorkers: number;
  permanentWorkers: number;
  contractWorkers: number;
  femaleWorkersRatio: number;
  complianceScore: number;
  riskLevel: RiskLevel;
  lastInspectionDate: string;
  nextScheduledInspection?: string;
  categories: Record<ComplianceCategory, CategoryCompliance>;
  riskFactors: RiskFactor[];
  scoreTrends: ScoreTrendPoint[];
}

export interface DocumentItem {
  id: string;
  establishmentId: string;
  title: string;
  category: ComplianceCategory;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  periodCovered: string;
  status: 'verified' | 'processing' | 'rejected' | 'pending';
  ocrStatus: 'completed' | 'processing' | 'failed' | 'unprocessed';
  ocrExtraction: {
    fieldsExtracted: number;
    matchConfidence: number;
    extractedWageTotal?: string;
    workerCountExtracted?: number;
    filingChallanNumber?: string;
    anomaliesFound?: string[];
  };
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface NoticeResponse {
  id: string;
  submittedAt: string;
  submittedBy: string;
  responseText: string;
  attachments: { name: string; size: string; url?: string }[];
  status: 'submitted' | 'accepted' | 'rejected' | 'under_review';
  officialRemarks?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface NoticeItem {
  id: string;
  noticeNumber: string;
  establishmentId: string;
  establishmentName: string;
  category: ComplianceCategory;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  legalProvision: string;
  issueDate: string;
  dueDate: string;
  status: 'open' | 'under_review' | 'resolved' | 'overdue';
  issuingOfficer: string;
  potentialPenalty: string;
  responses: NoticeResponse[];
}

export interface InspectionChecklistItem {
  id: string;
  codeCategory: 'Wages' | 'Safety & Health' | 'Social Security' | 'Working Conditions';
  question: string;
  legalClause: string;
  status: 'compliant' | 'non_compliant' | 'not_applicable' | 'pending';
  observation: string;
  evidencePhotos: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  actionRequired?: string;
}

export interface InspectionItem {
  id: string;
  inspectionNumber: string;
  establishmentId: string;
  establishmentName: string;
  linNumber: string;
  industry: string;
  address: string;
  district: string;
  state: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'draft' | 'cancelled';
  inspectorId: string;
  inspectorName: string;
  riskScoreAtAssignment: number;
  checklist: InspectionChecklistItem[];
  findingsSummary: string;
  majorViolationsCount: number;
  minorViolationsCount: number;
  inspectorRemarks: string;
  recommendation: 'Pass with Certificate' | 'Issue 15-Day Improvement Notice' | 'Immediate Show Cause Notice' | 'Prosecution Proposed';
  digitalSignature?: string;
  geoStamp?: {
    lat: number;
    lng: number;
    accuracyMeters: number;
    timestamp: string;
    verifiedOnSite: boolean;
  };
  syncStatus: 'synced' | 'pending_sync' | 'offline_draft';
}

export interface GrievanceTimelineItem {
  date: string;
  title?: string;
  stage?: string;
  description?: string;
  actor?: string;
  statusBadge?: string;
  status?: 'completed' | 'current' | 'pending';
  remarks?: string;
}

export type GrievanceCategory =
  | 'Overtime Wage Non-Payment'
  | 'PF Deduction Non-Deposit'
  | 'PF / ESIC Deduction'
  | 'Unpaid Wages'
  | 'Excessive Work Hours'
  | 'OSH / Safety Violation'
  | 'Unsafe Working Conditions'
  | 'Maternity / Leave Denial'
  | 'Arbitrary Termination'
  | 'Harassment / Discrimination'
  | 'Other';

export interface GrievanceItem {
  id: string;
  trackingId: string;
  workerName: string;
  maskedAadhaar: string;
  maskedMobile?: string;
  workerPhoneMasked?: string;
  establishmentName: string;
  establishmentLocation?: string;
  linNumber?: string;
  category: GrievanceCategory;
  description: string;
  incidentDate?: string;
  filedDate: string;
  status: 'submitted' | 'under_investigation' | 'investigating' | 'notice_issued' | 'resolved' | 'rejected';
  urgency?: 'high' | 'medium' | 'standard';
  isAnonymous?: boolean;
  disputedAmount?: string;
  evidenceFiles?: { name: string; size: string }[];
  timeline: GrievanceTimelineItem[];
  resolutionDetails?: string;
  assignedOfficer?: string;
}

export interface ExplainableFactor {
  factor: string;
  weight: number;
  evidence: string;
}

export interface PredictiveAlertItem {
  id: string;
  alertCode?: string;
  title: string;
  description?: string;
  targetEntity?: string;
  targetEstablishmentLin?: string;
  linNumber?: string;
  clusterRegion?: string;
  region?: string;
  industrySector?: string;
  industry?: string;
  severity?: 'critical' | 'high' | 'medium' | 'low';
  riskCategory: 'wage_suppression' | 'contagion' | 'esic_evasion' | 'safety_hazard' | 'Potential Risk' | 'Surge Alert' | 'Wage Disparity Anomaly' | 'Sudden Drop in ESIC Filings';
  detectedDate: string;
  aiConfidence?: number;
  aiConfidencePct?: number;
  triggerSignals?: string[];
  suggestedAction: string;
  explainableFactors?: ExplainableFactor[];
  explainability?: {
    wageDisparityPct?: number;
    attendanceAnomalyPct?: number;
    workerTurnoverSurgePct?: number;
    historicalDefaultRate?: number;
    modelExplanation?: string;
  };
  verificationStatus?: 'Pending Verification' | 'Assigned for Inspection' | 'Dismissed as False Positive' | 'Notice Dispatched';
  requiresVerificationDisclaimer?: boolean;
}

export interface NationalStats {
  nationalComplianceAverage: number;
  totalEstablishmentsMonitored: number;
  totalWorkersCovered: number;
  highRiskEstablishmentsCount: number;
  inspectionsCompletedThisMonth: number;
  noticesIssuedThisMonth: number;
  sectorBreakdown: {
    sector: string;
    avgCompliance: number;
    establishmentsCount: number;
  }[];
}

export interface GovHierarchyItem {
  id: string;
  name: string;
  code: string;
  type: 'national' | 'state' | 'district' | 'industry' | 'establishment';
  parentId?: string;
  totalEstablishments: number;
  compliantEstablishments: number;
  mediumRisk: number;
  highRisk: number;
  activeInspections: number;
  completedInspections: number;
  openNotices: number;
  overdueNotices: number;
  workerGrievances: number;
  complianceRate: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'active' | 'suspended' | 'pending_activation';
  lastLogin: string;
  assignedJurisdiction: string;
  mfaEnabled: boolean;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  role: UserRole;
  action: string;
  targetEntity: string;
  ipAddress: string;
  status: 'success' | 'flagged' | 'failed';
}

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  ipAddressMasked: string;
  status: 'success' | 'flagged' | 'failed';
  details: string;
}

export interface SystemServiceHealth {
  serviceName: string;
  status: 'operational' | 'degraded' | 'maintenance';
  latencyMs: number;
  uptimePct: number;
  lastChecked: string;
}
