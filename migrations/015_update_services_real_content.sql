-- ============================================================
-- MIGRATION 015: Mise à jour complète des services
-- Source: epitaphe.ma (scraped avril 2026)
-- Couvre: toutes les pages /solutions/* et /communication-*/
-- ============================================================

-- ============================================================
-- CATÉGORIE: evenementiel
-- ============================================================
INSERT INTO services (title, slug, hub, accroche, hero_image, body, service_blocks, status, "order")
VALUES
  ('Organisation des événements BtoB', 'organisation-evenements-btob', 'evenementiel',
   'Des événements b2b sans stress !',
   'https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg',
   'L''événementiel B2B requiert beaucoup d''ORGANISATION et d''implication. Le concept, la thématique, le ciblage des invités, le lieu, la date, l''accueil, le programme, le design, l''animation, la restauration, l''impression, la promotion, l''encadrement, le suivi… Au moindre détail, chaque élément doit être réfléchi et structuré que cela soit pour un séminaire, une conférence, un congrès, une incentive, un lancement de produit ou un salon. Maîtrisant toute la chaîne de communication, notre agence d''événementiel Epitaphe 360 se charge de l''organisation de vos événements de A à Z, qu''ils soient internes, externes ou clients. Réussissez vos événements b2b sans stress. Profitez de l''expérience et des solutions intégrées d''Epitaphe 360.',
   '[{"icon":"Check","title":"Réservation des lieux"},{"icon":"Check","title":"E-mailing et invitations"},{"icon":"Check","title":"Branding et habillage"},{"icon":"Check","title":"Fabrication de PLV et de stands"},{"icon":"Check","title":"Plateforme digitale de suivi des inscriptions"},{"icon":"Check","title":"Equipement numérique & tactile : Ecrans, bornes, tablettes"},{"icon":"Check","title":"Sono & lumières"},{"icon":"Check","title":"Gestion de l''accueil"},{"icon":"Check","title":"Goodies"},{"icon":"Check","title":"Tombola et enquêtes"},{"icon":"Check","title":"Plateau artistique et animation"},{"icon":"Check","title":"Reportages photos & vidéos"}]',
   'PUBLISHED', 1),

  ('Impression grand format', 'impression-grand-format', 'evenementiel',
   'L''avantage des grandes résolutions',
   'https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg',
   'Optez pour l''impression numérique grand format si vous voulez être vu de loin. Elle vous permet d''habiller vos murs, vos palissades, vos vitres et vos véhicules, de maximiser votre visibilité en matière d''affichage, de campagnes publicitaires ou de signalétique, de personnaliser vos stands, vos showroom ou votre PLV, et d''avoir un bon retour sur investissement. Parc machines de dernière génération, laize de 3,20m & 1,60m pour impressions du A2 à l''infini.',
   '[{"icon":"Check","title":"Affiches, PLV, branding et signalétique"},{"icon":"Check","title":"Palissades, panneaux de chantiers et enseignes"},{"icon":"Check","title":"Bâches et banderoles"},{"icon":"Check","title":"Habillage de véhicules"},{"icon":"Check","title":"Stands, vitrines et Totems"},{"icon":"Check","title":"Travaux de branding et aménagements de bureaux"},{"icon":"Check","title":"Roll up et X-banner"},{"icon":"Check","title":"Papier peint"},{"icon":"Check","title":"Vinyle et vinyle sablé"},{"icon":"Check","title":"Bâches mesh"},{"icon":"Check","title":"Tissu, Canva et toile"},{"icon":"Check","title":"Backlight et Oneway"}]',
   'PUBLISHED', 2),

  ('Stands d''exposition', 'stands-exposition', 'evenementiel',
   'Be ergonomic !',
   'https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg',
   'Participer à un salon, une foire demande de l''effort et de l''argent. Votre stand doit être réfléchi pour attiser les curiosités, optimiser les espaces et véhiculer les bons messages. Du design à la fabrication et pose de vos modules, Epitaphe 360 est outillée de compétences et de machines dernier cri. Concepts personnalisés, produits modulaires en kits, PLV et éléments d''aménagement de stand. En plus de l''assistance graphique et technique, nous vous conseillons dans le choix des structures et matériaux. Epitaphe 360 : l''ergonomie à votre portée !',
   '[{"icon":"Check","title":"Maquettes 3D"},{"icon":"Check","title":"Production d''éléments de Stands modulables"},{"icon":"Check","title":"Fabrication de Stands et PLV sur mesure"},{"icon":"Check","title":"Branding & Habillage"},{"icon":"Check","title":"Aménagement de stands (Planchers, Totems, Roll-up, Présentoirs, PLV)"},{"icon":"Check","title":"Equipements numériques & tactiles (écran, tablette, borne interactive)"},{"icon":"Check","title":"Mobilier (Fauteuils, tables, chaises, comptoirs)"},{"icon":"Check","title":"Lumière & sono"}]',
   'PUBLISHED', 3),

  ('PLV / ILV et banners', 'plv-ilv-banners', 'evenementiel',
   'Préfabriqués ou sur mesure ?',
   'https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg',
   'En matière de PLV et ILV, le choix est très étendu. Il dépendra de l''usage que vous en prévoyez (indoor, outdoor), de la fréquence d''utilisation et de l''objectif que vous en attendez. Roll-up, Présentoirs, Photocall, Bornes interactives, Comptoirs, différents formats de banners, Stands parapluies, Ecrans… Statique ou dynamique, la PLV ou ILV reste pratique à utiliser. En magasin, sur un point de vente ou dans un stand d''exposition, ces supports vous procureront toujours une belle visibilité et un excellent rapport qualité/prix. Faites appel aux compétences créatives et techniques de l''agence Epitaphe 360 et à son parc de machines dernier cri (Découpe CNC et laser, Impression grand format et UV).',
   '[{"icon":"Check","title":"Totems"},{"icon":"Check","title":"Photocall"},{"icon":"Check","title":"Mur d''image"},{"icon":"Check","title":"Drapeaux publicitaires"},{"icon":"Check","title":"Oriflammes ou Flying banners"},{"icon":"Check","title":"Banners"},{"icon":"Check","title":"Roll up"},{"icon":"Check","title":"Kakémono"},{"icon":"Check","title":"Présentoirs promotionnels"},{"icon":"Check","title":"Présentoirs personnalisés avec forme de découpe"},{"icon":"Check","title":"Stop trottoirs"},{"icon":"Check","title":"Stop rayon"},{"icon":"Check","title":"Comptoirs"},{"icon":"Check","title":"Chevalets"},{"icon":"Check","title":"PLV dynamique"},{"icon":"Check","title":"Stickers au sol"},{"icon":"Check","title":"Ecrans tactiles"},{"icon":"Check","title":"Bornes interactives"}]',
   'PUBLISHED', 4),

  ('Enseignes et lettrage', 'enseignes-lettrage', 'evenementiel',
   'Pour une belle visibilité',
   'https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg',
   'Enseigne en découpe, en néon, rétro-éclairée ? Quoi de mieux pour vous faire remarquer ? Valorisée et soignée, votre enseigne ne manquera pas d''attirer les regards de nouveaux clients et de consolider votre image de marque. Pour cela, vous avez un choix étendu qui s''adapte aussi bien à votre métier, à votre charte graphique qu''à votre budget. Et nous sommes justement là pour vous accompagner de sa conception à sa fabrication et installation. Grâce à nos machines de découpe ultra performante et au savoir-faire de nos équipes, nous avons réalisé des centaines d''enseignes aussi bien pour le compte de multinationales, que de PME au Maroc et en Afrique.',
   '[{"icon":"Check","title":"Enseignes de toit"},{"icon":"Check","title":"Enseignes drapeau"},{"icon":"Check","title":"Enseignes en applique"},{"icon":"Check","title":"Enseignes lumineuse"},{"icon":"Check","title":"Plaques de porte"},{"icon":"Check","title":"Caissons lumineux"},{"icon":"Check","title":"Signalétiques intérieures et extérieures"},{"icon":"Check","title":"Lettrages 3D"},{"icon":"Check","title":"Lettrages relief"},{"icon":"Check","title":"Lettrages adhésifs"},{"icon":"Check","title":"Lettrages en découpe"},{"icon":"Check","title":"Panneaux et Consignes de sécurité"}]',
   'PUBLISHED', 5),

  ('Écrans & Bornes interactives', 'ecrans-bornes-interactives', 'evenementiel',
   'Be innovative !',
   'https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg',
   'Vous voulez conférer plus d''envergure à vos événements ou points de vente ? Misez sur l''innovation que vous permettent les bornes interactives et les écrans tactiles. A l''heure où les tablettes et smartphones sont entrés dans les mœurs, les supports digitaux deviennent de plus en plus incontournables pour dynamiser vos salons ou vos magasins. Ils donnent accès à des vidéos, des jeux, des animations ou des présentations et élargissent ainsi vos possibilités d''interagir avec vos cibles, de les impliquer et de récolter des données. Accessibles à tout public, personnalisables à souhait et adaptables à tous les besoins, les avantages des bornes interactives sont sans nul doute innombrables. A Epitaphe 360, nous vous les louons à des prix très abordables.',
   '[{"icon":"Check","title":"Ecrans tactiles"},{"icon":"Check","title":"Bornes interactives"},{"icon":"Check","title":"Roll up tactile"},{"icon":"Check","title":"Tablettes"}]',
   'PUBLISHED', 6),

  ('Objets et cadeaux publicitaires', 'objets-cadeaux-publicitaires', 'evenementiel',
   'Give to get !',
   'https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg',
   'Les objets et cadeaux publicitaires sont devenus de véritables outils de communication qui peuvent contribuer à la réussite de vos événements, à la motivation de vos employés ou à marquer vos clients. Du stylo à la clé USB, en passant par le notebook, les produits textiles, écologiques ou de dinanderie… Gadget Pro, filiale de l''agence de communication Epitaphe 360 vous propose non seulement un large choix d''objets et de cadeaux publicitaires de qualité, mais aussi des conseils précieux sur les techniques de marquage (sérigraphie, gravure laser, transfert…) pour vous assurer d''un fort impact et optimiser vos coûts. Rappelez élégamment votre marque. Faites appel à Epitaphe 360 !',
   '[{"icon":"Check","title":"Stylos, Clés USB, Power bank, Mug"},{"icon":"Check","title":"Porte document, Note books"},{"icon":"Check","title":"Cadeaux de fin d''année, Coffrets VIP"},{"icon":"Check","title":"Produits textiles : tee-shirt, polos, casquettes, gilets, serviettes de plage"},{"icon":"Check","title":"Dinanderie et produits d''artisanat"}]',
   'PUBLISHED', 7),

  ('Digitalisation des événements et Webinars', 'digitalisation-evenements-webinars', 'evenementiel',
   'Libérez-vous et gagnez sur toute la ligne !',
   'https://epitaphe.ma/wp-content/uploads/2020/04/evenementiel.jpg',
   'Optez pour la digitalisation de vos événements. Vous avez tout à y gagner. Vous avez plusieurs choix, parmi lesquels se trouvent les e-plateformes de gestion événementielle et les webinaires. Une e-plateforme dédiée à votre salon, congrès ou séminaire vous permet de mieux réussir la promotion de votre event, de gagner du temps pour attirer du trafic, de garantir de belles expériences à vos invités et visiteurs, de faire vivre votre événement sur le long terme et de maximiser votre visibilité. Quant aux webinaires, ils offrent des avantages indéniables : pas de déplacement, audience ciblée et élargie, conférences durables dans le temps et suivi précis des inscriptions. Profitez de nos solutions digitales personnalisées pour mettre en place des dispositifs innovants qui donneront à vos événements une forte valeur ajoutée.',
   '[{"icon":"Check","title":"Développement d''un Site web dédié à l''événement"},{"icon":"Check","title":"Organisation d''un Webinaire"},{"icon":"Check","title":"Plateforme d''inscription et de relance des invités"},{"icon":"Check","title":"Mini-site de vente de billets"},{"icon":"Check","title":"Plateforme de gestion de la logistique (hébergement, transfert)"},{"icon":"Check","title":"Plateforme d''organisation de RDV BtoB en amont"},{"icon":"Check","title":"Plateforme de Sondages et questionnaires de satisfaction"},{"icon":"Check","title":"Tombola"},{"icon":"Check","title":"Analytics, reporting, suivi et évaluation"}]',
   'PUBLISHED', 8)

