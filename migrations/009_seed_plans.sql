-- Migration 009 — Tables de paiement + Plans d'abonnement par défaut
-- Epitaphe360 — Starter · Pro · Expert
-- À exécuter sur Supabase (SQL Editor)

-- ============================================================
-- TABLE 1 : subscription_plans
-- ============================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  slug          VARCHAR(50) NOT NULL UNIQUE,
  description   TEXT,
  price_monthly INTEGER NOT NULL,
  price_annual  INTEGER NOT NULL,
  currency      VARCHAR(5) DEFAULT 'MAD',
  features      JSONB DEFAULT '[]',
  max_projects  INTEGER DEFAULT 1,
  max_users     INTEGER DEFAULT 1,
  is_active     BOOLEAN DEFAULT TRUE,
  sort_order    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- TABLE 2 : client_subscriptions
-- ============================================================
CREATE TABLE IF NOT EXISTS client_subscriptions (
  id                    SERIAL PRIMARY KEY,
  client_id             INTEGER NOT NULL REFERENCES client_accounts(id),
  plan_id               INTEGER NOT NULL REFERENCES subscription_plans(id),
  status                VARCHAR(20) DEFAULT 'active',
  billing_cycle         VARCHAR(10) DEFAULT 'monthly',
  current_period_start  TIMESTAMPTZ NOT NULL,
  current_period_end    TIMESTAMPTZ NOT NULL,
  cancel_at_period_end  BOOLEAN DEFAULT FALSE,
  stripe_subscription_id TEXT,
  stripe_customer_id    TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at            TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- TABLE 3 : devis
-- ============================================================
CREATE TABLE IF NOT EXISTS devis (
  id                       SERIAL PRIMARY KEY,
  reference                VARCHAR(30) NOT NULL UNIQUE,
  client_id                INTEGER REFERENCES client_accounts(id),
  client_name              TEXT NOT NULL,
  client_email             TEXT NOT NULL,
  client_company           TEXT,
  client_phone             TEXT,
  title                    TEXT NOT NULL,
  description              TEXT,
  items                    JSONB DEFAULT '[]',
  subtotal                 INTEGER NOT NULL,
  tax_rate                 INTEGER DEFAULT 20,
  tax_amount               INTEGER NOT NULL,
  total                    INTEGER NOT NULL,
  currency                 VARCHAR(5) DEFAULT 'MAD',
  status                   VARCHAR(20) DEFAULT 'draft',
  valid_until              TIMESTAMPTZ,
  source_tool              VARCHAR(50),
  scoring_data             JSONB,
  admin_notes              TEXT,
  notes                    TEXT,
  sent_at                  TIMESTAMPTZ,
  viewed_at                TIMESTAMPTZ,
  accepted_at              TIMESTAMPTZ,
  refused_at               TIMESTAMPTZ,
  stripe_payment_intent_id TEXT,
  paid_at                  TIMESTAMPTZ,
  created_at               TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at               TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- TABLE 4 : payments
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id                       SERIAL PRIMARY KEY,
  client_id                INTEGER REFERENCES client_accounts(id),
  devis_id                 INTEGER REFERENCES devis(id),
  subscription_id          INTEGER REFERENCES client_subscriptions(id),
  type                     VARCHAR(20) NOT NULL,
  amount                   INTEGER NOT NULL,
  currency                 VARCHAR(5) DEFAULT 'MAD',
  status                   VARCHAR(20) DEFAULT 'pending',
  payment_method           VARCHAR(30),
  stripe_payment_intent_id TEXT,
  stripe_charge_id         TEXT,
  receipt_url              TEXT,
  metadata                 JSONB,
  created_at               TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at               TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- SEED — Plans par défaut
-- ============================================================
INSERT INTO subscription_plans (name, slug, description, price_monthly, price_annual, features, is_active, sort_order)
VALUES
  (
    'Starter',
    'starter',
    'Accès essentiel à la plateforme Epitaphe360',
    49000,   -- 490 MAD/mois
    490000,  -- 4 900 MAD/an
    '["Accès au tableau de bord client","Suivi de 1 projet actif","Bibliothèque de ressources","Support email"]',
    true,
    1
  ),
  (
    'Pro',
    'pro',
    'Pour les entreprises avec des besoins récurrents',
    99000,   -- 990 MAD/mois
    990000,  -- 9 900 MAD/an
    '["Jusqu''à 5 projets actifs","Rapports mensuels personnalisés","Accès aux outils BMI 360™","Support prioritaire","Réunions de suivi bi-mensuelles"]',
    true,
    2
  ),
  (
    'Expert',
    'expert',
    'Accompagnement stratégique complet',
    199000,  -- 1 990 MAD/mois
    1990000, -- 19 900 MAD/an
    '["Projets illimités","Chef de projet dédié","Tableaux de bord analytiques avancés","Accès API","SLA garanti 24h","Formations équipe incluses"]',
    true,
    3
  )
ON CONFLICT (slug) DO UPDATE SET
  name          = EXCLUDED.name,
  description   = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_annual  = EXCLUDED.price_annual,
  features      = EXCLUDED.features,
  is_active     = EXCLUDED.is_active,
  sort_order    = EXCLUDED.sort_order;
