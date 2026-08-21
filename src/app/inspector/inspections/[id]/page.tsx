import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronLeft, Building2, UploadCloud, MapPin, Camera } from "lucide-react"
import Link from "next/link"

export default function InspectionDetails({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4 pb-8">
      {/* Header with back button */}
      <div className="flex items-center space-x-2 pb-2">
        <Link href="/inspector/inspections" className="p-2 -ml-2 rounded-full hover:bg-slate-200">
          <ChevronLeft className="h-6 w-6 text-slate-700" />
        </Link>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Inspection {params.id}</h2>
          <Badge variant="outline" className="mt-1 bg-warning/10 text-warning-foreground border-warning/20">Pending Execution</Badge>
        </div>
      </div>

      {/* Establishment Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-slate-500" />
            <span>Acme Corp</span>
          </CardTitle>
          <CardDescription>Primary Manufacturing Facility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-2 text-sm text-slate-600 mb-2">
            <MapPin className="h-4 w-4 mt-0.5 text-slate-400 shrink-0" />
            <p>123 Industrial Phase 1, MIDC, Andheri East, Mumbai</p>
          </div>
          <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-100 flex justify-between items-center">
            <span className="text-sm font-medium">Risk Score: B+</span>
            <span className="text-xs text-slate-500">Last visited: 6 mos ago</span>
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      <div className="pt-2">
        <h3 className="font-semibold text-slate-800 mb-3 px-1">Safety Checklist</h3>
        <Card className="mb-4">
          <CardContent className="p-0 divide-y divide-slate-100">
            <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 rounded-full border border-slate-300 flex items-center justify-center"></div>
                <span className="text-sm font-medium text-slate-700">Fire Exits Unblocked</span>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between bg-green-50/50">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-sm font-medium text-slate-900 line-through opacity-70">Proper Ventilation</span>
              </div>
            </div>
            <div className="p-4 flex flex-col space-y-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 rounded-full border border-slate-300 flex items-center justify-center"></div>
                <span className="text-sm font-medium text-slate-700 text-red-600 font-semibold">Machinery Guards</span>
              </div>
              <div className="ml-8 border-l-2 border-red-200 pl-4 py-1">
                <p className="text-xs text-slate-500 mb-2">Prior violation noted. Verify compliance.</p>
                <Button size="sm" variant="outline" className="h-8 text-xs bg-white text-slate-700 w-full justify-start">
                  <Camera className="mr-2 h-4 w-4" /> Add Photo Evidence
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evidence Upload */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">General Evidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 text-center">
            <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm font-medium text-slate-700">Tap to upload photos</p>
            <p className="text-xs text-slate-500 mt-1">or take a picture with camera</p>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full h-12 text-base font-medium shadow-sm mt-4">
        Complete Inspection
      </Button>
    </div>
  )
}
