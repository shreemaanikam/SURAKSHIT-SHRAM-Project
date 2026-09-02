import React, { useState } from 'react';
import {
  Bell,
  Search,
  Globe,
  Wifi,
  WifiOff,
  RefreshCw,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Building2,
  Briefcase,
  Landmark,
  User,
  Settings,
  Sparkles,
  Volume2,
  Eye,
  Check,
} from 'lucide-react';
import { LanguageCode, UserProfile, UserRole } from '../../types';

interface NavbarProps {
  currentUser: UserProfile;
  onSwitchRole: (role: UserRole) => void;
  onLogout: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  offlineQueueCount: number;
  onSyncOfflineQueue: () => void;
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onSearch?: (query: string) => void;
  onOpenMobileMenu?: () => void;
  onOpenAiCopilot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchRole,
  onLogout,
  isOffline,
  onToggleOffline,
  offlineQueueCount,
  onSyncOfflineQueue,
  currentLanguage,
  onLanguageChange,
  onSearch,
  onOpenMobileMenu,
  onOpenAiCopilot,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSizeIndex, setFontSizeIndex] = useState(1); // 0: sm, 1: base, 2: lg

  const rolesList: { role: UserRole; label: string; org: string; icon: any }[] = [
    { role: 'company', label: 'Company (Employer)', org: 'Bharat Heavy Forge Ltd.', icon: Building2 },
    { role: 'inspector', label: 'Enforcement Officer (LEO)', org: 'Pune Inspection Circle', icon: Briefcase },
    { role: 'government', label: 'Govt Commissioner (CLC)', org: 'CLC Central Headquarters', icon: Landmark },
    { role: 'worker', label: 'Worker / Shramik', org: 'e-Shram Universal Portal', icon: User },
    { role: 'admin', label: 'System Administrator (NIC)', org: 'National Informatics Centre', icon: Settings },
  ];

  const languages: { code: LanguageCode; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  ];

  const mockNotifications = [
    {
      id: 'notif-1',
      title: 'Predictive Anomaly Flagged',
      message: 'Sudden disparity flagged in ESIC worker contributions (Apex Tech SEZ).',
      time: '12m ago',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Field Inspection Synced',
      message: 'Inspection INSP-MH-PUN-2026-074 digitally recorded on Shram Suvidha.',
      time: '45m ago',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Show Cause Notice Due',
      message: 'ESIC Pehchan card compliance deadline in 3 days for Bharat Heavy Forge.',
      time: '2h ago',
      unread: false,
    },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  const handleFontSizeChange = (direction: 'decrease' | 'reset' | 'increase') => {
    if (direction === 'decrease') setFontSizeIndex(0);
    else if (direction === 'reset') setFontSizeIndex(1);
    else setFontSizeIndex(2);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs select-none">
      {/* 1. Official Tricolor Top Strip (Deep Saffron, Crisp White, India Green) */}
      <div className="h-1.5 w-full flex shadow-xs">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* 2. Top Federal Accessibility & GOI Identity Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Ministry Identification */}
          <div className="flex items-center gap-2 font-medium truncate">
            <span className="text-amber-400 font-bold hidden sm:inline">भारत सरकार</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-200">Government of India</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 hidden md:inline">Ministry of Labour & Employment</span>
            <span className="text-amber-300 text-[10px] hidden lg:inline font-mono">
              (श्रम एवं रोजगार मंत्रालय)
            </span>
          </div>

          {/* Right: Accessibility Controls & Language */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Screen Reader Access link */}
            <button
              type="button"
              className="hidden lg:flex items-center gap-1 hover:text-amber-300 transition-colors"
              title="Screen Reader Access"
            >
              <Volume2 className="w-3 h-3 text-amber-400" />
              <span>Screen Reader</span>
            </button>

            <span className="text-slate-700 hidden lg:inline">|</span>

            {/* Font Sizing Controls (A- / A / A+) */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-mono text-[10px]">
              <button
                type="button"
                onClick={() => handleFontSizeChange('decrease')}
                className={`px-1 rounded hover:text-white ${fontSizeIndex === 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('reset')}
                className={`px-1 rounded hover:text-white ${fontSizeIndex === 1 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
                title="Default Font Size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('increase')}
                className={`px-1 rounded hover:text-white ${fontSizeIndex === 2 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            <span className="text-slate-700 hidden sm:inline">|</span>

            {/* Language Quick Dropdown */}
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-400" />
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="text-[11px] bg-slate-800 border border-slate-700 text-slate-200 py-0.5 px-1.5 rounded focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer font-medium"
                aria-label="Select portal language"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Government Portal Masthead */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Left: Official State Emblem & Portal Title */}
            <div className="flex items-center gap-3 sm:gap-4">
              {onOpenMobileMenu && (
                <button
                  type="button"
                  onClick={onOpenMobileMenu}
                  className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
                  aria-label="Open navigation menu"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}

              <div className="flex items-center gap-3">
                {/* Ashoka Lion / State Emblem Symbol */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-amber-600 to-amber-700 text-white flex flex-col items-center justify-center font-bold shadow-xs border border-amber-500/30 shrink-0">
                  <span className="text-xl font-serif leading-none tracking-tighter">सं</span>
                  <span className="text-[7px] font-mono tracking-widest text-amber-100 uppercase mt-0.5">
                    GOI
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-blue-950 uppercase leading-none">
                      SURAKSHIT <span className="text-amber-600">SHRAM</span>
                    </h1>
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300 tracking-wider">
                      सुरक्षित श्रम
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold leading-tight mt-0.5">
                    Unified Smart Inspection & Labour Code Compliance Portal
                  </p>
                  <p className="text-[10px] text-slate-400 hidden md:block">
                    Office of Chief Labour Commissioner (Central) • Ministry of Labour & Employment
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Government Seals & Status */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-right border-r border-slate-200 pr-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Compliance Framework
                </span>
                <span className="text-xs font-bold text-slate-800">
                  4 Central Labour Codes (2026)
                </span>
              </div>

              <div className="flex items-center gap-2 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <div className="text-left">
                  <span className="text-[9px] uppercase font-bold text-emerald-700 block leading-none">
                    e-Pramaan Auth
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-900 leading-none">
                    Level-3 Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Sub-Navigation / Operational Toolbar */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 gap-3">
            {/* Left: Role Context Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-400">Official Portal</span>
              <span className="text-slate-300">/</span>
              <span className="text-blue-900 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="capitalize">
                  {currentUser.role === 'company' && 'Employer Self-Audit Portal (Bharat Heavy Forge Ltd.)'}
                  {currentUser.role === 'inspector' && 'Labour Enforcement Officer Console (Pune Circle)'}
                  {currentUser.role === 'government' && 'Central Directorate & Predictive Radar (CLC HQ)'}
                  {currentUser.role === 'worker' && 'Shramik Sewa Kendra & e-Shram Grievances'}
                  {currentUser.role === 'admin' && 'Central Master Administration & RBAC'}
                </span>
              </span>
            </div>

            {/* Right: Quick Tools (Search, Offline Sync, Switch Role, User) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Global Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-48 lg:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search LIN, Notice #, Case..."
                  className="w-full pl-7 pr-3 py-1 text-xs bg-white border border-slate-300 rounded-md text-slate-800 focus:ring-1 focus:ring-blue-600 focus:outline-none placeholder:text-slate-400 transition-all shadow-2xs"
                />
                <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" />
              </form>

              {/* Offline Mode for Inspector */}
              {currentUser.role === 'inspector' && (
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={onToggleOffline}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
                      isOffline
                        ? 'bg-rose-50 border-rose-300 text-rose-800 animate-pulse'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    }`}
                    title={isOffline ? 'Working in Offline Mode' : 'Online & Connected to Shram Suvidha'}
                  >
                    {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
                    <span className="hidden sm:inline">{isOffline ? 'Offline' : 'Live Sync'}</span>
                  </button>

                  {offlineQueueCount > 0 && (
                    <button
                      type="button"
                      onClick={onSyncOfflineQueue}
                      className="ml-1.5 p-1 rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-xs"
                      title={`Sync ${offlineQueueCount} queued records`}
                    >
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    </button>
                  )}
                </div>
              )}

              {/* Direct e-Shram National Graphs Button */}
              <button
                type="button"
                onClick={() => onSwitchRole('government')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black shadow-sm transition-all cursor-pointer border ${
                  currentUser.role === 'government'
                    ? 'bg-gradient-to-r from-blue-900 to-[#002060] text-white border-blue-700 ring-2 ring-orange-400'
                    : 'bg-blue-50 text-blue-950 border-blue-300 hover:bg-blue-100 hover:border-blue-400'
                }`}
                title="View Official e-Shram Power BI National Dashboard with all bar charts & graphs"
              >
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                <span>📊 e-Shram Graphs</span>
              </button>

              {/* Login / e-Pramaan Gateway Button */}
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-xs transition-all cursor-pointer"
                title="Open e-Pramaan Single Sign-On Government Login Portal"
              >
                <Lock className="w-3.5 h-3.5 text-orange-600" />
                <span>🔐 Login Portal</span>
              </button>

              {/* AI Shramik Copilot Button */}
              {onOpenAiCopilot && (
                <button
                  type="button"
                  onClick={onOpenAiCopilot}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-sm transition-all cursor-pointer border border-orange-400/50"
                  title="Open AI Labour Intelligence Copilot"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                  <span className="hidden sm:inline">Ask AI</span>
                </button>
              )}

              {/* Role Demo Quick-Switcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoleMenu(!showRoleMenu)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-900 text-white hover:bg-blue-950 transition-colors shadow-2xs"
                >
                  <span className="capitalize">{currentUser.role} View</span>
                  <ChevronDown className="w-3 h-3 text-blue-200" />
                </button>

                {showRoleMenu && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowRoleMenu(false)} />
                    <div className="absolute right-0 mt-1.5 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Government Portal Persona
                      </div>
                      {rolesList.map((r) => {
                        const Icon = r.icon;
                        const isCurrent = currentUser.role === r.role;
                        return (
                          <button
                            key={r.role}
                            onClick={() => {
                              onSwitchRole(r.role);
                              setShowRoleMenu(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 transition-colors ${
                              isCurrent
                                ? 'bg-amber-50 text-amber-950 font-bold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className={`w-4 h-4 ${isCurrent ? 'text-amber-600' : 'text-slate-400'}`} />
                            <div className="flex-1 min-w-0">
                              <p className="truncate font-semibold">{r.label}</p>
                              <p className="text-[10px] text-slate-400 truncate">{r.org}</p>
                            </div>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-amber-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-1.5 rounded-md text-slate-600 hover:bg-slate-200 focus:outline-none transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
                </button>

                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowNotifications(false)} />
                    <div className="absolute right-0 mt-1.5 w-80 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-30">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">National Dispatch Alerts</span>
                        <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                          2 Unread
                        </span>
                      </div>
                      <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                        {mockNotifications.map((notif) => (
                          <div key={notif.id} className="p-3 hover:bg-slate-50 text-xs transition-colors">
                            <div className="flex items-center justify-between">
                              <h5 className="font-semibold text-slate-900">{notif.title}</h5>
                              <span className="text-[10px] text-slate-400">{notif.time}</span>
                            </div>
                            <p className="text-slate-600 mt-0.5 text-[11px] leading-snug">{notif.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 p-1 rounded-md hover:bg-slate-200 focus:outline-none transition-colors"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-300"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-[11px] font-bold text-slate-900 leading-none">{currentUser.name}</p>
                  </div>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-white border border-slate-200 shadow-xl p-3 z-30 space-y-2">
                      <div className="border-b border-slate-100 pb-2">
                        <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                        {currentUser.maskedAadhaar && (
                          <p className="text-[10px] font-mono text-slate-400 mt-1">
                            Aadhaar: {currentUser.maskedAadhaar}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out / e-Pramaan Disconnect
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

