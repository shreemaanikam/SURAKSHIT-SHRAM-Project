import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Scale, 
  AlertCircle,
  FileCheck,
  Building,
  Hash,
  MapPin,
  Sparkles,
  RefreshCw,
  BarChart2,
  TrendingDown,
  Mail,
  Clock,
  Send,
  Download,
  CheckCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

import { Language, translateText } from '../../services/languageService';

export interface CompaniesSectionProps {
  currentLanguage?: Language;
}

export const CompaniesSection: React.FC<CompaniesSectionProps> = ({ currentLanguage = 'en' }) => {
  const tText = (text: string) => translateText(text, currentLanguage);

  const [activeTab, setActiveTab] = useState<'upload' | 'notices'>('upload');
  const [companyName, setCompanyName] = useState('ABC Manufacturing');
  const [companyLin, setCompanyLin] = useState('2024-0789');
  const [state, setState] = useState('Maharashtra');

  // File attachments state
  const [salaryFile, setSalaryFile] = useState<File | null>(null);
  const [salaryFileName, setSalaryFileName] = useState('salary.jpg');
  const [attendanceFile, setAttendanceFile] = useState<File | null>(null);
  const [attendanceFileName, setAttendanceFileName] = useState('sample_attendance.png');
  const [contractorFile, setContractorFile] = useState<File | null>(null);
  const [contractorFileName, setContractorFileName] = useState('contractor.png');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(3);

  // 30-Day Improvement Notice Response State
  const [noticeReplyText, setNoticeReplyText] = useState(
    'EPFO contribution backlog for 140 workers has been cleared via Challan #EPF-2024-8849. Revised overtime register with 2x compensatory payouts is attached.'
  );
  const [proofFileName, setProofFileName] = useState('epf_payment_challan_receipt.pdf');
  const [isNoticeSubmitting, setIsNoticeSubmitting] = useState(false);
  const [isNoticeResolved, setIsNoticeResolved] = useState(false);

  // Breakdown bar chart data
  const riskBreakdownData = isNoticeResolved
    ? [
        { category: 'PF Delay', riskPoints: 0, status: 'Cleared', color: '#10b981' },
        { category: 'Overtime Logs', riskPoints: 4, status: 'Rectified', color: '#10b981' },
        { category: 'Contractors', riskPoints: 6, status: 'KYC Verified', color: '#10b981' },
        { category: 'ESI Status', riskPoints: 8, status: 'Normal', color: '#10b981' },
      ]
    : [
        { category: 'PF Delay', riskPoints: 24, status: 'Overdue', color: '#e11d48' },
        { category: 'Overtime Logs', riskPoints: 20, status: 'Incomplete', color: '#f59e0b' },
        { category: 'Contractors', riskPoints: 16, status: 'Missing KYC', color: '#f97316' },
        { category: 'ESI Status', riskPoints: 8, status: 'Normal', color: '#10b981' },
      ];

  const indianStates = [
    'Maharashtra',
    'Karnataka',
    'Tamil Nadu',
    'Delhi',
    'Uttar Pradesh',
    'Gujarat',
    'West Bengal',
    'Telangana',
    'Rajasthan',
    'Haryana',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      let count = 0;
      if (salaryFileName) count++;
      if (attendanceFileName) count++;
      if (contractorFileName) count++;
      setUploadedCount(count || 3);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNoticeSubmitting(true);
    setTimeout(() => {
      setIsNoticeSubmitting(false);
      setIsNoticeResolved(true);
    }, 800);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Section Title Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {tText('Company Dashboard & Compliance Hub')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          {tText('View your real-time risk score with reasons, upload compliance documents, and respond to 30-day improvement notices.')}
        </p>

        {/* Sub-Tabs: Upload / Notices */}
        <div className="flex justify-center pt-3">
          <div className="inline-flex bg-slate-200/80 p-1 rounded-xl shadow-inner gap-1">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{tText('1. Upload Documents & Risk Score')}</span>
            </button>
            <button
              onClick={() => setActiveTab('notices')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 relative ${
                activeTab === 'notices'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-amber-600" />
              <span>{tText('2. Respond to Improvement Notices (30-Day Grace)')}</span>
              {!isNoticeResolved && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'upload' ? (
        /* 2-Column Main Dashboard Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Upload Documents Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                <span>{tText('Upload Documents')}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {tText('Submit your salary sheets, attendance logs, and contractor lists')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {tText('Company Name')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                    required
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs"
                  />
                </div>
              </div>

              {/* Company LIN */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {tText('Company LIN')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={companyLin}
                    onChange={(e) => setCompanyLin(e.target.value)}
                    placeholder="Enter LIN"
                    required
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs font-mono"
                  />
                </div>
              </div>

              {/* State Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {tText('State')}
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs"
                >
                  <option value="">Select state</option>
                  {indianStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* 1. Upload Salary Sheet */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  {tText('Upload Salary Sheet')}
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-medium text-slate-700 shadow-2xs transition-colors">
                    <span>{tText('Choose File')}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setSalaryFile(e.target.files[0]);
                          setSalaryFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs text-slate-600 truncate font-mono">
                    {salaryFileName || 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* 2. Upload Attendance Log */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  {tText('Upload Attendance Log')}
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-medium text-slate-700 shadow-2xs transition-colors">
                    <span>{tText('Choose File')}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setAttendanceFile(e.target.files[0]);
                          setAttendanceFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs text-slate-600 truncate font-mono">
                    {attendanceFileName || 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* 3. Upload Contractor List */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  {tText('Upload Contractor List')}
                </label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-medium text-slate-700 shadow-2xs transition-colors">
                    <span>{tText('Choose File')}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setContractorFile(e.target.files[0]);
                          setContractorFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                  <span className="text-xs text-slate-600 truncate font-mono">
                    {contractorFileName || 'No file chosen'}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Analyzing Documents...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4" />
                      <span>{tText('Submit Documents')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Submission Feedback Alert */}
            {isSubmitted && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 font-medium animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  📄 {uploadedCount} document(s) uploaded successfully for {companyName}!
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Risk Assessment Panel */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>{tText('Risk Assessment & Reasons')}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time compliance score and weighted risk graph
              </p>
            </div>

            {!isSubmitted && !isNoticeResolved ? (
              <div className="py-14 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                  ⏳ {tText('Submit your documents or click below to simulate instant analysis')}
                </p>
                <button
                  onClick={() => setIsSubmitted(true)}
                  className="text-xs font-bold text-blue-700 hover:underline"
                >
                  {tText('Load Instant Compliance Assessment')}
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                {/* Score Display Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                    COMPLIANCE RISK SCORE
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                        isNoticeResolved ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isNoticeResolved ? '18' : '68'}
                    </span>
                    <span className="text-lg font-bold text-slate-400 font-mono">
                      / 100
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-bold text-slate-700">
                      Risk Level:{' '}
                      <strong className={isNoticeResolved ? 'text-emerald-600' : 'text-rose-600'}>
                        {isNoticeResolved ? 'Low (Compliant)' : 'High (Attention Required)'}
                      </strong>
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isNoticeResolved
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isNoticeResolved ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Compliant (Cure Verified)
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          30-Day Notice Issued
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* 📊 Risk Breakdown Bar Chart */}
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <BarChart2 className="w-3.5 h-3.5 text-blue-600" />
                      Risk Contribution Breakdown (Points)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Total: {isNoticeResolved ? '18 pts' : '68 pts'}
                    </span>
                  </div>
                  <div className="h-36 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={riskBreakdownData} layout="vertical" margin={{ top: 5, right: 20, left: 35, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" domain={[0, 30]} tick={{ fontSize: 10, fill: '#64748b' }} />
                        <YAxis dataKey="category" type="category" tick={{ fontSize: 10, fill: '#334155' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                        <Bar dataKey="riskPoints" name="Risk Weight" radius={[0, 4, 4, 0]}>
                          {riskBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Reasons Breakdown */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>DETAILED REASONS</span>
                  </h4>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                    {isNoticeResolved ? (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span className="text-slate-800">PF payment backlog verified and cleared</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span className="text-slate-800">Overtime payout 2x vouchers audited</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span className="text-slate-800">Contractor KYC verified & compliant</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start gap-2">
                          <span className="text-rose-600 font-bold">•</span>
                          <span>PF payment delayed by 10 days for 140 workers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>Overtime records incomplete in assembly unit</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>Contractor roster missing statutory KYC</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span className="text-slate-600">ESI contributions are up to date</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Recommended Action Box */}
                <div
                  className={`p-3.5 rounded-lg space-y-1 border ${
                    isNoticeResolved
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    {isNoticeResolved ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                        <span>COMPLIANCE STATUS: RESOLVED</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        <span>RECOMMENDED ACTION: 30-DAY SELF REPAIR</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-bold">
                    {isNoticeResolved
                      ? 'Self-remediation approved. Physical inspection waived under Help-First principle.'
                      : 'Respond to Notice #NOT-2024-0089 within 30 days to avoid physical inspection.'}
                  </p>
                </div>

                {/* Fraud Detection & Bias Correction Badges */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">
                          FRAUD DETECTION
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          ✅ No fraud detected
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Confidence: 94%
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-blue-600" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">
                          BIAS CORRECTION
                        </span>
                        <span className="text-xs font-bold text-blue-700">
                          ✅ Verified Fair
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-600">
                      Evaluated without demographic bias.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Sub-Tab 2: Improvement Notices & Rectification Response Screen */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Notice #NOT-2024-0089: Statutory Rectification Order
                </h3>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isNoticeResolved
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {isNoticeResolved ? 'RESOLVED & WAIVED' : 'ACTIVE 30-DAY CURE PERIOD'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Issued by Labour Enforcement Officer • Statutory mandate: &ldquo;Help First, Punish Later&rdquo;
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>18 Days Remaining</span>
              </span>
            </div>
          </div>

          {/* Notice Details Banner */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs text-amber-950">
            <h4 className="font-bold flex items-center gap-1.5 text-amber-900 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Notice Specifics & Alleged Non-Compliances:
            </h4>
            <p className="text-amber-900">
              During digital risk scoring on 12-Aug-2025, system flagged a 10-day delay in EPF deposit for July 2025 and inconsistent overtime multipliers for 22 floor staff. Under Section 107 of Code on Social Security 2020, <strong>you are granted a 30-day self-rectification window without any fine or prosecution</strong>.
            </p>
          </div>

          {/* Reply Form */}
          <form onSubmit={handleNoticeSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company Written Explanation & Rectification Summary:
              </label>
              <textarea
                rows={3}
                value={noticeReplyText}
                onChange={(e) => setNoticeReplyText(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs resize-none"
              />
            </div>

            {/* Upload Proof of Rectification */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Attach Proof of Payment / Revised Register (PDF or Image):
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 shadow-2xs transition-colors flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose Challan / Proof</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setProofFileName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
                <span className="text-xs text-slate-600 font-mono font-bold truncate">
                  📄 {proofFileName}
                </span>
              </div>
            </div>

            {/* Submit Rectification */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isNoticeSubmitting || isNoticeResolved}
                className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-400 text-white rounded-lg text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                {isNoticeSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Rectification...</span>
                  </>
                ) : isNoticeResolved ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Rectification Response Accepted</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Rectification & Request Score Recalculation</span>
                  </>
                )}
              </button>

              {isNoticeResolved && (
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className="px-4 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>View Updated Risk Score (Dropped to 18/100)</span>
                </button>
              )}
            </div>
          </form>

          {/* Success Banner */}
          {isNoticeResolved && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-950 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Notice Successfully Resolved! Compliance Certificate Generated</span>
              </div>
              <p className="text-emerald-800 pl-7 text-xs">
                Your EPF challan verification matches EPFO Shram Suvidha gateway records. Risk score has dropped from <strong>68</strong> to <strong>18 (Compliant)</strong>, and pending physical inspection has been cancelled automatically.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
