import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  ClipboardCheck,
  Camera,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Save,
  Send,
  ArrowLeft,
  ArrowRight,
  WifiOff,
  Wifi,
  FileText,
  RotateCcw,
  Sparkles,
  Info,
  PenTool,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InspectionChecklistItem, InspectionItem, UserProfile } from '../../types';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CameraEvidenceModal } from '../../components/modals/CameraEvidenceModal';

interface InspectorWorkflowProps {
  inspection: InspectionItem;
  currentUser: UserProfile;
  isOffline: boolean;
  onSaveDraft: (inspection: InspectionItem) => void;
  onSubmitInspection: (inspection: InspectionItem) => void;
  onBack: () => void;
}

type WorkflowStep =
  | 'overview'
  | 'risk_focus'
  | 'checklist'
  | 'findings'
  | 'remarks'
  | 'review'
  | 'submitted';

export const InspectorWorkflow: React.FC<InspectorWorkflowProps> = ({
  inspection,
  currentUser,
  isOffline,
  onSaveDraft,
  onSubmitInspection,
  onBack,
}) => {
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('overview');
  const [checklist, setChecklist] = useState<InspectionChecklistItem[]>(inspection.checklist);
  const [activeChecklistFilter, setActiveChecklistFilter] = useState<string>('All');
  const [selectedItemForCamera, setSelectedItemForCamera] = useState<InspectionChecklistItem | null>(null);
  const [inspectorRemarks, setInspectorRemarks] = useState(inspection.inspectorRemarks || '');
  const [recommendation, setRecommendation] = useState<InspectionItem['recommendation']>(
    inspection.recommendation || 'Issue 15-Day Improvement Notice'
  );
  const [isSignConfirmed, setIsSignConfirmed] = useState(false);

  const stepsList: { key: WorkflowStep; label: string }[] = [
    { key: 'overview', label: '1. Overview' },
    { key: 'risk_focus', label: '2. Risk AI' },
    { key: 'checklist', label: '3. Checklist' },
    { key: 'findings', label: '4. Evidence' },
    { key: 'remarks', label: '5. Orders' },
    { key: 'review', label: '6. Sign & Submit' },
  ];

  // Helper to toggle status of checklist item with large touch targets
  const handleToggleItemStatus = (itemId: string, status: InspectionChecklistItem['status']) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status } : item))
    );
  };

  const handleUpdateItemObservation = (itemId: string, text: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, observation: text } : item))
    );
  };

  const handleAttachEvidence = (photoUrl: string, note?: string) => {
    if (!selectedItemForCamera) return;
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id === selectedItemForCamera.id) {
          return {
            ...item,
            evidencePhotos: [...item.evidencePhotos, photoUrl],
            observation: note ? (item.observation ? `${item.observation} • ${note}` : note) : item.observation,
            status: item.status === 'pending' ? 'non_compliant' : item.status,
          };
        }
        return item;
      })
    );
    setSelectedItemForCamera(null);
  };

  const handleSaveDraftClick = () => {
    const updated: InspectionItem = {
      ...inspection,
      checklist,
      inspectorRemarks,
      recommendation,
      status: 'in_progress',
      syncStatus: isOffline ? 'offline_draft' : 'synced',
    };
    onSaveDraft(updated);
  };

  const handleFinalSubmit = () => {
    const nonCompliantCount = checklist.filter((c) => c.status === 'non_compliant').length;
    const completedInspection: InspectionItem = {
      ...inspection,
      checklist,
      inspectorRemarks,
      recommendation,
      status: 'completed',
      completedDate: new Date().toISOString().replace('T', ' ').substring(0, 10),
      majorViolationsCount: nonCompliantCount,
      minorViolationsCount: 1,
      findingsSummary: `Field statutory inspection executed. Discovered ${nonCompliantCount} non-compliant code areas.`,
      digitalSignature: `SIG-${currentUser.name.toUpperCase().replace(/\s+/g, '-')}-${Date.now()}`,
      geoStamp: {
        lat: 18.7561,
        lng: 73.8441,
        accuracyMeters: 3.5,
        timestamp: new Date().toISOString(),
        verifiedOnSite: true,
      },
      syncStatus: isOffline ? 'pending_sync' : 'synced',
    };

    onSubmitInspection(completedInspection);
    setCurrentStep('submitted');

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const nonCompliantItems = checklist.filter((i) => i.status === 'non_compliant');
  const compliantItems = checklist.filter((i) => i.status === 'compliant');
  const pendingItems = checklist.filter((i) => i.status === 'pending');

  return (
    <div className="space-y-5 pb-20 max-w-4xl mx-auto">
      {/* Top Mobile-First Stepper Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs sticky top-16 z-30">
        <div className="flex items-center justify-between gap-3 mb-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Inspection Roster</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
              {inspection.inspectionNumber}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveDraftClick}
              leftIcon={<Save className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Save Draft
            </Button>
          </div>
        </div>

        {/* Step Indicator Badges */}
        <div className="grid grid-cols-6 gap-1.5 text-center text-[10px] font-bold">
          {stepsList.map((st) => (
            <button
              key={st.key}
              onClick={() => setCurrentStep(st.key)}
              className={`py-1.5 px-1 rounded-lg truncate transition-all ${
                currentStep === st.key
                  ? 'bg-slate-900 text-amber-400 shadow-xs'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: Overview */}
      {currentStep === 'overview' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <Card>
            <CardHeader>
              <CardTitle subtitle="Official establishment credentials">
                Establishment Pre-Audit File
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-900 text-amber-400 shrink-0">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-950">
                    {inspection.establishmentName}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    LIN: {inspection.linNumber} • ID: {inspection.establishmentId}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {inspection.address}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Industry Sector
                  </span>
                  <span className="font-bold text-slate-900">{inspection.industry}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Risk Score
                  </span>
                  <span className="font-bold text-amber-700">
                    {inspection.riskScoreAtAssignment}/100
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Audit Date
                  </span>
                  <span className="font-bold text-slate-900">{inspection.scheduledDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Inspector
                  </span>
                  <span className="font-bold text-slate-900">{inspection.inspectorName}</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <h4 className="font-bold flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Algorithm Trigger Reason
                </h4>
                <p>{inspection.findingsSummary}</p>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  onClick={() => setCurrentStep('risk_focus')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  variant="orange"
                >
                  Proceed to AI Risk Focus Areas
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* STEP 2: AI Risk Overview */}
      {currentStep === 'risk_focus' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <Card>
            <CardHeader>
              <CardTitle subtitle="Automated intelligence flags for field inspection scrutiny">
                AI Risk Heatmap & Priority Focus Points
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                    Recommended Audit Strategy
                  </span>
                  <h3 className="text-base font-bold mt-0.5">
                    Prioritize Overtime Wage Registers & Exhaust Ventilation in Foundries
                  </h3>
                </div>
                <Sparkles className="w-8 h-8 text-amber-400 shrink-0" />
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 text-xs text-rose-950 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-rose-900">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      Priority 1: Code on Wages, Section 14 (Overtime Disparity)
                    </span>
                    <Badge size="sm" variant="danger">
                      HIGH CERTAINTY
                    </Badge>
                  </div>
                  <p className="text-rose-800">
                    Grievance #SS-GRV-2026-89421 flagged 1.25x normal rate paid in foundry casting bay instead of 2.0x statutory minimum. Check biometric gate logs against Form A register.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 text-xs text-amber-950 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Priority 2: Code on Social Security (ESIC Pehchan Coverage)
                    </span>
                    <Badge size="sm" variant="warning">
                      VERIFICATION REQUIRED
                    </Badge>
                  </div>
                  <p className="text-amber-800">
                    38 contract apprentice workers missing e-Pehchan card mapping on electronic return. Check physical smart cards for Unit 3 helpers.
                  </p>
                </div>
              </div>

              <div className="pt-3 flex justify-between">
                <Button variant="ghost" onClick={() => setCurrentStep('overview')}>
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep('checklist')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  variant="orange"
                >
                  Open Field Checklist ({checklist.length} Items)
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* STEP 3: Multi-Code Checklist (Large Touch Targets) */}
      {currentStep === 'checklist' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <Card>
            <CardHeader
              action={
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {compliantItems.length} Pass
                  </span>
                  <span className="text-xs text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {nonCompliantItems.length} Violations
                  </span>
                  <span className="text-xs text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded">
                    {pendingItems.length} Left
                  </span>
                </div>
              }
            >
              <CardTitle subtitle="Tap to record compliance state & snap proof">
                Statutory Labour Codes Inspection Checklist
              </CardTitle>
            </CardHeader>

            <CardBody className="p-4 space-y-4">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {['All', 'Wages', 'Safety & Health', 'Social Security', 'Working Conditions'].map(
                  (cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveChecklistFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                        activeChecklistFilter === cat
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>

              {/* Checklist Items */}
              <div className="space-y-3">
                {checklist
                  .filter(
                    (item) =>
                      activeChecklistFilter === 'All' || item.codeCategory === activeChecklistFilter
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border transition-all ${
                        item.status === 'compliant'
                          ? 'border-emerald-300 bg-emerald-50/30'
                          : item.status === 'non_compliant'
                          ? 'border-rose-300 bg-rose-50/40'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {item.codeCategory}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                              {item.legalClause}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {item.question}
                          </h4>
                        </div>
                      </div>

                      {/* Large Touch Targets for Field Inspector */}
                      <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleItemStatus(item.id, 'compliant')}
                          className={`min-h-[44px] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                            item.status === 'compliant'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Compliant</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleItemStatus(item.id, 'non_compliant')}
                          className={`min-h-[44px] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                            item.status === 'non_compliant'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-800'
                          }`}
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Violation</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedItemForCamera(item)}
                          className="min-h-[44px] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 bg-amber-100 text-amber-900 hover:bg-amber-200 transition-all active:scale-95"
                        >
                          <Camera className="w-4 h-4" />
                          <span>
                            {item.evidencePhotos.length > 0
                              ? `Proof (${item.evidencePhotos.length})`
                              : 'Snap Photo'}
                          </span>
                        </button>
                      </div>

                      {/* Attached photos preview if any */}
                      {item.evidencePhotos.length > 0 && (
                        <div className="mt-2.5 flex items-center gap-2 overflow-x-auto pt-1">
                          {item.evidencePhotos.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt="Evidence"
                              className="w-14 h-14 rounded-lg object-cover border border-slate-300"
                              referrerPolicy="no-referrer"
                            />
                          ))}
                        </div>
                      )}

                      {/* Observation note field */}
                      <div className="mt-2.5">
                        <input
                          type="text"
                          value={item.observation}
                          onChange={(e) => handleUpdateItemObservation(item.id, e.target.value)}
                          placeholder="Add on-site inspection observation note..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  ))}
              </div>

              <div className="pt-3 flex justify-between border-t border-slate-100">
                <Button variant="ghost" onClick={() => setCurrentStep('risk_focus')}>
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep('findings')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  variant="orange"
                >
                  Review Findings & Evidence
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* STEP 4: Findings & Evidence Summary */}
      {currentStep === 'findings' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <Card>
            <CardHeader>
              <CardTitle subtitle="Consolidated list of non-compliances and photographic proof">
                Findings & Photographic Evidence Registry
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              {nonCompliantItems.length === 0 ? (
                <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-900">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h4 className="font-bold text-sm">No Statutory Violations Recorded</h4>
                  <p className="mt-0.5">All checked clauses meet statutory compliance standards.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700">
                    Flagged Non-Compliances ({nonCompliantItems.length})
                  </h4>
                  {nonCompliantItems.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-950">{item.question}</span>
                        <Badge size="sm" variant="danger">
                          {item.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="font-mono text-slate-500 text-[11px]">{item.legalClause}</p>
                      <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                        <strong>Inspector Finding:</strong> {item.observation || 'Non-compliance observed during walk-through audit.'}
                      </p>

                      {item.evidencePhotos.length > 0 && (
                        <div className="flex items-center gap-2 pt-1">
                          {item.evidencePhotos.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt="Evidence photo"
                              className="w-16 h-16 rounded-lg object-cover border border-slate-300"
                              referrerPolicy="no-referrer"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-3 flex justify-between">
                <Button variant="ghost" onClick={() => setCurrentStep('checklist')}>
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep('remarks')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  variant="orange"
                >
                  Set Remarks & Orders
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* STEP 5: Remarks & Orders */}
      {currentStep === 'remarks' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <Card>
            <CardHeader>
              <CardTitle subtitle="Statutory directives issued to employer">
                Inspector Remarks & Recommendation
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Statutory Recommendation Action <span className="text-rose-500">*</span>
                </label>
                <select
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value as any)}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-300 font-semibold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                >
                  <option value="Issue 15-Day Improvement Notice">
                    Issue 15-Day Improvement Notice (Standard Rectification)
                  </option>
                  <option value="Immediate Show Cause Notice">
                    Immediate Show Cause Notice (High Violation Penalty)
                  </option>
                  <option value="Pass with Certificate">
                    Pass with Certificate (Full Statutory Clean Chit)
                  </option>
                  <option value="Prosecution Proposed">
                    Prosecution Proposed (Severe Repeat Offence)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Official Inspection Remarks <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={inspectorRemarks}
                  onChange={(e) => setInspectorRemarks(e.target.value)}
                  placeholder="Record summary observations, interactions with worker representatives, and employer management commitments..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="pt-3 flex justify-between">
                <Button variant="ghost" onClick={() => setCurrentStep('findings')}>
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep('review')}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  variant="orange"
                >
                  Final Review & Digital Sign
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* STEP 6: Review & Digital Sign */}
      {currentStep === 'review' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <Card>
            <CardHeader>
              <CardTitle subtitle="Final verification before cryptographic sealing">
                Audit Summary & Cryptographic Digital Signature
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4 text-xs">
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400">
                    Inspection: {inspection.inspectionNumber}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {inspection.linNumber}
                  </span>
                </div>
                <h3 className="text-base font-extrabold">{inspection.establishmentName}</h3>
                <p className="text-slate-300 text-[11px]">{inspection.address}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span>Recommendation: <strong className="text-amber-400">{recommendation}</strong></span>
                  <span>Violations: <strong className="text-rose-400">{nonCompliantItems.length}</strong></span>
                </div>
              </div>

              {/* Geo-stamp status */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between font-mono text-[11px] text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  GPS Geotag: 18.7561° N, 73.8441° E (Pune Chakan SEZ)
                </span>
                <span>Accuracy: ±3.5m</span>
              </div>

              {/* Digital sign declaration */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSignConfirmed}
                    onChange={(e) => setIsSignConfirmed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                  />
                  <div className="text-slate-700">
                    <strong className="block text-slate-900 text-xs">
                      Official Enforcement Officer e-Sign Declaration
                    </strong>
                    <span className="text-[11px] leading-relaxed">
                      I, <strong>{currentUser.name}</strong> ({currentUser.badgeNumber || 'LEO-MH-2018-094'}), hereby certify under official authority of the Ministry of Labour & Employment that this field inspection was conducted on-site in full compliance with the Central Labour Codes.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <Button variant="ghost" onClick={() => setCurrentStep('remarks')}>
                  Back
                </Button>
                <Button
                  disabled={!isSignConfirmed}
                  onClick={handleFinalSubmit}
                  leftIcon={<Send className="w-4 h-4" />}
                  variant="orange"
                  size="lg"
                  className="font-bold"
                >
                  {isOffline ? 'Save to Offline Queue' : 'Submit & Sign Report'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* STEP 7: Submitted State */}
      {currentStep === 'submitted' && (
        <Card className="text-center py-10 animate-in zoom-in-95 duration-200">
          <CardBody className="space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Inspection Report Successfully Submitted!
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isOffline
                ? 'Report encrypted and saved locally in your offline queue. It will automatically synchronize when you reconnect.'
                : 'Digital inspection record # ' + inspection.inspectionNumber + ' is now logged on the National Labour Compliance Repository and Shram Suvidha portal.'}
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 text-left">
              <p>Sign Ref: SIG-{currentUser.name.toUpperCase().substring(0, 8)}-2026</p>
              <p>Timestamp: {new Date().toLocaleString()}</p>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Button onClick={onBack}>Return to Inspection Hub</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Camera modal */}
      <CameraEvidenceModal
        isOpen={!!selectedItemForCamera}
        onClose={() => setSelectedItemForCamera(null)}
        clauseTitle={selectedItemForCamera?.question}
        onCapture={handleAttachEvidence}
      />
    </div>
  );
};
