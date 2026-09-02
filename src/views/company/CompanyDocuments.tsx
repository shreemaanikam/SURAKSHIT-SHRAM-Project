import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Download,
  Trash2,
  Sparkles,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { DocumentItem, ComplianceCategory } from '../../types';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DocumentUploadModal } from '../../components/modals/DocumentUploadModal';
import { DocumentPreviewModal } from '../../components/modals/DocumentPreviewModal';

interface CompanyDocumentsProps {
  documents: DocumentItem[];
  onUploadSuccess: (newDoc: DocumentItem) => void;
  onDeleteDocument: (id: string) => void;
}

export const CompanyDocuments: React.FC<CompanyDocumentsProps> = ({
  documents,
  onUploadSuccess,
  onDeleteDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories: ComplianceCategory[] = [
    'EPFO',
    'ESIC',
    'Wages',
    'Attendance',
    'Working Hours',
    'Leave',
    'Safety',
    'Documents',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight">
              Statutory Document Centre
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              <Sparkles className="w-3 h-3" />
              OCR Enabled
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated OCR extraction, electronic payroll reconciliation & Labour Code verification
          </p>
        </div>

        <Button
          onClick={() => setIsUploadModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
          variant="orange"
          size="md"
        >
          Upload & Ingest Document
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, challan, or file name..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-hidden bg-slate-50 focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Status:</span>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified (Compliant)</option>
                <option value="processing">Processing (OCR)</option>
                <option value="rejected">Rejected (Discrepancy)</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-slate-400"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader
          action={
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredDocs.length} of {documents.length} records
            </span>
          }
        >
          <CardTitle subtitle="Tamper-evident statutory archives">
            Ingested Compliance Repository
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Document Details</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Period</th>
                  <th className="px-4 py-3.5">OCR Status</th>
                  <th className="px-4 py-3.5">Verification</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                      No documents match your query. Click "Upload & Ingest Document" to add one.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => setPreviewDoc(doc)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">
                              {doc.title}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {doc.fileName} • {doc.fileSize}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-medium text-slate-800">{doc.category}</span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-medium text-slate-700">{doc.periodCovered}</span>
                      </td>

                      <td className="px-4 py-4">
                        {doc.ocrStatus === 'completed' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {doc.ocrExtraction.matchConfidence}% Match
                          </span>
                        ) : doc.ocrStatus === 'processing' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold">
                            <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                            Processing
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Pending OCR</span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <Badge
                          size="sm"
                          variant={
                            doc.status === 'verified'
                              ? 'success'
                              : doc.status === 'rejected'
                              ? 'danger'
                              : 'warning'
                          }
                        >
                          {doc.status.toUpperCase()}
                        </Badge>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPreviewDoc(doc)}
                            title="Preview Extraction"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => alert(`Downloading: ${doc.fileName}`)}
                            title="Download"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteDocument(doc.id)}
                            className="text-slate-400 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Upload and Preview Modals */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={onUploadSuccess}
      />

      <DocumentPreviewModal
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        document={previewDoc}
      />
    </div>
  );
};
