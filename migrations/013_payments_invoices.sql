-- ============================================================
-- Migration 013 : Paiements PayPal/CMI + Table Factures
-- ============================================================

-- 1. Mise à jour table payments : ajout champs PayPal, CMI, scoringResultId, invoiceId
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS scoring_result_id TEXT,
  ADD COLUMN IF NOT EXISTS paypal_order_id TEXT,
  ADD COLUMN IF NOT EXISTS paypal_capture_id TEXT,
  ADD COLUMN IF NOT EXISTS cmi_order_id TEXT,
  ADD COLUMN IF NOT EXISTS cmi_transaction_id TEXT,
  ADD COLUMN IF NOT EXISTS invoice_id INTEGER;

-- 2. Mise à jour des valeurs autorisées pour payment_method
-- (ancienne contrainte éventuelle supprimée)
-- ex: 'paypal', 'cmi', 'virement', 'cheque'

-- 3. Mise à jour des valeurs autorisées pour type
-- ex: 'devis', 'subscription', 'intelligence'

-- 4. Mise à jour des valeurs autorisées pour status
-- ex: 'pending', 'paid', 'failed', 'refunded', 'cancelled'

-- 5. Création table invoices (factures avec TVA 20% Maroc)
CREATE TABLE IF NOT EXISTS invoices (
  id                SERIAL PRIMARY KEY,
  invoice_number    VARCHAR(30) NOT NULL UNIQUE,   -- ex: FAC-2026-0001
  payment_id        INTEGER REFERENCES payments(id) ON DELETE SET NULL,
  scoring_result_id TEXT,
  client_email      TEXT NOT NULL,
  client_name       TEXT NOT NULL,
  client_company    TEXT,
  tool_id           VARCHAR(30),
  description       TEXT,
  amount_ht         INTEGER NOT NULL,              -- centimes MAD hors taxes
  tva_rate          INTEGER NOT NULL DEFAULT 20,   -- 20% TVA Maroc
  amount_tva        INTEGER NOT NULL,              -- centimes MAD
  amount_ttc        INTEGER NOT NULL,              -- centimes MAD TTC
  currency          VARCHAR(5) DEFAULT 'MAD',
  status            VARCHAR(20) DEFAULT 'draft',   -- draft | sent | paid | cancelled
  pdf_base64        TEXT,
  pdf_url           TEXT,
  issued_at         TIMESTAMPTZ DEFAULT NOW(),
  paid_at           TIMESTAMPTZ,
  sent_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Index utiles
CREATE INDEX IF NOT EXISTS idx_invoices_client_email      ON invoices(client_email);
CREATE INDEX IF NOT EXISTS idx_invoices_status            ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_scoring_result_id ON invoices(scoring_result_id);
CREATE INDEX IF NOT EXISTS idx_payments_paypal_order      ON payments(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_cmi_order         ON payments(cmi_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_scoring_result    ON payments(scoring_result_id);
