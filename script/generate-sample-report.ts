/**

 * Rapport Intelligence™ — ImpactTrace™ — Édition Maroc 2026

 *

 * Refonte complète avec layout strict :

 *  • Tous les helpers reçoivent (x, y, w) explicites et retournent le nouveau Y

 *  • Aucun usage de `continued: true` (source de chaos)

 *  • Pas de mélange `doc.text(s, opts)` + `doc.text(s, x, y, opts)`

 *  • Pagination via `ensureSpace(needed)` qui addPage si insuffisant

 *  • Helpers de chart isolés et auto-contenus

 *

 * Run : npx tsx script/generate-sample-report.ts

 */



import PDFDocument from 'pdfkit';

import fs from 'fs';

import path from 'path';



// ─── PALETTE ────────────────────────────────────────────────────────────────

const C = {

  primary: '#10b981', primaryD: '#047857',

  text: '#111827', textL: '#4b5563', textM: '#9ca3af',

  bg: '#ffffff', bgSoft: '#f9fafb', bgCard: '#f3f4f6', border: '#e5e7eb',

  red: '#dc2626', redBg: '#fef2f2',

  green: '#059669', greenBg: '#ecfdf5',

  blue: '#2563eb', blueBg: '#eff6ff',

  orange: '#ea580c', orangeBg: '#fff7ed',

  purple: '#7c3aed', purpleBg: '#f5f3ff',

  gold: '#ca8a04', goldBg: '#fef3c7',

  amber: '#d97706', amberBg: '#fff7ed',

  navy: '#0f2044',  navyL:   '#1a3060',

};



// ─── DATA (concise, axée Maroc) ─────────────────────────────────────────────



