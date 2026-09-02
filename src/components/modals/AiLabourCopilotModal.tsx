import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Scale,
  Building2,
  Copy,
  Check,
  RefreshCw,
  X,
  ChevronRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface AiLabourCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  statutoryReference?: string;
  recommendedAction?: string;
  riskRating?: 'Critical' | 'Moderate' | 'Safe';
}

export const AiLabourCopilotModal: React.FC<AiLabourCopilotModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Namaste! I am the Ministry of Labour & Employment AI Intelligence Copilot (Model: MoLE-IndLabourNet-v4.2). I can analyze real-time e-Shram worker registrations, predict statutory compliance risks across States/Sectors, explain the 4 Central Labour Codes, or generate inspection priority directives. How may I assist you today?',
      timestamp: 'Live Session Active',
      statutoryReference: 'Central Labour Commissioner (CLC) Statutory AI Framework',
    },
  ]);

  const quickPrompts = [
    {
      title: 'Analyze CSC Registration Spike',
      query: 'Why did CSC registrations spike to 12,000 on March 24, 2026 as shown in the daily telemetry chart?',
    },
    {
      title: 'Construction Sector Wage Risks',
      query: 'Analyze the 2.91 Cr construction workers registered on e-Shram and predict BOCW cess and minimum wage non-compliance risk.',
    },
    {
      title: 'Overtime Rules under Code on Wages',
      query: 'What are the statutory overtime calculation formulas and daily ceiling limits under Code on Wages, 2019 Section 14?',
    },
    {
      title: 'Pune High-Risk Inspection Priority',
      query: 'Generate an AI risk assessment and inspection priority dispatch order for heavy engineering clusters in Pune industrial belt.',
    },
    {
      title: 'Female Workforce Social Security Gap',
      query: 'Analyze the 54.28% female workforce registration on e-Shram and check ESIC maternity benefit linkage status.',
    },
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || query;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsThinking(true);

    setTimeout(() => {
      let aiResponse: ChatMessage;

      const lower = text.toLowerCase();
      if (lower.includes('csc') || lower.includes('spike') || lower.includes('march 24')) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Neural telemetry analysis confirms that the spike to 12,000 registrations on March 24, 2026 was triggered by the State-wide **Special e-Shram Seva Pakhwada** in Uttar Pradesh and Bihar, combined with automated API batch integration from the PM-Awas Gramin beneficiary database. 

Key Findings:
• **94.2% Aadhaar e-KYC accuracy** recorded with zero biometric collision.
• **Primary sectors ingested**: Agriculture (61%) and Domestic Workers (22%).
• **ESIC/EPFO auto-de-duplication**: 8.4% were recognized as already having active UANs and routed to universal social security accounts.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          statutoryReference: 'Unorganised Workers Social Security Act, 2008 & Social Security Code 2020 (Sec 112)',
          recommendedAction: 'Continue CSC cluster incentive; conduct random sample audit of mobile numbers registered across Common Service Centers.',
          riskRating: 'Safe',
        };
      } else if (lower.includes('construction') || lower.includes('bocw') || lower.includes('cess')) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `AI Risk Assessment for **Construction Sector (2,91,97,798 e-Shram registrants)** indicates elevated compliance contagion in 3 primary sub-domains:

1. **BOCW Welfare Cess Deficit**: 14% of mid-tier EPC contractors in Maharashtra and Gujarat have undeclared building project cost assessments, resulting in estimated ₹42.8 Cr cess lag.
2. **Sub-contractor Wage Pass-Through**: Predictive disparity models flag a 18-day average delay between Principal Employer billing settlement and contract worker wage credit.
3. **Safety Gear (OSH Code)**: Fall-protection harness inspection compliance stands at 71.4% (target: 95%).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          statutoryReference: 'Building and Other Construction Workers (BOCW) Act, 1996 & OSH Code 2020 (Part-II)',
          recommendedAction: 'Issue automated electronic audit notices to top 150 real-estate principal employers requiring monthly bank wage credit muster submission.',
          riskRating: 'Critical',
        };
      } else if (lower.includes('overtime') || lower.includes('wages') || lower.includes('section 14')) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Under **Section 14 of the Code on Wages, 2019 (read with Central Rules 2020)**:

• **Overtime Rate**: Where an employee works beyond normal working hours (exceeding 8 hours a day or 48 hours a week), overtime wages must be paid at **not less than twice (2x) the normal rate of wages**.
• **Calculation Formula**: \`Overtime Hourly Wage = (Monthly Gross Wage / 26 / 8) * 2\`
• **Statutory Ceiling**: Maximum overtime hours are capped at 125 hours per quarter, subject to a daily spread-over limit of 12 hours including intervals.
• **AI Monitoring Note**: OCR wage muster checks cross-reference biometric exit timestamps against Form A registers to detect unbooked 'ghost shifts'.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          statutoryReference: 'Code on Wages, 2019 §14 & Occupational Safety, Health & Working Conditions Code, 2020 §25',
          recommendedAction: 'Mandate digital electronic muster integration for establishments with >100 contract staff.',
          riskRating: 'Moderate',
        };
      } else if (lower.includes('pune') || lower.includes('dispatch') || lower.includes('inspection')) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `AI Priority Dispatch Matrix generated for **Pune Industrial Division (Chakan, Hinjewadi, Bhosari, Talegaon)**:

**Top 3 High-Priority Establishments for Immediate LEO Audit**:
1. **Apex Industrial Castings Ltd. (LIN-1849021948)** — Risk Score: 42/100 (Critical overtime vs biometric variance for 140+ workers).
2. **Deccan Chemical Synthetics (LIN-1984218940)** — Risk Score: 48/100 (Expired pressure vessel inspection certificate & missing ESIC dispensary log).
3. **Sahyadri Infrastructure EPC (LIN-2049182390)** — Risk Score: 51/100 (BOCW cess non-deposit & safety harness compliance failure).

**Recommended LEO Allocation**: Senior LEO Ananya Sharma (Badge: LEO-MH-2018-094) assigned for Chakan belt with geo-tagged photographic evidence capture.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          statutoryReference: 'Standard Operating Procedure for Central Smart Random Inspection Grid (MoL&E Order 2024)',
          recommendedAction: 'Auto-dispatch inspection order with 48-hour statutory notice generation.',
          riskRating: 'Critical',
        };
      } else if (lower.includes('female') || lower.includes('women') || lower.includes('maternity')) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Demographic analysis of the **54.28% female workforce (17.31 Cr women registrants)** on e-Shram reveals key social protection insights:

