import React, { useState } from 'react';
import {
  Building2,
  Briefcase,
  Landmark,
  User,
  Settings,
  ArrowRight,
  Lock,
  Info,
  ShieldCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { UserRole } from '../../types';
import { DEMO_USERS } from '../../data/mockData';
import { Button } from '../../components/ui/Button';

interface LoginViewProps {
  onLoginAsRole: (role: UserRole) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginAsRole }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('company');

  const roleOptions: {
    role: UserRole;
    title: string;
    description: string;
    icon: any;
    demoUser: any;
    badge: string;
    govIdentifier: string;
  }[] = [
    {
      role: 'company',
      title: 'Establishment / Principal Employer',
      description: 'Self-audit compliance score, OCR payroll register ingest, e-filing replies to show cause notices.',
      icon: Building2,
      demoUser: DEMO_USERS.company,
      badge: 'Employer LIN Portal',
      govIdentifier: 'LIN: 1984209412 • EPFO: MH/BAN/0049210',
    },
    {
      role: 'inspector',
      title: 'Labour Enforcement Officer (LEO)',
      description: 'Mobile-first field inspection checklist, geo-tagged photo evidence, offline sync queue.',
      icon: Briefcase,
      demoUser: DEMO_USERS.inspector,
      badge: 'Field Enforcement Grid',
      govIdentifier: 'Officer Code: LEO-MH-PUN-084',
    },
    {
      role: 'government',
      title: 'Chief Labour Commissioner / State Directorate',
      description: 'National to establishment drill-down, AI predictive contagion alerts, sectoral analytics.',
      icon: Landmark,
      demoUser: DEMO_USERS.government,
      badge: 'Central Command & Radar',
      govIdentifier: 'CLC Directorate HQ (New Delhi)',
    },
    {
      role: 'worker',
      title: 'Protected Worker / Shramik',
      description: 'Wage & overtime dispute filing, anonymous grievance redressal, live SMS tracking.',
      icon: User,
      demoUser: DEMO_USERS.worker,
      badge: 'e-Shram Grievance Cell',
      govIdentifier: 'UAN / e-Shram: XXXX XXXX 4821',
    },
    {
      role: 'admin',
      title: 'National Informatics Centre (NIC) Admin',
      description: 'Role-Based Access Control (RBAC), security audit logs, Shram Suvidha API gateway health.',
      icon: Settings,
      demoUser: DEMO_USERS.admin,
      badge: 'NIC Core Security Console',
      govIdentifier: 'NIC SecOps Auth Level-4',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans text-slate-900 selection:bg-amber-500 selection:text-slate-950">
      {/* 1. Tricolor Bar */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]" />
        <div className="h-full w-1/3 bg-white" />
        <div className="h-full w-1/3 bg-[#138808]" />
      </div>

      {/* 2. Top Federal Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-amber-400 font-bold">भारत सरकार</span>
            <span className="text-slate-600">|</span>
            <span className="text-white">Government of India</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Ministry of Labour & Employment (श्रम एवं रोजगार मंत्रालय)</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
            <span>Shram Suvidha Gateway v4.2</span>
            <span className="text-emerald-400 font-bold">● SSL SECURE</span>
          </div>
        </div>
      </div>

      {/* 3. Main Login Container */}
      <div className="flex-1 max-w-6xl mx-auto px-4 py-8 sm:py-12 flex flex-col justify-center w-full">
        {/* Government Branding Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white font-serif font-bold text-2xl mb-3 shadow-lg border-2 border-orange-300 ring-4 ring-orange-500/20">
            सं
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
              SURAKSHIT <span className="text-orange-600">SHRAM</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-orange-100 text-orange-950 border border-orange-300 shadow-2xs">
              सुरक्षित श्रम ई-प्रमाण पोर्टल
            </span>
          </div>
          <p className="text-sm font-bold text-slate-800 mt-1">
            Unified Smart Inspection & Labour Code Compliance Portal (e-Pramaan Single Sign-On)
          </p>
          <p className="text-xs text-slate-600 mt-0.5">
            Office of Chief Labour Commissioner (Central) • Ministry of Labour & Employment, Govt. of India
          </p>
        </div>

        {/* Gazette Codes Highlight Banner */}
        <div className="mb-6 bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 border-2 border-orange-300/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-orange-700 shrink-0" />
            <span className="text-slate-900 font-medium">
              Statutory compliance under <strong>Code on Wages, 2019</strong>, <strong>OSH Code, 2020</strong>, <strong>Social Security Code, 2020</strong>, and <strong>IR Code, 2020</strong>.
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-blue-900 shrink-0 font-extrabold bg-white px-3 py-1 rounded-lg border border-blue-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>e-Pramaan SSO Authenticated (Level-4)</span>
          </div>
        </div>

        {/* e-Pramaan Single Sign-On Interface Box */}
        <div className="bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 mb-6 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Select User Authority & Role (Demonstration Mode)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-mono">
                  PROD-SIM
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose an official profile to preview specialized inspection, audit, and grievance workflows.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Aadhaar e-KYC Linked</span>
            </div>
          </div>

          {/* Role Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {roleOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedRole === opt.role;

              return (
                <div
                  key={opt.role}
                  onClick={() => setSelectedRole(opt.role)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left relative ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/60 shadow-md ring-2 ring-orange-400/30'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-orange-600 animate-ping" />
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected
                            ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xs'
                            : 'bg-white text-slate-700 border border-slate-200'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isSelected
                            ? 'bg-orange-200 text-orange-950 font-black'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {opt.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {opt.title}
                    </h3>
                    <p className="text-xs mt-1.5 leading-relaxed text-slate-600">
                      {opt.description}
                    </p>
                  </div>

                  <div className={`mt-4 pt-3 border-t text-xs ${isSelected ? 'border-orange-200' : 'border-slate-200'}`}>
                    <p className="font-bold text-slate-900">
                      {opt.demoUser.name}
                    </p>
                    <p className="text-[10px] text-blue-900 font-mono font-bold truncate mt-0.5">
                      {opt.govIdentifier}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Launch / Proceed Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 bg-slate-50/50 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-orange-600 shrink-0" />
              <span>
                Demonstrates authentic inspection workflows, offline field caching, OCR validation, and AI risk radar.
              </span>
            </div>

            <Button
              size="lg"
              onClick={() => onLoginAsRole(selectedRole)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto font-black bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg border border-orange-400/40"
            >
              Sign In with e-Pramaan as {selectedRole.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>

      {/* 4. Official Government Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 px-4 border-t-2 border-amber-600 text-xs text-center space-y-2">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-[11px]">
          <p>
            Website content managed by <strong className="text-white">Ministry of Labour & Employment, Government of India</strong>.
          </p>
          <p>
            Designed, developed and hosted by <strong className="text-white">National Informatics Centre (NIC)</strong>.
          </p>
        </div>
        <p className="text-[10px] text-slate-500">
          Toll-Free National Shramik Helpline: 14434 / 1800-11-4000 • e-Pramaan Single Sign-On Protected
        </p>
      </footer>
    </div>
  );
};
