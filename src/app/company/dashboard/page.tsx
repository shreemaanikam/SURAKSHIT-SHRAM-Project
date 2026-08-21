"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, FileWarning, Activity, CheckCircle2, ArrowRight, TrendingUp, Clock, FileText } from "lucide-react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

const complianceHistory = [
  { month: "Mar", rate: 74 },
  { month: "Apr", rate: 78 },
  { month: "May", rate: 81 },
  { month: "Jun", rate: 86 },
  { month: "Jul", rate: 89 },
  { month: "Aug", rate: 92 },
]

const quickActions = [
  { label: "View Active Notice", desc: "Respond by Aug 22", href: "/company/notices", color: "border-red-200 bg-red-50", iconColor: "text-red-600", Icon: FileWarning },
  { label: "Upload Documents", desc: "2 expired documents", href: "/company/documents", color: "border-yellow-200 bg-yellow-50", iconColor: "text-yellow-600", Icon: FileText },
  { label: "View Inspection", desc: "Scheduled Aug 25", href: "/company/inspections", color: "border-blue-200 bg-blue-50", iconColor: "text-blue-600", Icon: Clock },
]

export default function CompanyDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500 text-sm">Overview of your compliance status &amp; pending actions.</p>
        </div>
        <Button variant="outline" className="shrink-0 text-sm font-semibold">Download Report</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="kpi-card-blue rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-start">
            <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">Risk Score</p>
            <Activity className="h-5 w-5 text-blue-200" />
          </div>
          <p className="text-5xl font-black text-white mt-3">B+</p>
          <p className="text-xs text-blue-200 mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />Improved from C- last quarter
          </p>
        </div>

        <div className="kpi-card-orange rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-start">
            <p className="text-orange-100 text-xs font-semibold uppercase tracking-wider">Active Notices</p>
            <FileWarning className="h-5 w-5 text-orange-200" />
          </div>
          <p className="text-5xl font-black text-white mt-3">1</p>
          <p className="text-xs text-orange-200 mt-2">Requires response by Aug 22</p>
        </div>

        <div className="kpi-card-green rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-start">
            <p className="text-green-100 text-xs font-semibold uppercase tracking-wider">Compliance Rate</p>
            <CheckCircle2 className="h-5 w-5 text-green-200" />
          </div>
          <p className="text-5xl font-black text-white mt-3">92%</p>
          <p className="text-xs text-green-200 mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />+4% from last audit
          </p>
        </div>
      </div>

      {/* Action required */}
      <Card className="border-l-4 shadow-sm" style={{ borderLeftColor: "hsl(38 95% 52%)" }}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" style={{ color: "hsl(38 95% 52%)" }} />
            <CardTitle className="text-base">Action Required: Upcoming Inspection</CardTitle>
          </div>
          <CardDescription>A routine safety inspection is scheduled for your primary manufacturing facility.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center" style={{ background: "hsl(215 25% 97%)" }}>
            <div>
              <p className="text-sm font-bold text-slate-900">Inspection ID: INS-2026-892</p>
              <p className="text-xs text-slate-500 mt-1">Scheduled: Aug 25, 2026 · Inspector Assigned</p>
            </div>
            <Badge variant="outline" className="text-xs font-bold" style={{ background: "hsl(38 95% 96%)", color: "hsl(38 95% 30%)", borderColor: "hsl(38 95% 80%)" }}>Pending</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full sm:w-auto" style={{ background: "hsl(220 90% 48%)" }}>
            Prepare Documentation <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      {/* Compliance trend + Quick actions */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-700">Compliance Rate — Last 6 Months</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={complianceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val}%`, "Compliance Rate"]}
                  contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", fontSize: "12px" }}
                />
                <Bar dataKey="rate" fill="hsl(220 90% 48%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-700">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((qa) => {
              const Icon = qa.Icon
              return (
                <Link key={qa.href} href={qa.href} className="block">
                  <div className={`flex items-center gap-3 p-3 rounded-xl border ${qa.color} hover:opacity-90 transition-opacity`}>
                    <Icon className={`h-5 w-5 shrink-0 ${qa.iconColor}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 leading-tight">{qa.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{qa.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 ml-auto shrink-0" />
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
