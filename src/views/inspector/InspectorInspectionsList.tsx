import React, { useState } from 'react';
import {
  ClipboardCheck,
  Search,
  Filter,
  MapPin,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { InspectionItem } from '../../types';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { RiskScoreBadge } from '../../components/ui/RiskScoreBadge';

interface InspectorInspectionsListProps {
  inspections: InspectionItem[];
  onSelectInspection: (id: string) => void;
}

export const InspectorInspectionsList: React.FC<InspectorInspectionsListProps> = ({
  inspections,
  onSelectInspection,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInspections = inspections.filter((insp) => {
    const matchesSearch =
      insp.establishmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insp.linNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insp.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || insp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5 pb-16 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
            Assigned Field Inspections
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic statutory inspection roster for Pune Central Enforcement Circle
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardBody className="p-3.5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search establishment name, LIN, or industrial area..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-hidden bg-slate-50 focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-hidden"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled (Pending)</option>
                <option value="completed">Completed (Signed)</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Inspections Roster List */}
      <div className="space-y-3">
        {filteredInspections.map((insp) => {
          const isCompleted = insp.status === 'completed';

          return (
            <Card
              key={insp.id}
              onClick={() => onSelectInspection(insp.id)}
              className="hover:border-amber-500 hover:shadow-md transition-all cursor-pointer"
            >
              <CardBody className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-3 rounded-xl shrink-0 ${
                        isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <ClipboardCheck className="w-6 h-6" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded">
                          {insp.linNumber}
                        </span>
                        <Badge size="sm" variant={isCompleted ? 'success' : 'warning'}>
                          {insp.status.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-slate-400 font-medium">
                          • {insp.industry}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {insp.establishmentName}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {insp.address}
                      </p>

                      <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="font-semibold text-slate-800">
                          Scheduled: {insp.scheduledDate}
                        </span>
                        <span>• Risk Index: {insp.riskScoreAtAssignment}/100</span>
                        {insp.checklist && (
                          <span>• {insp.checklist.length} Checklist Items</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                    <Button
                      size="sm"
                      variant={isCompleted ? 'outline' : 'orange'}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectInspection(insp.id);
                      }}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      {isCompleted ? 'View Report' : 'Open Audit'}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
