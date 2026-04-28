-- ============================================================
-- 022 — Templates événementiel — style Leedo (créatif, bold, coloré)
--       Champs alignés sur puckConfig.tsx
-- ============================================================

DELETE FROM page_templates;

-- ============================================================
-- TEMPLATE 1 — Landing Agence Événementielle  (style: agency bold)
-- ============================================================
INSERT INTO page_templates (name, slug, description, category, sections, is_active)
VALUES (
  'Landing Événementielle',
  'portfolio-landing',
  'Page d''accueil pour agence événementielle — hero bold, services, stats, témoignage',
  'leedo',
  '[
    {
      "id": "hero-1",
      "type": "hero",
      "enabled": true,
      "order": 0,
      "titleLine1": "we create",
      "titleLine2": "unforgettable events.",
      "subtitle": "Concerts, festivals, soirées privées, team building — nous donnons vie à chaque projet",
      "backgroundImage": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&h=700&q=80"
    },
    {
      "id": "clients-1",
      "type": "clients",
      "enabled": true,
      "order": 1,
      "title": "Ils nous font confiance"
    },
    {
      "id": "intro-1",
      "type": "intro",
      "enabled": true,
      "order": 2,
      "eyebrow": "Qui sommes-nous",
      "title": "Une agence créative au service de vos événements",
      "bodyHtml": "<p>Depuis 2012, nous concevons et produisons des événements <strong>mémorables</strong> pour des marques, des artistes et des entreprises. Notre équipe de passionnés maîtrise chaque détail — de la scénographie à la logistique, du son à la lumière.</p>",
      "image": "https://images.unsplash.com/photo-1540039155733-5bb30b4f94b5?auto=format&fit=crop&w=1200&h=500&q=80"
    },
    {
      "id": "hub-cards-1",
      "type": "hub-cards",
      "enabled": true,
      "order": 3,
      "title": "Nos expertises",
      "subtitle": "De l''idée à la réalité — nous gérons tout",
      "items": [
        {
          "title": "Concerts & Festivals",
          "description": "Production technique complète, booking artistes, gestion du public et sécurité",
          "href": "/services/concerts-festivals"
        },
        {
          "title": "Événements corporate",
          "description": "Séminaires, lancements de produits, galas, soirées d''entreprise clés en main",
          "href": "/services/corporate"
        },
        {
          "title": "Team Building",
          "description": "Activités créatives et cohésion d''équipe pour renforcer vos liens professionnels",
          "href": "/services/team-building"
        },
        {
          "title": "Mariages & Privés",
          "description": "Célébrations uniques et personnalisées pour les moments les plus précieux",
          "href": "/services/prive"
        },
        {
          "title": "Scénographie",
          "description": "Décors, éclairages, LED walls — nous transformons l''espace en expérience",
          "href": "/services/scenographie"
        },
        {
          "title": "Digital & Live",
          "description": "Streaming, événements hybrides et diffusion en direct pour tous vos formats",
          "href": "/services/digital-live"
        }
      ]
    },
    {
      "id": "image-text-1",
      "type": "image-text",
      "enabled": true,
      "order": 4,
      "title": "Des événements qui marquent les esprits",
      "body": "Notre approche : comprendre votre vision, challenger les idées, puis tout mettre en œuvre pour créer un moment unique. Du brief créatif à la nuit de l''événement, nous sommes à vos côtés.\n\n300+ événements produits. 0 compromis sur la qualité.",
      "image": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&h=600&q=80",
      "imagePosition": "right"
    },
    {
      "id": "stats-1",
      "type": "stats",
      "enabled": true,
      "order": 5,
      "title": "",
      "items": [
        { "value": 300, "suffix": "+", "label": "Événements produits" },
        { "value": 12, "suffix": " ans", "label": "D''expérience" },
        { "value": 50000, "suffix": "+", "label": "Participants" },
        { "value": 98, "suffix": "%", "label": "Clients satisfaits" }
      ]
    },
    {
      "id": "testimonial-1",
      "type": "testimonial",
      "enabled": true,
      "order": 6,
      "content": "Une équipe au top ! Ils ont transformé notre soirée annuelle en un véritable show. Organisation au millimètre, créativité hors du commun — on retravaillera avec eux les yeux fermés.",
      "author": "Camille Deschamps",
      "role": "Directrice Marketing",
      "company": "TechGroup SAS"
    },
    {
      "id": "cta-1",
      "type": "cta",
      "enabled": true,
      "order": 7,
      "title": "Votre prochain événement commence ici.",
      "body": "Parlez-nous de votre projet — devis gratuit sous 48h"
    }
  ]',
  true
);

