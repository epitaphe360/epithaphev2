-- ============================================================
-- Migration 004 — Phase 2 tables
-- Push Notifications, WebAuthn, QR Codes
-- ============================================================

-- Push Subscriptions (RGPD opt-in)
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id              SERIAL PRIMARY KEY,
  client_account_id INTEGER REFERENCES client_accounts(id) ON DELETE SET NULL,
  endpoint        TEXT NOT NULL UNIQUE,
  keys_p256dh     TEXT NOT NULL,
  keys_auth       TEXT NOT NULL,
  categories      JSON DEFAULT '[]',
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active ON push_subscriptions(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_client ON push_subscriptions(client_account_id);

-- WebAuthn Credentials (FIDO2)
CREATE TABLE IF NOT EXISTS webauthn_credentials (
  id                SERIAL PRIMARY KEY,
  client_account_id INTEGER NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  credential_id     TEXT NOT NULL UNIQUE,
  public_key        TEXT NOT NULL,
  counter           INTEGER NOT NULL DEFAULT 0,
  device_name       TEXT DEFAULT 'Appareil inconnu',
  aaguid            TEXT,
  created_at        TIMESTAMP DEFAULT NOW() NOT NULL,
  last_used_at      TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_webauthn_creds_client ON webauthn_credentials(client_account_id);

-- WebAuthn Challenges (sessions temporaires)
CREATE TABLE IF NOT EXISTS webauthn_challenges (
  id                SERIAL PRIMARY KEY,
  client_account_id INTEGER NOT NULL REFERENCES client_accounts(id) ON DELETE CASCADE,
  challenge         TEXT NOT NULL,
  type              VARCHAR(20) DEFAULT 'register',
  expires_at        TIMESTAMP NOT NULL,
  created_at        TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_webauthn_challenges_client ON webauthn_challenges(client_account_id, type);

-- QR Codes avec UTM Deep Linking
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
  created_at   TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_qr_codes_active ON qr_codes(is_active) WHERE is_active = TRUE;
