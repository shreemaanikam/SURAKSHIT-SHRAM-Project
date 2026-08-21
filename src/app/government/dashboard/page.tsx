"use client"

import { mockDistrictStats } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, ShieldAlert, ClipboardCheck, FileWarning, ArrowUpRight, Cpu, Zap, Sparkles, AlertCircle } from "lucide-react"
import Link from "next/link"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from "recharts"

const totalEstablishments = mockDistrictStats.reduce((a, d) => a + d.totalEstablishments, 0)
const totalHighRisk = mockDistrictStats.reduce((a, d) => a + d.highRisk, 0)
const totalInspections = mockDistrictStats.reduce((a, d) => a + d.inspectionsThisMonth, 0)

const weeklyData = [
  { day: "Mon", inspections: 48, notices: 12 },
  { day: "Tue", inspections: 62, notices: 8 },
  { day: "Wed", inspections: 57, notices: 15 },
  { day: "Thu", inspections: 74, notices: 11 },
  { day: "Fri", inspections: 88, notices: 19 },
  { day: "Sat", inspections: 43, notices: 6 },
  { day: "Sun", inspections: 22, notices: 4 },
]

const districtBarData = mockDistrictStats.map((d) => ({
  name: d.district,
  highRisk: d.highRisk,
  inspections: d.inspectionsThisMonth,
}))

const COLORS = ["#3b82f6", "#ec4899", "#10b981", "#f59e0b", "#8b5cf6"]

