import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-700/80 ${className}`}>
      {icon && (
        <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full mb-4 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
      {description && <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};