const R = {

  meta: {

    titre: 'Rapport Intelligence™ — ImpactTrace™',

    sousTitre: 'Diagnostic de maturité RSE & traçabilité d\'impact · Référentiel BMI 360™',

    perimetre: 'Diagnostic auto-déclaratif sur les 5 dimensions PROOF™ — ne couvre ni audit terrain ni vérification ISO 26000 / GRI Standards.',

    confidentialite: 'CONFIDENTIEL — Diffusion strictement interne COMEX',

    date: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }),

    client: 'Confidentiel · Industrie agroalimentaire Maroc · ~250 collaborateurs · CA ~150M MAD',

    verdict: 'Démarche RSE sincère mais orpheline : 5 dimensions plafonnent toutes entre 40 et 43/100, configuration la plus dangereuse qui soit en RSE — vous êtes simultanément moyens partout, donc invisibles pour les acheteurs B2B (OCP, Renault Tanger, Stellantis, BMCE), inéligibles au refinancement vert Bank Al-Maghrib, et exposés au reporting AMMC circ. 03-19 dès l\'exercice 2025.',

  },

  score: { global: 41, niveau: 3, label: 'Structuré' },

  pillars: [

    { id: 'P',  label: 'Purpose',        score: 40, weight: 25, mena: 35, top25: 60, leader: 80 },

    { id: 'R',  label: 'Reach',          score: 40, weight: 18, mena: 38, top25: 58, leader: 75 },

    { id: 'O',  label: 'Owned Evidence', score: 40, weight: 20, mena: 38, top25: 62, leader: 78 },

    { id: 'OC', label: 'Owned Inside',   score: 43, weight: 20, mena: 40, top25: 60, leader: 76 },

    { id: 'F',  label: 'Feel',           score: 40, weight: 17, mena: 39, top25: 58, leader: 74 },

  ],

  synthese: [

    'Votre score global de 41/100 vous situe 3 points au-dessus de la moyenne Maroc (38/100) mais à 24 points du quartile supérieur (65/100) — autrement dit, vous payez tout le coût d\'une démarche RSE structurée sans en encaisser aucun bénéfice de positionnement. Le profil est inquiétant par son homogénéité même : 4 piliers à 40 et 1 à 43, écart de seulement 3 points. Cette platitude est diagnostique : elle révèle qu\'AUCUNE locomotive interne ne tire la démarche, qu\'aucun arbitrage COMEX n\'a jamais tranché en faveur d\'un pilier prioritaire, et que les engagements sont portés à 40% par la DRH, 30% par le Marketing, 30% par la Direction Industrielle — sans arbitre unique. Or la valeur perçue par les parties prenantes (acheteurs OCP/Renault, banques BMCE/AWB/CIH, investisseurs CDG Capital, agence Vigeo Eiris) se construit sur des signaux forts, jamais sur une moyenne.',

    'Avec une feuille de route ciblée 12 mois et un investissement BRUT de 1.1-1.6M MAD, vous atteignez 62/100, décrochez le Label CGEM RSE (audit Bureau Veritas/SGS, 9 mois), entrez au CDG Capital Sustainability Index, et débloquez le refinancement vert Bank Al-Maghrib (-150 bps sur encours bancaire). Le coup de levier marocain est décisif : Tahfiz (CGI art. 57-20°, exo IR + CNSS patronale 24 mois sur 5 CDI) + ANAPEC IDMAJ + OFPPT CSF (prise en charge 70-80% formations) + Charte Investissement 2023 (prime jusqu\'à 30%) ramènent l\'investissement NET à 480-720k MAD — soit -55% du coût brut, payback 11-14 mois en NET.',

    'Le coût de l\'inaction sur 18 mois est conservativement estimé à 1.4-2.8M MAD répartis ainsi : exclusion AO B2B critères ESG 1.0-1.8M MAD (OCP, Managem, Renault Tanger, BMCE et Tier 1 exigent score CGEM ou EcoVadis dès 2026 — Renault déjà appliqué dossier sourcing 2025), surcoût bancaire 80-180k MAD/an (spread ESG +15-30 bps sur 25M MAD encours), turnover cadres Gen Y/Z 300-600k MAD/an (étude ReKrute 2024 : 68% des moins de 35 ans considèrent la RSE comme critère décisif), exposition AMMC circ. 03-19 (sociétés cotées et leurs filiales : reporting TCFD/SASB obligatoire exercice 2025) 200k-2M MAD selon redressement.',

  ],

  exec: 'Constat — Score 41/100, +3 pts vs moyenne Maroc (38), -24 pts vs top 25% (65), -37 pts vs leader sectoriel OCP (~78). Cause profonde — absence totale de sponsor exécutif RSE rattaché DG : la démarche flotte entre DRH/Marketing/Industriel sans arbitre, donc sans budget consolidé, donc sans pilotage chiffré (méthode Kotter step 2 violée). Risque #1 — exclusion progressive des AO B2B intégrant critères ESG (OCP, Managem, Renault Tanger, Stellantis, BMCE et leurs Tier 1) : coût 1.4-2.8M MAD sur 18 mois. Opportunité #1 — capitaliser sur Owned Inside (43, seul point haut) pour décrocher le Label CGEM RSE en 9 mois (audit Bureau Veritas 180-280k MAD). Recommandation phare — nommer un Chief Sustainability Officer rattaché DG d\'ici J60 (cabinet Michael Page Maroc / Robert Walters), financé Tahfiz (-360 à -480k MAD sur 24 mois) + OFPPT CSF (-96k MAD formation), méthodologie Hoshin Kanri + OKR trimestriels. Engagement requis — sponsor DG actif (COMEX mensuel obligatoire) + budget BRUT 1.1-1.6M MAD ramené à 480-720k MAD NET après leviers Maroc, ROI 3 ans 4.2x base / 5.8x ambitieux.',

  chiffres: [

    { v: '1.4-2.8M', u: 'MAD', l: 'Coût d\'inaction 18 mois', i: 'Pertes AO B2B + surcoût bancaire + turnover' },

    { v: '-55%',     u: '',    l: 'Réduction invest. net',    i: 'Tahfiz + ANAPEC + OFPPT CSF + Charte Invest' },

    { v: '4.2x',     u: 'ROI', l: 'Retour à 3 ans (Base)',    i: 'NET 480-720k MAD investis · 2-3M MAD gains' },

  ],

  messages: [

    'Vous êtes moyens partout — la pire posture RSE possible.',

    'Les leviers Maroc divisent l\'invest net par 2.',

    'Owned Inside (43) = votre seul actif différenciant.',

  ],

  positionnement: [

    { t: 'vs Moyenne MENA (38/100)',     v: '+3 pts',   c: C.green,  b: 'Légèrement au-dessus de la moyenne mais sans signal différenciant — situation invisible aux parties prenantes.' },

    { t: 'vs Top 25% MENA (65/100)',     v: '-24 pts',  c: C.red,    b: 'Atteignable en 9-12 mois avec sponsoring DG + Label CGEM RSE.' },

    { t: 'vs Leader sectoriel (78/100)', v: '-37 pts',  c: C.red,    b: 'Leaders RSE Maroc : OCP (~82), Managem (~75), Lydec (~73), Inwi (~68).' },

    { t: 'Trajectoire 5 ans (sans action)', v: 'Score 35-38', c: C.orange, b: 'La moyenne MENA progresse de +2 pts/an. Sans action vous serez dans le quartile inférieur d\'ici 2030.' },

  ],

  risques: [

    { r: 'Exclusion progressive des AO B2B avec critères ESG (OCP, Managem, BMCE, Renault, Stellantis)', proba: 'Élevée', impact: 'Critique', horizon: '12-18 mois', cout: '1.2-2.4M MAD/an', mit: 'Auto-évaluation EcoVadis + démarche Label CGEM RSE dès J30' },

    { r: 'Surcoût financement bancaire sur nouvelles lignes (Bank Al-Maghrib refinancement vert)', proba: 'Moyenne', impact: 'Élevé', horizon: '12 mois', cout: '80-180k MAD/an', mit: 'Préparer dossier ESG bancaire (BMCE Sustainable, AWB Green, CIH, BCP Azur)' },

    { r: 'Turnover Gen Y/Z sur déficit de sens', proba: 'Élevée', impact: 'Élevé', horizon: '6-12 mois', cout: '300-600k MAD/an', mit: 'Programme Ambassadeurs + 1 KPI RSE en évaluation manager' },

    { r: 'Exposition réglementaire AMMC dès 2025 (filiale groupe coté Casablanca)', proba: 'Moyenne', impact: 'Critique', horizon: '12 mois', cout: '500k-2M MAD', mit: 'Reporting ESG conforme circulaire AMMC 03-19 (TCFD/SASB)' },

  ],

  opportunites: [

    { o: 'Label CGEM RSE en 9 mois', fac: 'Moyenne', val: 'Élevée', horizon: '9 mois', valEst: '+2 pts marge B2B (1.0-1.8M MAD/an)', act: 'Audit Bureau Veritas/SGS (180-280k MAD), commission CGEM, label valide 3 ans' },

    { o: 'Programme Owned Inside flagship (point haut OC)', fac: 'Élevée', val: 'Moyenne', horizon: '6 mois', valEst: '+200-400k MAD/an marque employeur', act: '1 programme 3 ans avec INDH, Fondation Mohammed V ou Zakoura' },

    { o: 'Inscription CDG Capital Sustainability Index', fac: 'Élevée', val: 'Élevée', horizon: '4 mois', valEst: 'Visibilité investisseurs ESG Maroc', act: 'Dépôt dossier après Label CGEM RSE' },

    { o: 'Refinancement vert Bank Al-Maghrib (-150 bps)', fac: 'Moyenne', val: 'Élevée', horizon: '6 mois', valEst: '120-280k MAD/an gain financier', act: 'Dossier banque (BMCE, AWB, CIH) sur projet éligible green taxonomy BAM' },

  ],

  scenarios: [

    { l: 'CONSERVATEUR', s: 51, brut: '450-650k MAD', net: '220-340k MAD', desc: 'Mise à niveau pilotage + 1 quick win par pilier. Pas de sponsor exécutif dédié.', cond: 'DRH 0.3 ETP · Reporting trimestriel · Aucun chantier transversal', color: C.textL },

    { l: 'BASE',         s: 62, brut: '1.1-1.6M MAD', net: '480-720k MAD', desc: 'CSO + tableau de bord ESG + Label CGEM RSE + programme Owned Inside flagship.', cond: 'Sponsor DG actif · CSO recruté M2 · Budget 12 mois validé · Comité Transform mensuel', color: C.blue },

    { l: 'AMBITIEUX',    s: 72, brut: '2.2-3.0M MAD', net: '950k-1.4M MAD', desc: 'Stratégie RSE pilotée comme un BU : roadmap 3 ans, Label CGEM + ISO 26000, 3 programmes flagship.', cond: 'Engagement CA · CSO + 1.5 ETP · Convention État Charte Invest · Reporting impact public', color: C.green },

  ],

  pillars_d: [

    {

      id: 'P', label: 'Purpose', score: 40, weight: 25,

      diag: 'Score 40/100 sur Purpose : votre raison d\'être RSE n\'est ni formalisée par un manifeste signé du DG, ni déployée dans le management, ni visible. La RSE est perçue comme une contrainte, pas comme un cadre de décision.',

      cause: 'Aucun atelier stratégique RSE n\'a jamais été tenu au niveau COMEX. La RSE est traitée comme un sujet "DRH/Communication" plutôt que stratégique.',

      bench: { vous: 40, mena: 35, top25: 60, leader: 80 },

      benchI: 'Leaders Maroc (OCP, Managem, Lydec) ont structuré une "Purpose Statement" signée du Conseil d\'Administration + manifeste public.',

      qw: 'Manifeste Purpose RSE en 21 jours (atelier COMEX 2j + cabinet RSE) — invest 25-40k MAD · +5 pts en 60j',

    },

    {

      id: 'R', label: 'Reach', score: 40, weight: 18,

      diag: 'Score 40/100 sur Reach : déficit majeur de communication externe. Aucun rapport RSE annuel public, pas de page dédiée corporate, absence des classements régionaux. Vous payez le coût sans encaisser le bénéfice réputationnel.',

      cause: 'La RSE est traitée comme une obligation interne et non comme un actif marketing. Aucun lien fonctionnel CSO/DRH ↔ Direction Communication.',

      bench: { vous: 40, mena: 38, top25: 58, leader: 75 },

      benchI: 'OCP, Managem, Lydec, Inwi publient un rapport RSE annuel conforme GRI Standards. Top 25% Maroc dispose d\'une page web + 4 communications/an.',

      qw: 'Page corporate RSE en 21 jours (3 engagements + 6 KPIs + 2 cas) — invest 8-15k MAD · +4 pts en 45j',

    },

    {

      id: 'O', label: 'Owned Evidence', score: 40, weight: 20,

      diag: 'Score 40/100 : absence de preuves tangibles, mesurées et documentées des impacts RSE réels. Excel et e-mails dispersés. Impossible de produire en moins de 2 semaines un reporting ESG consolidé pour un client B2B ou un financeur. Risque greenwashing élevé.',

      cause: 'La RSE n\'a jamais été dotée d\'un budget IT propre. Pas de SI dédié > données fragmentées > pas de pilotage chiffré.',

      bench: { vous: 40, mena: 38, top25: 62, leader: 78 },

      benchI: 'Top 25% Maroc dispose d\'un module RSE intégré ERP ou plateforme SaaS dédiée (EcoVadis, Greenly, Sweep, OneCSR, AfricaNotation, Persefoni).',

      qw: 'Tableur ESG Power BI centralisé en 20j (8 KPIs prioritaires) — invest 15-25k MAD · +5 pts en 60j',

    },

    {

      id: 'OC', label: 'Owned Inside', score: 43, weight: 20,

      diag: 'Score 43/100 — votre seul point haut, mais sous-exploité. Quelques actions communautaires ponctuelles (mécénat, partenariats associatifs) sans stratégie articulée ni mesure d\'impact (SROI). Cette dimension est PARADOXALEMENT votre meilleur actif différenciant.',

      cause: 'Actions menées par opportunité (sollicitations entrantes) plutôt que par stratégie. Pas de plan triennal communautaire. Pas de mesure d\'impact.',

      bench: { vous: 43, mena: 40, top25: 60, leader: 76 },

      benchI: 'Modèles Maroc : OCP Foundation (éducation), Inwi (entrepreneuriat jeunes), Lydec (eau & assainissement), Attijariwafa Wafa Cash (inclusion).',

      qw: 'Cartographie actions communautaires existantes en 20j (audit interne + matrice priorisation) — invest 5-10k MAD · +4 pts en 45j',

    },

    {

      id: 'F', label: 'Feel', score: 40, weight: 17,

      diag: 'Score 40/100 sur Feel : la perception RSE des parties prenantes est faible. Les arbitrages quotidiens (achats, RH, opérations, voyages) ne tiennent pas compte des enjeux ESG par défaut. La RSE reste l\'affaire de quelques convaincus.',

      cause: 'Pas de "RSE 101" dans le parcours d\'intégration. Pas de module obligatoire pour les managers. La RSE n\'est pas évaluée dans la performance individuelle.',

      bench: { vous: 40, mena: 39, top25: 58, leader: 74 },

      benchI: 'Top 25% Maroc a un module RSE obligatoire à l\'onboarding (45-90 min) + 1 formation manager annuelle (1j, financée OFPPT CSF / GIAC sectoriel).',

      qw: 'Charte 10 commandements RSE quotidiens en 15j (1 page affichable) — invest 3-6k MAD · +3 pts en 30j',

    },

  ],

  recos: [

    {

      n: 1, title: 'Nommer un Chief Sustainability Officer rattaché DG (financé Tahfiz)',

      narr: 'Clé de voûte. Sans sponsor exécutif dédié, aucune autre recommandation ne tiendra. Un CSO senior débloque l\'arbitrage budgétaire, la légitimité interne et la coordination inter-directions.',

      bcInvest: '180-250k MAD/an brut', bcNet: '36-50k MAD/an NET (Tahfiz an 1+2)',

      bcGain: '450-800k MAD/an', bcPay: '2-3 mois (NET)', bcRoi: '8.5x sur 3 ans',

      raci: { r: 'CSO recruté', a: 'DG', c: 'DRH, DAF, DCom', i: 'COMEX, Conseil d\'Administration' },

      impact: 'Très élevé', effort: 'Moyen', timeline: '60 jours', methodo: 'Gestion par priorités + RACI',

      maroc: [

        { n: 'Tahfiz (CGI art. 57-20°)', t: 'Fiscal', a: 'Exo IR + part patronale CNSS 24 mois sur CSO + 4 autres CDI = ~360-480k MAD économisés', cd: 'Salaires ≤ 10k MAD/mois, CDI, entreprise créée 2015-2026' },

        { n: 'ANAPEC IDMAJ', t: 'Subvention', a: 'Prime à l\'insertion + exo CNSS 24 mois cumulable', cd: 'Profils <35 ans, 1er emploi structuré' },

      ],

      net: 'Coût net CSO an 1 : 36-50k MAD au lieu de 180-250k MAD (-80%)',

    },

    {

      n: 2, title: 'Tableau de bord ESG mensuel Power BI (10 KPIs max)',

      narr: 'Sans mesure, pas de pilotage. 10 KPIs maximum, publiés mensuellement au COMEX par le CSO. Balanced Scorecard appliqué à la RSE.',

      bcInvest: '40-80k MAD setup', bcNet: '16-50k MAD (CSF formation Power BI + AMDIE Digital)',

      bcGain: '300-500k MAD/an', bcPay: '3-5 mois', bcRoi: '6.0x sur 3 ans',

      raci: { r: 'CSO + Contrôleur Gestion', a: 'DAF', c: 'DRH, DSI, Achats', i: 'COMEX' },

      impact: 'Élevé', effort: 'Faible', timeline: '90 jours', methodo: 'Tableau de bord ESG Power BI',

      maroc: [

        { n: 'OFPPT CSF formation Power BI', t: 'Formation', a: '80% prise en charge formation 2x3j équipe contrôle = 24-36k MAD économisés', cd: 'TFP à jour' },

        { n: 'AMDIE Maroc Digital 2030', t: 'Subvention', a: 'Subvention transformation digitale jusqu\'à 30% (cap 200k MAD)', cd: 'PME, projet > 100k MAD' },

      ],

      net: 'Coût net : 16-50k MAD au lieu de 40-80k MAD (-40%)',

    },

    {

      n: 3, title: 'Label CGEM RSE (M9) + Inscription CDG Capital Sustainability Index',

      narr: 'Standard national reconnu (audit Bureau Veritas/SGS, valable 3 ans). Reconnaissance immédiate par acheteurs B2B et financeurs. Ouvre marchés publics avec préférence (loi 12-19).',

      bcInvest: '180-280k MAD audit + accompagnement', bcNet: '120-190k MAD (CSF 30% sur formation préparatoire)',

      bcGain: '1.0-1.8M MAD/an', bcPay: '4-6 mois post-label', bcRoi: '7.2x sur 3 ans',

      raci: { r: 'CSO + Bureau Veritas/SGS', a: 'DG', c: 'DAF, DRH, DCom', i: 'COMEX, Clients B2B, CGEM' },

      impact: 'Très élevé', effort: 'Moyen', timeline: '9 mois', methodo: 'Audit CGEM RSE (ISO 26000)',

      maroc: [

        { n: 'CGEM Label RSE', t: 'Label', a: 'Accès marchés publics avec préférence (loi 12-19) + visibilité grands DOO + financement vert préférentiel', cd: 'Audit Bureau Veritas/SGS, validité 3 ans' },

        { n: 'OFPPT CSF formation auditeur interne', t: 'Formation', a: '80% prise en charge formation 4j équipe = 28-40k MAD économisés', cd: 'TFP à jour' },

        { n: 'CDG Capital Sustainability Index', t: 'Label', a: 'Inscription gratuite après Label CGEM = visibilité investisseurs ESG Maroc', cd: 'Démarche RSE structurée prouvée' },

      ],

      net: 'Coût net : 120-190k MAD au lieu de 180-280k MAD (-30%)',

    },

    {

      n: 4, title: 'Programme Owned Inside flagship 3 ans (capitaliser sur le point haut)',

      narr: 'Concentrer 60% du budget mécénat sur 1 seul programme pluriannuel = 10x plus d\'impact narratif. Modèle éprouvé : OCP Foundation, Inwi Education, Lydec\'Eau, Attijariwafa Wafa Cash.',

      bcInvest: '300-500k MAD/an programme + ONG', bcNet: '0-200k MAD/an (don 100% déductible IS + cofi Fondation)',

      bcGain: '600k-1.2M MAD/an', bcPay: '6-12 mois (NET)', bcRoi: '5.5x sur 3 ans',

      raci: { r: 'CSO + 1 ONG (INJAZ, Zakoura, EFE)', a: 'DG', c: 'DRH, DCom', i: 'Collaborateurs, Communautés, Médias' },

      impact: 'Élevé', effort: 'Moyen', timeline: '6 mois (lancement)', methodo: 'Mesure d\'impact SROI',

      maroc: [

        { n: 'Don déductible 100% IS (CGI art. 10)', t: 'Fiscal', a: 'Économie IS 20% sur 100% du don à OUP = 60-100k MAD/an', cd: 'Don à Fondation Mohammed V, Zakoura, INJAZ, EFE, Fondation OCP' },

        { n: 'Fondation Mohammed V cofinancement', t: 'Subvention', a: 'Cofinancement 30-50% du programme communautaire flagship', cd: 'Programme aligné axes Fondation' },

        { n: 'INDH partenariat', t: 'Conventionnel', a: 'Mise à disposition réseau opérateurs INDH dans 75 provinces', cd: 'Programme territorialement ancré' },

      ],

      net: 'Coût net : 0-200k MAD/an au lieu de 300-500k MAD/an (-60% à -100%)',

    },

    {

      n: 5, title: 'RSE dans la performance managers (KPI individuel) — financé OFPPT CSF',

      narr: 'Tant que la RSE n\'est pas évaluée dans la performance individuelle, elle reste accessoire. 1 critère RSE = 5-10% de la note annuelle. Levier de transformation culturelle le plus puissant et le moins coûteux.',

      bcInvest: '60-100k MAD (refonte grille + formation 80 managers)', bcNet: '12-20k MAD NET (CSF 80% sur formation)',

      bcGain: '250-450k MAD/an', bcPay: '1-2 mois (NET)', bcRoi: '12x sur 3 ans',

      raci: { r: 'DRH', a: 'DG', c: 'CSO, COMEX', i: 'Managers, IRP/syndicats' },

      impact: 'Élevé', effort: 'Faible', timeline: '4 mois', methodo: 'Objectifs OKR + évaluation',

      maroc: [

        { n: 'OFPPT CSF formation managers RSE', t: 'Formation', a: '80% prise en charge 1j × 80 managers = 48-80k MAD économisés', cd: 'TFP à jour, plan formation déposé' },

        { n: 'GIAC Agroalimentaire (FENAGRI)', t: 'Formation', a: 'Prise en charge complémentaire ingénierie pédagogique jusqu\'à 100%', cd: 'Adhésion FENAGRI' },

      ],

      net: 'Coût net : 12-20k MAD au lieu de 60-100k MAD (-80%)',

    },

  ],

  plan: [

    { ph: 'Phase 1 — Mobilisation & Cadrage', wk: 'J1-J30',

      obj: 'Créer les conditions de réussite : sponsor, gouvernance, baseline.',

      acts: [

        'Briefing COMEX + validation feuille de route (J7)',

        'Lancement recrutement CSO (cabinet chasse Michael Page / Robert Walters Maroc) (J14)',

        'Cartographie 12 KPIs ESG prioritaires GRI Core (J21)',

        'Mise en place Comité Transform RSE mensuel (J28)',

        'Pré-dossier Tamwilcom Damane Express déposé (J30)',

      ],

      livr: 'Charte Comité Transform + plan recrutement CSO + baseline 12 KPIs + dossier Tamwilcom',

      kpi: '5/5 actions livrées à J30, comité Transform tenu',

      bud: '60-90k MAD',

    },

    { ph: 'Phase 2 — Déploiement Quick Wins', wk: 'J31-J60',

      obj: 'Démontrer la traction par 5 quick wins visibles + structurer la mesure.',

      acts: [

        'QW Owned Evidence : dashboard Power BI v0 (J45)',

        'QW Reach : page corporate RSE en ligne (J50)',

        'QW Purpose : manifeste RSE COMEX validé (J55)',

        'QW Owned Inside : cartographie actions communautaires (J50)',

        'QW Feel : charte 10 commandements RSE (J45)',

        'Recrutement CSO finalisé (Tahfiz activé) (J60)',

      ],

      livr: '5 quick wins livrés + CSO en poste + Tahfiz validé DGI',

      kpi: '5/5 quick wins en production, +5 à +10 pts score global estimé',

      bud: '180-280k MAD BRUT · ~80-130k MAD NET',

    },

    { ph: 'Phase 3 — Capitalisation & Scale', wk: 'J61-J90',

      obj: 'Lancer les 3 chantiers structurants à 6-12 mois.',

      acts: [

        'Mandat cabinet auditeur Label CGEM RSE (Bureau Veritas/SGS) (J75)',

        'Choix programme Owned Inside flagship + ONG (INJAZ/Zakoura) (J85)',

        'Validation COMEX intégration KPI RSE grille managers (J85)',

        'Plan formation OFPPT CSF déposé (J88)',

        '1er reporting trimestriel COMEX rapport ESG complet (J90)',

      ],

      livr: '3 chantiers structurants lancés + plan formation CSF + 1er rapport ESG COMEX',

      kpi: 'Score estimé +12 à +18 pts vs baseline (cible 53-59 à M3)',

      bud: '220-350k MAD BRUT · ~100-160k MAD NET',

    },

  ],

  gouv: [

    ['Instance de pilotage', 'Comité Transform RSE mensuel présidé par le DG'],

    ['Reporting', 'Mensuel COMEX, trimestriel Conseil d\'Administration, annuel public (rapport RSE GRI Core)'],

    ['Sponsor exécutif', 'DG (sponsor exécutif), CSO (chef de projet)'],

    ['Équipe projet', '1 CSO + 1 référent par direction (DRH, DAF, DCom, Achats) + cabinet auditeur Label CGEM'],

    ['Budget total recommandé', '1.1-1.6M MAD BRUT sur 12 mois · 480-720k MAD NET après leviers Maroc'],

  ],

  stake: [

    { g: 'COMEX',                  p: 'Allié',     en: 'Validation budget et arbitrages', a: 'Réunion cadrage 2h + tableau de bord mensuel' },

    { g: 'Managers N-1',           p: 'Sceptique', en: 'Crainte charge supplémentaire',   a: 'Atelier 1j (financé OFPPT CSF) + intégration KPI RSE évaluation' },

    { g: 'Direction Achats',       p: 'Sceptique', en: 'Coût perçu sélection ESG',        a: 'ROI sur 5 cas concrets + accompagnement charte fournisseurs' },

    { g: 'Collaborateurs Gen Y/Z', p: 'Promoteur', en: 'Forte attente de sens',           a: 'Newsletter RSE + programme participatif (vote 3 actions)' },

    { g: 'IRP / Syndicats',        p: 'Neutre',    en: 'Vigilance sur ajout critères',    a: 'Information préalable + dialogue grille modifiée' },

    { g: 'Banques (BMCE, AWB)',    p: 'Allié',     en: 'Éligibilité refinancement vert',  a: 'Dossier ESG structuré + reporting trimestriel' },

  ],

  cas: [

    { sect: 'Industrie agroalimentaire Maroc · 320 collab · CA 180M MAD',

      depart: 'Score 38/100 — RSE éparpillée RH/Qualité/Direction',

      acts: ['Nomination CSO J60 (Tahfiz activé)', 'Plateforme EcoVadis Premium', 'Label CGEM RSE M14', 'Programme "Jeunesse rurale" avec INJAZ Al-Maghrib', 'Refinancement vert AWB -25 bps'],

      res: 'Score 64/100 en 12 mois, +3 contrats B2B (gain 8.5M MAD/an), turnover ÷2.1, économie financière 180k MAD/an',

      duree: '12 mois — ROI 5.8x sur 3 ans (NET)' },

    { sect: 'Services BtoB Casablanca · 150 collab · CA 80M MAD',

      depart: 'Score 42/100 — démarche existante mais invisible',

      acts: ['Tableau de bord ESG Power BI (subvention AMDIE)', 'Page corporate + rapport GRI Core (KPMG)', 'Inscription CDG Capital Sustainability Index', 'Statut CFC obtenu'],

      res: 'Score 58/100 en 9 mois, doublement visibilité presse RSE, intégration short-list 4 grands AO, IS de 31% à 15% (CFC)',

      duree: '9 mois — ROI 4.5x sur 3 ans (NET)' },

    { sect: 'PME industrielle Tanger · 90 collab · CA 45M MAD',

      depart: 'Score 35/100 — aucune démarche RSE',

      acts: ['CSO mi-temps (DRH formé OFPPT CSF)', 'Convention Tanger Med ZAI (IS 8.75%)', 'Bilan carbone Scope 1+2 (subvention IRESEN 70%)', 'Charte fournisseurs ESG'],

      res: 'Score 52/100 en 12 mois, IS divisé par 2 (ZAI), entrée short-list Renault Tanger + Stellantis Kénitra',

      duree: '12 mois — ROI 6.2x sur 3 ans (NET)' },

  ],

  message: 'Votre score 41/100 ne reflète ni un échec ni un manque de volonté — il reflète une démarche sincère qui n\'a jamais été dotée des moyens structurels de réussir. La vérité difficile que je dois vous dire : vos équipes RH, Communication et Industrielle font ce qu\'elles peuvent à 30% de leur temps chacune, mais aucune n\'a le mandat ni les KPIs P&L pour transformer ces 41 points en avantage concurrentiel. Tant que la RSE n\'aura pas un Chief Sustainability Officer rattaché à VOUS personnellement, présent au COMEX mensuel, avec un budget propre et trois KPIs P&L mesurables (chiffre d\'affaires AO ESG décrochés, spread bancaire récupéré, turnover cadres évité), vous resterez moyens partout — configuration progressivement disqualifiante face à OCP (~82/100), Managem (~75), Lydec (~73) et leurs Tier 1. La bonne nouvelle factuelle : votre score Owned Inside à 43 prouve que les fondamentaux humains existent et que la culture est prête. Avec un CSO financé Tahfiz à hauteur de 80%, un budget BRUT 1.1-1.6M MAD ramené à 480-720k MAD NET via Tahfiz/CSF/Charte Investissement 2023, et votre présence personnelle au Comité Transform mensuel à partir du J28, vous serez à 62/100 dans 12 mois avec Label CGEM RSE — moment où la RSE cesse d\'être un coût pour devenir un actif commercial chiffrable au compte de résultat.',

  cta: 'Score 41 · Écart 24 pts au top 25% Maroc · Coût d\'inaction 1.4-2.8M MAD sur 18 mois · Leviers Maroc qui divisent l\'investissement net par 2 · Refinancement vert Bank Al-Maghrib activable dès Label CGEM = la fenêtre stratégique est MAINTENANT, pas à l\'exercice prochain. Mission Transform Epitaphe360 — 3 ateliers COMEX · 30 jours · livrables : profil de poste CSO calibré, dossiers Tahfiz/Tamwilcom/OFPPT CSF déposés, plan budgétaire 12 mois validé Conseil, gouvernance Hoshin Kanri en marche.',

  annexe: [

    { cat: 'FISCAL', color: C.purple, items: [

      ['Tahfiz (CGI art. 57-20°)', 'Exo IR + CNSS patronale 24 mois sur 5 premiers CDI', '~80% du coût RH net an 1+2', 'Salaires ≤ 10k MAD/mois · Entreprise créée 2015-2026'],

      ['CFC (Casablanca Finance City)', 'IS 15% revenus export 5 ans + IR 20% expat', '-35 à -50% sur IS', 'Statut CFC (siège régional, holding, services)'],

      ['Don déductible 100% IS', 'Déductibilité totale dons à OUP', '-20% du don (taux IS standard)', 'Fondations Mohammed V, Zakoura, INJAZ, EFE, OCP'],

      ['Crédit IS R&D 30%', 'Réduction IS sur dépenses R&D + super-amortissement 130%', '-30 à -50% sur invest R&D', 'Projet R&D documenté, dossier DGI'],

    ]},

    { cat: 'FINANCEMENT & GARANTIES', color: C.blue, items: [

      ['Tamwilcom Damane Express', 'Garantie 70-80% prêt invest jusqu\'à 5M MAD', 'Libération cash flow + accès crédit PME', 'CA < 200M MAD'],

      ['Charte Investissement 2023', 'Prime État jusqu\'à 30% (15% base + bonus genre/eco/innov)', 'Jusqu\'à -30% du montant invest', 'Convention État > 50M MAD ou > 50 emplois'],

      ['BAM Refinancement Vert', 'Refinancement banques sur prêts verts', '-150 bps vs taux marché (~80-280k MAD/an)', 'Projet éligible green taxonomy BAM'],

      ['FM6I (Fonds Mohammed VI)', 'Co-investissement avec fonds privés', 'Renforcement fonds propres', 'Société stratégique'],

      ['Maroc PME Imtiaz Croissance', 'Subvention 20% jusqu\'à 10M MAD pour modernisation', 'Subvention non remboursable', 'PME, plan d\'investissement validé'],

    ]},

    { cat: 'FORMATION & EMPLOI', color: C.green, items: [

      ['OFPPT CSF', 'Prise en charge 70-80% coûts formations qualifiantes', '-70 à -80% du budget formation', 'Cotisation TFP à jour (1.6%)'],

      ['GIAC sectoriels', 'Prise en charge complémentaire ingénierie pédagogique', 'Jusqu\'à 100% pris en charge', 'Adhésion fédération sectorielle'],

      ['ANAPEC IDMAJ', 'Prime à l\'insertion + exo CNSS 24 mois', 'Réduction coût RH cumulée Tahfiz', 'Profils <35 ans, 1er emploi'],

      ['ANAPEC Forsa', 'Subvention 100k MAD entrepreneuriat', 'Jusqu\'à 100k MAD', 'Projet entrepreneurial validé'],

    ]},

    { cat: 'LABELS & CONFORMITÉ', color: C.gold, items: [

      ['Label CGEM RSE', 'Audit Bureau Veritas/SGS · Validité 3 ans', 'Marchés publics + financement vert', 'Démarche RSE structurée + audit'],

      ['CDG Capital Sustainability Index', 'Inscription gratuite après Label CGEM', 'Visibilité investisseurs ESG Maroc', 'Label CGEM RSE obtenu'],

      ['AMMC Reporting ESG (circ. 03-19)', 'Obligatoire sociétés cotées dès exercice 2025', 'Conformité réglementaire', 'Sociétés cotées Bourse Casablanca'],

      ['UNGM Pacte Mondial', 'Adhésion gratuite + COP annuel', 'Visibilité internationale', 'Engagement 10 principes'],

    ]},

    { cat: 'ZONES & STATUTS SPÉCIAUX', color: C.orange, items: [

      ['Tanger Med ZAI', 'IS 8.75% pendant 20 ans + exo IR 50%', '-60% sur IS', 'Implantation zone'],

      ['Atlantic Free Zone Kénitra', 'Exo IS, IR, TVA, droits douane', 'Exonération massive', 'Implantation zone'],

      ['Plan Génération Green 2020-2030', 'Subventions agriculture durable jusqu\'à 80%', 'Jusqu\'à -80% invest agricole vert', 'Projet validé'],

      ['IRESEN R&D verte', 'Subventions R&D énergies propres jusqu\'à 70%', 'Jusqu\'à -70% projet R&D', 'H2 vert, solaire, efficacité énergétique'],

    ]},

  ],

};



