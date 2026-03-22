-- ================================================================
-- MIGRATION 006 — Seed des pages de services (contenu hardcodé → BDD)
-- À exécuter dans : Supabase Dashboard → SQL Editor
-- ================================================================
-- Ce script insère les 11 pages de services dans la table `pages`
-- Le champ `sections` contient tout le contenu ServicePageData en JSON
-- template = 'SERVICE_PAGE'
-- Idempotent : ON CONFLICT (slug) DO UPDATE → relance sans risque
-- ================================================================

-- ----------------------------------------------------------------
-- 1. ÉVÉNEMENTS / Conventions & Kickoffs
-- ----------------------------------------------------------------
INSERT INTO pages (title, slug, template, status, published_at, meta_title, meta_description, sections)
VALUES (
  'Conventions & Kickoffs',
  'evenements/conventions-kickoffs',
  'SERVICE_PAGE',
  'PUBLISHED',
  NOW(),
  'Conventions & Kickoffs — Epitaphe 360',
  'Fédérez vos équipes autour de vos ambitions stratégiques. Conférences plénières, ateliers participatifs, team-building à fort impact.',
  $${
    "heroTitle": "Conventions & Kickoffs",
    "heroSubtitle": "Fédérez vos équipes autour de vos ambitions stratégiques et créez un élan collectif durable.",
    "heroTag": "Événements Internes",
    "heroImage": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80",
    "heroCta": { "label": "Obtenir une offre", "href": "/contact/brief" },
    "pitchTitle": "La convention, levier de performance collective",
    "pitchBody": "Un moment fort qui aligne toutes vos équipes sur une même vision. Epitaphe 360 transforme vos conventions en expériences immersives qui inspirent, motivent et engagent durablement vos collaborateurs.",
    "pitchStats": [
      { "value": "+200", "label": "Conventions organisées" },
      { "value": "5 000+", "label": "Participants en simultané" },
      { "value": "98%", "label": "Taux de satisfaction" },
      { "value": "72h", "label": "Délai de brief créatif" }
    ],
    "serviceBlocks": [
      {
        "icon": "Mic",
        "title": "Conférences plénières",
        "description": "Ambiance scénique professionnelle, régie son & lumière, diffusion live streaming pour vos équipes à distance.",
        "features": ["Scénographie LED", "Sonorisation & visuel HD", "Streaming simultané"]
      },
      {
        "icon": "Users",
        "title": "Ateliers participatifs",
        "description": "Sessions de co-construction, design thinking, hackathon interne pour stimuler l'intelligence collective.",
        "features": ["Facilitation experte", "Outils collaboratifs", "Synthèse livrée J+1"]
      },
      {
        "icon": "Monitor",
        "title": "Production AV",
        "description": "Captation, montage, habillage graphique de vos temps forts pour une diffusion interne ou externe.",
        "features": ["Captation multi-caméras", "Habillage motion design", "Durée 2–5 min"]
      },
      {
        "icon": "Music",
        "title": "Team-building & entertainment",
        "description": "Activités ludiques et fédératrices qui renforcent les liens entre collaborateurs.",
        "features": ["50+ activités disponibles", "Adapté à toutes tailles", "Indoor & outdoor"]
      }
    ],
    "fabriqueCta": {
      "title": "Des décors produits dans notre fabrique",
      "body": "Toutes nos structures, stands et éléments scénographiques sont fabriqués en interne dans notre atelier de 3 000 m². Qualité maîtrisée, délais raccourcis, coûts optimisés."
    },
    "references": [
      { "name": "OCP Group" },
      { "name": "Maroc Telecom" },
      { "name": "Attijariwafa Bank" },
      { "name": "BMCE Bank" },
      { "name": "Royal Air Maroc" },
      { "name": "Lydec" }
    ],
    "testimonials": [
      {
        "author": "Directeur Marketing",
        "company": "Groupe OCP",
        "content": "Epitaphe 360 a transformé notre convention annuelle en un moment de rassemblement exceptionnel. La scénographie, la logistique, tout était parfait.",
        "rating": 5
      }
    ],
    "ctaTitle": "Votre prochaine convention mérite le meilleur",
    "ctaBody": "Parlez-nous de votre projet et recevez une proposition créative personnalisée sous 48h.",
    "ctaLabel": "Déposer mon brief"
  }$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  template = EXCLUDED.template,
  status = EXCLUDED.status,
  meta_title = EXCLUDED.meta_title,
  meta_description = EXCLUDED.meta_description,
  sections = EXCLUDED.sections,
  updated_at = NOW();

-- ----------------------------------------------------------------
-- 2. ÉVÉNEMENTS / Soirées de Gala
-- ----------------------------------------------------------------
INSERT INTO pages (title, slug, template, status, published_at, meta_title, meta_description, sections)
VALUES (
  'Soirées de gala & événements prestige',
  'evenements/soirees-de-gala',
  'SERVICE_PAGE',
  'PUBLISHED',
  NOW(),
  'Soirées de Gala & Événements Prestige — Epitaphe 360',
  'Organisez des soirées d''exception qui célèbrent vos succès. Décors luxueux, scénographie sur mesure, hospitalité 3 étoiles.',
  $${
    "heroTitle": "Soirées de gala & événements prestige",
    "heroSubtitle": "Des moments d'exception qui célèbrent vos succès et marquent vos parties prenantes de façon inoubliable.",
    "heroTag": "Prestige & Excellence",
    "heroImage": "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1400&q=80",
    "heroCta": { "label": "Concevoir ma soirée", "href": "/contact/brief" },
    "pitchTitle": "L'événement comme signature de votre marque",
    "pitchBody": "Une soirée de gala réussie ne se résume pas à un dîner. C'est une expérience sensorielle totale qui véhicule vos valeurs et renforce votre image auprès de vos clients, partenaires et collaborateurs.",
    "pitchStats": [
      { "value": "+150", "label": "Galas organisés" },
      { "value": "50–2000", "label": "Invités par événement" },
      { "value": "100%", "label": "Sur mesure" },
      { "value": "3★", "label": "Niveau hospitalité minimum" }
    ],
    "serviceBlocks": [
      {
        "icon": "Star",
        "title": "Décors & scénographie",
        "description": "Concept artistique unique, mobilier premium, éclairage architectural, floral design et habillage de salle.",
        "features": ["Moodboard exclusif", "Fabrication en atelier", "Montage & démontage inclus"]
      },
      {
        "icon": "UtensilsCrossed",
        "title": "Gastronomie & boissons",
        "description": "Sélection des meilleurs traiteurs, cocktails créatifs et service hôtelier impeccable.",
        "features": ["Menus personnalisés", "Sommelier attitré", "Service aux tables"]
      },
      {
        "icon": "Music",
        "title": "Animation & artistes",
        "description": "Orchestre live, DJ set, spectacles, conférenciers motivationnels et maîtres de cérémonie.",
        "features": ["Booking artistes", "Animation sur mesure", "Régie technique"]
      },
      {
        "icon": "Camera",
        "title": "Photographie & vidéo",
        "description": "Captation professionnelle pour immortaliser votre soirée et valoriser votre communication.",
        "features": ["Photos retouchées J+2", "Clip aftermovie", "Diffusion réseaux sociaux"]
      }
    ],
    "fabriqueCta": {
      "title": "Décors fabriqués dans notre atelier",
      "body": "Podiums, totems lumineux, murs végétaux, structures architecturales éphémères — tout est créé dans notre fabrique à Casablanca pour une qualité irréprochable."
    },
    "references": [
      { "name": "Attijariwafa Bank" },
      { "name": "CIH Bank" },
      { "name": "Total Maroc" },
      { "name": "Holcim Maroc" }
    ],
    "testimonials": [
      {
        "author": "DRH",
        "company": "Attijariwafa Bank",
        "content": "La soirée de fin d'année organisée par Epitaphe 360 était d'une qualité exceptionnelle. Nos 800 collaborateurs en parlent encore.",
        "rating": 5
      }
    ],
    "ctaTitle": "Créons ensemble votre soirée de prestige",
    "ctaBody": "Chaque détail compte. Partagez votre vision et nous vous proposerons un concept créatif unique.",
    "ctaLabel": "Organiser ma soirée"
  }$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, template = EXCLUDED.template, status = EXCLUDED.status,
  meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description,
  sections = EXCLUDED.sections, updated_at = NOW();

-- ----------------------------------------------------------------
-- 3. ÉVÉNEMENTS / Roadshows
-- ----------------------------------------------------------------
INSERT INTO pages (title, slug, template, status, published_at, meta_title, meta_description, sections)
VALUES (
  'Roadshows & Tournées nationales',
  'evenements/roadshows',
  'SERVICE_PAGE',
  'PUBLISHED',
  NOW(),
  'Roadshows & Tournées Nationales — Epitaphe 360',
  'Portez votre message dans toutes les villes du Maroc. Logistique maîtrisée, impact uniforme sur chaque site, coordination complète.',
  $${
    "heroTitle": "Roadshows & Tournées nationales",
    "heroSubtitle": "Portez votre message dans toutes les villes avec une logistique maîtrisée et un impact uniforme sur chaque site.",
    "heroTag": "Multisite & Logistique",
    "heroImage": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1400&q=80",
    "heroCta": { "label": "Planifier mon roadshow", "href": "/contact/brief" },
    "pitchTitle": "Une présence cohérente dans tout le pays",
    "pitchBody": "Un roadshow réussi repose sur une préparation minutieuse et une exécution impeccable répliquée sur chaque site. Epitaphe 360 assure la même qualité du premier au dernier arrêt.",
    "pitchStats": [
      { "value": "50+", "label": "Tournées organisées" },
      { "value": "20+", "label": "Villes couvertes" },
      { "value": "100%", "label": "Cohérence de marque garantie" },
      { "value": "48h", "label": "Délai de montage/démontage" }
    ],
    "serviceBlocks": [
      {
        "icon": "Map",
        "title": "Planification itinéraire",
        "description": "Définition du circuit optimal, identification des sites, gestion des autorisations et permis.",
        "features": ["Route optimisée", "Permis locaux", "Planning JJ"]
      },
      {
        "icon": "Truck",
        "title": "Transport & logistique",
        "description": "Flotte de véhicules dédiée, suivi GPS en temps réel, équipes terrain mobilisées sur chaque ville.",
        "features": ["Poids lourds & utilitaires", "Tracking temps réel", "Stock sécurisé"]
      },
      {
        "icon": "Radio",
        "title": "Stands nomades",
        "description": "Structures légères, rapides à monter et démontage, identiques sur chaque ville pour une cohérence visuelle totale.",
        "features": ["Montage < 4h", "Modulable", "Marque unifiée"]
      },
      {
        "icon": "BarChart2",
        "title": "Reporting & mesure",
        "description": "Dashboard de suivi en temps réel, comptage visiteurs, rapports par ville et global.",
        "features": ["KPIs par site", "Photos & vidéos", "Rapport final"]
      }
    ],
    "fabriqueCta": {
      "title": "Stands fabriqués pour résister aux tournées",
      "body": "Nos ateliers conçoivent des structures légères, durables et pliables, spécialement pensées pour une utilisation intensive sur tournée."
    },
    "references": [
      { "name": "Maroc Telecom" },
      { "name": "Orange Maroc" },
      { "name": "Wafa Assurance" },
      { "name": "CIH Bank" }
    ],
    "ctaTitle": "Lancez votre prochaine tournée nationale",
    "ctaBody": "Envoyez-nous votre brief et recevez un plan opérationnel détaillé sous 72h.",
    "ctaLabel": "Planifier ma tournée"
  }$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, template = EXCLUDED.template, status = EXCLUDED.status,
  meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description,
  sections = EXCLUDED.sections, updated_at = NOW();

-- ----------------------------------------------------------------
-- 4. ÉVÉNEMENTS / Salons
-- ----------------------------------------------------------------
INSERT INTO pages (title, slug, template, status, published_at, meta_title, meta_description, sections)
VALUES (
  'Salons & Expositions professionnelles',
  'evenements/salons',
  'SERVICE_PAGE',
  'PUBLISHED',
  NOW(),
  'Salons & Expositions Professionnelles — Epitaphe 360',
  'Maximisez votre visibilité et générez des leads qualifiés lors des salons B2B. Stands sur mesure, signalétique, animation commerciale.',
  $${
    "heroTitle": "Salons & Expositions professionnelles",
    "heroSubtitle": "Maximisez votre visibilité et générez des leads qualifiés lors des salons B2B les plus importants.",
    "heroTag": "B2B & Networking",
    "heroImage": "https://images.unsplash.com/photo-1561489396-888724a1543d?w=1400&q=80",
    "heroCta": { "label": "Concevoir mon stand", "href": "/contact/brief" },
    "pitchTitle": "Votre stand, votre ambassade commerciale",
    "pitchBody": "Sur un salon professionnel, votre stand est le reflet de votre sérieux et de votre ambition. Epitaphe 360 conçoit des espaces qui captent l'attention, facilitent la conversation commerciale et génèrent des résultats mesurables.",
    "pitchStats": [
      { "value": "+300", "label": "Stands réalisés" },
      { "value": "9 m²–500 m²", "label": "Toutes dimensions" },
      { "value": "+2M", "label": "Visiteurs exposés" },
      { "value": "40+", "label": "Salons couverts / an" }
    ],
    "serviceBlocks": [
      {
        "icon": "Store",
        "title": "Stands modulables",
        "description": "Structures réutilisables et reconfigurables selon les dimensions de chaque salon, pour optimiser votre budget.",
        "features": ["Réutilisable 5+ fois", "Montage rapide", "Stockage inclus"]
      },
      {
        "icon": "Eye",
        "title": "Stands sur mesure",
        "description": "Design architectural unique, matériaux premium, expérience visiteur pensée pour maximiser l'engagement.",
        "features": ["Conception 3D", "Matériaux haut de gamme", "Expérience immersive"]
      },
      {
        "icon": "TrendingUp",
        "title": "Habillage & signalétique",
        "description": "Impression grand format, totems, kakemonos, roll-ups et toute la signalétique de guidage sur site.",
        "features": ["Grand format HD", "Pose sur site", "Retrait & stockage"]
      },
      {
        "icon": "Users",
        "title": "Animation & lead capture",
        "description": "Jeux concours, démonstrations produit, badges connectés et capture de leads intégrée au CRM.",
        "features": ["Badge scanning", "Intégration CRM", "Rapport visiteurs"]
      }
    ],
    "fabriqueCta": {
      "title": "Stands fabriqués dans notre atelier 3000 m²",
      "body": "Du mobilier en chêne massif aux structures métal brossé, chaque élément est conçu et construit dans nos ateliers pour une qualité de finition irréprochable."
    },
    "references": [
      { "name": "Hitex" },
      { "name": "SIHAM" },
      { "name": "Forum de l'Étudiant" },
      { "name": "Pollutec Maroc" }
    ],
    "ctaTitle": "Votre prochain salon, un succès commercial",
    "ctaBody": "Partagez votre prochain salon et nous vous proposerons un stand qui convertit.",
    "ctaLabel": "Concevoir mon stand"
  }$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, template = EXCLUDED.template, status = EXCLUDED.status,
  meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description,
  sections = EXCLUDED.sections, updated_at = NOW();

-- ----------------------------------------------------------------
-- 5. ARCHITECTURE DE MARQUE / Marque Employeur
-- ----------------------------------------------------------------
INSERT INTO pages (title, slug, template, status, published_at, meta_title, meta_description, sections)
VALUES (
  'Marque Employeur',
  'architecture-de-marque/marque-employeur',
  'SERVICE_PAGE',
  'PUBLISHED',
  NOW(),
  'Marque Employeur — Architecture de Marque | Epitaphe 360',
  'Positionnez votre entreprise comme l''employeur de référence. Stratégie, contenus, outils de recrutement et onboarding personnalisé.',
  $${
    "heroTitle": "Marque Employeur",
    "heroSubtitle": "Positionnez votre entreprise comme l'employeur de référence de votre secteur pour attirer et fidéliser les meilleurs talents.",
    "heroTag": "RH & Attractivité",
    "heroImage": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80",
    "heroCta": { "label": "Construire ma marque employeur", "href": "/contact/brief" },
    "pitchTitle": "73% des talents rejettent une offre à cause d'une image employeur floue",
    "pitchBody": "Votre marque employeur n'est pas un luxe — c'est un avantage concurrentiel stratégique. Nous vous aidons à définir, formaliser et déployer une identité employeur cohérente qui attire les profils dont vous avez besoin.",
    "pitchStats": [
      { "value": "73%", "label": "Des talents consultent votre image avant de postuler" },
      { "value": "2x", "label": "Plus de candidatures qualifiées avec une bonne marque employeur" },
      { "value": "28%", "label": "De turnover en moins selon Harvard" },
      { "value": "1 an+", "label": "D'accompagnement stratégique" }
    ],
    "serviceBlocks": [
      {
        "icon": "Briefcase",
        "title": "Diagnostic & stratégie",
        "description": "Audit de votre image employeur actuelle, benchmark concurrents, définition de votre EVP (Employee Value Proposition).",
        "features": ["Enquête interne", "Benchmark sectoriel", "EVP formalisée"]
      },
      {
        "icon": "Target",
        "title": "Identité visuelle RH",
        "description": "Charte graphique dédiée RH, gabarits de communication, templates LinkedIn et jobboards.",
        "features": ["Charte RH complète", "Templates adaptés", "Guide d'utilisation"]
      },
      {
        "icon": "Megaphone",
        "title": "Contenus & campagnes",
        "description": "Vidéos témoignages collaborateurs, reportages en immersion, campagnes recrutement sur mesure.",
        "features": ["Vidéos témoignages", "Campagnes LinkedIn", "Réseaux sociaux"]
      },
      {
        "icon": "Star",
        "title": "Espaces & scénographie RH",
        "description": "Mise en valeur de vos locaux pour les journées portes ouvertes, forums étudiants et événements recrutement.",
        "features": ["Habillage espace", "Décors événementiels", "Stands recrutement"]
      }
    ],
    "fabriqueCta": {
      "title": "Des supports RH fabriqués en interne",
      "body": "Roll-ups, backdrop, totems, bornes interactives — tous vos supports de recrutement sont produits dans notre fabrique pour une cohérence de marque parfaite."
    },
    "references": [
      { "name": "Maroc Telecom" },
      { "name": "BCP" },
      { "name": "OCP Group" },
      { "name": "Lydec" },
      { "name": "BMCE Bank" }
    ],
    "testimonials": [
      {
        "author": "Directrice RH",
        "company": "Groupe minier",
        "content": "Depuis la refonte de notre marque employeur avec Epitaphe 360, nos candidatures ont doublé en qualité. Notre image sur LinkedIn a totalement changé.",
        "rating": 5
      }
    ],
    "ctaTitle": "Devenez l'employeur que les talents s'arrachent",
    "ctaBody": "Dites-nous où vous en êtes et nous vous proposerons une feuille de route claire.",
    "ctaLabel": "Lancer mon projet"
  }$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, template = EXCLUDED.template, status = EXCLUDED.status,
  meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description,
  sections = EXCLUDED.sections, updated_at = NOW();

-- ----------------------------------------------------------------
-- 6. ARCHITECTURE DE MARQUE / Communication QHSE
-- ----------------------------------------------------------------
INSERT INTO pages (title, slug, template, status, published_at, meta_title, meta_description, sections)
VALUES (
  'Communication QHSE',
  'architecture-de-marque/communication-qhse',
  'SERVICE_PAGE',
  'PUBLISHED',
  NOW(),
  'Communication QHSE — Architecture de Marque | Epitaphe 360',
  'Transformez vos obligations sécurité en culture positive. Affichage réglementaire, procédures d''urgence, formation visuelle QHSE.',
  $${
    "heroTitle": "Communication QHSE",
    "heroSubtitle": "Transformez vos obligations de sécurité en une culture d'entreprise positive qui protège et engage vos équipes.",
    "heroTag": "Qualité · Hygiène · Sécurité · Environnement",
    "heroImage": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80",
    "heroCta": { "label": "Évaluer mon niveau QHSE", "href": "/outils/vigilance-score" },
    "pitchTitle": "La conformité QHSE sous-estimée peut coûter cher",
    "pitchBody": "Au-delà des obligations légales, une communication QHSE efficace réduit les accidents, améliore la motivation des équipes et renforce votre crédibilité auprès de vos clients et partenaires.",
    "pitchStats": [
      { "value": "60%", "label": "Des accidents évitables grâce à une bonne signalétique" },
      { "value": "Loi Sapin II", "label": "Outil aligné sur les exigences légales" },
      { "value": "RGAA 4.1", "label": "Accessibilité garantie" },
      { "value": "ISO 45001", "label": "Aligné sur les normes internationales" }
    ],
    "serviceBlocks": [
      {
        "icon": "ShieldCheck",
        "title": "Signalétique sécurité",
        "description": "Panneaux d'évacuation, zones de danger, consignes d'hygiène — tout votre système de signalétique réglementaire et esthétique.",
        "features": ["Conformité R418", "Matériaux durables", "Pose & installation"]
      },
      {
        "icon": "AlertTriangle",
        "title": "Affiches & supports visuels",
        "description": "Campagnes internes de sensibilisation, posters de sécurité, kakémonos et bâches pour vos espaces de travail.",
        "features": ["Design engageant", "Messages clairs", "Impression résistante"]
      },
      {
        "icon": "FileText",
        "title": "Livrets & guides QHSE",
        "description": "Édition de vos documents de sécurité : livret d'accueil, procedures, fiches réflexes, rapports d'audit illustrés.",
        "features": ["Mise en page pro", "Impression offset/numérique", "Version digitale"]
      },
      {
        "icon": "BarChart2",
        "title": "Outil Vigilance-Score",
        "description": "Évaluez votre niveau de conformité QHSE sur 5 dimensions clés et obtentez un rapport PDF personnalisé avec recommendations.",
        "features": ["Auto-diagnostic 5 min", "Score 0-100", "Rapport PDF offert"]
      }
    ],
    "fabriqueCta": {
      "title": "Signalétique produite dans notre atelier",
      "body": "Plaques gravées, enseignes lumineuses, panneaux acier ou PVC — toute votre signalétique QHSE est fabriquée en interne avec des matériaux certifiés."
    },
    "references": [
      { "name": "ONEE" },
      { "name": "Lafarge Maroc" },
      { "name": "STAM" },
      { "name": "Managem" }
    ],
    "testimonials": [
      {
        "author": "Responsable QHSE",
        "company": "Groupe industriel",
        "content": "La refonte de notre signalétique sécurité a réduit nos incidents de 40% en 6 mois. Epitaphe 360 a compris nos enjeux réglementaires dès le brief.",
        "rating": 5
      }
    ],
    "ctaTitle": "Votre conformité QHSE commence ici",
    "ctaBody": "Testez votre Vigilance-Score QHSE gratuitement ou demandez un audit de votre communication sécurité.",
    "ctaLabel": "Tester mon Vigilance-Score",
    "ctaHref": "/outils/vigilance-score"
  }$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, template = EXCLUDED.template, status = EXCLUDED.status,
  meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description,
  sections = EXCLUDED.sections, updated_at = NOW();

-- ----------------------------------------------------------------
-- 7. ARCHITECTURE DE MARQUE / Expérience Clients
-- ----------------------------------------------------------------
INSERT INTO pages (title, slug, template, status, published_at, meta_title, meta_description, sections)
VALUES (
  'Expérience Clients',
  'architecture-de-marque/experience-clients',
  'SERVICE_PAGE',
  'PUBLISHED',
  NOW(),
  'Expérience Clients — Architecture de Marque | Epitaphe 360',
  'Concevez chaque point de contact pour une expérience de marque cohérente et mémorable. Journey mapping, design sensoriel, digitalisation.',
  $${
    "heroTitle": "Expérience Clients",
    "heroSubtitle": "Concevez chaque point de contact pour délivrer une expérience de marque cohérente, mémorable et différenciante.",
    "heroTag": "CX & Brand Experience",
    "heroImage": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80",
    "heroCta": { "label": "Améliorer mon expérience client", "href": "/contact/brief" },
    "pitchTitle": "86% des clients paieraient plus pour une meilleure expérience",
    "pitchBody": "L'expérience client n'est plus un différenciateur — c'est une obligation. Epitaphe 360 vous aide à cartographier, concevoir et déployer chaque touchpoint pour créer une expérience cohérente qui fidélise et génère des recommandations.",
    "pitchStats": [
      { "value": "86%", "label": "Des clients prêts à payer plus pour une meilleure CX" },
      { "value": "5x", "label": "Plus rentable de fidéliser que d'acquérir" },
      { "value": "NPS+", "label": "Impact mesuré sur le Net Promoter Score" },
      { "value": "360°", "label": "Couverture de tous vos points de contact" }
    ],
    "serviceBlocks": [
      {
        "icon": "Map",
        "title": "Customer Journey Mapping",
        "description": "Modélisation de tous vos points de contact client, identification des friction points et opportunités d'amélioration.",
        "features": ["Ateliers discovery", "Cartographie visuelle", "Feuille de route priorisée"]
      },
      {
        "icon": "Store",
        "title": "Design d'espace client",
        "description": "Scénographie de vos agences, showrooms et espaces d'accueil pour une expérience immersive et mémorable.",
        "features": ["Concept store", "Mobilier sur mesure", "Signalétique intégrée"]
      },
      {
        "icon": "Users",
        "title": "Supports commerciaux",
        "description": "Catalogues, brochures, PLV et outils d'aide à la vente qui valorisent votre offre et facilitent la décision d'achat.",
        "features": ["Catalogue print & digital", "PLV conçue & produite", "Kit vendeurs"]
      },
      {
        "icon": "Smartphone",
        "title": "Activation digitale",
        "description": "QR codes intelligents, bornes interactives et expériences phygitales qui connectent vos espaces physiques au digital.",
        "features": ["QR codes trackés", "Bornes tactiles", "Analytics visiteurs"]
      }
    ],
    "fabriqueCta": {
      "title": "Votre espace client fabriqué sur mesure",
      "body": "Mobilier, comptoirs d'accueil, cloisons décoratives, totems interactifs — notre atelier conçoit et produit chaque élément de votre espace client."
    },
    "references": [
      { "name": "Maroc Telecom" },
      { "name": "Banque Populaire" },
      { "name": "Renault Maroc" },
      { "name": "BMCE Bank" },
      { "name": "Canal+" }
    ],
    "testimonials": [
      {
        "author": "Directeur Commercial",
        "company": "Groupe télécom",
        "content": "La refonte de nos points de vente avec Epitaphe 360 a augmenté notre NPS de 18 points. Chaque détail a été pensé pour notre client.",
        "rating": 5
      }
    ],
    "ctaTitle": "Placez le client au cœur de chaque décision",
    "ctaBody": "Parlez-nous de votre parcours client actuel et nous identifierons ensemble les leviers d'amélioration prioritaires.",
    "ctaLabel": "Analyser mon expérience client"
  }$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, template = EXCLUDED.template, status = EXCLUDED.status,
  meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description,
  sections = EXCLUDED.sections, updated_at = NOW();

-- ----------------------------------------------------------------
-- 8. LA FABRIQUE / Impression
-- ----------------------------------------------------------------
INSERT INTO pages (title, slug, template, status, published_at, meta_title, meta_description, sections)
VALUES (
  'Impression Grand Format',
  'la-fabrique/impression',
  'SERVICE_PAGE',
  'PUBLISHED',
  NOW(),
  'Impression Grand Format — La Fabrique | Epitaphe 360',
  'Bâches, adhésifs, kakemonos, toiles rétroéclairées. Impression haute définition 1440 dpi jusqu''à 5m de large, délai express 24h.',
  $${
    "heroTitle": "Impression Grand Format",
    "heroSubtitle": "Bâches, adhésifs, kakemonos, toiles rétroéclairées — une impression haute définition sur tous supports, dans tous les formats.",
    "heroTag": "Pôle Impression",
    "heroImage": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80",
    "heroCta": { "label": "Demander un devis", "href": "/contact/brief" },
    "pitchTitle": "Jusqu'à 5m de large, résolution 1440 dpi",
    "pitchBody": "Notre parc de machines d'impression grand format de dernière génération produit des visuels haute fidélité pour vos événements, vos campagnes publicitaires et votre signalétique.",
    "pitchStats": [
      { "value": "5m", "label": "Largeur maximale d'impression" },
      { "value": "1440 dpi", "label": "Résolution maximale" },
      { "value": "48h", "label": "Délai express" },
      { "value": "10+", "label": "Types de supports" }
    ],
    "serviceBlocks": [
      {
        "icon": "Printer",
        "title": "Bâches & banderoles",
        "description": "Bâches PVC frontlit/backlit, banderoles outdoor haute résistance UV, oriflammes et drapeaux.",
        "features": ["PVC 440g–550g", "Résistance UV 3-5 ans", "Œillets toutes les 50cm"]
      },
      {
        "icon": "Layers",
        "title": "Adhésifs & vinyls",
        "description": "Covering vitrine, adhésif repositionnable, stickers découpe, covering voitures et mobiliers.",
        "features": ["Repositionnable", "Anti-UV", "Prédécoupe à la forme"]
      },
      {
        "icon": "Image",
        "title": "Toiles & kakémonos",
        "description": "Toiles tendues, kakémonos enrouleurs, roll-ups, toiles photo pour décors intérieurs.",
        "features": ["Tissu polyester", "Enrouleur inclus", "Format : 0.6m × 2m → 2m × 4m"]
      },
      {
        "icon": "Zap",
        "title": "Impression express",
        "description": "Délai 24h–48h pour toutes vos urgences événementielles, avec livraison sur Casablanca.",
        "features": ["Livraison Casablanca", "Confirmation J-1", "Prix compétitif"]
      }
    ],
    "references": [
      { "name": "Maroc Telecom" },
      { "name": "Hitex Casablanca" },
      { "name": "CGEM" },
      { "name": "OCP Group" }
    ],
    "ctaTitle": "Un fichier prêt ? Envoyez-le nous",
    "ctaBody": "Format PDF haute résolution, EPS ou AI. Nous vérifions votre fichier et vous envoyons un BAT sous 4h.",
    "ctaLabel": "Demander un devis impression"
  }$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, template = EXCLUDED.template, status = EXCLUDED.status,
  meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description,
  sections = EXCLUDED.sections, updated_at = NOW();

-- ----------------------------------------------------------------
-- 9. LA FABRIQUE / Menuiserie
-- ----------------------------------------------------------------
INSERT INTO pages (title, slug, template, status, published_at, meta_title, meta_description, sections)
VALUES (
  'Menuiserie & Décor',
  'la-fabrique/menuiserie',
  'SERVICE_PAGE',
  'PUBLISHED',
  NOW(),
  'Menuiserie & Décor — La Fabrique | Epitaphe 360',
  'Stands sur mesure, mobilier d''ambiance, podiums et structures architecturales temporaires. Fabrication atelier propre, délai express.',
  $${
    "heroTitle": "Menuiserie & Décor",
    "heroSubtitle": "Stands sur mesure, mobilier d'ambiance, podiums et structures architecturales éphémères conçus et fabriqués dans notre atelier.",
    "heroTag": "Pôle Menuiserie",
    "heroImage": "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1400&q=80",
    "heroCta": { "label": "Commander une structure", "href": "/contact/brief" },
    "pitchTitle": "Du concept au chantier, tout sous le même toit",
    "pitchBody": "Nos menuisiers et décorateurs collaborent avec nos designers pour créer des structures qui allient esthétique, solidité et facilité de montage. Du croquis à la livraison, vous validez chaque étape.",
    "pitchStats": [
      { "value": "30+", "label": "Menuisiers & techniciens" },
      { "value": "CNC", "label": "Découpe numérique précision 0.1mm" },
      { "value": "72h", "label": "Délai mini pour structure légère" },
      { "value": "100%", "label": "Conçu & fabriqué à Casablanca" }
    ],
    "serviceBlocks": [
      {
        "icon": "Hammer",
        "title": "Stands événementiels",
        "description": "Stands modulables ou sur mesure pour salons, showrooms et espaces de démonstration.",
        "features": ["Plans 3D validés avec vous", "Montage & démontage inclus", "Stockage entre 2 événements"]
      },
      {
        "icon": "Package",
        "title": "Podiums & scènes",
        "description": "Podiums discours, scènes de spectacle, estrades et passerelles — tout conçu pour votre sécurité et votre image.",
        "features": ["Calcul de charge", "Habillage tissu ou bois", "Rampes d'accès"]
      },
      {
        "icon": "Sofa",
        "title": "Mobilier d'ambiance",
        "description": "Tables, comptoirs, présentoirs, îlots, bar d'accueil — tout le mobilier qui donne du caractère à votre espace.",
        "features": ["Design exclusif", "Finish laque ou bois", "Locations disponibles"]
      },
      {
        "icon": "Wrench",
        "title": "Décors & accessoires",
        "description": "Éléments décoratifs, cloisons graphiques, lettrages volumiques, enseignes et totems.",
        "features": ["Peinture & patines", "Dorure & chromage", "Néon LED"]
      }
    ],
    "references": [
      { "name": "OCP Group" },
      { "name": "Maroc Telecom" },
      { "name": "BCP" },
      { "name": "Huawei Maroc" }
    ],
    "ctaTitle": "Votre structure livrée clé en main",
    "ctaBody": "Partagez vos dimensions, votre identité et vos contraintes — nous fabriquons le reste.",
    "ctaLabel": "Demander un devis menuiserie"
  }$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, template = EXCLUDED.template, status = EXCLUDED.status,
  meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description,
  sections = EXCLUDED.sections, updated_at = NOW();

-- ----------------------------------------------------------------
-- 10. LA FABRIQUE / Signalétique
-- ----------------------------------------------------------------
INSERT INTO pages (title, slug, template, status, published_at, meta_title, meta_description, sections)
VALUES (
  'Signalétique professionnelle',
  'la-fabrique/signaletique',
  'SERVICE_PAGE',
  'PUBLISHED',
  NOW(),
  'Signalétique Professionnelle — La Fabrique | Epitaphe 360',
  'Totems lumineux, enseignes, wayfinding et signalétique directionnelle. Déployez votre identité de marque dans tous vos espaces.',
  $${
    "heroTitle": "Signalétique professionnelle",
    "heroSubtitle": "Totems lumineux, enseignes, wayfinding et signalétique directionnelle — votre identité déployée dans tous vos espaces.",
    "heroTag": "Pôle Signalétique",
    "heroImage": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80",
    "heroCta": { "label": "Étudier mon projet", "href": "/contact/brief" },
    "pitchTitle": "La signalétique, votre marque au quotidien",
    "pitchBody": "Vos collaborateurs, clients et visiteurs voient votre signalétique chaque jour. Elle doit être lisible, esthétique et cohérente avec votre identité. Epitaphe 360 conçoit et produit l'ensemble de votre système de signalétique.",
    "pitchStats": [
      { "value": "+500", "label": "Chantiers de signalétique réalisés" },
      { "value": "10 ans", "label": "Durée de vie garantie" },
      { "value": "IP65", "label": "Protection outdoor" },
      { "value": "LED", "label": "Éclairage basse consommation" }
    ],
    "serviceBlocks": [
      {
        "icon": "Signpost",
        "title": "Signalétique directionnelle",
        "description": "Panneaux fléchés, bornes de wayfinding, cartographie d'espaces et systèmes de guidage pour bâtiments et campus.",
        "features": ["Design système cohérent", "Pictogrammes inclus", "Multilingue possible"]
      },
      {
        "icon": "Lightbulb",
        "title": "Enseignes & totems",
        "description": "Enseignes lumineuses LED, totems double-face, caissons lumineux et lettres découpées en relief.",
        "features": ["Caissons aluminium", "LED longue durée 50 000h", "Dimmer programmable"]
      },
      {
        "icon": "Map",
        "title": "Plaques & mobilier",
        "description": "Plaques de porte, numérotations, plaques de salles de réunion, boîtes aux lettres et mobilier de hall.",
        "features": ["Acier inox brossé", "Aluminium anodisé", "Gravure laser"]
      },
      {
        "icon": "ShieldCheck",
        "title": "Signalétique QHSE",
        "description": "Signalétique de sécurité incendie, évacuation, EPI obligatoires et zones réglementées conformes aux normes.",
        "features": ["Conformité norme NF", "Photoluminescent", "Pose & installation"]
      }
    ],
    "references": [
      { "name": "CDG" },
      { "name": "ONCF" },
      { "name": "Lydec" },
      { "name": "STEF Maroc" }
    ],
    "ctaTitle": "Donnez une identité forte à tous vos espaces",
    "ctaBody": "Plan de votre bâtiment ou liste de besoins — nos consultants signalétique vous accompagnent.",
    "ctaLabel": "Demander un audit signalétique"
  }$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, template = EXCLUDED.template, status = EXCLUDED.status,
  meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description,
  sections = EXCLUDED.sections, updated_at = NOW();

-- ----------------------------------------------------------------
-- 11. LA FABRIQUE / Aménagement
-- ----------------------------------------------------------------
INSERT INTO pages (title, slug, template, status, published_at, meta_title, meta_description, sections)
VALUES (
  'Aménagement d''Espace',
  'la-fabrique/amenagement',
  'SERVICE_PAGE',
  'PUBLISHED',
  NOW(),
  'Aménagement d''Espace — La Fabrique | Epitaphe 360',
  'Scénographie événementielle, architecture éphémère et design d''intérieur. Transformez chaque espace en une expérience de marque.',
  $${
    "heroTitle": "Aménagement d'Espace",
    "heroSubtitle": "Scénographie événementielle, architecture éphémère et design d'intérieur — chaque espace devient une expérience.",
    "heroTag": "Pôle Aménagement",
    "heroImage": "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1400&q=80",
    "heroCta": { "label": "Déposer un projet", "href": "/contact/brief" },
    "pitchTitle": "Transformer n'importe quel espace en scène mémorable",
    "pitchBody": "D'un hall de conférence vide à un espace de marque immersif — nos scénographes et architectes d'intérieur conçoivent des expériences visuelles complètes, en pensant chaque détail d'ambiance.",
    "pitchStats": [
      { "value": "+200", "label": "Espaces aménagés" },
      { "value": "48h", "label": "Délai de montage record" },
      { "value": "360°", "label": "Couverture complète de l'espace" },
      { "value": "100%", "label": "Clé en main" }
    ],
    "serviceBlocks": [
      {
        "icon": "LayoutGrid",
        "title": "Scénographie événementielle",
        "description": "Concept artistique global, décors immersifs, installations lumineuses et structures éphémères pour vos événements.",
        "features": ["Moodboard exclusif", "Modélisation 3D", "Production & pose"]
      },
      {
        "icon": "Sofa",
        "title": "Design d'intérieur corporate",
        "description": "Espaces de travail, salles de réunion, réceptions et showrooms — une identité de marque cohérente dans chaque pièce.",
        "features": ["Plans d'aménagement", "Mobilier sur mesure", "Zoning & circulation"]
      },
      {
        "icon": "Lightbulb",
        "title": "Éclairage & ambiance",
        "description": "Scénographie lumineuse programmable, éclairage architectural, spots et guirlandes pour créer l'ambiance souhaitée.",
        "features": ["DMX & RGBW", "Gradateurs", "Programmation scènes"]
      },
      {
        "icon": "Ruler",
        "title": "Cloisons & séparations",
        "description": "Cloisons amovibles, verrières, box acoustiques et séparations décoratives pour structurer vos espaces.",
        "features": ["Acoustique renforcée", "Vitrage & tissu", "Démontage facile"]
      }
    ],
    "references": [
      { "name": "Maroc Telecom" },
      { "name": "Accor Maroc" },
      { "name": "OCP Group" },
      { "name": "CFC Casablanca Finance City" }
    ],
    "testimonials": [
      {
        "author": "Directeur Immobilier",
        "company": "Groupe financier",
        "content": "Notre nouveau siège a été aménagé par Epitaphe 360 — l'ensemble de nos collaborateurs s'y sentent fiers et motivés. L'espace respire notre identité.",
        "rating": 5
      }
    ],
    "ctaTitle": "Imaginez. Nous concrétisons.",
    "ctaBody": "Surface, budget, objectif — partagez votre projet et laissez notre équipe de scénographes l'imaginer.",
    "ctaLabel": "Lancer mon projet d'aménagement"
  }$$::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, template = EXCLUDED.template, status = EXCLUDED.status,
  meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description,
  sections = EXCLUDED.sections, updated_at = NOW();

-- ================================================================
-- Vérification
-- ================================================================
SELECT slug, title, template, status
FROM pages
WHERE template = 'SERVICE_PAGE'
ORDER BY slug;
