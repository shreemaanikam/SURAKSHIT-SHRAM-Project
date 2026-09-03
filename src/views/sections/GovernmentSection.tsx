import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  MapPin, 
  HelpCircle, 
  Clock, 
  ShieldAlert, 
  BarChart3, 
  TrendingUp, 
  Activity, 
  PieChart as PieChartIcon,
  Sparkles,
  Flame,
  Users,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  Landmark
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface CompanyRow {
  id: string;
  name: string;
  lin: string;
  risk: number;
  status: 'Low' | 'Medium' | 'High';
}

interface PredictiveAlert {
  id: string;
  cluster: string;
  state: string;
  probability: number;
  riskLevel: 'Critical' | 'Elevated' | 'Watch';
  workersImpacted: number;
  primaryTrigger: string;
  leadingIndicators: string[];
  recommendedAction: string;
}

import { Language, translateText } from '../../services/languageService';

export interface GovernmentSectionProps {
  currentLanguage?: Language;
}

export const GovernmentSection: React.FC<GovernmentSectionProps> = ({ currentLanguage = 'en' }) => {
  const tText = (text: string) => translateText(text, currentLanguage);
  const [activeTab, setActiveTab] = useState<'monitoring' | 'predictive'>('monitoring');
  const [selectedState, setSelectedState] = useState('Maharashtra');

  const [companies, setCompanies] = useState<CompanyRow[]>([
    { id: 'c1', name: 'ABC Manufacturing', lin: 'LIN-2024-0789', risk: 65, status: 'Medium' },
    { id: 'c2', name: 'XYZ Textiles', lin: 'LIN-2024-0456', risk: 82, status: 'High' },
    { id: 'c3', name: 'PQR Logistics', lin: 'LIN-2024-0123', risk: 28, status: 'Low' },
    { id: 'c4', name: 'LMN Pharma', lin: 'LIN-2024-0678', risk: 55, status: 'Medium' },
    { id: 'c5', name: 'Apex Heavy Engineering', lin: 'LIN-2024-0991', risk: 89, status: 'High' },
    { id: 'c6', name: 'Bharat Solar Power', lin: 'LIN-2024-0312', risk: 22, status: 'Low' },
  ]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('c1');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];

  // Predictive Alerts Data
  const [predictiveAlerts, setPredictiveAlerts] = useState<PredictiveAlert[]>([
    {
      id: 'pa-1',
      cluster: 'Chakan & Bhosari Auto Industrial Corridor',
      state: 'Maharashtra',
      probability: 87,
      riskLevel: 'Critical',
      workersImpacted: 1850,
      primaryTrigger: 'Contract worker wage disparity & delayed Diwali overtime settlements',
      leadingIndicators: [
        '3 consecutive delayed PF submission cycles across 4 Tier-2 suppliers',
        '38% spike in anonymous grievances on e-Shram portal in past 14 days',
        'Union charter submission deadline approaching in 6 days'
      ],
      recommendedAction: 'Dispatch Regional Labour Commissioner for Tripartite Conciliation Conference within 48 hours.'
    },
    {
      id: 'pa-2',
      cluster: 'Gurugram-Manesar Automotive & Logistics Hub',
      state: 'Haryana',
      probability: 74,
      riskLevel: 'Elevated',
      workersImpacted: 2400,
      primaryTrigger: 'Contractor transition dispute & canteen facility parity demands',
      leadingIndicators: [
        'Contractor agency license expiration notice unanswered',
        'Overtime wage dispute petition lodged with ALC Gurugram'
      ],
      recommendedAction: 'Issue advisory to Principal Employers for mandatory joint contractor grievance session.'
    },
    {
      id: 'pa-3',
      cluster: 'Tiruppur Garment & Textile Export Cluster',
      state: 'Tamil Nadu',
      probability: 62,
      riskLevel: 'Watch',
      workersImpacted: 980,
      primaryTrigger: 'ESIC dispensary distance dispute & shift-rotation roster changes',
      leadingIndicators: [
        'Sudden 22% increase in absentee rates among night-shift operators',
        'Pending inspection notice responses for 3 units'
      ],
      recommendedAction: 'Trigger State Labour Directorate virtual monitoring desk.'
    }
  ]);

  // Compliance trend graph data
  const trendData = [
    { month: 'Mar', complianceRate: 74, inspections: 48, resolved: 41 },
    { month: 'Apr', complianceRate: 78, inspections: 52, resolved: 46 },
    { month: 'May', complianceRate: 81, inspections: 39, resolved: 36 },
    { month: 'Jun', complianceRate: 85, inspections: 61, resolved: 58 },
    { month: 'Jul', complianceRate: 88, inspections: 44, resolved: 42 },
    { month: 'Aug', complianceRate: 91, inspections: 32, resolved: 31 },
  ];

  // Sector risk bar data
  const sectorRiskData = [
    { sector: 'Manufacturing', avgRisk: 64, color: '#e11d48' },
    { sector: 'Textiles', avgRisk: 72, color: '#f43f5e' },
    { sector: 'Logistics', avgRisk: 34, color: '#10b981' },
    { sector: 'Pharma', avgRisk: 48, color: '#f59e0b' },
    { sector: 'Construction', avgRisk: 78, color: '#dc2626' },
  ];

  // Inspection status pie chart data
  const statusPieData = [
    { name: 'Compliant (Low Risk)', value: 58, color: '#10b981' },
    { name: '30-Day Notice (Medium)', value: 28, color: '#f59e0b' },
    { name: 'Marked Inspection (High)', value: 14, color: '#ef4444' },
  ];

  const handleSendNotice = () => {
    setActionMessage(`✉️ 30-Day Notice sent to ${selectedCompany.name}.`);
  };

  const handleMarkInspection = () => {
    setActionMessage(`🔍 ${selectedCompany.name} marked for physical inspection.`);
  };

  const handleMarkCompliant = () => {
    setActionMessage(`✅ ${selectedCompany.name} marked as Compliant.`);
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === selectedCompany.id ? { ...c, risk: 25, status: 'Low' } : c
      )
    );
  };

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

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {tText('Government & Ministry Live Dashboard')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          {tText('Central Labour Commissioner command center — sector-wise compliance, state-wise reports, high-risk establishments, and predictive alerts for labor unrest.')}
        </p>

        {/* Sub-Tabs: Monitoring / Predictive Alerts */}
        <div className="flex justify-center pt-3">
          <div className="inline-flex bg-slate-200/80 p-1 rounded-xl shadow-inner gap-1">
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'monitoring'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>{tText('1. State & Sector Compliance Radar')}</span>
            </button>
            <button
              onClick={() => setActiveTab('predictive')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 relative ${
                activeTab === 'predictive'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>2. AI Predictive Alerts for Labor Disputes (3 Active)</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'monitoring' ? (
        <>
          {/* 📊 REAL-TIME ANALYTICS DASHBOARD GRAPHS & BARS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metric 1 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">STATE COMPLIANCE INDEX</span>
                <div className="text-2xl font-black text-blue-900 font-mono mt-0.5">88.4%</div>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> +4.2% from last quarter
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ACTIVE ESTABLISHMENTS</span>
                <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">4,892</div>
                <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
                  Audited via automated Shram API
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            {/* Metric 3 */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">30-DAY NOTICE RESOLUTION RATE</span>
                <div className="text-2xl font-black text-amber-600 font-mono mt-0.5">92.6%</div>
                <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">
                  Self-remediation without court fines
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* 📈 2 Interactive Chart Panels: Line Trend & Sector Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: 6-Month State Compliance & Inspection Trend Line */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>State Compliance Rate Trend (%)</span>
                  </h3>
                  <p className="text-xs text-slate-500">6-Month historical trajectory post-reform</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Target: 90%+
                </span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="complianceRate" name="Compliance Rate %" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Sector-Wise Average Risk Bar Chart */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-rose-600" />
                    <span>Sector-Wise Average Risk Level</span>
                  </h3>
                  <p className="text-xs text-slate-500">Industry benchmark risk distribution</p>
                </div>
                <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                  Highest: Construction (78)
                </span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorRiskData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="sector" tick={{ fontSize: 10, fill: '#64748b' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="avgRisk" name="Avg Risk Score" radius={[4, 4, 0, 0]}>
                      {sectorRiskData.map((entry, index) => (
                        <Cell key={`sector-cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Main 2-Column Dashboard Layout: Company Table & Action Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left 2 Columns: State Filter & Company Directory */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span>Establishments Directory</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click on any establishment to review violation specifics and trigger enforcement
                  </p>
                </div>

                {/* State Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>State:</span>
                  </span>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                  >
                    {indianStates.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Company Name</th>
                      <th className="py-2.5 px-3">LIN</th>
                      <th className="py-2.5 px-3">Risk Score</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {companies.map((c) => {
                      const isSelected = c.id === selectedCompanyId;
                      return (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedCompanyId(c.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50/80 font-semibold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <td className="py-3 px-3">
                            <span className="text-slate-900 font-bold block">{c.name}</span>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-500">{c.lin}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`font-mono font-bold text-sm ${
                                c.risk > 60
                                  ? 'text-rose-600'
                                  : c.risk > 32
                                  ? 'text-amber-600'
                                  : 'text-emerald-600'
                              }`}
                            >
                              {c.risk}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                c.status === 'High'
                                  ? 'bg-rose-100 text-rose-700'
                                  : c.status === 'Medium'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 1 Column: Action Panel */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span>Action Panel</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Take action on the selected company
                </p>
              </div>

              {/* Selected Company Info Box */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  SELECTED COMPANY
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  {selectedCompany.name}
                </h4>
                <p className="text-xs text-slate-600 font-mono">
                  LIN: {selectedCompany.lin} | Risk: <strong>{selectedCompany.risk}</strong> | Status:{' '}
                  <strong
                    className={
                      selectedCompany.status === 'High'
                        ? 'text-rose-600'
                        : selectedCompany.status === 'Medium'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }
                  >
                    {selectedCompany.status}
                  </strong>
                </p>
              </div>

              {/* 3 Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={handleSendNotice}
                  className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>30-Day Notice</span>
                </button>

                <button
                  onClick={handleMarkInspection}
                  className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Mark for Inspection</span>
                </button>

                <button
                  onClick={handleMarkCompliant}
                  className="flex-1 min-w-[110px] flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Mark Compliant</span>
                </button>
              </div>

              {/* Action Feedback Message */}
              {actionMessage && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-900 flex items-center gap-2 animate-fadeIn">
                  <span>{actionMessage}</span>
                </div>
              )}

              {/* Guidelines Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-[11px] text-slate-600">
                <div className="font-bold text-slate-700 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-slate-500" />
                  <span>Guidelines:</span>
                </div>
                <p className="leading-relaxed">
                  Low (0–32) • Compliant • Medium (33–60) • Send 30-Day Notice • High (61–100) • Mark for Inspection
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Sub-Tab 2: AI Predictive Alerts for Labor Disputes (Early Unrest Warning) */
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-white">
                    AI Labour Dispute Contagion & Early Warning Radar
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    REAL-TIME
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Predicts strike, flash work-stoppages, and collective disputes 14–21 days in advance using grievance sentiment, wage lag & contractor anomalies.
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                PREDICTION ACCURACY
              </span>
              <span className="text-xl font-black text-amber-400 font-mono">91.8% F1-Score</span>
            </div>
          </div>

          {/* Predictive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {predictiveAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {alert.state}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{alert.cluster}</h4>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      alert.riskLevel === 'Critical'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : alert.riskLevel === 'Elevated'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {alert.riskLevel}
                  </span>
                </div>

                {/* Probability & Impact */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">UNREST PROBABILITY</span>
                    <span className="text-xl font-black text-rose-600 font-mono">{alert.probability}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">WORKERS AFFECTED</span>
                    <span className="text-xl font-black text-slate-900 font-mono">{alert.workersImpacted.toLocaleString()}</span>
                  </div>
                </div>

                {/* Trigger */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    PRIMARY ROOT TRIGGER:
                  </span>
                  <p className="text-xs font-semibold text-slate-800">{alert.primaryTrigger}</p>
                </div>

                {/* Indicators */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    EARLY AI SIGNALS:
                  </span>
                  <ul className="text-[11px] text-slate-600 space-y-1 pl-1">
                    {alert.leadingIndicators.map((ind, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-500 font-bold">•</span>
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Conciliation Action */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span>PROACTIVE CONCILIATION INTERVENTION:</span>
                  </span>
                  <p className="text-[11px] text-blue-950 font-medium">{alert.recommendedAction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
