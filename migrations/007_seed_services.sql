-- ============================================================
-- SEED: Services (solutionsData.ts → services table)
-- Execute in Supabase Dashboard → SQL Editor
-- ============================================================

-- CATÉGORIE: evenementiel
INSERT INTO services (title, slug, hub, accroche, hero_image, body, service_blocks, status, "order")
VALUES
  ('Organisation des événements BtoB', 'organisation-evenements-btob', 'evenementiel',
   'Organisation complète d''événements professionnels pour entreprises',
   'https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg',
   'Nous concevons et organisons des événements BtoB sur mesure qui marquent les esprits. De la conception à l''exécution, notre équipe prend en charge tous les aspects de votre événement.',
   '[{"icon":"Check","title":"Organiser des conférences et séminaires"},{"icon":"Check","title":"Lancer un nouveau produit"},{"icon":"Check","title":"Créer des événements de team building"},{"icon":"Check","title":"Organiser des salons professionnels"},{"icon":"Check","title":"Gérer la logistique événementielle"}]',
   'PUBLISHED', 1),

  ('Impression grand format', 'impression-grand-format', 'evenementiel',
   'Solutions d''impression grand format pour tous vos besoins visuels',
   'https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg',
   'Notre atelier d''impression grand format vous offre des solutions visuelles percutantes. Qualité HD, couleurs éclatantes et finitions professionnelles pour tous vos supports.',
   '[{"icon":"Check","title":"Bâches publicitaires"},{"icon":"Check","title":"Kakémonos et roll-ups"},{"icon":"Check","title":"Affiches grand format"},{"icon":"Check","title":"Adhésifs et vinyles"},{"icon":"Check","title":"Panneaux d''exposition"}]',
   'PUBLISHED', 2),

  ('Stands d''exposition', 'stands-exposition', 'evenementiel',
   'Conception et réalisation de stands d''exposition sur mesure',
   'https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg',
   'Nous concevons des stands d''exposition uniques qui captent l''attention et reflètent votre identité de marque. De la conception 3D à l''installation, nous gérons tout.',
   '[{"icon":"Check","title":"Stands modulaires"},{"icon":"Check","title":"Stands sur mesure"},{"icon":"Check","title":"Aménagement d''espaces"},{"icon":"Check","title":"Mobilier d''exposition"},{"icon":"Check","title":"Éclairage et signalétique"}]',
   'PUBLISHED', 3),

  ('PLV / ILV et banners', 'plv-ilv-banners', 'evenementiel',
   'Publicité sur lieu de vente et signalétique intérieure',
   'https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg',
   'Maximisez l''impact de vos produits en point de vente avec nos solutions PLV/ILV. Conception créative et fabrication de qualité pour une visibilité optimale.',
   '[{"icon":"Check","title":"Présentoirs de comptoir"},{"icon":"Check","title":"Totems et colonnes"},{"icon":"Check","title":"Displays et kakémonos"},{"icon":"Check","title":"Stop-rayons et wobblers"},{"icon":"Check","title":"Banners et drapeaux"}]',
   'PUBLISHED', 4),

  ('Enseignes et lettrage', 'enseignes-lettrage', 'evenementiel',
   'Enseignes lumineuses et lettrage pour votre identité visuelle',
   'https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg',
   'Créez une identité visuelle forte avec nos enseignes et lettrages personnalisés. Solutions durables et esthétiques pour renforcer votre présence.',
   '[{"icon":"Check","title":"Enseignes lumineuses LED"},{"icon":"Check","title":"Lettres découpées"},{"icon":"Check","title":"Caissons lumineux"},{"icon":"Check","title":"Enseignes non lumineuses"},{"icon":"Check","title":"Lettrage véhicules"}]',
   'PUBLISHED', 5),

  ('Écrans & Bornes interactives', 'ecrans-bornes-interactives', 'evenementiel',
   'Solutions digitales interactives pour l''événementiel',
   'https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg',
   'Intégrez la technologie dans vos événements avec nos solutions d''écrans et bornes interactives. Engagement client garanti.',
   '[{"icon":"Check","title":"Bornes tactiles"},{"icon":"Check","title":"Écrans d''affichage dynamique"},{"icon":"Check","title":"Murs d''images LED"},{"icon":"Check","title":"Solutions interactives"},{"icon":"Check","title":"Location d''équipements"}]',
   'PUBLISHED', 6),

  ('Objets et cadeaux publicitaires', 'objets-cadeaux-publicitaires', 'evenementiel',
   'Goodies et objets promotionnels personnalisés',
   'https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg',
   'Renforcez votre image de marque avec des objets publicitaires de qualité. Large gamme de produits personnalisables pour tous les budgets.',
   '[{"icon":"Check","title":"Textiles personnalisés"},{"icon":"Check","title":"Accessoires de bureau"},{"icon":"Check","title":"Goodies high-tech"},{"icon":"Check","title":"Cadeaux d''affaires"},{"icon":"Check","title":"Packaging personnalisé"}]',
   'PUBLISHED', 7)

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, hub = EXCLUDED.hub, accroche = EXCLUDED.accroche,
  hero_image = EXCLUDED.hero_image, body = EXCLUDED.body,
  service_blocks = EXCLUDED.service_blocks, status = EXCLUDED.status,
  updated_at = NOW();

