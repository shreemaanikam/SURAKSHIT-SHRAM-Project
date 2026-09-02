import React from 'react';

interface BadgeProps {
  id?: string;
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'outline' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  id,
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const base = 'inline-flex items-center font-medium transition-colors select-none tracking-tight whitespace-nowrap rounded-md';

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs sm:text-sm px-3 py-1 gap-2',
  };

  const variantClasses = {
    default: 'bg-blue-50 text-blue-700 border border-blue-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    outline: 'bg-white text-slate-700 border border-slate-200',
    purple: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  };

  const dotClasses = {
    default: 'bg-blue-600',
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    danger: 'bg-rose-600',
    info: 'bg-sky-600',
    neutral: 'bg-slate-500',
    outline: 'bg-slate-600',
    purple: 'bg-indigo-600',
  };

  return (
    <span id={id} className={`${base} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotClasses[variant]}`} />}
      {children}
    </span>
  );
};