ON CONFLICT (slug) DO UPDATE SET
  title        = EXCLUDED.title,
  hub          = EXCLUDED.hub,
  accroche     = EXCLUDED.accroche,
  hero_image   = EXCLUDED.hero_image,
  body         = EXCLUDED.body,
  service_blocks = EXCLUDED.service_blocks,
  status       = EXCLUDED.status,
  updated_at   = NOW();

-- ============================================================
-- CATÉGORIE: industrie-publicitaire
-- ============================================================
INSERT INTO services (title, slug, hub, accroche, hero_image, body, service_blocks, status, "order")
VALUES
  ('Réalisation de Stands', 'realisation-stands', 'industrie-publicitaire',
   'Fabrication sur mesure dans notre atelier',
   'https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg',
   'Epitaphe 360 dispose d''un atelier de fabrication équipé de machines de dernière génération pour réaliser vos stands de toutes dimensions. Du design 3D à la pose finale, notre équipe prend en charge la fabrication de vos éléments de stand avec des matériaux de qualité adaptés à votre budget et à votre image. Que vous participiez à un salon national ou international, bénéficiez de notre expertise pour des stands qui marquent les esprits. Nos machines de découpe CNC et laser, combinées à notre parc d''impression grand format, nous permettent de produire en interne tous vos éléments : structures, habillage, branding et signalétique.',
   '[{"icon":"Check","title":"Conception et design 3D"},{"icon":"Check","title":"Structures en aluminium et bois"},{"icon":"Check","title":"Habillage et branding"},{"icon":"Check","title":"Impressions grand format pour stands"},{"icon":"Check","title":"Mobilier et accessoires"},{"icon":"Check","title":"Montage et démontage sur site"},{"icon":"Check","title":"Stockage et logistique"},{"icon":"Check","title":"Maintenance et réparation"}]',
   'PUBLISHED', 1),

  ('Fabrication de PLV', 'fabrication-plv', 'industrie-publicitaire',
   'Production PLV dans notre atelier intégré',
   'https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg',
   'Notre atelier de fabrication PLV dispose d''un parc de machines dernier cri (découpe CNC et laser, impression grand format et UV) pour réaliser tous vos supports PLV et ILV sur mesure. Du prototype à la série, nous maîtrisons toute la chaîne de fabrication pour vous garantir qualité, délais et budget maîtrisés. Préfabriqués ou entièrement personnalisés, vos supports PLV seront fabriqués avec les matériaux les plus adaptés à votre usage : bois, PVC, Dibond, aluminium, plexiglass… Faites appel aux compétences créatives et techniques de l''agence Epitaphe 360.',
   '[{"icon":"Check","title":"Présentoirs sur mesure en bois et PVC"},{"icon":"Check","title":"Displays et structures aluminium"},{"icon":"Check","title":"Fabrication de stands parapluies"},{"icon":"Check","title":"Impression directe UV sur supports rigides"},{"icon":"Check","title":"Découpe forme spéciale CNC et laser"},{"icon":"Check","title":"Prototypage rapide"},{"icon":"Check","title":"Production en série"},{"icon":"Check","title":"Montage et livraison"}]',
   'PUBLISHED', 2),

  ('Impression grand format (Industrie)', 'impression-grand-format-industrie', 'industrie-publicitaire',
   'L''avantage des grandes résolutions',
   'https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg',
   'Optez pour l''impression numérique grand format si vous voulez être vu de loin. Elle vous permet d''habiller vos murs, vos palissades, vos vitres et vos véhicules, de maximiser votre visibilité en matière d''affichage, de campagnes publicitaires ou de signalétique, de personnaliser vos stands, vos showroom ou votre PLV, et d''avoir un bon retour sur investissement. Parc machines de dernière génération, laize de 3,20m & 1,60m pour impressions du A2 à l''infini.',
   '[{"icon":"Check","title":"Affiches, PLV, branding et signalétique"},{"icon":"Check","title":"Palissades, panneaux de chantiers et enseignes"},{"icon":"Check","title":"Bâches et banderoles"},{"icon":"Check","title":"Habillage de véhicules"},{"icon":"Check","title":"Stands, vitrines et Totems"},{"icon":"Check","title":"Roll up et X-banner"},{"icon":"Check","title":"Papier peint"},{"icon":"Check","title":"Vinyle et vinyle sablé"},{"icon":"Check","title":"Bâches mesh"},{"icon":"Check","title":"Tissu, Canva et toile"},{"icon":"Check","title":"Backlight et Oneway"}]',
   'PUBLISHED', 3),

  ('Impression petit format', 'impression-petit-format', 'industrie-publicitaire',
   'Exigez la qualité !',
   'https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg',
   'Ne sacrifiez pas la qualité de vos impressions, même si vous êtes souvent pressés par les délais et que vos budgets sont de moins en moins confortables. Des print professionnels et une finition soignée vous assurent d''impressionner vos clients et de refléter une belle image de votre entreprise et de vos produits/services. Du print bureautique (carterie, chemises, papiers à lettres, enveloppes) au matériel publicitaire (affiches et posters, flyers et prospectus, catalogues, dépliants, brochures), Epitaphe 360 vous conseille et vous propose les meilleures idées pour choisir le bon papier et les bons formats. Numérique ou Offset, nous optimisons votre budget en fonction de vos tirages.',
   '[{"icon":"Check","title":"Cartes de visite et en-têtes de lettre"},{"icon":"Check","title":"Flyers, prospectus et plaquettes"},{"icon":"Check","title":"Dépliants, brochures et catalogues"},{"icon":"Check","title":"Rapports d''activité et journaux internes"},{"icon":"Check","title":"Chemises de présentation et enveloppes"},{"icon":"Check","title":"Stickers et adhésifs"}]',
   'PUBLISHED', 4),

  ('Impression directe et UV', 'impression-directe-uv', 'industrie-publicitaire',
   'Créons des objets uniques',
   'https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg',
   'L''impression en encre UV sur des matières rigides vous offre un rendu et une durabilité inégalés. Le niveau de couleur et de détail est supérieur, les possibilités d''impression sont infinies (large choix de matériaux) et les finitions sont résolument remarquables (impression du blanc, relief 3D, couche de vernis sélectif, effet texturé…). Que vous soyez une entreprise ou un particulier, personnalisez vos cadeaux, vos prototypes ou vos accessoires avec l''impression UV. Faites plaisir à vos clients, à vos proches et amis. Offrez des objets UNIQUES. Choisissez l''impression UV.',
   '[{"icon":"Check","title":"Impression sur n''importe quel matériau"},{"icon":"Check","title":"Gadgets (Stylos, Porte-clé, Mugs)"},{"icon":"Check","title":"Accessoires électroniques (Clé USB, Téléphone, Casques)"},{"icon":"Check","title":"Articles promotionnels"},{"icon":"Check","title":"Objets et emballages"},{"icon":"Check","title":"Signalisation et trophées"},{"icon":"Check","title":"Produits industriels et prototypes"},{"icon":"Check","title":"Rendu de couleur incomparable"},{"icon":"Check","title":"Relief 3D et vernis sélectif"},{"icon":"Check","title":"Haute résistance"}]',
   'PUBLISHED', 5),

  ('Enseignes et lettrage (Industrie)', 'enseignes-lettrage-industrie', 'industrie-publicitaire',
   'Pour une belle visibilité',
   'https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg',
   'Enseigne en découpe, en néon, rétro-éclairée ? Quoi de mieux pour vous faire remarquer ? Valorisée et soignée, votre enseigne ne manquera pas d''attirer les regards de nouveaux clients et de consolider votre image de marque. Pour cela, vous avez un choix étendu qui s''adapte aussi bien à votre métier, à votre charte graphique qu''à votre budget. Et nous sommes justement là pour vous accompagner de sa conception à sa fabrication et installation. Grâce à nos machines de découpe ultra performante et au savoir-faire de nos équipes, nous avons réalisé des centaines d''enseignes aussi bien pour le compte de multinationales, que de PME au Maroc et en Afrique.',
   '[{"icon":"Check","title":"Enseignes de toit"},{"icon":"Check","title":"Enseignes drapeau"},{"icon":"Check","title":"Enseignes en applique"},{"icon":"Check","title":"Enseignes lumineuse"},{"icon":"Check","title":"Plaques de porte"},{"icon":"Check","title":"Caissons lumineux"},{"icon":"Check","title":"Signalétiques intérieures et extérieures"},{"icon":"Check","title":"Lettrages 3D"},{"icon":"Check","title":"Lettrages relief"},{"icon":"Check","title":"Lettrages adhésifs"},{"icon":"Check","title":"Lettrages en découpe"},{"icon":"Check","title":"Panneaux et Consignes de sécurité"}]',
   'PUBLISHED', 6),

  ('Découpe Laser et CNC', 'decoupe-laser-cnc', 'industrie-publicitaire',
   'Précision et finition',
   'https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg',
   'Reproduisant des schémas conçus par ordinateurs, les découpes Laser ou CNC vous permettent de créer des objets dans différents matériaux solides : bois, Plexiglass, Forex, Dibond, Aluminium… tout en profitant d''une grande capacité de production et d''une très haute précision dans la finition. Que ce soit pour les lettrages, la menuiserie bois, les enseignes…, les découpes laser et CNC effectuent des coupes impeccables pour des pièces à l''unité ou à la série. Disposant de machines de gravure et de découpe Laser et d''une fraiseuse CNC (3*2m et d''une profondeur de 5cm), Epitaphe 360 vous fait bénéficier d''une belle rapidité d''usinage pour avoir des formes complexes parfaites que cela soit en matière de gravure, 2D, relief 3D ou de découpe complète. Créez vos gabarits en vectoriel, et faites confiance à Epitaphe 360 pour le rendu !',
   '[{"icon":"Check","title":"Menuiseries bois"},{"icon":"Check","title":"Gravures et découpes d''objets"},{"icon":"Check","title":"Usinages 3D"},{"icon":"Check","title":"Signalétique & Enseignes"},{"icon":"Check","title":"PLV & Stand"},{"icon":"Check","title":"Lettrage"},{"icon":"Check","title":"Mobilier & Décoration"},{"icon":"Check","title":"Comptoirs & présentoirs"}]',
   'PUBLISHED', 7),

  ('Marquage et Gravure', 'marquage-gravure', 'industrie-publicitaire',
   'Gravez les mémoires !',
   'https://epitaphe.ma/wp-content/uploads/2020/04/industrie-publicitaire-1.jpg',
   'Vous voulez laisser une empreinte indélébile sur un objet ? Optez pour le fraisage ou la gravure laser. Tous deux vous offrent un résultat artistique durable et remarquable. Ils sont multi-supports : bois, Dibond, PVC, cuir, métal, Inox, Aluminium…, s''adaptent aux petits objets, et se distinguent par leur rapidité et leur haute précision pour un ornement à l''unité ou en série. Pour le marquage de produits industriels à des fins de traçabilité, pour la création d''une œuvre d''art ou pour la personnalisation de vos produits publicitaires, Epitaphe 360 vous garantit lisibilité, finesse de trait, rapidité et précision. La créativité des équipes est soutenue par un parc de machines de dernière génération (Fraiseuse CNC, Machine de gravure laser CO2, machine de gravure laser fibré YAG).',
   '[{"icon":"Check","title":"Produits industriels"},{"icon":"Check","title":"Objets publicitaires (Stylos, Notebook, Clés USB, Trophées)"},{"icon":"Check","title":"Enseignes et signalétiques"},{"icon":"Check","title":"Inscription d''information (numéros de série)"},{"icon":"Check","title":"Présentoirs"},{"icon":"Check","title":"Bijoux"},{"icon":"Check","title":"Gravure de Bois, Aluminium, Inox"},{"icon":"Check","title":"Gravure de Plexiglass, Cuir, PMMA"}]',
   'PUBLISHED', 8)