export default function GovernmentDashboard() {
  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div
        className="rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: "linear-gradient(135deg, hsl(222 47% 13%), hsl(238 40% 22%))" }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(38 95% 52%)" }}>
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse inline-block" />
            Government of India · Ministry of Labour &amp; Employment
          </div>
          <p className="text-xs" style={{ color: "hsl(215 20% 65%)" }}>
            <Cpu className="h-3 w-3 inline mr-1" />AI Risk Telemetry: Active (99.2% Accuracy)
          </p>
          <h1 className="text-white text-2xl md:text-3xl font-black tracking-tight leading-tight">
            E-SHRAM NATIONAL DASHBOARD &amp;<br className="hidden md:block" /> LABOUR CODE COMPLIANCE RADAR
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button size="sm" className="text-xs font-bold" style={{ background: "hsl(220 90% 50%)", color: "white" }}>
            <Zap className="h-3.5 w-3.5 mr-1.5" />Ask AI Labour Copilot
          </Button>
          <Button size="sm" variant="outline" className="text-xs font-bold border-slate-500 text-slate-200 hover:bg-slate-700">
            AI Predictive Radar (3)
          </Button>
          <Button size="sm" className="text-xs font-bold" style={{ background: "hsl(151 60% 35%)", color: "white" }}>
            AI Anomaly Overlay: ON
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="kpi-card-blue rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-10" style={{ background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Ccircle cx='30' cy='30' r='20' stroke='white' stroke-width='1' fill='none'/%3E%3C/svg%3E\") repeat" }} />
          <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">Total Establishments</p>
          <p className="text-5xl font-black text-white mt-2">{totalEstablishments.toLocaleString("en-IN")}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-3.5 w-3.5 text-blue-200" />
            <p className="text-xs text-blue-200">+4.2% vs 7-day avg</p>
          </div>
          <p className="text-[10px] text-blue-300 mt-0.5">Across all districts</p>
        </div>

        <div className="kpi-card-pink rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <p className="text-pink-100 text-xs font-semibold uppercase tracking-wider">High-Risk Establishments</p>
          <p className="text-5xl font-black text-white mt-2">{totalHighRisk}</p>
          <div className="flex items-center gap-1 mt-2">
            <ShieldAlert className="h-3.5 w-3.5 text-pink-200" />
            <p className="text-xs text-pink-200">Require priority inspection</p>
          </div>
          <Link href="/government/analytics" className="text-[10px] text-pink-200 underline mt-0.5 block">View Radar →</Link>
        </div>

        <div className="kpi-card-green rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <p className="text-green-100 text-xs font-semibold uppercase tracking-wider">AI Wage Register</p>
          <p className="text-5xl font-black text-white mt-2">99.2%</p>
          <Badge className="mt-2 text-[10px] font-bold py-0.5 px-2 bg-white/20 text-white border-0">AI VERIFIED</Badge>
          <p className="text-xs text-green-200 mt-1">1.48M Records Scanned Today</p>
        </div>

        <div className="kpi-card-dark rounded-2xl p-5 relative overflow-hidden shadow-lg border border-slate-700">
          <div className="flex items-start justify-between">
            <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Pending Notices</p>
            <Badge className="bg-red-500 text-white text-[10px] font-black border-0">ACTION REQUIRED</Badge>
          </div>
          <p className="text-5xl font-black text-white mt-2">89</p>
          <p className="text-xs text-slate-400 mt-2">AI High-Risk Outliers &amp; Show Cause Triggers</p>
          <Link href="/government/alerts" className="text-[10px] text-yellow-400 underline mt-1 block font-bold">Priority Audit Queue →</Link>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-700">Inspections &amp; Notices — This Week</CardTitle>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-green-700 bg-green-100">Live</span>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }}
                  cursor={{ fill: "#f1f5f9" }}
                />
                <Bar dataKey="inspections" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Inspections" />
                <Bar dataKey="notices" fill="#ec4899" radius={[4, 4, 0, 0]} name="Notices" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-700">High-Risk by District</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-blue-600 h-7 px-2">
                AI Deep Dive <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={districtBarData} layout="vertical" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" }} />
                <Bar dataKey="highRisk" radius={[0, 4, 4, 0]} name="High Risk">
                  {districtBarData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Two column bottom layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* District table */}
        <Card className="shadow-sm lg:col-span-7">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-700">Top Districts — Risk &amp; Compliance Snapshot</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-blue-600 h-7 px-2">AI Risk Breakdown</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {mockDistrictStats.map((d, i) => (
                <Link key={d.district} href="/government/analytics" className="block hover:bg-slate-50 transition-colors">
                  <div className="flex items-center px-6 py-3.5 gap-4">
                    <div
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900">{d.district}</p>
                      <p className="text-xs text-slate-500">{d.totalEstablishments.toLocaleString("en-IN")} establishments</p>
                    </div>
                    <div className="flex items-center gap-6 shrink-0 text-right">
                      <div>
                        <p className="text-sm font-bold text-red-600">{d.highRisk}</p>
                        <p className="text-[10px] text-slate-400">High Risk</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-600">{d.inspectionsThisMonth}</p>
                        <p className="text-[10px] text-slate-400">Inspected</p>
                      </div>
                      <div className="w-24">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] text-slate-400">Avg Score</p>
                          <p className="text-xs font-bold text-slate-700">{d.avgRiskScore}</p>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${d.avgRiskScore}%`, background: COLORS[i % COLORS.length] }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Predictive Alerts & Anomaly Radar */}
        <Card className="shadow-sm lg:col-span-5 border-blue-200">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                AI Predictive Alerts &amp; Outliers
              </CardTitle>
              <Badge className="bg-blue-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded">PREDICTIVE</Badge>
            </div>
            <CardDescription className="text-xs">Machine learning projections of next-month safety/wage risks.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-3">
              {/* Alert 1 */}
              <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-red-700 uppercase tracking-wide flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Fire Hazard Projection
                  </span>
                  <span className="text-xs font-bold text-red-600">87% Probability</span>
                </div>
                <p className="text-xs font-bold text-slate-800">Stark Industries · Thane West</p>
                <p className="text-[11px] text-slate-500">NOC expires in 12 days. No renewal pipeline detected. High machinery guard violation history.</p>
              </div>

              {/* Alert 2 */}
              <div className="p-3 bg-orange-50/50 border border-orange-100 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-orange-700 uppercase tracking-wide flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Wage Violation Anomaly
                  </span>
                  <span className="text-xs font-bold text-orange-600">74% Probability</span>
                </div>
                <p className="text-xs font-bold text-slate-800">Globex Manufacturing · Pune</p>
                <p className="text-[11px] text-slate-500">Telemetry detected 38 workers with delayed wage records. Non-provision of overtime logs flagged.</p>
              </div>

              {/* Alert 3 */}
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-blue-700 uppercase tracking-wide flex items-center gap-1">
                    <Cpu className="h-3 w-3" /> Automatic Inspection Dispatch
                  </span>
                  <span className="text-xs font-bold text-blue-600">Recommended</span>
                </div>
                <p className="text-xs font-bold text-slate-800">Wayne Enterprises · Thane</p>
                <p className="text-[11px] text-slate-500">Accident report logged. Smart scheduler queued urgent inspection assignment INS-2026-894.</p>
              </div>
            </div>
            
            <div className="pt-2">
              <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold h-9" asChild>
                <Link href="/government/alerts">
                  Open Complete Alert Center
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
