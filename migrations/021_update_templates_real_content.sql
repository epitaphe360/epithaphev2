-- ============================================================
-- 021 — Mise à jour des templates avec vrai contenu Leedo
--       Champs alignés sur puckConfig.tsx
-- ============================================================

-- Suppression des templates existants pour repartir proprement
DELETE FROM page_templates;

-- ============================================================
-- TEMPLATE 1 — Page d'accueil funéraire (type Portfolio Landing)
-- ============================================================
INSERT INTO page_templates (name, slug, description, category, sections, is_active)
VALUES (
  'Accueil Funéraire',
  'portfolio-landing',
  'Page d''accueil complète avec hero, présentation, services et témoignage',
  'leedo',
  '[
    {
      "id": "hero-1",
      "type": "hero",
      "enabled": true,
      "order": 0,
      "titleLine1": "Accompagnement",
      "titleLine2": "avec dignité",
      "subtitle": "Nous vous guidons avec respect et bienveillance dans chaque étape du deuil",
      "backgroundImage": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&h=700&q=80"
    },
    {
      "id": "intro-1",
      "type": "intro",
      "enabled": true,
      "order": 1,
      "eyebrow": "Qui sommes-nous",
      "title": "Une maison funéraire à votre écoute depuis 1985",
      "bodyHtml": "<p>Notre équipe vous accompagne avec <strong>discrétion, humanité et professionnalisme</strong> dans l''un des moments les plus difficiles de votre vie. Nous prenons en charge l''ensemble des démarches pour vous permettre de vivre pleinement votre deuil.</p>",
      "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&h=500&q=80"
    },
    {
      "id": "hub-cards-1",
      "type": "hub-cards",
      "enabled": true,
      "order": 2,
      "title": "Nos prestations",
      "subtitle": "Un accompagnement complet pour honorer votre proche",
      "items": [
        {
          "title": "Obsèques civiles",
          "description": "Organisation complète de la cérémonie selon vos souhaits et ceux du défunt",
          "href": "/services/obseques-civiles"
        },
        {
          "title": "Obsèques religieuses",
          "description": "Cérémonie respectueuse de toutes les traditions et confessions",
          "href": "/services/obseques-religieuses"
        },
        {
          "title": "Crémation",
          "description": "Prise en charge intégrale avec urne cinéraire au choix",
          "href": "/services/cremation"
        },
        {
          "title": "Rapatriement",
          "description": "Transport du défunt en France et à l''international",
          "href": "/services/rapatriement"
        },
        {
          "title": "Pompes funèbres",
          "description": "Cercueil, fleurs, faire-part et tous les articles funéraires",
          "href": "/services/pompes-funebres"
        },
        {
          "title": "Assistance administrative",
          "description": "Démarches auprès des organismes officiels et des assurances",
          "href": "/services/assistance-administrative"
        }
      ]
    },
    {
      "id": "image-text-1",
      "type": "image-text",
      "enabled": true,
      "order": 3,
      "title": "Un moment pour se souvenir",
      "body": "Nous créons des cérémonies personnalisées qui reflètent la vie unique de votre proche. Chaque détail est pensé pour que cet adieu soit à la hauteur de votre amour.\n\nNotre équipe est disponible 24h/24 et 7j/7 pour répondre à vos appels et vous recevoir dans notre espace d''accueil.",
      "image": "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&h=600&q=80",
      "imagePosition": "right"
    },
    {
      "id": "stats-1",
      "type": "stats",
      "enabled": true,
      "order": 4,
      "title": "",
      "items": [
        { "value": 38, "suffix": " ans", "label": "D''expérience" },
        { "value": 2500, "suffix": "+", "label": "Familles accompagnées" },
        { "value": 24, "suffix": "h/24", "label": "Disponibilité" },
        { "value": 100, "suffix": "%", "label": "Devis gratuit" }
      ]
    },
    {
      "id": "testimonial-1",
      "type": "testimonial",
      "enabled": true,
      "order": 5,
      "content": "L''équipe a été d''un professionnalisme et d''une douceur exemplaires. Ils ont tout géré avec une discrétion et une attention qui nous ont permis de vivre ce moment difficile avec beaucoup plus de sérénité.",
      "author": "Marie Lefebvre",
      "role": "Famille accompagnée en 2024",
      "company": ""
    },
    {
      "id": "cta-1",
      "type": "cta",
      "enabled": true,
      "order": 6,
      "title": "Nous sommes là pour vous",
      "body": "Contactez-nous à tout moment — notre équipe répond 24h/24, 7j/7"
    }
  ]',
  true
);

