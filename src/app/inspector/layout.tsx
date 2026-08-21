import { Home, ClipboardList, UserCircle } from "lucide-react"
import Link from "next/link"
import GovernmentEmblem from "@/components/GovernmentEmblem"

export default function InspectorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-16 md:pb-0">
      {/* Top App Bar */}
      <header className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-md">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-white rounded-lg shrink-0">
            <GovernmentEmblem className="h-6 w-6" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Inspector Portal</h1>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="bg-primary-foreground/20 px-2 py-1 rounded-md">ID: INS-402</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md mx-auto md:max-w-4xl p-4 md:p-6 lg:p-8">
        {children}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-slate-200 flex items-center justify-around pb-safe z-20">
        <Link href="/inspector/dashboard" className="flex flex-col items-center py-3 px-4 text-slate-500 hover:text-primary min-w-[60px]">
          <Home className="h-6 w-6 mb-1" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link href="/inspector/inspections" className="flex flex-col items-center py-3 px-4 text-primary relative min-w-[60px]">
          <ClipboardList className="h-6 w-6 mb-1" />
          <span className="absolute top-2 right-3 h-2 w-2 rounded-full bg-warning border border-white" />
          <span className="text-[10px] font-medium">Inspections</span>
        </Link>
        <Link href="/inspector/profile" className="flex flex-col items-center py-3 px-4 text-slate-500 hover:text-primary min-w-[60px]">
          <UserCircle className="h-6 w-6 mb-1" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>
    </div>
  )
}
