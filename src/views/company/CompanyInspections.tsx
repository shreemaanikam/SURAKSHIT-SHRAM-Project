import React, { useState } from 'react';
import {
  ClipboardCheck,
  Calendar,
  UserCheck,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { InspectionItem } from '../../types';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

interface CompanyInspectionsProps {
  inspections: InspectionItem[];
}

export const CompanyInspections: React.FC<CompanyInspectionsProps> = ({ inspections }) => {
  const [selectedInspection, setSelectedInspection] = useState<InspectionItem | null>(null);

  const scheduledInspections = inspections.filter((i) => i.status === 'scheduled');
  const pastInspections = inspections.filter((i) => i.status === 'completed');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
            Inspection Schedules & Historical Records
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official field audits conducted under statutory authority of Central Labour Codes
          </p>
        </div>
      </div>

      {/* Upcoming Scheduled Inspections */}
      <Card className="border-amber-200 bg-amber-50/20">
        <CardHeader>
          <CardTitle subtitle="Mandatory on-site field visits">
            Upcoming Inspection Directives
          </CardTitle>
        </CardHeader>
        <CardBody className="p-5">
          {scheduledInspections.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500">
              No upcoming field inspections currently scheduled for this establishment.
            </div>
          ) : (
            scheduledInspections.map((insp) => (
              <div
                key={insp.id}
                className="p-5 rounded-xl border border-amber-300 bg-white shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">
                        {insp.inspectionNumber}
                      </span>
                      <Badge size="sm" variant="warning">
                        SCHEDULED AUDIT
                      </Badge>
                      <span className="text-xs text-slate-500">
                        • Assigned Risk Score: {insp.riskScoreAtAssignment}/100
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      Statutory Field Verification Audit
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">{insp.findingsSummary}</p>

                    <div className="mt-3 flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-slate-900">
                        <Calendar className="w-3.5 h-3.5 text-amber-700" />
                        Date: {insp.scheduledDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        Officer: {insp.inspectorName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedInspection(insp)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    View Checklist Brief
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardBody>
      </Card>

      {/* Historical Completed Inspections */}
      <Card>
        <CardHeader>
          <CardTitle subtitle="Signed audit records with geo-coordinates and digital verification">
            Historical Completed Audit Reports
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-100">
            {pastInspections.map((insp) => (
              <div
                key={insp.id}
                onClick={() => setSelectedInspection(insp)}
                className="p-5 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-700">
                        {insp.inspectionNumber}
                      </span>
                      <Badge size="sm" variant="success">
                        AUDIT COMPLETED
                      </Badge>
                      <span className="text-xs text-slate-400">
                        Completed on {insp.completedDate}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      {insp.findingsSummary}
                    </h4>

                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                      <span>Auditor: {insp.inspectorName}</span>
                      <span>• Recommendation: <strong className="text-slate-800">{insp.recommendation}</strong></span>
                      {insp.geoStamp && (
                        <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          GPS Verified: {insp.geoStamp.lat.toFixed(4)}° N, {insp.geoStamp.lng.toFixed(4)}° E
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedInspection(insp)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    Full Report
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => alert(`Downloading Certified PDF Audit Report: ${insp.inspectionNumber}`)}
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                  >
                    PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Inspection Modal */}
      {selectedInspection && (
        <Modal
          isOpen={!!selectedInspection}
          onClose={() => setSelectedInspection(null)}
          maxWidth="3xl"
          title={
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-amber-600" />
              <span>Inspection Record: {selectedInspection.inspectionNumber}</span>
            </div>
          }
          subtitle={`Establishment: ${selectedInspection.establishmentName}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-500 block">Scheduled Date</span>
                <span className="font-bold text-slate-900">{selectedInspection.scheduledDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Enforcement Officer</span>
                <span className="font-bold text-slate-900">{selectedInspection.inspectorName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Assigned Risk Index</span>
                <span className="font-bold text-slate-900">{selectedInspection.riskScoreAtAssignment}/100</span>
              </div>
              <div>
                <span className="text-slate-500 block">Recommendation</span>
                <span className="font-bold text-amber-800">{selectedInspection.recommendation}</span>
              </div>
            </div>

            {selectedInspection.geoStamp && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between font-mono text-[11px] text-emerald-900">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Geo-Stamp Verified: {selectedInspection.geoStamp.lat}° N, {selectedInspection.geoStamp.lng}° E
                </span>
                <span>Accuracy: ±{selectedInspection.geoStamp.accuracyMeters}m</span>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Statutory Checklist Verification Items ({selectedInspection.checklist.length})
              </h4>
              <div className="space-y-2">
                {selectedInspection.checklist.map((item) => (
                  <div key={item.id} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.question}</span>
                      <Badge
                        size="sm"
                        variant={
                          item.status === 'compliant'
                            ? 'success'
                            : item.status === 'non_compliant'
                            ? 'danger'
                            : 'neutral'
                        }
                      >
                        {item.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-slate-500 text-[11px] font-mono">{item.legalClause}</p>
                    {item.observation && (
                      <p className="text-slate-700 bg-slate-50 p-2 rounded text-[11px] mt-1">
                        <strong>Observation:</strong> {item.observation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