// ─── PDF SETUP ──────────────────────────────────────────────────────────────

const PAGE_W = 595.28, PAGE_H = 841.89;

const M = 50;                                  // margin

const CW = PAGE_W - 2 * M;                     // content width

const TOP = 50, BOT = PAGE_H - 60;             // usable Y range



const outDir = path.join(process.cwd(), 'attached_assets');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, `rapport-intelligence-impacttrace-MAROC-${Date.now()}.pdf`);



const doc = new PDFDocument({

  size: 'A4',

  margins: { top: TOP, bottom: 60, left: M, right: M },

  bufferPages: true,

  info: {

    Title: 'Rapport Intelligence™ — ImpactTrace™ — Édition Maroc',

    Author: 'Epitaphe360 — Senior Partner',

  },

});

doc.pipe(fs.createWriteStream(outPath));



// Layout state — strictly tracked

const L = { y: TOP };

let currentSection = '';



function newPage(section?: string) {

  doc.addPage();

  if (section !== undefined) currentSection = section;

  drawHeader();

  L.y = TOP + 30;

}

function ensure(needed: number, section?: string) {

  if (L.y + needed > BOT) newPage(section);

}

function drawHeader() {

  doc.save();

  doc.rect(0, 0, PAGE_W, 4).fillColor(C.primary).fill();

  doc.rect(0, 4, 5, PAGE_H - 4).fillColor('#d1fae5').fill();  // left accent strip

  doc.fillColor(C.textM).font('Helvetica').fontSize(7.5)

     .text(currentSection.toUpperCase(), M + 8, 13, { width: CW - 140, lineBreak: false });

  doc.fillColor(C.textM).font('Helvetica').fontSize(7.5)

     .text('EPITAPHE360  |  CONFIDENTIEL', PAGE_W - M - 132, 13, { width: 130, align: 'right', lineBreak: false });

  doc.restore();

}



