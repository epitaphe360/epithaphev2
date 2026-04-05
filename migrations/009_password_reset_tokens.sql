-- Migration 009 — Password Reset Tokens
-- Stockage des tokens de réinitialisation de mot de passe (admin + client)

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id          SERIAL PRIMARY KEY,
  token       VARCHAR(128) NOT NULL UNIQUE,
  email       TEXT NOT NULL,
  account_type VARCHAR(10) NOT NULL DEFAULT 'admin', -- 'admin' | 'client'
  expires_at  TIMESTAMP NOT NULL,
  used_at     TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prt_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_prt_email ON password_reset_tokens(email);
