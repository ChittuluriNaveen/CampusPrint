import React, { forwardRef } from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className = '', disabled, id, ...props }, ref) => {
    const radioId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col space-y-0.5">
        <div className="flex items-center space-x-2.5">
          <input
            type="radio"
            id={radioId}
            ref={ref}
            disabled={disabled}
            className={`w-4 h-4 text-brand-600 border-slate-300 dark:border-slate-700 focus:ring-brand-600 focus:ring-offset-0 transition-colors cursor-pointer dark:bg-slate-800 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            } ${className}`}
            {...props}
          />
          {label && (
            <label
              htmlFor={radioId}
              className={`text-sm font-medium text-slate-700 dark:text-slate-200 select-none cursor-pointer ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {label}
            </label>
          )}
        </div>
        {description && <p className="text-xs text-slate-500 dark:text-slate-400 pl-6.5">{description}</p>}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export interface RadioGroupProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, error, children, className = '' }) => {
  return (
    <fieldset className={`flex flex-col space-y-2 ${className}`}>
      {label && <legend className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</legend>}
      <div className="flex flex-col space-y-2">{children}</div>
      {error && <span className="text-xs text-red-600 dark:text-red-400 font-medium">{error}</span>}
    </fieldset>
  );
};