-- ============================================================
-- TEMPLATE 2 — Page Concert / Festival  (style: music dark neon)
-- ============================================================
INSERT INTO page_templates (name, slug, description, category, sections, is_active)
VALUES (
  'Concert & Festival',
  'service-showcase',
  'Page dédiée à un concert ou festival — programmation, infos pratiques, billetterie',
  'leedo',
  '[
    {
      "id": "hero-festival-1",
      "type": "hero",
      "enabled": true,
      "order": 0,
      "titleLine1": "rise with",
      "titleLine2": "the rhythm.",
      "subtitle": "Festival Électro — 3 scènes, 20 artistes, 1 nuit inoubliable",
      "backgroundImage": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1600&h=700&q=80"
    },
    {
      "id": "pitch-1",
      "type": "pitch",
      "enabled": true,
      "order": 1,
      "title": "Samedi 14 Juin 2026 — Dès 20h00",
      "body": "Hangar 42, Paris 12e · Ouverture des portes à 20h · Fin prévue à 06h\nAccès PMR disponible · Vestiaire · Bar & Food trucks"
    },
    {
      "id": "service-blocks-1",
      "type": "service-blocks",
      "enabled": true,
      "order": 2,
      "title": "La programmation",
      "items": [
        {
          "title": "Scène Principale — 22h30",
          "description": "Headliner TBA · Set de 2h · Production visuelle full LED wall"
        },
        {
          "title": "Scène Techno — 23h00",
          "description": "Lineup souterrain : hard techno, industriel & rave culture"
        },
        {
          "title": "Scène Découverte — 20h00",
          "description": "Artistes émergents sélectionnés par notre équipe de booking"
        },
        {
          "title": "Espace Chill — Toute la nuit",
          "description": "Ambient, downtempo & DJ sets acoustiques pour reprendre votre souffle"
        }
      ]
    },
    {
      "id": "image-text-festival-1",
      "type": "image-text",
      "enabled": true,
      "order": 3,
      "title": "Une production technique sans compromis",
      "body": "Son Martin Audio, éclairages Clay Paky, LED walls 4K, systèmes de fumée et effets pyrotechniques.\n\nChaque scène est conçue pour offrir la meilleure expérience sonore et visuelle, quel que soit votre placement.",
      "image": "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&h=600&q=80",
      "imagePosition": "left"
    },
    {
      "id": "avantages-1",
      "type": "avantages",
      "enabled": true,
      "order": 4,
      "title": "Informations pratiques",
      "subtitle": "Tout ce que vous devez savoir avant de venir",
      "items": [
        {
          "title": "Billetterie",
          "desc": "Pass nuit dès 25€ · VIP 75€ (accès backstage + boisson) · Prévente en ligne, paiement CB ou PayPal"
        },
        {
          "title": "Accès & Transport",
          "desc": "Métro ligne 8 (Liberté) · Bus 29 & 86 · Parking gratuit à 300m · Covoiturage recommandé"
        },
        {
          "title": "Règlement intérieur",
          "desc": "Âge minimum 18 ans · Fouille à l''entrée · Objets interdits listés sur le site · Alcool interdit hors bar officiel"
        }
      ]
    },
    {
      "id": "faq-1",
      "type": "faq",
      "enabled": true,
      "order": 5,
      "title": "Questions fréquentes",
      "items": [
        {
          "question": "Peut-on entrer et sortir librement ?",
          "answer": "Oui, les sorties/entrées sont autorisées avec tampon main. Présentez votre billet à chaque re-entrée."
        },
        {
          "question": "Y a-t-il une politique de remboursement ?",
          "answer": "Les billets sont échangeables jusqu''à 72h avant l''événement. Pas de remboursement après cette date sauf annulation de l''événement."
        },
        {
          "question": "Puis-je venir avec un appareil photo professionnel ?",
          "answer": "Les appareils avec objectif détachable sont réservés aux accrédités presse. Smartphones et compacts autorisés."
        }
      ]
    },
    {
      "id": "cta-festival-1",
      "type": "cta",
      "enabled": true,
      "order": 6,
      "title": "Réservez vos billets maintenant.",
      "body": "Places limitées — prévente en ligne disponible jusqu''au 13 juin 2026"
    }
  ]',
  true
);

