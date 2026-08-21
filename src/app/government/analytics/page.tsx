"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, Activity, ArrowUpRight } from "lucide-react"
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts"

const monthlyTrend = [
  { month: "Mar", inspections: 198, violations: 34, notices: 22 },
  { month: "Apr", inspections: 231, violations: 28, notices: 18 },
  { month: "May", inspections: 278, violations: 41, notices: 29 },
  { month: "Jun", inspections: 310, violations: 25, notices: 16 },
  { month: "Jul", inspections: 298, violations: 33, notices: 21 },
  { month: "Aug", inspections: 342, violations: 12, notices: 9 },
]

const riskDistribution = [
  { name: "A (Excellent)", value: 28, color: "#10b981" },
  { name: "B (Good)", value: 37, color: "#3b82f6" },
  { name: "C (Average)", value: 22, color: "#f59e0b" },
  { name: "D/F (Poor)", value: 13, color: "#ef4444" },
]

const recentUpdates = [
  { id: "EST-001", name: "Acme Corp", district: "Mumbai", prev: "C-", curr: "B+", delta: "up", status: "Resolved", statusClass: "bg-green-50 text-green-700 border-green-200" },
  { id: "EST-002", name: "Globex Manufacturing", district: "Pune", prev: "A", curr: "B-", delta: "down", status: "Warning Issued", statusClass: "bg-red-50 text-red-700 border-red-200" },
  { id: "EST-003", name: "Stark Industries", district: "Thane", prev: "B", curr: "B", delta: "same", status: "Routine Check", statusClass: "bg-slate-100 text-slate-600 border-slate-200" },
  { id: "EST-004", name: "Wayne Enterprises", district: "Thane", prev: "C+", curr: "C-", delta: "down", status: "Notice Pending", statusClass: "bg-orange-50 text-orange-700 border-orange-200" },
  { id: "EST-005", name: "Umbrella Corp", district: "Pune", prev: "A-", curr: "A+", delta: "up", status: "Compliant", statusClass: "bg-green-50 text-green-700 border-green-200" },
]

export default function GovernmentAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Live Risk Analytics</h2>
          <p className="text-slate-500 text-sm">Real-time compliance monitoring · Maharashtra · All Districts</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse inline-block" />
            Live Updating
          </div>
          <Button size="sm" className="text-xs" style={{ background: "hsl(220 90% 48%)" }}>
            <Activity className="h-3.5 w-3.5 mr-1.5" />Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="kpi-card-blue rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-start">
            <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider">Avg State Risk Score</p>
            <TrendingUp className="h-5 w-5 text-blue-200" />
          </div>
          <p className="text-4xl font-black text-white mt-3">B+</p>
          <p className="text-xs text-blue-200 mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Improved 2% this week
          </p>
        </div>

        <div className="kpi-card-pink rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-start">
            <p className="text-pink-100 text-xs font-semibold uppercase tracking-wider">Critical Violations</p>
            <AlertTriangle className="h-5 w-5 text-pink-200" />
          </div>
          <p className="text-4xl font-black text-white mt-3">12</p>
          <p className="text-xs text-pink-200 mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +3 from yesterday
          </p>
        </div>

        <div className="kpi-card-green rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-start">
            <p className="text-green-100 text-xs font-semibold uppercase tracking-wider">Inspections Completed</p>
            <CheckCircle2 className="h-5 w-5 text-green-200" />
          </div>
          <p className="text-4xl font-black text-white mt-3">342</p>
          <p className="text-xs text-green-200 mt-2">This month · 14% above target</p>
        </div>

        <div className="kpi-card-orange rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-start">
            <p className="text-orange-100 text-xs font-semibold uppercase tracking-wider">Pending Notices</p>
          </div>
          <p className="text-4xl font-black text-white mt-3">89</p>
          <p className="text-xs text-orange-200 mt-2">Across all districts</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Line chart */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-700">Inspections &amp; Violations — Last 6 Months</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs text-blue-600 h-7">
                AI Deep Dive <ArrowUpRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="inspGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="violGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", fontSize: "12px" }} />
                <Area type="monotone" dataKey="inspections" stroke="#3b82f6" strokeWidth={2.5} fill="url(#inspGrad)" name="Inspections" dot={false} />
                <Area type="monotone" dataKey="violations" stroke="#ec4899" strokeWidth={2.5} fill="url(#violGrad)" name="Violations" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie chart */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-700">Risk Grade Distribution</CardTitle>
            <CardDescription className="text-xs">All 4,130 establishments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => `${val}%`} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-1">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full inline-block shrink-0" style={{ background: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </span>
                  <span className="font-bold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live inspection feed */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-bold text-slate-700">Live Inspection Updates</CardTitle>
              <CardDescription className="text-xs">Real-time risk score changes from field inspectors</CardDescription>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse inline-block" />LIVE
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Establishment</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">District</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Previous</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">New Score</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentUpdates.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-900">{row.name}</td>
                    <td className="px-4 py-4 text-slate-600">{row.district}</td>
                    <td className="px-4 py-4 text-slate-500">{row.prev}</td>
                    <td className="px-4 py-4">
                      <span className={`font-bold flex items-center gap-1 ${row.delta === "up" ? "text-green-600" : row.delta === "down" ? "text-red-600" : "text-slate-700"}`}>
                        {row.curr}
                        {row.delta === "up" && <TrendingUp className="h-3.5 w-3.5" />}
                        {row.delta === "down" && <TrendingDown className="h-3.5 w-3.5" />}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="outline" className={`text-xs ${row.statusClass}`}>{row.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs text-blue-600 hover:underline font-medium">View Report</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
