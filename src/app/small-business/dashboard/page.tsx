"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Award, ClipboardCheck, AlertTriangle, ShieldCheck, ArrowRight, HelpCircle } from "lucide-react"
import Link from "next/link"
import GovernmentEmblem from "@/components/GovernmentEmblem"

const checklist = [
  { id: "c1", title: "Basic First Aid Kit", desc: "Accessible box stocked with basic medical supplies.", status: "Verified" },
  { id: "c2", title: "Fire Safety Extinguishers", desc: "At least one working fire extinguisher on premises.", status: "Verified" },
  { id: "c3", title: "Clean Drinking Water", desc: "Provision of clean drinking water for all employees.", status: "Self-Certified" },
  { id: "c4", title: "Safe Electrical Wiring", desc: "No loose or open wires in the working areas.", status: "Pending" }
]

export default function SmallBusinessDashboard() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 md:p-8">
      {/* Government Brand Banner */}
      <div className="flex items-center gap-4 bg-emerald-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 font-bold text-9xl select-none">MSME</div>
        <div className="h-16 w-16 bg-white rounded-xl flex items-center justify-center shrink-0 p-1">
          <GovernmentEmblem className="h-14 w-14" />
        </div>
        <div>
          <div className="text-xs text-amber-400 font-bold uppercase tracking-widest">Ministry of Micro, Small &amp; Medium Enterprises</div>
          <h1 className="text-xl md:text-2xl font-black">SMALL BUSINESS ASSISTANCE &amp; COMPLIANCE</h1>
          <p className="text-xs text-emerald-200 mt-1">Simplified Compliance Self-Certification Portal</p>
        </div>
      </div>

      {/* Business Info */}
      <Card className="border-l-4 border-l-emerald-600 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Apex Garments</h2>
                <p className="text-xs text-slate-500">Retail &amp; Hosiery Manufacturing · Udyam-MH-33-0012345</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold">
              <ShieldCheck className="h-3.5 w-3.5 mr-1" />MSME Certified
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="kpi-card-green rounded-2xl p-5 shadow-md">
          <p className="text-xs text-emerald-100 font-semibold uppercase tracking-wider">Compliance Status</p>
          <p className="text-3xl font-black mt-2">94% OK</p>
          <p className="text-[10px] text-emerald-200 mt-1">Excellent standing</p>
        </div>
        <div className="kpi-card-blue rounded-2xl p-5 shadow-md">
          <p className="text-xs text-blue-100 font-semibold uppercase tracking-wider">Self-Certification</p>
          <p className="text-3xl font-black mt-2">Active</p>
          <p className="text-[10px] text-blue-200 mt-1">Valid till Mar 2027</p>
        </div>
        <div className="kpi-card-dark rounded-2xl p-5 shadow-md">
          <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider font-bold">Inspection Frequency</p>
          <p className="text-3xl font-black mt-2">Reduced</p>
          <p className="text-[10px] text-slate-400 mt-1">Eligible for random virtual audits</p>
        </div>
      </div>

      {/* Main sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Simplified Self-Certification Checklist */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-emerald-600" />
              Simplified Safety Standards
            </CardTitle>
            <CardDescription className="text-xs">Required items for safety certificate compliance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklist.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b last:border-b-0 pb-2 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <Badge variant={item.status === "Pending" ? "destructive" : "secondary"} className="text-[10px]">
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* MSME Support */}
        <Card className="shadow-sm border-blue-200 bg-blue-50/10">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-600" />
              MSME Subsidies &amp; Support
            </CardTitle>
            <CardDescription className="text-xs">Avail financial benefits for safety upgrades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-xs font-semibold text-blue-900 leading-tight">Safety Upgrade Scheme</p>
              <p className="text-[11px] text-blue-700 mt-1">
                Get up to 50% subsidy on buying safety guards, PPE gears, and standard fire extinguisher systems.
              </p>
            </div>
            
            <div className="space-y-2">
              <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold">
                Apply for Safety Subsidy <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
              <Button variant="outline" className="w-full text-slate-700">
                Help &amp; Expert Advice
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
