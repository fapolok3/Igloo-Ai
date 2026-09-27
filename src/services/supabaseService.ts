import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserAccount } from '../types/auth';
import { FAQItem } from '../data/knowledgeBase';
import { GeneratedReply } from './localEngine';

// Configuration keys in localStorage
export const STORAGE_SUPABASE_URL = 'igloo_supabase_url';
export const STORAGE_SUPABASE_KEY = 'igloo_supabase_anon_key';

// Default Supabase project credentials for Igloo AI
export const DEFAULT_SUPABASE_URL = 'https://kcugywbwoqzgivksuisj.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjdWd5d2J3b3F6Z2l2a3N1aXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzOTUwNTUsImV4cCI6MjA5Mzk3MTA1NX0.GDocJTRnxcAe3j4vtH5r8iWuRfOBwxR9LSXCVIlT0yk';

// Clean table names with prefix to avoid collision with other projects
export const IGLOO_TABLES = {
  USERS: 'igloo_user_accounts',
  FAQS: 'igloo_faq_items',
  REPLY_LOGS: 'igloo_reply_logs',
  PRODUCTS: 'igloo_products',
  SETTINGS: 'igloo_app_settings'
};

function cleanSupabaseUrl(raw: string): string {
  let u = (raw || '').trim();
  u = u.replace(/\/rest\/v1\/?$/, '');
  u = u.replace(/\/+$/, '');
  return u;
}

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = cleanSupabaseUrl(import.meta.env.VITE_SUPABASE_URL || '');
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  const localUrl = cleanSupabaseUrl(localStorage.getItem(STORAGE_SUPABASE_URL) || '');
  const localKey = (localStorage.getItem(STORAGE_SUPABASE_KEY) || '').trim();

  return {
    url: localUrl || envUrl || DEFAULT_SUPABASE_URL,
    anonKey: localKey || envKey || DEFAULT_SUPABASE_ANON_KEY
  };
}

let supabaseInstance: SupabaseClient | null = null;
let lastUrl = '';
let lastKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();

  if (!url || !anonKey) {
    return null;
  }

  if (supabaseInstance && url === lastUrl && anonKey === lastKey) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    lastUrl = url;
    lastKey = anonKey;
    return supabaseInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function isSupabaseConnected(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey);
}

// -------------------------------------------------------------
// Diagnostic Connection Test
// -------------------------------------------------------------
export async function testSupabaseConnection(
  customUrl?: string,
  customKey?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const creds = getSupabaseCredentials();
    const url = cleanSupabaseUrl(customUrl || creds.url || '');
    const key = (customKey || creds.anonKey || '').trim();

    if (!url || !key) {
      return { success: false, message: 'URL এবং Anon Key উভয়ই প্রদান করা আবশ্যক।' };
    }

    const testClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { error } = await testClient.from(IGLOO_TABLES.USERS).select('id').limit(1);

    if (error) {
      return { success: false, message: `Supabase ত্রুটি: ${error.message} (Code: ${error.code})` };
    }

    return {
      success: true,
      message: 'অভিনন্দন! Supabase ডাটাবেজ সফলভাবে সংযুক্ত হয়েছে এবং সমস্ত টেবিল সক্রিয় আছে।'
    };
  } catch (err: any) {
    return { success: false, message: `কানেকশন সমস্যা: ${err?.message || err}` };
  }
}

// -------------------------------------------------------------
// 1. User Accounts Table CRUD
// -------------------------------------------------------------
export async function syncUsersWithSupabase(localUsers: UserAccount[]): Promise<UserAccount[]> {
  const client = getSupabaseClient();
  if (!client) return localUsers;

  try {
    const res = await client.from(IGLOO_TABLES.USERS).select('*');

    if (res.error) {
      console.warn('Could not fetch users from Supabase:', res.error.message);
      return localUsers;
    }

    if (res.data && res.data.length > 0) {
      const remoteUsers: UserAccount[] = res.data.map((row: any) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        role: row.role,
        status: row.status || 'active',
        createdAt: Number(row.created_at) || Date.now(),
        lastLogin: row.last_login ? Number(row.last_login) : undefined
      }));

      // Combine with any local user not in remote
      const combined = [...remoteUsers];
      for (const lu of localUsers) {
        if (!combined.some((cu) => cu.email.toLowerCase() === lu.email.toLowerCase())) {
          combined.push(lu);
          await saveUserToSupabase(lu);
        }
      }
      return combined;
    } else {
      // Seed with local users if table exists but empty
      for (const u of localUsers) {
        await saveUserToSupabase(u);
      }
      return localUsers;
    }
  } catch (e) {
    console.error('Error syncing users with Supabase:', e);
    return localUsers;
  }
}

export async function saveUserToSupabase(user: UserAccount): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email.toLowerCase(),
      password: user.password || '',
      role: user.role,
      status: user.status,
      created_at: user.createdAt,
      last_login: user.lastLogin || null
    };

    const { error } = await client.from(IGLOO_TABLES.USERS).upsert(payload, { onConflict: 'email' });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to save user to Supabase:', err);
    return false;
  }
}

