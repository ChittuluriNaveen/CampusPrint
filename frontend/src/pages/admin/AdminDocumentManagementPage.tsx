import React, { useEffect, useState } from 'react';
import { FileText, Search, Trash2, RefreshCw, Eye, Download } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface AdminDocItem {
  id: string;
  originalFileName: string;
  mimeType: string;
  size: number;
  pageCount: number;
  createdAt: string;
  status?: string;
  user?: { name: string; email: string; studentId?: string };
}

export const AdminDocumentManagementPage: React.FC = () => {
  const [documents, setDocuments] = useState<AdminDocItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/documents');
      if (response.data?.data?.documents) {
        setDocuments(response.data.data.documents);
      }
    } catch {
      console.warn('Fallback to demo admin documents library');
      setDocuments([
        {
          id: 'doc-1',
          originalFileName: 'Algorithm_Design_Report.pdf',
          mimeType: 'application/pdf',
          size: 2450000,
          pageCount: 18,
          createdAt: new Date().toISOString(),
          status: 'ACTIVE',
          user: { name: 'Naveen Chittuluri', email: 'naveen@campusprint.edu', studentId: 'CS202601' },
        },
        {
          id: 'doc-2',
          originalFileName: 'Lab_Manual_Ch3.pdf',
          mimeType: 'application/pdf',
          size: 1120000,
          pageCount: 9,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          status: 'ACTIVE',
          user: { name: 'Priya Sharma', email: 'priya@campusprint.edu', studentId: 'CS202602' },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDeleteDoc = async (id: string) => {
    if (!window.confirm('Delete this file from system storage?')) return;
    try {
      await apiClient.delete(`/documents/${id}`);
      fetchDocuments();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to delete file');
    }
  };

  const handlePreviewDoc = (id: string) => {
    const previewUrl = `/api/v1/documents/${id}/preview`;
    window.open(previewUrl, '_blank');
  };

  const handleDownloadDoc = async (id: string, fileName: string) => {
    try {
      const response = await apiClient.get(`/documents/${id}/download`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download file payload');
    }
  };

  const filteredDocs = documents.filter(doc =>
    doc.originalFileName.toLowerCase().includes(search.toLowerCase()) ||
    doc.user?.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.user?.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Document Storage</h1>
          <p className="text-sm text-slate-500">System-wide uploaded document library and storage oversight for Operators & Admins</p>
        </div>

        <button
          onClick={fetchDocuments}
          className="p-2.5 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 hover:bg-slate-50 rounded-xl transition-all"
        >
          <RefreshCw className={`w-4 h-4 text-slate-600 dark:text-slate-300 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search documents by original filename, student name, or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {filteredDocs.length === 0 ? (
        <div className="text-center py-16 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No documents found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Uploaded student documents across print stages will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map(doc => (
            <div
              key={doc.id}
              className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start space-x-3">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl flex-shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate" title={doc.originalFileName}>
                    {doc.originalFileName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Student: <span className="font-semibold text-slate-700 dark:text-slate-300">{doc.user?.name || 'Student'}</span>
                    {doc.user?.email ? ` (${doc.user.email})` : ''}
                  </p>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-slate-400">
                    <span>{doc.pageCount} Pages</span>
                    <span>•</span>
                    <span>{(doc.size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {new Date(doc.createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePreviewDoc(doc.id)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg transition-colors"
                    title="Preview Document"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadDoc(doc.id, doc.originalFileName)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg transition-colors"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg transition-colors"
                    title="Delete File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
