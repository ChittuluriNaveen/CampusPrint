import React, { forwardRef } from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  error?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, description, className = '', disabled, id, ...props }, ref) => {
    const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col space-y-1">
        <div className="flex items-start space-x-2.5">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            disabled={disabled}
            className={`w-4 h-4 mt-0.5 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-600 focus:ring-offset-0 transition-colors cursor-pointer dark:bg-slate-800 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${className}`}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className={`text-sm font-medium text-slate-700 dark:text-slate-200 select-none cursor-pointer ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {label}
            </label>
          )}
        </div>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 pl-6.5">{description}</p>}
        {error && <p className="text-xs text-red-600 dark:text-red-400 font-medium pl-6.5">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
