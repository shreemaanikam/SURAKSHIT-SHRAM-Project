import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserCircle, MapPin, Phone, Mail, ClipboardCheck, Shield } from "lucide-react"
import Link from "next/link"

export default function InspectorProfilePage() {
  return (
    <div className="space-y-4 pb-8">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">My Profile</h2>

      <Card>
        <CardContent className="pt-5 flex flex-col items-center text-center gap-3">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCircle className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Rajesh Kumar</h3>
            <p className="text-sm text-slate-500">Senior Labour Inspector</p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Shield className="h-3 w-3 mr-1" />Active — Verified
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <span>rajesh.kumar@maha.gov.in</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-700">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
            <span>Mumbai District, Maharashtra</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">This Month</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xl font-bold text-slate-900">14</div>
            <p className="text-xs text-slate-500 mt-0.5">Inspections</p>
          </div>
          <div>
            <div className="text-xl font-bold text-slate-900">3</div>
            <p className="text-xs text-slate-500 mt-0.5">Notices Issued</p>
          </div>
          <div>
            <div className="text-xl font-bold text-green-700">92%</div>
            <p className="text-xs text-slate-500 mt-0.5">On-time Rate</p>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="w-full" asChild>
        <Link href="/login">Sign Out</Link>
      </Button>
    </div>
  )
}
