import { mockComplianceItems } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

function StatusBadge({ status }: { status: string }) {
  if (status === "compliant")
    return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />Compliant</Badge>
  if (status === "non_compliant")
    return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="h-3 w-3 mr-1" />Non-Compliant</Badge>
  return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
}

export default function CompliancePage() {
  const compliant = mockComplianceItems.filter((i) => i.status === "compliant").length
  const nonCompliant = mockComplianceItems.filter((i) => i.status === "non_compliant").length
  const pending = mockComplianceItems.filter((i) => i.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Compliance Status</h2>
          <p className="text-slate-500">Track all statutory and regulatory obligations.</p>
        </div>
        <Button variant="outline">Download Checklist</Button>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50/40">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-green-700">{compliant}</div>
            <p className="text-xs text-green-600 mt-1">Compliant</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/40">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-red-700">{nonCompliant}</div>
            <p className="text-xs text-red-600 mt-1">Non-Compliant</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50/40">
          <CardContent className="pt-4 pb-3">
            <div className="text-2xl font-bold text-yellow-700">{pending}</div>
            <p className="text-xs text-yellow-600 mt-1">Pending</p>
          </CardContent>
        </Card>
      </div>

      {nonCompliant > 0 && (
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle className="text-base">Action Required</CardTitle>
            </div>
            <CardDescription>
              {nonCompliant} item{nonCompliant > 1 ? "s are" : " is"} non-compliant and may attract penalties.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Compliance items list */}
      <Card>
        <CardHeader>
          <CardTitle>All Compliance Items</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {mockComplianceItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <Badge variant="secondary" className="text-xs font-normal">{item.category}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">Due: {item.dueDate} · Last checked: {item.lastChecked}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={item.status} />
                  {item.status === "non_compliant" && (
                    <Button size="sm" asChild>
                      <Link href="/company/documents">Rectify</Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
