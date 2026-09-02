import React, { useState } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Search,
  Building2,
  Lock,
  Coins,
  ChevronRight,
  Sparkles,
  Phone,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GrievanceItem, UserProfile } from '../../types';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface WorkerGrievancePortalProps {
  currentUser: UserProfile;
  grievances: GrievanceItem[];
  onSubmitGrievance: (grievance: Partial<GrievanceItem>) => void;
}

export const WorkerGrievancePortal: React.FC<WorkerGrievancePortalProps> = ({
  currentUser,
  grievances,
  onSubmitGrievance,
}) => {
  const [activeTab, setActiveTab] = useState<'track' | 'file' | 'rights'>('track');
  const [selectedGrievance, setSelectedGrievance] = useState<GrievanceItem | null>(grievances[0] || null);

  // Form state
  const [establishmentName, setEstablishmentName] = useState('Bharat Heavy Forge & Engineering Ltd.');
  const [linNumber, setLinNumber] = useState('LIN-1984209412');
  const [category, setCategory] = useState<GrievanceItem['category']>('Overtime Wage Non-Payment');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [disputedAmount, setDisputedAmount] = useState('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newTicketId = `SS-GRV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setGeneratedTicketId(newTicketId);

    const newGrievance: Partial<GrievanceItem> = {
      trackingId: newTicketId,
      workerName: isAnonymous ? 'Whistleblower (Identity Protected)' : currentUser.name,
      maskedAadhaar: isAnonymous ? 'XXXX-CONFIDENTIAL' : currentUser.maskedAadhaar,
      workerPhoneMasked: currentUser.maskedMobile,
      establishmentName,
      linNumber,
      category,
      description,
      status: 'submitted',
      filedDate: new Date().toISOString().substring(0, 10),
      isAnonymous,
      disputedAmount: disputedAmount ? `₹${disputedAmount}` : undefined,
      timeline: [
        {
          stage: 'Grievance Digitally Filed',
          date: new Date().toLocaleDateString('en-IN'),
          status: 'completed',
          remarks: 'Registered via e-Shram Worker Direct Portal. SMS acknowledgement triggered.',
        },
        {
          stage: 'AI Priority Triaging',
          date: new Date().toLocaleDateString('en-IN'),
          status: 'current',
          remarks: 'Algorithm matching establishment compliance history and circle inspector availability.',
        },
        {
          stage: 'Enforcement Officer Verification',
          date: 'Expected in 48 hrs',
          status: 'pending',
        },
        {
          stage: 'Resolution & Wage Relief Recovery',
          date: 'Statutory SLA: 15 Days',
          status: 'pending',
        },
      ],
    };

    onSubmitGrievance(newGrievance);
    setIsSubmittedSuccess(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-5 pb-16 max-w-4xl mx-auto">
      {/* 1. Worker Identity & Protection Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-500 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {currentUser.name}
                </h1>
                <Badge size="sm" variant="success">
                  e-Shram Verified
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                UAN: {currentUser.uanNumber || 'UAN-100982390192'} • Aadhaar: {currentUser.maskedAadhaar}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Statutory Whistleblower Identity Protection Active</span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 text-xs font-bold">
        <button
          onClick={() => {
            setActiveTab('track');
            setIsSubmittedSuccess(false);
          }}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'track'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Track My Grievances ({grievances.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('file');
            setIsSubmittedSuccess(false);
          }}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'file'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          File New Complaint / Wage Claim
        </button>

        <button
          onClick={() => {
            setActiveTab('rights');
            setIsSubmittedSuccess(false);
          }}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'rights'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          Know Your Minimum Wage Rates
        </button>
      </div>

      {/* TAB 1: Track Grievance Timeline */}
      {activeTab === 'track' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* List */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
                Your Filed Cases
              </h3>
              {grievances.map((grv) => (
                <div
                  key={grv.id}
                  onClick={() => setSelectedGrievance(grv)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedGrievance?.id === grv.id
                      ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] font-bold text-slate-900">
                      {grv.trackingId}
                    </span>
                    <Badge
                      size="sm"
                      variant={
                        grv.status === 'resolved'
                          ? 'success'
                          : grv.status === 'investigating'
                          ? 'warning'
                          : 'neutral'
                      }
                    >
                      {grv.status.toUpperCase()}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{grv.category}</h4>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{grv.establishmentName}</p>
                </div>
              ))}
            </div>

            {/* Timeline Detail */}
            {selectedGrievance && (
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Case File: {selectedGrievance.trackingId}
                        </span>
                        <CardTitle>{selectedGrievance.category}</CardTitle>
                      </div>
                      <Badge size="sm" variant="warning">
                        {selectedGrievance.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardBody className="space-y-5 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <p className="text-slate-500 font-medium">Establishment Allegation:</p>
                      <strong className="text-slate-900 block">{selectedGrievance.establishmentName}</strong>
                      <p className="text-slate-700 leading-relaxed pt-1">
                        "{selectedGrievance.description}"
                      </p>
                      {selectedGrievance.disputedAmount && (
                        <div className="pt-2 flex items-center gap-1.5 font-bold text-rose-800">
                          <Coins className="w-4 h-4 text-rose-600" />
                          <span>Disputed Wage Arrears Claimed: {selectedGrievance.disputedAmount}</span>
                        </div>
                      )}
                    </div>

                    {/* Timeline Tracker */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Statutory SLA Resolution Timeline
                      </h4>
                      <div className="space-y-4 pl-2 border-l-2 border-slate-200">
                        {selectedGrievance.timeline.map((step, idx) => (
                          <div key={idx} className="relative pl-6">
                            <div
                              className={`absolute -left-[17px] top-0.5 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center ${
                                step.status === 'completed'
                                  ? 'border-emerald-500 text-emerald-600'
                                  : step.status === 'current'
                                  ? 'border-amber-500 text-amber-600 animate-pulse'
                                  : 'border-slate-300 text-slate-300'
                              }`}
                            >
                              {step.status === 'completed' ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-current" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center justify-between">
                                <h5
                                  className={`text-xs font-bold ${
                                    step.status === 'current' ? 'text-amber-900' : 'text-slate-900'
                                  }`}
                                >
                                  {step.stage}
                                </h5>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {step.date}
                                </span>
                              </div>
                              {step.remarks && (
                                <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                                  {step.remarks}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: File New Grievance */}
      {activeTab === 'file' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {isSubmittedSuccess ? (
            <Card className="text-center py-8">
              <CardBody className="space-y-3 max-w-md mx-auto">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Grievance Filed Successfully!
                </h2>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-900">
                  Tracking ID: {generatedTicketId}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your complaint has been registered with the Pune Enforcement Circle. The AI system has scheduled automated muster cross-verification.
                </p>
                <div className="pt-2">
                  <Button onClick={() => setActiveTab('track')}>Track Status on Timeline</Button>
                </div>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle subtitle="Protected under Central Labour Code Grievance Redressal Mechanism">
                  Lodge Wage Claim or Statutory Violation
                </CardTitle>
              </CardHeader>

              <CardBody>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Employer Name & LIN */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Employer / Establishment Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={establishmentName}
                        onChange={(e) => setEstablishmentName(e.target.value)}
                        placeholder="e.g. Bharat Heavy Forge Ltd."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Labour Identification Number (LIN) / Unit ID
                      </label>
                      <input
                        type="text"
                        value={linNumber}
                        onChange={(e) => setLinNumber(e.target.value)}
                        placeholder="e.g. LIN-1984209412"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  {/* Grievance Category & Disputed Amount */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Violation Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                      >
                        <option value="Overtime Wage Non-Payment">
                          Overtime Wage Non-Payment (Code on Wages §14)
                        </option>
                        <option value="PF Deduction Non-Deposit">
                          PF / ESIC Deduction Non-Deposit (Social Security)
                        </option>
                        <option value="OSH / Safety Violation">
                          OSH / Safety Equipment / Fume Hazard
                        </option>
                        <option value="Maternity / Leave Denial">
                          Maternity Benefit / Earned Leave Denial
                        </option>
                        <option value="Arbitrary Termination">
                          Arbitrary Termination / Contract Retrenchment
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Disputed Wage Arrears (₹ Approx)
                      </label>
                      <input
                        type="number"
                        value={disputedAmount}
                        onChange={(e) => setDisputedAmount(e.target.value)}
                        placeholder="e.g. 14500"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-hidden font-mono"
                      />
                    </div>
                  </div>

                  {/* Grievance Description */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Incident Description & Specific Dates <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Explain shifts worked, overtime hours recorded on muster vs bank salary slip credited..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-hidden leading-relaxed"
                    />
                  </div>

                  {/* Whistleblower confidential protection */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="mt-0.5 rounded text-slate-900 focus:ring-slate-900"
                      />
                      <div className="text-xs text-slate-700">
                        <strong className="block text-slate-900">
                          File as Protected Whistleblower (Hide my name from employer)
                        </strong>
                        <span className="text-[11px] text-slate-500">
                          Your Aadhaar and mobile number will only be visible to the Inspecting Magistrate for verification.
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      variant="orange"
                      size="md"
                      leftIcon={<Send className="w-4 h-4" />}
                      className="font-bold"
                    >
                      Lodge Official Grievance
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          )}
        </div>
      )}

      {/* TAB 3: Know Your Rights / Minimum Wage Card */}
      {activeTab === 'rights' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <Card>
            <CardHeader>
              <CardTitle subtitle="Statutory floor wage notified under Code on Wages, 2019">
                Maharashtra State Minimum Wage Floor Rates (Zone 1)
              </CardTitle>
            </CardHeader>
            <CardBody className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Unskilled Labour
                  </span>
                  <span className="text-xl font-black text-slate-900 block">₹448 / day</span>
                  <span className="text-[11px] text-slate-500 font-mono">₹11,648 / month</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Semi-Skilled Labour
                  </span>
                  <span className="text-xl font-black text-slate-900 block">₹492 / day</span>
                  <span className="text-[11px] text-slate-500 font-mono">₹12,792 / month</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Skilled Artisan / Fitter
                  </span>
                  <span className="text-xl font-black text-slate-900 block">₹540 / day</span>
                  <span className="text-[11px] text-slate-500 font-mono">₹14,040 / month</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5 text-amber-950">
                <strong className="block font-bold">Key Statutory Worker Rights Checklist:</strong>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900 leading-relaxed">
                  <li><strong>Overtime Rate:</strong> Any work beyond 8 hours a day or 48 hours a week MUST be paid at <strong>2.0x</strong> your normal basic + DA wage rate.</li>
                  <li><strong>Wage Payment Date:</strong> Wages must be deposited directly into bank accounts by the <strong>7th or 10th of every month</strong>.</li>
                  <li><strong>PF & ESIC:</strong> Employer is legally prohibited from deducting the employer portion of PF/ESIC contribution from worker wages.</li>
                </ul>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};
