import { LayoutDashboard, MessageSquarePlus, UserCircle, HardHat, LogOut } from "lucide-react"
import Link from "next/link"
import GovernmentEmblem from "@/components/GovernmentEmblem"

const navLinks = [
  { href: "/gig-worker/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/worker/grievances/new", label: "File Complaint", Icon: MessageSquarePlus },
  { href: "/worker/grievances", label: "My Cases", Icon: UserCircle },
]

export default function GigWorkerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "hsl(215 25% 96%)" }}>
      {/* India tricolour top bar */}
      <div className="h-1 flex shrink-0">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#128807]" />
      </div>

      {/* Header */}
      <header
        className="text-white px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-lg"
        style={{ background: "linear-gradient(135deg, hsl(220 90% 20%), hsl(220 90% 32%))" }}
      >
        <div className="flex items-center gap-3">
          <div className="p-1 bg-white/10 rounded-lg">
            <GovernmentEmblem className="h-9 w-9" />
          </div>
          <div>
            <div className="text-[10px] text-amber-300 font-bold uppercase tracking-widest leading-tight">
              Ministry of Labour &amp; Employment
            </div>
            <h1 className="text-sm font-black tracking-tight leading-tight flex items-center gap-1.5">
              <HardHat className="h-4 w-4" />
              GIG WORKERS PORTAL
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-amber-400/20 border border-amber-400/30 text-amber-300 px-2 py-1 rounded-md font-bold">
            e-Shram
          </span>
          <Link href="/login" className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around pb-safe z-20 shadow-lg">
        {navLinks.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center py-3 px-4 text-slate-500 hover:text-blue-700 transition-colors min-w-[60px]"
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
