-- ============================================================
-- Migration 010 — Toutes les tables restantes (Phase 2 + Scoring)
-- Idempotent : utilise CREATE TABLE IF NOT EXISTS
-- À exécuter dans Supabase Dashboard → SQL Editor
--
-- Inclut :
--   • push_subscriptions     (notifications push RGPD)
--   • webauthn_credentials   (authentification biométrique FIDO2)
--   • webauthn_challenges    (sessions temporaires challenge/response)
--   • qr_codes               (QR codes UTM dynamiques)
--   • resources              (bibliothèque de l'influence)
--   • scoring_results        (résultats BMI 360™ persistés)
-- ============================================================

-- ============================================================
-- 1. PUSH NOTIFICATIONS (opt-in RGPD)
-- ============================================================
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id                  SERIAL PRIMARY KEY,
  client_account_id   INTEGER REFERENCES client_accounts(id) ON DELETE SET NULL,
  endpoint            TEXT NOT NULL UNIQUE,
  keys_p256dh         TEXT NOT NULL,
  keys_auth           TEXT NOT NULL,
  categories          JSONB DEFAULT '[]',
  is_active           BOOLEAN DEFAULT TRUE,
  created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active
  ON push_subscriptions(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_client
  ON push_subscriptions(client_account_id);

-- ============================================================
-- 2. WEBAUTHN / FIDO2 CREDENTIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS webauthn_credentials (
  id                  SERIAL PRIMARY KEY,
  client_account_id   INTEGER NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  credential_id       TEXT NOT NULL UNIQUE,
  public_key          TEXT NOT NULL,
  counter             INTEGER NOT NULL DEFAULT 0,
  device_name         TEXT DEFAULT 'Appareil inconnu',
  aaguid              TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_used_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_webauthn_creds_client
  ON webauthn_credentials(client_account_id);

-- ============================================================
-- 3. WEBAUTHN CHALLENGES (sessions temporaires)
-- ============================================================
CREATE TABLE IF NOT EXISTS webauthn_challenges (
  id                  SERIAL PRIMARY KEY,
  client_account_id   INTEGER NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  challenge           TEXT NOT NULL,
  type                VARCHAR(20) DEFAULT 'register',  -- register | authenticate
  expires_at          TIMESTAMPTZ NOT NULL,
  created_at          TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_webauthn_challenges_client
  ON webauthn_challenges(client_account_id, type);

-- Nettoyage automatique des challenges expirés (optionnel, via pg_cron)
-- SELECT cron.schedule('clean-webauthn-challenges', '*/15 * * * *',
--   'DELETE FROM webauthn_challenges WHERE expires_at < NOW()');

-- ============================================================
-- 4. QR CODES avec UTM Deep Linking
-- ============================================================
CREATE TABLE IF NOT EXISTS qr_codes (
  id           VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  label        TEXT NOT NULL,
  target_path  TEXT NOT NULL,
  utm_source   VARCHAR(100) NOT NULL,
  utm_medium   VARCHAR(100) NOT NULL,
  utm_campaign VARCHAR(200) NOT NULL,
  utm_content  VARCHAR(200),
  svg_data     TEXT,
  is_active    BOOLEAN DEFAULT TRUE,
  scan_count   INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_qr_codes_active
  ON qr_codes(is_active) WHERE is_active = TRUE;

-- ============================================================
-- 5. RESSOURCES CLIENTS (Bibliothèque de l'Influence)
-- ============================================================
CREATE TABLE IF NOT EXISTS resources (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  description   TEXT,
  category      VARCHAR(80) NOT NULL DEFAULT 'guide',
  -- guide | modele | etude_de_cas | fiche_technique | video | webinaire
  format        VARCHAR(30) DEFAULT 'PDF',
  file_size     VARCHAR(20),
  download_url  TEXT,
  thumbnail_url TEXT,
  access_level  VARCHAR(20) DEFAULT 'client',
  -- public | lead | client
  tags          JSONB DEFAULT '[]',
  is_new        BOOLEAN DEFAULT FALSE,
  is_published  BOOLEAN DEFAULT TRUE,
  sort_order    INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_resources_published
  ON resources(is_published) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_resources_access
  ON resources(access_level);

-- ============================================================
-- 6. SCORING RESULTS BMI 360™
-- ============================================================
CREATE TABLE IF NOT EXISTS scoring_results (
  id               VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  tool_id          VARCHAR(50) NOT NULL,
  -- commpulse | talentprint | impacttrace | safesignal | eventimpact | spacescore | finnarrative
  company_name     TEXT,
  sector           VARCHAR(80),
  company_size     VARCHAR(30),
  respondent_type  VARCHAR(20) DEFAULT 'direction', -- direction | terrain
  global_score     INTEGER NOT NULL,
  pillar_scores    JSONB NOT NULL,
  maturity_level   INTEGER NOT NULL,  -- 1=Fragile … 5=Leader
  recommendations  JSONB,
  roi_estimate     BIGINT,            -- en MAD
  session_id       TEXT,
  user_agent       TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_scoring_results_tool
  ON scoring_results(tool_id);
CREATE INDEX IF NOT EXISTS idx_scoring_results_date
  ON scoring_results(created_at DESC);

-- ============================================================
-- SEED — Ressources par défaut
-- ============================================================
INSERT INTO resources (title, description, category, format, access_level, sort_order, is_published)
VALUES
  ('Guide BMI 360™ — Comprendre votre maturité de communication', 'Découvrez les 7 dimensions du modèle BMI 360™ et comment les mesurer.', 'guide', 'PDF', 'public', 1, TRUE),
  ('Checklist Vigilance QHSE — 30 points de contrôle', 'Auditez votre conformité QHSE en 30 questions essentielles.', 'modele', 'PDF', 'lead', 2, TRUE),
  ('Étude sectorielle — Communication Interne MENA 2025', 'Benchmark sectoriel sur 120 entreprises de la région MENA.', 'etude_de_cas', 'PDF', 'client', 3, TRUE),
  ('Modèle de Plan de Communication Événementielle', 'Template complet pour planifier votre prochain événement corporate.', 'modele', 'DOCX', 'client', 4, TRUE),
  ('Fiche technique — Signalétique QHSE réglementaire', 'Normes marocaines et internationales pour la signalétique de sécurité.', 'fiche_technique', 'PDF', 'public', 5, TRUE)
ON CONFLICT DO NOTHING;