-- CATÉGORIE: industrie-publicitaire
INSERT INTO services (title, slug, hub, accroche, hero_image, body, service_blocks, status, "order")
VALUES
  ('Réalisation de Stands', 'realisation-stands', 'industrie-publicitaire',
   'Fabrication de stands sur mesure dans notre atelier',
   'https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg',
   'Notre atelier de fabrication réalise vos stands sur mesure avec des matériaux de qualité. Du design à l''installation, nous assurons un service complet.',
   '[{"icon":"Check","title":"Stands personnalisés"},{"icon":"Check","title":"Structures métalliques"},{"icon":"Check","title":"Habillage et finitions"},{"icon":"Check","title":"Montage et démontage"},{"icon":"Check","title":"Stockage et logistique"}]',
   'PUBLISHED', 1),

  ('Fabrication de PLV', 'fabrication-plv', 'industrie-publicitaire',
   'Production de supports PLV dans notre atelier intégré',
   'https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg',
   'Fabrication de PLV de qualité dans notre atelier. Contrôle total du processus pour des délais optimisés et une qualité irréprochable.',
   '[{"icon":"Check","title":"Présentoirs sur mesure"},{"icon":"Check","title":"Displays permanents"},{"icon":"Check","title":"PLV carton et PVC"},{"icon":"Check","title":"Structures métalliques"},{"icon":"Check","title":"Prototypage rapide"}]',
   'PUBLISHED', 2),

  ('Impression grand format (Industrie)', 'impression-grand-format-industrie', 'industrie-publicitaire',
   'Impression professionnelle grand format',
   'https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg',
   'Parc machines dernière génération pour une impression grand format de qualité supérieure. Tous supports, toutes dimensions.',
   '[{"icon":"Check","title":"Bâches et banderoles"},{"icon":"Check","title":"Adhésifs et vinyles"},{"icon":"Check","title":"Impression sur supports rigides"},{"icon":"Check","title":"Textile imprimé"},{"icon":"Check","title":"Papier peint personnalisé"}]',
   'PUBLISHED', 3),

  ('Impression petit format', 'impression-petit-format', 'industrie-publicitaire',
   'Impression offset et numérique petit format',
   'https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg',
   'Impression petit format de qualité pour tous vos supports de communication. Offset et numérique selon vos besoins.',
   '[{"icon":"Check","title":"Cartes de visite"},{"icon":"Check","title":"Flyers et dépliants"},{"icon":"Check","title":"Brochures et catalogues"},{"icon":"Check","title":"Papeterie d''entreprise"},{"icon":"Check","title":"Impression numérique"}]',
   'PUBLISHED', 4),

  ('Impression directe et UV', 'impression-directe-uv', 'industrie-publicitaire',
   'Technologie d''impression UV sur tous supports',
   'https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg',
   'Notre technologie d''impression UV permet d''imprimer directement sur presque tous les supports. Résultats durables et éclatants.',
   '[{"icon":"Check","title":"Impression sur bois"},{"icon":"Check","title":"Impression sur verre"},{"icon":"Check","title":"Impression sur métal"},{"icon":"Check","title":"Impression sur plastique"},{"icon":"Check","title":"Objets personnalisés"}]',
   'PUBLISHED', 5),

  ('Enseignes et lettrage (Industrie)', 'enseignes-lettrage-industrie', 'industrie-publicitaire',
   'Fabrication d''enseignes et lettrage professionnel',
   'https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg',
   'Fabrication d''enseignes et lettrage dans notre atelier. Du design à la pose, nous maîtrisons toute la chaîne de production.',
   '[{"icon":"Check","title":"Lettres en relief"},{"icon":"Check","title":"Enseignes LED"},{"icon":"Check","title":"Caissons lumineux"},{"icon":"Check","title":"Totems et pylônes"},{"icon":"Check","title":"Signalétique intérieure"}]',
   'PUBLISHED', 6),

  ('Découpe Laser et CNC', 'decoupe-laser-cnc', 'industrie-publicitaire',
   'Découpe de précision laser et CNC',
   'https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg',
   'Machines de découpe laser et CNC de dernière génération pour une précision parfaite sur tous types de matériaux.',
   '[{"icon":"Check","title":"Découpe bois et MDF"},{"icon":"Check","title":"Découpe acrylique et PVC"},{"icon":"Check","title":"Découpe métal"},{"icon":"Check","title":"Formes complexes"},{"icon":"Check","title":"Prototypage"}]',
   'PUBLISHED', 7),

  ('Marquage et Gravure', 'marquage-gravure', 'industrie-publicitaire',
   'Services de marquage et gravure personnalisés',
   'https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg',
   'Solutions de marquage et gravure pour personnaliser vos produits de manière permanente. Qualité et durabilité garanties.',
   '[{"icon":"Check","title":"Gravure laser"},{"icon":"Check","title":"Marquage à chaud"},{"icon":"Check","title":"Sérigraphie"},{"icon":"Check","title":"Tampographie"},{"icon":"Check","title":"Broderie"}]',
   'PUBLISHED', 8)

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, hub = EXCLUDED.hub, accroche = EXCLUDED.accroche,
  hero_image = EXCLUDED.hero_image, body = EXCLUDED.body,
  service_blocks = EXCLUDED.service_blocks, status = EXCLUDED.status,
  updated_at = NOW();

