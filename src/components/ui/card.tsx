import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  id,
  children,
  className = '',
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      id={id}
      className={`bg-white rounded-2xl border border-slate-200 shadow-xs ${
        hoverEffect ? 'transition-all duration-200 hover:shadow-md hover:border-slate-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}> = ({ children, className = '', action }) => (
  <div className={`px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between gap-4 ${className}`}>
    <div>{children}</div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const CardTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
  subtitle?: React.ReactNode;
}> = ({ children, className = '', subtitle }) => (
  <div>
    <h3 className={`text-sm sm:text-base font-bold text-slate-800 tracking-tight ${className}`}>
      {children}
    </h3>
    {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
  </div>
);

export const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`p-5 sm:p-6 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`px-5 sm:px-6 py-3.5 sm:py-4 bg-slate-50/50 border-t border-slate-100 rounded-b-2xl ${className}`}>
    {children}
  </div>
);