ON CONFLICT (slug) DO UPDATE SET
  title        = EXCLUDED.title,
  hub          = EXCLUDED.hub,
  accroche     = EXCLUDED.accroche,
  hero_image   = EXCLUDED.hero_image,
  body         = EXCLUDED.body,
  service_blocks = EXCLUDED.service_blocks,
  status       = EXCLUDED.status,
  updated_at   = NOW();

-- ============================================================
-- CATÉGORIE: communication-globale
-- ============================================================
INSERT INTO services (title, slug, hub, accroche, hero_image, body, service_blocks, status, "order")
VALUES
  ('Stratégie de communication', 'strategie-communication', 'communication-globale',
   'Cherchez le bon conseil !',
   'https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg',
   'Institutionnelle, publicitaire, commerciale, produit, interne… la stratégie de communication est la clé pour vous positionner sur votre marché et vous ouvrir les portes de la notoriété et de la croissance. Bien élaborée, votre stratégie devrait vous permettre de faire connaître vos produits et services, de vous distinguer de vos concurrents et surtout d''améliorer la perception de la valeur de votre offre sans alourdir vos finances. Notre agence de communication Epitaphe 360 capitalise sur une expérience éprouvée de plus d''une décennie auprès de clients de différents secteurs d''activité. Nous pouvons vous accompagner dans l''élaboration de votre stratégie de communication et dans l''exécution de votre plan d''action tout en optimisant vos budgets. Créez une relation de confiance avec vos différents publics. Consolidez une belle (e)-réputation. Bénéficiez de notre expertise 360°!',
   '[{"icon":"Check","title":"Chartes graphique et rédactionnelle"},{"icon":"Check","title":"Rapports d''activité"},{"icon":"Check","title":"Evénements institutionnels"},{"icon":"Check","title":"Relations presse"},{"icon":"Check","title":"Choix des leviers et canaux de communication"},{"icon":"Check","title":"Optimisation des budgets"},{"icon":"Check","title":"Exécution du plan de communication"},{"icon":"Check","title":"Analytics et KPI''s"}]',
   'PUBLISHED', 1),

  ('Modélisation de campagne', 'modelisation-campagne', 'communication-globale',
   'Maximisez l''impact de vos campagnes !',
   'https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg',
   'La modélisation de campagne est une étape clé pour garantir la cohérence et l''efficacité de vos actions de communication. Epitaphe 360 vous accompagne dans la conception, la planification et l''orchestration de vos campagnes publicitaires et de communication, du brief créatif au déploiement sur tous les canaux. Grâce à notre vision 360°, nous construisons des campagnes intégrées qui maximisent votre impact sur votre cible, optimisent votre budget et mesurent votre retour sur investissement. De la création des messages percutants à la sélection des bons supports, notre équipe vous guide pas à pas.',
   '[{"icon":"Check","title":"Conception et brief créatif"},{"icon":"Check","title":"Médiaplanification multicanal"},{"icon":"Check","title":"Campagnes print et digitales"},{"icon":"Check","title":"Campagnes événementielles"},{"icon":"Check","title":"Mesure de performance et KPI''s"},{"icon":"Check","title":"Optimisation et ajustement"},{"icon":"Check","title":"Reporting et analyse ROI"},{"icon":"Check","title":"Accompagnement à la mise en oeuvre"}]',
   'PUBLISHED', 2),

  ('Rédaction de contenus', 'redaction-contenus', 'communication-globale',
   'Augmentez vos ventes grâce au contenu !',
   'https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg',
   '« Le contenu est ROI ». En effet, un contenu bien écrit sera toujours le souverain de votre communication. C''est lui qui fabrique les sens de chaque chose pour vous faire connaître, vous permettre de tisser des liens avec vos clients et pour vous ouvrir les portes de la notoriété. Editos, discours, brochures, affiches, rapports d''activité, journaux internes, communiqués de presse, storytelling… C''est grâce à la qualité de votre contenu rédactionnel que vous pourrez toucher, sensibiliser, séduire et convaincre vos différents publics. Faites appel à la plume de nos experts pour choisir les mots qui correspondent à chaque support et à chaque contexte. Augmentez votre notoriété et vos ventes grâce à la magie des mots. Faites confiance au style d''Epitaphe 360 !',
   '[{"icon":"Check","title":"Plaquettes"},{"icon":"Check","title":"Brochures"},{"icon":"Check","title":"Rapports d''activité"},{"icon":"Check","title":"Communiqué de presse"},{"icon":"Check","title":"Dossier de presse"},{"icon":"Check","title":"Editos"},{"icon":"Check","title":"Discours"},{"icon":"Check","title":"Journal interne"}]',
   'PUBLISHED', 3),

  ('Conception graphique', 'conception-graphique', 'communication-globale',
   'Cherchez la créativité !',
   'https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg',
   'De nos jours, le design graphique est au cœur de toute démarche de communication, qu''elle soit classique ou digitale. N''est-ce pas grâce à lui que vous exprimez votre identité visuelle, que vous traduisez vos idées, que vous illustrez vos propositions de valeur ? Loin de se positionner en fin de processus, le design graphique est un vrai levier pour asseoir votre visibilité sur le marché et pour promouvoir vos produits et services. Charte graphique, affiche publicitaire, flyers, catalogue, dépliant, habillage, Show room… vos conceptions graphiques doivent avoir un rendu alliant créativité et professionnalisme pour consolider votre image de marque. Pour le plaisir des yeux de vos clients et au profit de votre business, optez pour l''ergonomie et l''esthétisme. Profitez de la créativité de nos équipes !',
   '[{"icon":"Check","title":"Création d''identités visuelles (logos, chartes graphiques)"},{"icon":"Check","title":"Conception de plaquettes, dépliants, affiches, flyers"},{"icon":"Check","title":"Mise en page de catalogues, rapports, journaux internes"},{"icon":"Check","title":"Branding de sièges, habillage de showrooms"},{"icon":"Check","title":"Conception de stands, Roll-up, panneaux publicitaires"},{"icon":"Check","title":"Réalisation de bannières, posts, newsletters"}]',
   'PUBLISHED', 4),

  ('Organisation des Événements BtoB (Communication)', 'organisation-evenements-com', 'communication-globale',
   'Des événements b2b sans stress !',
   'https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg',
   'L''événementiel B2B requiert beaucoup d''ORGANISATION et d''implication. Maîtrisant toute la chaîne de communication, notre agence d''événementiel Epitaphe 360 se charge de l''organisation de vos événements de A à Z, qu''ils soient internes, externes ou clients. L''événementiel intégré dans votre stratégie de communication globale est un levier puissant pour renforcer votre image, fidéliser vos clients et créer des moments mémorables autour de votre marque. Réussissez vos événements b2b sans stress. Profitez de l''expérience et des solutions intégrées d''Epitaphe 360.',
   '[{"icon":"Check","title":"Séminaires, conférences et congrès"},{"icon":"Check","title":"Lancements de produits"},{"icon":"Check","title":"Incentives et team building"},{"icon":"Check","title":"Salons et expositions"},{"icon":"Check","title":"Réservation des lieux et branding"},{"icon":"Check","title":"Invitations et gestion des inscriptions"},{"icon":"Check","title":"Logistique complète de A à Z"},{"icon":"Check","title":"Reportages photos & vidéos"}]',
   'PUBLISHED', 5),

  ('Impression petit format (Communication)', 'impression-petit-format-com', 'communication-globale',
   'Exigez la qualité !',
   'https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg',
   'Ne sacrifiez pas la qualité de vos impressions, même si vous êtes souvent pressés par les délais et que vos budgets sont de moins en moins confortables. Des print professionnels et une finition soignée vous assurent d''impressionner vos clients et de refléter une belle image de votre entreprise et de vos produits/services. Du print bureautique (carterie, chemises, papiers à lettres, enveloppes) au matériel publicitaire (affiches et posters, flyers et prospectus, catalogues, dépliants, brochures), Epitaphe 360 vous conseille et vous propose les meilleures idées pour choisir le bon papier et les bons formats.',
   '[{"icon":"Check","title":"Cartes de visite et en-têtes de lettre"},{"icon":"Check","title":"Flyers, prospectus et plaquettes"},{"icon":"Check","title":"Dépliants, brochures et catalogues"},{"icon":"Check","title":"Rapports d''activité et journaux internes"},{"icon":"Check","title":"Chemises de présentation et enveloppes"},{"icon":"Check","title":"Stickers et adhésifs"}]',
   'PUBLISHED', 6),

  ('Branding', 'branding', 'communication-globale',
   'Construisez une marque forte !',
   'https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg',
   'Votre marque est bien plus qu''un logo. Elle est l''expression de vos valeurs, de votre promesse et de ce qui vous différencie de vos concurrents. Epitaphe 360 vous accompagne dans la création et le développement de votre identité de marque, en partant de votre ADN pour construire un univers visuel et rédactionnel cohérent, impactant et mémorable. Du naming à la charte graphique complète, en passant par le positionnement et les supports de communication, notre équipe créative met son expertise 360° au service de votre marque.',
   '[{"icon":"Check","title":"Création et naming de marque"},{"icon":"Check","title":"Charte graphique complète"},{"icon":"Check","title":"Brand book"},{"icon":"Check","title":"Positionnement et storytelling"},{"icon":"Check","title":"Supports de communication"},{"icon":"Check","title":"Déclinaison de marque tous supports"}]',
   'PUBLISHED', 7),

  ('Digital', 'digital', 'communication-globale',
   'Digitalisez votre communication !',
   'https://epitaphe.ma/wp-content/uploads/2020/04/digital-1.jpg',
   'La communication digitale est aujourd''hui un levier incontournable pour développer votre visibilité, engager votre communauté et générer des leads qualifiés. Epitaphe 360 vous accompagne dans l''élaboration et l''exécution de votre stratégie digitale, en activant les bons canaux avec des contenus pertinents et des formats adaptés à vos cibles. De la stratégie de réseaux sociaux aux campagnes e-mailing, en passant par le référencement et la publicité en ligne, notre équipe digitale pilote votre présence en ligne avec rigueur et créativité.',
   '[{"icon":"Check","title":"Stratégie et community management"},{"icon":"Check","title":"Campagnes e-mailing"},{"icon":"Check","title":"Publicité digitale (SEA, Social Ads)"},{"icon":"Check","title":"SEO et référencement naturel"},{"icon":"Check","title":"Création de contenu digital"},{"icon":"Check","title":"Analytics et reporting"}]',
   'PUBLISHED', 8),

  ('Développement de Sites Web', 'developpement-sites-web', 'communication-globale',
   'Votre présence web sur mesure',
   'https://epitaphe.ma/wp-content/uploads/2020/04/digital-1.jpg',
   'Un site web professionnel est aujourd''hui la première vitrine de votre entreprise. Epitaphe 360 conçoit et développe des sites web sur mesure, responsive et optimisés pour les moteurs de recherche, qui reflètent votre image et convertissent vos visiteurs en clients. De la stratégie éditoriale au design UX/UI, en passant par le développement et la maintenance, notre équipe tech prend en charge votre projet digital de A à Z. Sites vitrines, e-commerce, plateformes événementielles ou applications web, nous vous proposons des solutions adaptées à vos besoins et à votre budget.',
   '[{"icon":"Check","title":"Sites vitrines institutionnels"},{"icon":"Check","title":"Sites e-commerce"},{"icon":"Check","title":"Plateformes digitales événementielles"},{"icon":"Check","title":"Refonte et migration"},{"icon":"Check","title":"SEO et optimisation"},{"icon":"Check","title":"Maintenance et évolution"}]',
   'PUBLISHED', 9)

