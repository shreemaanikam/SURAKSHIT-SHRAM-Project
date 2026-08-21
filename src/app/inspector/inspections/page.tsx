import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function InspectionsList() {
  return (
    <div className="space-y-4 pb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">My Inspections</h2>
        <p className="text-sm text-slate-500">You have 2 pending assignments today.</p>
      </div>

      <div className="space-y-3">
        <Link href="/inspector/inspections/INS-2026-892" className="block">
          <Card className="hover:border-primary/50 transition-colors shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-slate-900">Acme Corp</h3>
                  <p className="text-xs text-slate-500">INS-2026-892</p>
                </div>
                <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/20">Pending</Badge>
              </div>
              <div className="space-y-2 mt-3">
                <div className="flex items-center text-xs text-slate-600">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-slate-400 shrink-0" />
                  <span className="truncate">123 Industrial Phase 1, Andheri East</span>
                </div>
                <div className="flex items-center text-xs text-slate-600">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-400 shrink-0" />
                  <span>Due Today by 17:00</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end items-center text-primary text-sm font-medium">
                Start Inspection <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/inspector/inspections/INS-2026-893" className="block opacity-75">
          <Card className="hover:border-primary/50 transition-colors shadow-sm">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-slate-900">Globex Manufacturing</h3>
                  <p className="text-xs text-slate-500">INS-2026-893</p>
                </div>
                <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">Scheduled</Badge>
              </div>
              <div className="space-y-2 mt-3">
                <div className="flex items-center text-xs text-slate-600">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 text-slate-400 shrink-0" />
                  <span className="truncate">45 Tech Park, Navi Mumbai</span>
                </div>
                <div className="flex items-center text-xs text-slate-600">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-400 shrink-0" />
                  <span>Tomorrow, 09:00 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
