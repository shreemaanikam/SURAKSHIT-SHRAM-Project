// ============================================================
// src/lib/mock-data.ts
// Central mock data store — swap these for real API calls later
// via the service layer in src/services/
// ============================================================

// ---- Types ----
export type RiskGrade = "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D" | "F"
export type NoticeStatus = "pending_response" | "responded" | "closed" | "escalated"
export type InspectionStatus = "pending" | "scheduled" | "in_progress" | "completed" | "cancelled"
export type GrievanceStatus = "open" | "under_review" | "resolved" | "rejected"
export type DocumentStatus = "valid" | "expiring_soon" | "expired" | "pending_upload"

export interface Establishment {
  id: string
  name: string
  industry: string
  address: string
  district: string
  state: string
  employeeCount: number
  riskGrade: RiskGrade
  riskScore: number // 0-100
  complianceRate: number // 0-100
  registrationId: string
  lastInspection: string
}

export interface Notice {
  id: string
  type: "show_cause" | "penalty" | "improvement" | "closure"
  subject: string
  issuedDate: string
  responseDeadline: string
  status: NoticeStatus
  description: string
  amount?: number
}

export interface Inspection {
  id: string
  establishmentId: string
  establishmentName: string
  address: string
  district: string
  scheduledDate: string
  status: InspectionStatus
  inspectorName: string
  riskGrade: RiskGrade
  checklistItems: ChecklistItem[]
}

export interface ChecklistItem {
  id: string
  category: string
  description: string
  checked: boolean
  violation?: boolean
  notes?: string
}

export interface Document {
  id: string
  name: string
  type: string
  expiryDate: string
  status: DocumentStatus
  fileSize?: string
}

export interface Grievance {
  id: string
  workerName: string
  subject: string
  description: string
  filedDate: string
  status: GrievanceStatus
  category: "wages" | "safety" | "harassment" | "termination" | "other"
  resolution?: string
}

export interface ComplianceItem {
  id: string
  title: string
  category: string
  dueDate: string
  status: "compliant" | "non_compliant" | "pending"
  lastChecked: string
}

// ---- Mock Data ----

export const mockEstablishments: Establishment[] = [
  {
    id: "EST-001",
    name: "Acme Corp",
    industry: "Manufacturing",
    address: "123 Industrial Phase 1, MIDC, Andheri East",
    district: "Mumbai",
    state: "Maharashtra",
    employeeCount: 420,
    riskGrade: "B+",
    riskScore: 72,
    complianceRate: 92,
    registrationId: "MH-LAB-2019-001234",
    lastInspection: "2026-02-14",
  },
  {
    id: "EST-002",
    name: "Globex Manufacturing",
    industry: "Heavy Engineering",
    address: "45 Tech Park, Rabale, Navi Mumbai",
    district: "Pune",
    state: "Maharashtra",
    employeeCount: 850,
    riskGrade: "B-",
    riskScore: 58,
    complianceRate: 74,
    registrationId: "MH-LAB-2017-005678",
    lastInspection: "2025-11-20",
  },
  {
    id: "EST-003",
    name: "Stark Industries",
    industry: "Electronics",
    address: "Plot 7, Electronic City, Thane West",
    district: "Thane",
    state: "Maharashtra",
    employeeCount: 230,
    riskGrade: "B",
    riskScore: 65,
    complianceRate: 85,
    registrationId: "MH-LAB-2021-009012",
    lastInspection: "2026-04-01",
  },
  {
    id: "EST-004",
    name: "Wayne Enterprises",
    industry: "Textiles",
    address: "Bhiwandi Textile Complex, Bhiwandi",
    district: "Thane",
    state: "Maharashtra",
    employeeCount: 610,
    riskGrade: "C+",
    riskScore: 45,
    complianceRate: 61,
    registrationId: "MH-LAB-2015-003456",
    lastInspection: "2025-08-10",
  },
  {
    id: "EST-005",
    name: "Umbrella Corp",
    industry: "Pharmaceuticals",
    address: "Bio Cluster, Hinjewadi Phase 3, Pune",
    district: "Pune",
    state: "Maharashtra",
    employeeCount: 320,
    riskGrade: "A-",
    riskScore: 88,
    complianceRate: 97,
    registrationId: "MH-LAB-2020-007890",
    lastInspection: "2026-06-15",
  },
]

export const mockNotices: Notice[] = [
  {
    id: "NTC-2026-0412",
    type: "show_cause",
    subject: "Non-provision of Personal Protective Equipment (PPE)",
    issuedDate: "2026-08-10",
    responseDeadline: "2026-08-22",
    status: "pending_response",
    description:
      "During the inspection on 14-Feb-2026, it was observed that 12 workers operating in the press shop were not provided with mandatory hand protection (gloves). This is in violation of Section 47(1) of the Factories Act, 1948.",
    amount: undefined,
  },
  {
    id: "NTC-2026-0398",
    type: "penalty",
    subject: "Failure to maintain accident register",
    issuedDate: "2026-07-15",
    responseDeadline: "2026-07-30",
    status: "responded",
    description:
      "The accident register was not maintained in the prescribed Form 26 as required under Rule 121 of the Maharashtra Factories Rules.",
    amount: 5000,
  },
  {
    id: "NTC-2025-0812",
    type: "improvement",
    subject: "Ventilation improvements required in factory",
    issuedDate: "2025-11-20",
    responseDeadline: "2026-02-20",
    status: "closed",
    description:
      "Inadequate ventilation in production area B. Required to install exhaust fans and improve airflow as per Section 14 of the Factories Act.",
  },
]

