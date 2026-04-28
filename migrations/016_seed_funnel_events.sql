-- ============================================================
-- MIGRATION 016: Données de test — Funnel BMI 360™
-- Simule 30 jours d'activité réaliste sur les 7 outils
-- Autonome : crée la table si elle n'existe pas encore
-- ============================================================

-- 1) Création de la table si absente (idempotent)
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
CREATE INDEX IF NOT EXISTS idx_funnel_events_tool_id  ON funnel_events(tool_id);
CREATE INDEX IF NOT EXISTS idx_funnel_events_email    ON funnel_events(email);
CREATE INDEX IF NOT EXISTS idx_funnel_events_created  ON funnel_events(created_at DESC);

-- 2) Nettoyage préalable des données de test (si re-run)
DELETE FROM funnel_events WHERE email LIKE '%@test-bmi360.ma';

-- ============================================================
-- OUTIL: CommPulse™ — 40 discovers, bon taux de conversion
-- ============================================================
INSERT INTO funnel_events (scoring_result_id, tool_id, event_type, email, metadata, created_at) VALUES

-- Discover complétés (40)
('cmp-001', 'commpulse', 'discover_completed', 'sarah.benali@test-bmi360.ma', '{"companyName":"MediaPulse SARL","sector":"communication"}', NOW() - INTERVAL '28 days'),
('cmp-002', 'commpulse', 'discover_completed', 'karim.alami@test-bmi360.ma', '{"companyName":"Créacom","sector":"communication"}', NOW() - INTERVAL '27 days'),
('cmp-003', 'commpulse', 'discover_completed', 'fatima.tazi@test-bmi360.ma', '{"companyName":"Agence 360","sector":"communication"}', NOW() - INTERVAL '26 days'),
('cmp-004', 'commpulse', 'discover_completed', 'youssef.bennis@test-bmi360.ma', '{"companyName":"CommGroup","sector":"marketing"}', NOW() - INTERVAL '25 days'),
('cmp-005', 'commpulse', 'discover_completed', 'nadia.chaoui@test-bmi360.ma', '{"companyName":"Branding Studio","sector":"communication"}', NOW() - INTERVAL '24 days'),
('cmp-006', 'commpulse', 'discover_completed', 'omar.berrada@test-bmi360.ma', '{"companyName":"Digital Wave","sector":"digital"}', NOW() - INTERVAL '23 days'),
('cmp-007', 'commpulse', 'discover_completed', 'leila.fassi@test-bmi360.ma', '{"companyName":"Ad Maroc","sector":"publicité"}', NOW() - INTERVAL '22 days'),
('cmp-008', 'commpulse', 'discover_completed', 'hamid.zouhair@test-bmi360.ma', '{"companyName":"Print & Com","sector":"impression"}', NOW() - INTERVAL '21 days'),
('cmp-009', 'commpulse', 'discover_completed', 'siham.kabbaj@test-bmi360.ma', '{"companyName":"Comm Solutions","sector":"conseil"}', NOW() - INTERVAL '20 days'),
('cmp-010', 'commpulse', 'discover_completed', 'rachid.mounir@test-bmi360.ma', '{"companyName":"Event & Co","sector":"événementiel"}', NOW() - INTERVAL '19 days'),
('cmp-011', 'commpulse', 'discover_completed', 'amina.slimani@test-bmi360.ma', '{"companyName":"MediaVision","sector":"media"}', NOW() - INTERVAL '18 days'),
('cmp-012', 'commpulse', 'discover_completed', 'tarik.benali@test-bmi360.ma', '{"companyName":"Pub & Click","sector":"digital"}', NOW() - INTERVAL '17 days'),
('cmp-013', 'commpulse', 'discover_completed', 'zineb.hajji@test-bmi360.ma', '{"companyName":"ComExpert","sector":"conseil"}', NOW() - INTERVAL '16 days'),
('cmp-014', 'commpulse', 'discover_completed', 'mehdi.ouali@test-bmi360.ma', '{"companyName":"Agence Nova","sector":"communication"}', NOW() - INTERVAL '15 days'),
('cmp-015', 'commpulse', 'discover_completed', 'houda.talbi@test-bmi360.ma', '{"companyName":"StratCom","sector":"stratégie"}', NOW() - INTERVAL '14 days'),
('cmp-016', 'commpulse', 'discover_completed', 'amine.benkirane@test-bmi360.ma', '{"companyName":"BrandFirst","sector":"branding"}', NOW() - INTERVAL '13 days'),
('cmp-017', 'commpulse', 'discover_completed', 'samira.ouafi@test-bmi360.ma', '{"companyName":"Créa Plus","sector":"design"}', NOW() - INTERVAL '12 days'),
('cmp-018', 'commpulse', 'discover_completed', 'younes.lahlali@test-bmi360.ma', '{"companyName":"MarketPro","sector":"marketing"}', NOW() - INTERVAL '11 days'),
('cmp-019', 'commpulse', 'discover_completed', 'halima.el-fassi@test-bmi360.ma', '{"companyName":"PubliGroup","sector":"publicité"}', NOW() - INTERVAL '10 days'),
('cmp-020', 'commpulse', 'discover_completed', 'badr.alaoui@test-bmi360.ma', '{"companyName":"DigitalPub","sector":"digital"}', NOW() - INTERVAL '9 days'),
('cmp-021', 'commpulse', 'discover_completed', 'kenza.benhassane@test-bmi360.ma', '{"companyName":"Media360","sector":"media"}', NOW() - INTERVAL '8 days'),
('cmp-022', 'commpulse', 'discover_completed', 'driss.cherkaoui@test-bmi360.ma', '{"companyName":"ComAgency","sector":"communication"}', NOW() - INTERVAL '7 days'),
('cmp-023', 'commpulse', 'discover_completed', 'meryem.tahir@test-bmi360.ma', '{"companyName":"Brand Studio","sector":"branding"}', NOW() - INTERVAL '6 days'),
('cmp-024', 'commpulse', 'discover_completed', 'hassan.oubella@test-bmi360.ma', '{"companyName":"EventCom","sector":"événementiel"}', NOW() - INTERVAL '5 days'),
('cmp-025', 'commpulse', 'discover_completed', 'layla.sefrioui@test-bmi360.ma', '{"companyName":"Stratégies","sector":"conseil"}', NOW() - INTERVAL '4 days'),
('cmp-026', 'commpulse', 'discover_completed', 'adil.benchekroun@test-bmi360.ma', '{"companyName":"InfluenceCo","sector":"influence"}', NOW() - INTERVAL '3 days'),
('cmp-027', 'commpulse', 'discover_completed', 'nihal.bakri@test-bmi360.ma', '{"companyName":"AgenceW","sector":"web"}', NOW() - INTERVAL '2 days'),
('cmp-028', 'commpulse', 'discover_completed', 'said.benali@test-bmi360.ma', '{"companyName":"Spark Agency","sector":"communication"}', NOW() - INTERVAL '1 day'),

