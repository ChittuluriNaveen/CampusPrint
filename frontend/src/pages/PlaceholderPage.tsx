import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export interface PlaceholderPageProps {
  title: string;
  description: string;
  category: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description, category }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <Breadcrumb
        items={[
          { label: 'CampusPrint', href: '/' },
          { label: category },
          { label: title },
        ]}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h1>
            <Badge variant="primary" size="sm">
              UI Route Placeholder
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        </div>
      </div>

      <Card variant="default">
        <CardHeader>
          <CardTitle>{title} Module Container</CardTitle>
          <CardDescription>
            This route structure has been configured during Phase 02 (UI Foundation). Feature logic will be attached in future phases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 text-center space-y-3">
            <div className="text-4xl">📐</div>
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              UI Layout Shell Ready
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Consistent typography, design tokens, responsiveness, and theme switching infrastructure are active for this page view.
            </p>
            <div className="pt-2">
              <a href="/">
                <Button variant="outline" size="sm">
                  Return to Design System Showcase
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
