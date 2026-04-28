-- ============================================================
-- MIGRATION 020: Seed complet de TOUTES les pages publiques
-- Contient : title, slug, meta_title, meta_description,
--            featured_image (= OG image), sections JSON
--            (heroTitle, heroSubtitle), template, status.
-- Idempotent : ON CONFLICT (slug) DO UPDATE
-- Couvre 28 pages publiques de l'application v2.
-- ============================================================

-- ─── Page d'accueil ─────────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Accueil',
  'home',
  'PUBLISHED', 'GRAPES_JS', false, 0,
  'Epitaphe 360 — Agence de Communication Stratégique à Casablanca',
  'Agence de communication stratégique basée à Casablanca. Partenaire des organisations au cœur des 12 régions du Maroc depuis 2005.',
  'https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg',
  '{"heroTitle":"Structuring Influence.","heroSubtitle":"Agence de communication stratégique — Casablanca, Maroc — depuis 2005","heroImage":"https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg"}',
  '', NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'GRAPES_JS',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── À propos ───────────────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'À propos',
  'a-propos',
  'PUBLISHED', 'GRAPES_JS', true, 5,
  'À propos — Epitaphe 360, agence de communication 360° à Casablanca',
  'Depuis 20 ans, Epitaphe 360 accompagne les grandes entreprises et multinationales au Maroc dans leurs défis de communication : événementiel, branding, digital, QHSE, RSE et plus.',
  'https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg',
  '{"heroTitle":"Inspirez. Connectez. Marquez durablement.","heroSubtitle":"Agence de communication 360° — Casablanca, Maroc — depuis 2005","heroImage":"https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg"}',
  '', NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'GRAPES_JS',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Hub : Événements ───────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Événements',
  'evenements',
  'PUBLISHED', 'GRAPES_JS', true, 10,
  'Événements Corporate — Conventions, Galas & Salons | Epitaphe 360',
  'Spécialiste des événements d''entreprise au Maroc : conventions, soirées de gala, roadshows et salons professionnels. Scénographie immersive, production audiovisuelle.',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80',
  '{"heroTitle":"Événements qui marquent les esprits","heroSubtitle":"Conventions, galas, roadshows et salons — de A à Z","heroImage":"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80"}',
  '', NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'GRAPES_JS',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Événements / Conventions & Kickoffs ────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Conventions & Kickoffs',
  'evenements/conventions-kickoffs',
  'PUBLISHED', 'SERVICE_PAGE', false, 0,
  'Conventions & Kickoffs — Epitaphe 360',
  'Fédérez vos équipes autour de vos ambitions stratégiques. Conférences plénières, ateliers participatifs, team-building à fort impact.',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80',
  '{"heroTitle":"Conventions & Kickoffs","heroSubtitle":"Fédérez vos équipes autour de vos ambitions stratégiques et créez un élan collectif durable.","heroImage":"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80"}',
  NULL, NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'SERVICE_PAGE',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Événements / Soirées de Gala ───────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Soirées de Gala',
  'evenements/soirees-de-gala',
  'PUBLISHED', 'SERVICE_PAGE', false, 0,
  'Soirées de Gala & Événements Prestige — Epitaphe 360',
  'Organisez des soirées d''exception qui célèbrent vos succès. Décors luxueux, scénographie sur mesure, hospitalité 3 étoiles.',
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1400&q=80',
  '{"heroTitle":"Soirées de gala & événements prestige","heroSubtitle":"Des moments d''exception qui célèbrent vos succès et marquent vos parties prenantes de façon inoubliable.","heroImage":"https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1400&q=80"}',
  NULL, NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'SERVICE_PAGE',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Événements / Roadshows ─────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Roadshows & Tournées',
  'evenements/roadshows',
  'PUBLISHED', 'SERVICE_PAGE', false, 0,
  'Roadshows & Tournées Nationales — Epitaphe 360',
  'Portez votre message dans toutes les villes du Maroc. Logistique maîtrisée, impact uniforme sur chaque site, coordination complète.',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1400&q=80',
  '{"heroTitle":"Roadshows & Tournées nationales","heroSubtitle":"Portez votre message dans toutes les villes avec une logistique maîtrisée et un impact uniforme sur chaque site.","heroImage":"https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1400&q=80"}',
  NULL, NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'SERVICE_PAGE',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Événements / Salons ────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Salons & Expositions',
  'evenements/salons',
  'PUBLISHED', 'SERVICE_PAGE', false, 0,
  'Salons & Expositions Professionnelles — Epitaphe 360',
  'Maximisez votre visibilité et générez des leads qualifiés lors des salons B2B. Stands sur mesure, signalétique, animation commerciale.',
  'https://images.unsplash.com/photo-1561489396-888724a1543d?w=1400&q=80',
  '{"heroTitle":"Salons & Expositions professionnelles","heroSubtitle":"Maximisez votre visibilité et générez des leads qualifiés lors des salons B2B les plus importants.","heroImage":"https://images.unsplash.com/photo-1561489396-888724a1543d?w=1400&q=80"}',
  NULL, NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'SERVICE_PAGE',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Hub : Architecture de Marque ───────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Architecture de Marque',
  'architecture-de-marque',
  'PUBLISHED', 'GRAPES_JS', true, 20,
  'Architecture de Marque — Marque Employeur, QHSE & Expérience Client | Epitaphe 360',
  'Construisez une marque forte et différenciante. Marque employeur, communication QHSE et expérience client repensée de A à Z.',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80',
  '{"heroTitle":"Architecture de Marque","heroSubtitle":"Marque employeur, QHSE & expérience client — construisez une marque qui inspire la confiance","heroImage":"https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"}',
  '', NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'GRAPES_JS',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Architecture de Marque / Marque Employeur ──────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Marque Employeur',
  'architecture-de-marque/marque-employeur',
  'PUBLISHED', 'SERVICE_PAGE', false, 0,
  'Marque Employeur — Architecture de Marque | Epitaphe 360',
  'Positionnez votre entreprise comme l''employeur de référence. Stratégie, contenus, outils de recrutement et onboarding personnalisé.',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80',
  '{"heroTitle":"Marque Employeur","heroSubtitle":"Positionnez votre entreprise comme l''employeur de référence de votre secteur pour attirer et fidéliser les meilleurs talents.","heroImage":"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80"}',
  NULL, NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'SERVICE_PAGE',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Architecture de Marque / Communication QHSE ────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Communication QHSE',
  'architecture-de-marque/communication-qhse',
  'PUBLISHED', 'SERVICE_PAGE', false, 0,
  'Communication QHSE — Architecture de Marque | Epitaphe 360',
  'Transformez vos obligations sécurité en culture positive. Affichage réglementaire, procédures d''urgence, formation visuelle QHSE.',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80',
  '{"heroTitle":"Communication QHSE","heroSubtitle":"Transformez vos obligations de sécurité en une culture d''entreprise positive qui protège et engage vos équipes.","heroImage":"https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80"}',
  NULL, NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'SERVICE_PAGE',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Architecture de Marque / Expérience Clients ────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Expérience Clients',
  'architecture-de-marque/experience-clients',
  'PUBLISHED', 'SERVICE_PAGE', false, 0,
  'Expérience Clients — Architecture de Marque | Epitaphe 360',
  'Concevez chaque point de contact pour une expérience de marque cohérente et mémorable. Journey mapping, design sensoriel, digitalisation.',
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80',
  '{"heroTitle":"Expérience Clients","heroSubtitle":"Concevez chaque point de contact pour délivrer une expérience de marque cohérente, mémorable et différenciante.","heroImage":"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80"}',
  NULL, NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'SERVICE_PAGE',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Hub : La Fabrique ──────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'La Fabrique',
  'la-fabrique',
  'PUBLISHED', 'GRAPES_JS', true, 30,
  'La Fabrique — Impression, Menuiserie & Signalétique | Epitaphe 360',
  'Atelier de fabrication intégré : impression grand format, menuiserie décorative, signalétique et aménagement d''espace. 100% Made in Epitaphe.',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80',
  '{"heroTitle":"La Fabrique — votre production","heroSubtitle":"3 000 m² d''ateliers spécialisés — 100% Made in Epitaphe","heroImage":"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80"}',
  '', NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'GRAPES_JS',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── La Fabrique / Branding Siège ───────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Branding Siège Social',
  'la-fabrique/branding-siege',
  'PUBLISHED', 'SERVICE_PAGE', false, 0,
  'Branding de Siège — La Fabrique 360 | Epitaphe 360',
  'Transformez votre siège social en manifeste de marque. Habillage entrée, murs identitaires, signalétique, salles de réunion brandées — fabriqué à Casablanca.',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
  '{"heroTitle":"Branding de Siège","heroSubtitle":"Transformez votre siège social en manifeste de marque — un espace qui inspire, engage et reflète votre identité à chaque coin de couloir.","heroImage":"https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80"}',
  NULL, NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'SERVICE_PAGE',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── La Fabrique / Impression ───────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Impression Grand Format',
  'la-fabrique/impression',
  'PUBLISHED', 'SERVICE_PAGE', false, 0,
  'Impression Grand Format — La Fabrique | Epitaphe 360',
  'Bâches, adhésifs, kakemonos, toiles rétroéclairées. Impression haute définition 1440 dpi jusqu''à 5m de large, délai express 24h.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
  '{"heroTitle":"Impression Grand Format","heroSubtitle":"Bâches, adhésifs, kakemonos, toiles rétroéclairées — une impression haute définition sur tous supports, dans tous les formats.","heroImage":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80"}',
  NULL, NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'SERVICE_PAGE',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── La Fabrique / Menuiserie ───────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Menuiserie & Décor',
  'la-fabrique/menuiserie',
  'PUBLISHED', 'SERVICE_PAGE', false, 0,
  'Menuiserie & Décor — La Fabrique | Epitaphe 360',
  'Stands sur mesure, mobilier d''ambiance, podiums et structures architecturales temporaires. Fabrication atelier propre, délai express.',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1400&q=80',
  '{"heroTitle":"Menuiserie & Décor","heroSubtitle":"Stands sur mesure, mobilier d''ambiance, podiums et structures architecturales éphémères conçus et fabriqués dans notre atelier.","heroImage":"https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1400&q=80"}',
  NULL, NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'SERVICE_PAGE',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── La Fabrique / Signalétique ─────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Signalétique Professionnelle',
  'la-fabrique/signaletique',
  'PUBLISHED', 'SERVICE_PAGE', false, 0,
  'Signalétique Professionnelle — La Fabrique | Epitaphe 360',
  'Totéms lumineux, enseignes, wayfinding et signalétique directionnelle. Déployez votre identité de marque dans tous vos espaces.',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80',
  '{"heroTitle":"Signalétique professionnelle","heroSubtitle":"Totems lumineux, enseignes, wayfinding et signalétique directionnelle — votre identité déployée dans tous vos espaces.","heroImage":"https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80"}',
  NULL, NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'SERVICE_PAGE',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── La Fabrique / Aménagement d'Espace ─────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Aménagement d''Espace',
  'la-fabrique/amenagement',
  'PUBLISHED', 'SERVICE_PAGE', false, 0,
  'Aménagement d''Espace — La Fabrique | Epitaphe 360',
  'Scénographie événementielle, architecture éphémère et design d''intérieur. Transformez chaque espace en une expérience de marque.',
  'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1400&q=80',
  '{"heroTitle":"Aménagement d''Espace","heroSubtitle":"Scénographie événementielle, architecture éphémère et design d''intérieur — chaque espace devient une expérience.","heroImage":"https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1400&q=80"}',
  NULL, NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'SERVICE_PAGE',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Hub : Nos Pôles ────────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Nos Pôles d''expertise',
  'nos-poles',
  'PUBLISHED', 'GRAPES_JS', true, 40,
  'Nos pôles d''expertise — Epitaphe 360',
  'COM'' Interne, Marque Employeur, COM''SST-QHSE, COM''RSE et Événementiel : découvrez les 5 pôles d''expertise de l''agence Epitaphe 360 à Casablanca.',
  'https://version2.epitaphe.ma/wp-content/uploads/2025/11/Communication-interne-Industrie-Maroc-700x876.webp',
  '{"heroTitle":"Nos pôles d''expertise","heroSubtitle":"5 pôles spécialisés pour tous vos enjeux de communication B2B","heroImage":"https://version2.epitaphe.ma/wp-content/uploads/2025/11/Communication-interne-Industrie-Maroc-700x876.webp"}',
  '', NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'GRAPES_JS',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Nos Pôles / Communication Interne ──────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Communication Interne',
  'nos-poles/com-interne',
  'PUBLISHED', 'SERVICE_PAGE', false, 0,
  'Communication Interne — COM'' Interne | Epitaphe 360',
  'Fédérez vos collaborateurs avec une stratégie de communication interne sur mesure. Supports, événements, scoring CommPulse™ et plan de communication annuel.',
  'https://version2.epitaphe.ma/wp-content/uploads/2025/11/Communication-interne-Industrie-Maroc-700x876.webp',
  '{"heroTitle":"Communication Interne","heroSubtitle":"Fédérez vos collaborateurs autour d''une vision commune et transformez votre culture d''entreprise en levier de performance.","heroImage":"https://version2.epitaphe.ma/wp-content/uploads/2025/11/Communication-interne-Industrie-Maroc-700x876.webp"}',
  NULL, NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'SERVICE_PAGE',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Nos Pôles / Communication RSE ──────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Communication RSE',
  'nos-poles/com-rse',
  'PUBLISHED', 'SERVICE_PAGE', false, 0,
  'Communication RSE — COM''RSE | Epitaphe 360',
  'Valorisez vos engagements RSE avec des rapports d''impact, campagnes de sensibilisation et supports visuels sur mesure. Scoring ImpactTrace™ inclus.',
  'https://version2.epitaphe.ma/wp-content/uploads/2025/11/marque-employeur-maroc-700x1012.jpg',
  '{"heroTitle":"Communication RSE","heroSubtitle":"Transformez vos engagements sociétaux en avantage compétitif et renforcez la confiance de vos parties prenantes.","heroImage":"https://version2.epitaphe.ma/wp-content/uploads/2025/11/marque-employeur-maroc-700x1012.jpg"}',
  NULL, NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'SERVICE_PAGE',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Outils BMI 360™ ────────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Outils BMI 360™',
  'outils',
  'PUBLISHED', 'GRAPES_JS', true, 60,
  'BMI 360™ — Outils de Scoring Intelligence d''Entreprise | Epitaphe 360',
  '8 outils de scoring BMI 360™ pour mesurer la maturité de votre communication : interne, marque employeur, RSE, QHSE, événementiel, signalétique et financière.',
  'https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg',
  '{"heroTitle":"Pilotez votre communication avec précision","heroSubtitle":"8 outils de scoring propriétaires pour mesurer, diagnostiquer et transformer la maturité de votre communication d''entreprise.","heroImage":"https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg"}',
  '', NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'GRAPES_JS',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Blog ────────────────────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Blog & Ressources',
  'blog',
  'PUBLISHED', 'GRAPES_JS', true, 70,
  'Blog & Ressources — Epitaphe 360',
  'Insights, stratégies et tendances du monde de la communication globale. Articles et guides Epitaphe 360.',
  'https://epitaphe.ma/wp-content/uploads/2025/03/Pourquoi-les-equipes-interfonctionnelles-en-marketing-echouent.jpg',
  '{"heroTitle":"Nos articles","heroSubtitle":"Insights, stratégies et tendances du monde de la communication globale","heroImage":"https://epitaphe.ma/wp-content/uploads/2025/03/Pourquoi-les-equipes-interfonctionnelles-en-marketing-echouent.jpg"}',
  '', NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'GRAPES_JS',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Nos Références ──────────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Nos Références Clients',
  'nos-references',
  'PUBLISHED', 'GRAPES_JS', true, 75,
  'Nos Références Clients — 500+ entreprises | Epitaphe 360',
  'Plus de 500 entreprises nous font confiance. Découvrez nos références et études de cas par secteur.',
  'https://epitaphe.ma/wp-content/uploads/2020/05/nos-references-clients.jpg',
  '{"heroTitle":"Ils nous font confiance","heroSubtitle":"500+ entreprises au Maroc et à l''international","heroImage":"https://epitaphe.ma/wp-content/uploads/2020/05/nos-references-clients.jpg"}',
  '', NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'GRAPES_JS',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Bibliothèque de Ressources ──────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Bibliothèque de Ressources',
  'ressources',
  'PUBLISHED', 'GRAPES_JS', true, 50,
  'Bibliothèque de ressources — Guides, Templates & Études de cas | Epitaphe 360',
  'Guides pratiques, études de cas, templates et outils gratuits pour optimiser vos événements, communication QHSE et stratégie de marque.',
  'https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg',
  '{"heroTitle":"Bibliothèque de ressources","heroSubtitle":"Guides, templates et études de cas — tout ce qu''il vous faut pour piloter votre communication","heroImage":"https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg"}',
  '', NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'GRAPES_JS',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Contact ─────────────────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Contact',
  'contact',
  'PUBLISHED', 'GRAPES_JS', true, 80,
  'Contact — Epitaphe 360',
  'Contactez Epitaphe 360 pour votre projet événementiel, signalétique ou architecture de marque. Réponse sous 24h.',
  'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80',
  '{"heroTitle":"Commençons à créer ensemble","heroSubtitle":"Un projet en tête ? Notre équipe répond sous 24h.","heroImage":"https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80"}',
  '', NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'GRAPES_JS',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── FAQ ─────────────────────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'FAQ — Questions fréquentes',
  'faq',
  'PUBLISHED', 'GRAPES_JS', false, 90,
  'FAQ — Questions fréquentes | Epitaphe 360',
  'Toutes les réponses à vos questions sur Epitaphe 360 : délais, devis, scoring BMI 360™, espace client, production et expertises communication.',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80',
  '{"heroTitle":"Questions fréquentes","heroSubtitle":"Vous avez une question ? Trouvez la réponse ici.","heroImage":"https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80"}',
  '', NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'GRAPES_JS',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Mentions légales ────────────────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Mentions légales',
  'mentions-legales',
  'PUBLISHED', 'GRAPES_JS', false, 95,
  'Mentions légales — Epitaphe 360',
  'Mentions légales, informations juridiques et éditeur du site Epitaphe 360.',
  'https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg',
  '{"heroTitle":"Mentions légales","heroSubtitle":"Informations légales et éditeur du site","heroImage":"https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg"}',
  '', NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'GRAPES_JS',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Politique de confidentialité ────────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Politique de confidentialité',
  'politique-confidentialite',
  'PUBLISHED', 'GRAPES_JS', false, 96,
  'Politique de confidentialité — Epitaphe 360',
  'Politique de confidentialité et traitement des données personnelles — Epitaphe 360.',
  'https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg',
  '{"heroTitle":"Politique de confidentialité","heroSubtitle":"Traitement et protection de vos données personnelles","heroImage":"https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg"}',
  '', NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'GRAPES_JS',
  status            = 'PUBLISHED',
  updated_at        = NOW();