-- CATÉGORIE: communication-globale
INSERT INTO services (title, slug, hub, accroche, hero_image, body, service_blocks, status, "order")
VALUES
  ('Stratégie de communication', 'strategie-communication', 'communication-globale',
   'Conseil et stratégie de communication globale',
   'https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg',
   'Nous élaborons des stratégies de communication sur mesure alignées avec vos objectifs business. Analyse, conseil et accompagnement.',
   '[{"icon":"Check","title":"Audit de communication"},{"icon":"Check","title":"Positionnement de marque"},{"icon":"Check","title":"Plan de communication"},{"icon":"Check","title":"Stratégie média"},{"icon":"Check","title":"Conseil en image"}]',
   'PUBLISHED', 1),

  ('Modélisation de campagne', 'modelisation-campagne', 'communication-globale',
   'Conception et modélisation de campagnes publicitaires',
   'https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg',
   'Conception de campagnes publicitaires impactantes. De l''idée créative à la diffusion, nous optimisons chaque étape pour maximiser vos résultats.',
   '[{"icon":"Check","title":"Conception de campagnes"},{"icon":"Check","title":"Médiaplanification"},{"icon":"Check","title":"Campagnes multi-canal"},{"icon":"Check","title":"Mesure de performance"},{"icon":"Check","title":"Optimisation ROI"}]',
   'PUBLISHED', 2),

  ('Rédaction de contenus', 'redaction-contenus', 'communication-globale',
   'Création de contenus rédactionnels professionnels',
   'https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg',
   'Notre équipe de rédacteurs crée des contenus engageants qui parlent à votre audience. Ton, style et message adaptés à votre marque.',
   '[{"icon":"Check","title":"Contenus web et SEO"},{"icon":"Check","title":"Rédaction publicitaire"},{"icon":"Check","title":"Storytelling de marque"},{"icon":"Check","title":"Communiqués de presse"},{"icon":"Check","title":"Contenus réseaux sociaux"}]',
   'PUBLISHED', 3),

  ('Conception graphique', 'conception-graphique', 'communication-globale',
   'Design graphique et identité visuelle',
   'https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg',
   'Design graphique créatif et professionnel. Nous donnons vie à vos idées avec des visuels percutants et cohérents.',
   '[{"icon":"Check","title":"Identité visuelle"},{"icon":"Check","title":"Charte graphique"},{"icon":"Check","title":"Supports print"},{"icon":"Check","title":"Illustrations"},{"icon":"Check","title":"Packaging design"}]',
   'PUBLISHED', 4),

  ('Organisation des Événements BtoB (Communication)', 'organisation-evenements-com', 'communication-globale',
   'Organisation d''événements dans le cadre de votre stratégie',
   'https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg',
   'L''événementiel comme levier de communication. Nous intégrons vos événements dans une stratégie globale cohérente.',
   '[{"icon":"Check","title":"Lancements de produits"},{"icon":"Check","title":"Conventions d''entreprise"},{"icon":"Check","title":"Séminaires et formations"},{"icon":"Check","title":"Événements clients"},{"icon":"Check","title":"Relations presse"}]',
   'PUBLISHED', 5),

  ('Impression petit format (Communication)', 'impression-petit-format-com', 'communication-globale',
   'Supports imprimés pour votre communication',
   'https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg',
   'Impression petit format haut de gamme pour des supports qui reflètent la qualité de votre marque.',
   '[{"icon":"Check","title":"Cartes de visite premium"},{"icon":"Check","title":"Plaquettes commerciales"},{"icon":"Check","title":"Rapports annuels"},{"icon":"Check","title":"Invitations"},{"icon":"Check","title":"Papeterie de luxe"}]',
   'PUBLISHED', 6),

  ('Branding', 'branding', 'communication-globale',
   'Création et développement de marque',
   'https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg',
   'Nous construisons des marques fortes et mémorables. De la création du nom à la charte complète, votre identité prend forme.',
   '[{"icon":"Check","title":"Création de marque"},{"icon":"Check","title":"Repositionnement"},{"icon":"Check","title":"Naming"},{"icon":"Check","title":"Brand book"},{"icon":"Check","title":"Déclinaison de marque"}]',
   'PUBLISHED', 7),

  ('Digital', 'digital', 'communication-globale',
   'Solutions de communication digitale',
   'https://epitaphe.ma/wp-content/uploads/2020/04/digital-1.jpg',
   'Solutions digitales complètes pour développer votre présence en ligne. Stratégie, création et gestion de vos canaux digitaux.',
   '[{"icon":"Check","title":"Stratégie digitale"},{"icon":"Check","title":"Réseaux sociaux"},{"icon":"Check","title":"E-mailing"},{"icon":"Check","title":"Publicité en ligne"},{"icon":"Check","title":"Analytics et reporting"}]',
   'PUBLISHED', 8),

  ('Développement de Sites Web', 'developpement-sites-web', 'communication-globale',
   'Conception et développement de sites internet',
   'https://epitaphe.ma/wp-content/uploads/2020/04/digital-1.jpg',
   'Développement de sites web sur mesure, responsive et optimisés SEO. Design moderne et expérience utilisateur au cœur de nos créations.',
   '[{"icon":"Check","title":"Sites vitrines"},{"icon":"Check","title":"Sites e-commerce"},{"icon":"Check","title":"Applications web"},{"icon":"Check","title":"Refonte de site"},{"icon":"Check","title":"Maintenance et évolution"}]',
   'PUBLISHED', 9)

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, hub = EXCLUDED.hub, accroche = EXCLUDED.accroche,
  hero_image = EXCLUDED.hero_image, body = EXCLUDED.body,
  service_blocks = EXCLUDED.service_blocks, status = EXCLUDED.status,
  updated_at = NOW();

