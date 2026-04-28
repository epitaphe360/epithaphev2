-- ============================================================
-- MIGRATION 018: Pages hub manquantes dans la DB
-- Crée les enregistrements pour toutes les pages hub et
-- sous-pages de service qui n'ont pas encore de record DB.
-- Idempotent: INSERT ... ON CONFLICT DO NOTHING
-- ============================================================

-- ─── Hub : Événements ───────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description,
  content, sections, published_at, created_at, updated_at
) VALUES (
  'Événements',
  'evenements',
  'PUBLISHED',
  'GRAPES_JS',
  true,
  10,
  'Événements Corporate — Conventions, Galas & Salons | Epitaphe 360',
  'Spécialiste des événements d''entreprise au Maroc : conventions, soirées de gala, roadshows et salons professionnels.',
  '',
  NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ─── Hub : Architecture de Marque ───────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description,
  content, sections, published_at, created_at, updated_at
) VALUES (
  'Architecture de Marque',
  'architecture-de-marque',
  'PUBLISHED',
  'GRAPES_JS',
  true,
  20,
  'Architecture de Marque — Marque Employeur, QHSE & Expérience Client | Epitaphe 360',
  'Construisez une marque forte et différenciante. Marque employeur, communication QHSE et expérience client repensée de A à Z.',
  '',
  NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ─── Hub : La Fabrique ──────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description,
  content, sections, published_at, created_at, updated_at
) VALUES (
  'La Fabrique',
  'la-fabrique',
  'PUBLISHED',
  'GRAPES_JS',
  true,
  30,
  'La Fabrique — Impression, Menuiserie & Signalétique | Epitaphe 360',
  'Atelier de fabrication intégré : impression grand format, menuiserie décorative, signalétique et aménagement d''espace.',
  '',
  NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ─── Hub : Nos Pôles ────────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description,
  content, sections, published_at, created_at, updated_at
) VALUES (
  'Nos Pôles d''expertise',
  'nos-poles',
  'PUBLISHED',
  'GRAPES_JS',
  true,
  40,
  'Nos pôles d''expertise — Epitaphe 360',
  'COM'' Interne, Marque Employeur, COM''SST-QHSE, COM''RSE et Événementiel : les 5 pôles d''expertise de l''agence Epitaphe 360.',
  '',
  NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ─── Sous-page Service : La Fabrique / Branding Siège ───────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description,
  content, sections, published_at, created_at, updated_at
) VALUES (
  'Branding Siège Social',
  'la-fabrique/branding-siege',
  'PUBLISHED',
  'SERVICE_PAGE',
  false,
  0,
  'Branding Siège Social — Aménagement & Signalétique | La Fabrique Epitaphe 360',
  'Transformez votre siège social en vitrine de votre marque : signalétique directionnelle, habillage mural, mobilier sur mesure.',
  NULL,
  NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ─── Sous-page Service : Nos Pôles / COM Interne ────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description,
  content, sections, published_at, created_at, updated_at
) VALUES (
  'Communication Interne',
  'nos-poles/com-interne',
  'PUBLISHED',
  'SERVICE_PAGE',
  false,
  0,
  'Communication Interne — Pôle COM'' Interne | Epitaphe 360',
  'Boostez l''engagement de vos collaborateurs avec des outils de communication interne percutants : newsletters, affiches, livrets d''accueil.',
  NULL,
  NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ─── Sous-page Service : Nos Pôles / COM RSE ────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description,
  content, sections, published_at, created_at, updated_at
) VALUES (
  'Communication RSE',
  'nos-poles/com-rse',
  'PUBLISHED',
  'SERVICE_PAGE',
  false,
  0,
  'Communication RSE — Pôle COM''RSE | Epitaphe 360',
  'Valorisez vos engagements RSE avec des rapports annuels, infographies et campagnes de sensibilisation à fort impact visuel.',
  NULL,
  NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ─── Page : Ressources ──────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description,
  content, sections, published_at, created_at, updated_at
) VALUES (
  'Bibliothèque de Ressources',
  'ressources',
  'PUBLISHED',
  'GRAPES_JS',
  true,
  50,
  'Bibliothèque de ressources — Guides, Templates & Études de cas | Epitaphe 360',
  'Guides pratiques, études de cas, templates et outils gratuits pour optimiser vos événements, communication QHSE et stratégie de marque.',
  '',
  NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ─── Page : Outils ──────────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description,
  content, sections, published_at, created_at, updated_at
) VALUES (
  'Outils BMI 360™',
  'outils',
  'PUBLISHED',
  'GRAPES_JS',
  true,
  60,
  'BMI 360™ — Outils de Scoring Intelligence d''Entreprise | Epitaphe 360',
  '8 outils de scoring BMI 360™ pour mesurer la maturité de votre communication d''entreprise.',
  '',
  NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ─── Page : Nos Références ──────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description,
  content, sections, published_at, created_at, updated_at
) VALUES (
  'Nos Références Clients',
  'nos-references',
  'PUBLISHED',
  'GRAPES_JS',
  true,
  70,
  'Nos Références Clients — 500+ entreprises | Epitaphe 360',
  'Plus de 500 entreprises nous font confiance. Découvrez nos références et études de cas par secteur.',
  '',
  NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO NOTHING;

-- ─── Page : Contact ─────────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description,
  content, sections, published_at, created_at, updated_at
) VALUES (
  'Contact',
  'contact',
  'PUBLISHED',
  'GRAPES_JS',
  true,
  80,
  'Contact — Epitaphe 360',
  'Contactez Epitaphe 360 pour votre projet événementiel, signalétique ou architecture de marque. Réponse sous 24h.',
  '',
  NULL,
  NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO NOTHING;
