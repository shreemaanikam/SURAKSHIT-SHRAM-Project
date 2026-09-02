import React, { useState } from 'react';
import { 
  Store, 
  Send, 
  CheckCircle2, 
  FileText, 
  Mail, 
  ShieldCheck, 
  Lightbulb,
  Building,
  MapPin,
  Clock,
  Shield
} from 'lucide-react';

export const SmallBusinessSection: React.FC = () => {
  const [businessName, setBusinessName] = useState('KYC');
  const [ownerName, setOwnerName] = useState('Vimal');
  const [state, setState] = useState('Maharashtra');
  const [cscCenter, setCscCenter] = useState('CSC - Vashi');
  const [uploadedFileName, setUploadedFileName] = useState('salary.jpg');

  const [submittedReceipt, setSubmittedReceipt] = useState<{
    id: string;
    business: string;
    owner: string;
    state: string;
    csc: string;
  } | null>(null);

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
    'Madhya Pradesh',
  ];

  const cscCenters = [
    'CSC - Vashi',
    'CSC - Andheri East',
    'CSC - Indiranagar',
    'CSC - Connaught Place',
    'CSC - Aliganj',
    'CSC - Ahmedabad',
    'CSC - Shivajinagar (Pune)',
    'CSC - T Nagar (Chennai)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !ownerName.trim()) return;

    const receiptId = `CSC-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedReceipt({
      id: receiptId,
      business: businessName,
      owner: ownerName,
      state: state,
      csc: cscCenter,
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          For Small Businesses
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Submit documents offline through Common Service Centers
        </p>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Submit via CSC */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-blue-600" />
              <span>Submit via Common Service Center</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Visit any CSC to submit your documents — no computer needed
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Business Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter business name"
                required
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs"
              />
            </div>

            {/* Owner Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Owner Name
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Enter owner name"
                required
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs"
              >
                {indianStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Common Service Center */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Common Service Center
              </label>
              <select
                value={cscCenter}
                onChange={(e) => setCscCenter(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 shadow-2xs"
              >
                {cscCenters.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload Documents */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Upload Documents
              </label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-medium text-slate-700 shadow-2xs transition-colors">
                  <span>Choose File</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setUploadedFileName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
                <span className="text-xs text-slate-600 truncate font-mono">
                  {uploadedFileName || 'No file chosen'}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4" />
                <span>Submit via CSC</span>
              </button>
            </div>
          </form>

          {/* Submission Receipt Alert */}
          {submittedReceipt && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-emerald-950">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  📄 Documents submitted via {submittedReceipt.csc} for {submittedReceipt.business}!
                </span>
              </div>
              <div className="text-emerald-800 space-y-0.5 pl-6 text-[11px]">
                <p>
                  Owner: <strong>{submittedReceipt.owner}</strong> | State: <strong>{submittedReceipt.state}</strong>
                </p>
                <p className="font-mono">
                  ID: <strong>{submittedReceipt.id}</strong>
                </p>
                <p className="text-emerald-900 font-semibold pt-1">
                  ✅ You will get a 30-day notice if any issues are found.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Small Business Benefits */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Small Business Benefits</span>
            </h3>
          </div>

          <div className="space-y-4">
            {/* Benefit 1 */}
            <div className="flex items-start gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Submit through Common Service Centers
                </h4>
                <p className="text-xs text-slate-600">
                  No computer or internet needed at your shop. Simply visit your local CSC operator.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex items-start gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Receive a 30-day notice to fix issues
                </h4>
                <p className="text-xs text-slate-600">
                  Enjoy genuine statutory grace periods instead of direct arbitrary fines or punishment.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex items-start gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Protected from unfair targeting
                </h4>
                <p className="text-xs text-slate-600">
                  Built-in bias detection algorithm guarantees micro and small enterprises are not unfairly targeted.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex items-start gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Clear risk score with plain-English reasons
                </h4>
                <p className="text-xs text-slate-600">
                  Transparent, actionable explanations for every inspection score or compliance suggestion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
