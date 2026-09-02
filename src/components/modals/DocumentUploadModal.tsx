import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FileUploader } from '../ui/FileUploader';
import { Badge } from '../ui/Badge';
import {
  FileText,
  Cpu,
  ScanText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ComplianceCategory, DocumentItem } from '../../types';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newDoc: DocumentItem) => void;
}

type StepState = 'select' | 'uploading' | 'ocr_processing' | 'data_extraction' | 'compliance_verification' | 'completed';

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ComplianceCategory>('Wages');
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('July 2026');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [step, setStep] = useState<StepState>('select');
  const [progress, setProgress] = useState(0);
  const [extractedResult, setExtractedResult] = useState<{
    fieldsCount: number;
    matchScore: number;
    headcount: number;
    totalAmount: string;
    challan: string;
    anomalies: string[];
    isCompliant: boolean;
  } | null>(null);

  const resetState = () => {
    setSelectedFile(null);
    setTitle('');
    setStep('select');
    setProgress(0);
    setExtractedResult(null);
  };

  const handleStartProcessing = () => {
    if (!selectedFile) return;

    setStep('uploading');
    setProgress(20);

    // Step 1: Upload (400ms)
    setTimeout(() => {
      setStep('ocr_processing');
      setProgress(45);

      // Step 2: OCR Processing (600ms)
      setTimeout(() => {
        setStep('data_extraction');
        setProgress(75);

        // Step 3: Data extraction (600ms)
        setTimeout(() => {
          setStep('compliance_verification');
          setProgress(90);

          // Step 4: Verification & Final result (500ms)
          setTimeout(() => {
            const isWagesOrEPFO = selectedCategory === 'Wages' || selectedCategory === 'EPFO';
            const mockExtracted = {
              fieldsCount: selectedCategory === 'Wages' ? 128 : 64,
              matchScore: 98.6,
              headcount: 1240,
              totalAmount: selectedCategory === 'Wages' ? '₹ 1,48,92,450' : '₹ 17,86,400',
              challan: `CHL-${selectedCategory.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
              anomalies:
                selectedCategory === 'ESIC'
                  ? ['38 contract helpers missing e-Pehchan card mapping']
                  : [],
              isCompliant: true,
            };

            setExtractedResult(mockExtracted);
            setStep('completed');
            setProgress(100);
          }, 600);
        }, 600);
      }, 600);
    }, 500);
  };

  const handleFinalSave = () => {
    if (!selectedFile) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      establishmentId: 'EST-MH-PUN-2024-8841',
      title: title || `${selectedCategory} Statutory Return (${period})`,
      category: selectedCategory,
      fileName: selectedFile.name,
      fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
      fileType: selectedFile.name.endsWith('.pdf') ? 'PDF Document' : 'Scanned Image',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      periodCovered: period,
      status: extractedResult?.anomalies.length ? 'rejected' : 'verified',
      ocrStatus: 'completed',
      ocrExtraction: {
        fieldsExtracted: extractedResult?.fieldsCount || 64,
        matchConfidence: extractedResult?.matchScore || 98.4,
        extractedWageTotal: extractedResult?.totalAmount,
        workerCountExtracted: extractedResult?.headcount,
        filingChallanNumber: extractedResult?.challan,
        anomaliesFound: extractedResult?.anomalies || [],
      },
      verifiedBy: 'AI LayoutLM + Shram Suvidha API Bridge',
      verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onSuccess(newDoc);
    resetState();
    onClose();
  };

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
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetState();
        onClose();
      }}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <span>Statutory Document AI Ingestion & Verification</span>
        </div>
      }
      subtitle="Automated OCR parsing, payroll cross-verification, and compliance validation"
    >
      {step === 'select' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Compliance Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ComplianceCategory)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Filing Period / Quarter <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="e.g. July 2026 / Q2 2026-27"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Document Label / Custom Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`e.g. Form A - Register of ${selectedCategory} (${period})`}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Statutory File <span className="text-rose-500">*</span>
            </label>
            <FileUploader
              onFileSelect={(file) => setSelectedFile(file)}
              currentFile={selectedFile}
              onClear={() => setSelectedFile(null)}
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={!selectedFile}
              onClick={handleStartProcessing}
              leftIcon={<Cpu className="w-4 h-4" />}
            >
              Start AI Extraction
            </Button>
          </div>
        </div>
      )}

      {/* Processing Pipeline View */}
      {step !== 'select' && step !== 'completed' && (
        <div className="py-6 space-y-6">
          <div className="text-center">
            <div className="inline-flex p-3 rounded-2xl bg-amber-50 text-amber-700 mb-3 border border-amber-200">
              <Cpu className="w-8 h-8 animate-spin" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {step === 'uploading' && 'Encrypting & Storing File to Secure Repository...'}
              {step === 'ocr_processing' && 'Running Deep OCR LayoutLM Document Analysis...'}
              {step === 'data_extraction' && 'Extracting Worker Records, Challans & Net Disbursals...'}
              {step === 'compliance_verification' && 'Cross-Verifying with EPFO/ESIC Gateways & Minimum Wage Rules...'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Surakshit Shram Automated Multi-Stage Verification Pipeline
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Pipeline Milestones */}
          <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
            <div className={`p-2 rounded-lg border ${step === 'uploading' ? 'bg-amber-50 border-amber-300 font-bold text-amber-900' : 'bg-slate-50 text-slate-500'}`}>
              1. Upload
            </div>
            <div className={`p-2 rounded-lg border ${step === 'ocr_processing' ? 'bg-amber-50 border-amber-300 font-bold text-amber-900' : 'bg-slate-50 text-slate-500'}`}>
              2. OCR Scan
            </div>
            <div className={`p-2 rounded-lg border ${step === 'data_extraction' ? 'bg-amber-50 border-amber-300 font-bold text-amber-900' : 'bg-slate-50 text-slate-500'}`}>
              3. Extraction
            </div>
            <div className={`p-2 rounded-lg border ${step === 'compliance_verification' ? 'bg-amber-50 border-amber-300 font-bold text-amber-900' : 'bg-slate-50 text-slate-500'}`}>
              4. Verification
            </div>
          </div>
        </div>
      )}

      {/* Completed result preview */}
      {step === 'completed' && extractedResult && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-emerald-950">
                Document Successfully Verified & Digitized
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                LayoutLM extracted {extractedResult.fieldsCount} statutory data cells with {extractedResult.matchScore}% confidence match.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block">Worker Count</span>
              <span className="font-bold text-slate-900 text-sm">{extractedResult.headcount} Workers</span>
            </div>
            <div>
              <span className="text-slate-500 block">Statutory Total Amount</span>
              <span className="font-bold text-slate-900 text-sm">{extractedResult.totalAmount}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Challan / TRRN</span>
              <span className="font-mono font-bold text-slate-900 text-xs">{extractedResult.challan}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Confidence Score</span>
              <span className="font-bold text-emerald-600 text-sm">{extractedResult.matchScore}%</span>
            </div>
            <div>
              <span className="text-slate-500 block">Category</span>
              <span className="font-bold text-slate-900 text-sm">{selectedCategory}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Verification Status</span>
              <Badge size="sm" variant="success">Compliant</Badge>
            </div>
          </div>

          {extractedResult.anomalies.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Noticeable Anomalies Detected</span>
              </span>
              <ul className="text-xs text-amber-800 list-disc list-inside space-y-0.5">
                {extractedResult.anomalies.map((ano, i) => (
                  <li key={i}>{ano}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={resetState}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Upload Another
            </Button>
            <Button size="sm" onClick={handleFinalSave} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Save to Statutory Repository
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