// ─── PRIMITIVES ─────────────────────────────────────────────────────────────



/** Reset cursor for flowing text; returns starting y */

function flowAt(y: number) { doc.x = M; doc.y = y; return y; }



/** Heading 1 — full-width section band with left accent */

function H1(text: string): number {

  ensure(52);

  doc.save();

  doc.rect(0, L.y - 4, PAGE_W, 44).fillColor(C.bgCard).fill();

  doc.rect(0, L.y - 4, 5, 44).fillColor(C.primary).fill();

  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(20)

     .text(text, M + 10, L.y + 6, { width: CW - 10, lineBreak: false });

  L.y += 48;

  doc.restore();

  return L.y;

}

/** Heading 2 */

function H2(text: string): number {

  ensure(40);

  L.y += 6;

  doc.save();

  doc.fillColor(C.text).font('Helvetica-Bold').fontSize(13)

     .text(text, M, L.y, { width: CW, lineBreak: false });

  L.y += 18;

  doc.moveTo(M, L.y).lineTo(M + CW, L.y).strokeColor(C.border).lineWidth(0.5).stroke();

  L.y += 8;

  doc.restore();

  return L.y;

}

/** Heading 3 (subsection inside card or pillar) */

function H3(text: string, color = C.text): number {

  ensure(22);

  L.y += 4;

  doc.save();

  doc.fillColor(color).font('Helvetica-Bold').fontSize(10.5)

     .text(text, M, L.y, { width: CW, lineBreak: false });

  L.y += 14;

  doc.restore();

  return L.y;

}

/** Paragraph (returns new Y, auto-paginates via heightOfString) */

function P(text: string, opts: { color?: string; size?: number; bold?: boolean; italic?: boolean; align?: any; x?: number; w?: number; lineGap?: number } = {}): number {

  const x = opts.x ?? M;

  const w = opts.w ?? CW;

  const size = opts.size ?? 10.5;

  const lineGap = opts.lineGap ?? 1.5;

  const font = opts.bold ? 'Helvetica-Bold' : opts.italic ? 'Helvetica-Oblique' : 'Helvetica';



  doc.save();

  doc.font(font).fontSize(size);

  // Compute height for pagination

  let h = doc.heightOfString(text, { width: w, lineGap, align: opts.align });

  // If too tall for current page, break

  if (L.y + h > BOT) {

    doc.restore();

    newPage();

    doc.save();

    doc.font(font).fontSize(size);

    h = doc.heightOfString(text, { width: w, lineGap, align: opts.align });

  }

  doc.fillColor(opts.color ?? C.text)

     .text(text, x, L.y, { width: w, lineGap, align: opts.align ?? 'left' });

  doc.restore();

  L.y += h + 6;

  return L.y;

}

/** Bullet point (single line or multiline, paginates) */

function bullet(text: string, opts: { color?: string; dot?: string; size?: number; indent?: number; bold?: boolean } = {}): number {

  const x = M + (opts.indent ?? 0);

  const w = CW - (opts.indent ?? 0) - 14;

  const size = opts.size ?? 10;

  const font = opts.bold ? 'Helvetica-Bold' : 'Helvetica';



  doc.save();

  doc.font(font).fontSize(size);

  let h = doc.heightOfString(text, { width: w, lineGap: 1.5 });

  if (L.y + h + 2 > BOT) {

    doc.restore();

    newPage();

    doc.save();

    doc.font(font).fontSize(size);

    h = doc.heightOfString(text, { width: w, lineGap: 1.5 });

  }

  doc.circle(x + 3, L.y + 6, 2.5).fillColor(opts.dot ?? C.primary).fill();

  doc.fillColor(opts.color ?? C.text)

     .text(text, x + 14, L.y, { width: w, lineGap: 1.5 });

  doc.restore();

  L.y += h + 5;

  return L.y;

}

/** Pill / tag — drawn at (x,y), returns its width (does NOT change L.y) */

function pill(x: number, y: number, text: string, bg: string, fg = '#fff', size = 8): number {

  doc.save();

  doc.font('Helvetica-Bold').fontSize(size);

  const tw = doc.widthOfString(text);

  const w = tw + 12;

  const h = size + 6;

  doc.roundedRect(x, y, w, h, h / 2).fillColor(bg).fill();

  doc.fillColor(fg).text(text, x + 6, y + 3, { width: tw + 0.5, lineBreak: false });

  doc.restore();

  return w;

}

/** Row of pills starting at (x,y), gap 4. Returns total width. */

function pillRow(x: number, y: number, items: { t: string; bg: string; fg?: string }[], gap = 5): number {

  let cx = x;

  items.forEach(p => {

    const w = pill(cx, y, p.t, p.bg, p.fg ?? '#fff');

    cx += w + gap;

  });

  return cx - x;

}

/** Horizontal divider */

function divider(): number {

  L.y += 6;

  doc.save();

  doc.moveTo(M, L.y).lineTo(M + CW, L.y).strokeColor(C.border).lineWidth(0.5).stroke();

  doc.restore();

  L.y += 6;

  return L.y;

}



// ─── CHARTS ─────────────────────────────────────────────────────────────────



/** Radar chart drawn at center (cx, cy) — does NOT move L.y */

function radar(cx: number, cy: number, radius: number, labels: string[], series: { name: string; data: number[]; color: string }[]) {

  doc.save();

  const n = labels.length;

  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;



  // grid (4 levels)

  for (let lvl = 1; lvl <= 4; lvl++) {

    const r = (radius * lvl) / 4;

    for (let i = 0; i < n; i++) {

      const a = ang(i);

      const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);

      if (i === 0) doc.moveTo(x, y); else doc.lineTo(x, y);

    }

    doc.closePath().strokeColor(lvl === 4 ? C.textM : C.border).lineWidth(lvl === 4 ? 0.7 : 0.4).stroke();

  }

  // axes

  for (let i = 0; i < n; i++) {

    const a = ang(i);

    doc.moveTo(cx, cy).lineTo(cx + radius * Math.cos(a), cy + radius * Math.sin(a))

       .strokeColor(C.border).lineWidth(0.4).stroke();

  }

  // labels

  doc.fillColor(C.text).font('Helvetica-Bold').fontSize(9);

  for (let i = 0; i < n; i++) {

    const a = ang(i);

    const lx = cx + (radius + 16) * Math.cos(a) - 30;

    const ly = cy + (radius + 16) * Math.sin(a) - 6;

    doc.text(labels[i], lx, ly, { width: 60, align: 'center', lineBreak: false });

  }

  // series

  series.forEach(s => {

    const pts: [number, number][] = s.data.map((v, i) => {

      const a = ang(i);

      const r = (radius * Math.min(100, Math.max(0, v))) / 100;

      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];

    });

    pts.forEach(([x, y], i) => i === 0 ? doc.moveTo(x, y) : doc.lineTo(x, y));

    doc.closePath();

    doc.fillColor(s.color).fillOpacity(0.18).fill();

    pts.forEach(([x, y], i) => i === 0 ? doc.moveTo(x, y) : doc.lineTo(x, y));

    doc.closePath().strokeColor(s.color).lineWidth(1.5).stroke();

    pts.forEach(([x, y]) => doc.circle(x, y, 2.2).fillColor(s.color).fill());

  });

  doc.fillOpacity(1);

  doc.restore();

}

/** Legend block under the radar — moves L.y */

function legend(items: { name: string; color: string }[]) {

  ensure(items.length * 14 + 8);

  doc.save();

  doc.font('Helvetica').fontSize(9).fillColor(C.text);

  let y = L.y;

  items.forEach(it => {

    doc.rect(M + 30, y + 2, 12, 8).fillColor(it.color).fill();

    doc.fillColor(C.text).text(it.name, M + 46, y, { width: CW - 50, lineBreak: false });

    y += 14;

  });

  doc.restore();

  L.y = y + 4;

}



/** Matrix 2x2 — drawn in a fixed box of width w, height h at current L.y. Updates L.y. */

function matrix2x2(w: number, h: number, opts: {

  title: string;

  xLabel: string; yLabel: string;

  xLow: string; xHigh: string; yLow: string; yHigh: string;

  quadrants: [string, string, string, string]; // BL, BR, TL, TR

  points: { label: string; x: number; y: number; color: string }[];

}) {

  // Required height = title (16) + box h + axis labels (24) + legend below

  const needed = 16 + h + 30;

  ensure(needed);

  doc.save();

  doc.fillColor(C.text).font('Helvetica-Bold').fontSize(10)

     .text(opts.title, M, L.y, { width: CW, align: 'center', lineBreak: false });

  L.y += 16;



  const x = M + 60;            // box X (room for Y label)

  const y = L.y;

  const colors = [C.greenBg, C.goldBg, C.orangeBg, C.redBg];

  doc.rect(x,         y + h / 2, w / 2, h / 2).fillColor(colors[0]).fill();

  doc.rect(x + w / 2, y + h / 2, w / 2, h / 2).fillColor(colors[1]).fill();

  doc.rect(x,         y,         w / 2, h / 2).fillColor(colors[2]).fill();

  doc.rect(x + w / 2, y,         w / 2, h / 2).fillColor(colors[3]).fill();



  // quadrant labels

  doc.fillColor(C.textL).font('Helvetica-Oblique').fontSize(7.5);

  doc.text(opts.quadrants[0], x + 6,       y + h - 16, { width: w / 2 - 12, lineBreak: false });

  doc.text(opts.quadrants[1], x + w / 2 + 6, y + h - 16, { width: w / 2 - 12, lineBreak: false });

  doc.text(opts.quadrants[2], x + 6,       y + 6,       { width: w / 2 - 12, lineBreak: false });

  doc.text(opts.quadrants[3], x + w / 2 + 6, y + 6,       { width: w / 2 - 12, lineBreak: false });



  // borders

  doc.rect(x, y, w, h).strokeColor(C.textM).lineWidth(0.7).stroke();

  doc.moveTo(x + w / 2, y).lineTo(x + w / 2, y + h).strokeColor(C.textM).lineWidth(0.5).stroke();

  doc.moveTo(x, y + h / 2).lineTo(x + w, y + h / 2).strokeColor(C.textM).lineWidth(0.5).stroke();



  // points

  opts.points.forEach(pt => {

    const px = x + (pt.x / 100) * w;

    const py = y + h - (pt.y / 100) * h;

    doc.circle(px, py, 7).fillColor(pt.color).fill();

    doc.circle(px, py, 7).strokeColor('#fff').lineWidth(1.5).stroke();

    doc.fillColor('#fff').font('Helvetica-Bold').fontSize(7.5)

       .text(pt.label, px - 4, py - 3.5, { width: 8, align: 'center', lineBreak: false });

  });



  // X axis label below

  doc.fillColor(C.textL).font('Helvetica-Bold').fontSize(8);

  doc.text(opts.xLow,  x,         y + h + 4, { width: w / 2 - 8, align: 'center', lineBreak: false });

  doc.text(opts.xHigh, x + w / 2 + 8, y + h + 4, { width: w / 2 - 8, align: 'center', lineBreak: false });

  doc.fillColor(C.text).font('Helvetica-Bold').fontSize(8.5);

  doc.text(opts.xLabel, x, y + h + 16, { width: w, align: 'center', lineBreak: false });



  // Y axis label rotated

  doc.save();

  doc.translate(x - 22, y + h / 2);

  doc.rotate(-90);

  doc.fillColor(C.text).font('Helvetica-Bold').fontSize(8.5)

     .text(opts.yLabel, -50, -4, { width: 100, align: 'center', lineBreak: false });

  doc.restore();



  doc.restore();

  L.y = y + h + 30;

}