-- MÉTIERS
INSERT INTO services (title, slug, hub, accroche, hero_image, body, service_blocks, status, "order")
VALUES
  ('Communication corporate', 'communication-corporate', 'metiers',
   'Gagnez en positionnement !',
   'https://epitaphe.ma/wp-content/uploads/2020/05/bg-com-corporate.jpg',
   'Confiez cette mission à une agence avec une expertise et une vision 360° qui vous permet de maîtriser votre communication corporate, en vous proposant des solutions globales, intégrées et modernes.',
   '[{"icon":"Check","title":"Une maîtrise 360° des métiers du Marketing et de la Communication"},{"icon":"Check","title":"Une écoute active de vos besoins"},{"icon":"Check","title":"Des moyens pour optimiser vos budgets"},{"icon":"Check","title":"Des actions pour maximiser votre visibilité"},{"icon":"Check","title":"Des outils pour mesurer votre ROI"}]',
   'PUBLISHED', 1),

  ('Communication produits', 'communication-produits', 'metiers',
   'Gagnez des clients et... du temps en plus !',
   'https://epitaphe.ma/wp-content/uploads/2020/05/bg-com-produits.jpg',
   'Grâce à nos compétences 360°, nous vous proposons un interlocuteur unique pour trouver le bon mot et le bon format qui capteraient votre marché.',
   '[{"icon":"Check","title":"Un accompagnement tout au long de la vie de votre produit"},{"icon":"Check","title":"Des actions complémentaires et homogènes pour plus d''impact"},{"icon":"Check","title":"Un seul interlocuteur pour plusieurs prestations"}]',
   'PUBLISHED', 2),

  ('Communication événementielle', 'communication-evenementielle', 'metiers',
   'Marquez les esprits!',
   'https://epitaphe.ma/wp-content/uploads/2020/05/bg-com-event.jpg',
   'Conceptualisation, rédaction de contenu, création graphique, print, digitalisation, promotion, logistique et mise en place — notre agence vous apporte une réelle valeur ajoutée en gérant votre événement de A à Z.',
   '[{"icon":"Check","title":"Des idées originales et des concepts d''événements attractifs"},{"icon":"Check","title":"Un seul interlocuteur de l''amont à l''aval"},{"icon":"Check","title":"Conception des supports de communication"},{"icon":"Check","title":"Digitalisation des événements à la demande"}]',
   'PUBLISHED', 3),

  ('Communication financière', 'communication-financiere', 'metiers',
   'Gagnez de la notoriété !',
   'https://epitaphe.ma/wp-content/uploads/2020/05/photobas-comfi.jpg',
   'Notre agence Epitaphe 360 vous accompagne dans toutes les étapes de votre communication financière : de la rédaction de contenus à sa diffusion, en passant par le design graphique et le print.',
   '[{"icon":"Check","title":"Un accompagnement de proximité pour définir vos messages"},{"icon":"Check","title":"Des experts pour vous aider à écrire vos discours"},{"icon":"Check","title":"Un seul interlocuteur pour toutes vos actions"}]',
   'PUBLISHED', 4),

  ('Communication interne', 'communication-interne', 'metiers',
   'Gagnez en cohésion d''équipe !',
   'https://epitaphe.ma/wp-content/uploads/2020/05/bg-com-interne.jpg',
   'Epitaphe 360 vous accompagne pas à pas dans l''élaboration et l''impression de vos journaux et supports, l''organisation de vos événements et la digitalisation de votre communication interne.',
   '[{"icon":"Check","title":"Accompagnement dans toutes les étapes de réalisation"},{"icon":"Check","title":"Une équipe expérimentée à l''écoute de vos besoins"},{"icon":"Check","title":"Un budget optimisé avec des prestations réalisées en interne"},{"icon":"Check","title":"Des outils modernes pour digitaliser votre communication interne"}]',
   'PUBLISHED', 5)

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, hub = EXCLUDED.hub, accroche = EXCLUDED.accroche,
  hero_image = EXCLUDED.hero_image, body = EXCLUDED.body,
  service_blocks = EXCLUDED.service_blocks, status = EXCLUDED.status,
  updated_at = NOW();

-- Vérification
SELECT slug, title, hub, status FROM services ORDER BY hub, "order";
