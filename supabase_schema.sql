-- =========================================================================
-- IGLOO CUSTOMER SUPPORT AI - 100% SAFE & NON-DESTRUCTIVE SCHEMA
-- This creates 5 completely NEW and SEPARATE tables prefixed with 'igloo_'
-- It does NOT touch, modify, or drop any existing tables of your other projects!
-- =========================================================================

-- ১. IGLOO USER ACCOUNTS TABLE (সম্পূর্ণ নতুন টেবিল)
CREATE TABLE IF NOT EXISTS public.igloo_user_accounts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'user',
    status TEXT NOT NULL DEFAULT 'active',
    created_at BIGINT NOT NULL,
    last_login BIGINT
);

-- Seed default Super Admin account if not exists
INSERT INTO public.igloo_user_accounts (id, name, email, password, role, status, created_at)
VALUES (
    'usr-super-admin',
    'Super Admin',
    'fapolok7@gmail.com',
    'Admin@123',
    'super_admin',
    'active',
    1711382400000
)
ON CONFLICT (email) DO NOTHING;

-- ২. IGLOO FAQ ITEMS & SCRIPTS TABLE (সম্পূর্ণ নতুন টেবিল)
CREATE TABLE IF NOT EXISTS public.igloo_faq_items (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL DEFAULT 'General',
    topic TEXT NOT NULL DEFAULT '',
    topic_bn TEXT NOT NULL DEFAULT '',
    keywords TEXT[] DEFAULT '{}',
    bangla_reply TEXT NOT NULL DEFAULT '',
    english_reply TEXT NOT NULL DEFAULT '',
    short_bn TEXT,
    short_en TEXT,
    warm_bn TEXT,
    warm_en TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ৩. IGLOO REPLY LOGS TABLE (সম্পূর্ণ নতুন টেবিল)
CREATE TABLE IF NOT EXISTS public.igloo_reply_logs (
    id TEXT PRIMARY KEY,
    query TEXT NOT NULL,
    source TEXT NOT NULL,
    matched_entity_name TEXT,
    matched_type TEXT,
    confidence NUMERIC,
    approved_script TEXT NOT NULL,
    short_version TEXT,
    warm_version TEXT,
    english_version TEXT,
    bangla_version TEXT,
    model_name TEXT,
    user_email TEXT,
    user_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ৪. IGLOO PRODUCTS CATALOG TABLE (সম্পূর্ণ নতুন টেবিল)
CREATE TABLE IF NOT EXISTS public.igloo_products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    bangla_name TEXT DEFAULT '',
    category TEXT DEFAULT 'General',
    volume INT DEFAULT 0,
    price_per_pcs NUMERIC DEFAULT 0,
    price_per_carton NUMERIC DEFAULT 0,
    pcs_per_carton INT DEFAULT 1,
    image_url TEXT,
    link TEXT,
    is_offer BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ৫. IGLOO APP SETTINGS TABLE (সম্পূর্ণ নতুন টেবিল)
CREATE TABLE IF NOT EXISTS public.igloo_app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (NON-DESTRUCTIVE - ZERO DROP STATEMENTS)
-- =========================================================================

ALTER TABLE public.igloo_user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.igloo_faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.igloo_reply_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.igloo_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.igloo_app_settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'igloo_user_accounts' AND policyname = 'igloo_user_accounts_policy'
    ) THEN
        CREATE POLICY "igloo_user_accounts_policy" ON public.igloo_user_accounts FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'igloo_faq_items' AND policyname = 'igloo_faq_items_policy'
    ) THEN
        CREATE POLICY "igloo_faq_items_policy" ON public.igloo_faq_items FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'igloo_reply_logs' AND policyname = 'igloo_reply_logs_policy'
    ) THEN
        CREATE POLICY "igloo_reply_logs_policy" ON public.igloo_reply_logs FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'igloo_products' AND policyname = 'igloo_products_policy'
    ) THEN
        CREATE POLICY "igloo_products_policy" ON public.igloo_products FOR ALL USING (true) WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'igloo_app_settings' AND policyname = 'igloo_app_settings_policy'
    ) THEN
        CREATE POLICY "igloo_app_settings_policy" ON public.igloo_app_settings FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_igloo_faq_category ON public.igloo_faq_items(category);
CREATE INDEX IF NOT EXISTS idx_igloo_reply_logs_time ON public.igloo_reply_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_igloo_products_category ON public.igloo_products(category);
