-- ========================================
-- MIGRATION 002: Seed Public Pages
-- ========================================
-- Description: Ajoute les pages publiques du site dans la table pages
-- Date: 2026-01-16
-- Author: Claude Code

-- Créer les pages publiques existantes dans le site
INSERT INTO pages (title, slug, status, template, show_in_menu, content, excerpt, "order", published_at)
VALUES
  (
    'Accueil',
    '/',
    'PUBLISHED',
    'HOME',
    true,
    '<div>Page d''accueil Epitaphe 360 - Agence de Communication 360°</div>',
    'Inspirez. Connectez. Marquez Durablement.',
    1,
    NOW()
  ),
  (
    'Nos Références',
    'nos-references',
    'PUBLISHED',
    'REFERENCES',
    true,
    '<div>Portfolio de nos projets clients et références</div>',
    'Découvrez nos réalisations et projets réussis',
    2,
    NOW()
  ),
  (
    'Blog',
    'blog',
    'PUBLISHED',
    'BLOG_LIST',
    true,
    '<div>Liste des articles du blog Epitaphe 360</div>',
    'Actualités, insights et tendances en communication',
    3,
    NOW()
  ),
  (
    'Solutions',
    'solutions',
    'PUBLISHED',
    'SOLUTIONS',
    true,
    '<div>Nos services et solutions en communication 360°</div>',
    'Digital, Publicité, Événementiel, Contenu',
    4,
    NOW()
  ),
  (
    'À Propos',
    'a-propos',
    'DRAFT',
    'DEFAULT',
    true,
    '<div>À propos d''Epitaphe 360 - Notre histoire et notre équipe</div>',
    '20 ans d''expérience en communication',
    5,
    NULL
  ),
  (
    'Contact',
    'contact',
    'DRAFT',
    'CONTACT',
    true,
    '<div>Contactez-nous - Epitaphe 360</div>',
    'Prenez contact avec notre agence',
    6,
    NULL
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  template = EXCLUDED.template,
  show_in_menu = EXCLUDED.show_in_menu,
  content = EXCLUDED.content,
  excerpt = EXCLUDED.excerpt,
  "order" = EXCLUDED."order",
  updated_at = NOW();

-- Ajouter les métadonnées SEO pour les pages principales
UPDATE pages
SET
  meta_title = 'Epitaphe 360 - Agence de Communication 360° | Casablanca, Maroc',
  meta_description = 'Epitaphe 360, agence de communication 360° à Casablanca. Digital, publicité, événementiel, contenu. Inspirez. Connectez. Marquez Durablement.'
WHERE slug = '/';

UPDATE pages
SET
  meta_title = 'Nos Références - Epitaphe 360',
  meta_description = 'Découvrez notre portfolio de projets réussis et nos références clients en communication digitale et événementiel.'
WHERE slug = 'nos-references';

UPDATE pages
SET
  meta_title = 'Blog - Epitaphe 360',
  meta_description = 'Articles, insights et tendances en communication, marketing digital et événementiel par Epitaphe 360.'
WHERE slug = 'blog';

UPDATE pages
SET
  meta_title = 'Nos Solutions - Epitaphe 360',
  meta_description = 'Découvrez nos services en communication 360° : digital, publicité, événementiel et création de contenu.'
WHERE slug = 'solutions';
