import { generateLocalReply, GeneratedReply } from './localEngine';
import { removeMarkdownAsterisks } from '../utils/textCleaner';

export interface HistoryItem {
  id: string;
  timestamp: number;
  query: string;
  reply: GeneratedReply;
  isFavorite?: boolean;
  copiedVariant?: 'approved' | 'short' | 'warm' | 'custom';
}

const STORAGE_KEY_HISTORY = 'igloo_reply_history_v1';
const STORAGE_KEY_FAVORITES = 'igloo_reply_favorites_v1';

function sanitizeReply(reply: GeneratedReply): GeneratedReply {
  return {
    ...reply,
    approvedScript: removeMarkdownAsterisks(reply.approvedScript),
    shortVersion: removeMarkdownAsterisks(reply.shortVersion),
    warmVersion: removeMarkdownAsterisks(reply.warmVersion),
    englishVersion: removeMarkdownAsterisks(reply.englishVersion),
    banglaVersion: removeMarkdownAsterisks(reply.banglaVersion)
  };
}

export async function requestReply(message: string, forceLocal = false): Promise<GeneratedReply> {
  const trimmed = message.trim();
  if (!trimmed) {
    throw new Error('Please enter a message');
  }

  if (forceLocal) {
    return sanitizeReply(generateLocalReply(trimmed));
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500); // Fast fallback if server/gemini is slow

    const res = await fetch('/api/generate-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: trimmed }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn('Backend returned non-OK, utilizing local engine.');
      return sanitizeReply(generateLocalReply(trimmed));
    }

    const data = await res.json();
    return sanitizeReply(data);
  } catch (err) {
    console.info('Using local client-side knowledge engine (Instant offline response):', err);
    return sanitizeReply(generateLocalReply(trimmed));
  }
}

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load history:', e);
    return [];
  }
}

export function saveHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem {
  const newItem: HistoryItem = {
    ...item,
    id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now()
  };

  try {
    const current = getHistory();
    const updated = [newItem, ...current.filter((i) => i.query !== item.query)].slice(0, 50);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save history item:', e);
  }

  return newItem;
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  // Strip any asterisks before clipboard copy
  const cleanText = removeMarkdownAsterisks(text);
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(cleanText);
      return true;
    }
  } catch (e) {
    console.warn('Navigator clipboard failed, falling back to execCommand:', e);
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = cleanText;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    return false;
  }
}