-- Emails envoyés (28 sur 28)
('cmp-001', 'commpulse', 'discover_email_sent', 'sarah.benali@test-bmi360.ma', '{}', NOW() - INTERVAL '28 days' + INTERVAL '5 minutes'),
('cmp-002', 'commpulse', 'discover_email_sent', 'karim.alami@test-bmi360.ma', '{}', NOW() - INTERVAL '27 days' + INTERVAL '5 minutes'),
('cmp-003', 'commpulse', 'discover_email_sent', 'fatima.tazi@test-bmi360.ma', '{}', NOW() - INTERVAL '26 days' + INTERVAL '5 minutes'),
('cmp-004', 'commpulse', 'discover_email_sent', 'youssef.bennis@test-bmi360.ma', '{}', NOW() - INTERVAL '25 days' + INTERVAL '5 minutes'),
('cmp-005', 'commpulse', 'discover_email_sent', 'nadia.chaoui@test-bmi360.ma', '{}', NOW() - INTERVAL '24 days' + INTERVAL '5 minutes'),
('cmp-006', 'commpulse', 'discover_email_sent', 'omar.berrada@test-bmi360.ma', '{}', NOW() - INTERVAL '23 days' + INTERVAL '5 minutes'),
('cmp-007', 'commpulse', 'discover_email_sent', 'leila.fassi@test-bmi360.ma', '{}', NOW() - INTERVAL '22 days' + INTERVAL '5 minutes'),
('cmp-008', 'commpulse', 'discover_email_sent', 'hamid.zouhair@test-bmi360.ma', '{}', NOW() - INTERVAL '21 days' + INTERVAL '5 minutes'),
('cmp-009', 'commpulse', 'discover_email_sent', 'siham.kabbaj@test-bmi360.ma', '{}', NOW() - INTERVAL '20 days' + INTERVAL '5 minutes'),
('cmp-010', 'commpulse', 'discover_email_sent', 'rachid.mounir@test-bmi360.ma', '{}', NOW() - INTERVAL '19 days' + INTERVAL '5 minutes'),
('cmp-011', 'commpulse', 'discover_email_sent', 'amina.slimani@test-bmi360.ma', '{}', NOW() - INTERVAL '18 days' + INTERVAL '5 minutes'),
('cmp-012', 'commpulse', 'discover_email_sent', 'tarik.benali@test-bmi360.ma', '{}', NOW() - INTERVAL '17 days' + INTERVAL '5 minutes'),
('cmp-013', 'commpulse', 'discover_email_sent', 'zineb.hajji@test-bmi360.ma', '{}', NOW() - INTERVAL '16 days' + INTERVAL '5 minutes'),
('cmp-014', 'commpulse', 'discover_email_sent', 'mehdi.ouali@test-bmi360.ma', '{}', NOW() - INTERVAL '15 days' + INTERVAL '5 minutes'),
('cmp-015', 'commpulse', 'discover_email_sent', 'houda.talbi@test-bmi360.ma', '{}', NOW() - INTERVAL '14 days' + INTERVAL '5 minutes'),
('cmp-016', 'commpulse', 'discover_email_sent', 'amine.benkirane@test-bmi360.ma', '{}', NOW() - INTERVAL '13 days' + INTERVAL '5 minutes'),
('cmp-017', 'commpulse', 'discover_email_sent', 'samira.ouafi@test-bmi360.ma', '{}', NOW() - INTERVAL '12 days' + INTERVAL '5 minutes'),
('cmp-018', 'commpulse', 'discover_email_sent', 'younes.lahlali@test-bmi360.ma', '{}', NOW() - INTERVAL '11 days' + INTERVAL '5 minutes'),
('cmp-019', 'commpulse', 'discover_email_sent', 'halima.el-fassi@test-bmi360.ma', '{}', NOW() - INTERVAL '10 days' + INTERVAL '5 minutes'),
('cmp-020', 'commpulse', 'discover_email_sent', 'badr.alaoui@test-bmi360.ma', '{}', NOW() - INTERVAL '9 days' + INTERVAL '5 minutes'),