/** Horizontal bar chart inside CW — moves L.y */

function barChartH(items: { label: string; value: number; color: string; max?: number }[]) {

  const lh = 22;

  const labelW = 90;

  const barW = CW - labelW - 50;

  const total = items.length * lh + 6;

  ensure(total);

  doc.save();

  items.forEach((it, i) => {

    const yy = L.y + i * lh;

    doc.fillColor(C.text).font('Helvetica').fontSize(9)

       .text(it.label, M, yy + 4, { width: labelW, lineBreak: false });

    const max = it.max ?? 100;

    const bw = (Math.min(it.value, max) / max) * barW;

    doc.rect(M + labelW, yy + 3, barW, 12).fillColor(C.bgCard).fill();

    doc.rect(M + labelW, yy + 3, bw, 12).fillColor(it.color).fill();

    doc.fillColor(C.text).font('Helvetica-Bold').fontSize(9)

       .text(`${it.value}`, M + labelW + barW + 6, yy + 4, { width: 30, lineBreak: false });

  });

  doc.restore();

  L.y += total;

}



/** Gantt chart — moves L.y */

function gantt(phases: { label: string; start: number; end: number; color: string }[], totalDays = 90) {

  const lh = 24;

  const labelW = 170;

  const barW = CW - labelW - 16;

  const needed = phases.length * lh + 28;

  ensure(needed);

  doc.save();

  // Axis ticks

  doc.fillColor(C.textL).font('Helvetica-Bold').fontSize(8);

  ['J0', 'J30', 'J60', 'J90'].forEach((d, i) => {

    const xx = M + labelW + (i / 3) * barW;

    doc.text(d, xx - 10, L.y, { width: 20, align: 'center', lineBreak: false });

  });

  L.y += 12;

  // Vertical grid

  for (let i = 0; i <= 3; i++) {

    const xx = M + labelW + (i / 3) * barW;

    doc.moveTo(xx, L.y).lineTo(xx, L.y + phases.length * lh)

       .strokeColor(C.border).lineWidth(0.4).stroke();

  }

  phases.forEach((ph, i) => {

    const yy = L.y + i * lh;

    doc.fillColor(C.text).font('Helvetica-Bold').fontSize(9)

       .text(ph.label, M, yy + 6, { width: labelW - 6, lineBreak: false });

    const x1 = M + labelW + (ph.start / totalDays) * barW;

    const x2 = M + labelW + (ph.end / totalDays) * barW;

    doc.roundedRect(x1, yy + 4, x2 - x1, 14, 3).fillColor(ph.color).fill();

    doc.fillColor('#fff').font('Helvetica-Bold').fontSize(8)

       .text(`J${ph.start}-${ph.end}`, x1 + 4, yy + 7, { width: x2 - x1 - 8, lineBreak: false });

  });

  doc.restore();

  L.y += phases.length * lh + 6;

}



/** Waterfall chart — moves L.y */

function waterfall(h: number, items: { label: string; value: number; type: 'in' | 'out' | 'sum' }[]) {

  ensure(h + 24);

  doc.save();

  const n = items.length;

  const gap = 6;

  const barW = (CW - (n - 1) * gap) / n;

  // pre-pass cumulative

  let cumul = 0;

  const states = items.map(it => {

    if (it.type === 'sum') { cumul = it.value; return { top: it.value, bot: 0, val: it.value }; }

    if (it.type === 'in')  { const top = cumul + it.value; const bot = cumul; cumul = top; return { top, bot, val: it.value }; }

    /* out */               { const top = cumul; const bot = cumul - it.value; cumul = bot; return { top, bot, val: it.value }; }

  });

  const max = Math.max(...states.map(s => Math.max(s.top, s.bot, 0)));

  const baseY = L.y + h - 20;

  const scale = (h - 30) / Math.max(max, 1);



  items.forEach((it, i) => {

    const xx = M + i * (barW + gap);

    const s = states[i];

    const yTop = baseY - s.top * scale;

    const yBot = baseY - s.bot * scale;

    const bh = Math.max(2, Math.abs(yBot - yTop));

    const color = it.type === 'sum' ? (it.value >= 0 ? C.primary : C.red)

                : it.type === 'in'  ? C.green : C.red;

    doc.rect(xx, Math.min(yTop, yBot), barW, bh).fillColor(color).fill();

    doc.fillColor(C.text).font('Helvetica-Bold').fontSize(7.5)

       .text(`${it.value > 0 ? '+' : ''}${it.value}`, xx, Math.min(yTop, yBot) - 11, { width: barW, align: 'center', lineBreak: false });

    doc.fillColor(C.textL).font('Helvetica').fontSize(7)

       .text(it.label, xx - 4, baseY + 4, { width: barW + 8, align: 'center' });

  });

  // baseline

  doc.moveTo(M, baseY).lineTo(M + CW, baseY).strokeColor(C.textM).lineWidth(0.6).stroke();

  doc.restore();

  L.y += h + 4;

}



// ─── SCORE UTILITIES ────────────────────────────────────────────────────────

/** Returns the display color for a score 0-100 */

function scoreColor(s: number): string {

  if (s >= 65) return C.green;

  if (s >= 50) return C.blue;

  if (s >= 40) return C.amber;

  return C.red;

}

/** Circular arc gauge at (cx, cy) radius r — does NOT move L.y */

function scoreArc(cx: number, cy: number, r: number, score: number, fgColor: string, bgColor = '#e5e7eb') {

  doc.save();

  const _fullSteps = 72;

  for (let i = 0; i <= _fullSteps; i++) {

    const a = -Math.PI / 2 + (i / _fullSteps) * 2 * Math.PI;

    if (i === 0) doc.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));

    else         doc.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));

  }

  doc.closePath().strokeColor(bgColor).lineWidth(12).stroke();

  const _sSteps = Math.max(3, Math.round((score / 100) * _fullSteps));

  for (let i = 0; i <= _sSteps; i++) {

    const a = -Math.PI / 2 + (i / _sSteps) * (score / 100) * 2 * Math.PI;

    if (i === 0) doc.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));

    else         doc.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));

  }

  doc.strokeColor(fgColor).lineWidth(12).stroke();

  doc.restore();

}



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// PAGE 1 — COUVERTURE

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



currentSection = 'Couverture';

const LP = 222;            // left dark panel width

const RX = LP + 6;         // right content x

const RW = PAGE_W - RX - M; // right content width



// === FOND DES PANNEAUX ===

doc.save();

doc.rect(0, 0, LP, PAGE_H).fillColor(C.navy).fill();

doc.rect(LP, 0, 5, PAGE_H).fillColor(C.primary).fill();

doc.rect(LP + 5, 0, PAGE_W - LP - 5, PAGE_H).fillColor('#ffffff').fill();

doc.rect(0, 0, PAGE_W, 4).fillColor(C.primaryD).fill();

doc.restore();



// === PANNEAU GAUCHE — SCORE & BRANDING ===

doc.save();

let lp = 16;  // curseur gauche Y



doc.fillColor(C.primary).font('Helvetica-Bold').fontSize(10)

   .text('EPITAPHE360', 12, lp, { width: LP - 24, align: 'center', lineBreak: false });

lp += 14;

doc.fillColor('#6688aa').font('Helvetica').fontSize(6.5)

   .text('CABINET DE CONSEIL STRATEGIQUE', 12, lp, { width: LP - 24, align: 'center', lineBreak: false });

lp += 12;

doc.moveTo(30, lp).lineTo(LP - 30, lp).strokeColor('#2e5a9c').lineWidth(0.5).stroke();

lp += 14;



const ringCx = LP / 2;

const ringCy = lp + 62;   // ring starts right after header

const ringR = 62;

scoreArc(ringCx, ringCy, ringR, R.score.global, C.amber, '#2e5a9c');



doc.fillColor(C.amber).font('Helvetica-Bold').fontSize(46)

   .text(`${R.score.global}`, ringCx - 40, ringCy - 30, { width: 80, align: 'center', lineBreak: false });

doc.fillColor('#aabbdd').font('Helvetica').fontSize(11)

   .text('/ 100', ringCx - 30, ringCy + 18, { width: 60, align: 'center', lineBreak: false });

lp = ringCy + ringR + 12;



doc.roundedRect(24, lp, LP - 48, 22, 11).fillColor(C.navyL).fill();

doc.fillColor(C.amber).font('Helvetica-Bold').fontSize(9)

   .text(`Niveau ${R.score.niveau}  -  ${R.score.label}`, 24, lp + 7, { width: LP - 48, align: 'center', lineBreak: false });

lp += 30;



doc.moveTo(30, lp).lineTo(LP - 30, lp).strokeColor('#2e5a9c').lineWidth(0.5).stroke();

lp += 10;



// Mini barres de benchmark

const benchItems = [

  { l: `Vous  ${R.score.global}/100`, v: R.score.global, c: C.amber   },

  { l: `Moy. MENA  38/100`,           v: 38,              c: '#6688aa' },

  { l: `Top 25%  65/100`,             v: 65,              c: '#4499cc' },

];

benchItems.forEach(b => {

  const bw = LP - 44;

  doc.fillColor(b.c).font('Helvetica').fontSize(7)

     .text(b.l, 22, lp, { width: bw, lineBreak: false });

  lp += 10;

  doc.roundedRect(22, lp, bw, 6, 3).fillColor(C.navyL).fill();

  doc.roundedRect(22, lp, Math.max(4, (b.v / 100) * bw), 6, 3).fillColor(b.c).fill();

  lp += 14;

});

lp += 6;



doc.moveTo(30, lp).lineTo(LP - 30, lp).strokeColor('#2e5a9c').lineWidth(0.5).stroke();

lp += 10;



doc.fillColor('#6688aa').font('Helvetica').fontSize(7.5)

   .text(R.meta.date, 12, lp, { width: LP - 24, align: 'center', lineBreak: false });

lp += 14;

doc.fillColor(C.primary).font('Helvetica-Bold').fontSize(8.5)

   .text('CONFIDENTIEL', 12, lp, { width: LP - 24, align: 'center', lineBreak: false });

lp += 14;

doc.fillColor('#6688aa').font('Helvetica').fontSize(7)

   .text('COMEX UNIQUEMENT', 12, lp, { width: LP - 24, align: 'center', lineBreak: false });

doc.restore();



// === PANNEAU DROIT — CONTENU (curseur py fluide pour éviter superpositions) ===

doc.save();

let py = 20;



doc.fillColor(C.primary).font('Helvetica-Bold').fontSize(8)

   .text('ÉDITION MAROC 2026', RX + 8, py, { width: RW, lineBreak: false });

py += 14;



doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(17)

   .text(R.meta.titre, RX + 8, py, { width: RW });

py = doc.y + 6;



doc.fillColor(C.textL).font('Helvetica-Oblique').fontSize(9.5)

   .text(R.meta.sousTitre, RX + 8, py, { width: RW });

py = doc.y + 5;



doc.fillColor(C.textM).font('Helvetica').fontSize(8.5)

   .text(R.meta.client, RX + 8, py, { width: RW, lineBreak: false });

py += 14;



doc.moveTo(RX + 8, py).lineTo(PAGE_W - M, py).strokeColor(C.border).lineWidth(0.5).stroke();

py += 8;



doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(8.5)

   .text('VERDICT DU SENIOR PARTNER', RX + 8, py, { width: RW, lineBreak: false });

