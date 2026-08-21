import { mockGrievances } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, MessageSquare, CheckCircle2, Clock, AlertCircle } from "lucide-react"

const statusMap: Record<string, { label: string; className: string; Icon: React.ComponentType<{ className?: string }> }> = {
  open: { label: "Open", className: "bg-yellow-50 text-yellow-700 border-yellow-200", Icon: Clock },
  under_review: { label: "Under Review", className: "bg-blue-50 text-blue-700 border-blue-200", Icon: AlertCircle },
  resolved: { label: "Resolved", className: "bg-green-50 text-green-700 border-green-200", Icon: CheckCircle2 },
  rejected: { label: "Rejected", className: "bg-slate-100 text-slate-600 border-slate-200", Icon: MessageSquare },
}

const categoryLabels: Record<string, string> = {
  wages: "Wages",
  safety: "Safety",
  harassment: "Harassment",
  termination: "Termination",
  other: "Other",
}

export default function CompanyGrievancesPage() {
  const open = mockGrievances.filter((g) => g.status === "open" || g.status === "under_review").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Worker Grievances</h2>
          <p className="text-slate-500">Review and respond to grievances filed by your workers.</p>
        </div>
      </div>

      {open > 0 && (
        <Card className="border-l-4 border-l-warning">
          <CardContent className="py-3 flex items-center gap-3">
            <Users className="h-5 w-5 text-warning shrink-0" />
            <p className="text-sm font-medium text-slate-900">
              {open} grievance{open > 1 ? "s" : ""} pending acknowledgement.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {mockGrievances.map((g) => {
          const { label, className, Icon } = statusMap[g.status] ?? statusMap.open
          return (
            <Card key={g.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs text-slate-500">{g.id}</span>
                      <Badge variant="secondary" className="text-xs">{categoryLabels[g.category]}</Badge>
                    </div>
                    <CardTitle className="text-base">{g.subject}</CardTitle>
                    <CardDescription>Filed: {g.filedDate} · {g.workerName}</CardDescription>
                  </div>
                  <Badge variant="outline" className={className}>
                    <Icon className="h-3 w-3 mr-1 shrink-0" />{label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <p className="text-sm text-slate-600 leading-relaxed">{g.description}</p>
                {g.resolution && (
                  <div className="p-3 bg-green-50 rounded-md border border-green-100">
                    <p className="text-xs font-semibold text-green-700 mb-1">Resolution</p>
                    <p className="text-sm text-green-800">{g.resolution}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
