import { Building2, FileText, LayoutDashboard, AlertCircle, Scale, Users, ClipboardCheck, FileWarning, LogOut, Bell } from "lucide-react"
import Link from "next/link"

const navLinks = [
  { href: "/company/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/company/compliance", label: "Compliance", Icon: AlertCircle },
  { href: "/company/documents", label: "Documents", Icon: FileText },
  { href: "/company/notices", label: "Notices", Icon: FileWarning, badge: "1" },
  { href: "/company/inspections", label: "Inspections", Icon: ClipboardCheck },
  { href: "/company/grievances", label: "Grievances", Icon: Users },
]

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row" style={{ background: "hsl(215 25% 96%)" }}>
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col md:sticky md:top-0 md:h-screen shadow-sm shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center shadow-sm shrink-0" style={{ background: "hsl(220 90% 48%)" }}>
            <Scale className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm tracking-tight leading-tight">Surakshit Shram</p>
            <p className="text-[10px] text-slate-500 leading-tight">Company Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 py-2">Navigation</p>
          {navLinks.map(({ href, label, Icon, badge }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between px-3 py-2.5 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl font-medium text-sm transition-all"
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </span>
              {badge && (
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-red-500 text-white">{badge}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 text-white" style={{ background: "hsl(220 90% 48%)" }}>
              AC
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 truncate">Acme Corp</p>
              <p className="text-[10px] text-slate-500 truncate">MH-LAB-2019-001234</p>
            </div>
            <Link href="/login" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto min-w-0 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-green-700 bg-green-100 border border-green-200 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                Verified Entity
              </span>
              <span className="text-xs text-slate-500">E-PRAMAAN AUTH · Level 3</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <Bell className="h-5 w-5 text-slate-500" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border border-white" />
            </button>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