py += 14;



doc.fillColor(C.text).font('Helvetica-Oblique').fontSize(9.5)

   .text(`« ${R.meta.verdict} »`, RX + 8, py, { width: RW, lineGap: 2 });

py = doc.y + 10;



doc.moveTo(RX + 8, py).lineTo(PAGE_W - M, py).strokeColor(C.border).lineWidth(0.5).stroke();

py += 8;



doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(8.5)

   .text('3 CHIFFRES CLES', RX + 8, py, { width: RW, lineBreak: false });

py += 14;



const chW2 = (RW - 12) / 3;

const chCardH = 74;

R.chiffres.forEach((c, i) => {

  const cx2 = RX + 8 + i * (chW2 + 6);

  doc.roundedRect(cx2, py, chW2, chCardH, 5).fillColor(C.bgSoft).fill();

  doc.roundedRect(cx2, py, chW2, chCardH, 5).strokeColor(C.border).lineWidth(0.5).stroke();

  doc.fillColor(C.amber).font('Helvetica-Bold').fontSize(16)

     .text(c.v, cx2 + 4, py + 10, { width: chW2 - 8, align: 'center', lineBreak: false });

  if (c.u) doc.fillColor(C.textL).font('Helvetica').fontSize(7)

              .text(c.u, cx2 + 4, py + 30, { width: chW2 - 8, align: 'center', lineBreak: false });

  doc.fillColor(C.text).font('Helvetica-Bold').fontSize(7)

     .text(c.l.toUpperCase(), cx2 + 4, py + 42, { width: chW2 - 8, align: 'center' });

  doc.fillColor(C.textL).font('Helvetica-Oblique').fontSize(6.5)

     .text(c.i, cx2 + 4, py + 57, { width: chW2 - 8, align: 'center' });

});

py += chCardH + 10;



doc.moveTo(RX + 8, py).lineTo(PAGE_W - M, py).strokeColor(C.border).lineWidth(0.5).stroke();

py += 8;



doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(8.5)

   .text('3 MESSAGES CLES', RX + 8, py, { width: RW, lineBreak: false });

py += 14;



R.messages.forEach((m, i) => {

  const dotColor = i === 0 ? C.red : i === 1 ? C.primaryD : C.amber;

  doc.circle(RX + 17, py + 7, 8).fillColor(dotColor).fill();

  doc.fillColor('#fff').font('Helvetica-Bold').fontSize(9)

     .text(`${i + 1}`, RX + 13, py + 3, { width: 8, align: 'center', lineBreak: false });

  doc.fillColor(C.text).font('Helvetica').fontSize(9.5)

     .text(m, RX + 30, py, { width: RW - 32, lineBreak: false });

  py += 26;

});

py += 8;



doc.moveTo(RX + 8, py).lineTo(PAGE_W - M, py).strokeColor(C.border).lineWidth(0.5).stroke();

py += 8;



// Périmètre / disclaimer juste après les messages

doc.fillColor(C.textM).font('Helvetica-Oblique').fontSize(7)

   .text(R.meta.perimetre, RX + 8, py, { width: RW, lineGap: 1 });

doc.restore();



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// PAGE 2 — SOMMAIRE (placeholder pages, real numbers via 2nd pass)

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



const tocItems = [

  ['1.',  'Synthèse du Senior Partner',                   'synthese'],

  ['2.',  'Synthèse exécutive (COMEX)',                   'execsum'],

  ['3.',  'Positionnement stratégique',                   'pos'],

  ['4.',  'Profil de maturité — Radar 5 dimensions',      'radar'],

  ['5.',  'Matrice des risques (Probabilité × Impact)',   'matrisques'],

  ['6.',  'Matrice des opportunités (Facilité × Valeur)', 'matopp'],

  ['7.',  'Analyse approfondie par dimension PROOF™',     'piliers'],

  ['8.',  'Top 5 recommandations stratégiques',           'recos'],

  ['9.',  'Plan d\'action 90 jours (Gantt)',              'gantt'],

  ['10.', 'Scénarios de projection à 12 mois',            'scenar'],

  ['11.', 'Gouvernance & budget (BRUT vs NET)',           'gouv'],

  ['12.', 'Change Management & stakeholders',             'change'],

  ['13.', 'Cas références Maroc anonymisés',              'cas'],

  ['14.', 'Message au dirigeant & appel à l\'action',     'msg'],

  ['A.',  'Annexe — Récapitulatif Leviers Maroc',         'annexe'],

];

const anchors: Record<string, number> = {};

const tocRows: Record<string, number> = {}; // remember the doc-page index of TOC + y for each row to redraw page nums



newPage('Sommaire');

H1('Sommaire');

const tocPageIdx = doc.bufferedPageRange().count - 1;

tocItems.forEach(([n, label, key]) => {

  ensure(22);

  doc.save();

  doc.fillColor(C.primary).font('Helvetica-Bold').fontSize(10)

     .text(n, M, L.y, { width: 26, lineBreak: false });

  doc.fillColor(C.text).font('Helvetica').fontSize(10)

     .text(label, M + 30, L.y, { width: CW - 80, lineBreak: false });

  // dotted leader

  const lblW = doc.widthOfString(label);

  const dx0 = M + 30 + lblW + 8;

  const dx1 = M + CW - 40;

  for (let dx = dx0; dx < dx1; dx += 4) doc.circle(dx, L.y + 6, 0.6).fillColor(C.textM).fill();

  doc.restore();

  tocRows[key] = L.y;

  L.y += 20;

});



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// 1. SYNTHÈSE

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



newPage('1. Synthèse du Senior Partner');

anchors['synthese'] = doc.bufferedPageRange().count;

H1('1. Synthèse du Senior Partner');

R.synthese.forEach(par => { P(par); L.y += 8; });



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// 2. EXEC SUMMARY + 3. POSITIONNEMENT

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



newPage('2. Synthèse exécutive');

anchors['execsum'] = doc.bufferedPageRange().count;

H1('2. Synthèse exécutive (COMEX)');

P(R.exec);



anchors['pos'] = doc.bufferedPageRange().count;

H2('3. Positionnement stratégique');

R.positionnement.forEach(po => {

  ensure(90);

  const cardY2 = L.y;

  doc.save();

  doc.roundedRect(M, cardY2, CW, 78, 6).fillColor(C.bgSoft).fill();

  doc.fillColor(C.text).font('Helvetica-Bold').fontSize(10)

     .text(po.t, M + 12, cardY2 + 10, { width: CW - 110, lineBreak: false });

  doc.fillColor(po.c).font('Helvetica-Bold').fontSize(14)

     .text(po.v, PAGE_W - M - 100, cardY2 + 8, { width: 88, align: 'right', lineBreak: false });

  doc.fillColor(C.textL).font('Helvetica').fontSize(9.5)

     .text(po.b, M + 12, cardY2 + 30, { width: CW - 24, lineGap: 1.5 });

  doc.restore();

  L.y = cardY2 + 86;

});



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// 4. RADAR

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



newPage('4. Radar de maturité');

anchors['radar'] = doc.bufferedPageRange().count;

H1('4. Profil de maturité PROOF™');

P('Représentation de votre score sur les 5 dimensions du modèle PROOF™ (ImpactTrace™), comparé à la moyenne MENA, au top 25% MENA et au leader sectoriel Maroc.', { color: C.textL });



L.y += 10;

const radarSize = 130;

radar(M + CW / 2, L.y + radarSize + 10, radarSize,

  R.pillars.map(x => x.label),

  [

    { name: 'Vous (41/100)',            data: R.pillars.map(x => x.score),  color: C.primary },

    { name: 'Moyenne MENA (38/100)',    data: R.pillars.map(x => x.mena),   color: C.textM   },

    { name: 'Top 25% MENA (60/100)',    data: R.pillars.map(x => x.top25),  color: C.purple  },

    { name: 'Leader sectoriel (78/100)', data: R.pillars.map(x => x.leader), color: C.gold    },

  ]

);

L.y += radarSize * 2 + 40;



legend([

  { name: 'Vous (41/100)',            color: C.primary },

  { name: 'Moyenne MENA (38/100)',    color: C.textM   },

  { name: 'Top 25% MENA (60/100)',    color: C.purple  },

  { name: 'Leader sectoriel (78/100)', color: C.gold    },

]);



H3('Lecture du radar');

P('• Forme aplatie (écart 3 pts entre min et max) = absence de locomotive interne.\n• Owned Inside (43) seul axe au-dessus du benchmark MENA — actif différenciant à structurer.\n• Écart au leader (-37 pts) = coût d\'opportunité 1.4-2.8M MAD sur 18 mois.\n• Cible 12 mois (62/100, scénario Base) refermerait l\'écart au top 25% à -3 pts seulement.', { color: C.textL });



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// 5. MATRICE RISQUES

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



newPage('5. Matrice des risques');

anchors['matrisques'] = doc.bufferedPageRange().count;

H1('5. Matrice des risques');

const probMap: Record<string, number> = { 'Faible': 22, 'Moyenne': 50, 'Élevée': 78 };

const impactMap: Record<string, number> = { 'Moyen': 22, 'Élevé': 55, 'Critique': 82 };

matrix2x2(380, 220, {

  title: 'PROBABILITÉ × IMPACT',

  xLabel: 'PROBABILITÉ', yLabel: 'IMPACT',

  xLow: 'Faible', xHigh: 'Élevée',

  yLow: 'Moyen',  yHigh: 'Critique',

  quadrants: ['Surveiller', 'Surveiller renforcé', 'Atténuer', 'ZONE CRITIQUE'],

  points: R.risques.map((r, i) => ({

    label: `${i + 1}`,

    x: probMap[r.proba] ?? 50,

    y: impactMap[r.impact] ?? 50,

    color: r.impact === 'Critique' ? C.red : r.impact === 'Élevé' ? C.orange : C.gold,

  })),

});



H3('Détail des risques quantifiés');

R.risques.forEach((r, i) => {

  ensure(95);

  const cardY3 = L.y;

  doc.save();

  doc.roundedRect(M, cardY3, CW, 88, 5).fillColor(C.redBg).fill();

  doc.circle(M + 18, cardY3 + 18, 11).fillColor(C.red).fill();

  doc.fillColor('#fff').font('Helvetica-Bold').fontSize(11)

     .text(`${i + 1}`, M + 12, cardY3 + 13, { width: 12, align: 'center', lineBreak: false });

  doc.fillColor(C.red).font('Helvetica-Bold').fontSize(10)

     .text(r.r, M + 38, cardY3 + 10, { width: CW - 50 });

  const titleH = doc.heightOfString(r.r, { width: CW - 50 });

  // pills row

  pillRow(M + 38, cardY3 + 14 + titleH, [

    { t: `Proba ${r.proba}`,   bg: C.textM },

    { t: `Impact ${r.impact}`, bg: C.red },

    { t: r.horizon,            bg: C.textL },

    { t: r.cout,               bg: C.red },

  ]);

  doc.fillColor(C.green).font('Helvetica-Oblique').fontSize(8.5)

     .text(`> Mitigation : ${r.mit}`, M + 38, cardY3 + 32 + titleH, { width: CW - 50 });

  doc.restore();

  L.y = cardY3 + 96;

});



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// 6. MATRICE OPPORTUNITÉS

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



newPage('6. Matrice des opportunités');

anchors['matopp'] = doc.bufferedPageRange().count;

H1('6. Matrice des opportunités');

const facMap: Record<string, number> = { 'Faible': 22, 'Moyenne': 50, 'Élevée': 78 };

const valMap: Record<string, number> = { 'Faible': 22, 'Moyenne': 55, 'Élevée': 82 };

matrix2x2(380, 220, {

  title: 'FACILITÉ × VALEUR',

  xLabel: 'FACILITÉ D\'EXÉCUTION', yLabel: 'VALEUR ATTENDUE',

  xLow: 'Faible', xHigh: 'Élevée',

  yLow: 'Faible', yHigh: 'Élevée',

  quadrants: ['Abandonner', 'Capitaliser', 'Investir', 'QUICK WINS'],

  points: R.opportunites.map((o, i) => ({

    label: `${i + 1}`,

    x: facMap[o.fac] ?? 50,

    y: valMap[o.val] ?? 50,

    color: o.val === 'Élevée' && o.fac === 'Élevée' ? C.green : o.val === 'Élevée' ? C.blue : C.purple,

  })),

});



H3('Détail des opportunités quantifiées');

