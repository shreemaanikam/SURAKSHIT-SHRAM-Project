import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  Send,
  CheckCircle2,
  Scale,
  Building2,
  Users,
  Clock,
  ArrowRight,
  ShieldAlert,
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PredictiveAlertItem } from '../../types';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ProgressBar } from '../../components/ui/ProgressBar';

interface GovernmentPredictiveAlertsProps {
  alerts: PredictiveAlertItem[];
  onTakeAction: (alertId: string, actionType: string) => void;
}

export const GovernmentPredictiveAlerts: React.FC<GovernmentPredictiveAlertsProps> = ({
  alerts,
  onTakeAction,
}) => {
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(alerts[0]?.id || null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const handleActionClick = (alertId: string, actionType: string) => {
    onTakeAction(alertId, actionType);
    setActionSuccessMsg(`Directive successfully recorded and assigned to Circle Officer.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              AI Predictive Risk Radar
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Machine Learning Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Early-warning contagion signals across supply chains, wages, social security & workplace safety
          </p>
        </div>

        <span className="text-xs font-mono text-amber-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          Model: MoLE-IndLabourNet-v4.2
        </span>
      </div>

      {/* Official Government Regulatory Disclaimer Box */}
      <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-amber-900">Official Statutory Disclaimer:</span>
          <p className="text-amber-800 leading-relaxed">
            Algorithmic predictions and risk scores are decision-support indicators generated in accordance with Ministry of Labour & Employment guidelines. Formal statutory enforcement, citations, or prosecutions must be corroborated by physical on-site evidence and signed officer verification.
          </p>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Predictive Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const isExpanded = expandedAlertId === alert.id;

          return (
            <Card
              key={alert.id}
              className={`transition-all ${
                alert.riskCategory === 'wage_suppression'
                  ? 'border-rose-300'
                  : alert.riskCategory === 'contagion'
                  ? 'border-purple-300'
                  : 'border-amber-300'
              }`}
            >
              <CardBody className="p-5">
                {/* Main Header */}
                <div
                  onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                  className="cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-2xl shrink-0 ${
                        alert.severity === 'critical'
                          ? 'bg-rose-100 text-rose-700'
                          : alert.severity === 'high'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      <AlertTriangle className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          size="sm"
                          variant={alert.severity === 'critical' ? 'danger' : 'warning'}
                        >
                          {alert.severity.toUpperCase()} SEVERITY
                        </Badge>
                        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {alert.targetEstablishmentLin}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          • {alert.industrySector} ({alert.clusterRegion})
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-1">{alert.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{alert.description}</p>
                    </div>
                  </div>

                  {/* Confidence & Quick Metric */}
                  <div className="flex items-center lg:flex-col lg:items-end justify-between gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        AI Confidence
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                        {alert.aiConfidence}% Probability
                      </span>
                    </div>

                    <button className="text-xs font-bold text-slate-600 flex items-center gap-1 hover:text-slate-900">
                      <span>{isExpanded ? 'Collapse Analysis' : 'Expand Factors'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Explainable AI Factors & Actions */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-slate-200 space-y-4 text-xs animate-in fade-in duration-200">
                    {/* Explainable AI Factors breakdown */}
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Explainable ML Attribution Factors:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {alert.explainableFactors.map((f, i) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800">{f.factor}</span>
                              <span className="font-extrabold text-amber-700">+{f.weight}%</span>
                            </div>
                            <p className="text-slate-600 text-[11px] leading-snug">{f.evidence}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Triggers */}
                    <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-400 block">
                          Suggested Regulatory Directive
                        </span>
                        <p className="text-xs text-slate-200 mt-0.5">
                          {alert.suggestedAction}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="orange"
                          onClick={() => handleActionClick(alert.id, 'dispatch_squad')}
                          leftIcon={<Send className="w-3.5 h-3.5" />}
                        >
                          Dispatch Special Squad
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleActionClick(alert.id, 'issue_directive')}
                          className="bg-transparent border-slate-700 text-white hover:bg-slate-800"
                        >
                          Issue Electronic Notice
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
