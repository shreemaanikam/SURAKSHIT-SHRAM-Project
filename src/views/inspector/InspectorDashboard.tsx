import React from 'react';
import {
  ClipboardCheck,
  MapPin,
  Calendar,
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Camera,
  PlayCircle,
  Sparkles,
} from 'lucide-react';
import { InspectionItem, UserProfile } from '../../types';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { RiskScoreBadge } from '../../components/ui/RiskScoreBadge';

interface InspectorDashboardProps {
  currentUser: UserProfile;
  inspections: InspectionItem[];
  isOffline: boolean;
  onToggleOffline: () => void;
  offlineQueueCount: number;
  onSyncOfflineQueue: () => void;
  onNavigate: (path: string) => void;
}

export const InspectorDashboard: React.FC<InspectorDashboardProps> = ({
  currentUser,
  inspections,
  isOffline,
  onToggleOffline,
  offlineQueueCount,
  onSyncOfflineQueue,
  onNavigate,
}) => {
  const todayScheduled = inspections.filter((i) => i.status === 'scheduled');
  const completedCount = inspections.filter((i) => i.status === 'completed').length;
  const highRiskCount = inspections.filter((i) => i.riskScoreAtAssignment < 60).length;

  return (
    <div className="space-y-5 pb-16 max-w-4xl mx-auto">
      {/* 1. Mobile-First Officer Header Strip */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {currentUser.name}
                </h1>
                <Badge size="sm" variant="warning">
                  LEO Grade-1
                </Badge>
              </div>
              <p className="text-xs text-amber-400 font-mono mt-0.5">
                Badge: {currentUser.badgeNumber || 'LEO-MH-2018-094'}
              </p>
            </div>
          </div>

          {/* Offline Sync Status Button */}
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={onToggleOffline}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all shadow-xs active:scale-95 ${
                isOffline
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-emerald-600 text-white border-emerald-500'
              }`}
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span>{isOffline ? 'Offline Active' : 'Online Sync'}</span>
            </button>
            {offlineQueueCount > 0 && (
              <span className="text-[10px] text-amber-300">
                {offlineQueueCount} unsynced draft(s)
              </span>
            )}
          </div>
        </div>

        {/* Quick jurisdiction tag */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Jurisdiction: {currentUser.district || 'Pune Industrial Belt'}
          </span>
          <span className="font-semibold text-slate-300">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>

      {/* 2. Today's Priority Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Scheduled</span>
          <span className="text-2xl font-black text-amber-600 tabular-nums">
            {todayScheduled.length}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Pending Audits</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Completed</span>
          <span className="text-2xl font-black text-emerald-600 tabular-nums">
            {completedCount}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Signed Reports</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">High Risk</span>
          <span className="text-2xl font-black text-rose-600 tabular-nums">
            {highRiskCount}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Priority Watch</span>
        </div>
      </div>

      {/* 3. Primary Action: Active Scheduled Field Inspection */}
      {todayScheduled.length > 0 && (
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 p-5 rounded-2xl shadow-lg border border-amber-400">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-2">
            <span className="bg-white/80 px-2.5 py-1 rounded-full uppercase tracking-wider text-[10px]">
              Ready for Field Inspection
            </span>
            <span className="font-mono">{todayScheduled[0].inspectionNumber}</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-slate-950">
            {todayScheduled[0].establishmentName}
          </h2>
          <p className="text-xs text-slate-900/80 mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 shrink-0 text-slate-950" />
            {todayScheduled[0].address}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-950/20 flex items-center justify-between">
            <div className="text-xs">
              <span className="block text-slate-900/70 text-[10px] uppercase font-bold">
                Assigned Risk Index
              </span>
              <span className="font-extrabold text-slate-950 text-sm">
                {todayScheduled[0].riskScoreAtAssignment}/100 (Medium Risk)
              </span>
            </div>

            <Button
              size="md"
              onClick={() => onNavigate(`/inspector/inspection/${todayScheduled[0].id}`)}
              className="bg-slate-950 text-white hover:bg-slate-900 shadow-md font-bold text-xs"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Smart Audit
            </Button>
          </div>
        </div>
      )}

      {/* 4. Assigned Inspections Quick List */}
      <Card>
        <CardHeader
          action={
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigate('/inspector/inspections')}
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              All Inspections ({inspections.length})
            </Button>
          }
        >
          <CardTitle subtitle="Field audit roster for current roster period">
            Assigned Establishments
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-100">
            {inspections.map((insp) => (
              <div
                key={insp.id}
                onClick={() => onNavigate(`/inspector/inspection/${insp.id}`)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 ${
                      insp.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {insp.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <ClipboardCheck className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        {insp.linNumber}
                      </span>
                      <Badge
                        size="sm"
                        variant={insp.status === 'completed' ? 'success' : 'warning'}
                      >
                        {insp.status.toUpperCase()}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
                      {insp.establishmentName}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{insp.address}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase">
                      Date
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {insp.scheduledDate}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
