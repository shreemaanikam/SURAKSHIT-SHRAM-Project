import { LayoutDashboard, BarChart3, Building, Bell, Shield, ChevronRight } from "lucide-react"
import Link from "next/link"
import GovernmentEmblem from "@/components/GovernmentEmblem"

const navLinks = [
  { href: "/government/dashboard", label: "National Dashboard", Icon: LayoutDashboard },
  { href: "/government/analytics", label: "Live Analytics", Icon: BarChart3, badge: "LIVE" },
  { href: "/government/establishments", label: "Establishments", Icon: Building },
  { href: "/government/alerts", label: "Alerts & Notices", Icon: Bell, badge: "3" },
]

export default function GovernmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row" style={{ background: "hsl(215 25% 96%)" }}>
      {/* Dark Sidebar */}
      <aside
        className="w-full md:w-72 flex flex-col md:sticky md:top-0 md:h-screen shrink-0"
        style={{ background: "hsl(222 47% 11%)" }}
      >
        {/* Logo area */}
        <div className="p-5 border-b flex items-center gap-3" style={{ borderColor: "hsl(222 40% 18%)" }}>
          <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shrink-0 p-1">
            <GovernmentEmblem className="h-8 w-8" />
          </div>
          <div>
            <p className="text-white font-bold tracking-wide text-sm leading-tight">SURAKSHIT SHRAM</p>
            <p className="text-xs leading-tight" style={{ color: "hsl(215 20% 55%)" }}>Smart Labour Compliance</p>
          </div>
        </div>

        {/* Role badge */}
        <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "hsl(222 40% 18%)" }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "hsl(215 20% 50%)" }}>Viewing Role</p>
            <p className="text-white text-sm font-medium mt-0.5">Gov Official</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="h-2 w-2 rounded-full bg-green-400 inline-block" />
              <span className="text-xs" style={{ color: "hsl(151 60% 60%)" }}>Central HQ (CLC)</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-3" style={{ color: "hsl(215 20% 40%)" }}>Main Menu</p>
          {navLinks.map(({ href, label, Icon, badge }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-sm transition-all group"
              style={{ color: "hsl(215 20% 65%)" }}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </span>
              {badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge === "LIVE" ? "bg-green-500 text-white animate-pulse" : "bg-red-500 text-white"}`}>
                  {badge}
                </span>
              )}
            </Link>
          ))}

          {/* e-Shram National Graphs link */}
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid hsl(222 40% 18%)" }}>
            <Link
              href="/government/analytics"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-bold transition-all"
              style={{ background: "hsl(220 90% 48%)", color: "white" }}
            >
              <BarChart3 className="h-4 w-4" />
              e-Shram National Graphs
              <span className="ml-auto text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: "hsl(38 95% 52%)", color: "hsl(38 95% 15%)" }}>LIVE</span>
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t" style={{ borderColor: "hsl(222 40% 18%)", background: "hsl(222 47% 8%)" }}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0" style={{ background: "hsl(220 90% 48%)", color: "white" }}>
              MH
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">Govt of Maharashtra</p>
              <p className="text-xs truncate" style={{ color: "hsl(215 20% 50%)" }}>Labour Department · IAS</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
              <span>Official Portal</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-slate-800 font-medium">Central Directorate &amp; Predictive Radar</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse inline-block" />
              Live Sync: Central Gateway v4.2
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "hsl(220 90% 48%)", color: "white" }}>
                VD
              </div>
              <div className="hidden sm:block text-right">
                <p className="text-xs font-semibold text-slate-800">Dr. Vivek Deshmukh</p>
                <p className="text-[10px] text-slate-500">IAS · Labour Commissioner</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