-- Paiements initiés (14 sur 28)
('cmp-001', 'commpulse', 'intelligence_payment_initiated', 'sarah.benali@test-bmi360.ma', '{"amount":149900,"currency":"MAD"}', NOW() - INTERVAL '27 days'),
('cmp-003', 'commpulse', 'intelligence_payment_initiated', 'fatima.tazi@test-bmi360.ma', '{"amount":149900,"currency":"MAD"}', NOW() - INTERVAL '25 days'),
('cmp-005', 'commpulse', 'intelligence_payment_initiated', 'nadia.chaoui@test-bmi360.ma', '{"amount":149900,"currency":"MAD"}', NOW() - INTERVAL '23 days'),
('cmp-007', 'commpulse', 'intelligence_payment_initiated', 'leila.fassi@test-bmi360.ma', '{"amount":149900,"currency":"MAD"}', NOW() - INTERVAL '21 days'),
('cmp-009', 'commpulse', 'intelligence_payment_initiated', 'siham.kabbaj@test-bmi360.ma', '{"amount":149900,"currency":"MAD"}', NOW() - INTERVAL '19 days'),
('cmp-011', 'commpulse', 'intelligence_payment_initiated', 'amina.slimani@test-bmi360.ma', '{"amount":149900,"currency":"MAD"}', NOW() - INTERVAL '17 days'),
('cmp-013', 'commpulse', 'intelligence_payment_initiated', 'zineb.hajji@test-bmi360.ma', '{"amount":149900,"currency":"MAD"}', NOW() - INTERVAL '15 days'),
('cmp-015', 'commpulse', 'intelligence_payment_initiated', 'houda.talbi@test-bmi360.ma', '{"amount":149900,"currency":"MAD"}', NOW() - INTERVAL '13 days'),
('cmp-017', 'commpulse', 'intelligence_payment_initiated', 'samira.ouafi@test-bmi360.ma', '{"amount":149900,"currency":"MAD"}', NOW() - INTERVAL '11 days'),
('cmp-019', 'commpulse', 'intelligence_payment_initiated', 'halima.el-fassi@test-bmi360.ma', '{"amount":149900,"currency":"MAD"}', NOW() - INTERVAL '9 days'),
('cmp-021', 'commpulse', 'intelligence_payment_initiated', 'kenza.benhassane@test-bmi360.ma', '{"amount":149900,"currency":"MAD"}', NOW() - INTERVAL '7 days'),
('cmp-023', 'commpulse', 'intelligence_payment_initiated', 'meryem.tahir@test-bmi360.ma', '{"amount":149900,"currency":"MAD"}', NOW() - INTERVAL '5 days'),
('cmp-025', 'commpulse', 'intelligence_payment_initiated', 'layla.sefrioui@test-bmi360.ma', '{"amount":149900,"currency":"MAD"}', NOW() - INTERVAL '3 days'),
('cmp-027', 'commpulse', 'intelligence_payment_initiated', 'nihal.bakri@test-bmi360.ma', '{"amount":149900,"currency":"MAD"}', NOW() - INTERVAL '1 day'),

