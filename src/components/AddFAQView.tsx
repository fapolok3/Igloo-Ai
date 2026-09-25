import React, { useState } from 'react';
import { ArrowLeft, Plus, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';
import { FAQItem, FAQ_CATEGORIES } from '../data/knowledgeBase';
import { sounds } from '../utils/audio';

interface AddFAQViewProps {
  onBack: () => void;
  onSave: (newFaq: FAQItem) => void;
}

export const AddFAQView: React.FC<AddFAQViewProps> = ({ onBack, onSave }) => {
  const categoriesList = FAQ_CATEGORIES.filter((c) => c !== 'All') as string[];

  const [topic, setTopic] = useState('');
  const [topicBn, setTopicBn] = useState('');
  const [category, setCategory] = useState<string>(categoriesList[0] || 'সাধারণ ও সহায়তা (General & Support)');
  const [banglaReply, setBanglaReply] = useState('');
  const [englishReply, setEnglishReply] = useState('');
  const [keywords, setKeywords] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter the question or topic in English/Bangla');
      return;
    }
    if (!banglaReply.trim()) {
      setError('Please provide the approved Bangla response script');
      return;
    }

    const keywordArray = keywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (keywordArray.length === 0) {
      keywordArray.push(topic.toLowerCase().trim());
    }

    const newFaqItem: FAQItem = {
      id: `custom-faq-${Date.now()}`,
      category,
      topic: topic.trim(),
      topicBn: topicBn.trim() || topic.trim(),
      keywords: keywordArray,
      banglaReply: banglaReply.trim(),
      englishReply: englishReply.trim() || banglaReply.trim(),
      shortBn: banglaReply.trim().slice(0, 120) + '...',
      warmBn: banglaReply.trim()
    };

    sounds.playSuccess();
    onSave(newFaqItem);
  };

  return (
    <div className="space-y-4 pb-28 sm:pb-12 animate-spring">
      {/* Top Navigation Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              sounds.playTap();
              onBack();
            }}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer active:scale-95"
            title="Go back to FAQ list"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
              Create New FAQ Script
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              Add custom approved customer response to the Knowledge Base
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playTap();
            onBack();
          }}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition hidden sm:inline-block"
        >
          Cancel
        </button>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 text-red-700 font-bold rounded-2xl border border-red-200 text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* Section 1: Question & Topics */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Question Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1.5 text-xs sm:text-sm">
                  Question / Topic (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    setError(null);
                  }}
                  placeholder="e.g., How to buy wholesale ice cream?"
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1.5 text-xs sm:text-sm">
                  প্রশ্ন / টপিক (বাংলা)
                </label>
                <input
                  type="text"
                  value={topicBn}
                  onChange={(e) => setTopicBn(e.target.value)}
                  placeholder="যেমন: পাইকারি আইসক্রিম কিভাবে কিনব?"
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Category & Matching Keywords */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1.5 text-xs sm:text-sm">
                  FAQ Category (ক্যাটাগরি)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1.5 text-xs sm:text-sm">
                  Search Keywords (কমা দিয়ে লিখুন)
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="wholesale, bulk, paikkari, discount, dukan"
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition"
                />
                <p className="text-[11px] text-slate-400 mt-1">These words help AI match user questions automatically</p>
              </div>
            </div>
          </div>

          {/* Section 3: Response Scripts */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Official Response Scripts</span>
            </h3>

            {/* Bangla Response */}
            <div>
              <label className="font-bold text-slate-800 block mb-1.5 text-xs sm:text-sm">
                🇧🇩 Approved Bangla Response Script <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={banglaReply}
                onChange={(e) => {
                  setBanglaReply(e.target.value);
                  setError(null);
                }}
                placeholder="প্রিয় গ্রাহক, ইগলুর সাথে যোগাযোগ করার জন্য ধন্যবাদ... (পূর্ণাঙ্গ বাংলা রিপ্লাই লিখুন)"
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white resize-none font-sans transition"
              />
            </div>

            {/* English Response */}
            <div>
              <label className="font-bold text-slate-800 block mb-1.5 text-xs sm:text-sm">
                🌐 Official English Response Script
              </label>
              <textarea
                rows={4}
                value={englishReply}
                onChange={(e) => setEnglishReply(e.target.value)}
                placeholder="Dear Customer, Thank you for contacting Igloo Ice Cream... (Optional English script)"
                className="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-xs sm:text-sm leading-relaxed text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white resize-none font-sans transition"
              />
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                onBack();
              }}
              className="w-full py-3.5 px-4 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition cursor-pointer active:scale-95 text-center order-2 sm:order-1"
            >
              Cancel & Return
            </button>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm py-3.5 px-4 rounded-2xl shadow-lg shadow-red-600/20 transition active:scale-95 cursor-pointer text-center order-1 sm:order-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save & Add to Knowledge Base</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
