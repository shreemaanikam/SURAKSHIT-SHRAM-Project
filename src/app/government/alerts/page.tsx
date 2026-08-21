import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ShieldAlert, Bell, CheckCircle2, Clock, Building2 } from "lucide-react"

const mockAlerts = [
  {
    id: "ALT-001",
    type: "critical",
    title: "Critical Violation — Immediate Action Required",
    body: "Wayne Enterprises (Bhiwandi) reported a fatal accident in the press shop. Inspector has been dispatched.",
    establishment: "Wayne Enterprises",
    district: "Thane",
    time: "Today, 10:32 AM",
    status: "active",
  },
  {
    id: "ALT-002",
    type: "high",
    title: "Non-Response to Show Cause Notice",
    body: "Globex Manufacturing failed to respond to Notice NTC-2026-0412 within the stipulated period.",
    establishment: "Globex Manufacturing",
    district: "Pune",
    time: "Today, 09:15 AM",
    status: "active",
  },
  {
    id: "ALT-003",
    type: "medium",
    title: "Risk Score Degraded",
    body: "Globex Manufacturing risk score dropped from A to B- following a routine inspection.",
    establishment: "Globex Manufacturing",
    district: "Pune",
    time: "Yesterday, 05:45 PM",
    status: "acknowledged",
  },
  {
    id: "ALT-004",
    type: "low",
    title: "Fire NOC Expiry — 26 Days",
    body: "Acme Corp's Fire NOC is expiring on Sep 15, 2026. Notify establishment to initiate renewal.",
    establishment: "Acme Corp",
    district: "Mumbai",
    time: "Yesterday, 03:00 PM",
    status: "acknowledged",
  },
]

const typeMap: Record<string, { label: string; className: string; Icon: React.ComponentType<{ className?: string }>; cardBorder: string }> = {
  critical: { label: "Critical", className: "bg-red-100 text-red-800 border-red-200", Icon: ShieldAlert, cardBorder: "border-l-4 border-l-red-500" },
  high: { label: "High", className: "bg-orange-100 text-orange-800 border-orange-200", Icon: AlertTriangle, cardBorder: "border-l-4 border-l-orange-400" },
  medium: { label: "Medium", className: "bg-yellow-100 text-yellow-800 border-yellow-200", Icon: Bell, cardBorder: "border-l-4 border-l-yellow-400" },
  low: { label: "Low", className: "bg-blue-100 text-blue-800 border-blue-200", Icon: Clock, cardBorder: "border-l-4 border-l-blue-300" },
}

export default function AlertsPage() {
  const active = mockAlerts.filter((a) => a.status === "active").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Alerts & Notices</h2>
          <p className="text-slate-500">Real-time alerts for violations, non-responses, and risk changes.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-slate-500">Live feed</span>
        </div>
      </div>

      {active > 0 && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="py-3 flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-red-600 shrink-0" />
            <p className="text-sm font-medium text-red-800">
              {active} active alert{active > 1 ? "s" : ""} require immediate attention.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {mockAlerts.map((alert) => {
          const { label, className, Icon, cardBorder } = typeMap[alert.type]
          return (
            <Card key={alert.id} className={`${cardBorder} ${alert.status === "acknowledged" ? "opacity-70" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <Badge variant="outline" className={className}>{label}</Badge>
                    {alert.status === "acknowledged" && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />Acknowledged
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{alert.time}</span>
                </div>
                <CardTitle className="text-base mt-1">{alert.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <p className="text-sm text-slate-600">{alert.body}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{alert.establishment} — {alert.district}</span>
                </div>
                {alert.status === "active" && (
                  <div className="flex gap-2 flex-wrap">
                    <Button size="sm">Acknowledge</Button>
                    <Button size="sm" variant="outline">Escalate</Button>
                    <Button size="sm" variant="ghost">View Establishment</Button>
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
