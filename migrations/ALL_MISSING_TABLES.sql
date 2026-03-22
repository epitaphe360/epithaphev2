-- ==========================================================
-- SUPABASE — Script de migration COMPLET
-- Exécuter UNE SEULE FOIS dans : Supabase Dashboard → SQL Editor
--
-- Ce fichier inclut TOUTES les tables manquantes du projet
-- (004_espace_client + 005_missing_tables regroupés)
-- ==========================================================

-- ============================================================
-- PARTIE 1 : ESPACE CLIENT (anciennement 004_espace_client.sql)
-- ============================================================

CREATE TABLE IF NOT EXISTS client_accounts (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS client_projects (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'Projet',
  status VARCHAR(30) DEFAULT 'en_cours',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  manager_name TEXT,
  manager_email TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS client_milestones (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES client_projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  due_date TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS client_documents (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES client_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_type VARCHAR(20) DEFAULT 'PDF',
  file_size TEXT,
  url TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS client_messages (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES client_projects(id) ON DELETE CASCADE,
  client_id INTEGER NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  sender_role VARCHAR(20) DEFAULT 'client',
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_client_projects_client_id ON client_projects(client_id);
CREATE INDEX IF NOT EXISTS idx_client_milestones_project_id ON client_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_project_id ON client_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_project_id ON client_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_client_messages_client_id ON client_messages(client_id);

-- ============================================================
-- PARTIE 2 : TABLES MÉTIER MANQUANTES (005_missing_tables.sql)
-- ============================================================

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  source VARCHAR(50) DEFAULT 'WEBSITE',
  tags TEXT[],
  metadata JSONB,
  confirmed_at TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS project_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  position TEXT,
  project_type VARCHAR(100),
  project_name TEXT,
  project_description TEXT,
  budget VARCHAR(50),
  timeline VARCHAR(50),
  features TEXT[],
  requirements TEXT,
  design_style VARCHAR(50),
  reference_urls TEXT[],
  technologies TEXT[],
  integrations TEXT[],
  metadata JSONB,
  status VARCHAR(20) NOT NULL DEFAULT 'NEW',
  priority VARCHAR(20) DEFAULT 'MEDIUM',
  assigned_to UUID REFERENCES users(id),
  internal_notes TEXT,
  source VARCHAR(50) DEFAULT 'CONFIGURATOR',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  hub VARCHAR(100) NOT NULL DEFAULT 'evenements',
  accroche TEXT,
  hero_image TEXT,
  hero_video TEXT,
  body TEXT,
  service_blocks JSONB,
  advantage_fabrique JSONB,
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

CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  client_id UUID REFERENCES client_references(id) ON DELETE SET NULL,
  client_name TEXT,
  problem TEXT,
  solution TEXT,
  results TEXT,
  kpis JSONB,
  gallery JSONB,
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

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  photo TEXT,
  email TEXT,
  social_links JSONB,
  is_published BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  department VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Index sur les tables métier
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_project_briefs_status ON project_briefs(status);
CREATE INDEX IF NOT EXISTS idx_project_briefs_email ON project_briefs(email);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_hub ON services(hub);
CREATE INDEX IF NOT EXISTS idx_client_ref_slug ON client_references(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_team_members_published ON team_members(is_published);

-- Triggers updated_at pour les nouvelles tables
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
    'client_accounts',
    'client_projects',
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

-- ============================================================
-- RÉCAPITULATIF DES TABLES DU PROJET APRÈS CETTE MIGRATION
-- ============================================================
-- Créées par 001_initial_schema.sql :
--   users, categories, articles, events, pages, media,
--   navigation_menus, settings, contact_messages, audit_logs
--
-- Créées par CE FICHIER (ALL_MISSING_TABLES.sql) :
--   client_accounts, client_projects, client_milestones,
--   client_documents, client_messages,
--   newsletter_subscriptions, project_briefs, services,
--   client_references, case_studies, testimonials, team_members
--
-- TOTAL : 22 tables — 0 mock en production
-- ============================================================
