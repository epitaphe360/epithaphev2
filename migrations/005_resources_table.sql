-- Migration 005: Table resources (CDC Phase 2 — Module 6.5)
-- Ressources clients : guides, modèles, études de cas

CREATE TABLE IF NOT EXISTS resources (
  id              SERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  description     TEXT,
  category        VARCHAR(80)  NOT NULL DEFAULT 'guide',
  format          VARCHAR(30)           DEFAULT 'PDF',
  file_size       VARCHAR(20),
  download_url    TEXT,
  thumbnail_url   TEXT,
  access_level    VARCHAR(20)           DEFAULT 'client',
  tags            JSONB                 DEFAULT '[]'::jsonb,
  is_new          BOOLEAN               DEFAULT FALSE,
  is_published    BOOLEAN               DEFAULT TRUE,
  sort_order      INTEGER               DEFAULT 0,
  download_count  INTEGER               DEFAULT 0,
  created_at      TIMESTAMP             DEFAULT NOW() NOT NULL,
  updated_at      TIMESTAMP             DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_resources_category      ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_access_level  ON resources(access_level);
CREATE INDEX IF NOT EXISTS idx_resources_is_published  ON resources(is_published);

-- Données initiales (6 ressources de démo)
INSERT INTO resources (title, description, category, format, file_size, download_url, access_level, tags, is_new, sort_order) VALUES
(
  'Guide de la communication funéraire RSE',
  'Comprendre les obligations réglementaires et les bonnes pratiques de communication dans le secteur funéraire.',
  'guide', 'PDF', '2.4 MB', NULL, 'client',
  '["RSE","réglementation","communication"]', TRUE, 1
),
(
  'Modèle de plan de communication digital',
  'Template complet pour structurer votre stratégie digitale annuelle avec KPIs et calendrier éditorial.',
  'modele', 'DOCX', '1.1 MB', NULL, 'client',
  '["digital","stratégie","template"]', FALSE, 2
),
(
  'Étude de cas — Campagne réseaux sociaux',
  'Résultats détaillés d''une campagne LinkedIn/Facebook menée pour un groupe funéraire régional.',
  'etude_de_cas', 'PDF', '3.8 MB', NULL, 'client',
  '["réseaux sociaux","résultats","funéraire"]', TRUE, 3
),
(
  'Fiche technique SEO local',
  'Optimiser la visibilité Google de vos établissements : Google Business Profile, mots-clés, avis clients.',
  'fiche_technique', 'PDF', '900 KB', NULL, 'client',
  '["SEO","local","Google"]', FALSE, 4
),
(
  'Checklist audit digital complet',
  'Liste de contrôle pour évaluer la présence digitale de votre groupe : site web, SEO, RS, réputation.',
  'guide', 'XLSX', '450 KB', NULL, 'lead',
  '["audit","digital","checklist"]', FALSE, 5
),
(
  'Introduction à la communication de deuil',
  'Ressource publique sur les tendances de la communication dans l''accompagnement du deuil.',
  'guide', 'PDF', '1.2 MB', NULL, 'public',
  '["deuil","communication","tendances"]', FALSE, 6
);
