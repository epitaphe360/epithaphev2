-- ============================================================
-- MIGRATION 020 : Seed contenu réel epitaphe.ma
-- - Coordonnées réelles dans settings
-- - 9 articles de blog réels (avec photos /uploads/blog/)
-- ============================================================

-- ─── 1. Settings : coordonnées réelles ─────────────────────────────────────
INSERT INTO settings (key, value, updated_at) VALUES
  ('footer_address',     '"Rez de chaussée, Immeuble 7-9 Rue Bussang, Casablanca - Maroc"'::jsonb, NOW()),
  ('footer_phone',       '"+212 6 62 74 47 41"'::jsonb, NOW()),
  ('footer_email',       '"info@epitaphe.ma"'::jsonb, NOW()),
  ('footer_facebook',    '"https://www.facebook.com/epitaphe360"'::jsonb, NOW()),
  ('footer_description', '"Agence de communication 360° à Casablanca. Inspirez. Connectez. Marquez Durablement. Plus de 20 ans d''expertise au service des grandes entreprises, multinationales et PME."'::jsonb, NOW()),
  ('contact_address',    '"Rez de chaussée, Immeuble 7-9 Rue Bussang, Casablanca - Maroc"'::jsonb, NOW()),
  ('contact_phone',      '"+212 6 62 74 47 41"'::jsonb, NOW()),
  ('contact_email',      '"info@epitaphe.ma"'::jsonb, NOW())
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- ─── 2. Articles de blog réels (depuis epitaphe.ma) ────────────────────────
INSERT INTO articles (title, slug, excerpt, content, featured_image, status, published_at, tags, featured, created_at, updated_at) VALUES
  (
    'Pourquoi les équipes interfonctionnelles en marketing échouent (et comment éviter le chaos)',
    'eviter-le-chaos-dans-les-equipes-interfonctionnelles-en-marketing',
    'Les équipes interfonctionnelles en marketing promettent d''améliorer l''efficacité, mais elles échouent souvent à cause du manque d''alignement, de communication et de leadership.',
    '<p>Tout le monde le sait : une équipe interfonctionnelle devrait briser les silos et accélérer les décisions. Pourtant, dans 70% des cas, elles produisent l''inverse : confusion, lenteur, conflits.</p><p>Découvrez les 5 causes principales d''échec et comment les éviter.</p>',
    '/uploads/blog/equipes-marketing.jpg',
    'PUBLISHED', NOW() - INTERVAL '5 days',
    ARRAY['communication-globale','communication-interne','strategie'],
    true, NOW(), NOW()
  ),
  (
    'L''Erreur Stratégique des Marketeurs : Pourquoi l''Anticipation Concurrentielle Change Tout',
    'marketing-strategique-anticipation-concurrents',
    'L''Erreur Stratégique que 90% des Marketeurs font : ils lancent des campagnes sans anticiper les réactions concurrentielles.',
    '<p>L''anticipation concurrentielle est le facteur clé que les marketeurs négligent le plus. Découvrez comment intégrer cette dimension à votre stratégie.</p>',
    '/uploads/blog/anticipation.jpg',
    'PUBLISHED', NOW() - INTERVAL '12 days',
    ARRAY['communication-globale','strategie'],
    true, NOW(), NOW()
  ),
  (
    'Pourquoi l''illusion de la « Love Brand » fragilise votre entreprise ?',
    'faut-il-faire-aimer-votre-marque-ou-limposer',
    'On vous martèle qu''il faut « faire aimer votre marque ». Et si c''était une erreur stratégique majeure ?',
    '<p>La quête du « Love Brand » est devenue un dogme. Pourtant, les marques qui durent ne sont pas celles qu''on aime — ce sont celles qui s''imposent. Analyse.</p>',
    '/uploads/blog/love-brand.webp',
    'PUBLISHED', NOW() - INTERVAL '20 days',
    ARRAY['communication-globale','strategie','branding'],
    false, NOW(), NOW()
  ),
  (
    'Pourquoi payez-vous pour être invisible ? Le coût du consensus en Branding',
    'pourquoi-payez-vous-pour-etre-invisible-le-cout-du-consensus-en-branding',
    'Vous investissez massivement. Vous occupez l''espace. Pourtant, votre marque semble invisible. La cause : le consensus mou.',
    '<p>Le branding par consensus produit des marques tièdes, indifférenciées, oubliables. Voici comment briser ce piège.</p>',
    '/uploads/blog/branding.webp',
    'PUBLISHED', NOW() - INTERVAL '30 days',
    ARRAY['communication-globale','strategie','branding'],
    false, NOW(), NOW()
  ),
  (
    'Safety Day : 3 erreurs fréquentes à éviter pour un événement vraiment impactant',
    'safety-day-entreprise-erreurs-a-eviter',
    'Organiser un Safety Day peut transformer la culture sécurité de votre entreprise — à condition d''éviter ces 3 erreurs courantes.',
    '<p>Le Safety Day est devenu un rituel d''entreprise. Mais trop souvent, il se résume à une journée d''ennui. Voici les 3 erreurs à éviter pour le rendre marquant.</p>',
    '/uploads/blog/safety-day.jpg',
    'PUBLISHED', NOW() - INTERVAL '45 days',
    ARRAY['communication-interne','evenementiel','strategie'],
    true, NOW(), NOW()
  ),
  (
    'Un événement mal exploité affaiblit votre marque… Découvrez comment en faire une arme stratégique',
    'epitaphe360-com-blog-communication-interne-engagement',
    'Dans un monde où chaque interaction compte, savoir comment réussir son événement de marque devient un atout concurrentiel.',
    '<p>L''événement n''est pas un coût — c''est un actif stratégique. Découvrez la méthode Epitaphe360 pour transformer chaque événement en levier de marque.</p>',
    '/uploads/blog/communication-interne.jpg',
    'PUBLISHED', NOW() - INTERVAL '60 days',
    ARRAY['evenementiel','organisation-evenements'],
    false, NOW(), NOW()
  ),
  (
    'Comment transformer vos événements en expériences inoubliables ?',
    'agence-evenementielle-innovante-maroc',
    'Les méthodes classiques coûtent cher et rapportent peu. Découvrez les nouvelles approches événementielles au Maroc.',
    '<p>L''événementiel marocain évolue. Les attentes des participants aussi. Voici les 7 leviers d''une expérience événementielle vraiment mémorable.</p>',
    '/uploads/blog/equipes-cross.jpg',
    'PUBLISHED', NOW() - INTERVAL '75 days',
    ARRAY['evenementiel','organisation-evenements'],
    false, NOW(), NOW()
  ),
  (
    'Les secrets pour organiser votre événement avec plus de succès et moins de stress',
    'les-secrets-pour-organiser-votre-evenement-avec-plus-de-succes-et-moins-de-stress',
    'Organiser un événement est loin d''être une mince affaire. Voici nos secrets de production éprouvés.',
    '<p>Notre méthodologie d''organisation événementielle, affinée par 20 ans de production : checklists, rétroplanning, gestion des risques.</p>',
    '/uploads/blog/schema-strategie.webp',
    'PUBLISHED', NOW() - INTERVAL '90 days',
    ARRAY['evenementiel','organisation-evenements'],
    false, NOW(), NOW()
  ),
  (
    'Anticipation publicitaire : ne laissez plus vos concurrents prendre l''avantage',
    'pub-et-concurrence',
    'Comment lire les signaux faibles concurrentiels et adapter votre communication en temps réel.',
    '<p>L''intelligence concurrentielle appliquée à la publicité : méthodes, outils, exemples concrets pour rester en tête.</p>',
    '/uploads/blog/pub-concurrence.jpg',
    'PUBLISHED', NOW() - INTERVAL '110 days',
    ARRAY['communication-globale','strategie'],
    false, NOW(), NOW()
  )
ON CONFLICT (slug) DO UPDATE SET
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  featured_image = EXCLUDED.featured_image,
  status = EXCLUDED.status,
  updated_at = NOW();
