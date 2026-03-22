-- ============================================================
-- Migration 008: Seed default public settings
-- Groups: hero, stats, footer, benefits, fabrique
-- ============================================================

INSERT INTO settings (key, value, "group", type, is_public) VALUES

-- ===================== HERO SECTION =====================
('hero_title',
  '"Epitaphe 360"',
  'hero', 'string', true),

('hero_tagline',
  '"Inspirez. Connectez. Marquez Durablement."',
  'hero', 'string', true),

('hero_description_line1',
  '"Nous sommes une agence de communication 360°"',
  'hero', 'string', true),

('hero_description_line2',
  '"globalement créative"',
  'hero', 'string', true),

('hero_subtitle',
  '"Vous voulez impacter? Nous savons comment!"',
  'hero', 'string', true),

('hero_description',
  '"Basée à Casablanca au Maroc, notre agence de communication Epitaphe360 accompagne depuis 20 ans, grandes entreprises, multinationales et PME dans la complexité de leurs défis : là où créativité et pragmatisme se croisent. Nous comprenons vos contraintes, en tant que CEO, Directeurs marketing ou de communication… : des délais serrés, des attentes élevées, un besoin constant d''innovation. C''est pour cela que nous avons choisi de faire autrement."',
  'hero', 'string', true),

-- ===================== STATS SECTION =====================
('stats_title',
  '"Pourquoi faire appel à Epitaphe 360"',
  'stats', 'string', true),

('stats_items',
  '[{"value":20,"label":"Ans d''expérience","suffix":""},{"value":360,"label":"Vision globale","suffix":"°"},{"value":500,"label":"Projets réalisés","suffix":"+"},{"value":200,"label":"Clients satisfaits","suffix":"+"}]',
  'stats', 'json', true),

-- ===================== FOOTER SECTION =====================
('footer_description',
  '"Agence de communication 360° à Casablanca. Inspirez. Connectez. Marquez Durablement."',
  'footer', 'string', true),

('footer_address',
  '"Casablanca, Maroc"',
  'footer', 'string', true),

('footer_phone',
  '"+212 5 22 XX XX XX"',
  'footer', 'string', true),

('footer_email',
  '"contact@epitaphe.ma"',
  'footer', 'string', true),

('footer_linkedin',
  '""',
  'footer', 'string', true),

('footer_facebook',
  '""',
  'footer', 'string', true),

('footer_instagram',
  '""',
  'footer', 'string', true),

-- ===================== BENEFITS SECTION =====================
('benefits_title',
  '"Une agence de communication 360, c''est:"',
  'benefits', 'string', true),

('benefits_image',
  '"https://epitaphe.ma/wp-content/uploads/2020/05/bg-agence-de-com-360-800x450.jpg"',
  'benefits', 'string', true),

('benefits_items',
  '["Une maitrise totale : de l''idée à l''exécution, nous gérons vos projet de A à Z pour assurer cohérence, qualité et réactivité","Une approche personnalisée : Nos solutions sont adaptées à vos besoins uniques, avec des formules sur-mesure.","Un atelier interne. Rapidité, flexibilité et réactivité sont nos garanties.","Une équipe passionnée sur laquelle vous pouvez vraiment compter","KPI et suivi. Nous mesurons l''impact de nos solutions pour optimiser votre ROI.","Un partenaire qui optimise votre temps et vos budgets"]',
  'benefits', 'json', true),

-- ===================== LA FABRIQUE =====================
('fabrique_atelier',
  '[{"value":"3 000 m²","label":"Atelier de production"},{"value":"25+","label":"Artisans & techniciens"},{"value":"48h","label":"Délai express possible"},{"value":"100%","label":"Made in Epitaphe"}]',
  'fabrique', 'json', true),

('fabrique_poles',
  '[{"icon":"impression","label":"Impression Grand Format","description":"Bâches, adhésifs, toiles rétroéclairées, impressions haute définition pour tous supports.","href":"/la-fabrique/impression","image":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80","specs":["Résolution 1440 dpi","Largeur max 5m","Finitions : œillets, ourlets, enrouleur"]},{"icon":"menuiserie","label":"Menuiserie & Décor","description":"Stands sur mesure, mobilier d''ambiance, structures d''exposition et éléments architecturaux.","href":"/la-fabrique/menuiserie","image":"https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80","specs":["CNC & découpe laser","Bois & métal","Peinture & laque"]},{"icon":"signaletique","label":"Signalétique","description":"Totems, enseignes lumineuses, wayfinding professionnel, plaques de bâtiment et signalétique directionnelle.","href":"/la-fabrique/signaletique","image":"https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80","specs":["LED intégrée","Acier inox & aluminium","Résistant UV & intempéries"]},{"icon":"amenagement","label":"Aménagement d''Espace","description":"Scénographie, architecture éphémère, cloisons décoratives et aménagement d''espaces événementiels.","href":"/la-fabrique/amenagement","image":"https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80","specs":["Structures modulables","Éclairage intégré","Poses & dépose incluses"]}]',
  'fabrique', 'json', true)

ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value,
      "group" = EXCLUDED."group",
      type = EXCLUDED.type,
      is_public = EXCLUDED.is_public,
      updated_at = NOW();