ON CONFLICT (slug) DO UPDATE SET
  title        = EXCLUDED.title,
  hub          = EXCLUDED.hub,
  accroche     = EXCLUDED.accroche,
  hero_image   = EXCLUDED.hero_image,
  body         = EXCLUDED.body,
  service_blocks = EXCLUDED.service_blocks,
  status       = EXCLUDED.status,
  updated_at   = NOW();

-- ============================================================
-- CATÉGORIE: contents
-- ============================================================
INSERT INTO services (title, slug, hub, accroche, hero_image, body, service_blocks, status, "order")
VALUES
  ('Rapport d''activité annuel', 'rapport-activite-annuel', 'contents',
   'Comment sortir des sentiers battus ?',
   'https://epitaphe.ma/wp-content/uploads/2020/04/communication-globale-1.jpg',
   'Comment réussir mon rapport d''activité annuelle ? N''est-ce pas la question que vous vous posez chaque année, que vous soyez une entreprise cotée en bourse, une association ou une fondation ? Votre rapport doit avant tout être Lisible, Professionnel et Percutant. Misez désormais sur le story-telling pour faire parler vos chiffres. Sortez des sentiers battus du format A4 et adoptez de nouveaux codes graphiques. Et surtout, soyez dans l''air du temps et passez du print classique au multicanal, en mettant le paquet sur le digital : Vidéo, UX et Réalité Augmentée… Notre équipe est passionnée par ces éditions complexes et exigeantes et nous avons une expérience éprouvée dans la réalisation de rapports d''activité de plusieurs organismes dans différents secteurs d''activité (Industrie, Finance, Assurance…).',
   '[{"icon":"Check","title":"Rédaction de contenus dynamiques"},{"icon":"Check","title":"Conception graphique originale"},{"icon":"Check","title":"Digitalisation du rapport d''activité annuel"},{"icon":"Check","title":"Flipbook interactif"},{"icon":"Check","title":"Animation Motion design des graphiques"},{"icon":"Check","title":"Réalité augmentée"}]',
   'PUBLISHED', 1)

