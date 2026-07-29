import React from 'react';
import { Loader } from './Loader';

export const TableContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm ${className}`}>
      <table className="w-full text-left border-collapse text-sm">{children}</table>
    </div>
  );
};

export const TableHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <thead className={`bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${className}`}>
      {children}
    </thead>
  );
};

export const TableBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <tbody className={`divide-y divide-slate-100 dark:divide-slate-700/60 ${className}`}>{children}</tbody>;
};

export const TableRow: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({
  children,
  className = '',
  onClick,
}) => {
  return (
    <tr
      onClick={onClick}
      className={`hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
};

export const TableHead: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <th className={`p-4 text-left font-semibold text-slate-700 dark:text-slate-300 ${className}`}>{children}</th>;
};

export const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <td className={`p-4 text-slate-900 dark:text-slate-100 ${className}`}>{children}</td>;
};

export const TableEmptyState: React.FC<{ message?: string; colSpan: number }> = ({
  message = 'No data available',
  colSpan,
}) => {
  return (
    <tr>
      <td colSpan={colSpan} className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
        {message}
      </td>
    </tr>
  );
};

export const TableLoadingState: React.FC<{ colSpan: number }> = ({ colSpan }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="p-8 text-center">
        <div className="flex justify-center items-center space-x-2">
          <Loader size="sm" />
          <span className="text-sm text-slate-500 dark:text-slate-400">Loading data...</span>
        </div>
      </td>
    </tr>
  );
};
