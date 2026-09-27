import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserAccount } from '../types/auth';
import { FAQItem } from '../data/knowledgeBase';
import { GeneratedReply } from './localEngine';

// Configuration keys in localStorage
export const STORAGE_SUPABASE_URL = 'igloo_supabase_url';
export const STORAGE_SUPABASE_KEY = 'igloo_supabase_anon_key';

// Clean table names with prefix to avoid collision with default Supabase templates
export const IGLOO_TABLES = {
  USERS: 'igloo_user_accounts',
  FAQS: 'igloo_faq_items',
  REPLY_LOGS: 'igloo_reply_logs',
  PRODUCTS: 'igloo_products',
  SETTINGS: 'igloo_app_settings'
};

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  const localUrl = (localStorage.getItem(STORAGE_SUPABASE_URL) || '').trim();
  const localKey = (localStorage.getItem(STORAGE_SUPABASE_KEY) || '').trim();

  return {
    url: localUrl || envUrl,
    anonKey: localKey || envKey
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
    const url = (customUrl || creds.url || '').trim();
    const key = (customKey || creds.anonKey || '').trim();

    if (!url || !key) {
      return { success: false, message: 'Supabase URL এবং Anon Key প্রয়োজন।' };
    }

    const testClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    // Check igloo_user_accounts first, fallback to user_accounts
    let { data, error } = await testClient.from(IGLOO_TABLES.USERS).select('id').limit(1);

    if (error && (error.code === '42P01' || error.message.includes('does not exist'))) {
      const fallbackCheck = await testClient.from('user_accounts').select('id').limit(1);
      if (!fallbackCheck.error) {
        return {
          success: true,
          message: 'Supabase ডাটাবেজ সফলভাবে সংযুক্ত হয়েছে এবং টেবিল পাওয়া গেছে।'
        };
      }
    }

    if (error) {
      if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
        return {
          success: true,
          message: 'Supabase কানেকশন সফল! তবে টেবিলগুলো এখনও তৈরি করা হয়নি। নিচে দেওয়া SQL রান করুন।'
        };
      }
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

// Helper: Safely insert or upsert trying prefixed table then legacy table
async function safeUpsert(client: SupabaseClient, primaryTable: string, legacyTable: string, payload: any) {
  let res = await client.from(primaryTable).upsert(payload);
  if (res.error && (res.error.code === '42P01' || res.error.message.includes('does not exist'))) {
    res = await client.from(legacyTable).upsert(payload);
  }
  return res;
}

// Helper: Safely delete
async function safeDelete(client: SupabaseClient, primaryTable: string, legacyTable: string, matchCol: string, val: any) {
  let res = await client.from(primaryTable).delete().eq(matchCol, val);
  if (res.error && (res.error.code === '42P01' || res.error.message.includes('does not exist'))) {
    res = await client.from(legacyTable).delete().eq(matchCol, val);
  }
  return res;
}

// -------------------------------------------------------------
// 1. User Accounts Table CRUD
// -------------------------------------------------------------
export async function syncUsersWithSupabase(localUsers: UserAccount[]): Promise<UserAccount[]> {
  const client = getSupabaseClient();
  if (!client) return localUsers;

  try {
    let res = await client.from(IGLOO_TABLES.USERS).select('*');
    if (res.error && (res.error.code === '42P01' || res.error.message.includes('does not exist'))) {
      res = await client.from('user_accounts').select('*');
    }

    if (res.error) {
      console.warn('Could not fetch users from Supabase:', res.error.message);
      return localUsers;
    }

    if (res.data && res.data.length > 0) {
      return res.data.map((row: any) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password,
        role: row.role,
        status: row.status || 'active',
        createdAt: Number(row.created_at) || Date.now(),
        lastLogin: row.last_login ? Number(row.last_login) : undefined
      }));
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
      email: user.email,
      password: user.password || '',
      role: user.role,
      status: user.status,
      created_at: user.createdAt,
      last_login: user.lastLogin || null
    };

    const { error } = await safeUpsert(client, IGLOO_TABLES.USERS, 'user_accounts', payload);
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
    const { error } = await safeDelete(client, IGLOO_TABLES.USERS, 'user_accounts', 'id', userId);
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
    let res = await client.from(IGLOO_TABLES.FAQS).select('*').order('created_at', { ascending: false });
    if (res.error && (res.error.code === '42P01' || res.error.message.includes('does not exist'))) {
      res = await client.from('faq_items').select('*').order('created_at', { ascending: false });
    }

    if (res.error) {
      console.warn('Could not fetch faqs from Supabase:', res.error.message);
      return fallbackFaqs;
    }

    if (res.data && res.data.length > 0) {
      return res.data.map((row: any) => ({
        id: row.id,
        category: row.category,
        topic: row.topic,
        topicBn: row.topic_bn || row.topic,
        keywords: Array.isArray(row.keywords) ? row.keywords : (row.keywords ? [row.keywords] : []),
        banglaReply: row.bangla_reply,
        englishReply: row.english_reply,
        shortBn: row.short_bn || undefined,
        shortEn: row.short_en || undefined,
        warmBn: row.warm_bn || undefined,
        warmEn: row.warm_en || undefined
      }));
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

    const { error } = await safeUpsert(client, IGLOO_TABLES.FAQS, 'faq_items', payload);
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
    const { error } = await safeDelete(client, IGLOO_TABLES.FAQS, 'faq_items', 'id', faqId);
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
      id: reply.id || `reply-${Date.now()}`,
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

    let res = await client.from(IGLOO_TABLES.REPLY_LOGS).insert(payload);
    if (res.error && (res.error.code === '42P01' || res.error.message.includes('does not exist'))) {
      res = await client.from('reply_logs').insert(payload);
    }

    if (res.error) throw res.error;
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
    let res = await client.from(IGLOO_TABLES.PRODUCTS).select('*');
    if (res.error && (res.error.code === '42P01' || res.error.message.includes('does not exist'))) {
      res = await client.from('products').select('*');
    }

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

    const { error } = await safeUpsert(client, IGLOO_TABLES.PRODUCTS, 'products', payload);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to save product to Supabase:', err);
    return false;
  }
}