-- ============================================================
-- TEMPLATE 3 — Notre Agence / À propos  (style: digital agency)
-- ============================================================
INSERT INTO page_templates (name, slug, description, category, sections, is_active)
VALUES (
  'Notre Agence',
  'agency-about',
  'Page de présentation de l''agence — équipe, valeurs, processus créatif et références',
  'leedo',
  '[
    {
      "id": "hero-agency-1",
      "type": "hero",
      "enabled": true,
      "order": 0,
      "titleLine1": "we''re a creative",
      "titleLine2": "events team.",
      "subtitle": "Des idées folles, une exécution parfaite — c''est notre signature depuis 2012",
      "backgroundImage": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&h=700&q=80"
    },
    {
      "id": "intro-agency-1",
      "type": "intro",
      "enabled": true,
      "order": 1,
      "eyebrow": "Notre ADN",
      "title": "Fondée par des passionnés, pour des projets audacieux",
      "bodyHtml": "<p>Nous sommes une équipe de <strong>créatifs, producteurs et techniciens</strong> réunis par une même passion : créer des expériences qui transcendent l''ordinaire. Chaque événement est pour nous une nouvelle opportunité de repousser les limites.</p>",
      "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&h=500&q=80"
    },
    {
      "id": "poles-1",
      "type": "poles",
      "enabled": true,
      "order": 2,
      "title": "Notre approche créative",
      "subtitle": "4 étapes pour transformer votre vision en réalité",
      "items": [
        {
          "num": "01",
          "title": "Brief & Inspiration",
          "desc": "On écoute, on questionne, on explore. Votre brief devient le point de départ d''un univers créatif unique."
        },
        {
          "num": "02",
          "title": "Conception & Scénographie",
          "desc": "Moodboards, plans 3D, mood music — on construit l''expérience sur papier avant de la construire pour de vrai."
        },
        {
          "num": "03",
          "title": "Production & Coordination",
          "desc": "Rétroplanning béton, prestataires triés sur le volet, répétitions générales — rien n''est laissé au hasard."
        },
        {
          "num": "04",
          "title": "Jour J & Après",
          "desc": "Notre équipe est sur place du montage à la fin du démontage. Et on vous livre un bilan complet après l''événement."
        }
      ]
    },
    {
      "id": "team-1",
      "type": "team",
      "enabled": true,
      "order": 3,
      "title": "Notre équipe",
      "subtitle": "12 passionnés, 1 seul objectif : votre événement",
      "members": [
        { "name": "Lucas Fontaine", "role": "Directeur Créatif" },
        { "name": "Nina Peretti", "role": "Productrice d''événements" },
        { "name": "Antoine Vidal", "role": "Directeur Technique" },
        { "name": "Sara Morel", "role": "Chargée de Booking" }
      ]
    },
    {
      "id": "stats-agency-1",
      "type": "stats",
      "enabled": true,
      "order": 4,
      "title": "",
      "items": [
        { "value": 12, "suffix": " ans", "label": "D''expérience" },
        { "value": 300, "suffix": "+", "label": "Événements" },
        { "value": 85, "suffix": "", "label": "Clients fidèles" },
        { "value": 15, "suffix": "", "label": "Awards" }
      ]
    },
    {
      "id": "image-text-agency-1",
      "type": "image-text",
      "enabled": true,
      "order": 5,
      "title": "Un studio créatif, un plateau technique",
      "body": "Basés à Paris, nous disposons d''un studio de création de 400m² et d''un plateau technique avec tout le matériel événementiel en propre.\n\nPas de sous-traitance par défaut — notre équipe technique est internalisée pour une meilleure maîtrise des délais et de la qualité.",
      "image": "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=800&h=600&q=80",
      "imagePosition": "left"
    },
    {
      "id": "clients-1",
      "type": "clients",
      "enabled": true,
      "order": 6,
      "title": "Ils ont fait confiance à notre créativité"
    },
    {
      "id": "contact-form-1",
      "type": "contact-form",
      "enabled": true,
      "order": 7,
      "heroTitle": "Un projet en tête ?",
      "heroSubtitle": "Dites-nous tout — on adore les briefs impossibles"
    }
  ]',
  true
);
