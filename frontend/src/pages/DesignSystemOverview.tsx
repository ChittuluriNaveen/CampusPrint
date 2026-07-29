import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { Radio, RadioGroup } from '../components/ui/Radio';
import { Switch } from '../components/ui/Switch';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import {
  TableContainer,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui/Table';
import { Skeleton, ProgressBar } from '../components/ui/Loader';
import { EmptyState } from '../components/ui/EmptyState';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Pagination } from '../components/ui/Pagination';
import { Avatar } from '../components/ui/Avatar';
import { Dropdown } from '../components/ui/Dropdown';
import { Tooltip } from '../components/ui/Tooltip';
import { useToast } from '../contexts/ToastContext';
import { Search, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

export const DesignSystemOverview: React.FC = () => {
  const { success, error, warning, info } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioSelected, setRadioSelected] = useState('double');

  const sampleTableData = [
    { id: 'CP-1001', student: 'Alex Johnson', document: 'Thesis_Final.pdf', pages: 42, total: '₹126.00', status: 'success' as const },
    { id: 'CP-1002', student: 'Maria Garcia', document: 'Lab_Report_04.docx', pages: 12, total: '₹36.00', status: 'primary' as const },
    { id: 'CP-1003', student: 'David Chen', document: 'Presentation.pptx', pages: 28, total: '₹84.00', status: 'warning' as const },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <Breadcrumb items={[{ label: 'CampusPrint' }, { label: 'UI Foundation' }, { label: 'Design System Gallery' }]} />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Design System & UI Components
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Phase 02 UI architecture foundation, responsive layout grid, color tokens, and accessible component library.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="success" dot size="md">
              Phase 02 Active
            </Badge>
          </div>
        </div>
      </div>

      {/* 1. Buttons & Action Components */}
      <Card variant="default">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Buttons & Trigger Components</span>
          </CardTitle>
          <CardDescription>Primary, secondary, outline, ghost, and danger variants with loading states.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Primary Button
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="primary" isLoading>
              Loading
            </Button>
            <Button variant="outline" disabled>
              Disabled
            </Button>
          </div>

          <div className="flex items-center space-x-4 pt-2">
            <Dropdown
              trigger={
                <Button variant="outline" size="sm">
                  Dropdown Menu Options
                </Button>
              }
              items={[
                { label: 'Edit Configuration', onClick: () => info('Edit Selected', 'Action triggered.') },
                { label: 'Duplicate Entry', onClick: () => success('Duplicated', 'Entry created.') },
                { label: 'Delete Item', onClick: () => error('Deleted', 'Entry removed.'), danger: true },
              ]}
            />

            <Tooltip content="Tooltip helper text on hover" position="top">
              <Button variant="ghost" size="sm">
                Hover for Tooltip
              </Button>
            </Tooltip>
          </div>
        </CardContent>
      </Card>

      {/* 2. Form Inputs & Controls */}
      <Card variant="default">
        <CardHeader>
          <CardTitle>Form Controls & Input Elements</CardTitle>
          <CardDescription>Accessible text inputs, selects, textareas, checkboxes, radio options, and switches.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Standard Text Input" placeholder="Enter student ID..." leftIcon={<Search className="w-4 h-4" />} />
            <Input label="Input with Error" placeholder="email@campus.edu" error="Please enter a valid institutional email" />
            <Select
              label="Paper Size Select"
              options={[
                { value: 'A4', label: 'A4 Standard (210 x 297 mm)' },
                { value: 'A3', label: 'A3 Large (297 x 420 mm)' },
                { value: 'Letter', label: 'Letter (8.5 x 11 in)' },
              ]}
            />
          </div>

          <Textarea label="Order Remarks" placeholder="Add custom binding or lamination instructions..." />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <Checkbox
              label="Enable Duplex Printing"
              description="Print on both sides of the sheet"
              checked={checkboxChecked}
              onChange={e => setCheckboxChecked(e.target.checked)}
            />

            <RadioGroup label="Color Mode Selection">
              <Radio
                name="colorMode"
                value="bw"
                label="Black & White"
                checked={radioSelected === 'bw'}
                onChange={() => setRadioSelected('bw')}
              />
              <Radio
                name="colorMode"
                value="double"
                label="Full Color Printing"
                checked={radioSelected === 'double'}
                onChange={() => setRadioSelected('double')}
              />
            </RadioGroup>

            <Switch
              label="Real-time Notifications"
              description="Receive alert toasts on order status update"
              checked={switchChecked}
              onChange={setSwitchChecked}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Feedback System (Toasts, Modals, Loaders) */}
      <Card variant="default">
        <CardHeader>
          <CardTitle>Feedback & Notification System</CardTitle>
          <CardDescription>Toast notifications queue, interactive modal dialogs, and progress indicators.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => success('Order Created', 'Order #CP-1089 submitted to queue.')}>
              Trigger Success Toast
            </Button>
            <Button variant="outline" size="sm" onClick={() => warning('High Queue Volume', 'Estimated wait time is 15 minutes.')}>
              Trigger Warning Toast
            </Button>
            <Button variant="outline" size="sm" onClick={() => error('Payment Failed', 'Transaction could not be verified.')}>
              Trigger Error Toast
            </Button>
            <Button variant="outline" size="sm" onClick={() => info('System Maintenance', 'Scheduled for 11:00 PM tonight.')}>
              Trigger Info Toast
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
              Open Interactive Modal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Progress & Loading Indicators</h4>
              <ProgressBar value={65} label="File Processing Progress" showPercentage variant="primary" />
              <ProgressBar value={90} label="Upload Streaming Status" showPercentage variant="success" />
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">Skeleton Loading States</h4>
              <div className="space-y-2">
                <Skeleton height={16} width="80%" />
                <Skeleton height={14} width="60%" />
                <Skeleton height={14} width="40%" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Data Display (Tables, Badges, Avatars, Empty States) */}
      <Card variant="default">
        <CardHeader>
          <CardTitle>Data Display & Table Components</CardTitle>
          <CardDescription>Responsive data tables, badge status pill indicators, and avatars.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success">Success Badge</Badge>
            <Badge variant="warning">Warning Badge</Badge>
            <Badge variant="error">Error Badge</Badge>
            <Badge variant="info">Info Badge</Badge>
            <Badge variant="neutral">Neutral Badge</Badge>
            <Badge variant="primary" dot>
              Dot Badge
            </Badge>
            <Avatar name="Alex Johnson" size="md" />
            <Avatar name="Campus Admin" size="md" />
          </div>

          <TableContainer>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Document File</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleTableData.map(row => (
                <TableRow key={row.id}>
                  <TableCell className="font-semibold text-brand-600">{row.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar name={row.student} size="sm" />
                      <span>{row.student}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 font-mono text-xs">{row.document}</TableCell>
                  <TableCell>{row.pages} pages</TableCell>
                  <TableCell className="font-medium">{row.total}</TableCell>
                  <TableCell>
                    <Badge variant={row.status} size="sm">
                      {row.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableContainer>

          <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
        </CardContent>
        <CardFooter className="text-xs text-slate-500 dark:text-slate-400">
          Showing 3 of 15 registered print queue items.
        </CardFooter>
      </Card>

      {/* 5. Empty State Demonstration */}
      <EmptyState
        icon={<CheckCircle2 className="w-8 h-8 text-brand-600" />}
        title="UI Foundation & Component Library Ready"
        description="All design system tokens, typography scales, light/dark mode Contexts, and layout components have been established."
        action={
          <Button variant="primary" size="sm" onClick={() => success('System Verified', 'Phase 02 UI Foundation is ready.')}>
            Verify UI System Setup
          </Button>
        }
      />

      {/* Modal Demonstration Container */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Modal Container Demonstration"
        description="Standard modal dialog supporting backdrop blur, escape listener, and action buttons."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
                success('Action Confirmed', 'Modal payload processed.');
              }}
            >
              Confirm Action
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>
            This modal is built with full keyboard accessibility (press <kbd className="px-1.5 py-0.5 text-xs bg-slate-100 dark:bg-slate-700 rounded">Esc</kbd> to exit) and aria-dialog roles.
          </p>
          <Input label="Modal Input Field" placeholder="Type inside modal..." />
        </div>
      </Modal>
    </div>
  );
};
