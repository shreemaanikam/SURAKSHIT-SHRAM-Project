import { mockEstablishments } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

function RiskBadge({ grade }: { grade: string }) {
  const high = ["F", "D", "C-", "C"].includes(grade)
  const medium = ["C+", "B-", "B"].includes(grade)
  if (high) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 font-bold">{grade}</Badge>
  if (medium) return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 font-bold">{grade}</Badge>
  return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-bold">{grade}</Badge>
}

export default function EstablishmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Establishments</h2>
          <p className="text-slate-500">All registered establishments under Maharashtra jurisdiction.</p>
        </div>
        <Button variant="outline" className="shrink-0">
          <Filter className="h-4 w-4 mr-2" />Filter
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search by name, district, or registration ID…" className="pl-9" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Establishment</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Last Inspection</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEstablishments.map((est) => (
                  <TableRow key={est.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center shrink-0">
                          <Building2 className="h-4 w-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{est.name}</p>
                          <p className="text-xs text-slate-500">{est.registrationId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{est.industry}</TableCell>
                    <TableCell className="text-sm text-slate-600">{est.district}</TableCell>
                    <TableCell className="text-sm text-slate-600">{est.employeeCount}</TableCell>
                    <TableCell><RiskBadge grade={est.riskGrade} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${est.complianceRate}%`,
                              backgroundColor: est.complianceRate >= 80 ? "#16a34a" : est.complianceRate >= 60 ? "#d97706" : "#dc2626",
                            }}
                          />
                        </div>
                        <span className="text-xs text-slate-600">{est.complianceRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">{est.lastInspection}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-primary">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
