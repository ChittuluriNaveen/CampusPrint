import React, { useEffect, useState } from 'react';
import { Sliders, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiClient } from '../../services/apiClient';

interface PricingConfig {
  bwSingleA4: number;
  bwDoubleA4: number;
  colorSingleA4: number;
  colorDoubleA4: number;
  bwSingleA3: number;
  colorSingleA3: number;
  bindingSoft: number;
  bindingHard: number;
  gstPercentage: number;
}

export const AdminPricingConfigPage: React.FC = () => {
  const [config, setConfig] = useState<PricingConfig>({
    bwSingleA4: 2.0,
    bwDoubleA4: 3.5,
    colorSingleA4: 10.0,
    colorDoubleA4: 18.0,
    bwSingleA3: 5.0,
    colorSingleA3: 25.0,
    bindingSoft: 20.0,
    bindingHard: 50.0,
    gstPercentage: 18.0,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPricing = async () => {
    try {
      const response = await apiClient.get('/pricing/config');
      if (response.data?.data) {
        setConfig(prev => ({ ...prev, ...response.data.data }));
      }
    } catch {
      console.warn('Fallback to demo pricing configuration');
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await apiClient.put('/pricing/config', config);
      setMessage({ type: 'success', text: 'Pricing engine configuration updated successfully!' });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update pricing rules';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pricing Engine Configurator</h1>
        <p className="text-sm text-slate-500">Configure per-page printing costs, binding charges, and GST tax percentage</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center space-x-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSaveConfig} className="space-y-6">
        {/* A4 Paper Rules */}
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-primary-500" />
            <span>A4 Size Per-Page Rates (₹)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">B&W Single Sided (A4)</label>
              <input
                type="number"
                step="0.1"
                value={config.bwSingleA4}
                onChange={e => setConfig({ ...config, bwSingleA4: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">B&W Double Sided (A4)</label>
              <input
                type="number"
                step="0.1"
                value={config.bwDoubleA4}
                onChange={e => setConfig({ ...config, bwDoubleA4: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Color Single Sided (A4)</label>
              <input
                type="number"
                step="0.1"
                value={config.colorSingleA4}
                onChange={e => setConfig({ ...config, colorSingleA4: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Color Double Sided (A4)</label>
              <input
                type="number"
                step="0.1"
                value={config.colorDoubleA4}
                onChange={e => setConfig({ ...config, colorDoubleA4: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Binding & Tax Rules */}
        <div className="bg-surface-light dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-primary-500" />
            <span>Finishing & GST Tax Rates</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Soft Binding (₹)</label>
              <input
                type="number"
                value={config.bindingSoft}
                onChange={e => setConfig({ ...config, bindingSoft: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Hard Binding (₹)</label>
              <input
                type="number"
                value={config.bindingHard}
                onChange={e => setConfig({ ...config, bindingHard: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">GST Percentage (%)</label>
              <input
                type="number"
                step="0.1"
                value={config.gstPercentage}
                onChange={e => setConfig({ ...config, gstPercentage: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Pricing Configuration'}</span>
        </button>
      </form>
    </div>
  );
};