-- ============================================================
-- TEMPLATE 2 — Page services (type Service Showcase)
-- ============================================================
INSERT INTO page_templates (name, slug, description, category, sections, is_active)
VALUES (
  'Nos Services',
  'service-showcase',
  'Page services détaillée avec blocs, avantages et formulaire de contact',
  'leedo',
  '[
    {
      "id": "service-hero-1",
      "type": "service-hero",
      "enabled": true,
      "order": 0,
      "tag": "Nos prestations",
      "title": "Un service complet, adapté à vos besoins",
      "subtitle": "De l''organisation des obsèques à l''assistance administrative, nous gérons tout avec soin",
      "backgroundImage": "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1600&h=700&q=80"
    },
    {
      "id": "pitch-1",
      "type": "pitch",
      "enabled": true,
      "order": 1,
      "title": "Parce que chaque adieu mérite d''être unique",
      "body": "Chez Epitaphe 360, nous croyons que chaque cérémonie doit refléter la vie de la personne disparue. Nos conseillers funéraires travaillent avec vous pour créer un hommage personnalisé, empreint de respect et d''émotion."
    },
    {
      "id": "service-blocks-1",
      "type": "service-blocks",
      "enabled": true,
      "order": 2,
      "title": "Nos prestations en détail",
      "items": [
        {
          "title": "Organisation des obsèques",
          "description": "Prise en charge complète : déclaration de décès, choix du cercueil, fleurs, avis de décès, cortège funèbre"
        },
        {
          "title": "Cérémonie personnalisée",
          "description": "Musique, textes, photos — nous orchestrons chaque détail pour un hommage qui vous ressemble"
        },
        {
          "title": "Crémation & inhumation",
          "description": "Toutes les options disponibles : inhumation en pleine terre, caveau de famille, columbarium"
        },
        {
          "title": "Contrat obsèques",
          "description": "Planifiez vos funérailles de votre vivant pour soulager vos proches et maîtriser les coûts"
        }
      ]
    },
    {
      "id": "image-text-2",
      "type": "image-text",
      "enabled": true,
      "order": 3,
      "title": "Un espace d''accueil chaleureux",
      "body": "Notre salon funéraire a été conçu pour offrir un cadre serein et digne à vos recueillis. Espaces privatisés, chambre funéraire, salon de famille — tout est pensé pour votre confort dans ces moments difficiles.",
      "image": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&h=600&q=80",
      "imagePosition": "left"
    },
    {
      "id": "avantages-1",
      "type": "avantages",
      "enabled": true,
      "order": 4,
      "title": "Pourquoi nous faire confiance",
      "subtitle": "Notre engagement envers les familles depuis près de 40 ans",
      "items": [
        {
          "title": "Disponibilité totale",
          "desc": "Nos conseillers funéraires sont joignables à toute heure du jour et de la nuit, week-ends et jours fériés inclus"
        },
        {
          "title": "Transparence tarifaire",
          "desc": "Devis détaillé et gratuit, sans frais cachés. Nous respectons votre budget tout en garantissant la qualité"
        },
        {
          "title": "Équipe formée et certifiée",
          "desc": "Tous nos conseillers suivent une formation continue et sont titulaires du diplôme d''État de conseiller funéraire"
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
          "question": "Que faire en cas de décès à domicile ?",
          "answer": "Contactez-nous immédiatement. Nous intervenons dans les plus brefs délais pour le transport du défunt et nous occupons de toutes les démarches administratives (déclaration de décès, certificat médical, etc.)."
        },
        {
          "question": "Quel est le délai entre le décès et l''inhumation ?",
          "answer": "En France, l''inhumation ou la crémation doit avoir lieu dans les 6 jours ouvrables suivant le décès. Nous gérons tous les délais réglementaires pour vous."
        },
        {
          "question": "Peut-on organiser une cérémonie sans religion ?",
          "answer": "Absolument. Les obsèques civiles ou laïques sont de plus en plus choisies. Nous accompagnons toutes les familles, quelle que soit leur conviction ou leur tradition culturelle."
        },
        {
          "question": "Comment financer les obsèques ?",
          "answer": "Plusieurs options existent : contrat d''assurance obsèques, capital décès de la Sécurité Sociale, aide des pompes funèbres sociales. Nos conseillers vous guident vers la solution adaptée."
        }
      ]
    },
    {
      "id": "cta-2",
      "type": "cta",
      "enabled": true,
      "order": 6,
      "title": "Besoin d''un devis ou d''un conseil ?",
      "body": "Appelez-nous ou laissez-nous un message — nous vous répondons dans l''heure"
    }
  ]',
  true
);

