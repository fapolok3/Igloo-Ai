import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, RotateCcw, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface CustomEditViewProps {
  initialText: string;
  language: 'bangla' | 'english';
  matchedTitle?: string;
  onBack: () => void;
  onCopyAndReturn: (editedText: string) => void;
}

export const CustomEditView: React.FC<CustomEditViewProps> = ({
  initialText,
  language,
  matchedTitle,
  onBack,
  onCopyAndReturn
}) => {
  const [text, setText] = useState(initialText);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  const handleCopy = () => {
    sounds.playSuccess();
    setCopied(true);
    if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
    onCopyAndReturn(text);
  };

  const handleReset = () => {
    sounds.playTap();
    setText(initialText);
  };

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-4 pb-28 sm:pb-12 animate-in fade-in duration-150">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              sounds.playTap();
              onBack();
            }}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 cursor-pointer flex items-center justify-center"
            title="Back to Generator"
          >
            <ArrowLeft className="w-5 h-5 text-slate-800" />
          </button>
          <div>
            <div className="flex items-center space-x-2 mb-0.5">
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                {language === 'bangla' ? '🇧🇩 Bangla Script' : '🌐 English Script'}
              </span>
              {matchedTitle && (
                <span className="text-[11px] font-bold text-slate-500 truncate max-w-[160px] sm:max-w-xs">
                  • {matchedTitle}
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight flex items-center space-x-1.5">
              <span>Custom Edit Mode</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition cursor-pointer active:scale-95"
            title="Reset to original script"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Full Page Editor Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span className="flex items-center space-x-1 text-slate-700">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Message Content:</span>
          </span>
          <span>{wordCount} words • {charCount} chars</span>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm sm:text-base leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition resize-none font-sans"
          placeholder="Type or modify your reply here..."
        />

        {/* Quick Tips */}
        <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-3.5 text-xs text-indigo-900 flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Tip:</strong> Always maintain official pricing, helpline (16556), and website link (https://igloobd.com/) for accurate customer guidance.
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              sounds.playTap();
              onBack();
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs sm:text-sm transition cursor-pointer active:scale-95"
          >
            Cancel & Go Back
          </button>

          <button
            onClick={handleCopy}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl text-white font-bold text-sm shadow-md transition active:scale-95 cursor-pointer ${
              copied
                ? 'bg-emerald-600'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>Copied & Saved!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy Edited Reply & Return</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
