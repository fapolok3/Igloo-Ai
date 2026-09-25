import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Copy, Check, Sparkles, HelpCircle, Plus, Trash2 } from 'lucide-react';
import { IGLOO_FAQS, FAQ_CATEGORIES, FAQItem } from '../data/knowledgeBase';
import { copyTextToClipboard } from '../services/replyService';
import { sounds } from '../utils/audio';
import { AddFAQView } from './AddFAQView';
import { UserRole } from '../types/auth';

const STORAGE_CUSTOM_FAQS = 'igloo_custom_faqs_v1';

export interface FAQExplorerProps {
  onTestInGenerator?: (query: string) => void;
  userRole?: UserRole;
}

export const FAQExplorer: React.FC<FAQExplorerProps> = ({ onTestInGenerator, userRole }) => {
  const isSuperAdmin = userRole === 'super_admin';

  const [faqsList, setFaqsList] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CUSTOM_FAQS);
      if (saved) {
        const customFaqs = JSON.parse(saved);
        return [...customFaqs, ...IGLOO_FAQS];
      }
    } catch (e) {}
    return IGLOO_FAQS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(IGLOO_FAQS[0]?.id || null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isCreatingNewFAQ, setIsCreatingNewFAQ] = useState(false);

  const filteredFaqs = faqsList.filter((faq) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const inTopic = faq.topic.toLowerCase().includes(query);
    const inTopicBn = faq.topicBn.toLowerCase().includes(query);
    const inKeywords = faq.keywords.some((kw) => kw.toLowerCase().includes(query));
    const inBangla = faq.banglaReply.toLowerCase().includes(query);
    const inEnglish = faq.englishReply.toLowerCase().includes(query);

    return matchesCategory && (inTopic || inTopicBn || inKeywords || inBangla || inEnglish);
  });

  const handleCopy = async (text: string, key: string) => {
    sounds.playTap();
    const ok = await copyTextToClipboard(text);
    if (ok) {
      sounds.playSuccess();
      setCopiedKey(key);
      if (navigator.vibrate) navigator.vibrate(40);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleAddNewFAQ = (newFaq: FAQItem) => {
    const updated = [newFaq, ...faqsList];
    setFaqsList(updated);
    setExpandedId(newFaq.id);

    // Save custom FAQs to localStorage
    const onlyCustom = updated.filter((f) => f.id.startsWith('custom-faq-'));
    localStorage.setItem(STORAGE_CUSTOM_FAQS, JSON.stringify(onlyCustom));
    setIsCreatingNewFAQ(false);
  };

  const handleDeleteCustomFAQ = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playTap();
    if (window.confirm('Delete this custom FAQ script?')) {
      const updated = faqsList.filter((f) => f.id !== id);
      setFaqsList(updated);
      const onlyCustom = updated.filter((f) => f.id.startsWith('custom-faq-'));
      localStorage.setItem(STORAGE_CUSTOM_FAQS, JSON.stringify(onlyCustom));
      sounds.playSuccess();
    }
  };

  if (isCreatingNewFAQ) {
    return (
      <AddFAQView
        onSave={handleAddNewFAQ}
        onBack={() => setIsCreatingNewFAQ(false)}
      />
    );
  }

  return (
    <div className="space-y-4 pb-28 sm:pb-12 animate-in fade-in duration-150">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              Official FAQs & Response Scripts
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Verified corporate guidelines for customer support
            </p>
          </div>

          {/* Add FAQ Button - ONLY VISIBLE TO SUPER ADMIN */}
          {isSuperAdmin && (
            <button
              onClick={() => {
                sounds.playTap();
                setIsCreatingNewFAQ(true);
              }}
              className="flex items-center space-x-1 px-3.5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition active:scale-95 cursor-pointer select-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add FAQ</span>
            </button>
          )}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs by question, topic or keywords..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {FAQ_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  sounds.playTap();
                  setSelectedCategory(cat);
                }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer select-none ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Header Info */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center space-x-1.5">
          <HelpCircle className="w-4 h-4 text-purple-600" />
          <span>FAQ Knowledge Base ({filteredFaqs.length} Items)</span>
        </h3>
      </div>

      {/* FAQs List */}
      {filteredFaqs.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-3">
          <p className="text-sm font-bold text-slate-600">No FAQ scripts found</p>
          <p className="text-xs text-slate-400">Try another search keyword</p>
          {/* Add FAQ in empty state only if Super Admin */}
          {isSuperAdmin && (
            <button
              onClick={() => setIsCreatingNewFAQ(true)}
              className="inline-flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New FAQ</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            const isCustom = faq.id.startsWith('custom-faq-');

            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-purple-300 transition overflow-hidden"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => {
                    sounds.playTap();
                    setExpandedId(isExpanded ? null : faq.id);
                  }}
                  className="p-4 flex items-start justify-between cursor-pointer select-none bg-white hover:bg-slate-50/70 transition"
                >
                  <div className="pr-2 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[9px] uppercase font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                        {faq.category.split('(')[0].trim()}
                      </span>
                      {isCustom && (
                        <span className="text-[9px] uppercase font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                          Custom Added
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 leading-snug">
                      {faq.topic}
                    </h4>
                    {faq.topicBn && (
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{faq.topicBn}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5 pl-2">
                    {/* Only super admin can delete custom FAQs */}
                    {isCustom && isSuperAdmin && (
                      <button
                        onClick={(e) => handleDeleteCustomFAQ(faq.id, e)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Delete custom FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-purple-600" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-4 pt-1 bg-slate-50/60 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
                    {/* Bangla Response */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-emerald-800 flex items-center space-x-1">
                          <span>🇧🇩 Approved Bangla Response:</span>
                        </span>
                        <button
                          onClick={() => handleCopy(faq.banglaReply, `${faq.id}-bn`)}
                          className="flex items-center space-x-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 px-2.5 py-1 rounded-lg transition active:scale-95 cursor-pointer"
                        >
                          {copiedKey === `${faq.id}-bn` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Bangla</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                        {faq.banglaReply}
                      </p>
                    </div>

                    {/* English Response */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800 flex items-center space-x-1">
                          <span>🇬🇧 Approved English Response:</span>
                        </span>
                        <button
                          onClick={() => handleCopy(faq.englishReply, `${faq.id}-en`)}
                          className="flex items-center space-x-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 px-2.5 py-1 rounded-lg transition active:scale-95 cursor-pointer"
                        >
                          {copiedKey === `${faq.id}-en` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-purple-600 stroke-[3]" />
                              <span className="text-purple-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy English</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                        {faq.englishReply}
                      </p>
                    </div>

                    {/* Action Bar inside Expanded */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex flex-wrap gap-1">
                        {faq.keywords.slice(0, 3).map((kw, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>

                      {onTestInGenerator && (
                        <button
                          onClick={() => {
                            sounds.playTap();
                            onTestInGenerator(faq.topic);
                          }}
                          className="flex items-center space-x-1 text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Test in Reply AI</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
