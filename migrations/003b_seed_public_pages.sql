-- ========================================
-- EPITAPHE v1 - IMPORTER LES PAGES PUBLIQUES
-- ========================================

-- Importer les pages existantes du site public dans la base de données
-- Ces pages étaient hardcodées en React, maintenant elles sont dans le CMS

-- Page d'accueil
INSERT INTO pages (title, slug, content, status, show_in_menu, "order")
VALUES (
  'Accueil',
  'home',
  '<h1>Bienvenue sur Epitaphe</h1><p>Votre solution complète de gestion de contenu</p>',
  'PUBLISHED',
  true,
  1
) ON CONFLICT (slug) DO NOTHING;

-- Page Blog
INSERT INTO pages (title, slug, content, status, show_in_menu, "order")
VALUES (
  'Blog',
  'blog',
  '<h1>Blog</h1><p>Découvrez nos derniers articles et actualités</p>',
  'PUBLISHED',
  true,
  2
) ON CONFLICT (slug) DO NOTHING;

-- Page Références/Nos réalisations
INSERT INTO pages (title, slug, content, status, show_in_menu, "order")
VALUES (
  'Nos Réalisations',
  'nos-references',
  '<h1>Nos Réalisations</h1><p>Découvrez les projets que nous avons menés avec succès</p>',
  'PUBLISHED',
  true,
  3
) ON CONFLICT (slug) DO NOTHING;

-- Page Services
INSERT INTO pages (title, slug, content, status, show_in_menu, "order")
VALUES (
  'Services',
  'services',
  '<h1>Nos Services</h1><p>Une gamme complète de services pour votre succès</p>',
  'PUBLISHED',
  true,
  4
) ON CONFLICT (slug) DO NOTHING;

-- Page À propos
INSERT INTO pages (title, slug, content, status, show_in_menu, "order")
VALUES (
  'À Propos',
  'about',
  '<h1>À Propos de Nous</h1><p>Découvrez notre histoire et nos valeurs</p>',
  'PUBLISHED',
  true,
  5
) ON CONFLICT (slug) DO NOTHING;

-- Page Contact
INSERT INTO pages (title, slug, content, status, show_in_menu, "order")
VALUES (
  'Contact',
  'contact',
  '<h1>Nous Contacter</h1><p>Envoyez-nous vos demandes et questions</p>',
  'PUBLISHED',
  true,
  6
) ON CONFLICT (slug) DO NOTHING;

SELECT '✅ Pages publiques importées avec succès!' as status;
