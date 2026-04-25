-- ============================================================
-- BMI 360™ — Phase Transform & Funnel Analytics
-- Tables: expert_consultations + funnel_events
-- ============================================================

-- 1) RDV expert humain (étape Transform du tunnel CDC)
CREATE TABLE IF NOT EXISTS expert_consultations (
  id                  VARCHAR DEFAULT gen_random_uuid() PRIMARY KEY,
  scoring_result_id   VARCHAR(36),
  tool_id             VARCHAR(50),
  contact_name        TEXT NOT NULL,
  contact_email       TEXT NOT NULL,
  contact_phone       VARCHAR(30),
  company_name        TEXT,
  job_title           TEXT,
  company_size        VARCHAR(30),
  message             TEXT,
  preferred_slot      VARCHAR(30),
  preferred_channel   VARCHAR(20) DEFAULT 'visio',
  status              VARCHAR(20) DEFAULT 'new',
  scheduled_at        TIMESTAMP,
  expert_notes        TEXT,
  source              VARCHAR(30) DEFAULT 'intelligence-report',
  ip_address          VARCHAR(45),
  user_agent          TEXT,
  created_at          TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at          TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_expert_consult_status ON expert_consultations(status);
CREATE INDEX IF NOT EXISTS idx_expert_consult_email  ON expert_consultations(contact_email);
CREATE INDEX IF NOT EXISTS idx_expert_consult_scoring ON expert_consultations(scoring_result_id);

-- 2) Funnel events — analytics & cron de relance Discover
CREATE TABLE IF NOT EXISTS funnel_events (
  id                  SERIAL PRIMARY KEY,
  scoring_result_id   VARCHAR(36),
  tool_id             VARCHAR(50),
  event_type          VARCHAR(50) NOT NULL,
  email               TEXT,
  metadata            JSONB,
  created_at          TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_funnel_events_type     ON funnel_events(event_type);
CREATE INDEX IF NOT EXISTS idx_funnel_events_scoring  ON funnel_events(scoring_result_id);
CREATE INDEX IF NOT EXISTS idx_funnel_events_email    ON funnel_events(email);
CREATE INDEX IF NOT EXISTS idx_funnel_events_created  ON funnel_events(created_at DESC);
