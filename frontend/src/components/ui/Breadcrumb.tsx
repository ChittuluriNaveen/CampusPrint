import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 ${className}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 flex-shrink-0" />}
            {isLast ? (
              <span className="font-semibold text-slate-900 dark:text-slate-100 select-none">{item.label}</span>
            ) : item.href ? (
              <a
                href={item.href}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors select-none"
              >
                {item.label}
              </a>
            ) : item.onClick ? (
              <button
                onClick={item.onClick}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors select-none"
              >
                {item.label}
              </button>
            ) : (
              <span className="select-none">{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