-- Rapports IA déverrouillés (11 sur 14)
('cmp-001', 'commpulse', 'intelligence_unlocked', 'sarah.benali@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '27 days' + INTERVAL '30 minutes'),
('cmp-003', 'commpulse', 'intelligence_unlocked', 'fatima.tazi@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '25 days' + INTERVAL '30 minutes'),
('cmp-005', 'commpulse', 'intelligence_unlocked', 'nadia.chaoui@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '23 days' + INTERVAL '30 minutes'),
('cmp-007', 'commpulse', 'intelligence_unlocked', 'leila.fassi@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '21 days' + INTERVAL '30 minutes'),
('cmp-009', 'commpulse', 'intelligence_unlocked', 'siham.kabbaj@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '19 days' + INTERVAL '30 minutes'),
('cmp-011', 'commpulse', 'intelligence_unlocked', 'amina.slimani@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '17 days' + INTERVAL '30 minutes'),
('cmp-013', 'commpulse', 'intelligence_unlocked', 'zineb.hajji@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '15 days' + INTERVAL '30 minutes'),
('cmp-015', 'commpulse', 'intelligence_unlocked', 'houda.talbi@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '13 days' + INTERVAL '30 minutes'),
('cmp-017', 'commpulse', 'intelligence_unlocked', 'samira.ouafi@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '11 days' + INTERVAL '30 minutes'),
('cmp-019', 'commpulse', 'intelligence_unlocked', 'halima.el-fassi@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '9 days' + INTERVAL '30 minutes'),
('cmp-021', 'commpulse', 'intelligence_unlocked', 'kenza.benhassane@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '7 days' + INTERVAL '30 minutes'),

-- RDV Expert demandés (5 sur 11)
('cmp-001', 'commpulse', 'expert_requested', 'sarah.benali@test-bmi360.ma', '{"preferredDate":"2026-05-05"}', NOW() - INTERVAL '26 days'),
('cmp-003', 'commpulse', 'expert_requested', 'fatima.tazi@test-bmi360.ma', '{"preferredDate":"2026-05-06"}', NOW() - INTERVAL '24 days'),
('cmp-007', 'commpulse', 'expert_requested', 'leila.fassi@test-bmi360.ma', '{"preferredDate":"2026-05-07"}', NOW() - INTERVAL '20 days'),
('cmp-013', 'commpulse', 'expert_requested', 'zineb.hajji@test-bmi360.ma', '{"preferredDate":"2026-05-08"}', NOW() - INTERVAL '14 days'),
('cmp-017', 'commpulse', 'expert_requested', 'samira.ouafi@test-bmi360.ma', '{"preferredDate":"2026-05-09"}', NOW() - INTERVAL '10 days'),

-- Relances
('cmp-002', 'commpulse', 'relance_d1_sent', 'karim.alami@test-bmi360.ma', '{}', NOW() - INTERVAL '26 days'),
('cmp-004', 'commpulse', 'relance_d1_sent', 'youssef.bennis@test-bmi360.ma', '{}', NOW() - INTERVAL '24 days'),
('cmp-006', 'commpulse', 'relance_d1_sent', 'omar.berrada@test-bmi360.ma', '{}', NOW() - INTERVAL '22 days'),
('cmp-002', 'commpulse', 'relance_d3_sent', 'karim.alami@test-bmi360.ma', '{}', NOW() - INTERVAL '24 days'),
('cmp-004', 'commpulse', 'relance_d3_sent', 'youssef.bennis@test-bmi360.ma', '{}', NOW() - INTERVAL '22 days'),
('cmp-002', 'commpulse', 'relance_d7_sent', 'karim.alami@test-bmi360.ma', '{}', NOW() - INTERVAL '20 days');

-- ============================================================
-- OUTIL: TalentPrint™ — 22 discovers
-- ============================================================
INSERT INTO funnel_events (scoring_result_id, tool_id, event_type, email, metadata, created_at) VALUES
('tp-001', 'talentprint', 'discover_completed', 'rhmanager@test-bmi360.ma', '{"companyName":"RH Consulting","sector":"RH"}', NOW() - INTERVAL '25 days'),
('tp-002', 'talentprint', 'discover_completed', 'drh.atlas@test-bmi360.ma', '{"companyName":"Atlas Corp","sector":"industrie"}', NOW() - INTERVAL '23 days'),
('tp-003', 'talentprint', 'discover_completed', 'talent.casablanca@test-bmi360.ma', '{"companyName":"Talent & Co","sector":"conseil"}', NOW() - INTERVAL '21 days'),
('tp-004', 'talentprint', 'discover_completed', 'recrutement.maroc@test-bmi360.ma', '{"companyName":"Recruit Pro","sector":"recrutement"}', NOW() - INTERVAL '19 days'),
('tp-005', 'talentprint', 'discover_completed', 'grh.groupe@test-bmi360.ma', '{"companyName":"Groupe Industrie","sector":"industrie"}', NOW() - INTERVAL '17 days'),
('tp-006', 'talentprint', 'discover_completed', 'people.services@test-bmi360.ma', '{"companyName":"People Services","sector":"services"}', NOW() - INTERVAL '15 days'),
('tp-007', 'talentprint', 'discover_completed', 'hrexpert.ma@test-bmi360.ma', '{"companyName":"HR Expert","sector":"conseil"}', NOW() - INTERVAL '13 days'),
('tp-008', 'talentprint', 'discover_completed', 'capital.humain@test-bmi360.ma', '{"companyName":"Capital Humain","sector":"formation"}', NOW() - INTERVAL '11 days'),
('tp-009', 'talentprint', 'discover_completed', 'rh.digital@test-bmi360.ma', '{"companyName":"RH Digital","sector":"digital"}', NOW() - INTERVAL '9 days'),
('tp-010', 'talentprint', 'discover_completed', 'job.morocco@test-bmi360.ma', '{"companyName":"JobMorocco","sector":"recrutement"}', NOW() - INTERVAL '7 days'),
('tp-011', 'talentprint', 'discover_completed', 'talent.maroc@test-bmi360.ma', '{"companyName":"TalentMaroc","sector":"conseil"}', NOW() - INTERVAL '5 days'),
('tp-012', 'talentprint', 'discover_completed', 'humanrh@test-bmi360.ma', '{"companyName":"HumanRH","sector":"RH"}', NOW() - INTERVAL '3 days'),

('tp-001', 'talentprint', 'discover_email_sent', 'rhmanager@test-bmi360.ma', '{}', NOW() - INTERVAL '25 days' + INTERVAL '5 minutes'),
('tp-002', 'talentprint', 'discover_email_sent', 'drh.atlas@test-bmi360.ma', '{}', NOW() - INTERVAL '23 days' + INTERVAL '5 minutes'),
('tp-003', 'talentprint', 'discover_email_sent', 'talent.casablanca@test-bmi360.ma', '{}', NOW() - INTERVAL '21 days' + INTERVAL '5 minutes'),
('tp-004', 'talentprint', 'discover_email_sent', 'recrutement.maroc@test-bmi360.ma', '{}', NOW() - INTERVAL '19 days' + INTERVAL '5 minutes'),
('tp-005', 'talentprint', 'discover_email_sent', 'grh.groupe@test-bmi360.ma', '{}', NOW() - INTERVAL '17 days' + INTERVAL '5 minutes'),
('tp-006', 'talentprint', 'discover_email_sent', 'people.services@test-bmi360.ma', '{}', NOW() - INTERVAL '15 days' + INTERVAL '5 minutes'),
('tp-007', 'talentprint', 'discover_email_sent', 'hrexpert.ma@test-bmi360.ma', '{}', NOW() - INTERVAL '13 days' + INTERVAL '5 minutes'),
('tp-008', 'talentprint', 'discover_email_sent', 'capital.humain@test-bmi360.ma', '{}', NOW() - INTERVAL '11 days' + INTERVAL '5 minutes'),

('tp-001', 'talentprint', 'intelligence_payment_initiated', 'rhmanager@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '24 days'),
('tp-002', 'talentprint', 'intelligence_payment_initiated', 'drh.atlas@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '22 days'),
('tp-003', 'talentprint', 'intelligence_payment_initiated', 'talent.casablanca@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '20 days'),
('tp-005', 'talentprint', 'intelligence_payment_initiated', 'grh.groupe@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '16 days'),
('tp-007', 'talentprint', 'intelligence_payment_initiated', 'hrexpert.ma@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '12 days'),

('tp-001', 'talentprint', 'intelligence_unlocked', 'rhmanager@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '24 days' + INTERVAL '30 minutes'),
('tp-002', 'talentprint', 'intelligence_unlocked', 'drh.atlas@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '22 days' + INTERVAL '30 minutes'),
('tp-003', 'talentprint', 'intelligence_unlocked', 'talent.casablanca@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '20 days' + INTERVAL '30 minutes'),
('tp-005', 'talentprint', 'intelligence_unlocked', 'grh.groupe@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '16 days' + INTERVAL '30 minutes'),

('tp-001', 'talentprint', 'expert_requested', 'rhmanager@test-bmi360.ma', '{}', NOW() - INTERVAL '23 days'),
('tp-003', 'talentprint', 'expert_requested', 'talent.casablanca@test-bmi360.ma', '{}', NOW() - INTERVAL '19 days'),

('tp-004', 'talentprint', 'relance_d1_sent', 'recrutement.maroc@test-bmi360.ma', '{}', NOW() - INTERVAL '18 days'),
('tp-006', 'talentprint', 'relance_d1_sent', 'people.services@test-bmi360.ma', '{}', NOW() - INTERVAL '14 days'),
('tp-004', 'talentprint', 'relance_d3_sent', 'recrutement.maroc@test-bmi360.ma', '{}', NOW() - INTERVAL '16 days'),
('tp-004', 'talentprint', 'relance_d7_sent', 'recrutement.maroc@test-bmi360.ma', '{}', NOW() - INTERVAL '12 days');

-- ============================================================
-- OUTIL: ImpactTrace™ — 18 discovers
-- ============================================================
INSERT INTO funnel_events (scoring_result_id, tool_id, event_type, email, metadata, created_at) VALUES
('it-001', 'impacttrace', 'discover_completed', 'impact.agency@test-bmi360.ma', '{"companyName":"Impact Agency","sector":"communication"}', NOW() - INTERVAL '22 days'),
('it-002', 'impacttrace', 'discover_completed', 'trace.media@test-bmi360.ma', '{"companyName":"Trace Media","sector":"media"}', NOW() - INTERVAL '20 days'),
('it-003', 'impacttrace', 'discover_completed', 'influence.maroc@test-bmi360.ma', '{"companyName":"Influence Maroc","sector":"influence"}', NOW() - INTERVAL '18 days'),
('it-004', 'impacttrace', 'discover_completed', 'kpi.consulting@test-bmi360.ma', '{"companyName":"KPI Consulting","sector":"conseil"}', NOW() - INTERVAL '16 days'),
('it-005', 'impacttrace', 'discover_completed', 'roi.experts@test-bmi360.ma', '{"companyName":"ROI Experts","sector":"marketing"}', NOW() - INTERVAL '14 days'),
('it-006', 'impacttrace', 'discover_completed', 'mesure.impact@test-bmi360.ma', '{"companyName":"MesureImpact","sector":"analytics"}', NOW() - INTERVAL '12 days'),
('it-007', 'impacttrace', 'discover_completed', 'perf.media@test-bmi360.ma', '{"companyName":"PerfMedia","sector":"media"}', NOW() - INTERVAL '10 days'),
('it-008', 'impacttrace', 'discover_completed', 'analytics.maroc@test-bmi360.ma', '{"companyName":"Analytics Maroc","sector":"digital"}', NOW() - INTERVAL '8 days'),
('it-009', 'impacttrace', 'discover_completed', 'strategie.data@test-bmi360.ma', '{"companyName":"StratData","sector":"data"}', NOW() - INTERVAL '6 days'),
('it-010', 'impacttrace', 'discover_completed', 'digital.impact@test-bmi360.ma', '{"companyName":"DigitalImpact","sector":"digital"}', NOW() - INTERVAL '4 days'),

('it-001', 'impacttrace', 'discover_email_sent', 'impact.agency@test-bmi360.ma', '{}', NOW() - INTERVAL '22 days' + INTERVAL '5 minutes'),
('it-002', 'impacttrace', 'discover_email_sent', 'trace.media@test-bmi360.ma', '{}', NOW() - INTERVAL '20 days' + INTERVAL '5 minutes'),
('it-003', 'impacttrace', 'discover_email_sent', 'influence.maroc@test-bmi360.ma', '{}', NOW() - INTERVAL '18 days' + INTERVAL '5 minutes'),
('it-004', 'impacttrace', 'discover_email_sent', 'kpi.consulting@test-bmi360.ma', '{}', NOW() - INTERVAL '16 days' + INTERVAL '5 minutes'),
('it-005', 'impacttrace', 'discover_email_sent', 'roi.experts@test-bmi360.ma', '{}', NOW() - INTERVAL '14 days' + INTERVAL '5 minutes'),
('it-006', 'impacttrace', 'discover_email_sent', 'mesure.impact@test-bmi360.ma', '{}', NOW() - INTERVAL '12 days' + INTERVAL '5 minutes'),

('it-001', 'impacttrace', 'intelligence_payment_initiated', 'impact.agency@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '21 days'),
('it-002', 'impacttrace', 'intelligence_payment_initiated', 'trace.media@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '19 days'),
('it-004', 'impacttrace', 'intelligence_payment_initiated', 'kpi.consulting@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '15 days'),
('it-006', 'impacttrace', 'intelligence_payment_initiated', 'mesure.impact@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '11 days'),

('it-001', 'impacttrace', 'intelligence_unlocked', 'impact.agency@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '21 days' + INTERVAL '30 minutes'),
('it-002', 'impacttrace', 'intelligence_unlocked', 'trace.media@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '19 days' + INTERVAL '30 minutes'),
('it-004', 'impacttrace', 'intelligence_unlocked', 'kpi.consulting@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '15 days' + INTERVAL '30 minutes'),

('it-002', 'impacttrace', 'expert_requested', 'trace.media@test-bmi360.ma', '{}', NOW() - INTERVAL '18 days'),

('it-003', 'impacttrace', 'relance_d1_sent', 'influence.maroc@test-bmi360.ma', '{}', NOW() - INTERVAL '17 days'),
('it-005', 'impacttrace', 'relance_d1_sent', 'roi.experts@test-bmi360.ma', '{}', NOW() - INTERVAL '13 days'),
('it-003', 'impacttrace', 'relance_d3_sent', 'influence.maroc@test-bmi360.ma', '{}', NOW() - INTERVAL '15 days'),
('it-005', 'impacttrace', 'relance_d3_sent', 'roi.experts@test-bmi360.ma', '{}', NOW() - INTERVAL '11 days');

-- ============================================================
-- OUTIL: SafeSignal™ — 15 discovers
-- ============================================================
INSERT INTO funnel_events (scoring_result_id, tool_id, event_type, email, metadata, created_at) VALUES
('ss-001', 'safesignal', 'discover_completed', 'securite.corp@test-bmi360.ma', '{"companyName":"Sécurité Corp","sector":"sécurité"}', NOW() - INTERVAL '20 days'),
('ss-002', 'safesignal', 'discover_completed', 'crisis.management@test-bmi360.ma', '{"companyName":"Crisis Management","sector":"conseil"}', NOW() - INTERVAL '17 days'),
('ss-003', 'safesignal', 'discover_completed', 'signal.rse@test-bmi360.ma', '{"companyName":"Signal RSE","sector":"RSE"}', NOW() - INTERVAL '14 days'),
('ss-004', 'safesignal', 'discover_completed', 'reputation.maroc@test-bmi360.ma', '{"companyName":"Réputation Maroc","sector":"PR"}', NOW() - INTERVAL '11 days'),
('ss-005', 'safesignal', 'discover_completed', 'communication.crise@test-bmi360.ma', '{"companyName":"ComCrise","sector":"communication"}', NOW() - INTERVAL '8 days'),
('ss-006', 'safesignal', 'discover_completed', 'protect.brand@test-bmi360.ma', '{"companyName":"ProtectBrand","sector":"branding"}', NOW() - INTERVAL '5 days'),
('ss-007', 'safesignal', 'discover_completed', 'vigilance.media@test-bmi360.ma', '{"companyName":"Vigilance Media","sector":"veille"}', NOW() - INTERVAL '3 days'),
('ss-008', 'safesignal', 'discover_completed', 'riskcomm@test-bmi360.ma', '{"companyName":"RiskComm","sector":"risk"}', NOW() - INTERVAL '1 day'),

('ss-001', 'safesignal', 'discover_email_sent', 'securite.corp@test-bmi360.ma', '{}', NOW() - INTERVAL '20 days' + INTERVAL '5 minutes'),
('ss-002', 'safesignal', 'discover_email_sent', 'crisis.management@test-bmi360.ma', '{}', NOW() - INTERVAL '17 days' + INTERVAL '5 minutes'),
('ss-003', 'safesignal', 'discover_email_sent', 'signal.rse@test-bmi360.ma', '{}', NOW() - INTERVAL '14 days' + INTERVAL '5 minutes'),
('ss-004', 'safesignal', 'discover_email_sent', 'reputation.maroc@test-bmi360.ma', '{}', NOW() - INTERVAL '11 days' + INTERVAL '5 minutes'),

('ss-001', 'safesignal', 'intelligence_payment_initiated', 'securite.corp@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '19 days'),
('ss-002', 'safesignal', 'intelligence_payment_initiated', 'crisis.management@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '16 days'),
('ss-003', 'safesignal', 'intelligence_payment_initiated', 'signal.rse@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '13 days'),

('ss-001', 'safesignal', 'intelligence_unlocked', 'securite.corp@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '19 days' + INTERVAL '30 minutes'),
('ss-002', 'safesignal', 'intelligence_unlocked', 'crisis.management@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '16 days' + INTERVAL '30 minutes'),

('ss-001', 'safesignal', 'expert_requested', 'securite.corp@test-bmi360.ma', '{}', NOW() - INTERVAL '18 days'),

('ss-004', 'safesignal', 'relance_d1_sent', 'reputation.maroc@test-bmi360.ma', '{}', NOW() - INTERVAL '10 days'),
('ss-005', 'safesignal', 'relance_d1_sent', 'communication.crise@test-bmi360.ma', '{}', NOW() - INTERVAL '7 days'),
('ss-004', 'safesignal', 'relance_d3_sent', 'reputation.maroc@test-bmi360.ma', '{}', NOW() - INTERVAL '8 days');

-- ============================================================
-- OUTIL: EventImpact™ — 12 discovers
-- ============================================================
INSERT INTO funnel_events (scoring_result_id, tool_id, event_type, email, metadata, created_at) VALUES
('ei-001', 'eventimpact', 'discover_completed', 'event.pro@test-bmi360.ma', '{"companyName":"Event Pro","sector":"événementiel"}', NOW() - INTERVAL '18 days'),
('ei-002', 'eventimpact', 'discover_completed', 'salon.maroc@test-bmi360.ma', '{"companyName":"Salon Maroc","sector":"salons"}', NOW() - INTERVAL '15 days'),
('ei-003', 'eventimpact', 'discover_completed', 'congress.casablanca@test-bmi360.ma', '{"companyName":"Congress Casa","sector":"congrès"}', NOW() - INTERVAL '12 days'),
('ei-004', 'eventimpact', 'discover_completed', 'incentive.group@test-bmi360.ma', '{"companyName":"Incentive Group","sector":"tourisme"}', NOW() - INTERVAL '9 days'),
('ei-005', 'eventimpact', 'discover_completed', 'foire.internationale@test-bmi360.ma', '{"companyName":"Foire Internationale","sector":"foire"}', NOW() - INTERVAL '6 days'),
('ei-006', 'eventimpact', 'discover_completed', 'teambuilding.ma@test-bmi360.ma', '{"companyName":"TeamBuilding MA","sector":"RH"}', NOW() - INTERVAL '3 days'),

('ei-001', 'eventimpact', 'discover_email_sent', 'event.pro@test-bmi360.ma', '{}', NOW() - INTERVAL '18 days' + INTERVAL '5 minutes'),
('ei-002', 'eventimpact', 'discover_email_sent', 'salon.maroc@test-bmi360.ma', '{}', NOW() - INTERVAL '15 days' + INTERVAL '5 minutes'),
('ei-003', 'eventimpact', 'discover_email_sent', 'congress.casablanca@test-bmi360.ma', '{}', NOW() - INTERVAL '12 days' + INTERVAL '5 minutes'),
('ei-004', 'eventimpact', 'discover_email_sent', 'incentive.group@test-bmi360.ma', '{}', NOW() - INTERVAL '9 days' + INTERVAL '5 minutes'),

('ei-001', 'eventimpact', 'intelligence_payment_initiated', 'event.pro@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '17 days'),
('ei-002', 'eventimpact', 'intelligence_payment_initiated', 'salon.maroc@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '14 days'),
('ei-003', 'eventimpact', 'intelligence_payment_initiated', 'congress.casablanca@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '11 days'),

('ei-001', 'eventimpact', 'intelligence_unlocked', 'event.pro@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '17 days' + INTERVAL '30 minutes'),
('ei-002', 'eventimpact', 'intelligence_unlocked', 'salon.maroc@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '14 days' + INTERVAL '30 minutes'),

('ei-001', 'eventimpact', 'expert_requested', 'event.pro@test-bmi360.ma', '{}', NOW() - INTERVAL '16 days'),

('ei-004', 'eventimpact', 'relance_d1_sent', 'incentive.group@test-bmi360.ma', '{}', NOW() - INTERVAL '8 days'),
('ei-004', 'eventimpact', 'relance_d3_sent', 'incentive.group@test-bmi360.ma', '{}', NOW() - INTERVAL '6 days');

-- ============================================================
-- OUTIL: SpaceScore™ — 10 discovers
-- ============================================================
INSERT INTO funnel_events (scoring_result_id, tool_id, event_type, email, metadata, created_at) VALUES
('sc-001', 'spacescore', 'discover_completed', 'immobilier.pro@test-bmi360.ma', '{"companyName":"Immobilier Pro","sector":"immobilier"}', NOW() - INTERVAL '15 days'),
('sc-002', 'spacescore', 'discover_completed', 'architecte.design@test-bmi360.ma', '{"companyName":"Architecte Design","sector":"architecture"}', NOW() - INTERVAL '12 days'),
('sc-003', 'spacescore', 'discover_completed', 'retail.maroc@test-bmi360.ma', '{"companyName":"Retail Maroc","sector":"retail"}', NOW() - INTERVAL '9 days'),
('sc-004', 'spacescore', 'discover_completed', 'showroom.luxe@test-bmi360.ma', '{"companyName":"Showroom Luxe","sector":"luxe"}', NOW() - INTERVAL '6 days'),
('sc-005', 'spacescore', 'discover_completed', 'espace.commerce@test-bmi360.ma', '{"companyName":"EspaceCommerce","sector":"commerce"}', NOW() - INTERVAL '3 days'),

('sc-001', 'spacescore', 'discover_email_sent', 'immobilier.pro@test-bmi360.ma', '{}', NOW() - INTERVAL '15 days' + INTERVAL '5 minutes'),
('sc-002', 'spacescore', 'discover_email_sent', 'architecte.design@test-bmi360.ma', '{}', NOW() - INTERVAL '12 days' + INTERVAL '5 minutes'),
('sc-003', 'spacescore', 'discover_email_sent', 'retail.maroc@test-bmi360.ma', '{}', NOW() - INTERVAL '9 days' + INTERVAL '5 minutes'),

('sc-001', 'spacescore', 'intelligence_payment_initiated', 'immobilier.pro@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '14 days'),
('sc-002', 'spacescore', 'intelligence_payment_initiated', 'architecte.design@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '11 days'),

('sc-001', 'spacescore', 'intelligence_unlocked', 'immobilier.pro@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '14 days' + INTERVAL '30 minutes'),

('sc-003', 'spacescore', 'relance_d1_sent', 'retail.maroc@test-bmi360.ma', '{}', NOW() - INTERVAL '8 days'),
('sc-004', 'spacescore', 'relance_d1_sent', 'showroom.luxe@test-bmi360.ma', '{}', NOW() - INTERVAL '5 days');

-- ============================================================
-- OUTIL: FinNarrative™ — 8 discovers
-- ============================================================
INSERT INTO funnel_events (scoring_result_id, tool_id, event_type, email, metadata, created_at) VALUES
('fn-001', 'finnarrative', 'discover_completed', 'banque.maroc@test-bmi360.ma', '{"companyName":"Banque Maroc","sector":"finance"}', NOW() - INTERVAL '20 days'),
('fn-002', 'finnarrative', 'discover_completed', 'finance.corp@test-bmi360.ma', '{"companyName":"Finance Corp","sector":"finance"}', NOW() - INTERVAL '16 days'),
('fn-003', 'finnarrative', 'discover_completed', 'assurance.ma@test-bmi360.ma', '{"companyName":"Assurance MA","sector":"assurance"}', NOW() - INTERVAL '12 days'),
('fn-004', 'finnarrative', 'discover_completed', 'investissement.group@test-bmi360.ma', '{"companyName":"Investissement Group","sector":"investissement"}', NOW() - INTERVAL '8 days'),
('fn-005', 'finnarrative', 'discover_completed', 'rapport.annuel@test-bmi360.ma', '{"companyName":"RapportCo","sector":"conseil"}', NOW() - INTERVAL '4 days'),

('fn-001', 'finnarrative', 'discover_email_sent', 'banque.maroc@test-bmi360.ma', '{}', NOW() - INTERVAL '20 days' + INTERVAL '5 minutes'),
('fn-002', 'finnarrative', 'discover_email_sent', 'finance.corp@test-bmi360.ma', '{}', NOW() - INTERVAL '16 days' + INTERVAL '5 minutes'),
('fn-003', 'finnarrative', 'discover_email_sent', 'assurance.ma@test-bmi360.ma', '{}', NOW() - INTERVAL '12 days' + INTERVAL '5 minutes'),

('fn-001', 'finnarrative', 'intelligence_payment_initiated', 'banque.maroc@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '19 days'),
('fn-002', 'finnarrative', 'intelligence_payment_initiated', 'finance.corp@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '15 days'),
('fn-003', 'finnarrative', 'intelligence_payment_initiated', 'assurance.ma@test-bmi360.ma', '{"amount":149900}', NOW() - INTERVAL '11 days'),

('fn-001', 'finnarrative', 'intelligence_unlocked', 'banque.maroc@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '19 days' + INTERVAL '30 minutes'),
('fn-002', 'finnarrative', 'intelligence_unlocked', 'finance.corp@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '15 days' + INTERVAL '30 minutes'),
('fn-003', 'finnarrative', 'intelligence_unlocked', 'assurance.ma@test-bmi360.ma', '{"tier":"intelligence"}', NOW() - INTERVAL '11 days' + INTERVAL '30 minutes'),

('fn-001', 'finnarrative', 'expert_requested', 'banque.maroc@test-bmi360.ma', '{}', NOW() - INTERVAL '18 days'),
('fn-002', 'finnarrative', 'expert_requested', 'finance.corp@test-bmi360.ma', '{}', NOW() - INTERVAL '14 days'),

('fn-004', 'finnarrative', 'relance_d1_sent', 'investissement.group@test-bmi360.ma', '{}', NOW() - INTERVAL '7 days'),
('fn-004', 'finnarrative', 'relance_d3_sent', 'investissement.group@test-bmi360.ma', '{}', NOW() - INTERVAL '5 days');

-- ============================================================
-- Vérification
-- ============================================================
SELECT
  tool_id,
  event_type,
  COUNT(*) AS nb
FROM funnel_events
WHERE email LIKE '%@test-bmi360.ma'
GROUP BY tool_id, event_type
ORDER BY tool_id, event_type;