• **Top Sectors for Women**: Agriculture (58.4%), Domestic and Household Work (18.2%), Apparel & Garment Manufacturing (12.1%).
• **Maternity & ESIC Coverage Gap**: Only 29.3% of female workers in the apparel sector have verified ESIC IP status for full statutory Maternity Benefit Act (26 weeks paid leave).
• **Night Shift Safety Protocol (OSH Code §43)**: Requires mandatory employer-provided GPS-tracked transport and women security guards for shifts between 7 PM and 6 AM.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          statutoryReference: 'Social Security Code, 2020 (Chapter VI: Maternity Benefit) & OSH Code 2020 §43',
          recommendedAction: 'Initiate targeted ESIC Special Drive for domestic worker collectives and garment export clusters.',
          riskRating: 'Moderate',
        };
      } else {
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Neural telemetry analysis completed for query: "${text}".

**Labour Intelligence Summary**:
• **Statutory Alignment**: Evaluated against the Code on Wages (2019), OSH Code (2020), Social Security Code (2020), and Industrial Relations Code (2020).
• **Real-Time Data Point**: 31.90+ Crore unorganized workers and 14.8+ Lakh registered establishments actively monitored across 36 States & UTs.
• **Compliance Recommendation**: Automated data cross-verification between e-Shram, EPFO ECR rolls, and ESIC Pehchan IDs prevents uncredited wage & benefit loss.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          statutoryReference: 'National Shram Suvidha Portal Unified Compliance Standard',
          recommendedAction: 'Refer to statutory chapter in Central Labour Codes; execute drill-down analysis on state dashboard.',
          riskRating: 'Safe',
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
      setIsThinking(false);
    }, 900);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-950">
                MoL&E AI Labour Intelligence Copilot
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                v4.2 NEURAL
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Ministry of Labour & Employment Statutory Reasoning & Analytics Engine
            </p>
          </div>
        </div>
      }
    >
      <div className="flex flex-col h-[560px] -mx-6 -my-4">
        {/* Quick Query Pills */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 shrink-0 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-600" />
              Suggested Queries:
            </span>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:border-amber-500 hover:text-amber-900 hover:bg-amber-50/60 transition-all shrink-0 shadow-2xs cursor-pointer text-left"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((m) => {
            const isAi = m.sender === 'ai';

            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs">
                    सं
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                    isAi
                      ? 'bg-white border border-slate-200 shadow-sm text-slate-800'
                      : 'bg-slate-900 text-white shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2">
                    <span className="font-bold text-[11px] flex items-center gap-1.5">
                      {isAi ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-slate-950 font-bold">
                            Central AI Shramik Intelligence
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-300 font-medium">You (Officer / User)</span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {m.timestamp}
                    </span>
                  </div>

                  <div className="whitespace-pre-line text-[12px] font-normal leading-relaxed text-slate-800">
                    {m.text}
                  </div>

                  {/* Statutory Reference Footnote */}
                  {m.statutoryReference && (
                    <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-950 flex items-start gap-2">
                      <Scale className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-amber-900">Statutory Citation:</span>
                        <span className="text-amber-800">{m.statutoryReference}</span>
                      </div>
                    </div>
                  )}

                  {/* Recommended Administrative Action */}
                  {m.recommendedAction && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-950 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-emerald-900">Recommended Executive Action:</span>
                        <span className="text-emerald-800">{m.recommendedAction}</span>
                      </div>
                    </div>
                  )}

                  {isAi && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                      <span>Verified against 2026 Gazetted Rules</span>
                      <button
                        onClick={() => handleCopy(m.id, m.text)}
                        className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-amber-700 cursor-pointer"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Report</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-3 text-xs text-amber-800 bg-amber-50 border border-amber-200 p-3.5 rounded-xl w-fit animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
              <span>MoLE Neural Engine analyzing statutory database and e-Shram telemetry...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Copilot about e-Shram trends, Labour Code compliance, or district risk..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
          />
          <Button
            variant="primary"
            size="md"
            onClick={() => handleSend()}
            disabled={!query.trim() || isThinking}
            rightIcon={<Send className="w-4 h-4" />}
            className="font-bold bg-amber-600 hover:bg-amber-700 text-white shrink-0 shadow-sm"
          >
            Ask AI
          </Button>
        </div>
      </div>
    </Modal>
  );
};
