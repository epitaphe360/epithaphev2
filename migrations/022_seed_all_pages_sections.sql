-- ============================================================
-- MIGRATION 022: Seed sections JSON pour toutes les pages CMS
-- Transforme toutes les pages en template SECTIONS piloté DB.
-- Chaque page reçoit un tableau de sections typées.
-- ============================================================

-- ── a-propos ─────────────────────────────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'a-propos',
  'À propos — Epitaphe 360',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "backgroundImage":"https://epitaphe.ma/wp-content/uploads/2020/05/home-epitaphe360.jpg",
     "title":"Inspirez. Connectez. — Marquez durablement.",
     "subtitle":"Agence de communication 360° — Casablanca, Maroc — depuis 2005"},
    {"id":"richtext1","type":"richtext","order":20,"enabled":true,
     "html":"<section class=\"max-w-4xl mx-auto\"><h2 class=\"text-2xl font-bold mb-4\">Notre mission</h2><p>Depuis 2005, Epitaphe 360 accompagne les organisations ambitieuses dans la structuration de leur communication. Nous croyons que la communication est le premier vecteur de croissance d'une entreprise — et que chaque prise de parole doit être pensée comme un investissement.</p><h2 class=\"text-2xl font-bold mt-10 mb-4\">Notre expertise</h2><p>Architecture de marque, événements d'entreprise, production & fabrique, communication interne & RSE — 5 pôles interconnectés pour une offre 360° unique au Maroc.</p></section>",
     "maxWidth":"lg"},
    {"id":"avantages","type":"avantages","order":30,"enabled":true,
     "title":"Pourquoi choisir Epitaphe 360 ?",
     "subtitle":"20 ans d'expérience au service de vos ambitions",
     "items":[
       {"title":"Architecture de Marque","desc":"Marque employeur, QHSE et expérience client cohérente."},
       {"title":"Événements Corporate","desc":"Conventions, galas, roadshows et salons B2B."},
       {"title":"La Fabrique","desc":"3 000 m² d'ateliers pour produire 100% en interne."},
       {"title":"Communication Interne","desc":"Engagement collaborateur et culture d'entreprise."},
       {"title":"RSE & Impact","desc":"Communication responsable et rapports d'impact."},
       {"title":"Outils Digitaux","desc":"CommPulse™, ImpactTrace™, Vigilance-Score™ propriétaires."}
     ]},
    {"id":"stats","type":"stats","order":40,"enabled":true,"items":[]},
    {"id":"cta","type":"cta","order":50,"enabled":true,
     "title":"Prêts à bâtir votre influence ?",
     "body":"Rencontrons-nous pour discuter de vos enjeux de communication.",
     "background":"primary",
     "primaryCta":{"label":"Déposer mon brief","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'À propos — Agence de Communication Epitaphe 360',
  'Agence de communication stratégique à Casablanca depuis 2005. Architecture de marque, événements, production, communication interne et RSE.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections        = EXCLUDED.sections,
  template        = EXCLUDED.template,
  content         = EXCLUDED.content,
  meta_title      = EXCLUDED.meta_title,
  meta_description= EXCLUDED.meta_description,
  updated_at      = NOW();

-- ── architecture-de-marque ────────────────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'architecture-de-marque',
  'Architecture de Marque',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "backgroundImage":"https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80",
     "title":"Architecture — de Marque",
     "subtitle":"Marque employeur, QHSE & expérience client"},
    {"id":"hubcards","type":"hub-cards","order":20,"enabled":true,
     "title":"Nos expertises",
     "subtitle":"Trois dimensions clés pour construire une marque forte et cohérente",
     "items":[
       {"title":"Marque Employeur","description":"Positionnez votre entreprise comme l'employeur que les talents s'arrachent. EVP, identité RH, campagnes recrutement.","href":"/architecture-de-marque/marque-employeur","features":["Diagnostic & stratégie","Identité visuelle RH","Campagnes recrutement"]},
       {"title":"Communication QHSE","description":"Transformez vos obligations de sécurité en culture d'entreprise positive. Signalétique réglementaire et outil Vigilance-Score™.","href":"/architecture-de-marque/communication-qhse","features":["Signalétique QHSE","Affichage réglementaire","Outil Vigilance-Score™"]},
       {"title":"Expérience Clients","description":"Concevez chaque point de contact pour une expérience mémorable. Journey mapping, design sensoriel, digitalisation.","href":"/architecture-de-marque/experience-clients","features":["Customer journey mapping","Design d'espace","Activation digitale"]}
     ]},
    {"id":"avantages","type":"avantages","order":30,"enabled":true,
     "title":"Pourquoi Epitaphe 360 ?",
     "subtitle":"5 raisons de nous confier votre architecture de marque",
     "items":[
       {"title":"Vision 360°","desc":"Chaque projet intègre toutes les dimensions de votre identité : RH, clients, partenaires et société."},
       {"title":"Fabrication interne","desc":"Signalétique, stands, mobilier — tout est produit dans nos 3 000 m² d'ateliers."},
       {"title":"Outils propriétaires","desc":"CommPulse™, Vigilance-Score™, ImpactTrace™ pour mesurer l'impact de vos actions."},
       {"title":"Expertise marché","desc":"20 ans aux côtés des plus grandes entreprises du Maroc."},
       {"title":"Accompagnement complet","desc":"Du brief à la livraison, un interlocuteur unique pour tous vos projets."}
     ]},
    {"id":"cta","type":"cta","order":40,"enabled":true,
     "title":"Construisez une architecture de marque cohérente",
     "body":"Parlez-nous de vos enjeux et nous vous proposerons une approche sur mesure.",
     "background":"primary",
     "primaryCta":{"label":"Demander un audit","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Architecture de Marque — Epitaphe 360',
  'Architecture de marque : marque employeur, QHSE et expérience client. Agence de communication à Casablanca.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── architecture-de-marque/marque-employeur ───────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'architecture-de-marque/marque-employeur',
  'Marque Employeur',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "tag":"RH & Attractivité",
     "backgroundImage":"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80",
     "title":"Marque Employeur",
     "subtitle":"Positionnez votre entreprise comme l'employeur que les talents s'arrachent.",
     "primaryCta":{"label":"Évaluer ma marque employeur","href":"/contact/brief"}},
    {"id":"pitch","type":"pitch","order":20,"enabled":true,
     "title":"73% des talents rejettent une offre d'emploi sans rechercher la marque employeur",
     "body":"Vos futurs collaborateurs vous jugent avant de postuler. Une marque employeur forte réduit votre coût de recrutement, améliore la qualité de vos candidatures et renforce l'engagement de vos équipes.",
     "stats":[
       {"value":"73%","label":"Des talents jugent l'employeur avant de postuler"},
       {"value":"2x","label":"Plus de candidatures qualifiées avec une forte marque employeur"},
       {"value":"28%","label":"De réduction du coût de recrutement"},
       {"value":"1 an+","label":"De fidélisation supplémentaire"}
     ]},
    {"id":"blocks","type":"service-blocks","order":30,"enabled":true,
     "title":"Nos prestations Marque Employeur",
     "items":[
       {"title":"Diagnostic & stratégie","description":"Audit de votre attractivité, analyse de vos concurrents et définition de votre EVP (Employee Value Proposition) différenciante.","features":["Audit marque employeur","Benchmark concurrentiels","Définition EVP"]},
       {"title":"Identité visuelle RH","description":"Charte graphique RH, templates de job offers, kit recrutement et supports d'onboarding cohérents avec votre identité.","features":["Charte graphique RH","Kit job offers","Livret d'accueil"]},
       {"title":"Contenus & campagnes","description":"Production de témoignages collaborateurs, vidéos de culture d'entreprise et campagnes de recrutement digitales.","features":["Vidéos témoignages","Posts LinkedIn","Campagnes ciblées"]},
       {"title":"Espaces & scénographie RH","description":"Aménagement de vos espaces d'entretien, salles de formation et zones onboarding aux couleurs de votre marque employeur.","features":["Espace recrutement","Salle onboarding","Signalétique RH"]}
     ]},
    {"id":"richtext","type":"richtext","order":40,"enabled":true,
     "html":"<div class=\"bg-primary/5 border border-primary/20 rounded-sm p-8 text-center\"><h3 class=\"text-xl font-bold mb-3\">Votre identité produite dans notre Fabrique</h3><p class=\"text-muted-foreground\">Impressions grand format, stands de recrutement, kakémonos et supports événementiels RH — tout est fabriqué en interne dans nos 3 000 m² d'ateliers.</p></div>",
     "maxWidth":"lg"},
    {"id":"refs","type":"references-strip","order":50,"enabled":true,
     "title":"Ils nous font confiance",
     "items":[{"name":"Maroc Telecom"},{"name":"BCP"},{"name":"OCP"},{"name":"Lydec"},{"name":"BMCE Bank"}]},
    {"id":"testimonial","type":"testimonial","order":60,"enabled":true,
     "author":"Directrice RH",
     "company":"Groupe minier",
     "content":"Grâce à la refonte de notre marque employeur avec Epitaphe 360, nous avons reçu 2x plus de candidatures qualifiées. Notre image d'employeur a radicalement changé.",
     "rating":5},
    {"id":"cta","type":"cta","order":70,"enabled":true,
     "title":"Devenez l'employeur que les talents s'arrachent",
     "body":"Audit gratuit de votre attractivité employeur en 48h.",
     "background":"primary",
     "primaryCta":{"label":"Évaluer ma marque employeur","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Marque Employeur — Architecture de Marque | Epitaphe 360',
  'Positionnez votre entreprise comme l''employeur que les talents s''arrachent. EVP, identité visuelle RH, campagnes recrutement.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── architecture-de-marque/communication-qhse ────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'architecture-de-marque/communication-qhse',
  'Communication QHSE',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "tag":"Qualité · Hygiène · Sécurité · Environnement",
     "backgroundImage":"https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80",
     "title":"Communication QHSE",
     "subtitle":"Transformez vos obligations de sécurité en une culture d'entreprise positive qui protège et engage vos équipes.",
     "primaryCta":{"label":"Évaluer mon niveau QHSE","href":"/outils/vigilance-score"}},
    {"id":"pitch","type":"pitch","order":20,"enabled":true,
     "title":"La conformité QHSE sous-estimée peut coûter cher",
     "body":"Au-delà des obligations légales, une communication QHSE efficace réduit les accidents, améliore la motivation des équipes et renforce votre crédibilité auprès de vos clients et partenaires.",
     "stats":[
       {"value":"60%","label":"Des accidents évitables grâce à une bonne signalétique"},
       {"value":"Loi Sapin II","label":"Outil aligné sur les exigences légales"},
       {"value":"RGAA 4.1","label":"Accessibilité garantie"},
       {"value":"ISO 45001","label":"Aligné sur les normes internationales"}
     ]},
    {"id":"blocks","type":"service-blocks","order":30,"enabled":true,
     "items":[
       {"title":"Signalétique sécurité","description":"Panneaux d'évacuation, zones de danger, consignes d'hygiène — tout votre système de signalétique réglementaire et esthétique.","features":["Conformité R418","Matériaux durables","Pose & installation"]},
       {"title":"Affiches & supports visuels","description":"Campagnes internes de sensibilisation, posters de sécurité, kakémonos et bâches pour vos espaces de travail.","features":["Design engageant","Messages clairs","Impression résistante"]},
       {"title":"Livrets & guides QHSE","description":"Édition de vos documents de sécurité : livret d'accueil, procédures, fiches réflexes, rapports d'audit illustrés.","features":["Mise en page pro","Impression offset/numérique","Version digitale"]},
       {"title":"Outil Vigilance-Score™","description":"Évaluez votre niveau de conformité QHSE sur 5 dimensions clés et obtenez un rapport PDF personnalisé avec recommandations.","features":["Auto-diagnostic 5 min","Score 0-100","Rapport PDF offert"]}
     ]},
    {"id":"refs","type":"references-strip","order":40,"enabled":true,
     "title":"Références QHSE",
     "items":[{"name":"ONEE"},{"name":"Lafarge Maroc"},{"name":"STAM"},{"name":"Managem"}]},
    {"id":"testimonial","type":"testimonial","order":50,"enabled":true,
     "author":"Responsable QHSE",
     "company":"Groupe industriel",
     "content":"La refonte de notre signalétique sécurité a réduit nos incidents de 40% en 6 mois. Epitaphe 360 a compris nos enjeux réglementaires dès le brief.",
     "rating":5},
    {"id":"cta","type":"cta","order":60,"enabled":true,
     "title":"Votre conformité QHSE commence ici",
     "body":"Testez votre Vigilance-Score QHSE gratuitement ou demandez un audit de votre communication sécurité.",
     "background":"primary",
     "primaryCta":{"label":"Tester mon Vigilance-Score","href":"/outils/vigilance-score"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Communication QHSE — Architecture de Marque | Epitaphe 360',
  'Transformez vos obligations sécurité en culture positive. Affichage réglementaire, procédures d''urgence, formation visuelle QHSE.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── architecture-de-marque/experience-clients ─────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'architecture-de-marque/experience-clients',
  'Expérience Clients',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "tag":"CX & Brand Experience",
     "backgroundImage":"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80",
     "title":"Expérience Clients",
     "subtitle":"Concevez chaque point de contact pour délivrer une expérience de marque cohérente, mémorable et différenciante.",
     "primaryCta":{"label":"Améliorer mon expérience client","href":"/contact/brief"}},
    {"id":"pitch","type":"pitch","order":20,"enabled":true,
     "title":"86% des clients paieraient plus pour une meilleure expérience",
     "body":"L'expérience client n'est plus un différenciateur — c'est une obligation. Epitaphe 360 vous aide à cartographier, concevoir et déployer chaque touchpoint pour créer une expérience cohérente qui fidélise et génère des recommandations.",
     "stats":[
       {"value":"86%","label":"Des clients prêts à payer plus pour une meilleure CX"},
       {"value":"5x","label":"Plus rentable de fidéliser que d'acquérir"},
       {"value":"NPS+","label":"Impact mesuré sur le Net Promoter Score"},
       {"value":"360°","label":"Couverture de tous vos points de contact"}
     ]},
    {"id":"blocks","type":"service-blocks","order":30,"enabled":true,
     "items":[
       {"title":"Customer Journey Mapping","description":"Modélisation de tous vos points de contact client, identification des friction points et opportunités d'amélioration.","features":["Ateliers discovery","Cartographie visuelle","Feuille de route priorisée"]},
       {"title":"Design d'espace client","description":"Scénographie de vos agences, showrooms et espaces d'accueil pour une expérience immersive et mémorable.","features":["Concept store","Mobilier sur mesure","Signalétique intégrée"]},
       {"title":"Supports commerciaux","description":"Catalogues, brochures, PLV et outils d'aide à la vente qui valorisent votre offre et facilitent la décision d'achat.","features":["Catalogue print & digital","PLV conçue & produite","Kit vendeurs"]},
       {"title":"Activation digitale","description":"QR codes intelligents, bornes interactives et expériences phygitales qui connectent vos espaces physiques au digital.","features":["QR codes trackés","Bornes tactiles","Analytics visiteurs"]}
     ]},
    {"id":"refs","type":"references-strip","order":40,"enabled":true,
     "title":"Ils nous ont fait confiance",
     "items":[{"name":"Maroc Telecom"},{"name":"Banque Populaire"},{"name":"Renault Maroc"},{"name":"BMCE Bank"},{"name":"Canal+"}]},
    {"id":"testimonial","type":"testimonial","order":50,"enabled":true,
     "author":"Directeur Commercial",
     "company":"Groupe télécom",
     "content":"La refonte de nos points de vente avec Epitaphe 360 a augmenté notre NPS de 18 points. Chaque détail a été pensé pour notre client.",
     "rating":5},
    {"id":"cta","type":"cta","order":60,"enabled":true,
     "title":"Placez le client au cœur de chaque décision",
     "body":"Parlez-nous de votre parcours client actuel et nous identifierons ensemble les leviers d'amélioration prioritaires.",
     "background":"primary",
     "primaryCta":{"label":"Analyser mon expérience client","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Expérience Clients — Architecture de Marque | Epitaphe 360',
  'Concevez chaque point de contact pour une expérience de marque cohérente et mémorable. Journey mapping, design sensoriel, digitalisation.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── evenements ────────────────────────────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'evenements',
  'Événements Corporate',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "backgroundImage":"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80",
     "title":"Événements qui marquent les esprits",
     "subtitle":"Conventions, galas, roadshows et salons — de A à Z"},
    {"id":"hubcards","type":"hub-cards","order":20,"enabled":true,
     "title":"Nos expertises événementielles",
     "items":[
       {"title":"Conventions & Kickoffs","description":"Fédérez vos équipes autour de vos ambitions stratégiques. Conférences plénières, ateliers participatifs, team-building à fort impact.","href":"/evenements/conventions-kickoffs","image":"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80","features":["Scénographie immersive","Production audiovisuelle live","Animation & facilitation"]},
       {"title":"Soirées de gala","description":"Des moments d'exception qui célèbrent vos succès et renforcent vos liens avec vos parties prenantes.","href":"/evenements/soirees-de-gala","image":"https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&q=80","features":["Décors sur mesure","Traiteur premium","Entertainment exclusif"]},
       {"title":"Roadshows & Tournées","description":"Portez votre message dans toutes les villes du Maroc et au-delà avec une logistique parfaitement maîtrisée.","href":"/evenements/roadshows","image":"https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80","features":["Logistique multisite","Stands nomades","Coordination terrain"]},
       {"title":"Salons & Expositions","description":"Maximisez votre visibilité et générez des leads qualifiés sur les salons professionnels B2B.","href":"/evenements/salons","image":"https://images.unsplash.com/photo-1561489396-888724a1543d?w=600&q=80","features":["Stands modulables","Habillage 360°","Animations interactives"]}
     ]},
    {"id":"stats","type":"stats","order":30,"enabled":true,"items":[]},
    {"id":"cta","type":"cta","order":40,"enabled":true,
     "title":"Prêt à créer un événement mémorable ?",
     "body":"Parlez-nous de votre projet et recevez une proposition créative sous 48h.",
     "background":"primary",
     "primaryCta":{"label":"Déposer mon brief","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Événements Corporate — Conventions, Galas & Salons | Epitaphe 360',
  'Spécialiste des événements d''entreprise au Maroc : conventions, soirées de gala, roadshows et salons professionnels.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── evenements/conventions-kickoffs ──────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'evenements/conventions-kickoffs',
  'Conventions & Kickoffs',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "tag":"Événements Internes",
     "backgroundImage":"https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=80",
     "title":"Conventions & Kickoffs",
     "subtitle":"Fédérez vos équipes autour de vos ambitions stratégiques et créez un élan collectif durable.",
     "primaryCta":{"label":"Obtenir une offre","href":"/contact/brief"}},
    {"id":"pitch","type":"pitch","order":20,"enabled":true,
     "title":"La convention, levier de performance collective",
     "body":"Un moment fort qui aligne toutes vos équipes sur une même vision. Epitaphe 360 transforme vos conventions en expériences immersives qui inspirent, motivent et engagent durablement vos collaborateurs.",
     "stats":[
       {"value":"+200","label":"Conventions organisées"},
       {"value":"5 000+","label":"Participants en simultané"},
       {"value":"98%","label":"Taux de satisfaction"},
       {"value":"72h","label":"Délai de brief créatif"}
     ]},
    {"id":"blocks","type":"service-blocks","order":30,"enabled":true,
     "items":[
       {"title":"Conférences plénières","description":"Ambiance scénique professionnelle, régie son & lumière, diffusion live streaming pour vos équipes à distance.","features":["Scénographie LED","Sonorisation & visuel HD","Streaming simultané"]},
       {"title":"Ateliers participatifs","description":"Sessions de co-construction, design thinking, hackathon interne pour stimuler l'intelligence collective.","features":["Facilitation experte","Outils collaboratifs","Synthèse livrée J+1"]},
       {"title":"Production AV","description":"Captation, montage, habillage graphique de vos temps forts pour une diffusion interne ou externe.","features":["Captation multi-caméras","Habillage motion design","Durée 2–5 min"]},
       {"title":"Team-building & entertainment","description":"Activités ludiques et fédératrices qui renforcent les liens entre collaborateurs.","features":["50+ activités disponibles","Adapté à toutes tailles","Indoor & outdoor"]}
     ]},
    {"id":"refs","type":"references-strip","order":40,"enabled":true,
     "title":"Ils nous font confiance",
     "items":[{"name":"OCP Group"},{"name":"Maroc Telecom"},{"name":"Attijariwafa Bank"},{"name":"BMCE Bank"},{"name":"Royal Air Maroc"},{"name":"Lydec"}]},
    {"id":"testimonial","type":"testimonial","order":50,"enabled":true,
     "author":"Directeur Marketing",
     "company":"Groupe OCP",
     "content":"Epitaphe 360 a transformé notre convention annuelle en un moment de rassemblement exceptionnel. La scénographie, la logistique, tout était parfait.",
     "rating":5},
    {"id":"cta","type":"cta","order":60,"enabled":true,
     "title":"Votre prochaine convention mérite le meilleur",
     "body":"Parlez-nous de votre projet et recevez une proposition créative personnalisée sous 48h.",
     "background":"primary",
     "primaryCta":{"label":"Déposer mon brief","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Conventions & Kickoffs — Epitaphe 360',
  'Fédérez vos équipes autour de vos ambitions stratégiques. Conférences plénières, ateliers participatifs, team-building à fort impact.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── evenements/soirees-de-gala ────────────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'evenements/soirees-de-gala',
  'Soirées de Gala & Événements Prestige',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "tag":"Prestige & Excellence",
     "backgroundImage":"https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1400&q=80",
     "title":"Soirées de gala & événements prestige",
     "subtitle":"Des moments d'exception qui célèbrent vos succès et marquent vos parties prenantes de façon inoubliable.",
     "primaryCta":{"label":"Concevoir ma soirée","href":"/contact/brief"}},
    {"id":"pitch","type":"pitch","order":20,"enabled":true,
     "title":"L'événement comme signature de votre marque",
     "body":"Une soirée de gala réussie ne se résume pas à un dîner. C'est une expérience sensorielle totale qui véhicule vos valeurs et renforce votre image auprès de vos clients, partenaires et collaborateurs.",
     "stats":[
       {"value":"+150","label":"Galas organisés"},
       {"value":"50–2000","label":"Invités par événement"},
       {"value":"100%","label":"Sur mesure"},
       {"value":"3★","label":"Niveau hospitalité minimum"}
     ]},
    {"id":"blocks","type":"service-blocks","order":30,"enabled":true,
     "items":[
       {"title":"Décors & scénographie","description":"Concept artistique unique, mobilier premium, éclairage architectural, floral design et habillage de salle.","features":["Moodboard exclusif","Fabrication en atelier","Montage & démontage inclus"]},
       {"title":"Gastronomie & boissons","description":"Sélection des meilleurs traiteurs, cocktails créatifs et service hôtelier impeccable.","features":["Menus personnalisés","Sommelier attitré","Service aux tables"]},
       {"title":"Animation & artistes","description":"Orchestre live, DJ set, spectacles, conférenciers motivationnels et maîtres de cérémonie.","features":["Booking artistes","Animation sur mesure","Régie technique"]},
       {"title":"Photographie & vidéo","description":"Captation professionnelle pour immortaliser votre soirée et valoriser votre communication.","features":["Photos retouchées J+2","Clip aftermovie","Diffusion réseaux sociaux"]}
     ]},
    {"id":"refs","type":"references-strip","order":40,"enabled":true,
     "title":"Ils nous font confiance",
     "items":[{"name":"Attijariwafa Bank"},{"name":"CIH Bank"},{"name":"Total Maroc"},{"name":"Holcim Maroc"}]},
    {"id":"testimonial","type":"testimonial","order":50,"enabled":true,
     "author":"DRH",
     "company":"Attijariwafa Bank",
     "content":"La soirée de fin d'année organisée par Epitaphe 360 était d'une qualité exceptionnelle. Nos 800 collaborateurs en parlent encore.",
     "rating":5},
    {"id":"cta","type":"cta","order":60,"enabled":true,
     "title":"Créons ensemble votre soirée de prestige",
     "body":"Chaque détail compte. Partagez votre vision et nous vous proposerons un concept créatif unique.",
     "background":"primary",
     "primaryCta":{"label":"Organiser ma soirée","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Soirées de Gala & Événements Prestige — Epitaphe 360',
  'Organisez des soirées d''exception qui célèbrent vos succès. Décors luxueux, scénographie sur mesure, hospitalité 3 étoiles.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── evenements/roadshows ──────────────────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'evenements/roadshows',
  'Roadshows & Tournées Nationales',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "tag":"Multisite & Logistique",
     "backgroundImage":"https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1400&q=80",
     "title":"Roadshows & Tournées nationales",
     "subtitle":"Portez votre message dans toutes les villes avec une logistique maîtrisée et un impact uniforme sur chaque site.",
     "primaryCta":{"label":"Planifier mon roadshow","href":"/contact/brief"}},
    {"id":"pitch","type":"pitch","order":20,"enabled":true,
     "title":"Une présence cohérente dans tout le pays",
     "body":"Un roadshow réussi repose sur une préparation minutieuse et une exécution impeccable répliquée sur chaque site. Epitaphe 360 assure la même qualité du premier au dernier arrêt.",
     "stats":[
       {"value":"50+","label":"Tournées organisées"},
       {"value":"20+","label":"Villes couvertes"},
       {"value":"100%","label":"Cohérence de marque garantie"},
       {"value":"48h","label":"Délai de montage/démontage"}
     ]},
    {"id":"blocks","type":"service-blocks","order":30,"enabled":true,
     "items":[
       {"title":"Planification itinéraire","description":"Définition du circuit optimal, identification des sites, gestion des autorisations et permis.","features":["Route optimisée","Permis locaux","Planning JJ"]},
       {"title":"Transport & logistique","description":"Flotte de véhicules dédiée, suivi GPS en temps réel, équipes terrain mobilisées sur chaque ville.","features":["Poids lourds & utilitaires","Tracking temps réel","Stock sécurisé"]},
       {"title":"Stands nomades","description":"Structures légères, rapides à monter et démonter, identiques sur chaque ville pour une cohérence visuelle totale.","features":["Montage < 4h","Modulable","Marque unifiée"]},
       {"title":"Reporting & mesure","description":"Dashboard de suivi en temps réel, comptage visiteurs, rapports par ville et global.","features":["KPIs par site","Photos & vidéos","Rapport final"]}
     ]},
    {"id":"refs","type":"references-strip","order":40,"enabled":true,
     "title":"Ils nous font confiance",
     "items":[{"name":"Maroc Telecom"},{"name":"Orange Maroc"},{"name":"Wafa Assurance"},{"name":"CIH Bank"}]},
    {"id":"cta","type":"cta","order":50,"enabled":true,
     "title":"Lancez votre prochaine tournée nationale",
     "body":"Envoyez-nous votre brief et recevez un plan opérationnel détaillé sous 72h.",
     "background":"primary",
     "primaryCta":{"label":"Planifier ma tournée","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Roadshows & Tournées Nationales — Epitaphe 360',
  'Portez votre message dans toutes les villes du Maroc. Logistique maîtrisée, impact uniforme sur chaque site, coordination complète.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── evenements/salons ─────────────────────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'evenements/salons',
  'Salons & Expositions Professionnelles',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "tag":"B2B & Networking",
     "backgroundImage":"https://images.unsplash.com/photo-1561489396-888724a1543d?w=1400&q=80",
     "title":"Salons & Expositions professionnelles",
     "subtitle":"Maximisez votre visibilité et générez des leads qualifiés lors des salons B2B les plus importants.",
     "primaryCta":{"label":"Concevoir mon stand","href":"/contact/brief"}},
    {"id":"pitch","type":"pitch","order":20,"enabled":true,
     "title":"Votre stand, votre ambassade commerciale",
     "body":"Sur un salon professionnel, votre stand est le reflet de votre sérieux et de votre ambition. Epitaphe 360 conçoit des espaces qui captent l'attention, facilitent la conversation commerciale et génèrent des résultats mesurables.",
     "stats":[
       {"value":"+300","label":"Stands réalisés"},
       {"value":"9 m²–500 m²","label":"Toutes dimensions"},
       {"value":"+2M","label":"Visiteurs exposés"},
       {"value":"40+","label":"Salons couverts / an"}
     ]},
    {"id":"blocks","type":"service-blocks","order":30,"enabled":true,
     "items":[
       {"title":"Stands modulables","description":"Structures réutilisables et reconfigurables selon les dimensions de chaque salon, pour optimiser votre budget.","features":["Réutilisable 5+ fois","Montage rapide","Stockage inclus"]},
       {"title":"Stands sur mesure","description":"Design architectural unique, matériaux premium, expérience visiteur pensée pour maximiser l'engagement.","features":["Conception 3D","Matériaux haut de gamme","Expérience immersive"]},
       {"title":"Habillage & signalétique","description":"Impression grand format, totems, kakemonos, roll-ups et toute la signalétique de guidage sur site.","features":["Grand format HD","Pose sur site","Retrait & stockage"]},
       {"title":"Animation & lead capture","description":"Jeux concours, démonstrations produit, badges connectés et capture de leads intégrée au CRM.","features":["Badge scanning","Intégration CRM","Rapport visiteurs"]}
     ]},
    {"id":"refs","type":"references-strip","order":40,"enabled":true,
     "title":"Salons couverts",
     "items":[{"name":"Hitex"},{"name":"SIHAM"},{"name":"Forum de l'Étudiant"},{"name":"Pollutec Maroc"}]},
    {"id":"cta","type":"cta","order":50,"enabled":true,
     "title":"Votre prochain salon, un succès commercial",
     "body":"Partagez votre prochain salon et nous vous proposerons un stand qui convertit.",
     "background":"primary",
     "primaryCta":{"label":"Concevoir mon stand","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Salons & Expositions Professionnelles — Epitaphe 360',
  'Maximisez votre visibilité et générez des leads qualifiés lors des salons B2B. Stands sur mesure, signalétique, animation commerciale.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── la-fabrique ───────────────────────────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'la-fabrique',
  'La Fabrique — Production 360°',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "backgroundImage":"https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&q=80",
     "title":"La Fabrique — votre production",
     "subtitle":"3 000 m² d'ateliers spécialisés — 100% Made in Epitaphe"},
    {"id":"hubcards","type":"hub-cards","order":20,"enabled":true,
     "title":"Nos 4 pôles de production",
     "items":[
       {"title":"Impression Grand Format","description":"Bâches, adhésifs, toiles rétroéclairées, impressions haute définition pour tous supports.","href":"/la-fabrique/impression","image":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80","features":["Résolution 1440 dpi","Largeur max 5m","Finitions : œillets, ourlets, enrouleur"]},
       {"title":"Menuiserie & Décor","description":"Stands sur mesure, mobilier d'ambiance, structures d'exposition et éléments architecturaux.","href":"/la-fabrique/menuiserie","image":"https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80","features":["CNC & découpe laser","Bois & métal","Peinture & laque"]},
       {"title":"Signalétique","description":"Totems, enseignes lumineuses, wayfinding professionnel, plaques de bâtiment et signalétique directionnelle.","href":"/la-fabrique/signaletique","image":"https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80","features":["LED intégrée","Acier inox & aluminium","Résistant UV & intempéries"]},
       {"title":"Aménagement d'Espace","description":"Scénographie, architecture éphémère, cloisons décoratives et aménagement d'espaces événementiels.","href":"/la-fabrique/amenagement","image":"https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80","features":["Structures modulables","Éclairage intégré","Poses & dépose incluses"]}
     ]},
    {"id":"stats","type":"stats","order":30,"enabled":true,"items":[]},
    {"id":"cta","type":"cta","order":40,"enabled":true,
     "title":"Votre prochain projet de production commence ici",
     "body":"Fichiers prêts ou concept à développer — nous prenons tout en charge.",
     "background":"primary",
     "primaryCta":{"label":"Demander un devis","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'La Fabrique — Production 360° | Epitaphe 360',
  '3 000 m² d''ateliers à Casablanca : impression grand format, menuiserie, signalétique et aménagement d''espace. 100% Made in Epitaphe.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── la-fabrique/impression ────────────────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'la-fabrique/impression',
  'Impression Grand Format',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "tag":"Pôle Impression",
     "backgroundImage":"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80",
     "title":"Impression Grand Format",
     "subtitle":"Bâches, adhésifs, kakemonos, toiles rétroéclairées — une impression haute définition sur tous supports, dans tous les formats.",
     "primaryCta":{"label":"Demander un devis","href":"/contact/brief"}},
    {"id":"pitch","type":"pitch","order":20,"enabled":true,
     "title":"Jusqu'à 5m de large, résolution 1440 dpi",
     "body":"Notre parc de machines d'impression grand format de dernière génération produit des visuels haute fidélité pour vos événements, vos campagnes publicitaires et votre signalétique.",
     "stats":[
       {"value":"5m","label":"Largeur maximale d'impression"},
       {"value":"1440 dpi","label":"Résolution maximale"},
       {"value":"48h","label":"Délai express"},
       {"value":"10+","label":"Types de supports"}
     ]},
    {"id":"blocks","type":"service-blocks","order":30,"enabled":true,
     "items":[
       {"title":"Bâches & banderoles","description":"Bâches PVC frontlit/backlit, banderoles outdoor haute résistance UV, oriflammes et drapeaux.","features":["PVC 440g–550g","Résistance UV 3-5 ans","Œillets toutes les 50cm"]},
       {"title":"Adhésifs & vinyls","description":"Covering vitrine, adhésif repositionnable, stickers découpe, covering voitures et mobiliers.","features":["Repositionnable","Anti-UV","Prédécoupe à la forme"]},
       {"title":"Toiles & kakémonos","description":"Toiles tendues, kakémonos enrouleurs, roll-ups, toiles photo pour décors intérieurs.","features":["Tissu polyester","Enrouleur inclus","Format : 0.6m × 2m → 2m × 4m"]},
       {"title":"Impression express","description":"Délai 24h–48h pour toutes vos urgences événementielles, avec livraison sur Casablanca.","features":["Livraison Casablanca","Confirmation J-1","Prix compétitif"]}
     ]},
    {"id":"refs","type":"references-strip","order":40,"enabled":true,
     "title":"Ils nous font confiance",
     "items":[{"name":"Maroc Telecom"},{"name":"Hitex Casablanca"},{"name":"CGEM"},{"name":"OCP Group"}]},
    {"id":"cta","type":"cta","order":50,"enabled":true,
     "title":"Un fichier prêt ? Envoyez-le nous",
     "body":"Format PDF haute résolution, EPS ou AI. Nous vérifions votre fichier et vous envoyons un BAT sous 4h.",
     "background":"primary",
     "primaryCta":{"label":"Demander un devis impression","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Impression Grand Format — La Fabrique | Epitaphe 360',
  'Impression grand format à Casablanca. Bâches, adhésifs, kakemonos, roll-ups. Résolution 1440 dpi, largeur max 5m, délai express 48h.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── la-fabrique/menuiserie ────────────────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'la-fabrique/menuiserie',
  'Menuiserie & Décor',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "tag":"Pôle Menuiserie",
     "backgroundImage":"https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1400&q=80",
     "title":"Menuiserie & Décor",
     "subtitle":"Stands sur mesure, mobilier d'ambiance, podiums et structures architecturales éphémères conçus et fabriqués dans notre atelier.",
     "primaryCta":{"label":"Commander une structure","href":"/contact/brief"}},
    {"id":"pitch","type":"pitch","order":20,"enabled":true,
     "title":"Du concept au chantier, tout sous le même toit",
     "body":"Nos menuisiers et décorateurs collaborent avec nos designers pour créer des structures qui allient esthétique, solidité et facilité de montage. Du croquis à la livraison, vous validez chaque étape.",
     "stats":[
       {"value":"30+","label":"Menuisiers & techniciens"},
       {"value":"CNC","label":"Découpe numérique précision 0.1mm"},
       {"value":"72h","label":"Délai mini pour structure légère"},
       {"value":"100%","label":"Conçu & fabriqué à Casablanca"}
     ]},
    {"id":"blocks","type":"service-blocks","order":30,"enabled":true,
     "items":[
       {"title":"Stands événementiels","description":"Stands modulables ou sur mesure pour salons, showrooms et espaces de démonstration.","features":["Plans 3D validés avec vous","Montage & démontage inclus","Stockage entre 2 événements"]},
       {"title":"Podiums & scènes","description":"Podiums discours, scènes de spectacle, estrades et passerelles — tout conçu pour votre sécurité et votre image.","features":["Calcul de charge","Habillage tissu ou bois","Rampes d'accès"]},
       {"title":"Mobilier d'ambiance","description":"Tables, comptoirs, présentoirs, îlots, bar d'accueil — tout le mobilier qui donne du caractère à votre espace.","features":["Design exclusif","Finish laque ou bois","Locations disponibles"]},
       {"title":"Décors & accessoires","description":"Éléments décoratifs, cloisons graphiques, lettrages volumiques, enseignes et totems.","features":["Peinture & patines","Dorure & chromage","Néon LED"]}
     ]},
    {"id":"refs","type":"references-strip","order":40,"enabled":true,
     "title":"Ils nous font confiance",
     "items":[{"name":"OCP Group"},{"name":"Maroc Telecom"},{"name":"BCP"},{"name":"Huawei Maroc"}]},
    {"id":"cta","type":"cta","order":50,"enabled":true,
     "title":"Votre structure livrée clé en main",
     "body":"Partagez vos dimensions, votre identité et vos contraintes — nous fabriquons le reste.",
     "background":"primary",
     "primaryCta":{"label":"Demander un devis menuiserie","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Menuiserie & Décor — La Fabrique | Epitaphe 360',
  'Stands sur mesure, podiums, mobilier d''ambiance et structures architecturales éphémères. Atelier CNC à Casablanca.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── la-fabrique/signaletique ──────────────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'la-fabrique/signaletique',
  'Signalétique Professionnelle',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "tag":"Pôle Signalétique",
     "backgroundImage":"https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80",
     "title":"Signalétique professionnelle",
     "subtitle":"Totems lumineux, enseignes, wayfinding et signalétique directionnelle — votre identité déployée dans tous vos espaces.",
     "primaryCta":{"label":"Étudier mon projet","href":"/contact/brief"}},
    {"id":"pitch","type":"pitch","order":20,"enabled":true,
     "title":"La signalétique, votre marque au quotidien",
     "body":"Vos collaborateurs, clients et visiteurs voient votre signalétique chaque jour. Elle doit être lisible, esthétique et cohérente avec votre identité. Epitaphe 360 conçoit et produit l'ensemble de votre système de signalétique.",
     "stats":[
       {"value":"+500","label":"Chantiers de signalétique réalisés"},
       {"value":"10 ans","label":"Durée de vie garantie"},
       {"value":"IP65","label":"Protection outdoor"},
       {"value":"LED","label":"Éclairage basse consommation"}
     ]},
    {"id":"blocks","type":"service-blocks","order":30,"enabled":true,
     "items":[
       {"title":"Signalétique directionnelle","description":"Panneaux fléchés, bornes de wayfinding, cartographie d'espaces et systèmes de guidage pour bâtiments et campus.","features":["Design système cohérent","Pictogrammes inclus","Multilingue possible"]},
       {"title":"Enseignes & totems","description":"Enseignes lumineuses LED, totems double-face, caissons lumineux et lettres découpées en relief.","features":["Caissons aluminium","LED longue durée 50 000h","Dimmer programmable"]},
       {"title":"Plaques & mobilier","description":"Plaques de porte, numérotations, plaques de salles de réunion, boîtes aux lettres et mobilier de hall.","features":["Acier inox brossé","Aluminium anodisé","Gravure laser"]},
       {"title":"Signalétique QHSE","description":"Signalétique de sécurité incendie, évacuation, EPI obligatoires et zones réglementées conformes aux normes.","features":["Conformité norme NF","Photoluminescent","Pose & installation"]}
     ]},
    {"id":"refs","type":"references-strip","order":40,"enabled":true,
     "title":"Ils nous font confiance",
     "items":[{"name":"CDG"},{"name":"ONCF"},{"name":"Lydec"},{"name":"STEF Maroc"}]},
    {"id":"cta","type":"cta","order":50,"enabled":true,
     "title":"Donnez une identité forte à tous vos espaces",
     "body":"Plan de votre bâtiment ou liste de besoins — nos consultants signalétique vous accompagnent.",
     "background":"primary",
     "primaryCta":{"label":"Demander un audit signalétique","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Signalétique Professionnelle — La Fabrique | Epitaphe 360',
  'Totems, enseignes LED, wayfinding et signalétique directionnelle. Conçu et fabriqué à Casablanca. Durée de vie garantie 10 ans.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── la-fabrique/amenagement ───────────────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'la-fabrique/amenagement',
  'Aménagement d''Espace',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "tag":"Pôle Aménagement",
     "backgroundImage":"https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1400&q=80",
     "title":"Aménagement d''Espace",
     "subtitle":"Scénographie événementielle, architecture éphémère et design d'intérieur — chaque espace devient une expérience.",
     "primaryCta":{"label":"Déposer un projet","href":"/contact/brief"}},
    {"id":"pitch","type":"pitch","order":20,"enabled":true,
     "title":"Transformer n'importe quel espace en scène mémorable",
     "body":"D'un hall de conférence vide à un espace de marque immersif — nos scénographes et architectes d'intérieur conçoivent des expériences visuelles complètes, en pensant chaque détail d'ambiance.",
     "stats":[
       {"value":"+200","label":"Espaces aménagés"},
       {"value":"48h","label":"Délai de montage record"},
       {"value":"360°","label":"Couverture complète de l'espace"},
       {"value":"100%","label":"Clé en main"}
     ]},
    {"id":"blocks","type":"service-blocks","order":30,"enabled":true,
     "items":[
       {"title":"Scénographie événementielle","description":"Concept artistique global, décors immersifs, installations lumineuses et structures éphémères pour vos événements.","features":["Moodboard exclusif","Modélisation 3D","Production & pose"]},
       {"title":"Design d'intérieur corporate","description":"Espaces de travail, salles de réunion, réceptions et showrooms — une identité de marque cohérente dans chaque pièce.","features":["Plans d'aménagement","Mobilier sur mesure","Zoning & circulation"]},
       {"title":"Éclairage & ambiance","description":"Scénographie lumineuse programmable, éclairage architectural, spots et guirlandes pour créer l'ambiance souhaitée.","features":["DMX & RGBW","Gradateurs","Programmation scènes"]},
       {"title":"Cloisons & séparations","description":"Cloisons amovibles, verrières, box acoustiques et séparations décoratives pour structurer vos espaces.","features":["Acoustique renforcée","Vitrage & tissu","Démontage facile"]}
     ]},
    {"id":"refs","type":"references-strip","order":40,"enabled":true,
     "title":"Ils nous font confiance",
     "items":[{"name":"Maroc Telecom"},{"name":"Accor Maroc"},{"name":"OCP Group"},{"name":"CFC Casablanca Finance City"}]},
    {"id":"testimonial","type":"testimonial","order":50,"enabled":true,
     "author":"Directeur Immobilier",
     "company":"Groupe financier",
     "content":"Notre nouveau siège a été aménagé par Epitaphe 360 — l'ensemble de nos collaborateurs s'y sentent fiers et motivés. L'espace respire notre identité.",
     "rating":5},
    {"id":"cta","type":"cta","order":60,"enabled":true,
     "title":"Imaginez. Nous concrétisons.",
     "body":"Surface, budget, objectif — partagez votre projet et laissez notre équipe de scénographes l'imaginer.",
     "background":"primary",
     "primaryCta":{"label":"Lancer mon projet d'aménagement","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Aménagement d''Espace — La Fabrique | Epitaphe 360',
  'Scénographie événementielle, architecture éphémère et design d''intérieur corporate. Clé en main à Casablanca.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── la-fabrique/branding-siege ────────────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'la-fabrique/branding-siege',
  'Branding de Siège',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "tag":"La Fabrique 360",
     "backgroundImage":"https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80",
     "title":"Branding de Siège",
     "subtitle":"Transformez votre siège social en manifeste de marque — un espace qui inspire, engage et reflète votre identité à chaque coin de couloir.",
     "primaryCta":{"label":"Transformer mon siège","href":"/contact/brief"}},
    {"id":"pitch","type":"pitch","order":20,"enabled":true,
     "title":"Votre siège social est votre première publicité",
     "body":"Dès les premières secondes, votre espace de travail communique votre culture, vos valeurs et votre positionnement. Epitaphe 360 conçoit et réalise des environnements de marque qui font impression — sur vos clients, vos partenaires et vos collaborateurs.",
     "stats":[
       {"value":"89%","label":"Des visiteurs forment une opinion sur votre marque dès l'entrée"},
       {"value":"2x","label":"Plus d'attractivité pour les talents avec un espace inspirant"},
       {"value":"500+","label":"Projets de branding réalisés depuis 20 ans"},
       {"value":"48h","label":"Délai de réponse sur devis"}
     ]},
    {"id":"blocks","type":"service-blocks","order":30,"enabled":true,
     "items":[
       {"title":"Habillage entrée & réception","description":"Hall d'accueil, murs identitaires, lettres découpées rétroéclairées, totems et signalétique directionnelle.","features":["Mur logo rétroéclairé","Totem d'accueil","Signalétique directionnelle"]},
       {"title":"Décoration & identité visuelle","description":"Frises chronologiques, murs de valeurs, vitraux brandés, adhésifs décoratifs et impressions grand format.","features":["Frise chronologique","Mur de valeurs","Adhésifs grand format"]},
       {"title":"Espaces collaboratifs","description":"Salles de réunion brandées, espaces détente aux couleurs de la marque, cabines acoustiques personnalisées.","features":["Salles de réunion","Espace détente","Cabines acoustiques"]},
       {"title":"Signalétique & wayfinding","description":"Plan de circulation, plaques de portes, numérotation d'étages, panneaux directionnels intérieurs et extérieurs.","features":["Plan de circulation","Plaques de porte","Numérotation étages"]}
     ]},
    {"id":"refs","type":"references-strip","order":40,"enabled":true,
     "title":"Ils nous font confiance",
     "items":[{"name":"Qatar Airways"},{"name":"Schneider Electric"},{"name":"Dell"},{"name":"OCP Group"},{"name":"Ajial"}]},
    {"id":"testimonial","type":"testimonial","order":50,"enabled":true,
     "author":"Directeur Général",
     "company":"Entreprise multinationale",
     "content":"Notre nouveau siège à Casablanca reflète parfaitement notre identité de marque. L'accueil de nos clients a complètement changé depuis la rénovation.",
     "rating":5},
    {"id":"cta","type":"cta","order":60,"enabled":true,
     "title":"Donnez à votre siège l'image qu'il mérite",
     "body":"Partagez votre projet avec nous — superficie, délais, budget. Nous vous proposerons un devis détaillé sous 48h.",
     "background":"primary",
     "primaryCta":{"label":"Demander un devis","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Branding de Siège — La Fabrique | Epitaphe 360',
  'Transformez votre siège social en manifeste de marque. Habillage, signalétique, décoration identitaire, espaces collaboratifs.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── nos-poles ─────────────────────────────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'nos-poles',
  'Nos Pôles d''Expertise',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "backgroundImage":"https://version2.epitaphe.ma/wp-content/uploads/2025/11/Communication-interne-Industrie-Maroc-700x876.webp",
     "title":"Nos pôles d''expertise",
     "subtitle":"5 pôles spécialisés pour tous vos enjeux de communication B2B"},
    {"id":"hubcards","type":"hub-cards","order":20,"enabled":true,
     "title":"Nos expertises",
     "subtitle":"De l'engagement collaborateur à la responsabilité sociétale.",
     "items":[
       {"title":"COM' Interne","description":"Fédérez vos collaborateurs autour d'une vision commune. Stratégie, supports, événements internes et scoring CommPulse™.","href":"/nos-poles/com-interne"},
       {"title":"Marque Employeur","description":"Attirez et retenez les meilleurs talents. EVP, identité visuelle RH, campagnes recrutement et scénographie RH.","href":"/architecture-de-marque/marque-employeur"},
       {"title":"COM'SST-QHSE","description":"Sécurité, santé au travail et conformité visuelle. Signalétique réglementaire, affichage obligatoire et campagnes prévention.","href":"/architecture-de-marque/communication-qhse"},
       {"title":"COM'RSE","description":"Valorisez vos engagements sociétaux. Rapports d'impact, campagnes RSE, supports de sensibilisation et scoring ImpactTrace™.","href":"/nos-poles/com-rse"},
       {"title":"COM' Événementiel","description":"Conventions, galas, roadshows et salons B2B. Des moments qui marquent vos équipes et partenaires.","href":"/evenements"}
     ]},
    {"id":"cta","type":"cta","order":30,"enabled":true,
     "title":"Un projet transversal ?",
     "body":"Nos pôles travaillent ensemble pour vous offrir une vision 360° cohérente.",
     "background":"primary",
     "primaryCta":{"label":"Parler à un expert","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Nos Pôles d''Expertise | Epitaphe 360',
  '5 pôles spécialisés : communication interne, marque employeur, QHSE, RSE et événementiel B2B. Agence 360° à Casablanca.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── nos-poles/com-interne ─────────────────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'nos-poles/com-interne',
  'Communication Interne',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "tag":"COM' Interne",
     "backgroundImage":"https://version2.epitaphe.ma/wp-content/uploads/2025/11/Communication-interne-Industrie-Maroc-700x876.webp",
     "title":"Communication Interne",
     "subtitle":"Fédérez vos collaborateurs autour d'une vision commune et transformez votre culture d'entreprise en levier de performance.",
     "primaryCta":{"label":"Booster ma com' interne","href":"/contact/brief"}},
    {"id":"pitch","type":"pitch","order":20,"enabled":true,
     "title":"87% des collaborateurs se sentent désengagés faute d'une communication interne efficace",
     "body":"Une communication interne forte, c'est moins de turnover, plus de productivité et une culture d'entreprise qui attire les talents. Epitaphe 360 conçoit des dispositifs sur mesure qui donnent du sens au quotidien de vos équipes.",
     "stats":[
       {"value":"87%","label":"Des employés se sentent peu informés par leur management"},
       {"value":"4x","label":"Plus de productivité dans les entreprises à fort engagement"},
       {"value":"-41%","label":"De turnover avec une com' interne structurée"},
       {"value":"20+","label":"Ans d'expérience en communication B2B"}
     ]},
    {"id":"blocks","type":"service-blocks","order":30,"enabled":true,
     "items":[
       {"title":"Stratégie & audit de communication","description":"Diagnostic de vos flux d'information, cartographie des parties prenantes internes, définition du plan de communication.","features":["Audit communicationnel","Plan de com' annuel","Charte éditoriale interne"]},
       {"title":"Supports & contenus","description":"Journaux internes, newsletters, affiches, kakémonos, kits d'onboarding et livrets d'accueil.","features":["Journal d'entreprise","Newsletter mensuelle","Kit onboarding"]},
       {"title":"Événements internes","description":"Conventions, séminaires, kick-offs, team buildings : des moments de cohésion qui marquent les esprits.","features":["Conventions annuelles","Séminaires motivation","Célébrations RH"]},
       {"title":"Mesure & scoring CommPulse™","description":"Mesurez l'efficacité de votre communication interne avec notre outil propriétaire CommPulse™.","features":["Score COM' Interne","Tableau de bord KPI","Plan d'amélioration"]}
     ]},
    {"id":"refs","type":"references-strip","order":40,"enabled":true,
     "title":"Ils nous font confiance",
     "items":[{"name":"OCP Group"},{"name":"Maroc Telecom"},{"name":"BMCE Bank"},{"name":"Schneider Electric"},{"name":"Dell"}]},
    {"id":"testimonial","type":"testimonial","order":50,"enabled":true,
     "author":"Directeur de la Communication",
     "company":"Groupe industriel",
     "content":"Epitaphe 360 a complètement transformé notre façon de communiquer en interne. Les résultats sur l'engagement des équipes sont mesurables.",
     "rating":5},
    {"id":"cta","type":"cta","order":60,"enabled":true,
     "title":"Construisez une culture d'entreprise forte",
     "body":"Parlez-nous de vos enjeux RH et de communication. Nous vous proposerons un plan d'action adapté.",
     "background":"primary",
     "primaryCta":{"label":"Démarrer mon projet","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Communication Interne — Nos Pôles | Epitaphe 360',
  'Fédérez vos collaborateurs autour d''une vision commune. Stratégie, supports, événements internes et scoring CommPulse™.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── nos-poles/com-rse ─────────────────────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'nos-poles/com-rse',
  'Communication RSE',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"hero","type":"service-hero","order":10,"enabled":true,
     "tag":"COM'RSE",
     "backgroundImage":"https://version2.epitaphe.ma/wp-content/uploads/2025/11/marque-employeur-maroc-700x1012.jpg",
     "title":"Communication RSE",
     "subtitle":"Transformez vos engagements sociétaux en avantage compétitif et renforcez la confiance de vos parties prenantes.",
     "primaryCta":{"label":"Valoriser ma démarche RSE","href":"/contact/brief"}},
    {"id":"pitch","type":"pitch","order":20,"enabled":true,
     "title":"76% des consommateurs préfèrent les marques engagées dans une démarche RSE",
     "body":"La RSE n'est plus un accessoire — c'est un facteur de différenciation majeur. Nous vous aidons à structurer, visualiser et communiquer vos engagements RSE de manière authentique et impactante.",
     "stats":[
       {"value":"76%","label":"Des consommateurs favorisent les entreprises engagées"},
       {"value":"3x","label":"Plus d'attractivité pour les talents avec une RSE visible"},
       {"value":"68%","label":"Des investisseurs intègrent la RSE dans leurs critères"},
       {"value":"20+","label":"Ans d'expérience en communication d'impact"}
     ]},
    {"id":"blocks","type":"service-blocks","order":30,"enabled":true,
     "items":[
       {"title":"Rapport RSE & Impact","description":"Conception et mise en page de vos rapports annuels RSE, rapports d'impact, bilans carbones et livrets de durabilité.","features":["Rapport RSE annuel","Rapport d'impact","Bilan carbone visuel"]},
       {"title":"Campagnes de communication","description":"Campagnes de sensibilisation interne et externe, affichage, supports numériques et événements RSE.","features":["Campagnes visuelles","Sensibilisation interne","Actions terrain"]},
       {"title":"Supports & identité RSE","description":"Charte graphique RSE, infographies de données d'impact, livrets collaborateurs, kits communication.","features":["Charte RSE","Infographies impact","Kit collaborateurs"]},
       {"title":"Scoring ImpactTrace™","description":"Évaluez et suivez l'impact de votre communication RSE avec notre outil propriétaire ImpactTrace™.","features":["Score RSE & Impact","Tableau de bord","Plan de progrès"]}
     ]},
    {"id":"refs","type":"references-strip","order":40,"enabled":true,
     "title":"Ils nous font confiance",
     "items":[{"name":"OCP Group"},{"name":"SNEP"},{"name":"BMCE Bank"},{"name":"Lydec"},{"name":"Maroc Telecom"}]},
    {"id":"testimonial","type":"testimonial","order":50,"enabled":true,
     "author":"Responsable RSE",
     "company":"Groupe industriel coté",
     "content":"Notre rapport RSE a reçu des retours très positifs de nos actionnaires et partenaires. La mise en page et l'infographie de nos données ont vraiment fait la différence.",
     "rating":5},
    {"id":"cta","type":"cta","order":60,"enabled":true,
     "title":"Faites rayonner votre engagement RSE",
     "body":"Dites-nous où vous en êtes dans votre démarche RSE. Nous vous proposerons un dispositif de communication adapté.",
     "background":"primary",
     "primaryCta":{"label":"Lancer mon projet RSE","href":"/contact/brief"}}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Communication RSE — Nos Pôles | Epitaphe 360',
  'Transformez vos engagements sociétaux en avantage compétitif. Rapports RSE, campagnes d''impact, scoring ImpactTrace™.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── contact ───────────────────────────────────────────────────────────────────
INSERT INTO pages (slug, title, template, content, sections, status, meta_title, meta_description)
VALUES (
  'contact',
  'Contact — Epitaphe 360',
  'SECTIONS',
  '',
  $JSON$[
    {"id":"contactform","type":"contact-form","order":10,"enabled":true,
     "heroTitle":"Commençons à — créer ensemble",
     "heroSubtitle":"Un projet en tête ? Notre équipe répond sous 24h.",
     "heroImage":"https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80",
     "address":["123 Boulevard Mohammed V","Casablanca, Maroc"],
     "phone":["+212 5 22 XX XX XX","+212 6 XX XX XX XX"],
     "email":["contact@epitaphe360.ma","brief@epitaphe360.ma"],
     "hours":["Lun - Ven : 8h30 - 18h00","Sam : 9h00 - 13h00"]}
  ]$JSON$::jsonb,
  'PUBLISHED',
  'Contact — Epitaphe 360',
  'Contactez Epitaphe 360. Réponse sous 24h. Casablanca, Maroc — +212 5 22 XX XX XX.'
)
ON CONFLICT (slug) DO UPDATE SET
  sections = EXCLUDED.sections, template = EXCLUDED.template,
  content = EXCLUDED.content, updated_at = NOW();

-- ── Résumé ────────────────────────────────────────────────────────────────────
-- Pages seedées par cette migration :
-- 1. a-propos
-- 2. architecture-de-marque
-- 3. architecture-de-marque/marque-employeur
-- 4. architecture-de-marque/communication-qhse
-- 5. architecture-de-marque/experience-clients
-- 6. evenements
-- 7. evenements/conventions-kickoffs
-- 8. evenements/soirees-de-gala
-- 9. evenements/roadshows
-- 10. evenements/salons
-- 11. la-fabrique
-- 12. la-fabrique/impression
-- 13. la-fabrique/menuiserie
-- 14. la-fabrique/signaletique
-- 15. la-fabrique/amenagement
-- 16. la-fabrique/branding-siege
-- 17. nos-poles
-- 18. nos-poles/com-interne
-- 19. nos-poles/com-rse
-- 20. contact