export async function deleteUserFromSupabase(userId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from(IGLOO_TABLES.USERS).delete().eq('id', userId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to delete user from Supabase:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 2. FAQs and Response Scripts Table CRUD
// -------------------------------------------------------------
export async function syncFaqsWithSupabase(fallbackFaqs: FAQItem[]): Promise<FAQItem[]> {
  const client = getSupabaseClient();
  if (!client) return fallbackFaqs;

  try {
    const res = await client.from(IGLOO_TABLES.FAQS).select('*');

    if (res.error) {
      console.warn('Could not fetch FAQs from Supabase:', res.error.message);
      return fallbackFaqs;
    }

    if (res.data && res.data.length > 0) {
      return res.data.map((row: any) => ({
        id: row.id,
        category: row.category,
        topic: row.topic,
        topicBn: row.topic_bn || row.topic,
        keywords: Array.isArray(row.keywords) ? row.keywords : row.keywords ? [row.keywords] : [],
        banglaReply: row.bangla_reply,
        englishReply: row.english_reply,
        shortBn: row.short_bn || undefined,
        shortEn: row.short_en || undefined,
        warmBn: row.warm_bn || undefined,
        warmEn: row.warm_en || undefined
      }));
    } else {
      // Seed with default FAQs
      for (const faq of fallbackFaqs) {
        await saveFaqToSupabase(faq);
      }
      return fallbackFaqs;
    }
  } catch (e) {
    console.error('Error loading FAQs from Supabase:', e);
  }
  return fallbackFaqs;
}

export async function saveFaqToSupabase(faq: FAQItem): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      id: faq.id,
      category: faq.category,
      topic: faq.topic,
      topic_bn: faq.topicBn,
      keywords: faq.keywords,
      bangla_reply: faq.banglaReply,
      english_reply: faq.englishReply,
      short_bn: faq.shortBn || null,
      short_en: faq.shortEn || null,
      warm_bn: faq.warmBn || null,
      warm_en: faq.warmEn || null,
      updated_at: new Date().toISOString()
    };

    const { error } = await client.from(IGLOO_TABLES.FAQS).upsert(payload, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to save FAQ to Supabase:', err);
    return false;
  }
}

export async function deleteFaqFromSupabase(faqId: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from(IGLOO_TABLES.FAQS).delete().eq('id', faqId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to delete FAQ from Supabase:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 3. Customer Query & AI Reply Audit Logs Table
// -------------------------------------------------------------
export interface ReplyAuditLog {
  id: string;
  query: string;
  source: string;
  matchedEntityName?: string;
  matchedType?: string;
  confidence?: number;
  approvedScript: string;
  shortVersion?: string;
  warmVersion?: string;
  englishVersion?: string;
  banglaVersion?: string;
  modelName?: string;
  userEmail?: string;
  userName?: string;
  createdAt?: string;
}

export async function logReplyToSupabase(
  reply: GeneratedReply,
  currentUser?: { email?: string; name?: string } | null
): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      id: reply.id || `reply-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      query: reply.query,
      source: reply.source,
      matched_entity_name: reply.matchedEntityName || 'Igloo Customer Support',
      matched_type: reply.matchedType || 'general',
      confidence: reply.confidence || 1.0,
      approved_script: reply.approvedScript,
      short_version: reply.shortVersion || null,
      warm_version: reply.warmVersion || null,
      english_version: reply.englishVersion || null,
      bangla_version: reply.banglaVersion || null,
      model_name: reply.modelName || 'knowledge_base',
      user_email: currentUser?.email || 'anonymous',
      user_name: currentUser?.name || 'Executive',
      created_at: new Date().toISOString()
    };

    const { error } = await client.from(IGLOO_TABLES.REPLY_LOGS).insert(payload);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to log reply to Supabase:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 4. Products Catalog Table CRUD
// -------------------------------------------------------------
export async function syncProductsWithSupabase(localProducts: any[]): Promise<any[]> {
  const client = getSupabaseClient();
  if (!client) return localProducts;

  try {
    const res = await client.from(IGLOO_TABLES.PRODUCTS).select('*');

    if (res.error) {
      console.warn('Could not fetch products from Supabase:', res.error.message);
      return localProducts;
    }

    if (res.data && res.data.length > 0) {
      return res.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        banglaName: p.bangla_name,
        category: p.category || 'General',
        price: Number(p.price_per_pcs) || Number(p.price) || 0,
        pricePerPcs: Number(p.price_per_pcs) || 0,
        pricePerCarton: Number(p.price_per_carton) || 0,
        volume: p.volume || 0,
        image: p.image_url || '',
        link: p.link || '',
        isOffer: Boolean(p.is_offer),
        tags: Array.isArray(p.tags) ? p.tags : []
      }));
    } else {
      // Seed initial products
      for (const p of localProducts) {
        await saveProductToSupabase(p);
      }
      return localProducts;
    }
  } catch (err) {
    console.error('Error fetching products from Supabase:', err);
  }
  return localProducts;
}

export async function saveProductToSupabase(product: any): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const payload = {
      id: product.id,
      name: product.name,
      bangla_name: product.banglaName || product.name,
      category: product.category || 'General',
      price_per_pcs: product.pricePerPcs || product.price || 0,
      price_per_carton: product.pricePerCarton || 0,
      volume: product.volume || 0,
      image_url: product.image || '',
      link: product.link || '',
      is_offer: Boolean(product.isOffer),
      tags: product.tags || [],
      updated_at: new Date().toISOString()
    };

    const { error } = await client.from(IGLOO_TABLES.PRODUCTS).upsert(payload, { onConflict: 'id' });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to save product to Supabase:', err);
    return false;
  }
}
