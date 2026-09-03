import React, { useState } from 'react';
import { 
  Building2, 
  Landmark, 
  Bike, 
  Store, 
  MessageSquareWarning,
  Sparkles,
  ChevronDown,
  Smartphone,
  Globe,
  Check,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { GovLogo } from '../common/GovLogo';
import { Language, translations } from '../../services/languageService';

export type ActiveSection = 'companies' | 'inspector' | 'government' | 'gigworkers' | 'smallbiz' | 'complaints';

export type UserRole = 'company' | 'inspector' | 'government' | 'worker' | 'admin';

export interface RoleUser {
  role: UserRole;
  name: string;
  badge: string;
  designation: string;
  permission: string;
}

export const ROLE_USERS: Record<UserRole, RoleUser> = {
  company: {
    role: 'company',
    name: 'ABC Manufacturing Ltd',
    badge: 'LIN: 2024-0789',
    designation: 'Employer / Compliance Officer',
    permission: 'Self-Audit, Upload Documents, Notice 30-Day Response',
  },
  inspector: {
    role: 'inspector',
    name: 'Rajesh Verma',
    badge: 'Code: LEO-MH-PUN-084',
    designation: 'Labour Enforcement Officer (LEO)',
    permission: 'On-Site Field Audit, Geotag Evidence, 48-Hr Report Filing',
  },
  government: {
    role: 'government',
    name: 'Dr. Arvind Sharma',
    badge: 'CLC Directorate (HQ)',
    designation: 'Chief Labour Commissioner',
    permission: 'Sectoral Compliance Radar, State Reports, AI Dispute Alerts',
  },
  worker: {
    role: 'worker',
    name: 'Sunil Kumar',
    badge: 'UAN: 1009-8472-1102',
    designation: 'Gig Delivery Partner / Worker',
    permission: 'e-Shram Grievance Redressal, Social Security Fund Access',
  },
  admin: {
    role: 'admin',
    name: 'Vikram Joshi',
    badge: 'NIC Level-4 SecOps',
    designation: 'NIC Security & Gateway Admin',
    permission: 'Full RBAC Config, Shram Suvidha API Gateway, System Logs',
  },
};

interface SurakshitHeaderProps {
  activeSection: ActiveSection;
  onSelectSection: (section: ActiveSection) => void;
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  currentUserRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const languages: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

export const SurakshitHeader: React.FC<SurakshitHeaderProps> = ({
  activeSection,
  onSelectSection,
  currentLanguage,
  onLanguageChange,
  currentUserRole,
  onRoleChange,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const t = (key: string) => {
    return translations[key]?.[currentLanguage] || translations[key]?.['en'] || key;
  };

  const navTabs = [
    { id: 'companies' as ActiveSection, label: t('tabCompanies'), icon: Building2 },
    { id: 'inspector' as ActiveSection, label: t('tabInspector'), icon: Smartphone, highlight: true },
    { id: 'government' as ActiveSection, label: t('tabGovernment'), icon: Landmark },
    { id: 'gigworkers' as ActiveSection, label: t('tabGigWorkers'), icon: Bike },
    { id: 'smallbiz' as ActiveSection, label: t('tabSmallBiz'), icon: Store },
    { id: 'complaints' as ActiveSection, label: t('tabComplaints'), icon: MessageSquareWarning },
  ];

  const currentLangObj = languages.find((l) => l.code === currentLanguage) || languages[0];
  const activeUser = ROLE_USERS[currentUserRole];

  return (
    <header className="bg-gradient-to-r from-amber-50/70 via-white to-emerald-50/70 border-b border-slate-200 shadow-xs relative">
      {/* 1. Indian Tricolor Accent Line */}
      <div className="h-1.5 w-full flex shadow-xs">
        <div className="h-full w-1/3 bg-[#FF9933] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-[#FF9933]" />
        </div>
        <div className="h-full w-1/3 bg-white flex items-center justify-center relative">
          <div className="w-2.5 h-2.5 rounded-full border border-blue-900 flex items-center justify-center bg-white shadow-2xs z-10">
            <div className="w-1 h-1 rounded-full bg-blue-900" />
          </div>
        </div>
        <div className="h-full w-1/3 bg-[#138808] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#138808] to-emerald-600" />
        </div>
      </div>

      {/* 2. Top Header Branding Container - Fully Responsive across split screen & mobile */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        {/* Left: Official Government of India Logo */}
        <div className="flex items-center shrink-0">
          <GovLogo size={36} showText={true} />
        </div>

        {/* Center: Surakshit Shram Brand */}
        <div className="text-center flex-1 min-w-[200px] max-w-md mx-auto">
          {/* Smart Labour Compliance Pill */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-50 via-white to-emerald-50 border border-amber-300/80 text-blue-950 text-[9px] font-extrabold uppercase tracking-wider mb-0.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-pulse" />
            <span className="bg-gradient-to-r from-orange-700 via-blue-950 to-emerald-800 bg-clip-text text-transparent font-black tracking-wide">
              SMART LABOUR COMPLIANCE PORTAL
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#138808] animate-pulse" />
          </div>

          {/* Main Title: Saffron Surakshit + Ashoka Navy Shram */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight font-serif flex items-center justify-center gap-1 leading-none py-0.5">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
              {currentLanguage === 'en' ? 'Surakshit' : t('portalTitle').split(' ')[0]}
            </span>
            <span className="text-[#0A192F]">
              {currentLanguage === 'en' ? 'Shram' : t('portalTitle').split(' ').slice(1).join(' ') || ''}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-sans font-bold uppercase tracking-wider ml-1">
              GOI
            </span>
          </h1>

          {/* Subtitle & Motto */}
          <p className="text-[11px] text-slate-700 font-medium flex items-center justify-center flex-wrap gap-1 pt-0.5">
            <span className="italic font-serif text-slate-600 font-semibold">&ldquo;{t('motto')}&rdquo;</span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="hidden md:inline-flex items-center gap-1 font-bold text-[11px]">
              <span className="text-[#E65100]">Fair</span>
              <span className="text-blue-900 font-extrabold">•</span>
              <span className="text-blue-900">Transparent</span>
              <span className="text-emerald-700 font-extrabold">•</span>
              <span className="text-[#138808]">Inclusive</span>
            </span>
          </p>
        </div>

        {/* Right: Role Switcher & AI Bhashini Language */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Active User Role Chip */}
          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-amber-50/50 border border-amber-300/80 rounded-xl text-left transition-all shadow-2xs group hover:border-orange-400"
            title="Switch User Role / Authentication"
          >
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-orange-500 via-blue-900 to-emerald-600 text-white flex items-center justify-center font-black text-[9px] shadow-2xs">
              {currentUserRole === 'company'
                ? 'CO'
                : currentUserRole === 'inspector'
                ? 'LEO'
                : currentUserRole === 'government'
                ? 'GOV'
                : currentUserRole === 'worker'
                ? 'WR'
                : 'ADM'}
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] text-orange-700 font-black uppercase tracking-wider leading-none">
                LOGGED IN AS
              </span>
              <span className="text-[11px] font-bold text-slate-900 leading-tight group-hover:text-blue-900">
                {activeUser.name.split(' ')[0]} ({currentUserRole.toUpperCase()})
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-orange-600 ml-0.5 group-hover:translate-y-0.5 transition-transform" />
          </button>

          {/* AI Bhashini Translate Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-emerald-50/50 border border-emerald-300/80 rounded-xl text-xs font-bold text-slate-800 shadow-2xs transition-all hover:border-emerald-500 group"
              title="Bhashini AI Real-time Neural Translation"
            >
              <Globe className="w-3.5 h-3.5 text-blue-800 group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-black text-slate-900">{currentLangObj.native}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setIsLangOpen(false)} />
                <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 animate-fadeIn">
                  <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-emerald-50">
                    <span className="text-[10px] font-extrabold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      AI Bhashini Indian Languages
                    </span>
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          onLanguageChange(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-amber-50/70 transition-colors ${
                          currentLanguage === lang.code
                            ? 'text-orange-900 bg-orange-50/80 font-bold'
                            : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-gradient-to-br from-orange-400 to-emerald-500" />
                          <span>{lang.native}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({lang.label})</span>
                        </div>
                        {currentLanguage === lang.code && (
                          <Check className="w-3.5 h-3.5 text-orange-600 stroke-[3]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. Sleek Sticky Navigation Bar — Sticks cleanly at top-0 when scrolling without covering page content */}
      <nav className="bg-[#0A192F] text-white border-t-2 border-[#FF9933] border-b-2 border-[#138808] shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 flex items-center justify-between overflow-x-auto scrollbar-none py-1">
          <div className="flex items-center gap-1 sm:gap-2 py-0.5">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectSection(tab.id)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF9933] via-orange-500 to-[#E65100] text-white shadow-md ring-1 ring-orange-300/50'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  } ${tab.highlight && !isActive ? 'border border-amber-400/50 bg-amber-950/30 text-amber-300' : ''}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : tab.highlight ? 'text-amber-400' : 'text-amber-200/70'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 shrink-0">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#138808] animate-pulse" />
            </span>
            <span className="font-semibold text-white">National Labour Gateway • Live</span>
          </div>
        </div>
      </nav>

      {/* 4. Role Authentication Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">
                    User Authentication & Role Management
                  </h3>
                  <p className="text-xs text-slate-400">
                    Switch between roles to test authorized portals & permissions
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              {(Object.keys(ROLE_USERS) as UserRole[]).map((r) => {
                const user = ROLE_USERS[r];
                const isCurrent = currentUserRole === r;
                return (
                  <div
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      if (r === 'company') onSelectSection('companies');
                      if (r === 'inspector') onSelectSection('inspector');
                      if (r === 'government') onSelectSection('government');
                      if (r === 'worker') onSelectSection('complaints');
                      setIsRoleModalOpen(false);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          {user.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                          {user.badge}
                        </span>
                      </div>
                      <p className="text-xs text-blue-900 font-semibold">{user.designation}</p>
                      <p className="text-[11px] text-slate-500">
                        <strong>Permissions:</strong> {user.permission}
                      </p>
                    </div>

                    <button
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1 ${
                        isCurrent
                          ? 'bg-blue-900 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      {isCurrent ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      <span>{isCurrent ? 'Active' : 'Login'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
              Secured with DigiLocker / Aadhaar XML e-KYC & NIC SSO
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