-- ============================================================
-- TEMPLATE 3 — À propos / Notre histoire (type Agency About)
-- ============================================================
INSERT INTO page_templates (name, slug, description, category, sections, is_active)
VALUES (
  'À propos de nous',
  'agency-about',
  'Page de présentation de l''équipe, valeurs et histoire de la maison funéraire',
  'leedo',
  '[
    {
      "id": "hero-about-1",
      "type": "hero",
      "enabled": true,
      "order": 0,
      "titleLine1": "Notre histoire,",
      "titleLine2": "votre confiance",
      "subtitle": "Une famille au service des familles depuis 1985",
      "backgroundImage": "https://images.unsplash.com/photo-1465189684280-6a8fa9b19a7a?auto=format&fit=crop&w=1600&h=700&q=80"
    },
    {
      "id": "intro-about-1",
      "type": "intro",
      "enabled": true,
      "order": 1,
      "eyebrow": "Notre histoire",
      "title": "Fondée sur des valeurs humaines et familiales",
      "bodyHtml": "<p>Epitaphe 360 a été fondée en 1985 par la famille Durand, avec une conviction : <strong>accompagner les familles dans le deuil avec le même respect et la même attention qu''on aimerait recevoir soi-même.</strong></p><p>Aujourd''hui, notre équipe de 12 conseillers funéraires perpétue cette tradition d''excellence et d''humanité, à votre service dans chaque moment de besoin.</p>",
      "image": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&h=500&q=80"
    },
    {
      "id": "poles-1",
      "type": "poles",
      "enabled": true,
      "order": 2,
      "title": "Nos valeurs fondatrices",
      "subtitle": "Ce qui guide chacune de nos actions",
      "items": [
        {
          "num": "01",
          "title": "Humanité",
          "desc": "Chaque famille est unique. Nous adaptons notre accompagnement à vos besoins, votre culture et vos souhaits."
        },
        {
          "num": "02",
          "title": "Dignité",
          "desc": "Nous traitons chaque défunt avec le plus grand respect, garantissant une prise en charge digne et soignée."
        },
        {
          "num": "03",
          "title": "Transparence",
          "desc": "Pas de surprise : nos devis sont clairs, détaillés et sans frais cachés. Votre confiance est notre priorité."
        },
        {
          "num": "04",
          "title": "Disponibilité",
          "desc": "Le deuil ne s''arrête pas le soir ni le week-end. Nous sommes là pour vous 24h/24, 7j/7, 365 jours par an."
        }
      ]
    },
    {
      "id": "team-1",
      "type": "team",
      "enabled": true,
      "order": 3,
      "title": "Notre équipe",
      "subtitle": "Des professionnels formés, à l''écoute et bienveillants",
      "members": [
        { "name": "Jean-Pierre Durand", "role": "Directeur & Fondateur" },
        { "name": "Sophie Martin", "role": "Conseillère funéraire" },
        { "name": "Marc Leblanc", "role": "Maître de cérémonie" },
        { "name": "Isabelle Renard", "role": "Assistante administrative" }
      ]
    },
    {
      "id": "stats-about-1",
      "type": "stats",
      "enabled": true,
      "order": 4,
      "title": "",
      "items": [
        { "value": 1985, "suffix": "", "label": "Année de fondation" },
        { "value": 12, "suffix": "", "label": "Conseillers funéraires" },
        { "value": 3, "suffix": "", "label": "Agences" },
        { "value": 4.9, "suffix": "/5", "label": "Note famille" }
      ]
    },
    {
      "id": "image-text-about-1",
      "type": "image-text",
      "enabled": true,
      "order": 5,
      "title": "Un engagement territorial fort",
      "body": "Présents dans votre région depuis près de 40 ans, nous connaissons les traditions locales et les partenaires de confiance : prêtres, imams, rabbins, crématoriums, cimetières.\n\nNous sommes fiers de notre ancrage local et de la confiance que les familles nous accordent, souvent de génération en génération.",
      "image": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&h=600&q=80",
      "imagePosition": "right"
    },
    {
      "id": "contact-form-1",
      "type": "contact-form",
      "enabled": true,
      "order": 6,
      "heroTitle": "Prenons contact",
      "heroSubtitle": "Notre équipe vous répond dans les meilleurs délais"
    }
  ]',
  true
);
