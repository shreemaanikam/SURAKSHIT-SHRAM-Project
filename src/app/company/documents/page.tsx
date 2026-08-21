"use client"

import { useState } from "react"
import { mockDocuments } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UploadCloud, FileText, CheckCircle2, AlertTriangle, Clock, Download } from "lucide-react"

function StatusBadge({ status }: { status: string }) {
  if (status === "valid")
    return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="h-3 w-3 mr-1 shrink-0" />Valid</Badge>
  if (status === "expiring_soon")
    return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="h-3 w-3 mr-1 shrink-0" />Expiring Soon</Badge>
  if (status === "expired")
    return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><AlertTriangle className="h-3 w-3 mr-1 shrink-0" />Expired</Badge>
  return <Badge variant="outline" className="bg-slate-100 text-slate-600">Pending Upload</Badge>
}

export default function DocumentsPage() {
  const [dragging, setDragging] = useState(false)
  const expiredCount = mockDocuments.filter((d) => d.status === "expired").length
  const expiringCount = mockDocuments.filter((d) => d.status === "expiring_soon").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Documents</h2>
          <p className="text-slate-500">Manage all statutory licences, certificates, and returns.</p>
        </div>
      </div>

      {(expiredCount > 0 || expiringCount > 0) && (
        <Card className="border-l-4 border-l-warning">
          <CardContent className="py-3 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-900">Document Attention Required</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {expiredCount > 0 && `${expiredCount} document(s) expired. `}
                {expiringCount > 0 && `${expiringCount} document(s) expiring within 30 days.`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload zone */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Upload Document</CardTitle>
          <CardDescription>Upload a new licence, NOC, or return filing</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false) }}
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
              dragging ? "border-primary bg-primary/5" : "border-slate-300 bg-slate-50 hover:border-slate-400"
            }`}
          >
            <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
            <p className="text-sm font-medium text-slate-700">Drag & drop files here, or click to browse</p>
            <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG up to 10 MB</p>
            <Button variant="outline" size="sm" className="mt-4">Browse Files</Button>
          </div>
        </CardContent>
      </Card>

      {/* Document list */}
      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {mockDocuments.map((doc) => (
              <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                    <p className="text-xs text-slate-500">
                      {doc.type} · Expires: {doc.expiryDate}
                      {doc.fileSize && ` · ${doc.fileSize}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 pl-12 sm:pl-0">
                  <StatusBadge status={doc.status} />
                  {doc.fileSize && (
                    <Button size="icon" variant="ghost" className="h-8 w-8" title="Download">
                      <Download className="h-4 w-4 text-slate-500" />
                    </Button>
                  )}
                  {(doc.status === "expired" || doc.status === "pending_upload") && (
                    <Button size="sm">Renew</Button>
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
