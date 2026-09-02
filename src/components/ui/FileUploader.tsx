import React, { useRef, useState } from 'react';
import { UploadCloud, FileCheck2, AlertCircle, Trash2, FileText } from 'lucide-react';
import { Button } from './Button';

interface FileUploaderProps {
  id?: string;
  onFileSelect: (file: File) => void;
  acceptedFormats?: string;
  maxSizeBytes?: number;
  label?: string;
  description?: string;
  currentFile?: File | null;
  onClear?: () => void;
  isProcessing?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  id,
  onFileSelect,
  acceptedFormats = '.pdf,.jpg,.jpeg,.png,.docx',
  maxSizeBytes = 15 * 1024 * 1024, // 15MB
  label = 'Upload Statutory Document',
  description = 'PDF, JPG, PNG up to 15MB. Encrypted via e-Pramaan standard.',
  currentFile,
  onClear,
  isProcessing = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragOver(true);
    } else if (e.type === 'dragleave') {
      setIsDragOver(false);
    }
  };

  const validateAndPass = (file: File) => {
    setError(null);
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds limit (${(maxSizeBytes / (1024 * 1024)).toFixed(0)}MB).`);
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPass(e.target.files[0]);
    }
  };

  return (
    <div id={id} className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={acceptedFormats}
        onChange={handleChange}
        className="hidden"
      />

      {currentFile ? (
        <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800 shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{currentFile.name}</p>
              <p className="text-xs text-slate-500">
                {(currentFile.size / (1024 * 1024)).toFixed(2)} MB • Selected for OCR Verification
              </p>
            </div>
          </div>
          {onClear && !isProcessing && (
            <button
              type="button"
              onClick={onClear}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 sm:p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center ${
            isDragOver
              ? 'border-amber-500 bg-amber-50/50 scale-[0.99]'
              : 'border-slate-300 bg-slate-50/70 hover:bg-slate-100/70 hover:border-slate-400'
          }`}
        >
          <div className="p-3 rounded-full bg-white shadow-xs border border-slate-200 text-slate-600 mb-3">
            <UploadCloud className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-sm font-semibold text-slate-800">{label}</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>
          <div className="mt-3 flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              leftIcon={<FileText className="w-3.5 h-3.5" />}
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              Browse Files
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
