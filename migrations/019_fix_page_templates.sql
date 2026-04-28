-- ============================================================
-- MIGRATION 019: Corriger les templates des pages existantes
-- Les pages créées avant le CMS ont template=DEFAULT.
-- On les passe à GRAPES_JS + PUBLISHED pour qu'elles soient
-- éditables dans le dashboard CMS.
-- ============================================================

UPDATE pages
SET template = 'GRAPES_JS',
    status   = 'PUBLISHED',
    updated_at = NOW()
WHERE slug IN ('home', 'contact', 'nos-references', 'blog', 'services', 'about')
  AND template = 'DEFAULT';
