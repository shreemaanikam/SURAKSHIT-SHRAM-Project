import React from 'react';
import { GovLogo } from '../common/GovLogo';
import {
  ShieldCheck,
  ExternalLink,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  FileCheck,
  Lock,
} from 'lucide-react';

import { Language, translateText } from '../../services/languageService';

export interface GovFooterProps {
  currentLanguage?: Language;
}

export const GovFooter: React.FC<GovFooterProps> = ({ currentLanguage = 'en' }) => {
  const tText = (text: string) => translateText(text, currentLanguage);
  return (
    <footer className="mt-auto bg-[#0A192F] text-slate-300 text-xs select-none">
      {/* 1. Indian Tricolor Bar Accent */}
      <div className="h-1.5 w-full flex shadow-xs">
        <div className="h-full w-1/3 bg-gradient-to-r from-orange-600 to-[#FF9933]" />
        <div className="h-full w-1/3 bg-white flex items-center justify-center relative">
          <div className="w-2 h-2 rounded-full border border-blue-900 bg-white" />
        </div>
        <div className="h-full w-1/3 bg-gradient-to-r from-[#138808] to-emerald-600" />
      </div>

      {/* 2. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Col 1: Ministry Info & Emblem */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-lg bg-white/10 border border-amber-500/30">
                <GovLogo size={36} showText={false} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  भारत सरकार | Govt. of India
                </p>
                <h4 className="text-sm font-bold text-white leading-tight">
                  श्रम एवं रोजगार मंत्रालय
                </h4>
                <p className="text-[11px] text-slate-400">
                  Ministry of Labour & Employment
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              Surakshit Shram — Unified Smart Labour Compliance Portal. &ldquo;Help first, punish later.&rdquo;
            </p>
            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>GIGW 3.0 & STQC Level-2 Certified</span>
            </div>
          </div>

          {/* Col 2: Integrated National Labour Portals */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>National Labour Portals</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>
                <a
                  href="https://shramsuvidha.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 flex items-center justify-between transition-colors group"
                >
                  <span>Shram Suvidha Portal (LIN Registry)</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://eshram.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 flex items-center justify-between transition-colors group"
                >
                  <span>e-Shram Universal Social Security</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.epfindia.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 flex items-center justify-between transition-colors group"
                >
                  <span>EPFO Unified Portal (UAN / ECR)</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.esic.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 flex items-center justify-between transition-colors group"
                >
                  <span>ESIC IP & Employer Portal</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ncs.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 flex items-center justify-between transition-colors group"
                >
                  <span>National Career Service (NCS)</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Statutory Labour Codes */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>4 Central Labour Codes</span>
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Code on Wages, 2019 (Act No. 29 of 2019)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>OSH & Working Conditions Code, 2020 (Act 37/2020)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Code on Social Security, 2020 (Act No. 36 of 2020)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>Industrial Relations Code, 2020 (Act No. 35 of 2020)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Helpdesk & Toll-Free Numbers */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>National Helpdesk</span>
            </h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Shramik Toll-Free Helpline
                </span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  14434 / 1800-11-4000
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Available in 12 Regional Indian Languages (24x7)
                </p>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[11px]">helpdesk-surakshitshram@gov.in</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>e-Pramaan Level 3 MFA Protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Official NIC & Ministry Disclaimer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div className="text-center md:text-left space-y-1">
            <p>
              Website content managed by <strong className="text-slate-300">Ministry of Labour & Employment, Government of India</strong>.
            </p>
            <p>
              Designed, developed and hosted by <strong className="text-slate-300">National Informatics Centre (NIC)</strong>, Ministry of Electronics & Information Technology.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono text-slate-400">
            <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800">
              Visitor Count: <strong className="text-amber-400">14,892,410</strong>
            </span>
            <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800">
              Node: <strong className="text-slate-300">NIC-DEL-SEC-04</strong>
            </span>
            <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800">
              Release: <strong className="text-slate-300">v4.2.8-GOV</strong>
            </span>
          </div>
        </div>

        {/* 4. Mandatory Government Policy Hyperlinks */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] text-slate-400">
          <span className="hover:text-slate-300 cursor-pointer">Terms & Conditions</span>
          <span>|</span>
          <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
          <span>|</span>
          <span className="hover:text-slate-300 cursor-pointer">Copyright Policy</span>
          <span>|</span>
          <span className="hover:text-slate-300 cursor-pointer">Hyperlinking Policy</span>
          <span>|</span>
          <span className="hover:text-slate-300 cursor-pointer">Accessibility Statement</span>
          <span>|</span>
          <span className="hover:text-slate-300 cursor-pointer">Screen Reader Access</span>
          <span>|</span>
          <span className="hover:text-slate-300 cursor-pointer">Right to Information (RTI)</span>
        </div>
      </div>
    </footer>
  );
};
