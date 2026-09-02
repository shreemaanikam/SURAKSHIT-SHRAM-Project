import React from 'react';
import { Loader2, AlertCircle, FileX2, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const LoadingState: React.FC<{
  message?: string;
  submessage?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({
  message = 'Loading verified records...',
  submessage = 'Connecting to Shram Suvidha secure repository',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'py-8',
    md: 'py-16',
    lg: 'py-24',
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center px-4 ${sizeClasses[size]} ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-amber-600 animate-spin" />
        <Loader2 className="w-5 h-5 text-amber-600 absolute" />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-800">{message}</p>
      {submessage && <p className="mt-1 text-xs text-slate-500 max-w-sm">{submessage}</p>}
    </div>
  );
};

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}> = ({
  title = 'No records found',
  description = 'There are no active entries matching your current filter criteria.',
  icon,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 ${className}`}>
      <div className="p-3 rounded-xl bg-slate-100 text-slate-500 mb-4">
        {icon || <FileX2 className="w-8 h-8" />}
      </div>
      <h4 className="text-base font-bold text-slate-800">{title}</h4>
      <p className="mt-1 text-xs text-slate-500 max-w-md leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}> = ({
  title = 'Failed to load records',
  message = 'An error occurred while communicating with the central Labour portal. Please check your network or try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-rose-200 bg-rose-50/50 ${className}`}>
      <div className="p-3 rounded-full bg-rose-100 text-rose-600 mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-bold text-rose-900">{title}</h4>
      <p className="mt-1 text-xs text-rose-700 max-w-md leading-relaxed">{message}</p>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="mt-4 border-rose-300 text-rose-800 hover:bg-rose-100"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Retry Connection
        </Button>
      )}
    </div>
  );
};
