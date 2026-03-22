-- =====================================================
-- MIGRATION 005 — Tables manquantes (schema.ts → DB)
-- À exécuter dans Supabase Dashboard → SQL Editor
-- =====================================================

-- -------------------------------------------------------
-- 1. NEWSLETTER SUBSCRIPTIONS
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',   -- ACTIVE | UNSUBSCRIBED | BOUNCED
  source VARCHAR(50) DEFAULT 'WEBSITE',            -- WEBSITE | IMPORT | API
  tags TEXT[],
  metadata JSONB,
  confirmed_at TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscriptions(status);

-- -------------------------------------------------------
-- 2. PROJECT BRIEFS (Configurateur de projet)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Contact
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  position TEXT,
  -- Projet
  project_type VARCHAR(100),
  project_name TEXT,
  project_description TEXT,
  -- Budget & délai
  budget VARCHAR(50),        -- <5k | 5-10k | 10-25k | 25-50k | >50k
  timeline VARCHAR(50),      -- <1 mois | 1-3 mois | 3-6 mois | >6 mois
  -- Fonctionnalités
  features TEXT[],
  requirements TEXT,
  -- Design
  design_style VARCHAR(50),
  reference_urls TEXT[],
  -- Technique
  technologies TEXT[],
  integrations TEXT[],
  metadata JSONB,
  -- Statut interne
  status VARCHAR(20) NOT NULL DEFAULT 'NEW',     -- NEW | CONTACTED | IN_PROGRESS | QUOTED | WON | LOST
  priority VARCHAR(20) DEFAULT 'MEDIUM',         -- LOW | MEDIUM | HIGH | URGENT
  assigned_to UUID REFERENCES users(id),
  internal_notes TEXT,
  -- Tracking UTM
  source VARCHAR(50) DEFAULT 'CONFIGURATOR',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_project_briefs_status ON project_briefs(status);
CREATE INDEX IF NOT EXISTS idx_project_briefs_email ON project_briefs(email);

-- -------------------------------------------------------
-- 3. SERVICES (Hubs métiers)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  hub VARCHAR(100) NOT NULL DEFAULT 'evenements',
  -- hub: evenements | architecture-de-marque | la-fabrique | qhse
  accroche TEXT,
  hero_image TEXT,
  hero_video TEXT,
  body TEXT,
  service_blocks JSONB,          -- [{ icon, title, description }]
  advantage_fabrique JSONB,      -- { text, link }
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  open_graph_image TEXT,
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_hub ON services(hub);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);

-- -------------------------------------------------------
-- 4. CLIENT REFERENCES (Références clients)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS client_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo TEXT,
  sectors TEXT[],
  description TEXT,
  project_description TEXT,
  case_study_url TEXT,
  website TEXT,
  is_featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_client_ref_slug ON client_references(slug);
CREATE INDEX IF NOT EXISTS idx_client_ref_published ON client_references(is_published);

-- -------------------------------------------------------
-- 5. CASE STUDIES (Études de cas)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  client_id UUID REFERENCES client_references(id) ON DELETE SET NULL,
  client_name TEXT,
  problem TEXT,
  solution TEXT,
  results TEXT,
  kpis JSONB,           -- [{ value: '+32%', label: 'NPS', icon: 'trending-up' }]
  gallery JSONB,        -- [{ image, caption }]
  related_service_slugs TEXT[],
  featured_image TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  is_featured BOOLEAN DEFAULT false,
  meta_title TEXT,
  meta_description TEXT,
  open_graph_image TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_status ON case_studies(status);

-- -------------------------------------------------------
-- 6. TESTIMONIALS (Témoignages)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_title TEXT,
  company_name TEXT,
  company_logo TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  service_slug TEXT,
  case_study_id UUID REFERENCES case_studies(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  date TIMESTAMP,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published);

-- -------------------------------------------------------
-- 7. TEAM MEMBERS (Équipe agence)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  photo TEXT,
  email TEXT,
  social_links JSONB,     -- [{ platform: 'LinkedIn', url: '...' }]
  is_published BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  department VARCHAR(100), -- Direction | Création | Production | Commercial | QHSE
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_team_members_published ON team_members(is_published);
CREATE INDEX IF NOT EXISTS idx_team_members_dept ON team_members(department);

-- -------------------------------------------------------
-- Triggers updated_at pour les nouvelles tables
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'newsletter_subscriptions',
    'project_briefs',
    'services',
    'client_references',
    'case_studies',
    'testimonials',
    'team_members'
  ]
  LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS trg_%s_updated_at ON %s;
      CREATE TRIGGER trg_%s_updated_at
        BEFORE UPDATE ON %s
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    ', t, t, t, t);
  END LOOP;
END;
$$;