R.opportunites.forEach((o, i) => {

  ensure(85);

  const cy = L.y;

  doc.save();

  doc.roundedRect(M, cy, CW, 78, 5).fillColor(C.greenBg).fill();

  doc.circle(M + 18, cy + 18, 11).fillColor(C.green).fill();

  doc.fillColor('#fff').font('Helvetica-Bold').fontSize(11)

     .text(`${i + 1}`, M + 12, cy + 13, { width: 12, align: 'center', lineBreak: false });

  doc.fillColor(C.green).font('Helvetica-Bold').fontSize(10)

     .text(o.o, M + 38, cy + 10, { width: CW - 50 });

  const titleH = doc.heightOfString(o.o, { width: CW - 50 });

  pillRow(M + 38, cy + 14 + titleH, [

    { t: `Facilité ${o.fac}`, bg: C.textM },

    { t: `Valeur ${o.val}`,   bg: C.green },

    { t: o.horizon,           bg: C.textL },

    { t: o.valEst,            bg: C.green },

  ]);

  doc.fillColor(C.text).font('Helvetica').fontSize(8.5)

     .text(`> Action : ${o.act}`, M + 38, cy + 32 + titleH, { width: CW - 50 });

  doc.restore();

  L.y = cy + 86;

});



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// 7. PILIERS

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



newPage('7. Analyse par dimension PROOF™');

anchors['piliers'] = doc.bufferedPageRange().count;

H1('7. Analyse approfondie par dimension');

P('Pour chacune des 5 dimensions du modèle PROOF™ : diagnostic ancré, analyse causale, benchmark sectoriel Maroc, et Quick Win opérationnel.', { color: C.textL });



R.pillars_d.forEach((pa, pi) => {

  if (pi === 0) {

    ensure(200);

  } else {

    currentSection = `7. ${pa.id} — ${pa.label}`;

    ensure(420);

    L.y += 8;

    doc.save();

    doc.rect(M, L.y, CW, 2).fillColor(C.primary).fill();

    doc.restore();

    L.y += 14;

  }

  // header card

  ensure(60);

  const hy = L.y;

  doc.save();

  doc.roundedRect(M, hy, CW, 50, 6).fillColor(C.bgSoft).fill();

  doc.fillColor(C.primary).font('Helvetica-Bold').fontSize(8)

     .text(`POIDS ${pa.weight}%`, M + 14, hy + 8, { lineBreak: false });

  doc.fillColor(C.text).font('Helvetica-Bold').fontSize(15)

     .text(`${pa.id} — ${pa.label}`, M + 14, hy + 20, { width: CW - 100, lineBreak: false });

  doc.fillColor(scoreColor(pa.score)).font('Helvetica-Bold').fontSize(28)

     .text(`${pa.score}`, PAGE_W - M - 80, hy + 6, { width: 70, align: 'right', lineBreak: false });

  doc.fillColor(C.textL).font('Helvetica').fontSize(9)

     .text('/100', PAGE_W - M - 80, hy + 36, { width: 70, align: 'right', lineBreak: false });

  doc.restore();

  L.y = hy + 60;



  P(pa.diag);



  H3('Analyse causale — Pourquoi ce score ?', C.orange);

  P(pa.cause, { color: C.textL });



  H3('Comparaison avec les entreprises similaires', C.blue);

  barChartH([

    { label: 'Vous',     value: pa.bench.vous,   color: scoreColor(pa.bench.vous) },

    { label: 'Moy MENA', value: pa.bench.mena,   color: C.textM   },

    { label: 'Top 25%',  value: pa.bench.top25,  color: C.purple  },

    { label: 'Leader',   value: pa.bench.leader, color: C.gold    },

  ]);

  P(pa.benchI, { color: C.textL, size: 9 });



  // Quick win card

  ensure(60);

  const qy = L.y;

  doc.save();

  doc.roundedRect(M, qy, CW, 56, 6).fillColor(C.greenBg).fill();

  doc.fillColor(C.primaryD).font('Helvetica-Bold').fontSize(10)

     .text('QUICK WIN', M + 14, qy + 10, { lineBreak: false });

  doc.fillColor(C.text).font('Helvetica').fontSize(9.5)

     .text(pa.qw, M + 14, qy + 26, { width: CW - 28, lineGap: 1 });

  doc.restore();

  L.y = qy + 64;

});



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// 8. TOP 5 RECOS

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



newPage('8. Top 5 recommandations');

anchors['recos'] = doc.bufferedPageRange().count;

H1('8. Top 5 recommandations stratégiques');

P('Chaque recommandation : narratif stratégique, business case (BRUT et NET après leviers Maroc), RACI, méthodologie, et un encart dédié aux dispositifs marocains activables.', { color: C.textL });



R.recos.forEach((rec, ri) => {

  if (ri === 0) {

    ensure(200);

  } else {

    currentSection = `8. Reco ${rec.n}/5`;

    ensure(420);

    L.y += 8;

    doc.save();

    doc.rect(M, L.y, CW, 2).fillColor(C.primary).fill();

    doc.restore();

    L.y += 14;

  }



  // Title row

  ensure(40);

  doc.save();

  doc.circle(M + 14, L.y + 12, 13).fillColor(C.primary).fill();

  doc.fillColor('#fff').font('Helvetica-Bold').fontSize(13)

     .text(`${rec.n}`, M + 8, L.y + 6, { width: 12, align: 'center', lineBreak: false });

  doc.fillColor(C.text).font('Helvetica-Bold').fontSize(13)

     .text(rec.title, M + 38, L.y + 4, { width: CW - 50 });

  const tH = doc.heightOfString(rec.title, { width: CW - 50 });

  doc.restore();

  L.y += Math.max(28, tH + 10);



  P(rec.narr);



  // Tags row

  ensure(20);

  pillRow(M, L.y, [

    { t: `Impact ${rec.impact}`, bg: C.red },

    { t: `Effort ${rec.effort}`, bg: C.textL },

    { t: rec.timeline,           bg: C.primary },

    { t: rec.methodo,            bg: C.purple },

  ]);

  L.y += 22;



  // Business case card

  ensure(80);

  const by = L.y;

  doc.save();

  doc.roundedRect(M, by, CW, 78, 6).fillColor(C.greenBg).fill();

  doc.fillColor(C.primaryD).font('Helvetica-Bold').fontSize(9)

     .text('BUSINESS CASE', M + 12, by + 8, { lineBreak: false });

  const bcCw = (CW - 24) / 5;

  const bcRow = by + 24;

  const bcs = [

    { l: 'INVEST. BRUT',  v: rec.bcInvest, c: C.text },

    { l: 'INVEST. NET *', v: rec.bcNet,    c: C.primaryD },

    { l: 'GAIN ANNUEL',   v: rec.bcGain,   c: C.green },

    { l: 'PAYBACK',       v: rec.bcPay,    c: C.text },

    { l: 'ROI 3 ANS',     v: rec.bcRoi,    c: C.primary },

  ];

  bcs.forEach((x, k) => {

    const cx = M + 12 + k * bcCw;

    doc.fillColor(C.textL).font('Helvetica-Bold').fontSize(7)

       .text(x.l, cx, bcRow, { width: bcCw - 6 });

    doc.fillColor(x.c).font('Helvetica-Bold').fontSize(9)

       .text(x.v, cx, bcRow + 12, { width: bcCw - 6 });

  });

  doc.fillColor(C.textL).font('Helvetica-Oblique').fontSize(7.5)

     .text('* NET = après leviers Maroc', M + 12, by + 62, { width: CW - 24, lineBreak: false });

  doc.restore();

  L.y = by + 86;



  // RACI strip

  ensure(50);

  const ry = L.y;

  doc.save();

  doc.roundedRect(M, ry, CW, 44, 6).fillColor(C.blueBg).fill();

  doc.fillColor(C.blue).font('Helvetica-Bold').fontSize(9)

     .text('RACI', M + 12, ry + 8, { lineBreak: false });

  const racCw = (CW - 24) / 4;

  const rac = [

    ['R (Responsable)', rec.raci.r],

    ['A (Imputable)',   rec.raci.a],

    ['C (Consultés)',   rec.raci.c],

    ['I (Informés)',    rec.raci.i],

  ];

  rac.forEach((x, k) => {

    const cx = M + 12 + k * racCw;

    doc.fillColor(C.textL).font('Helvetica-Bold').fontSize(7)

       .text(x[0], cx, ry + 18, { width: racCw - 6 });

    doc.fillColor(C.text).font('Helvetica').fontSize(8.5)

       .text(x[1], cx, ry + 28, { width: racCw - 6 });

  });

  doc.restore();

  L.y = ry + 50;



  // Encart Leviers Maroc

  ensure(40 + rec.maroc.length * 38 + 20);

  const my = L.y;

  // Pre-compute height

  let mh = 28; // header

  rec.maroc.forEach(lv => {

    const descH = doc.font('Helvetica').fontSize(8.5).heightOfString(lv.a, { width: CW - 28, lineGap: 1 });

    const cdH   = doc.font('Helvetica-Oblique').fontSize(7.5).heightOfString(`Condition : ${lv.cd}`, { width: CW - 28, lineGap: 1 });

    mh += 16 + descH + cdH + 8;

  });

  mh += 24; // net summary line

  doc.save();

  doc.roundedRect(M, my, CW, mh, 8).fillColor(C.goldBg).fill();

  doc.roundedRect(M, my, CW, mh, 8).strokeColor(C.gold).lineWidth(1).stroke();

  H3('Leviers financiers Maroc activables', C.gold);

  let lvY = my + 30;

  rec.maroc.forEach(lv => {

    doc.fillColor(C.text).font('Helvetica-Bold').fontSize(9)

       .text(lv.n, M + 14, lvY, { width: CW - 110, lineBreak: false });

    pill(PAGE_W - M - 90, lvY - 2, lv.t, C.gold);

    lvY += 14;

    doc.fillColor(C.text).font('Helvetica').fontSize(9)

       .text(lv.a, M + 14, lvY, { width: CW - 28, lineGap: 1.5 });

    lvY += doc.heightOfString(lv.a, { width: CW - 28, lineGap: 1.5 }) + 2;

    doc.fillColor(C.textL).font('Helvetica-Oblique').fontSize(7.5)

       .text(`Condition : ${lv.cd}`, M + 14, lvY, { width: CW - 28, lineGap: 1 });

    lvY += doc.heightOfString(`Condition : ${lv.cd}`, { width: CW - 28, lineGap: 1 }) + 6;

  });

  doc.fillColor(C.primaryD).font('Helvetica-Bold').fontSize(9.5)

     .text(rec.net, M + 14, lvY + 2, { width: CW - 28, lineGap: 1.5 });

  doc.restore();

  L.y = my + mh + 8;

});



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// 9. PLAN 90 JOURS + GANTT

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



newPage('9. Plan d\'action 90 jours');

anchors['gantt'] = doc.bufferedPageRange().count;

H1('9. Plan d\'action 90 jours');

P('Roadmap structurée en 3 phases avec instances, livrables, KPIs et budgets BRUT/NET.', { color: C.textL });



L.y += 6;

gantt([

  { label: 'Phase 1 — Mobilisation & Cadrage',  start: 1,  end: 30, color: C.blue },

  { label: 'Phase 2 — Quick Wins',              start: 31, end: 60, color: C.primary },

  { label: 'Phase 3 — Capitalisation & Scale',  start: 61, end: 90, color: C.purple },

  { label: 'Recrutement CSO (Tahfiz)',          start: 14, end: 60, color: C.gold },

  { label: 'Dépôt Tamwilcom Damane Express',    start: 25, end: 50, color: C.orange },

  { label: 'Mandat Label CGEM RSE (cible M9)',  start: 75, end: 90, color: C.green },

  { label: 'Plan formation OFPPT CSF',           start: 80, end: 90, color: C.red },

]);



R.plan.forEach((phase) => {

  ensure(120);

  doc.save();

  doc.rect(M, L.y, CW, 3).fillColor(C.primary).fill();

  doc.restore();

  L.y += 8;

  doc.save();

  doc.fillColor(C.text).font('Helvetica-Bold').fontSize(12)

     .text(`${phase.ph} (${phase.wk})`, M, L.y, { width: CW });

  L.y = doc.y + 2;

  doc.fillColor(C.textL).font('Helvetica-Oblique').fontSize(9.5)

     .text(phase.obj, M, L.y, { width: CW });

  L.y = doc.y + 6;

  doc.restore();

  phase.acts.forEach(a => bullet(a));

  L.y += 4;



  // Livrable / KPI / Budget rows

  const rows: [string, string, string][] = [

    ['Livrable', phase.livr, C.textL],

    ['KPI cible', phase.kpi, C.purple],

    ['Budget', phase.bud, C.primaryD],

  ];

  rows.forEach(([label, val, color]) => {

    ensure(20);

    doc.save();

    doc.fillColor(C.text).font('Helvetica-Bold').fontSize(9)

       .text(label, M, L.y, { width: 80, lineBreak: false });

    doc.fillColor(color).font('Helvetica').fontSize(9)

       .text(val, M + 84, L.y, { width: CW - 84 });

    L.y = doc.y + 4;

    doc.restore();

  });

  divider();

});



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// 10. SCÉNARIOS + WATERFALL

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



