import React, { useState, useMemo } from 'react';
import {
  Landmark,
  Sparkles,
  Search,
  Filter,
  Calendar,
  Layers,
  ChevronDown,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Maximize2,
  Share2,
  Download,
  RotateCcw,
  Zap,
  Activity,
  Bot,
  BrainCircuit,
  FileSpreadsheet,
  Building2,
  Users,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { NationalStats, PredictiveAlertItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AiLabourCopilotModal } from '../../components/modals/AiLabourCopilotModal';

interface GovernmentDashboardProps {
  nationalStats: NationalStats;
  alerts: PredictiveAlertItem[];
  onNavigateToAlerts: () => void;
  onSelectEstablishment?: (lin: string) => void;
}

export const GovernmentDashboard: React.FC<GovernmentDashboardProps> = ({
  nationalStats,
  alerts,
  onNavigateToAlerts,
  onSelectEstablishment,
}) => {
  // Filter States
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedOccupation, setSelectedOccupation] = useState<string>('All');
  const [dateRange, setDateRange] = useState({ start: '8/24/2021', end: '8/19/2026' });
  const [sliderValue, setSliderValue] = useState<number>(100);

  // PowerBI & AI State Controls
  const [activeTab, setActiveTab] = useState<'powerbi' | 'ai_radar' | 'ai_ocr'>('powerbi');
  const [showAiOverlay, setShowAiOverlay] = useState<boolean>(true);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState<boolean>(false);
  const [aiQueryContext, setAiQueryContext] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(97);
  const [activePage, setActivePage] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Official State Data (Exact match to e-Shram National Dashboard)
  const topStatesData = [
    {
      state: 'UTTAR PRADESH',
      registrations: 84727730,
      formatted: '84,727,730',
      complianceScore: 74.2,
      aiRiskNote: 'Overtime disparity in brick kilns & sugar mills',
      aiRiskLevel: 'High',
    },
    {
      state: 'BIHAR',
      registrations: 32527054,
      formatted: '32,527,054',
      complianceScore: 71.8,
      aiRiskNote: 'Inter-state migrant worker social security lag',
      aiRiskLevel: 'Critical',
    },
    {
      state: 'WEST BENGAL',
      registrations: 26738156,
      formatted: '26,738,156',
      complianceScore: 76.5,
      aiRiskNote: 'Jute & tea plantation ESIC dispensary coverage gap',
      aiRiskLevel: 'Moderate',
    },
    {
      state: 'MADHYA PRADESH',
      registrations: 19616019,
      formatted: '19,616,019',
      complianceScore: 78.9,
      aiRiskNote: 'Mining & quarrying safety gear compliance deficit',
      aiRiskLevel: 'Moderate',
    },
    {
      state: 'MAHARASHTRA',
      registrations: 18758006,
      formatted: '18,758,006',
      complianceScore: 82.4,
      aiRiskNote: 'BOCW cess pass-through lag in Pune & MMR belt',
      aiRiskLevel: 'High',
    },
  ];

  // Official Top 5 Occupation Sectors (Exact match to e-Shram National Dashboard)
  const topOccupationsData = [
    {
      sector: 'Agriculture',
      registrations: 164241110,
      formatted: '164,241,110',
      compliance: 84.1,
      aiAnomaly: 'Seasonal contract wage delays detected in 12 agro-clusters',
    },
    {
      sector: 'Domestic and Household',
      registrations: 29598801,
      formatted: '29,598,801',
      compliance: 68.4,
      aiAnomaly: 'Maternity benefit enrollment gap (only 22% seeded with ESIC)',
    },
    {
      sector: 'Construction',
      registrations: 29197798,
      formatted: '29,197,798',
      compliance: 71.2,
      aiAnomaly: 'BOCW cess ₹42.8 Cr deficit flagged across mid-tier EPC firms',
    },
    {
      sector: 'Apparel',
      registrations: 21100279,
      formatted: '21,100,279',
      compliance: 79.5,
      aiAnomaly: 'Night-shift transport log verification non-compliance (§43 OSH)',
    },
    {
      sector: 'Miscellaneous',
      registrations: 15441696,
      formatted: '15,441,696',
      compliance: 75.3,
      aiAnomaly: 'Gig & platform worker unseeded social security IDs',
    },
  ];

  // Channels Breakdown (CSC, Self, SSK, etc.)
  const channelsData = [
    { channel: 'CSC', count: 180884356, label: '180,884,356' },
    { channel: 'Self', count: 132293339, label: '132,293,339' },
    { channel: 'SSK', count: 5089480, label: '5,089,480' },
    { channel: 'Other Schemes', count: 762503, label: '762,503' },
    { channel: 'Umang', count: 33863, label: '33,863' },
  ];

  // 6-Month Daily Trend Time Series (Matches Screenshots 2 & 3)
  const dailyUanTrend = [
    { date: 'Mar 1', uanCards: 8400, cscRegistrations: 980, stateSeva: 180 },
    { date: 'Mar 10', uanCards: 14200, cscRegistrations: 1200, stateSeva: 240 },
    { date: 'Mar 24', uanCards: 28400, cscRegistrations: 12000, stateSeva: 640, isSpike: true },
    { date: 'Apr 5', uanCards: 19800, cscRegistrations: 2100, stateSeva: 320 },
    { date: 'Apr 18', uanCards: 22400, cscRegistrations: 1800, stateSeva: 290 },
    { date: 'May 2', uanCards: 16500, cscRegistrations: 1400, stateSeva: 210 },
    { date: 'May 20', uanCards: 26800, cscRegistrations: 2300, stateSeva: 380 },
    { date: 'Jun 8', uanCards: 39400, cscRegistrations: 3400, stateSeva: 490 },
    { date: 'Jun 22', uanCards: 28100, cscRegistrations: 2900, stateSeva: 410 },
    { date: 'Jul 10', uanCards: 34200, cscRegistrations: 3100, stateSeva: 450 },
    { date: 'Jul 28', uanCards: 46100, cscRegistrations: 3900, stateSeva: 520 },
    { date: 'Aug 19', uanCards: 43317, cscRegistrations: 4100, stateSeva: 580 },
  ];

  const handleOpenCopilot = (contextQuery?: string) => {
    if (contextQuery) setAiQueryContext(contextQuery);
    setIsAiCopilotOpen(true);
  };

  const handleResetFilters = () => {
    setSelectedState('All');
    setSelectedOccupation('All');
    setSliderValue(100);
  };

  return (
    <div className="space-y-4 pb-12 font-sans text-slate-900">
      {/* 1. TOP STATUTORY & AI INTELLIGENCE HEADER BAR - INDIAN NATIONAL TRICOLOR THEME */}
      <div className="bg-gradient-to-r from-[#001433] via-[#002060] to-[#0a1931] text-white rounded-2xl p-4 sm:p-5 shadow-xl border-t-4 border-t-orange-500 border-b-4 border-b-emerald-600 border-x border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle Ashoka Chakra decorative background watermark */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-radial from-blue-500/10 to-transparent pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-center font-bold font-serif text-xl shadow-lg shrink-0 border-2 border-orange-300 ring-2 ring-orange-500/30">
            सं
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
                GOVERNMENT OF INDIA • MINISTRY OF LABOUR & EMPLOYMENT
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                AI RISK TELEMETRY: ACTIVE (99.2% ACCURACY)
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow-sm">
                e-Shram National Dashboard & Labour Code Compliance Radar
              </h1>
            </div>
          </div>
        </div>

        {/* Top AI Action Switcher - Tricolor Styled (Orange, Ashoka Navy Blue, India Green) */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10">
          {/* Saffron / Orange Action Button */}
          <Button
            size="sm"
            onClick={() => handleOpenCopilot('Summarize high-risk contagion factors in Maharashtra and UP construction sector')}
            leftIcon={<Sparkles className="w-4 h-4 text-amber-100" />}
            className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold shadow-lg border border-orange-400/40 text-xs py-2 px-3.5 ring-1 ring-orange-400/30"
          >
            Ask AI Labour Copilot
          </Button>

          {/* Ashoka Navy Blue Button */}
          <Button
            size="sm"
            onClick={onNavigateToAlerts}
            leftIcon={<BrainCircuit className="w-4 h-4 text-sky-300" />}
            className="bg-gradient-to-r from-blue-900 to-[#002060] hover:from-blue-800 hover:to-blue-900 text-white border border-blue-400/40 font-bold text-xs shadow-md py-2 px-3.5"
          >
            AI Predictive Radar ({alerts.length})
          </Button>

          {/* India Green Button */}
          <button
            onClick={() => setShowAiOverlay(!showAiOverlay)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border shadow-md ${
              showAiOverlay
                ? 'bg-gradient-to-r from-emerald-600 to-green-700 text-white border-emerald-400 ring-2 ring-emerald-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-200" />
            AI Anomaly Overlay: {showAiOverlay ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* 2. SECONDARY POWERBI BANNER STRIP */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-xs p-3 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-blue-900 uppercase tracking-tight text-sm">
            Ministry of Labour & Employment
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-700 font-semibold">
            Dashboard • Shramev Jayate (National Database of Unorganised Workers - NDUW)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500 text-[11px] font-medium">
            Last Telemetry Ingestion: <strong>20/08/2026, 19:10 IST</strong>
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-bold text-[10px]">
            Live Sync: Central Gateway v4.2
          </span>
        </div>
      </div>

      {/* 3. TOP 4 KEY METRIC CARDS (Indian National Colors: Saffron Orange, Ashoka Royal Blue, India Green, Ashoka Navy) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Saffron / Orange Card - Yesterday's Registrations & Daily Filings */}
        <div className="bg-gradient-to-br from-[#E65100] via-[#F57C00] to-[#FF8F00] text-white rounded-xl p-5 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[110px] border border-orange-400/50">
          <div className="absolute top-0 right-0 p-3 opacity-15">
            <Users className="w-20 h-20" />
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black tracking-tight block drop-shadow-xs">
              43,317
            </span>
            <span className="text-xs sm:text-sm font-bold opacity-95 block mt-1">
              Yesterday's Registrations / Daily Inspection Filings
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold pt-2 border-t border-white/25 mt-2">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +4.2% vs 7-day average
            </span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-mono">e-Shram Universal</span>
          </div>
        </div>

        {/* Ashoka Royal Blue Card - Registrations Completed (31.90 Crore Workers) */}
        <div className="bg-gradient-to-br from-[#002060] via-[#0047BA] to-[#0078D4] text-white rounded-xl p-5 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[110px] border border-blue-400/50">
          <div className="absolute top-0 right-0 p-3 opacity-15">
            <Building2 className="w-20 h-20" />
          </div>
          <div>
            <span className="text-3xl sm:text-4xl font-black tracking-tight block drop-shadow-xs">
              31,90,63,541
            </span>
            <span className="text-xs sm:text-sm font-bold opacity-95 block mt-1">
              Registrations Completed (31.90 Crore Workers Protected)
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold pt-2 border-t border-white/25 mt-2">
            <span>Aadhaar e-KYC Seeded: 99.1%</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-mono">36 States/UTs</span>
          </div>
        </div>

        {/* India Green Card - AI Automated OCR & Anomaly Verification */}
        <div className="bg-gradient-to-br from-[#0D5C1E] via-[#138808] to-[#1E824C] text-white rounded-xl p-5 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[110px] border border-emerald-400/50">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-4xl font-black tracking-tight block drop-shadow-xs">
                99.2%
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-300 text-emerald-950 font-black text-[10px] shadow-xs">
                AI VERIFIED
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold opacity-95 block mt-1">
              AI Wage Register & Biometric Ingestion Confidence
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-semibold pt-2 border-t border-white/25 mt-2">
            <span>1.48M Records Scanned Today</span>
            <button
              onClick={() => handleOpenCopilot('Explain AI verification accuracy algorithm')}
              className="underline hover:text-emerald-100 cursor-pointer font-bold"
            >
              How AI Works →
            </button>
          </div>
        </div>

        {/* Ashoka Navy & Saffron Card - AI Contagion & High-Risk Interventions */}
        <div className="bg-gradient-to-br from-[#06101E] via-[#0A1931] to-[#002060] text-white rounded-xl p-5 shadow-md border-2 border-orange-500/50 relative overflow-hidden flex flex-col justify-between min-h-[110px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-orange-400 block drop-shadow-xs">
                4,120
              </span>
              <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/40 font-black text-[10px]">
                ACTION REQUIRED
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-slate-200 block mt-1">
              AI High-Risk Outliers & Show Cause Triggers
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-2 border-t border-slate-700/60 mt-2">
            <span className="text-orange-400 font-bold">Priority Audit Queue</span>
            <button
              onClick={onNavigateToAlerts}
              className="text-orange-400 underline hover:text-orange-300 cursor-pointer font-extrabold"
            >
              View Radar ({alerts.length}) →
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN POWERBI BODY: TOP 5 STATES + TOP 5 SECTORS + FILTERS PANEL (Exact from Screenshot 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: TOP 5 STATES (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-300 shadow-sm p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 uppercase">
                  Top 5 States
                </h2>
                <p className="text-[11px] text-slate-500">
                  Worker registrations & Labour Code coverage
                </p>
              </div>
              <button
                onClick={() => handleOpenCopilot('Compare statutory compliance across top 5 states: UP, Bihar, WB, MP, MH')}
                className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2 py-1 rounded flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                AI Deep Dive
              </button>
            </div>

            {/* Custom Horizontal Bar Chart for Top 5 States */}
            <div className="space-y-3.5 my-2">
              {topStatesData.map((item, idx) => {
                const maxVal = 100000000; // 100M
                const widthPercent = (item.registrations / maxVal) * 100;

                return (
                  <div key={item.state} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 text-[11px]">
                        {item.state}
                      </span>
                      <span className="font-mono font-bold text-blue-900 text-xs">
                        {item.registrations.toLocaleString()}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-6 rounded-md overflow-hidden relative flex items-center">
                      <div
                        className="bg-[#0078D4] h-full rounded-md transition-all duration-700 flex items-center justify-end pr-2"
                        style={{ width: `${widthPercent}%` }}
                      >
                        <span className="text-[10px] font-bold text-white font-mono drop-shadow-xs">
                          {item.registrations > 30000000 ? item.registrations : ''}
                        </span>
                      </div>
                    </div>

                    {/* AI Anomaly Tag if enabled */}
                    {showAiOverlay && (
                      <div className="flex items-center justify-between text-[10px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        <span className="text-slate-600 truncate">
                          Compliance: <strong>{item.complianceScore}%</strong> • {item.aiRiskNote}
                        </span>
                        <button
                          onClick={() => handleOpenCopilot(`Analyze ${item.state} labor inspection risks and ${item.aiRiskNote}`)}
                          className="text-amber-700 font-bold hover:underline shrink-0 ml-1 cursor-pointer"
                        >
                          AI →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* X-Axis Scale Marker */}
            <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-200 font-mono">
              <span>0M</span>
              <span>50M</span>
              <span>100M</span>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: TOP 5 OCCUPATION SECTORS (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-300 shadow-sm p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 uppercase">
                  Top 5 Occupation Sectors
                </h2>
                <p className="text-[11px] text-slate-500">
                  National sector-wise distribution on e-Shram
                </p>
              </div>
              <button
                onClick={() => handleOpenCopilot('Evaluate minimum wage compliance and BOCW cess across Construction, Agriculture and Apparel sectors')}
                className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2 py-1 rounded flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                AI Risk Breakdown
              </button>
            </div>

            {/* Horizontal Bar Chart for Top 5 Sectors */}
            <div className="space-y-3.5 my-2">
              {topOccupationsData.map((item) => {
                const maxVal = 200000000; // 0.2bn
                const widthPercent = (item.registrations / maxVal) * 100;

                return (
                  <div key={item.sector} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 text-[11px] truncate max-w-[170px]">
                        {item.sector}
                      </span>
                      <span className="font-mono font-bold text-blue-900 text-xs">
                        {item.registrations.toLocaleString()}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-6 rounded-md overflow-hidden relative flex items-center">
                      <div
                        className="bg-[#0078D4] h-full rounded-md transition-all duration-700 flex items-center justify-end pr-2"
                        style={{ width: `${widthPercent}%` }}
                      >
                        <span className="text-[10px] font-bold text-white font-mono drop-shadow-xs">
                          {item.registrations > 25000000 ? item.registrations : ''}
                        </span>
                      </div>
                    </div>

                    {/* AI Anomaly Tag if enabled */}
                    {showAiOverlay && (
                      <div className="flex items-center justify-between text-[10px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        <span className="text-slate-600 truncate">
                          {item.aiAnomaly}
                        </span>
                        <button
                          onClick={() => handleOpenCopilot(`Give detailed statutory recommendations for ${item.sector}: ${item.aiAnomaly}`)}
                          className="text-amber-700 font-bold hover:underline shrink-0 ml-1 cursor-pointer"
                        >
                          Ask AI →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* X-Axis Scale Marker */}
            <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-200 font-mono">
              <span>0.0bn</span>
              <span>0.1bn</span>
              <span>0.2bn</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE FILTERS & CHANNELS PANEL (lg:col-span-3) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-300 shadow-sm p-4 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">
                Last Updated On
              </span>
              <span className="font-mono text-xs font-bold text-slate-800">
                20/08/2026
              </span>
            </div>

            {/* State Filter Dropdown */}
            <div className="space-y-1 mt-3">
              <label className="text-xs font-bold text-slate-800 block">
                Select State
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="All">All States (National)</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Bihar">Bihar</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
            </div>

            {/* Occupation Filter Dropdown */}
            <div className="space-y-1 mt-3">
              <label className="text-xs font-bold text-slate-800 block">
                Select Occupation
              </label>
              <select
                value={selectedOccupation}
                onChange={(e) => setSelectedOccupation(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="All">All Occupations</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Domestic and Household">Domestic and Household</option>
                <option value="Construction">Construction</option>
                <option value="Apparel">Apparel / Textiles</option>
                <option value="Heavy Engineering">Heavy Engineering</option>
                <option value="Mining">Mining & Quarrying</option>
                <option value="Miscellaneous">Miscellaneous</option>
              </select>
            </div>

            {/* Date Range Slider & Inputs (Screenshot 1) */}
            <div className="space-y-2 mt-4 pt-3 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 block">
                Registration Date Period
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-1.5 bg-slate-100 rounded border border-slate-200 text-center font-bold text-slate-800">
                  {dateRange.start}
                </div>
                <div className="p-1.5 bg-slate-100 rounded border border-slate-200 text-center font-bold text-slate-800">
                  {dateRange.end}
                </div>
              </div>

              {/* Slider Input */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(Number(e.target.value))}
                className="w-full accent-[#0078D4] cursor-pointer"
              />
            </div>

            {/* Registration Channels Breakdown (CSC, Self, SSK, etc.) */}
            <div className="space-y-2 mt-4 pt-3 border-t border-slate-200">
              <span className="text-[11px] font-bold text-slate-700 block uppercase">
                Registrations by Channel
              </span>
              <div className="space-y-1.5 text-xs">
                {channelsData.map((ch) => (
                  <div key={ch.channel} className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium text-[11px]">{ch.channel}</span>
                    <span className="font-mono font-bold text-slate-900 text-[11px]">{ch.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={handleResetFilters}
              className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
            <span className="text-[10px] text-slate-400 font-mono">Filter Ver: 4.2</span>
          </div>
        </div>
      </div>

      {/* 5. TIME SERIES DAILY TRENDS & DEMOGRAPHICS (Exact from Screenshots 2 & 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* DAILY TREND LINE GRAPHS (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Trend 1: UAN Cards Generated Daily in Last 6 Months (Screenshots 2 & 3) */}
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  UAN cards generated daily in last 6 months
                </h3>
                <p className="text-[11px] text-slate-500">
                  Daily universal account issuance velocity & biometric telemetry
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Peak: 46,100/day
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyUanTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="uanColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0078D4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0078D4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-xl border border-slate-700 space-y-1">
                            <span className="font-bold text-amber-400 block">{label}</span>
                            <div className="flex items-center justify-between gap-4">
                              <span>Daily UAN Cards:</span>
                              <strong className="font-mono text-emerald-400">
                                {Number(payload[0].value).toLocaleString()}
                              </strong>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="uanCards"
                    stroke="#0078D4"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#uanColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Trend 2: Registrations by CSC Centers daily in last 6 months (Screenshot 2 & 3) */}
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
              <div className="flex items-center gap-2">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Registrations by CSC Centers daily in last 6 months
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Common Service Center field camp telemetry
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleOpenCopilot('Why did CSC registrations spike to 12,000 on March 24, 2026?')}
                className="text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2 py-1 rounded flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                Explain 3/24 Spike (12K)
              </button>
            </div>

            <div className="h-40 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyUanTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const val = payload[0].value;
                        return (
                          <div className="bg-white p-2.5 rounded-lg text-xs shadow-xl border border-slate-300 text-slate-900 space-y-1">
                            <span className="font-bold text-blue-900 block">{label}, 2026</span>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-600" />
                              <span>Registration Completed:</span>
                              <strong className="font-mono font-bold text-blue-700">
                                {Number(val).toLocaleString()}
                              </strong>
                            </div>
                            {label === 'Mar 24' && (
                              <p className="text-[10px] text-amber-800 bg-amber-50 p-1 rounded font-medium border border-amber-200">
                                ⚡ AI Note: Special UP & Bihar Gramin Seva Pakhwada
                              </p>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cscRegistrations"
                    stroke="#0078D4"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#0078D4' }}
                    activeDot={{ r: 6, fill: '#E23F82' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* DEMOGRAPHICS BREAKDOWN (lg:col-span-4) (Exact from Screenshots 2 & 3) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Gender Split (Screenshots 2 & 3) */}
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase">
                Gender Demographics
              </h3>
              <span className="text-[10px] font-mono text-slate-500">e-Shram Coverage</span>
            </div>

            {/* Gender Blocks (Exact Blue and Navy blocks from screenshot) */}
            <div className="space-y-2">
              {/* Female Block */}
              <div className="bg-[#0078D4] text-white p-3.5 rounded-lg flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs font-bold uppercase opacity-90 block">Female</span>
                  <span className="text-2xl font-black">54.28%</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold block">17.31 Cr</span>
                  <span className="text-[10px] opacity-80">Maternity Benefit Linked</span>
                </div>
              </div>

              {/* Male Block */}
              <div className="bg-[#002060] text-white p-3.5 rounded-lg flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs font-bold uppercase opacity-90 block">Male</span>
                  <span className="text-2xl font-black">45.72%</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold block">14.59 Cr</span>
                  <span className="text-[10px] opacity-80">Universal Coverage</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenCopilot('Analyze the 54.28% female workforce registration and identify safety and social security gaps')}
              className="w-full mt-3 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              AI Demographic Gender Analysis
            </button>
          </div>

          {/* Age Group Breakdown (Screenshots 2 & 3) */}
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase">
                Age Group Breakdown
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Active Workforce</span>
            </div>

            {/* Treemap-style colored blocks from screenshot */}
            <div className="grid grid-cols-2 gap-2">
              {/* 18-40 yrs (Large light blue block) */}
              <div className="col-span-2 bg-[#0078D4] text-white p-3.5 rounded-lg">
                <span className="text-xs font-bold uppercase opacity-90 block">18–40 yrs (Prime Working Age)</span>
                <span className="text-2xl font-black">55.21%</span>
                <span className="text-[10px] opacity-85 block mt-0.5 font-mono">17.61 Crore Shramiks</span>
              </div>

              {/* 40-50 yrs (Navy block) */}
              <div className="bg-[#002060] text-white p-3 rounded-lg">
                <span className="text-[11px] font-bold opacity-90 block">40–50 yrs</span>
                <span className="text-lg font-black">26.30%</span>
                <span className="text-[10px] opacity-80 block font-mono">8.39 Cr</span>
              </div>

              {/* Above 50 yrs (Orange / Amber block) */}
              <div className="bg-[#D83B01] text-white p-3 rounded-lg">
                <span className="text-[11px] font-bold opacity-90 block">Above 50 yrs</span>
                <span className="text-lg font-black">18.49%</span>
                <span className="text-[10px] opacity-80 block font-mono">5.90 Cr</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. BOTTOM POWERBI FOOTER CONTROLS BAR (Exact replica from Screenshot 1 & 2) */}
      <div className="bg-slate-100 border border-slate-300 rounded-xl px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#F2C811] rounded-xs inline-block" />
            <strong className="text-slate-950 font-bold">Microsoft Power BI</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-500">
            e-Shram National Public Data Hub • MoL&E
          </span>
        </div>

        {/* Zoom & Page Nav controls */}
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomLevel((z) => Math.max(70, z - 5))}
              className="px-1.5 py-0.5 rounded hover:bg-slate-200 font-bold"
            >
              -
            </button>
            <span className="font-mono font-bold text-slate-800">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(130, z + 5))}
              className="px-1.5 py-0.5 rounded hover:bg-slate-200 font-bold"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-1 font-mono font-medium">
            <button
              disabled={activePage === 1}
              onClick={() => setActivePage((p) => p - 1)}
              className="px-1 disabled:opacity-30 hover:bg-slate-200 rounded"
            >
              &lt;
            </button>
            <span>{activePage} of 4</span>
            <button
              disabled={activePage === 4}
              onClick={() => setActivePage((p) => p + 1)}
              className="px-1 disabled:opacity-30 hover:bg-slate-200 rounded"
            >
              &gt;
            </button>
          </div>

          <button
            onClick={() => handleOpenCopilot('Generate comprehensive PDF audit report for national dashboard')}
            className="hover:text-slate-900 flex items-center gap-1 cursor-pointer font-medium"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* 7. FLOATING QUICK AI ASSISTANT TRIGGER BUTTON - INDIAN TRICOLOR STYLED */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => handleOpenCopilot()}
          className="bg-gradient-to-r from-[#E65100] via-[#FF6F00] to-[#F57C00] hover:from-[#BF360C] hover:to-[#E65100] text-white font-extrabold px-4 py-3 rounded-full shadow-2xl flex items-center gap-3 border-2 border-orange-300 ring-4 ring-orange-500/30 hover:scale-105 transition-all cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center font-serif text-sm font-bold shadow-xs">
            सं
          </div>
          <div className="text-left">
            <span className="text-xs font-black block leading-none tracking-tight">
              Ask AI Labour Copilot
            </span>
            <span className="text-[10px] text-amber-100 font-bold leading-tight">
              Labour Codes & e-Shram Analytics
            </span>
          </div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping ml-1" />
        </button>
      </div>

      {/* AI Labour Copilot Modal */}
      <AiLabourCopilotModal
        isOpen={isAiCopilotOpen}
        onClose={() => setIsAiCopilotOpen(false)}
        initialQuery={aiQueryContext}
      />
    </div>
  );
};
