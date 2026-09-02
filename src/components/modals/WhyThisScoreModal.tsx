import React from 'react';
import { Drawer } from '../ui/Drawer';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  AlertTriangle,
  FileWarning,
  Coins,
  Clock,
  ClipboardList,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { CompanyDetails, RiskFactor, CategoryCompliance } from '../../types';

interface WhyThisScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyDetails;
  onNavigateToDocuments?: () => void;
  onNavigateToNotices?: () => void;
}

export const WhyThisScoreModal: React.FC<WhyThisScoreModalProps> = ({
  isOpen,
  onClose,
  company,
  onNavigateToDocuments,
  onNavigateToNotices,
}) => {
  const getIconForType = (type: RiskFactor['type']) => {
    switch (type) {
      case 'wage_inconsistency':
        return <Coins className="w-5 h-5 text-rose-600" />;
      case 'missing_docs':
        return <FileWarning className="w-5 h-5 text-amber-600" />;
      case 'unresolved_notice':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'attendance_anomaly':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'inspection_history':
        return <ClipboardList className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-slate-600" />;
    }
  };

  const activeFactors = company.riskFactors.filter((f) => !f.resolved);
  const resolvedFactors = company.riskFactors.filter((f) => f.resolved);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="2xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Explainable AI Compliance Breakdown</h2>
            <p className="text-xs text-slate-500 font-normal">
              Mathematical deduction model behind Score {company.complianceScore}/100 ({company.riskLevel})
            </p>
          </div>
        </div>
      }
      footer={
        <div className="w-full flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Algorithmic model: Rule-based & Neural Anomaly Ensemble v3.4
          </span>
          <Button size="sm" onClick={onClose}>
            Close Breakdown
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Top Summary Banner */}
        <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase">
              Current Index Score
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-extrabold tabular-nums">{company.complianceScore}</span>
              <span className="text-sm text-slate-400">/ 100 benchmark</span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Target benchmark for Low-Risk classification is <strong className="text-white">85+</strong>.
            </p>
          </div>
          <div className="flex flex-col gap-1.5 text-right w-full sm:w-auto">
            <div className="text-xs text-slate-400">
              Active Penalty Deductions:{' '}
              <strong className="text-rose-400 font-semibold">
                {activeFactors.reduce((acc, f) => acc + f.impactScore, 0)} pts
              </strong>
            </div>
            <div className="text-xs text-slate-400">
              Resolved Credits:{' '}
              <strong className="text-emerald-400 font-semibold">
                +{resolvedFactors.reduce((acc, f) => acc + f.impactScore, 0)} pts
              </strong>
            </div>
          </div>
        </div>

        {/* Section 1: Active Discrepancy Drivers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>High-Impact Penalty Factors ({activeFactors.length})</span>
            </h3>
            <span className="text-xs text-slate-500">Sorted by score severity</span>
          </div>

          <div className="space-y-3">
            {activeFactors.map((factor) => (
              <div
                key={factor.id}
                className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 shrink-0">
                      {getIconForType(factor.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-semibold text-slate-900">{factor.title}</h4>
                        <Badge
                          size="sm"
                          variant={factor.severity === 'critical' ? 'danger' : factor.severity === 'high' ? 'warning' : 'info'}
                        >
                          {factor.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{factor.description}</p>
                      
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          {factor.codeReference}
                        </span>
                        <span>• Detected on {factor.detectedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-sm font-bold text-rose-600 tabular-nums px-2 py-1 rounded bg-rose-50 border border-rose-200">
                      {factor.impactScore} pts
                    </span>
                  </div>
                </div>

                {/* Resolution CTA helper */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 italic">
                    Action required to restore points
                  </span>
                  {factor.type === 'missing_docs' && onNavigateToDocuments && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onClose();
                        onNavigateToDocuments();
                      }}
                      rightIcon={<ExternalLink className="w-3 h-3" />}
                    >
                      Upload Missing Doc
                    </Button>
                  )}
                  {factor.type === 'unresolved_notice' && onNavigateToNotices && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onClose();
                        onNavigateToNotices();
                      }}
                      rightIcon={<ExternalLink className="w-3 h-3" />}
                    >
                      Submit Response
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: 8 Statutory Category Health */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">Statutory Category Health Distribution</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.values(company.categories) as CategoryCompliance[]).map((cat) => (
              <div
                key={cat.category}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-900">{cat.category}</span>
                    <Badge
                      size="sm"
                      variant={cat.status === 'Compliant' ? 'success' : 'warning'}
                    >
                      {cat.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    {cat.openIssuesCount} issue{cat.openIssuesCount === 1 ? '' : 's'} • Last audit: {cat.lastAuditDate}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-slate-900 tabular-nums">
                    {cat.score}
                  </span>
                  <span className="text-[10px] text-slate-400 block">/ 100</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Resolved Credits */}
        {resolvedFactors.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Resolved Historical Credits</span>
            </h3>
            <div className="space-y-2">
              {resolvedFactors.map((factor) => (
                <div
                  key={factor.id}
                  className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-emerald-950">{factor.title}</span>
                    <p className="text-slate-600 mt-0.5">{factor.description}</p>
                  </div>
                  <span className="font-bold text-emerald-700 tabular-nums ml-3 shrink-0">
                    +{factor.impactScore} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
