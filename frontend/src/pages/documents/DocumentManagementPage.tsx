import React, { useEffect, useState } from 'react';
import {
  FileText,
  Upload,
  Search,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface DocumentItem {
  id: string;
  originalFileName: string;
  mimeType: string;
  size: number;
  pageCount: number;
  createdAt: string;
}

export const DocumentManagementPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [renameDoc, setRenameDoc] = useState<DocumentItem | null>(null);
  const [newDocName, setNewDocName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchDocuments = async () => {
    try {
      const response = await apiClient.get('/documents');
      if (response.data?.data?.documents) {
        setDocuments(response.data.data.documents);
      }
    } catch {
      console.warn('Fallback to demo stored documents');
      setDocuments([
        {
          id: 'doc-1',
          originalFileName: 'Algorithm_Design_Report.pdf',
          mimeType: 'application/pdf',
          size: 2450000,
          pageCount: 18,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'doc-2',
          originalFileName: 'Lab_Manual_Ch3.pdf',
          mimeType: 'application/pdf',
          size: 1120000,
          pageCount: 9,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'doc-3',
          originalFileName: 'DBMS_Project_Proposal.docx',
          mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: 850000,
          pageCount: 5,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('document', selectedFile);

    try {
      await apiClient.post('/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage({ type: 'success', text: 'Document uploaded successfully!' });
      setShowUploadModal(false);
      setSelectedFile(null);
      fetchDocuments();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload document';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setUploading(false);
    }
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameDoc || !newDocName.trim()) return;

    try {
      await apiClient.patch(`/documents/${renameDoc.id}/rename`, {
        originalFileName: newDocName,
      });
      setMessage({ type: 'success', text: 'Document renamed successfully!' });
      setRenameDoc(null);
      fetchDocuments();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rename document';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await apiClient.delete(`/documents/${id}`);
      setMessage({ type: 'success', text: 'Document deleted successfully!' });
      fetchDocuments();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const filteredDocs = documents.filter(doc =>
    doc.originalFileName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Document Vault</h1>
          <p className="text-sm text-slate-500">Manage uploaded PDF, DOCX, and image print files</p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search documents by file name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-16 bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No documents found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Upload your assignments, lab records, or project papers to initiate a print request.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map(doc => (
            <div
              key={doc.id}
              className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-primary-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start space-x-3">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate" title={doc.originalFileName}>
                    {doc.originalFileName}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500">
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
                    onClick={() => {
                      setRenameDoc(doc);
                      setNewDocName(doc.originalFileName);
                    }}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg transition-colors"
                    title="Rename File"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Upload New Document</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {selectedFile ? selectedFile.name : 'Select or drag document here'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Supports PDF, DOCX, PNG up to 25MB</p>
                <input
                  type="file"
                  accept=".pdf,.docx,.png,.jpg,.jpeg"
                  onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload-input"
                />
                <label
                  htmlFor="file-upload-input"
                  className="mt-4 inline-block px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-200"
                >
                  Choose File
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || uploading}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rename Dialog */}
      {renameDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Rename Document</h2>
            <form onSubmit={handleRename} className="space-y-4">
              <input
                type="text"
                value={newDocName}
                onChange={e => setNewDocName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRenameDoc(null)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs rounded-lg bg-primary-600 text-white font-medium"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