export const mockInspections: Inspection[] = [
  {
    id: "INS-2026-892",
    establishmentId: "EST-001",
    establishmentName: "Acme Corp",
    address: "123 Industrial Phase 1, MIDC, Andheri East, Mumbai",
    district: "Mumbai",
    scheduledDate: "2026-08-20",
    status: "pending",
    inspectorName: "Rajesh Kumar",
    riskGrade: "B+",
    checklistItems: [
      { id: "c1", category: "Fire Safety", description: "Fire exits unblocked and clearly marked", checked: false, violation: false },
      { id: "c2", category: "Ventilation", description: "Proper ventilation in production area", checked: true, violation: false },
      { id: "c3", category: "Machinery", description: "Machinery guards in place on all press machines", checked: false, violation: true, notes: "Prior violation noted. Verify compliance." },
      { id: "c4", category: "PPE", description: "PPE available and worn by all floor workers", checked: false, violation: false },
      { id: "c5", category: "First Aid", description: "First aid box stocked and accessible", checked: false, violation: false },
      { id: "c6", category: "Records", description: "Accident register maintained in Form 26", checked: false, violation: false },
    ],
  },
  {
    id: "INS-2026-893",
    establishmentId: "EST-002",
    establishmentName: "Globex Manufacturing",
    address: "45 Tech Park, Rabale, Navi Mumbai",
    district: "Pune",
    scheduledDate: "2026-08-21",
    status: "scheduled",
    inspectorName: "Rajesh Kumar",
    riskGrade: "B-",
    checklistItems: [
      { id: "c1", category: "Fire Safety", description: "Fire exits unblocked", checked: false },
      { id: "c2", category: "Machinery", description: "Machinery guards present", checked: false },
      { id: "c3", category: "PPE", description: "PPE provision", checked: false },
    ],
  },
]

export const mockDocuments: Document[] = [
  { id: "DOC-001", name: "Factory License", type: "License", expiryDate: "2027-03-31", status: "valid", fileSize: "1.2 MB" },
  { id: "DOC-002", name: "Fire NOC", type: "NOC", expiryDate: "2026-09-15", status: "expiring_soon", fileSize: "0.8 MB" },
  { id: "DOC-003", name: "Pollution Control Certificate", type: "Certificate", expiryDate: "2026-06-30", status: "expired", fileSize: "2.1 MB" },
  { id: "DOC-004", name: "ESI Registration Certificate", type: "Registration", expiryDate: "2030-01-01", status: "valid", fileSize: "0.5 MB" },
  { id: "DOC-005", name: "PF Registration", type: "Registration", expiryDate: "2030-01-01", status: "valid", fileSize: "0.4 MB" },
  { id: "DOC-006", name: "Annual Returns (2025-26)", type: "Return", expiryDate: "2026-07-31", status: "expired" },
]

export const mockGrievances: Grievance[] = [
  {
    id: "GRV-2026-041",
    workerName: "Anon Worker #41",
    subject: "Non-payment of overtime wages",
    description: "For the past 3 months, overtime worked beyond 8 hours is not being compensated as per the Minimum Wages Act.",
    filedDate: "2026-08-12",
    status: "under_review",
    category: "wages",
  },
  {
    id: "GRV-2026-038",
    workerName: "Anon Worker #38",
    subject: "Unsafe working conditions in press shop",
    description: "Machine guards on press no. 4 and 7 are missing. Workers are at risk of injury.",
    filedDate: "2026-08-05",
    status: "resolved",
    category: "safety",
    resolution: "Machinery guards have been installed and verified by inspector during INS-2026-892.",
  },
  {
    id: "GRV-2026-029",
    workerName: "Anon Worker #29",
    subject: "Deduction from wages without notice",
    description: "Employer deducted Rs. 2,200 from July salary without providing any explanation or notice.",
    filedDate: "2026-07-28",
    status: "open",
    category: "wages",
  },
]

export const mockComplianceItems: ComplianceItem[] = [
  { id: "CMP-001", title: "Factory License Renewal", category: "Licensing", dueDate: "2027-03-31", status: "compliant", lastChecked: "2026-08-01" },
  { id: "CMP-002", title: "Fire NOC Renewal", category: "Safety", dueDate: "2026-09-15", status: "non_compliant", lastChecked: "2026-08-15" },
  { id: "CMP-003", title: "Annual Returns Filing", category: "Statutory Filing", dueDate: "2026-07-31", status: "non_compliant", lastChecked: "2026-08-10" },
  { id: "CMP-004", title: "ESI Monthly Challan", category: "Payroll Compliance", dueDate: "2026-08-15", status: "compliant", lastChecked: "2026-08-14" },
  { id: "CMP-005", title: "PF Monthly Contribution", category: "Payroll Compliance", dueDate: "2026-08-15", status: "compliant", lastChecked: "2026-08-14" },
  { id: "CMP-006", title: "Minimum Wages Compliance Audit", category: "Wages", dueDate: "2026-09-30", status: "pending", lastChecked: "2026-07-01" },
]

// ---- Government analytics mock ----
export const mockDistrictStats = [
  { district: "Mumbai", totalEstablishments: 1420, highRisk: 89, inspectionsThisMonth: 142, avgRiskScore: 68 },
  { district: "Pune", totalEstablishments: 980, highRisk: 54, inspectionsThisMonth: 98, avgRiskScore: 72 },
  { district: "Thane", totalEstablishments: 760, highRisk: 71, inspectionsThisMonth: 74, avgRiskScore: 61 },
  { district: "Nagpur", totalEstablishments: 540, highRisk: 32, inspectionsThisMonth: 55, avgRiskScore: 74 },
  { district: "Nashik", totalEstablishments: 430, highRisk: 28, inspectionsThisMonth: 44, avgRiskScore: 70 },
]
