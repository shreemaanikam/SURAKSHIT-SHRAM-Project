import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Camera,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UploadCloud,
  ShieldCheck,
  Building,
  UserCheck,
  Calendar,
  History,
  Sparkles,
  Wifi,
  WifiOff,
  Navigation,
  FileCheck,
  RotateCcw,
  Smartphone
} from 'lucide-react';

interface PastRecord {
  date: string;
  type: string;
  finding: string;
  status: 'Resolved' | 'Pending Penalty' | 'Notice Issued';
}

import { Language, translateText } from '../../services/languageService';

export interface InspectorSectionProps {
  currentLanguage?: Language;
}

export const InspectorSection: React.FC<InspectorSectionProps> = ({ currentLanguage = 'en' }) => {
  const tText = (text: string) => translateText(text, currentLanguage);
  const [selectedCompany, setSelectedCompany] = useState('ABC Manufacturing');
  const [isOffline, setIsOffline] = useState(false);
  const [photoEvidence, setPhotoEvidence] = useState<string | null>(null);
  const [evidenceTimestamp, setEvidenceTimestamp] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // 48-Hour Statutory Timer Countdown (starts at 47h 58m 32s)
  const [secondsLeft, setSecondsLeft] = useState(48 * 3600 - 88);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}h ${minutes
      .toString()
      .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  // Checklist items
  const [checklist, setChecklist] = useState([
    { id: '1', label: 'Machine Guarding & Safety Barriers (OSH Code §23)', checked: false, critical: true },
    { id: '2', label: 'Overtime Register & Proof of 2x Wage Payment (Wages Code §14)', checked: false, critical: true },
    { id: '3', label: 'Contractor Licence & Equal Pay Verification (OSH Code §47)', checked: false, critical: false },
    { id: '4', label: 'First Aid Box & Emergency Medical Facility on premise', checked: true, critical: false },
    { id: '5', label: 'Clean Drinking Water & Restroom Facilities for Workers', checked: true, critical: false },
  ]);

  const pastRecords: PastRecord[] = [
    {
      date: '14 Oct 2024',
      type: 'Routine Inspection',
      finding: 'Minor delay in PF returns filing for Q2',
      status: 'Resolved',
    },
    {
      date: '02 Feb 2024',
      type: 'Grievance Inspection',
      finding: '3 contract workers unpaid for overtime work',
      status: 'Notice Issued',
    },
    {
      date: '19 Aug 2023',
      type: 'Annual Audit',
      finding: 'Safety signage missing in Boiler Section #2',
      status: 'Resolved',
    },
  ];

  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleCapturePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoEvidence(URL.createObjectURL(file));
      setEvidenceTimestamp(
        `📍 Lat: 18.5204° N, Long: 73.8567° E (Pune MIDC) • Captured: ${new Date().toLocaleTimeString()} (GPS Verified)`
      );
    }
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[11px] font-bold uppercase tracking-wider mb-1">
          <Smartphone className="w-3.5 h-3.5 text-blue-700" />
          <span>LEO FIELD INSPECTION MOBILE SUITE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Inspector Mobile App
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
          Conduct on-site physical audits, review past violation records, capture geotagged photo evidence, and submit statutory reports within 48 hours.
        </p>
      </div>

      {/* Top Mobile Officer Status Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold font-mono text-lg">
            LEO
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white">Rajesh Verma</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                OFFICER CODE: LEO-MH-PUN-084
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Ward 14, Chakan MIDC Industrial Area, Pune</span>
            </p>
          </div>
        </div>

        {/* 48-Hour Upload Timer */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                STATUTORY REPORT SUBMISSION TIMER (48-HR RULE)
              </span>
              <span className="text-sm sm:text-base font-black font-mono text-amber-400">
                {formatCountdown(secondsLeft)}
              </span>
            </div>
          </div>

          {/* Offline Mode Toggle */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              isOffline
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title="Toggle Offline Sync Mode"
          >
            {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
            <span>{isOffline ? 'Offline Mode' : 'Online'}</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Mobile Field Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Company Profile, Risk Score & Past Records (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Target Company Profile Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  INSPECTION TARGET
                </span>
                <h4 className="text-base font-bold text-slate-900">{selectedCompany}</h4>
                <p className="text-xs text-slate-500 font-mono">LIN: 2024-0789 • Auto Components</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">SYSTEM RISK</span>
                <span className="text-2xl font-black text-rose-600 font-mono">68/100</span>
              </div>
            </div>

            {/* Target Address & Geo Coords */}
            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-700">
              <p className="font-semibold flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span>Plot 42-B, Sector 7, Chakan Industrial Area</span>
              </p>
              <p className="text-[11px] text-slate-500 font-mono pl-5">
                GPS Verification: 18.5204° N, 73.8567° E (Within 50m radius ✅)
              </p>
            </div>

            {/* Why Inspected? Alert */}
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1 text-rose-950">
              <span className="font-bold flex items-center gap-1 text-rose-900">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Algorithm Flagged Reasons for Visit:
              </span>
              <ul className="list-disc list-inside text-[11px] text-rose-800 space-y-0.5 pl-1">
                <li>PF delay of 10 days for 140 workers</li>
                <li>Grievance filed for delayed overtime wages</li>
                <li>Contractor roster missing statutory KYC</li>
              </ul>
            </div>
          </div>

          {/* Past Inspection History & Records */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <History className="w-4 h-4 text-blue-600" />
                Past Inspection Records (3-Year Audit Log)
              </h4>
            </div>

            <div className="space-y-2.5">
              {pastRecords.map((rec, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{rec.type}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{rec.date}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{rec.finding}</p>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      rec.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Physical Visit Checklist, Geotagged Camera & 48-Hour Report Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>On-Site Inspection Report</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mandatory under Central Labour Inspection Rules 2025
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Form LEO-4
            </span>
          </div>

          <form onSubmit={handleSubmitReport} className="space-y-5">
            {/* 1. On-Site Inspection Checklist */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Statutory Compliance Checklist
              </label>
              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                {checklist.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-2.5 cursor-pointer text-xs select-none hover:bg-white p-1.5 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleToggleChecklist(item.id)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <div className="flex-1">
                      <span className={`font-medium ${item.checked ? 'text-slate-900 line-through opacity-70' : 'text-slate-800'}`}>
                        {item.label}
                      </span>
                      {item.critical && (
                        <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                          CRITICAL
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Geotagged Photo Evidence Camera Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Geotagged Photo Evidence (Camera Capture)
              </label>
              <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/70 hover:bg-slate-50 transition-colors text-center space-y-2">
                {photoEvidence ? (
                  <div className="space-y-2">
                    <img
                      src={photoEvidence}
                      alt="Captured Evidence"
                      className="h-44 mx-auto rounded-lg object-cover border border-slate-300 shadow-sm"
                    />
                    <p className="text-[11px] text-slate-600 font-mono font-bold">{evidenceTimestamp}</p>
                    <button
                      type="button"
                      onClick={() => setPhotoEvidence(null)}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Retake Photo
                    </button>
                  </div>
                ) : (
                  <div>
                    <Camera className="w-8 h-8 text-blue-600 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-slate-700">Capture or Upload On-Site Evidence</p>
                    <p className="text-[11px] text-slate-500 mb-2">Auto-attaches GPS Latitude, Longitude & Timestamp</p>
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Take Photo / Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleCapturePhoto}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Officer Findings & Notes */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Enforcement Officer Summary Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter physical observations, statements recorded from workers, and rectification advice provided..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Report & Complete Audit (Within 48 Hours)</span>
              </button>
            </div>
          </form>

          {/* Submission Success Banner */}
          {reportSubmitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-950 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Inspection Report Filed & Signed Electronically!</span>
              </div>
              <p className="text-emerald-800 pl-7 text-[11px]">
                Report Ref: <strong>REP-2024-MH-09214</strong> • Synced with Central Labour Commissioner Database.
                Establishment has been notified with copy via SMS & DigiLocker.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
