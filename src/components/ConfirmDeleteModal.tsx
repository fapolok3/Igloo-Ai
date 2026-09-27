import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  title: string;
  itemName?: string;
  itemType?: string;
  description?: string;
  warningNote?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  title,
  itemName,
  itemType,
  description = 'আপনি কি নিশ্চিত যে আপনি এটি স্থায়ীভাবে মুছে ফেলতে চান?',
  warningNote = 'এই কাজটি সম্পন্ন হলে ডাটা পুনরুদ্ধার করা যাবে না।',
  confirmLabel = 'হ্যাঁ, নিশ্চিত ডিলিট করুন',
  cancelLabel = 'না, বাতিল করুন',
  isLoading = false,
  onConfirm,
  onCancel
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => {
        if (!isLoading) onCancel();
      }}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header with Danger Accent */}
        <div className="bg-gradient-to-r from-rose-50 via-red-50 to-orange-50 p-5 border-b border-rose-100/80 flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm shrink-0">
              <Trash2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {title}
              </h3>
              {itemType && (
                <span className="inline-block mt-0.5 px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-black uppercase tracking-wider rounded-md">
                  {itemType}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm font-semibold text-slate-700 leading-relaxed">
            {description}
          </p>

          {/* Highlight Target Item Name */}
          {itemName && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-slate-900 flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <p className="text-xs sm:text-sm font-black font-mono break-all line-clamp-2">
                {itemName}
              </p>
            </div>
          )}

          {/* Warning Banner */}
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start space-x-2.5 text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold leading-snug">
              {warningNote}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-bold text-xs sm:text-sm transition cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-xs sm:text-sm shadow-md shadow-rose-500/25 transition active:scale-95 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ডিলিট হচ্ছে...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>{confirmLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
