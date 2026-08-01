import React, { useEffect, useState } from 'react';
import { Printer as PrinterIcon, CheckCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Printer, getPrinters } from '../../services/printer.service';

interface SelectPrinterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (printerId: string) => void;
  title?: string;
  subtitle?: string;
}

export const SelectPrinterModal: React.FC<SelectPrinterModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Select Target Printer Fleet Hardware',
  subtitle = 'Choose an online printer from the fleet to assign and begin printing this order.',
}) => {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPrinterId, setSelectedPrinterId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getPrinters()
        .then(res => {
          const list: Printer[] = Array.isArray(res?.data?.printers)
            ? res.data.printers
            : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res)
            ? res
            : [];

          setPrinters(list);
          const onlinePrinter = list.find((p: Printer) => p.status === 'ONLINE' && !p.isMaintenanceMode);
          if (onlinePrinter) {
            setSelectedPrinterId(onlinePrinter.id);
          }
        })
        .catch(err => console.error('Failed to fetch printer fleet:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!selectedPrinterId) return;
    onConfirm(selectedPrinterId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 space-y-5 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <PrinterIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <span className="animate-spin text-lg">🔄</span>
            Loading active printer fleet...
          </div>
        ) : printers.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-xs">
            No printers found in system. Please add printers to fleet first.
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {printers.map(printer => {
              const isSelected = selectedPrinterId === printer.id;
              const isAvailable = printer.status === 'ONLINE' && !printer.isMaintenanceMode;

              return (
                <div
                  key={printer.id}
                  onClick={() => isAvailable && setSelectedPrinterId(printer.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    !isAvailable
                      ? 'opacity-50 bg-slate-950/40 border-slate-800 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-950/40 border-blue-500 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-400 bg-blue-500' : 'border-slate-500'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{printer.name}</h4>
                          <span className="text-[10px] font-mono bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                            {printer.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {printer.manufacturer} {printer.model} • {printer.location || 'Central Hub'}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {printer.isMaintenanceMode ? (
                        <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Maintenance
                        </span>
                      ) : printer.status === 'ONLINE' ? (
                        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Ready / Online
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full text-[10px] font-bold flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> {printer.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Printer Specs Row */}
                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex gap-2">
                      <span>Paper: <strong className="text-slate-200">{printer.supportedPaperSizes.join(', ')}</strong></span>
                      <span>•</span>
                      <span>Color: <strong className="text-slate-200">{printer.supportedColorModes.join(', ')}</strong></span>
                      <span>•</span>
                      <span>Duplex: <strong className="text-slate-200">{printer.supportedDuplex ? 'Yes' : 'No'}</strong></span>
                    </div>
                    <div>
                      Load: <strong className="text-slate-200">{printer.currentDailyCount} / {printer.maxDailyCapacity}</strong> pages
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selectedPrinterId}
            onClick={handleConfirm}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-600/20 transition flex items-center gap-2"
          >
            🖨️ Confirm & Start Printing
          </button>
        </div>
      </div>
    </div>
  );
};
