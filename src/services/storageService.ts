import {
  AdminUser,
  CompanyDetails,
  DocumentItem,
  GrievanceItem,
  InspectionItem,
  NoticeItem,
  PredictiveAlertItem,
  NationalStats,
  AuditLogItem,
  SystemAuditLog,
  UserProfile,
  UserRole,
} from '../types';
import {
  ADMIN_USERS,
  DEMO_USERS,
  INITIAL_COMPANY,
  INITIAL_DOCUMENTS,
  INITIAL_GRIEVANCES,
  INITIAL_INSPECTIONS,
  INITIAL_NOTICES,
  PREDICTIVE_ALERTS,
  SYSTEM_AUDIT_LOGS,
} from '../data/mockData';

const KEYS = {
  CURRENT_USER: 'surakshit_current_user',
  COMPANY: 'surakshit_company_data',
  DOCUMENTS: 'surakshit_documents',
  NOTICES: 'surakshit_notices',
  INSPECTIONS: 'surakshit_inspections',
  GRIEVANCES: 'surakshit_grievances',
  ALERTS: 'surakshit_alerts',
  USERS: 'surakshit_admin_users',
  AUDIT_LOGS: 'surakshit_audit_logs',
  OFFLINE_MODE: 'surakshit_offline_mode',
  OFFLINE_QUEUE: 'surakshit_offline_queue',
};

// Safe JSON parser
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Storage set failed:', err);
  }
}

const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-20 09:14:22',
    userName: 'R. K. Verma, LEO',
    role: 'inspector',
    action: 'DIGITAL_SIGN_INSPECTION',
    targetEntity: 'INSP-MH-PUN-2026-074',
    ipAddress: '10.45.192.81',
    status: 'success',
  },
  {
    id: 'log-2',
    timestamp: '2026-08-20 08:45:10',
    userName: 'Rajesh Sharma, GM HR',
    role: 'company',
    action: 'INGEST_OCR_DOCUMENT',
    targetEntity: 'EPFO-ECR-CHALLAN-JUL26',
    ipAddress: '182.74.12.98',
    status: 'success',
  },
  {
    id: 'log-3',
    timestamp: '2026-08-20 07:30:19',
    userName: 'Dr. Sunita Rao, IAS',
    role: 'government',
    action: 'DISPATCH_PREDICTIVE_SQUAD',
    targetEntity: 'LIN-1849021948 (Apex Castings)',
    ipAddress: '14.139.224.12',
    status: 'success',
  },
  {
    id: 'log-4',
    timestamp: '2026-08-19 17:22:04',
    userName: 'Suresh Kumar, Fitter',
    role: 'worker',
    action: 'LODGE_GRIEVANCE',
    targetEntity: 'SS-GRV-2026-89421',
    ipAddress: '157.34.19.45',
    status: 'success',
  },
];

const INITIAL_NATIONAL_STATS: NationalStats = {
  nationalComplianceAverage: 79.2,
  totalEstablishmentsMonitored: 842900,
  totalWorkersCovered: 48920000,
  highRiskEstablishmentsCount: 18450,
  inspectionsCompletedThisMonth: 12480,
  noticesIssuedThisMonth: 3410,
  sectorBreakdown: [
    { sector: 'Automotive & Heavy Engg', avgCompliance: 78.4, establishmentsCount: 142000 },
    { sector: 'Electronics & Hardware', avgCompliance: 84.6, establishmentsCount: 98000 },
    { sector: 'Textiles & Garments', avgCompliance: 72.1, establishmentsCount: 184000 },
    { sector: 'Pharmaceuticals & API', avgCompliance: 88.2, establishmentsCount: 76000 },
    { sector: 'IT, ITeS & Services', avgCompliance: 91.5, establishmentsCount: 165000 },
    { sector: 'Construction & Mining', avgCompliance: 66.8, establishmentsCount: 177900 },
  ],
};