-- ─── Conditions Générales de Vente ───────────────────────────────────────────
INSERT INTO pages (
  title, slug, status, template, show_in_menu, "order",
  meta_title, meta_description, featured_image,
  sections, content, published_at, created_at, updated_at
) VALUES (
  'Conditions Générales de Vente',
  'conditions-generales-de-vente',
  'PUBLISHED', 'GRAPES_JS', false, 97,
  'Conditions Générales de Vente — Epitaphe 360',
  'Conditions générales de vente et de prestation de services Epitaphe 360.',
  'https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg',
  '{"heroTitle":"Conditions Générales de Vente","heroSubtitle":"Conditions de prestation de services Epitaphe 360","heroImage":"https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg"}',
  'Les présentes conditions générales de vente (CGV) régissent les relations contractuelles entre Epitaphe Communication 360 SARL, société de droit marocain dont le siège social est situé Rez de chaussée, Immeuble 7-9, Rue Bussang, Casablanca, et ses clients. Toute commande implique l''acceptation sans réserve des présentes CGV.',
  NOW(), NOW(), NOW()
) ON CONFLICT (slug) DO UPDATE SET
  meta_title        = EXCLUDED.meta_title,
  meta_description  = EXCLUDED.meta_description,
  featured_image    = EXCLUDED.featured_image,
  sections          = EXCLUDED.sections,
  template          = 'GRAPES_JS',
  status            = 'PUBLISHED',
  content           = EXCLUDED.content,
  updated_at        = NOW();

-- ─── VÉRIFICATION FINALE ─────────────────────────────────────────────────────
-- Requête de contrôle (commentée — à exécuter manuellement si besoin)
-- SELECT slug, title, left(meta_title,50) AS meta_title, left(featured_image,60) AS image
-- FROM pages WHERE status = 'PUBLISHED' ORDER BY "order", slug;
