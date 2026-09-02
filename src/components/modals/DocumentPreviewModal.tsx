import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  FileText,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Building,
  UserCheck,
} from 'lucide-react';
import { DocumentItem } from '../../types';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  if (!document) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-600" />
          <span className="truncate">{document.title}</span>
        </div>
      }
      subtitle={`Category: ${document.category} • Period: ${document.periodCovered}`}
      footer={
        <div className="w-full flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            SHA256: 8f9b...a4e1 (Tamper-Evident e-Sign)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() => alert(`Downloading statutory archive: ${document.fileName}`)}
            >
              Download Original
            </Button>
            <Button size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Verification Status Card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {document.status === 'verified' ? (
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            ) : document.status === 'rejected' ? (
              <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                <AlertCircle className="w-5 h-5" />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <Clock className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 capitalize">
                  {document.status === 'verified'
                    ? 'Legally Compliant & Verified'
                    : document.status === 'rejected'
                    ? 'Compliance Discrepancy Flagged'
                    : 'Pending Automated Scrutiny'}
                </h4>
                <Badge
                  size="sm"
                  variant={
                    document.status === 'verified'
                      ? 'success'
                      : document.status === 'rejected'
                      ? 'danger'
                      : 'warning'
                  }
                >
                  {document.status.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {document.verifiedBy ? `Verified by ${document.verifiedBy}` : 'Ingested by Portal'} on {document.uploadedAt}
              </p>
            </div>
          </div>
        </div>

        {/* Rejection notice if flagged */}
        {document.status === 'rejected' && document.rejectionReason && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
            <h5 className="font-bold flex items-center gap-1.5 mb-1 text-rose-950">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              Reason for Non-Acceptance
            </h5>
            <p className="leading-relaxed">{document.rejectionReason}</p>
          </div>
        )}

        {/* OCR Extracted Data Matrix */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            AI LayoutLM Extracted Structured Entities
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] text-slate-500 block">Extracted Headcount</span>
              <span className="font-bold text-slate-900 text-sm">
                {document.ocrExtraction.workerCountExtracted
                  ? `${document.ocrExtraction.workerCountExtracted} Workers`
                  : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Reported Disbursal</span>
              <span className="font-bold text-slate-900 text-sm">
                {document.ocrExtraction.extractedWageTotal || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Filing / TRRN Ref</span>
              <span className="font-mono text-xs font-bold text-slate-900 truncate block">
                {document.ocrExtraction.filingChallanNumber || 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">OCR Match Confidence</span>
              <span className="font-bold text-emerald-600 text-sm">
                {document.ocrExtraction.matchConfidence}%
              </span>
            </div>
          </div>
        </div>

        {/* Simulated Document Viewer Canvas */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Document Visual Viewer
          </h4>
          <div className="rounded-xl border border-slate-300 bg-slate-100 p-8 flex flex-col items-center justify-center text-center min-h-[220px]">
            <div className="p-4 rounded-2xl bg-white shadow-xs border border-slate-200 text-slate-700 mb-3">
              <FileText className="w-12 h-12 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-800">{document.fileName}</p>
            <p className="text-xs text-slate-500 mt-1">{document.fileSize} • Digitally Certified Copy</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Valid Ministry of Labour e-Signature
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
