import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';
import { RiskLevel } from '../../types';

interface RiskScoreBadgeProps {
  id?: string;
  score?: number;
  level?: RiskLevel;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  onClick?: () => void;
  interactive?: boolean;
}

export const RiskScoreBadge: React.FC<RiskScoreBadgeProps> = ({
  id,
  score,
  level,
  size = 'md',
  onClick,
  interactive = false,
}) => {
  // Determine level if score provided
  let computedLevel: RiskLevel = level || 'Low Risk';
  if (score !== undefined) {
    if (score >= 80) computedLevel = 'Low Risk';
    else if (score >= 60) computedLevel = 'Medium Risk';
    else if (score >= 40) computedLevel = 'High Risk';
    else computedLevel = 'Critical';
  }

  const levelConfigs = {
    'Low Risk': {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      heroBg: 'from-emerald-500/10 to-teal-500/5 text-emerald-900 border-emerald-200',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      badgeText: 'Low Risk',
      subtext: 'High Compliance Status',
    },
    'Medium Risk': {
      bg: 'bg-amber-50 text-amber-900 border-amber-200',
      heroBg: 'from-amber-500/10 to-orange-500/5 text-amber-950 border-amber-200',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      badgeText: 'Medium Risk',
      subtext: 'Actionable Gaps Identified',
    },
    'High Risk': {
      bg: 'bg-orange-50 text-orange-900 border-orange-200',
      heroBg: 'from-orange-500/10 to-rose-500/5 text-orange-950 border-orange-200',
      icon: AlertCircle,
      iconColor: 'text-orange-600',
      badgeText: 'High Risk',
      subtext: 'Inspection Priority Triggered',
    },
    Critical: {
      bg: 'bg-rose-50 text-rose-900 border-rose-200',
      heroBg: 'from-rose-500/10 to-red-500/5 text-rose-950 border-rose-200',
      icon: ShieldAlert,
      iconColor: 'text-rose-600',
      badgeText: 'Critical Risk',
      subtext: 'Statutory Notice Mandatory',
    },
  };

  const config = levelConfigs[computedLevel];
  const Icon = config.icon;

  if (size === 'hero') {
    return (
      <div
        id={id}
        onClick={onClick}
        className={`p-6 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 transition-all ${
          interactive ? 'cursor-pointer hover:shadow-md hover:border-slate-300' : ''
        }`}
      >
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 shrink-0">
            <svg className="w-16 h-16 -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                className="text-slate-200"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray={163}
                strokeDashoffset={163 - (163 * (score || 78)) / 100}
                strokeLinecap="round"
                className={config.iconColor}
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold tracking-tight text-slate-900 tabular-nums">
                {score ?? 78}
              </span>
              <span className="text-[9px] text-slate-400 font-medium uppercase">/ 100</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Compliance Index
              </span>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md border ${config.bg}`}>
                <Icon className="w-3.5 h-3.5" />
                {config.badgeText}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              {computedLevel === 'Low Risk' ? 'Satisfactory Standing' : `${config.badgeText} Detected`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 max-w-md">
              {config.subtext}. Automated risk engine evaluated across 8 statutory categories.
            </p>
          </div>
        </div>

        {interactive && (
          <button
            type="button"
            className="shrink-0 px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 hover:border-slate-300 flex items-center gap-2 transition-all"
          >
            <span>Why this score?</span>
            <span className="text-slate-400">→</span>
          </button>
        )}
      </div>
    );
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      id={id}
      onClick={onClick}
      className={`inline-flex items-center font-medium rounded-md border ${config.bg} ${
        sizeClasses[size]
      } ${interactive ? 'cursor-pointer hover:opacity-85' : ''}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.badgeText}</span>
      {score !== undefined && <span className="tabular-nums font-bold">({score}/100)</span>}
    </span>
  );
};
