import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, CheckCircle2, Clock, MapPin, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function InspectorDashboard() {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Good morning, Rajesh</h2>
        <p className="text-sm text-slate-500">Thursday, Aug 20 · 2 assignments today</p>
      </div>

      {/* Today's summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-slate-900">2</div>
            <p className="text-xs text-slate-500 mt-1">Assigned</p>
          </CardContent>
        </Card>
        <Card className="text-center border-yellow-200 bg-yellow-50/40">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-yellow-700">1</div>
            <p className="text-xs text-yellow-600 mt-1">Pending</p>
          </CardContent>
        </Card>
        <Card className="text-center border-green-200 bg-green-50/40">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-green-700">0</div>
            <p className="text-xs text-green-600 mt-1">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Priority inspection alert */}
      <Card className="border-l-4 border-l-warning">
        <CardContent className="py-3 flex items-start gap-3">
          <ClipboardList className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-slate-900">Priority: Acme Corp Due Today</p>
            <p className="text-xs text-slate-500">Machinery guard violation flagged. Complete by 17:00.</p>
          </div>
        </CardContent>
      </Card>

      {/* Today's inspections */}
      <div>
        <h3 className="font-semibold text-slate-800 mb-3">Today&apos;s Assignments</h3>
        <div className="space-y-3">
          <Link href="/inspector/inspections/INS-2026-892" className="block">
            <Card className="hover:border-primary/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900">Acme Corp</h3>
                    <p className="text-xs text-slate-500">INS-2026-892</p>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center text-xs text-slate-600">
                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                    <span>Andheri East, Mumbai</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-600">
                    <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                    <span>Due today by 17:00</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end items-center text-primary text-sm font-medium">
                  Start <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/inspector/inspections/INS-2026-893" className="block opacity-70">
            <Card className="hover:border-primary/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900">Globex Manufacturing</h3>
                    <p className="text-xs text-slate-500">INS-2026-893</p>
                  </div>
                  <Badge variant="outline" className="bg-slate-100 text-slate-600">Scheduled</Badge>
                </div>
                <div className="flex items-center text-xs text-slate-600">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                  <span>Tomorrow, 09:00 AM · Navi Mumbai</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <Button variant="outline" className="w-full" asChild>
        <Link href="/inspector/inspections">View All Inspections</Link>
      </Button>
    </div>
  )
}
