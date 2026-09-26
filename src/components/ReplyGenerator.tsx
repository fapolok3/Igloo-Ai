import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck,
  Share2,
  Trash2,
  PhoneCall,
  Copy,
  Check,
  Edit3,
  Globe,
  ClipboardPaste,
  Sparkles
} from 'lucide-react';
import { GeneratedReply } from '../services/localEngine';
import { requestReply, copyTextToClipboard } from '../services/replyService';
import { sounds } from '../utils/audio';
import { CustomEditView } from './CustomEditView';
import { getTimeBasedGreeting } from '../utils/timeGreeting';

interface ReplyGeneratorProps {
  initialQuery?: string;
}

export const ReplyGenerator: React.FC<ReplyGeneratorProps> = ({ initialQuery }) => {
  const [inputMessage, setInputMessage] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<GeneratedReply | null>(null);
  const [activeTab, setActiveTab] = useState<'bangla' | 'english'>('bangla');
  const [copiedSuccess, setCopiedSuccess] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEditingFullPage, setIsEditingFullPage] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const greetingInfo = getTimeBasedGreeting();

  // Auto-resize textarea to fit message height completely without any scrolling
  const autoResizeTextarea = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      const newHeight = Math.max(105, inputRef.current.scrollHeight);
      inputRef.current.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    autoResizeTextarea();
  }, [inputMessage]);

  useEffect(() => {
    if (initialQuery) {
      setInputMessage(initialQuery);
      handleGenerate(initialQuery);
    }
  }, [initialQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handlePasteClipboard = async () => {
    sounds.playTap();
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setInputMessage(text.trim());
          showToast('Pasted from clipboard!');
          sounds.playSuccess();
          setTimeout(() => autoResizeTextarea(), 50);
          return;
        }
      }
      showToast('Please paste directly with Ctrl+V');
      inputRef.current?.focus();
    } catch (err) {
      showToast('Clipboard access not allowed. Please paste manually');
      inputRef.current?.focus();
    }
  };

  const handleGenerate = async (messageOverride?: string) => {
    const textToProcess = (messageOverride !== undefined ? messageOverride : inputMessage).trim();
    if (!textToProcess) {
      showToast('Please enter customer message or query');
      inputRef.current?.focus();
      return;
    }

    sounds.playTap();
    setIsLoading(true);
    setCopiedSuccess(null);

    try {
      const reply = await requestReply(textToProcess, false);
      setCurrentResult(reply);
      sounds.playSuccess();
    } catch (err: any) {
      console.error('Error generating reply:', err);
      showToast('Error occurred, fallback loaded');
    } finally {
      setIsLoading(false);
    }
  };

  const getBanglaText = (): string => {
    if (!currentResult) return '';
    return currentResult.banglaVersion || currentResult.approvedScript || '';
  };

  const getEnglishText = (): string => {
    if (!currentResult) return '';
    return currentResult.englishVersion || currentResult.approvedScript || '';
  };

  const getActiveTextToCopy = (): string => {
    return activeTab === 'bangla' ? getBanglaText() : getEnglishText();
  };

  const handleCopyReply = async (customText?: string, targetKey = 'main') => {
    const text = customText || (targetKey === 'bangla' ? getBanglaText() : targetKey === 'english' ? getEnglishText() : getActiveTextToCopy());
    if (!text) return;

    const success = await copyTextToClipboard(text);
    if (success) {
      sounds.playSuccess();
      setCopiedSuccess(targetKey);
      showToast(`Copied ${targetKey === 'english' ? 'English' : 'Bangla'} reply!`);
      if (navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }
      setTimeout(() => setCopiedSuccess(null), 3000);
    } else {
      showToast('Failed to copy');
    }
  };

  const handleShare = async () => {
    sounds.playTap();
    const text = getActiveTextToCopy();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Igloo Customer Support Reply',
          text: text
        });
      } catch (err) {
        // Share cancelled
      }
    } else {
      handleCopyReply(text, 'share');
    }
  };

  const handleOpenCustomEdit = () => {
    sounds.playTap();
    setIsEditingFullPage(true);
  };

  const handleSaveCustomReply = (editedText: string) => {
    if (currentResult) {
      if (activeTab === 'bangla') {
        setCurrentResult({
          ...currentResult,
          banglaVersion: editedText,
          approvedScript: editedText
        });
      } else {
        setCurrentResult({
          ...currentResult,
          englishVersion: editedText
        });
      }
      showToast('Custom script updated!');
    }
    setIsEditingFullPage(false);
  };

  // Full screen clean custom editor
  if (isEditingFullPage && currentResult) {
    return (
      <CustomEditView
        initialText={getActiveTextToCopy()}
        language={activeTab}
        matchedTitle={currentResult.matchedEntityName}
        onBack={() => setIsEditingFullPage(false)}
        onCopyAndReturn={handleSaveCustomReply}
      />
    );
  }

  return (
    <div className="space-y-4 pb-36 sm:pb-12 animate-in fade-in duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-2 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <Check className="w-4 h-4 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Dynamic Time Greeting Banner */}
      <div className="bg-gradient-to-r from-purple-700/10 via-indigo-700/5 to-purple-700/10 rounded-3xl p-3.5 sm:p-4 border border-purple-200/70 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-lg shadow-md shadow-purple-600/20 flex-shrink-0">
            {greetingInfo.icon}
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center space-x-1.5">
              <span>{greetingInfo.greeting}!</span>
              <span className="text-xs font-bold text-purple-700">({greetingInfo.greetingBn})</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Igloo Customer Support Intelligence • Ready to generate replies
            </p>
          </div>
        </div>
      </div>

      {/* Customer Message Input Card - Auto-resizing so NO scrolling is required */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-md relative focus-within:ring-2 focus-within:ring-purple-500/40 focus-within:border-purple-400 transition-all">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center space-x-1.5">
            <span>Customer Message / Query (কাস্টমারের প্রশ্ন):</span>
          </label>

          <div className="flex items-center space-x-2">
            {/* Quick 1-Tap Paste Button */}
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-xl transition active:scale-95 cursor-pointer text-xs font-bold flex items-center space-x-1 border border-purple-200/80 shadow-2xs"
              title="Paste from clipboard"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>Paste</span>
            </button>

            {inputMessage && (
              <button
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setInputMessage('');
                  if (inputRef.current) {
                    inputRef.current.style.height = '105px';
                  }
                }}
                className="text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-2.5 py-1 rounded-xl transition active:scale-90 cursor-pointer text-xs font-bold flex items-center space-x-1"
                title="Clear input"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Textarea - Auto-expanding and overflow-hidden so NO scrollbar is ever required */}
        <div className="relative">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
              // Immediate auto-resize without lag
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.max(105, e.target.scrollHeight)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleGenerate();
              }
            }}
            placeholder="Type or paste any customer inquiry (e.g., 'Dhanmondi delivery hobe?', 'Chocbar price?', 'What special flavors for birthday?', 'Freezer lagbe dokane')..."
            rows={3}
            className="w-full p-4 bg-slate-50/90 border border-slate-200/80 rounded-2xl text-sm sm:text-base leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 transition-all resize-none font-sans overflow-hidden min-h-[105px]"
          />
        </div>

        {/* Bottom Actions inside Input Box */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-mono">Ctrl + Enter</kbd> to generate
          </span>

          {/* Modern Purple Generate Button */}
          <button
            onClick={() => handleGenerate()}
            disabled={isLoading || !inputMessage.trim()}
            type="button"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white text-sm font-bold px-6 py-3 rounded-2xl shadow-md shadow-purple-500/25 transition-all active:scale-95 disabled:active:scale-100 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Reply...</span>
              </>
            ) : (
              <span>Generate Reply</span>
            )}
          </button>
        </div>
      </div>

      {/* Generated Response Container: Bangla and English */}
      {currentResult && (
        <div className="space-y-4 animate-spring">
          {/* Header Info of the Result */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-purple-500/20 shadow-xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                {currentResult.source === 'gemini' ? (
                  <span className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-900 font-bold text-xs px-2.5 py-1 rounded-full border border-purple-200/80 shadow-2xs">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Gemini AI Smart Reply</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1.5 bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-full border border-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Official Knowledge Base</span>
                  </span>
                )}
                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[220px] sm:max-w-xs">
                  {currentResult.matchedEntityName || 'Igloo Customer Support'}
                </span>
              </div>
            </div>

            {/* Language Switcher Tabs for Mobile & Quick Switch */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center bg-slate-100 p-1 rounded-2xl gap-1">
                <button
                  onClick={() => {
                    sounds.playTap();
                    setActiveTab('bangla');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer select-none flex items-center space-x-1.5 ${
                    activeTab === 'bangla'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🇧🇩 বাংলা রিপ্লাই</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playTap();
                    setActiveTab('english');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer select-none flex items-center space-x-1.5 ${
                    activeTab === 'english'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>🇬🇧 English Reply</span>
                </button>
              </div>

              {/* Edit Custom Script Button */}
              <button
                onClick={handleOpenCustomEdit}
                className="flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-purple-600 bg-slate-100 hover:bg-purple-50 px-3 py-2 rounded-xl border border-slate-200 transition cursor-pointer"
                title="Edit and customize this reply"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Customize</span>
              </button>
            </div>

            {/* Script Display Box */}
            <div className="relative bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 text-slate-900 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans select-all">
              {activeTab === 'bangla' ? getBanglaText() : getEnglishText()}
            </div>

            {/* Bottom Action Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                {/* 1-Tap Copy Button */}
                <button
                  onClick={() => handleCopyReply(undefined, activeTab)}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-md shadow-purple-500/25 transition active:scale-95 cursor-pointer"
                >
                  {copiedSuccess === activeTab ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy {activeTab === 'bangla' ? 'বাংলা' : 'English'} Reply</span>
                    </>
                  )}
                </button>

                {/* Native Mobile Share */}
                <button
                  onClick={handleShare}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition active:scale-95 cursor-pointer"
                  title="Share reply"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
                <a
                  href="https://igloobd.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-800 transition"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>igloobd.com</span>
                </a>
                <span>•</span>
                <a
                  href="tel:16556"
                  className="flex items-center space-x-1 text-slate-600 hover:text-purple-600 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>16556</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