export const StorageService = {
  // Current active user
  getCurrentUser(): UserProfile | null {
    return safeGet<UserProfile | null>(KEYS.CURRENT_USER, DEMO_USERS.government);
  },

  loginAsRole(role: UserRole): UserProfile {
    const user = DEMO_USERS[role] || DEMO_USERS.company;
    safeSet(KEYS.CURRENT_USER, user);
    return user;
  },

  logout(): void {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  // Company details
  getCompany(): CompanyDetails {
    return safeGet<CompanyDetails>(KEYS.COMPANY, INITIAL_COMPANY);
  },

  getCompanyDetails(): CompanyDetails {
    return this.getCompany();
  },

  updateCompany(company: CompanyDetails): void {
    safeSet(KEYS.COMPANY, company);
  },

  // Documents
  getDocuments(): DocumentItem[] {
    return safeGet<DocumentItem[]>(KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
  },

  saveDocument(doc: DocumentItem): DocumentItem[] {
    const docs = this.getDocuments();
    const idx = docs.findIndex((d) => d.id === doc.id);
    if (idx >= 0) {
      docs[idx] = doc;
    } else {
      docs.unshift(doc);
    }
    safeSet(KEYS.DOCUMENTS, docs);
    return docs;
  },

  deleteDocument(id: string): DocumentItem[] {
    const docs = this.getDocuments().filter((d) => d.id !== id);
    safeSet(KEYS.DOCUMENTS, docs);
    return docs;
  },

  // Notices
  getNotices(): NoticeItem[] {
    return safeGet<NoticeItem[]>(KEYS.NOTICES, INITIAL_NOTICES);
  },

  submitNoticeResponse(
    noticeId: string,
    responseText: string,
    attachments: { name: string; size: string }[],
    submitterName: string
  ): NoticeItem[] {
    const notices = this.getNotices();
    const notice = notices.find((n) => n.id === noticeId);
    if (!notice) return notices;

    const newResponse = {
      id: `resp-${Date.now()}`,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      submittedBy: submitterName,
      responseText,
      attachments,
      status: 'under_review' as const,
      officialRemarks: 'Response submitted digitally. Scheduled for review by Enforcement Officer.',
    };

    notice.responses.push(newResponse);
    notice.status = 'under_review';
    safeSet(KEYS.NOTICES, notices);
    return notices;
  },

  // Inspections
  getInspections(): InspectionItem[] {
    return safeGet<InspectionItem[]>(KEYS.INSPECTIONS, INITIAL_INSPECTIONS);
  },

  getInspectionById(id: string): InspectionItem | undefined {
    return this.getInspections().find((i) => i.id === id);
  },

  saveInspection(inspection: InspectionItem): InspectionItem[] {
    const inspections = this.getInspections();
    const idx = inspections.findIndex((i) => i.id === inspection.id);
    if (idx >= 0) {
      inspections[idx] = inspection;
    } else {
      inspections.unshift(inspection);
    }
    safeSet(KEYS.INSPECTIONS, inspections);
    return inspections;
  },

  // Grievances
  getGrievances(): GrievanceItem[] {
    return safeGet<GrievanceItem[]>(KEYS.GRIEVANCES, INITIAL_GRIEVANCES);
  },

  saveGrievance(grievance: GrievanceItem): GrievanceItem[] {
    const list = this.getGrievances();
    const idx = list.findIndex((g) => g.id === grievance.id);
    if (idx >= 0) {
      list[idx] = grievance;
    } else {
      list.unshift(grievance);
    }
    safeSet(KEYS.GRIEVANCES, list);
    return list;
  },

  // Predictive Alerts
  getAlerts(): PredictiveAlertItem[] {
    return safeGet<PredictiveAlertItem[]>(KEYS.ALERTS, PREDICTIVE_ALERTS);
  },

  takeAlertAction(alertId: string, actionType: string, officerName: string): PredictiveAlertItem[] {
    const alerts = this.getAlerts();
    const alert = alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.verificationStatus = 'Assigned for Inspection';
      safeSet(KEYS.ALERTS, alerts);
    }
    return alerts;
  },

  // National Stats
  getNationalStats(): NationalStats {
    return INITIAL_NATIONAL_STATS;
  },

  // Audit logs
  getAuditLogs(): AuditLogItem[] {
    return safeGet<AuditLogItem[]>(KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  // Offline Inspector capabilities
  getOfflineQueue(): any[] {
    return safeGet<any[]>(KEYS.OFFLINE_QUEUE, []);
  },

  queueOfflineAction(action: any): void {
    const queue = this.getOfflineQueue();
    queue.push({ ...action, timestamp: new Date().toISOString() });
    safeSet(KEYS.OFFLINE_QUEUE, queue);
  },

  clearOfflineQueue(): void {
    safeSet(KEYS.OFFLINE_QUEUE, []);
  },
};

export const storageService = StorageService;
