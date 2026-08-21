import { mockInspections } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, ClipboardList, CheckCircle2 } from "lucide-react"

const statusMap: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  scheduled: { label: "Scheduled", className: "bg-blue-50 text-blue-700 border-blue-200" },
  in_progress: { label: "In Progress", className: "bg-orange-50 text-orange-700 border-orange-200" },
  completed: { label: "Completed", className: "bg-green-50 text-green-700 border-green-200" },
  cancelled: { label: "Cancelled", className: "bg-slate-100 text-slate-600 border-slate-200" },
}

export default function CompanyInspectionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Inspections</h2>
        <p className="text-slate-500">View scheduled and past inspections of your establishment.</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4 flex items-start gap-3">
          <ClipboardList className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-900">Upcoming Inspection in 5 days</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Ensure all safety equipment is in place and documents are ready for inspector review.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {mockInspections.map((ins) => {
          const { label, className } = statusMap[ins.status] ?? statusMap.scheduled
          const checked = ins.checklistItems.filter((c) => c.checked).length
          const total = ins.checklistItems.length
          return (
            <Card key={ins.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">{ins.id}</p>
                    <CardTitle className="text-lg">{ins.establishmentName}</CardTitle>
                    <CardDescription>Inspector: {ins.inspectorName}</CardDescription>
                  </div>
                  <Badge variant="outline" className={className}>{label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {ins.scheduledDate}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {ins.district}
                  </span>
                </div>

                {total > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${(checked / total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 shrink-0">{checked}/{total} items</span>
                  </div>
                )}

                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm">View Report</Button>
                  {ins.status === "pending" && <Button size="sm">Prepare Documents</Button>}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
