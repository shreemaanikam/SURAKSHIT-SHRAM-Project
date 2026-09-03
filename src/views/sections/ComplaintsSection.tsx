import React, { useState } from 'react';
import { 
  MessageSquareWarning, 
  AlertOctagon, 
  TrendingUp, 
  CheckCircle2, 
  Send, 
  Zap, 
  Clock, 
  ShieldAlert,
  User,
  Building,
  Hash
} from 'lucide-react';

interface RecentComplaint {
  id: string;
  type: string;
  company: string;
  detail: string;
  impactScore: number;
  isResolved?: boolean;
}

import { Language, translateText } from '../../services/languageService';

export interface ComplaintsSectionProps {
  currentLanguage?: Language;
}

export const ComplaintsSection: React.FC<ComplaintsSectionProps> = ({ currentLanguage = 'en' }) => {
  const tText = (text: string) => translateText(text, currentLanguage);
  const [yourName, setYourName] = useState('Kavin');
  const [companyName, setCompanyName] = useState('ABC Manufacturing');
  const [companyLin, setCompanyLin] = useState('2024-0789');
  const [complaintType, setComplaintType] = useState('Delayed Wages');
  const [description, setDescription] = useState("My company hadn't gave salary for last 2 months");

  const [recentComplaints, setRecentComplaints] = useState<RecentComplaint[]>([
    {
      id: 'c-1',
      type: 'Delayed Wages',
      company: 'ABC Manufacturing',
      detail: '5 workers affected',
      impactScore: 15,
    },
    {
      id: 'c-2',
      type: 'Unsafe Conditions',
      company: 'XYZ Logistics',
      detail: 'No safety equipment',
      impactScore: 8,
    },
    {
      id: 'c-3',
      type: 'Resolved',
      company: 'DEF Solutions',
      detail: 'Issue resolved',
      impactScore: -5,
      isResolved: true,
    },
  ]);

  const [submittedFeedback, setSubmittedFeedback] = useState<{
    id: string;
    worker: string;
    company: string;
    lin: string;
    type: string;
    impact: number;
    newScore: number;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yourName.trim() || !companyName.trim() || !description.trim()) return;

    const id = `CMP-${Math.floor(100000 + Math.random() * 900000)}`;
    const impact = complaintType === 'Delayed Wages' ? 15 : complaintType === 'Unsafe Working Conditions' ? 12 : 8;
    const computedNewScore = 50 + impact;

    // Add to list
    setRecentComplaints((prev) => [
      {
        id: id,
        type: complaintType,
        company: `${companyName} • ${yourName}`,
        detail: description.substring(0, 45) + '...',
        impactScore: impact,
      },
      ...prev,
    ]);

    setSubmittedFeedback({
      id: id,
      worker: yourName,
      company: companyName,
      lin: companyLin || '2024-0789',
      type: complaintType,
      impact: impact,
      newScore: computedNewScore,
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {tText('Worker Grievance')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          {tText('File a complaint — your grievance directly impacts the company\'s risk score')}
        </p>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: File a Complaint */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageSquareWarning className="w-5 h-5 text-rose-600" />
              <span>{tText('File a Complaint')}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Report delayed wages, unsafe conditions, or any violation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Your Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {tText('Company Name')}
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                required
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs"
              />
            </div>

            {/* Company LIN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {tText('Company LIN')}
              </label>
              <input
                type="text"
                value={companyLin}
                onChange={(e) => setCompanyLin(e.target.value)}
                placeholder="e.g. 2024-0789"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs font-mono"
              />
            </div>

            {/* Type of Complaint */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Type of Complaint
              </label>
              <select
                value={complaintType}
                onChange={(e) => setComplaintType(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs"
              >
                <option value="Delayed Wages">Delayed Wages</option>
                <option value="Unsafe Working Conditions">Unsafe Working Conditions</option>
                <option value="Denial of Benefits">Denial of Benefits</option>
                <option value="Unfair Termination">Unfair Termination</option>
                <option value="Overtime Non-Payment">Overtime Non-Payment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue in detail"
                required
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{tText('File a Complaint')}</span>
              </button>
            </div>
          </form>

          {/* Submission Outcome Feedback */}
          {submittedFeedback && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs text-rose-950 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Complaint submitted!</span>
              </div>
              <div className="space-y-0.5 text-[11px] text-rose-900 pl-6">
                <p className="font-mono">
                  🆔 ID: <strong>{submittedFeedback.id}</strong>
                </p>
                <p>
                  👤 <strong>{submittedFeedback.worker}</strong> vs{' '}
                  <strong>{submittedFeedback.company}</strong> ({submittedFeedback.lin})
                </p>
                <p>⚠️ Type: {submittedFeedback.type}</p>
                <p className="font-bold text-rose-700 pt-1">
                  🔥 Risk Impact: +{submittedFeedback.impact} points
                </p>
                <p className="font-mono font-semibold">
                  📈 New Risk Score: {submittedFeedback.newScore}/100
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Recent Complaints */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span>{tText('Recent Complaints')}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified complaints automatically update company risk scores
            </p>
          </div>

          {/* List of Recent Complaints */}
          <div className="space-y-3">
            {recentComplaints.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.isResolved
                          ? 'bg-emerald-500'
                          : item.impactScore > 10
                          ? 'bg-rose-500'
                          : 'bg-amber-500'
                      }`}
                    />
                    <h4 className="font-bold text-slate-900">{item.type}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-4">
                    {item.company} • {item.detail}
                  </p>
                </div>

                <div className="shrink-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold font-mono ${
                      item.isResolved
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.impactScore > 10
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    Risk {item.impactScore > 0 ? `+${item.impactScore}` : item.impactScore}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Real-time impact info box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-[11px] text-slate-600">
            <div className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 text-[10px]">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span>REAL-TIME IMPACT</span>
            </div>
            <ul className="space-y-1.5 pl-1">
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span>Complaints are verified and update scores within minutes</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span>Each complaint directly affects the company&apos;s risk score</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span>Workers&apos; voices are heard and acted upon immediately</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
