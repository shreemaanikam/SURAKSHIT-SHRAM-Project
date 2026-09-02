import React from 'react';
import {
  LayoutDashboard,
  FileText,
  AlertOctagon,
  ClipboardCheck,
  TrendingUp,
  FileSpreadsheet,
  Users,
  ShieldAlert,
  HelpCircle,
  FolderGit2,
  Building,
  HeartHandshake,
  Server,
  Activity,
  Layers,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  currentRole: UserRole;
  currentPath: string;
  onNavigate: (path: string) => void;
  openNoticesCount?: number;
  openInspectionsCount?: number;
  alertsCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onSwitchRole?: (role: UserRole) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentPath,
  onNavigate,
  openNoticesCount = 0,
  openInspectionsCount = 0,
  alertsCount = 0,
  isMobileOpen = false,
  onCloseMobile,
  onSwitchRole,
  onLogout,
}) => {
  // Navigation definitions based on role
  const getNavItems = (role: UserRole) => {
    switch (role) {
      case 'company':
        return [
          {
            section: 'Main Menu',
            items: [
              {
                path: '/company/dashboard',
                label: 'Dashboard',
                icon: LayoutDashboard,
              },
              {
                path: '/company/documents',
                label: 'Establishments & OCR',
                icon: FileText,
              },
              {
                path: '/company/notices',
                label: 'Notices & Show Cause',
                icon: AlertOctagon,
                badge: openNoticesCount > 0 ? openNoticesCount : undefined,
                badgeVariant: 'danger' as const,
              },
              {
                path: '/company/inspections',
                label: 'Inspection History',
                icon: ClipboardCheck,
              },
            ],
          },
        ];

      case 'inspector':
        return [
          {
            section: 'Inspector Menu',
            items: [
              {
                path: '/inspector/dashboard',
                label: 'Inspection Hub',
                icon: LayoutDashboard,
              },
              {
                path: '/inspector/inspections',
                label: 'Assigned Audits',
                icon: ClipboardCheck,
                badge: openInspectionsCount > 0 ? openInspectionsCount : undefined,
                badgeVariant: 'warning' as const,
              },
              {
                path: '/inspector/inspection/insp-01',
                label: 'Field Audit Workflow',
                icon: Layers,
                highlight: true,
              },
            ],
          },
        ];

      case 'government':
        return [
          {
            section: 'Main Menu',
            items: [
              {
                path: '/government/dashboard',
                label: 'National Dashboard',
                icon: LayoutDashboard,
              },
              {
                path: '/government/alerts',
                label: 'AI Predictive Alerts',
                icon: Sparkles,
                badge: alertsCount > 0 ? `${alertsCount} New` : undefined,
                badgeVariant: 'purple' as const,
              },
            ],
          },
        ];

      case 'worker':
        return [
          {
            section: 'Worker Portal',
            items: [
              {
                path: '/worker/grievances',
                label: 'Grievances & Wage Claims',
                icon: HeartHandshake,
              },
            ],
          },
        ];

      case 'admin':
        return [
          {
            section: 'System Console',
            items: [
              {
                path: '/admin/dashboard',
                label: 'RBAC & Audit Matrix',
                icon: Server,
              },
            ],
          },
        ];

      default:
        return [];
    }
  };

  const navSections = getNavItems(currentRole);

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'company':
        return 'Employer Rep';
      case 'inspector':
        return 'Enforcement Officer';
      case 'government':
        return 'Gov Official';
      case 'worker':
        return 'Worker (Shramik)';
      case 'admin':
        return 'System Admin';
      default:
        return role;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-slate-800 w-64 border-r border-slate-200 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-100">
        <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center shadow-xs shrink-0">
          <div className="w-4 h-4 border-2 border-white rounded-xs" />
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight text-blue-950 leading-tight">
            SURAKSHIT <span className="text-blue-600">SHRAM</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
            Smart Labour Compliance
          </p>
        </div>
      </div>

      {/* Navigation list */}
      <div className="flex-1 p-4 space-y-5 overflow-y-auto">
        {navSections.map((sec, idx) => (
          <div key={idx}>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
              {sec.section}
            </div>
            <div className="space-y-1">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      onNavigate(item.path);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    } ${item.highlight && !isActive ? 'border border-blue-200 text-blue-700 bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-blue-700' : 'text-slate-500'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold tabular-nums ${
                          isActive
                            ? 'bg-blue-200 text-blue-900'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Global Access to National e-Shram Graphs */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              if (onSwitchRole) onSwitchRole('government');
              onNavigate('/government/dashboard');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all border ${
              currentPath === '/government/dashboard'
                ? 'bg-blue-900 text-white border-blue-950 shadow-sm'
                : 'bg-blue-50/80 text-blue-950 border-blue-200 hover:bg-blue-100/80'
            }`}
          >
            <div className="flex items-center gap-2 text-left">
              <span className="text-base">📊</span>
              <div>
                <span className="block leading-tight font-extrabold text-[11px]">
                  e-Shram National Graphs
                </span>
                <span className="text-[9px] text-blue-700 block leading-tight font-normal">
                  Power BI & Ministry Charts
                </span>
              </div>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 font-bold font-mono">
              LIVE
            </span>
          </button>
        </div>
      </div>

      {/* Footer Role Box */}
      <div className="p-4 mt-auto border-t border-slate-100 space-y-2.5">
        {onLogout && (
          <button
            onClick={() => {
              onLogout();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-black bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-xs border border-orange-400/40 transition-all cursor-pointer"
          >
            <span>🔐 e-Pramaan Login Portal</span>
          </button>
        )}

        <div className="bg-slate-900 text-white rounded-xl p-3.5 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
            Active Portal Persona
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-orange-400">
              {getRoleDisplayName(currentRole)}
            </span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-xs" />
          </div>
          <p className="text-[10px] text-slate-400 mt-1 truncate">
            {currentRole === 'company' && 'Bharat Heavy Forge Ltd.'}
            {currentRole === 'inspector' && 'Pune Inspection Circle'}
            {currentRole === 'government' && 'Central Headquarters (CLC)'}
            {currentRole === 'worker' && 'e-Shram Universal Repository'}
            {currentRole === 'admin' && 'National Informatics Centre'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)] z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200 shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