newPage('10. Scénarios de projection');

anchors['scenar'] = doc.bufferedPageRange().count;

H1('10. Scénarios de projection à 12 mois');



R.scenarios.forEach(s => {

  ensure(110);

  const cy = L.y;

  doc.save();

  doc.roundedRect(M, cy, CW, 100, 8).fillColor(C.bgSoft).fill();

  doc.roundedRect(M, cy, CW, 100, 8).strokeColor(s.color).lineWidth(1).stroke();

  doc.fillColor(s.color).font('Helvetica-Bold').fontSize(10)

     .text(s.l, M + 14, cy + 12, { width: 110, lineBreak: false });

  doc.fillColor(C.text).font('Helvetica-Bold').fontSize(34)

     .text(`${s.s}`, M + 14, cy + 28, { width: 110, lineBreak: false });

  doc.fillColor(C.textL).font('Helvetica').fontSize(8)

     .text('/100  · 12 mois', M + 14, cy + 70, { width: 110, lineBreak: false });

  doc.fillColor(C.gold).font('Helvetica-Bold').fontSize(9)

     .text(`BRUT : ${s.brut}`, M + 140, cy + 14, { width: CW - 160, lineBreak: false });

  doc.fillColor(C.primaryD).font('Helvetica-Bold').fontSize(9)

     .text(`NET : ${s.net}`, M + 140, cy + 30, { width: CW - 160, lineBreak: false });

  doc.fillColor(C.text).font('Helvetica').fontSize(9)

     .text(s.desc, M + 140, cy + 48, { width: CW - 160, lineGap: 1 });

  doc.fillColor(C.textL).font('Helvetica-Oblique').fontSize(8)

     .text(`Conditions : ${s.cond}`, M + 14, cy + 84, { width: CW - 28, lineBreak: false });

  doc.restore();

  L.y = cy + 108;

});



H3('Waterfall ROI - scenario Base (en k MAD)', C.green);

P('Transformation Investissement BRUT > Leviers Maroc > Investissement NET > Gains annuels (cumul 3 ans).', { color: C.textL, size: 9 });

L.y += 4;

waterfall(170, [

  { label: 'Invest BRUT',  value: 1350, type: 'sum' },

  { label: 'Tahfiz',       value: 280,  type: 'out' },

  { label: 'OFPPT CSF',    value: 180,  type: 'out' },

  { label: 'AMDIE',        value: 80,   type: 'out' },

  { label: 'Don déduct.',  value: 90,   type: 'out' },

  { label: 'Invest NET',   value: 720,  type: 'sum' },

  { label: 'Gain an 1',    value: 800,  type: 'in' },

  { label: 'Gain an 2',    value: 1100, type: 'in' },

  { label: 'Gain an 3',    value: 1100, type: 'in' },

]);



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// 11. GOUVERNANCE

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



ensure(80, '11. Gouvernance & budget');

anchors['gouv'] = doc.bufferedPageRange().count;

H1('11. Gouvernance & budget');



R.gouv.forEach(([k, v]) => {

  ensure(36);

  const cy = L.y;

  doc.save();

  doc.roundedRect(M, cy, CW, 30, 4).fillColor(C.bgSoft).fill();

  doc.fillColor(C.primary).font('Helvetica-Bold').fontSize(9)

     .text(k, M + 12, cy + 10, { width: 140, lineBreak: false });

  doc.fillColor(C.text).font('Helvetica').fontSize(9)

     .text(v, M + 160, cy + 10, { width: CW - 170, lineGap: 1 });

  doc.restore();

  L.y = cy + 36;

});



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// 12. CHANGE MANAGEMENT

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



ensure(80, '12. Change Management');

anchors['change'] = doc.bufferedPageRange().count;

H1('12. Change Management');

H2('Parties prenantes — positionnement et plan d\'engagement');

R.stake.forEach(s => {

  ensure(58);

  const cy = L.y;

  const postureColor = s.p === 'Promoteur' || s.p === 'Allié' ? C.green

                     : s.p === 'Sceptique' ? C.orange

                     : s.p === 'Opposant'  ? C.red : C.textL;

  doc.save();

  doc.roundedRect(M, cy, CW, 52, 5).fillColor(C.bgSoft).fill();

  doc.fillColor(C.text).font('Helvetica-Bold').fontSize(10)

     .text(s.g, M + 12, cy + 10, { width: CW - 110, lineBreak: false });

  doc.restore();

  pill(PAGE_W - M - 90, cy + 10, s.p, postureColor);

  doc.save();

  doc.fillColor(C.textL).font('Helvetica').fontSize(9)

     .text(`Enjeu : ${s.en}`, M + 12, cy + 26, { width: CW - 24 });

  doc.fillColor(C.green).font('Helvetica-Oblique').fontSize(9)

     .text(`> Action : ${s.a}`, M + 12, cy + 38, { width: CW - 24 });

  doc.restore();

  L.y = cy + 58;

});



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// 13. CAS RÉFÉRENCES

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



newPage('13. Cas références Maroc');

anchors['cas'] = doc.bufferedPageRange().count;

H1('13. Cas références (anonymisés Maroc)');



R.cas.forEach((c, i) => {

  ensure(160);

  doc.save();

  doc.rect(M, L.y, CW, 3).fillColor(C.primary).fill();

  doc.restore();

  L.y += 8;

  doc.save();

  doc.fillColor(C.text).font('Helvetica-Bold').fontSize(11)

     .text(`Cas ${i + 1} — ${c.sect}`, M, L.y, { width: CW });

  L.y = doc.y + 6;

  doc.fillColor(C.textL).font('Helvetica-Bold').fontSize(9)

     .text('Situation départ : ', M, L.y, { width: 100, lineBreak: false });

  doc.fillColor(C.text).font('Helvetica').fontSize(9)

     .text(c.depart, M + 100, L.y, { width: CW - 100 });

  L.y = doc.y + 6;

  doc.fillColor(C.textL).font('Helvetica-Bold').fontSize(9)

     .text('Actions clefs :', M, L.y, { width: CW });

  L.y = doc.y + 4;

  doc.restore();

  c.acts.forEach(a => bullet(a));

  doc.save();

  doc.fillColor(C.green).font('Helvetica-Bold').fontSize(9)

     .text('Résultats :', M, L.y, { width: 80, lineBreak: false });

  doc.fillColor(C.text).font('Helvetica').fontSize(9)

     .text(c.res, M + 92, L.y, { width: CW - 92 });

  L.y = doc.y + 4;

  doc.fillColor(C.textL).font('Helvetica-Oblique').fontSize(8.5)

     .text(c.duree, M, L.y, { width: CW });

  L.y = doc.y + 4;

  doc.restore();

  divider();

});



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// 14. MESSAGE + CTA

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



newPage('14. Message au dirigeant');

anchors['msg'] = doc.bufferedPageRange().count;

H1('14. Message au dirigeant');

doc.save();

doc.rect(M, L.y, CW, 3).fillColor(C.primary).fill();

doc.restore();

L.y += 10;

P(R.message, { italic: true, lineGap: 2 });

L.y += 12;



H2('Appel à l\'action');

ensure(110);

const cy2 = L.y;

doc.save();

doc.roundedRect(M, cy2, CW, 100, 8).fillColor(C.greenBg).fill();

doc.roundedRect(M, cy2, CW, 100, 8).strokeColor(C.primary).lineWidth(1).stroke();

doc.fillColor(C.primaryD).font('Helvetica-Bold').fontSize(10.5)

   .text(R.cta, M + 14, cy2 + 14, { width: CW - 28, align: 'justify', lineGap: 2 });

doc.restore();

L.y = cy2 + 108;



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// ANNEXE — LEVIERS MAROC

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



newPage('A. Annexe — Récapitulatif Leviers Maroc');

anchors['annexe'] = doc.bufferedPageRange().count;

H1('Annexe A — Récapitulatif Leviers Maroc');

P('Synthèse des dispositifs fiscaux, financiers, économiques et de formation activables au Maroc. Tous les chiffres sont indicatifs (à valider avec votre fiscaliste/banquier).', { color: C.textL });



R.annexe.forEach(grp => {

  ensure(60);

  doc.save();

  doc.rect(M, L.y, CW, 3).fillColor(grp.color).fill();

  doc.restore();

  L.y += 8;

  doc.save();

  doc.fillColor(grp.color).font('Helvetica-Bold').fontSize(12)

     .text(grp.cat, M, L.y, { width: CW, lineBreak: false });

  L.y = doc.y + 6;

  doc.restore();



  grp.items.forEach(([n, desc, av, cd]) => {

    // Pre-compute card height

    const descH = doc.font('Helvetica').fontSize(8.5).heightOfString(desc, { width: CW - 24, lineGap: 1 });

    const cdH   = doc.font('Helvetica-Oblique').fontSize(7.5).heightOfString(`Condition : ${cd}`, { width: CW - 24, lineGap: 1 });

    const cardH3 = 22 + descH + cdH + 12;

    ensure(cardH3 + 6);

    const cy3 = L.y;

    doc.save();

    doc.roundedRect(M, cy3, CW, cardH3, 4).fillColor(C.bgSoft).fill();

    doc.fillColor(C.text).font('Helvetica-Bold').fontSize(9)

       .text(n, M + 12, cy3 + 8, { width: CW * 0.55 - 12, lineBreak: false });

    doc.fillColor(C.green).font('Helvetica-Bold').fontSize(9)

       .text(av, M + 12 + CW * 0.55, cy3 + 8, { width: CW * 0.45 - 24, align: 'right' });

    doc.fillColor(C.textL).font('Helvetica').fontSize(8.5)

       .text(desc, M + 12, cy3 + 22, { width: CW - 24, lineGap: 1 });

    doc.fillColor(C.textM).font('Helvetica-Oblique').fontSize(7.5)

       .text(`Condition : ${cd}`, M + 12, cy3 + 22 + descH + 2, { width: CW - 24, lineGap: 1 });

    doc.restore();

    L.y = cy3 + cardH3 + 4;

  });

  L.y += 4;

});



// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?

// 2nd PASS — TOC page numbers + footer pagination

// �?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?�?



const range = doc.bufferedPageRange();

// Fill TOC page numbers (TOC is page index = tocPageIdx)

doc.switchToPage(tocPageIdx);

const savedBottomTOC = doc.page.margins.bottom;

doc.page.margins.bottom = 0;

tocItems.forEach(([_, _2, key]) => {

  const y = tocRows[key];

  const targetPage = anchors[key];

  doc.fillColor(C.textL).font('Helvetica').fontSize(9)

     .text(`p. ${targetPage}`, PAGE_W - M - 36, y, { width: 36, align: 'right', lineBreak: false });

});

doc.page.margins.bottom = savedBottomTOC;



// Footer + page numbers on every page (skip page 1 cover)

for (let i = 0; i < range.count; i++) {

  doc.switchToPage(range.start + i);

  if (i === 0) continue; // cover has its own footer band

  doc.save();

  // Disable auto-page-break while drawing below the margin

  const savedBottom = doc.page.margins.bottom;

  doc.page.margins.bottom = 0;

  doc.moveTo(M, PAGE_H - 44).lineTo(M + CW, PAGE_H - 44).strokeColor(C.border).lineWidth(0.4).stroke();

  doc.fillColor(C.textM).font('Helvetica').fontSize(7.5)

     .text('Epitaphe360  |  Rapport Intelligence™  |  Édition Maroc 2026  |  CONFIDENTIEL',

           M, PAGE_H - 32, { width: CW * 0.7, align: 'left', lineBreak: false });

  doc.fillColor(C.textM).font('Helvetica-Bold').fontSize(7.5)

     .text(`Page ${i + 1} / ${range.count}`,

           PAGE_W - M - 80, PAGE_H - 32, { width: 80, align: 'right', lineBreak: false });

  doc.page.margins.bottom = savedBottom;

  doc.restore();

}



doc.end();

console.log(`✓ PDF tier-1 Maroc régénéré : ${outPath}`);



