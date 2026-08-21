"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Calendar, DollarSign, HeartHandshake, PhoneCall, AlertCircle, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import GovernmentEmblem from "@/components/GovernmentEmblem"

const schemes = [
  { name: "Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)", desc: "Voluntary and contributory pension scheme for unorganised workers.", status: "Active" },
  { name: "Accident Insurance Scheme", desc: "Rs. 2 Lakh accidental death cover and Rs. 1 Lakh for partial disability.", status: "Enrolled" },
  { name: "Gig Platform Welfare Fund", desc: "Medical and educational support for gig delivery/cab partners.", status: "Apply Now" }
]

export default function GigWorkerDashboard() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-8">
      {/* Government Brand Banner */}
      <div className="flex items-center gap-4 bg-blue-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 font-bold text-9xl select-none">GOI</div>
        <div className="h-16 w-16 bg-white rounded-xl flex items-center justify-center shrink-0 p-1">
          <GovernmentEmblem className="h-14 w-14" />
        </div>
        <div>
          <div className="text-xs text-amber-400 font-bold uppercase tracking-widest">Ministry of Labour &amp; Employment</div>
          <h1 className="text-xl md:text-2xl font-black">GIG WORKERS DIGITAL PORTAL</h1>
          <p className="text-xs text-blue-200 mt-1">Universal Social Security Registry (e-Shram Linked)</p>
        </div>
      </div>

      {/* Profile Summary Card */}
      <Card className="border-l-4 border-l-blue-600 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                RK
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Ramesh Kumar</h2>
                <p className="text-xs text-slate-500">Platform: Zomato (Delivery Partner) · ID: GIG-89201</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-bold">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />e-Shram Verified
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Welfare Balance & Social Security stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="kpi-card-blue rounded-2xl p-5 shadow-md">
          <p className="text-xs text-blue-100 font-semibold uppercase tracking-wider">Accidental Cover</p>
          <p className="text-3xl font-black mt-2">₹ 2,00,000</p>
          <p className="text-[10px] text-blue-200 mt-1">Premium paid by Central Govt</p>
        </div>
        <div className="kpi-card-green rounded-2xl p-5 shadow-md">
          <p className="text-xs text-green-100 font-semibold uppercase tracking-wider">Health Insurance Benefit</p>
          <p className="text-3xl font-black mt-2">Active</p>
          <p className="text-[10px] text-green-200 mt-1">Ayushman Bharat PM-JAY link</p>
        </div>
        <div className="kpi-card-dark rounded-2xl p-5 shadow-md">
          <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider font-bold">Welfare Fund Contribution</p>
          <p className="text-3xl font-black mt-2">₹ 4,500</p>
          <p className="text-[10px] text-slate-400 mt-1">Accrued via Platform commission</p>
        </div>
      </div>

      {/* Main sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Welfare Schemes */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-blue-600" />
              Social Security &amp; Schemes
            </CardTitle>
            <CardDescription className="text-xs">Central and State benefits for Gig Workers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {schemes.map((s, idx) => (
              <div key={idx} className="border-b last:border-b-0 pb-3 last:pb-0">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm font-bold text-slate-800">{s.name}</p>
                  <Badge variant={s.status === "Apply Now" ? "secondary" : "outline"} className="text-[10px]">
                    {s.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Complaints and Grievance actions */}
        <Card className="shadow-sm border-amber-200 bg-amber-50/10">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Platform Grievance Center
            </CardTitle>
            <CardDescription className="text-xs">Report payout delays, unfair bans, or safety issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs font-semibold text-amber-900 leading-tight">Need to file a complaint?</p>
              <p className="text-[11px] text-amber-700 mt-1">
                Your report goes directly to the state labour commissioner oversight radar for quick resolution.
              </p>
            </div>
            
            <div className="space-y-2">
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold" asChild>
                <Link href="/worker/grievances/new">
                  File New Complaint <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full text-slate-700" asChild>
                <Link href="/worker/grievances">
                  Track My Complaints
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center pt-4">
        <Button variant="ghost" className="text-xs text-slate-400" asChild>
          <Link href="/login">Return to Role Portal</Link>
        </Button>
      </div>
    </div>
  )
}
