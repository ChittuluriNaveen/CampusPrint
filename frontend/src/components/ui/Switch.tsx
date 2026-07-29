import React from 'react';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  id?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  id,
  className = '',
}) => {
  const switchId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const sizeClasses = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3 translate-x-0.5',
      translate: 'translate-x-4.5',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5 translate-x-0.5',
      translate: 'translate-x-5.5',
    },
  };

  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      <button
        type="button"
        id={switchId}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus-ring ${
          sizeClasses[size].track
        } ${checked ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span
          className={`pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out my-auto ${
            sizeClasses[size].thumb
          } ${checked ? sizeClasses[size].translate : 'translate-x-0.5'}`}
        />
      </button>
      {label && (
        <div className="flex flex-col">
          <label
            htmlFor={switchId}
            onClick={() => !disabled && onChange(!checked)}
            className={`text-sm font-medium text-slate-700 dark:text-slate-200 select-none cursor-pointer ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {label}
          </label>
          {description && <span className="text-xs text-slate-500 dark:text-slate-400">{description}</span>}
        </div>
      )}
    </div>
  );
};
