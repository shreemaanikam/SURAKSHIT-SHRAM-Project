import { mockGrievances } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle2, AlertCircle, MessageSquarePlus, MessageSquare } from "lucide-react"
import Link from "next/link"

const statusMap: Record<string, { label: string; className: string; Icon: React.ComponentType<{ className?: string }> }> = {
  open: { label: "Open", className: "bg-yellow-50 text-yellow-700 border-yellow-200", Icon: Clock },
  under_review: { label: "Under Review", className: "bg-blue-50 text-blue-700 border-blue-200", Icon: AlertCircle },
  resolved: { label: "Resolved", className: "bg-green-50 text-green-700 border-green-200", Icon: CheckCircle2 },
  rejected: { label: "Rejected", className: "bg-slate-100 text-slate-600", Icon: MessageSquare },
}

const categoryLabels: Record<string, string> = {
  wages: "Wages",
  safety: "Safety",
  harassment: "Harassment",
  termination: "Termination",
  other: "Other",
}

// For the worker view, we show all grievances (in real app these would be filtered by authenticated worker)
export default function WorkerGrievancesPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">My Grievances</h2>
        <p className="text-sm text-slate-500">Track the status of your filed complaints.</p>
      </div>

      <Link href="/worker/grievances/new" className="block">
        <div className="border-2 border-dashed border-green-300 rounded-xl p-5 flex items-center gap-4 bg-green-50 hover:bg-green-100 transition-colors">
          <div className="h-11 w-11 rounded-full bg-green-600 flex items-center justify-center shrink-0">
            <MessageSquarePlus className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-green-800">File a New Grievance</p>
            <p className="text-xs text-green-600 mt-0.5">Your complaint is anonymous and protected</p>
          </div>
        </div>
      </Link>

      <div className="space-y-3">
        {mockGrievances.map((g) => {
          const { label, className, Icon } = statusMap[g.status] ?? statusMap.open
          return (
            <Card key={g.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-500">{g.id}</span>
                      <Badge variant="secondary" className="text-xs">{categoryLabels[g.category]}</Badge>
                    </div>
                    <CardTitle className="text-base leading-snug">{g.subject}</CardTitle>
                    <CardDescription>Filed: {g.filedDate}</CardDescription>
                  </div>
                  <Badge variant="outline" className={className}>
                    <Icon className="h-3 w-3 mr-1 shrink-0" />{label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-slate-600 leading-relaxed">{g.description}</p>
                {g.resolution && (
                  <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-100">
                    <p className="text-xs font-semibold text-green-700 mb-1">Resolution from Employer</p>
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