ON CONFLICT (slug) DO UPDATE SET
  title        = EXCLUDED.title,
  hub          = EXCLUDED.hub,
  accroche     = EXCLUDED.accroche,
  hero_image   = EXCLUDED.hero_image,
  body         = EXCLUDED.body,
  service_blocks = EXCLUDED.service_blocks,
  status       = EXCLUDED.status,
  updated_at   = NOW();

-- ============================================================
-- CATÉGORIE: metiers
-- ============================================================
INSERT INTO services (title, slug, hub, accroche, hero_image, body, service_blocks, status, "order")
VALUES
  ('Communication corporate', 'communication-corporate', 'metiers',
   'Gagnez en positionnement !',
   'https://epitaphe.ma/wp-content/uploads/2020/05/bg-com-corporate.jpg',
   'Une communication corporate pertinente requiert une stratégie bien réfléchie et des actions structurées et percutantes. Confiez cette mission à une agence avec une expertise et une vision 360° qui vous permet de maîtriser votre communication corporate, en vous proposant des solutions globales, intégrées et modernes. De la rédaction de messages au design graphique et print petit et grand formats, de l''événementiel à la communication digitale, en passant par la communication interne ou financière… Epitaphe 360 vous accompagne dans l''élaboration et l''exécution d''actions pertinentes et homogènes qui répondent aux attentes de chacun de vos publics cibles.',
   '[{"icon":"Check","title":"Une maîtrise 360° des métiers du Marketing et de la Communication"},{"icon":"Check","title":"Une écoute active de vos besoins"},{"icon":"Check","title":"Des moyens pour optimiser vos budgets"},{"icon":"Check","title":"Des actions pour maximiser votre visibilité"},{"icon":"Check","title":"Des outils pour mesurer votre ROI"}]',
   'PUBLISHED', 1),

  ('Communication produits', 'communication-produits', 'metiers',
   'Gagnez des clients et... du temps en plus !',
   'https://epitaphe.ma/wp-content/uploads/2020/05/bg-com-produits.jpg',
   'Une bonne communication produits (ou services) peut vous aider à mettre en avant votre proposition de valeur et à vous distinguer de vos concurrents. Autrement dit, c''est elle qui peut rendre vos produits plus visibles, plus attractifs et plus « vendables ». Grâce à nos compétences 360°, nous vous proposons un interlocuteur unique pour trouver le bon mot et le bon format qui capteraient votre marché, et nous vous accompagnons dans l''élaboration et l''exécution d''actions ciblées (digital, événements, PLV…) pour positionner ou promouvoir vos produits et services et activer des leviers de vente adaptés à vos clients. Pour créer un sentiment de préférence à l''égard de vos produits et services, faites appel à Epitaphe 360.',
   '[{"icon":"Check","title":"Un accompagnement tout au long de la vie de votre produit"},{"icon":"Check","title":"Des actions complémentaires et homogènes pour plus d''impact"},{"icon":"Check","title":"Un seul interlocuteur pour plusieurs prestations"}]',
   'PUBLISHED', 2),

  ('Communication événementielle', 'communication-evenementielle', 'metiers',
   'Marquez les esprits !',
   'https://epitaphe.ma/wp-content/uploads/2020/05/bg-com-event.jpg',
   'La communication événementielle demeure parmi les techniques de communication à fort impact. Particulièrement si votre événement est intéressant, ciblé, maîtrisé et convenablement organisé. Conceptualisation, rédaction de contenu, création graphique, print, digitalisation, promotion, logistique et mise en place, coordination, suivi et évaluation, goodies… Notre agence de communication Epitaphe360 vous apporte une réelle valeur ajoutée en gérant votre événement de A à Z. Profitez de nos solutions complètes pour organiser, équiper ou aménager vos événements.',
   '[{"icon":"Check","title":"Des idées originales et des concepts d''événements attractifs"},{"icon":"Check","title":"Un seul interlocuteur pour la gestion de l''amont à l''aval de votre événement"},{"icon":"Check","title":"Conception des supports de communication (Back drop, photocall, Fonds de scènes, Roll-Up, print)"},{"icon":"Check","title":"Digitalisation des événements à la demande (Plate-forme d''inscription, d''enregistrement, de sondage)"}]',
   'PUBLISHED', 3),

  ('Communication financière', 'communication-financiere', 'metiers',
   'Gagnez de la notoriété !',
   'https://epitaphe.ma/wp-content/uploads/2020/05/photobas-comfi.jpg',
   'Annonce de résultats, rapports d''activité, Introduction en bourse…, la communication financière est importante pour mettre en avant vos résultats financiers, expliquer vos choix stratégiques, rassurer en période de crise ou attirer de nouveaux investisseurs. Pour toucher et convaincre les investisseurs, les actionnaires, les clients, les salariés et les fournisseurs…, il est indispensable d''être créatif. Notre agence de communication Epitaphe 360 vous accompagne dans toutes les étapes de votre communication financière : de la rédaction de contenus (rapports d''activité annuels, notes d''information…) à sa diffusion (interne et externe), en passant par le design graphique, le print, la digitalisation de vos supports de communication ou l''organisation d''événement. Faites-nous confiance pour optimiser votre temps et votre énergie et pour tisser une relation de confiance avec votre marché et toutes vos parties prenantes.',
   '[{"icon":"Check","title":"Un accompagnement de proximité pour définir vos messages, vos axes de communication et élaborer votre stratégie"},{"icon":"Check","title":"Des experts pour vous aider à écrire vos discours et vous coacher dans la prise de parole en public"},{"icon":"Check","title":"Un seul interlocuteur pour toutes vos actions de communication financière : rédaction, mise en page, impression, diffusion et e-mailing, animation de réseaux sociaux, achats d''espaces, événementiels et relations presse"}]',
   'PUBLISHED', 4),

  ('Communication interne', 'communication-interne', 'metiers',
   'Gagnez en cohésion d''équipe !',
   'https://epitaphe.ma/wp-content/uploads/2020/05/bg-com-interne.jpg',
   'La communication interne peut être un véritable atout pour l''information et la motivation de vos salariés, que vous soyez multinationale, administration publique, grande structure ou TPME. Ceci à condition qu''elle soit l''émanation d''une stratégie bien réfléchie et d''un plan structuré. Epitaphe 360 vous accompagne pas à pas aussi bien dans l''élaboration et l''impression de vos journaux et supports, que dans l''organisation de vos événements et la digitalisation de votre communication interne. Grâce à notre expertise, soyez sûrs de répondre professionnellement aux attentes de votre management et de vos salariés et surtout de développer une culture d''appartenance forte au sein de votre entreprise.',
   '[{"icon":"Check","title":"Un accompagnement dans toutes les étapes de réalisation de vos supports internes : de la réflexion à la diffusion en passant par l''édition"},{"icon":"Check","title":"Une équipe expérimentée à l''écoute de vos besoins : Rédacteurs, Infographistes, photographes, développeurs"},{"icon":"Check","title":"Un budget optimisé du fait que nous réalisons toutes les prestations en interne : rédaction, mise en page, développement et impression"},{"icon":"Check","title":"Des outils modernes pour digitaliser votre communication interne (Newsletter, plateforme collaborative)"}]',
   'PUBLISHED', 5)

ON CONFLICT (slug) DO UPDATE SET
  title        = EXCLUDED.title,
  hub          = EXCLUDED.hub,
  accroche     = EXCLUDED.accroche,
  hero_image   = EXCLUDED.hero_image,
  body         = EXCLUDED.body,
  service_blocks = EXCLUDED.service_blocks,
  status       = EXCLUDED.status,
  updated_at   = NOW();

-- ============================================================
-- Vérification finale
-- ============================================================
SELECT hub, slug, title, status, updated_at
FROM services
ORDER BY hub, "order";
