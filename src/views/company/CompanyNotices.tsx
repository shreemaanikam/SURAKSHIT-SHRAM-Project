import React, { useState } from 'react';
import {
  AlertOctagon,
  Search,
  Filter,
  Clock,
  Send,
  Download,
  AlertTriangle,
  Scale,
  Eye,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { NoticeItem, ComplianceCategory } from '../../types';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { NoticeDetailModal, NoticeResponseModal } from '../../components/modals/NoticeModals';

interface CompanyNoticesProps {
  notices: NoticeItem[];
  onSubmitResponse: (noticeId: string, responseText: string, attachments: { name: string; size: string }[]) => void;
}

export const CompanyNotices: React.FC<CompanyNoticesProps> = ({
  notices,
  onSubmitResponse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedNoticeForView, setSelectedNoticeForView] = useState<NoticeItem | null>(null);
  const [selectedNoticeForResponse, setSelectedNoticeForResponse] = useState<NoticeItem | null>(null);

  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.noticeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.legalProvision.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = severityFilter === 'all' || n.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
            Notices & Show-Cause Registry
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Formal statutory communications, inspection queries, and electronic response tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800">
            {notices.filter((n) => n.status !== 'resolved').length} Actionable Notices
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Notice #, provision, or query title..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-hidden bg-slate-50 focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-medium">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-hidden"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Notices Grid */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => {
          const isOverdue = new Date(notice.dueDate) < new Date() && notice.status !== 'resolved';
          const isResolved = notice.status === 'resolved';

          return (
            <Card
              key={notice.id}
              className={`transition-all ${
                notice.severity === 'critical' && !isResolved
                  ? 'border-rose-300 bg-rose-50/10'
                  : ''
              }`}
            >
              <CardBody className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl shrink-0 ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-700'
                          : notice.severity === 'critical'
                          ? 'bg-rose-100 text-rose-700'
                          : notice.severity === 'high'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {isResolved ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <AlertOctagon className="w-6 h-6" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {notice.noticeNumber}
                        </span>
                        <Badge
                          size="sm"
                          variant={
                            notice.severity === 'critical'
                              ? 'danger'
                              : notice.severity === 'high'
                              ? 'warning'
                              : 'info'
                          }
                        >
                          {notice.severity.toUpperCase()}
                        </Badge>
                        <Badge
                          size="sm"
                          variant={
                            isResolved
                              ? 'success'
                              : isOverdue
                              ? 'danger'
                              : notice.status === 'under_review'
                              ? 'purple'
                              : 'warning'
                          }
                        >
                          {isOverdue ? 'OVERDUE' : notice.status.toUpperCase().replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-slate-400 font-medium">
                          • Category: {notice.category}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-1">{notice.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {notice.description}
                      </p>

                      <div className="pt-1.5 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                        <span className="font-mono text-[11px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {notice.legalProvision}
                        </span>
                        <span>Issued by: {notice.issuingOfficer}</span>
                        <span>Issue Date: {notice.issueDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions & Due Date */}
                  <div className="flex items-center lg:flex-col lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Compliance Deadline
                      </span>
                      <span
                        className={`text-xs font-bold flex items-center gap-1 ${
                          isResolved
                            ? 'text-emerald-700'
                            : isOverdue
                            ? 'text-rose-700 font-extrabold'
                            : 'text-amber-800'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {notice.dueDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedNoticeForView(notice)}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        View Notice
                      </Button>
                      {!isResolved && (
                        <Button
                          size="sm"
                          variant="orange"
                          onClick={() => setSelectedNoticeForResponse(notice)}
                          leftIcon={<Send className="w-3.5 h-3.5" />}
                        >
                          Respond
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Modals */}
      <NoticeDetailModal
        isOpen={!!selectedNoticeForView}
        onClose={() => setSelectedNoticeForView(null)}
        notice={selectedNoticeForView}
        onOpenResponse={(notice) => {
          setSelectedNoticeForView(null);
          setSelectedNoticeForResponse(notice);
        }}
      />

      <NoticeResponseModal
        isOpen={!!selectedNoticeForResponse}
        onClose={() => setSelectedNoticeForResponse(null)}
        notice={selectedNoticeForResponse}
        onSubmit={onSubmitResponse}
      />
    </div>
  );
};
