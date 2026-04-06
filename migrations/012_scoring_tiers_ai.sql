-- Migration 012 : Ajout colonnes tier/IA sur scoring_results
-- CDC Tunnel : Discover (gratuit) → Intelligence (payant) → Transform (devis)

ALTER TABLE scoring_results
  ADD COLUMN IF NOT EXISTS tier VARCHAR(20) NOT NULL DEFAULT 'discover',
  ADD COLUMN IF NOT EXISTS voice_type VARCHAR(20) DEFAULT 'direction',
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS respondent_name TEXT,
  ADD COLUMN IF NOT EXISTS ai_report JSONB,
  ADD COLUMN IF NOT EXISTS intelligence_payment_ref VARCHAR(100),
  ADD COLUMN IF NOT EXISTS intelligence_unlocked_at TIMESTAMPTZ;

-- Index pour requêtes admin par tier
CREATE INDEX IF NOT EXISTS idx_scoring_results_tier ON scoring_results(tier);
CREATE INDEX IF NOT EXISTS idx_scoring_results_email ON scoring_results(email);
