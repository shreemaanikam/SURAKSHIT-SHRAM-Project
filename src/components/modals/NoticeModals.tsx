import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { FileUploader } from '../ui/FileUploader';
import {
  AlertTriangle,
  Calendar,
  Clock,
  Send,
  Building,
  UserCheck,
  FileCheck2,
  Scale,
  Paperclip,
  CheckCircle2,
} from 'lucide-react';
import { NoticeItem } from '../../types';

export const NoticeDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  notice: NoticeItem | null;
  onOpenResponse: (notice: NoticeItem) => void;
}> = ({ isOpen, onClose, notice, onOpenResponse }) => {
  if (!notice) return null;

  const isOverdue = new Date(notice.dueDate) < new Date() && notice.status !== 'resolved';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-600" />
          <span>Statutory Compliance Notice: {notice.noticeNumber}</span>
        </div>
      }
      subtitle={`Issued under authority of ${notice.issuingOfficer}`}
      footer={
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Due Date: {notice.dueDate}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            {notice.status !== 'resolved' && (
              <Button
                size="sm"
                variant="orange"
                onClick={() => {
                  onClose();
                  onOpenResponse(notice);
                }}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Submit Formal Response
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Severity Banner */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${notice.severity === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">{notice.title}</h4>
                <Badge
                  size="sm"
                  variant={notice.severity === 'critical' ? 'danger' : notice.severity === 'high' ? 'warning' : 'info'}
                >
                  {notice.severity.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Category: {notice.category}</p>
            </div>
          </div>

          <div className="text-right">
            <Badge size="sm" variant={notice.status === 'resolved' ? 'success' : isOverdue ? 'danger' : 'warning'}>
              {notice.status.toUpperCase().replace('_', ' ')}
            </Badge>
          </div>
        </div>

        {/* Legal provision box */}
        <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs">
          <div className="font-bold text-amber-950 flex items-center gap-1.5 mb-1">
            <Scale className="w-4 h-4 text-amber-700" />
            <span>Statutory Legal Provision Invoked</span>
          </div>
          <p className="font-mono text-amber-900">{notice.legalProvision}</p>
        </div>

        {/* Detailed Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Statement of Non-Compliance & Allegations
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
            {notice.description}
          </p>
        </div>

        {/* Potential Penalty Clause */}
        <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl text-xs text-rose-900">
          <span className="font-bold block mb-0.5">Statutory Penalty Warning:</span>
          <p>{notice.potentialPenalty}</p>
        </div>

        {/* Responses Thread */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Response & Evidence Trail ({notice.responses.length})
          </h4>
          {notice.responses.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
              No response has been submitted yet. Please submit your explanation and evidence before the due date.
            </div>
          ) : (
            <div className="space-y-3">
              {notice.responses.map((resp) => (
                <div key={resp.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{resp.submittedBy}</span>
                    <span className="text-slate-500">{resp.submittedAt}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                    {resp.responseText}
                  </p>
                  {resp.attachments.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-semibold text-slate-500">Evidence Attached:</span>
                      {resp.attachments.map((att, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-mono text-[11px]">
                          <Paperclip className="w-3 h-3" />
                          {att.name} ({att.size})
                        </span>
                      ))}
                    </div>
                  )}
                  {resp.officialRemarks && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                      <strong className="block text-[11px] text-emerald-950">Official Review Remarks:</strong>
                      {resp.officialRemarks}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export const NoticeResponseModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  notice: NoticeItem | null;
  onSubmit: (noticeId: string, responseText: string, attachments: { name: string; size: string }[]) => void;
}> = ({ isOpen, onClose, notice, onSubmit }) => {
  const [responseText, setResponseText] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!notice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const attachments = attachedFile
        ? [{ name: attachedFile.name, size: `${(attachedFile.size / (1024 * 1024)).toFixed(2)} MB` }]
        : [];
      onSubmit(notice.id, responseText, attachments);
      setIsSubmitting(false);
      setResponseText('');
      setAttachedFile(null);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-amber-600" />
          <span>Respond to Notice #{notice.noticeNumber}</span>
        </div>
      }
      subtitle={`Category: ${notice.category} • Due: ${notice.dueDate}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
          <strong className="block text-slate-900 mb-0.5">{notice.title}</strong>
          <p className="line-clamp-2">{notice.description}</p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Formal Legal Reply & Clarification <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="State your establishment's explanation, compliance steps taken, or rectification proof details..."
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-hidden leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Upload Evidence / Proof of Rectification
          </label>
          <FileUploader
            onFileSelect={(file) => setAttachedFile(file)}
            currentFile={attachedFile}
            onClear={() => setAttachedFile(null)}
            label="Upload Challan, Muster, or Corrected Register"
          />
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!responseText.trim()}
            variant="orange"
            leftIcon={<Send className="w-4 h-4" />}
          >
            Submit Response to Officer
          </Button>
        </div>
      </form>
    </Modal>
  );
};
