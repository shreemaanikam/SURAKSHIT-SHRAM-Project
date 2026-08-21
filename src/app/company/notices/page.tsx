"use client"

import { useState } from "react"
import { mockNotices } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileWarning, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, Send } from "lucide-react"

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string; Icon: React.ComponentType<{ className?: string }> }> = {
    pending_response: { label: "Pending Response", className: "bg-red-50 text-red-700 border-red-200", Icon: Clock },
    responded: { label: "Responded", className: "bg-blue-50 text-blue-700 border-blue-200", Icon: Send },
    closed: { label: "Closed", className: "bg-green-50 text-green-700 border-green-200", Icon: CheckCircle2 },
    escalated: { label: "Escalated", className: "bg-orange-50 text-orange-700 border-orange-200", Icon: XCircle },
  }
  const { label, className, Icon } = map[status] ?? map.closed
  return (
    <Badge variant="outline" className={className}>
      <Icon className="h-3 w-3 mr-1 shrink-0" />{label}
    </Badge>
  )
}

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    show_cause: "bg-red-100 text-red-700",
    penalty: "bg-orange-100 text-orange-700",
    improvement: "bg-yellow-100 text-yellow-700",
    closure: "bg-red-200 text-red-900",
  }
  const labels: Record<string, string> = {
    show_cause: "Show Cause Notice",
    penalty: "Penalty Order",
    improvement: "Improvement Notice",
    closure: "Closure Notice",
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${map[type]}`}>
      {labels[type] ?? type}
    </span>
  )
}

export default function NoticesPage() {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [responseText, setResponseText] = useState("")
  const pending = mockNotices.filter((n) => n.status === "pending_response")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Notices</h2>
          <p className="text-slate-500">Review and respond to notices issued by inspectors.</p>
        </div>
      </div>

      {pending.length > 0 && (
        <Card className="border-l-4 border-l-destructive bg-red-50/30">
          <CardContent className="py-3 flex items-center gap-3">
            <FileWarning className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm font-medium text-slate-900">
              {pending.length} notice{pending.length > 1 ? "s" : ""} require your response.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {mockNotices.map((notice) => {
          const isOpen = expanded === notice.id
          return (
            <Card key={notice.id} className={notice.status === "pending_response" ? "border-red-200" : ""}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <TypeBadge type={notice.type} />
                      <span className="text-xs text-slate-500">{notice.id}</span>
                    </div>
                    <CardTitle className="text-base leading-snug">{notice.subject}</CardTitle>
                    <CardDescription>
                      Issued: {notice.issuedDate} · Response by: {notice.responseDeadline}
                      {notice.amount && ` · Fine: ₹${notice.amount.toLocaleString("en-IN")}`}
                    </CardDescription>
                  </div>
                  <StatusBadge status={notice.status} />
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <button
                  onClick={() => setExpanded(isOpen ? null : notice.id)}
                  className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
                >
                  {isOpen ? "Hide Details" : "View Details"}
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {isOpen && (
                  <div className="mt-3 space-y-3">
                    <div className="p-4 bg-slate-50 rounded-md border border-slate-100 text-sm text-slate-700 leading-relaxed">
                      {notice.description}
                    </div>

                    {notice.status === "pending_response" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Your Response</label>
                        <textarea
                          className="w-full min-h-[100px] p-3 text-sm border border-slate-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Describe the corrective actions taken or dispute the notice..."
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>

              {isOpen && notice.status === "pending_response" && (
                <CardFooter className="pt-0 flex gap-2">
                  <Button disabled={responseText.length < 10}>
                    <Send className="h-4 w-4 mr-2" />Submit Response
                  </Button>
                  <Button variant="outline">Attach Document</Button>
                </CardFooter>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
