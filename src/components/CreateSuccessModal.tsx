import React, { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles, X, Copy, Check } from 'lucide-react';
import { copyTextToClipboard } from '../services/replyService';

export interface CreateSuccessModalProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  badgeText?: string;
  details?: Array<{ label: string; value: string; copyable?: boolean }>;
  confirmLabel?: string;
  onClose: () => void;
}

export const CreateSuccessModal: React.FC<CreateSuccessModalProps> = ({
  isOpen,
  title,
  subtitle = 'নতুন এন্ট্রি সফলভাবে সিস্টেমে যুক্ত ও সংরক্ষিত হয়েছে।',
  badgeText = 'সফলভাবে তৈরি হয়েছে',
  details = [],
  confirmLabel = 'ঠিক আছে',
  onClose
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async (text: string, index: number) => {
    const ok = await copyTextToClipboard(text);
    if (ok) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Celebration Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-inner">
                <CheckCircle2 className="w-7 h-7 text-emerald-100" />
              </div>
              <div>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 text-[11px] font-black tracking-wide uppercase">
                  <Sparkles className="w-3 h-3 mr-1 text-amber-300" />
                  {badgeText}
                </span>
                <h3 className="text-lg font-black text-white mt-1 leading-tight">
                  {title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
            {subtitle}
          </p>

          {/* Details Table/Cards */}
          {details.length > 0 && (
            <div className="space-y-2.5 bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80">
              {details.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs py-1 border-b border-slate-200/50 last:border-none gap-2"
                >
                  <span className="text-slate-500 font-bold shrink-0">{item.label}:</span>
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <span className="font-black text-slate-900 truncate font-mono">
                      {item.value}
                    </span>
                    {item.copyable && (
                      <button
                        type="button"
                        onClick={() => handleCopy(item.value, idx)}
                        className="p-1 rounded-lg hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                        title="কপি করুন"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-7 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition active:scale-95 cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
