import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Users,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  FileWarning,
  Coins,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { CompanyDetails, NoticeItem, DocumentItem, InspectionItem, CategoryCompliance } from '../../types';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { RiskScoreBadge } from '../../components/ui/RiskScoreBadge';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { WhyThisScoreModal } from '../../components/modals/WhyThisScoreModal';

interface CompanyDashboardProps {
  company: CompanyDetails;
  notices: NoticeItem[];
  documents: DocumentItem[];
  inspections: InspectionItem[];
  onNavigate: (path: string) => void;
  onOpenNotice: (notice: NoticeItem) => void;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  company,
  notices,
  documents,
  inspections,
  onNavigate,
  onOpenNotice,
}) => {
  const [isWhyScoreOpen, setIsWhyScoreOpen] = useState(false);

  const activeNotices = notices.filter((n) => n.status !== 'resolved');
  const upcomingInspection = inspections.find((i) => i.status === 'scheduled');
  const missingDocsCount = company.riskFactors.filter(
    (f) => f.type === 'missing_docs' && !f.resolved
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Company Header Entity Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-slate-900 text-amber-400 shrink-0 shadow-xs">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
                  {company.name}
                </h1>
                <Badge variant="outline" size="sm">
                  {company.sector}
                </Badge>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 font-medium">
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-bold">
                  {company.linNumber}
                </span>
                <span className="text-slate-400">•</span>
                <span className="font-mono text-slate-500">ID: {company.establishmentId}</span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {company.district}, {company.state} (PIN: {company.pincode})
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/80">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Total Workforce
                </span>
                <span className="text-base font-extrabold text-slate-900 tabular-nums">
                  {company.totalWorkers.toLocaleString()}
                </span>
              </div>
              <div className="h-7 w-px bg-slate-200" />
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Contract Workers
                </span>
                <span className="text-base font-extrabold text-amber-700 tabular-nums">
                  {company.contractWorkers.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Risk Score Banner */}
      <RiskScoreBadge
        size="hero"
        score={company.complianceScore}
        level={company.riskLevel}
        interactive={true}
        onClick={() => setIsWhyScoreOpen(true)}
      />

      {/* National e-Shram PowerBI Data Hub Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white rounded-xl p-4 shadow-sm border border-blue-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0">
            📊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white uppercase">
                Official e-Shram National Data Hub & Sector Graphs
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-amber-950 font-mono">
                31.90 Cr Workers
              </span>
            </div>
            <p className="text-xs text-blue-200">
              View Ministry Power BI bar charts, Top 5 States, Sector Registrations, CSC Trends & AI Risk Radar
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/government/dashboard')}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shrink-0 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span>Open e-Shram Graphs</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Missing Document Action Alert if any */}
      {missingDocsCount > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <FileWarning className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                Action Required: {missingDocsCount} Statutory Document(s) Pending Renewal
              </h4>
              <p className="text-xs text-amber-800">
                Annual Industrial Hygiene & Ventilation audit certificate has expired. Upload to regain +6 compliance index points.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="orange"
            onClick={() => onNavigate('/company/documents')}
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            Go to Document Centre
          </Button>
        </div>
      )}

      {/* 3. Main Grid: Compliance Categories & Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 8 Statutory Labour Code Categories */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader
              action={
                <button
                  onClick={() => setIsWhyScoreOpen(true)}
                  className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  View Factor Deductions
                </button>
              }
            >
              <CardTitle subtitle="Health score evaluated against Central Labour Codes">
                Statutory Compliance Categories (8 Pillars)
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Object.values(company.categories) as CategoryCompliance[]).map((cat) => (
                  <div
                    key={cat.category}
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{cat.category}</span>
                        <Badge
                          size="sm"
                          variant={
                            cat.status === 'Compliant'
                              ? 'success'
                              : cat.status === 'Needs Attention'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {cat.status}
                        </Badge>
                      </div>
                      <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                        {cat.score}%
                      </span>
                    </div>

                    <ProgressBar value={cat.score} size="sm" variant="auto" />

                    <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                      {cat.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Audit: {cat.lastAuditDate}</span>
                      <span className="font-semibold text-slate-600">
                        {cat.openIssuesCount} {cat.openIssuesCount === 1 ? 'Gap' : 'Gaps'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Col: Score Trend & Next Inspection */}
        <div className="space-y-6">
          {/* Upcoming Inspection Card */}
          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle subtitle="Mandatory field statutory audit">Upcoming Inspection</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              {upcomingInspection ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-amber-900">
                      {upcomingInspection.inspectionNumber}
                    </span>
                    <Badge size="sm" variant="warning">Scheduled</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700 mb-1">
                    <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="font-semibold">{upcomingInspection.scheduledDate}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Assigned Officer: <strong className="text-slate-900">{upcomingInspection.inspectorName}</strong>
                  </p>
                  <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">7 Core Checklist Areas</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onNavigate('/company/inspections')}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">No inspections scheduled for this month.</p>
              )}
            </CardBody>
          </Card>

          {/* Compliance Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle subtitle="6-Month Historical Benchmark">Score Trend Analysis</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="h-56 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={company.scoreTrends} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis domain={[50, 100]} stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        color: '#fff',
                        borderRadius: '8px',
                        fontSize: '11px',
                        border: 'none',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      name="Your Score"
                      stroke="#d97706"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#d97706' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="stateAverage"
                      name="State Avg"
                      stroke="#64748b"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                    />
                    <Line
                      type="monotone"
                      dataKey="industryBenchmark"
                      name="Industry Benchmark"
                      stroke="#059669"
                      strokeWidth={1.5}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* 4. Recent Notices & Show Cause Alerts */}
      <Card>
        <CardHeader
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('/company/notices')}
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              View Notice Centre ({notices.length})
            </Button>
          }
        >
          <CardTitle subtitle="Statutory queries requiring formal reply before deadline">
            Recent Notices & Compliance Queries
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-100">
            {activeNotices.slice(0, 3).map((notice) => (
              <div
                key={notice.id}
                onClick={() => onOpenNotice(notice)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      notice.severity === 'critical'
                        ? 'bg-rose-100 text-rose-700'
                        : notice.severity === 'high'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {notice.noticeNumber}
                      </span>
                      <Badge
                        size="sm"
                        variant={notice.severity === 'critical' ? 'danger' : 'warning'}
                      >
                        {notice.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-slate-400">• Category: {notice.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{notice.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                      {notice.legalProvision}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Due Deadline
                    </span>
                    <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {notice.dueDate}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenNotice(notice);
                    }}
                  >
                    Respond
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Why This Score Interactive Drawer */}
      <WhyThisScoreModal
        isOpen={isWhyScoreOpen}
        onClose={() => setIsWhyScoreOpen(false)}
        company={company}
        onNavigateToDocuments={() => onNavigate('/company/documents')}
        onNavigateToNotices={() => onNavigate('/company/notices')}
      />
    </div>
  );
};
