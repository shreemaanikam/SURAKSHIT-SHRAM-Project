import { HardHat, MessageSquarePlus, Home } from "lucide-react"
import Link from "next/link"
import GovernmentEmblem from "@/components/GovernmentEmblem"

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-green-700 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-md">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-white rounded-lg shrink-0">
            <GovernmentEmblem className="h-6 w-6" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight">Worker &amp; Complaint Portal</h1>
        </div>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-md">Surakshit Shram</span>
      </header>

      <main className="flex-1 w-full max-w-lg mx-auto p-4 md:p-6">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 flex items-center justify-around pb-safe z-20">
        <Link href="/worker/grievances" className="flex flex-col items-center py-3 px-4 text-green-700">
          <Home className="h-6 w-6 mb-1" />
          <span className="text-[10px] font-medium">My Grievances</span>
        </Link>
        <Link href="/worker/grievances/new" className="flex flex-col items-center py-3 px-4 text-slate-500 hover:text-green-700">
          <MessageSquarePlus className="h-6 w-6 mb-1" />
          <span className="text-[10px] font-medium">File New</span>
        </Link>
      </nav>

      {/* Bottom spacing so content doesn't hide behind nav */}
      <div className="h-16" />
    </div>
  )
}
