# Cahier des Charges Technique & Fonctionnel — Epitaphe360
> Version 2.0 — 30 mars 2026  
> Portail B2B Haut de Gamme + Plateforme de Scoring Intelligence — React/Vite/TypeScript / Tailwind CSS / CMS Headless  
> Mise à jour : Intégration du portefeuille BMI 360™ (7 outils de scoring + dashboard agrégateur C-suite)

---

## Table des Matières

1. [Module Frontend & Expérience Utilisateur (UX/UI)](#1-module-frontend--expérience-utilisateur-uxui)
2. [Module Événements Stratégiques & Architecture de Marque](#2-module-événements-stratégiques--architecture-de-marque)
3. [Module La Fabrique & Innovation 3D](#3-module-la-fabrique--innovation-3d)
4. [Module Lead Generation & Outils Interactifs](#4-module-lead-generation--outils-interactifs)
5. [Module CMS, SEO & Performance](#5-module-cms-seo--performance)
6. [Module Espace Client & PWA (Phase 2)](#6-module-espace-client--pwa-phase-2)
7. [**Module BMI 360™ — Portefeuille de Scoring Intelligence**](#7-module-bmi-360--portefeuille-de-scoring-intelligence)

---

## 7. Module BMI 360™ — Portefeuille de Scoring Intelligence

> Benchmark mondial réalisé le 24 mars 2026.  
> Stratégie validée : créer des outils propriétaires de diagnostic et scoring qui attirent des prospects, démontrent l'expertise et convertissent en missions. C'est le meilleur levier d'acquisition B2B identifié en 2025-2026.

### 7.0 Vision Stratégique

Les 6 outils forment un **écosystème, pas une collection**. Chaque outil est autonome et génère ses propres leads, mais ensemble ils convergent vers le BMI 360™. Structure en entonnoir : un client entre par un pôle (souvent celui où il a le plus mal), découvre les autres lacunes via le rapport, et finit par commander le BMI 360™ complet.

**Innovations transversales (signature propriétaire Epitaphe360) :**
- **Dual/Triple Voice Score** — mesurer l'écart entre ce que la direction croit et ce que les équipes vivent
- **ROI Calculator financier** en page d'accueil — transformer un problème abstrait en chiffre concret avant le scoring
- **Photo-Audit / Upload document** — déclenche une analyse IA instantanée
- **5 niveaux de maturité nommés** pour chaque outil
- **Rapport bilingue FR/AR** adapté au contexte MENA
- **Restitution humaine 45 minutes** avec un expert Epitaphe360

**Phases de déploiement :**
- Phase 1 (6-9 mois) : CommPulse™, TalentPrint™, SafeSignal™ (quick wins)
- Phase 2 (9-18 mois) : BMI 360™ Brand Maturity Index (différenciation)
- Phase 3 (18-36 mois) : SaaS white-label + expansion MENA (Tunisie, Algérie, Égypte, Émirats)

---

### 7.1 CommPulse™ — Communication Interne Intelligence

**Tagline :** "Feel the heartbeat of your organization"  
**Sous-titre :** The Internal Communication Intelligence Platform by Epitaphe360  
**Prix :** 4 900 MAD  
**Modèle :** CLARITY™

**Benchmark :** Firstup, Staffbase (éditeurs logiciels) mesurent l'outil, pas la stratégie. 71% des employés insatisfaits de leur com interne. Cadres seniors perdent 63 jours/an → coût 54 860$/an par senior à +200K$/an.

**5 différenciateurs uniques :**
1. Scoring sectoriel (comparé à votre secteur, pas au monde entier)
2. Calcul du coût financier réel de la communication défaillante
3. Recommandations actionnables signées Epitaphe360 (pas des conseils génériques)
4. Rapport bilingue FR/AR adapté au contexte MENA
5. Restitution humaine de 45 min avec un expert

**Modèle CLARITY™ (7 piliers × 6 questions = 42 questions) :**
- **C**ohérence — alignement message/valeurs
- **L**iens — canaux et flux d'information
- **A**ttention — qualité d'écoute managériale
- **R**ésultats — impact mesurable sur la performance
- **I**nclusion — équité d'accès à l'information
- **T**ransparence — clarté des décisions stratégiques
- **Y**ou (Engagement) — implication des collaborateurs

**Architecture technique :**
```
/outils/commpulse
  ├── Landing page avec ROI Calculator
  │     └── Calcul : effectif × salaire moyen × facteur CLARITY (0.18) = coût estimé
  ├── Questionnaire multi-étapes (7 piliers × 6 questions)
  │     ├── Réponses : 1-5 (jamais → toujours)
  │     └── Variant Direction (A) vs Terrain (B) pour le Dual Voice Score
  └── Résultats
        ├── Score global /100
        ├── Radar chart 7 axes
        ├── Dual Voice Gap affiché
        ├── Benchmark sectoriel MENA
        └── PDF rapport + CTA restitution 45min
```

---

### 7.2 TalentPrint™ — Marque Employeur Intelligence

**Tagline :** "Your employer brand, decoded."  
**Prix :** 7 500 MAD  
**Modèle :** ATTRACT™

**Benchmark :** PeopleScout Outthink Index (9 composantes, digital-only, ne touche pas au vécu terrain). Gartner : EVP convaincant → réduction turnover 69%, coûts recrutement -50%.

**Insight central :** Les meilleures organisations consacrent 80% de leurs efforts à tenir leurs promesses EVP et 20% à les définir. TalentPrint™ révèle où se situe cet écart et combien il coûte.

**Modèle ATTRACT™ (6 dimensions) :**
- **A**uthenticité — cohérence discours/réalité vécue
- **T**alent Magnet — pouvoir d'attraction des profils cibles
- **T**urnover DNA — facteurs de rétention profonds
- **R**eputation Digitale — présence Glassdoor, LinkedIn, réseaux
- **A**mbassadeurs — niveau d'advocacy des employés actuels
- **C**ulture Fitness — alignement culture/valeurs/pratiques
- **T**ransition — expérience d'onboarding et d'offboarding

**Innovation clé : Gap Score Double Voix**  
Deux versions du questionnaire : direction vs employés. L'écart chiffré devient le premier argument commercial.

---

### 7.3 ImpactTrace™ — RSE Intelligence

**Tagline :** "Walk the talk, prove the impact."  
**Prix :** 8 400 MAD  
**Modèle :** PROOF™

**Contexte MENA :** 43% des 500 premières entreprises marocaines se déclarent RSE (2025, vs 27% en 2023). Seulement 124 ont le label CGEM dont 37 PME. 91% des consommateurs pensent que les marques font du greenwashing.

**Innovation centrale : Walk vs Talk Score™**  
Mesure l'écart entre les déclarations positives des dirigeants et les actions réelles. Premier outil accessible aux ETI MENA à quantifier cet écart de manière systématique.

**Modèle PROOF™ :**
- **P**lateforme RSE — structure et gouvernance
- **R**eputation — perception externe et crédibilité
- **O**pérations — empreinte environnementale réelle
- **O**uverture communautaire — ancrage territorial
- **F**ormation — engagement et culture RSE interne

**Argument CSRD urgent :** Entreprises marocaines exportant vers l'Europe soumises aux exigences de la CSRD via leurs donneurs d'ordre européens. ImpactTrace™ contextualise les résultats selon cette exposition réglementaire.

---

### 7.4 SafeSignal™ — QHSE/SST Intelligence

**Tagline :** "See the gap before it becomes an accident."  
**Prix :** 7 900 MAD  
**Modèle :** SHIELD™

**Insight central (National Safety Council) :** Les responsables sécurité évaluent systématiquement leur culture de manière plus positive que les employés de terrain. 30% des travailleurs ressentant de la douleur ne le signalent pas → **Safety Perception Gap™**.

**80-90% des blessures** causées par des erreurs humaines prévenables par la communication, pas par des équipements.

**Modèle SHIELD™ :**
- **S**ignaux faibles — détection précoce des risques
- **H**iérarchie sécurité — leadership visible et engagé
- **I**mpact terrain — communication opérateurs/managers
- **E**ngagement total — implication de toute la chaîne
- **L**earning culture — feedback et amélioration continue
- **D**ispositifs physiques — signalétique, PLV, espaces sécurité

**Innovation : SafeWalk™**  
Upload de 12 photos terrain → IA génère un brief de production signalétique et d'habillage d'espace.

---

### 7.5 EventImpact™ — Événementiel Intelligence

**Tagline :** "Every event has a score. What's yours?"  
**Prix :** 7 900 MAD  
**Modèle :** STAGE™

**Benchmark :** 64% des responsables événementiels peinent à prouver le ROI. 58% s'appuient sur des métriques de vanité. 40% du ROI événementiel provient de l'impact long terme sur la marque.

**Innovation : Triple Temporalité**  
- Mode **Rétrospectif** — analyser un événement passé
- Mode **Anticipatif** — planifier les objectifs avant le jour J
- Mode **Annuel** — évaluer la stratégie événementielle globale

**Modèle STAGE™ :**
- **S**tratégie — alignement événement/objectifs business
- **T**argeting — adéquation audience/message
- **A**mbiance de marque — cohérence identité/scénographie
- **G**eneration de leads/ROI — mesure de l'impact commercial
- **E**ngagement — activation du public et suivi post-événement

**Innovation : Brand Coherence Score™**  
Mesure simultanément le ROI stratégique ET la cohérence de marque événementielle — seul Epitaphe360 peut adresser opérationnellement ces deux dimensions.

---

### 7.6 SpaceScore™ — Brand Physique Intelligence

**Tagline :** "Your spaces speak. Are they saying the right thing?"  
**Prix :** 6 500 MAD  
**Modèle :** SPACE™

**Data :** 76% des consommateurs entrent dans des magasins uniquement en raison de la signalétique. 68% ont payé car la signalétique a attiré leur regard. Différence de 25% de productivité entre bureaux "confortables" vs "inconfortables".

**Modèle SPACE™ (5 dimensions) :**
- **S**ignalétique — clarté, cohérence, impact visuel
- **P**résence de marque — identité physique territoire
- **A**mbiance globale — atmosphère et wellbeing
- **C**ohérence — alignement entre espaces et valeurs d'entreprise
- **E**xpérience visiteur — parcours client, wayfinding

**Innovation : Photo-Audit 12 zones + First Impression Test™**  
Upload de 12 photos d'espaces → IA génère une Brand Space Map™ + budget estimatif de mise à niveau.

---

### 7.7 FinNarrative™ — Communication Financière Intelligence

**Tagline :** "Turn compliance into conviction."  
**Prix :** 9 900 MAD  
**Modèle :** CAPITAL™

**Cible :** DG, DAF, Conseil d'Administration — interlocuteur le plus décisionnaire.

**Context réglementaire :** AMMC 2025 — nouvelles recommandations pour sociétés cotées : rapport financier annuel structuré et homogène, communiqué de presse dans un journal d'annonces légales, résultats AG publiés sous 15 jours.

**Insight :** Beaucoup de dirigeants financiers estiment que le reporting financier s'est "dégénéré" en un exercice de conformité plutôt qu'une démarche pour informer les parties prenantes.

**Modèle CAPITAL™ :**
- **C**larté narrative — lisibilité et structure du discours financier
- **A**lignement stratégique — cohérence avec la vision d'entreprise
- **P**erformance visuelle — qualité des supports (rapport annuel, présentations)
- **I**mpact investisseurs — crédibilité et confiance des parties prenantes
- **T**ransparence — conformité et accessibilité de l'information
- **A**nticipation — proactivité dans la communication de crise
- **L**ecture benchmark — positionnement vs pairs sectoriels

**Innovation : Narrative Doctor™**  
Upload du rapport annuel (PDF) → IA identifie 4 pathologies narratives en 3 minutes. Moment de prise de conscience immédiate pour le DG.

---

### 7.8 BMI 360™ — Brand Maturity Index Dashboard C-suite

**Tagline :** "One score to see it all."  
**Prix :** 9 900 MAD  
**Positionnement :** Aucune agence en Afrique du Nord ne propose un scoring multi-pôles intégré.

**Principe :** Agrège les 6 scores sectoriels en un indice global de maturité de communication, comparable par secteur et taille d'entreprise.

**Tableau synthèse du portefeuille :**

| Outil | Modèle | Innovation clé | Prix |
|-------|--------|---------------|------|
| CommPulse™ | CLARITY™ | Coût com défaillante | 4 900 MAD |
| TalentPrint™ | ATTRACT™ | Gap Score Double Voix | 7 500 MAD |
| ImpactTrace™ | PROOF™ | Walk vs Talk Score | 8 400 MAD |
| SafeSignal™ | SHIELD™ | Safety Perception Gap | 7 900 MAD |
| EventImpact™ | STAGE™ | Brand Coherence Score | 7 900 MAD |
| SpaceScore™ | SPACE™ | Photo-Audit 12 zones | 6 500 MAD |
| FinNarrative™ | CAPITAL™ | Narrative Doctor™ | 9 900 MAD |
| **BMI 360™** | Agrégateur | Dashboard C-suite 6 pôles | **9 900 MAD** |

**Architecture technique du dashboard BMI 360™ :**
```
/outils/bmi360
  ├── Hero avec simulateur d'impact (chiffre coût global)
  ├── Radar chart 6 pôles avec scores agrégés
  ├── Benchmark sectoriel MENA (anonymisé)
  ├── Comparaison re-scoring (avant/après mission)
  ├── Recommandations priorisées par ROI
  └── CTA : commander un BMI 360™ complet
```

**Modèle de données BMI 360™ :**
```typescript
interface BMI360Score {
  companyId: string;
  sector: 'pharma' | 'auto' | 'finance' | 'tech' | 'energie' | 'luxury' | 'autre';
  companySize: 'tpe' | 'pme' | 'eti' | 'ge';
  scores: {
    commPulse?: number;    // /100
    talentPrint?: number;  // /100
    impactTrace?: number;  // /100
    safeSignal?: number;   // /100
    eventImpact?: number;  // /100
    spaceScore?: number;   // /100
    finNarrative?: number; // /100
  };
  bmi360Global?: number;   // moyenne pondérée /100
  createdAt: Date;
  version: number;         // permet le re-scoring comparatif
}
```

---

### 7.9 Architecture Technique Commune — Moteur de Scoring

```typescript
// lib/scoring-engine.ts

interface ScoringQuestion {
  id: string;
  pillar: string;
  text: string;
  textAR?: string;      // Traduction arabe
  weight: number;       // 1-3 (importance relative)
  reverseScored?: boolean; // Question inversée
}

interface ScoringResult {
  toolId: string;
  companyName: string;
  sector: string;
  pillarScores: Record<string, number>;
  globalScore: number;
  maturityLevel: 1 | 2 | 3 | 4 | 5;
  maturityLabel: string;
  gap?: { direction: number; terrain: number; delta: number };
  roiEstimate?: number;
  recommendations: string[];
  benchmarkPercentile?: number;
  createdAt: Date;
}
```

**5 Niveaux de maturité universels :**
1. 🔴 **Fragile** (0-20) — Absence de stratégie structurée
2. 🟠 **Émergent** (21-40) — Initiatives isolées sans cohérence
3. 🟡 **Structuré** (41-60) — Processus en place mais non optimisés
4. 🟢 **Performant** (61-80) — Pratiques solides et mesurables
5. 🔵 **Leader** (81-100) — Excellence et benchmark sectoriel

---

## 1. Module Frontend & Expérience Utilisateur (UX/UI)

### 1.1 Objectif

Définir l'identité visuelle, les interactions utilisateur, la structure de navigation et les performances front-end du portail Epitaphe360. Ce module couvre la conception du mega menu dynamique, les animations, la stratégie mobile-first, la charte graphique, les composants réutilisables et les flux utilisateurs clés.

---

### 1.2 Mega Menu Dynamique

#### 1.2.1 Schéma de données (TypeScript)

```typescript
// types/navigation.ts

export interface NavIcon {
  type: 'svg' | 'png';
  src: string;       // URL de l'icône ou composant SVG inline
  alt: string;
}

export interface NavPreview {
  type: 'image' | 'video';
  src: string;       // URL de la ressource
  poster?: string;   // Miniature pour les vidéos
  alt?: string;
}

export interface NavSubEntry {
  id: string;
  title: string;
  description: string;       // Courte accroche (max 80 caractères)
  icon: NavIcon;
  href: string;              // URL interne ou externe
  preview?: NavPreview;      // Visuel facultatif au survol
  badge?: string;            // Ex: "Nouveau", "Beta"
  isExternal?: boolean;
}

export interface NavEntry {
  id: string;
  title: string;
  href?: string;             // Null si le lien est un déclencheur de mega menu
  subEntries?: NavSubEntry[];
  featured?: NavSubEntry;    // Entrée mise en avant (colonne droite)
  columns?: number;          // Nombre de colonnes pour les sous-entrées (2 ou 3)
}

export interface NavigationConfig {
  entries: NavEntry[];
  cta: {
    label: string;
    href: string;
    variant: 'primary' | 'ghost';
  };
}
```

#### 1.2.2 Exemple de configuration JSON

```json
{
  "entries": [
    {
      "id": "evenements",
      "title": "Événements Stratégiques",
      "columns": 3,
      "subEntries": [
        {
          "id": "conventions",
          "title": "Conventions & Kicks-offs",
          "description": "Concevoir des conventions fédératrices pour aligner vos équipes.",
          "icon": { "type": "svg", "src": "/icons/conventions.svg", "alt": "Conventions" },
          "href": "/evenements/conventions-kickoffs",
          "preview": { "type": "image", "src": "/previews/conventions.webp", "alt": "Convention exemple" }
        },
        {
          "id": "marque-employeur",
          "title": "Marque Employeur",
          "description": "Valoriser votre culture d'entreprise pour attirer les talents.",
          "icon": { "type": "svg", "src": "/icons/marque-employeur.svg", "alt": "Marque Employeur" },
          "href": "/architecture-de-marque/marque-employeur"
        }
      ],
      "featured": {
        "id": "featured-evenements",
        "title": "Voir toutes nos réalisations",
        "description": "Explorez nos études de cas et références sectorielles.",
        "icon": { "type": "svg", "src": "/icons/portfolio.svg", "alt": "Portfolio" },
        "href": "/references"
      }
    }
  ],
  "cta": {
    "label": "Déposer un brief",
    "href": "/contact/brief",
    "variant": "primary"
  }
}
```

#### 1.2.3 Comportement & Interactions (Framer Motion)

```typescript
// components/navigation/MegaMenu.tsx
import { motion, AnimatePresence } from 'framer-motion';

const MENU_OPEN_DELAY = 150;   // ms avant ouverture
const MENU_CLOSE_DELAY = 200;  // ms avant fermeture (évite les fermetures accidentelles)

const megaMenuVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.12, ease: 'easeIn' },
  },
};

const subEntryVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.2, ease: 'easeOut' },
  }),
};

// Adaptation responsive : sur mobile, le mega menu devient un Drawer
// breakpoint : < 1024px → Drawer latéral avec AnimatePresence + slide
const mobileDrawerVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  exit: { x: '-100%', opacity: 0, transition: { duration: 0.2 } },
};
```

#### 1.2.4 Responsive — Transformation en Drawer Mobile

| Breakpoint Tailwind | Comportement |
|---|---|
| `sm` (≥ 640px) | Navigation compacte, pas de sous-menus visibles |
| `md` (≥ 768px) | Navigation simplifiée avec accordéons |
| `lg` (≥ 1024px) | Mega menu complet sur survol |
| `xl` (≥ 1280px) | Mega menu avec colonne "Mis en avant" |

Sur mobile (`< lg`) : le hamburger déclenche un Drawer latéral (`position: fixed`, `z-index: 50`) avec une liste cliquable déployant des accordéons pour les sous-entrées. Un overlay semi-transparent avec `backdrop-blur-sm` recouvre le contenu principal.

---

### 1.3 Animations & Micro-interactions

#### 1.3.1 Stratégie globale

| Type d'animation | Composant ciblé | Propriétés Framer Motion |
|---|---|---|
| Reveal progressif | Sections (au scroll) | `initial: { opacity:0, y:40 }` → `animate: { opacity:1, y:0 }` avec `viewport={{ once:true, margin:"-100px" }}` |
| Parallax Hero | Image/vidéo de fond | `useScroll` + `useTransform` pour déplacer à 30% de la vitesse de scroll |
| Transition de page | `<Layout>` racine | `AnimatePresence` + `motion.div` avec `exit: { opacity:0, y:10 }` |
| Hover carte | `ServiceCard`, `ReferenceCard` | `whileHover: { scale:1.02, y:-2 }` + `transition: { duration:0.2 }` |
| CTA bouton | `<Button>` | `whileHover: { scale:1.04 }` + `whileTap: { scale:0.97 }` |
| Chargement | Skeleton loaders | Pulse CSS Tailwind `animate-pulse` |

#### 1.3.2 Exemple — Section Reveal

```typescript
// components/ui/RevealSection.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface RevealSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function RevealSection({ children, delay = 0, className }: RevealSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

---

### 1.4 Mobile-First & Performance

#### 1.4.1 Breakpoints Tailwind CSS (tailwind.config.ts)

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./client/src/**/*.{tsx,ts}', './cms-dashboard/**/*.{tsx,ts}'],
  theme: {
    screens: {
      sm:  '640px',
      md:  '768px',
      lg:  '1024px',
      xl:  '1280px',
      '2xl': '1536px',
    },
    extend: {
      // Voir section 1.5 pour les tokens de couleurs et typographie
    },
  },
};
export default config;
```

#### 1.4.2 Optimisation Images (Next.js Image)

```tsx
// Exemple d'utilisation correcte
import Image from 'next/image';

<Image
  src="/hero/convention.jpg"
  alt="Convention stratégique Epitaphe360"
  width={1920}
  height={1080}
  priority                // LCP : préchargement pour les images au-dessus de la ligne de flottaison
  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1920px"
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/webp;base64,..."  // URL de blur généré à la build
  className="object-cover w-full h-full"
  // Next.js génère automatiquement WebP et AVIF selon le support navigateur
/>
```

#### 1.4.3 Objectifs Core Web Vitals

| Métrique | Cible | Stratégie |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5 s | `priority` sur images hero, préconnexion CDN, fonts inline, SSR/ISR |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Réserver l'espace images (`width`/`height`), éviter les insertions DOM tardives |
| **FID / INP** | < 100 ms | Code splitting par route, `React.lazy()`, déchargement tâches lourdes via Web Workers |
| **TTFB** | < 800 ms | CDN edge (Vercel Edge Network), ISR avec `revalidate: 3600` |

```typescript
// next.config.ts — Configuration performance
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 jours
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  compress: true,
};
```

---

### 1.5 Charte Graphique

#### 1.5.1 Palette de couleurs

```typescript
// tailwind.config.ts — tokens de couleurs
colors: {
  brand: {
    black:    '#1A1A1A',  // Fond principal, textes primaires
    white:    '#FFFFFF',  // Fonds clairs, textes sur fond sombre
    gold:     '#C8A96E',  // Accent principal : CTA, titres accentués, icônes
    'gold-light': '#DFC28F',  // Hover états
    'gold-dark':  '#A8893E',  // Active états
  },
  sector: {
    industrie: '#2D6A9F',   // Bleu industrie
    sante:     '#2D9F6A',   // Vert santé
    luxe:      '#9F2D5A',   // Bordeaux luxe
    tech:      '#5A2D9F',   // Violet tech
  },
  neutral: {
    50:  '#F9F9F9',
    100: '#F0F0F0',
    200: '#E0E0E0',
    300: '#C0C0C0',
    400: '#909090',
    500: '#606060',
    600: '#404040',
    700: '#303030',
    800: '#202020',
    900: '#1A1A1A',
  },
},
```

**Logique d'application des accents sectoriels** : les pages ou sections liées à un secteur spécifique (Santé, Industrie, Luxe, Tech) appliquent la couleur de ce secteur sur les badges, bordures et titres de niveau H3+, en remplacement du doré global.

#### 1.5.2 Typographie

```typescript
// Polices : Inter (corps) + Playfair Display (titres premium)
fontFamily: {
  sans:    ['Inter', 'system-ui', 'sans-serif'],
  display: ['"Playfair Display"', 'Georgia', 'serif'],
  mono:    ['"JetBrains Mono"', 'monospace'],
},
fontSize: {
  // Corps de texte
  'body-sm':  ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
  'body':     ['1rem',     { lineHeight: '1.6', letterSpacing: '0.01em' }],
  'body-lg':  ['1.125rem', { lineHeight: '1.6' }],
  // Titres
  h6: ['0.875rem', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0.08em' }],
  h5: ['1rem',     { lineHeight: '1.4', fontWeight: '600' }],
  h4: ['1.25rem',  { lineHeight: '1.3', fontWeight: '700' }],
  h3: ['1.5rem',   { lineHeight: '1.3', fontWeight: '700' }],
  h2: ['2rem',     { lineHeight: '1.2', fontWeight: '700' }],
  h1: ['3rem',     { lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.02em' }],
  // Display (héros)
  'display-sm':  ['3.5rem', { lineHeight: '1.05', fontWeight: '800', letterSpacing: '-0.03em' }],
  'display':     ['4.5rem', { lineHeight: '1.0',  fontWeight: '800', letterSpacing: '-0.04em' }],
  'display-lg':  ['6rem',   { lineHeight: '0.95', fontWeight: '800', letterSpacing: '-0.05em' }],
},
```

#### 1.5.3 Ton éditorial & Micro-copy (exemples)

| Contexte | Mauvais exemple | Bon exemple (ton Epitaphe360) |
|---|---|---|
| CTA principal | "Cliquez ici" | "Sécuriser ma performance opérationnelle" |
| Section hero | "Nous faisons des événements" | "Vos conventions deviennent des moteurs de transformation." |
| Confirmation formulaire | "Merci pour votre message" | "Votre brief a bien été reçu. Notre équipe vous contacte sous 24h ouvrées." |
| Erreur de formulaire | "Champ invalide" | "Veuillez renseigner un email professionnel valide." |
| Section preuve | "Nos clients" | "Ils nous font confiance pour des enjeux critiques." |

---

### 1.6 Composants Réutilisables (shadcn/ui + Tailwind)

#### 1.6.1 Architecture des composants

```
client/src/components/
├── ui/                       # Composants atomiques (shadcn/ui customisés)
│   ├── Button.tsx
│   ├── Badge.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Carousel.tsx
│   └── Avatar.tsx
├── composite/                # Composants assemblés
│   ├── ServiceCard.tsx
│   ├── ReferenceCard.tsx
│   ├── TestimonialCard.tsx
│   ├── HeroSection.tsx
│   ├── SectionHeader.tsx
│   └── GoldDivider.tsx
├── navigation/
│   ├── MegaMenu.tsx
│   ├── MobileDrawer.tsx
│   └── Breadcrumb.tsx
├── media/
│   ├── LightboxGallery.tsx
│   ├── VideoPlayer.tsx
│   └── MediaGrid.tsx
└── forms/
    ├── BriefForm.tsx
    ├── ContactForm.tsx
    └── FormStep.tsx
```

#### 1.6.2 Exemple — Button Component

```typescript
// components/ui/Button.tsx
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-gold text-brand-black hover:bg-brand-gold-light active:bg-brand-gold-dark rounded-none px-8 py-3.5 text-sm uppercase tracking-widest',
        secondary:
          'border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black rounded-none px-8 py-3.5 text-sm uppercase tracking-widest',
        ghost:
          'text-brand-gold underline-offset-4 hover:underline px-0 py-0',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 rounded-sm px-6 py-3',
      },
      size: {
        sm:  'text-xs px-5 py-2.5',
        md:  'text-sm px-8 py-3.5',
        lg:  'text-base px-10 py-4',
        icon: 'w-10 h-10 p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  variant, size, isLoading, leftIcon, rightIcon, children, className, ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isLoading || props.disabled}
      {...(props as any)}
    >
      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </motion.button>
  );
}
```

---

### 1.7 Flux Utilisateurs Clés

#### 1.7.1 Navigation principale

```
Accueil
  └── Survol "Événements Stratégiques" dans le menu
        └── Mega menu s'ouvre (délai 150ms)
              ├── Survol d'un sous-service → aperçu visuel affiché à droite
              └── Clic sur "Conventions & Kicks-offs"
                    └── Navigation vers /evenements/conventions-kickoffs
                          ├── Scroll vers Références sectorielles
                          └── Clic CTA "Déposer un brief" → formulaire multi-étapes
```

#### 1.7.2 Galerie photos/vidéos plein écran

```
Page service
  └── Section "Nos réalisations"
        └── Clic sur une miniature
              └── Ouverture Lightbox (AnimatePresence)
                    ├── Navigation flèches gauche/droite (keyboard + touch swipe)
                    ├── Compteur "3 / 12"
                    ├── Bouton fermeture (× ou Escape)
                    └── Barre de progression pour les vidéos
```

**Critères d'acceptation** :
- Le mega menu s'ouvre en ≤ 150ms et se ferme avec 200ms de tolérance.
- Sur mobile, le drawer s'anime en ≤ 300ms.
- La galerie Lightbox supporte le swipe tactile et les touches clavier (←, →, Échap).
- LCP < 2.5s mesuré en Lighthouse sur connexion 4G simulée.

---

## 2. Module Événements Stratégiques & Architecture de Marque

### 2.1 Objectif

Structurer les pages de services des hubs **Événements Stratégiques** et **Architecture de Marque**, gérer leur contenu dynamique via le CMS et optimiser le maillage interne et le SEO.

---

### 2.2 Structure de Page Type (Template Service)

#### 2.2.1 Sections de la page

| # | Section | Description | Modifiable CMS |
|---|---|---|---|
| 1 | **Hero** | Image/vidéo de fond, titre H1, accroche (max 180 car.), badge secteur | ✅ |
| 2 | **Accroche Stratégique** | Paragraphe d'entrée, message clé, statistique d'impact (ex: "92% de NPS") | ✅ |
| 3 | **Détail des Services** | Blocs de contenu (2 à 4 colonnes), liste à puces ou icônes | ✅ |
| 4 | **L'Avantage Fabrique** | Texte court + lien vers /la-fabrique + visuel de l'atelier | ✅ |
| 5 | **Références Sectorielles** | Logos clients filtrables par secteur | ✅ |
| 6 | **Étude de Cas en Vedette** | Carte enrichie avec image, résultats chiffrés, lien | ✅ |
| 7 | **Témoignage** | Citation, nom, poste, logo entreprise | ✅ |
| 8 | **CTA Contextuel** | Bouton(s) personnalisés selon la page | ✅ |

---

### 2.3 Schéma de Données CMS (Sanity.io)

```typescript
// sanity/schemas/service.ts

export const serviceSchema = {
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    { name: 'title',    type: 'string',   title: 'Titre du service',    validation: (R: any) => R.required().max(100) },
    { name: 'slug',     type: 'slug',     title: 'Slug URL',            options: { source: 'title' }, validation: (R: any) => R.required() },
    { name: 'hub',      type: 'string',   title: 'Hub parent',          options: { list: ['evenements', 'architecture-de-marque', 'la-fabrique', 'qhse'] } },
    { name: 'accroche', type: 'text',     title: 'Accroche stratégique', validation: (R: any) => R.max(300) },
    { name: 'heroImage',type: 'image',    title: 'Image Hero',          options: { hotspot: true } },
    { name: 'heroVideo',type: 'url',      title: 'Vidéo Hero (URL)',    description: 'Lien Vimeo ou fichier MP4' },
    {
      name: 'body',
      type: 'array',
      title: 'Contenu détaillé',
      of: [{ type: 'block' }, { type: 'image' }, { type: 'reference', to: [{ type: 'cta' }] }],
    },
    {
      name: 'serviceBlocks',
      type: 'array',
      title: 'Blocs de services',
      of: [{
        type: 'object',
        fields: [
          { name: 'icon',        type: 'image',  title: 'Icône SVG/PNG' },
          { name: 'title',       type: 'string', title: 'Titre du bloc' },
          { name: 'description', type: 'text',   title: 'Description' },
        ],
      }],
    },
    {
      name: 'advantageFabrique',
      type: 'object',
      title: "Avantage La Fabrique",
      fields: [
        { name: 'text', type: 'text',  title: 'Texte de l\'avantage' },
        { name: 'link', type: 'url',   title: 'URL vers La Fabrique' },
      ],
    },
    {
      name: 'references',
      type: 'array',
      title: 'Références clients liées',
      of: [{ type: 'reference', to: [{ type: 'clientReference' }] }],
    },
    {
      name: 'featuredCaseStudy',
      type: 'reference',
      title: 'Étude de cas en vedette',
      to: [{ type: 'caseStudy' }],
    },
    {
      name: 'testimonial',
      type: 'reference',
      title: 'Témoignage client',
      to: [{ type: 'testimonial' }],
    },
    {
      name: 'ctas',
      type: 'array',
      title: 'CTA contextuels',
      of: [{ type: 'reference', to: [{ type: 'cta' }] }],
    },
    { name: 'seoTitle',       type: 'string', title: 'Meta Title (SEO)',       validation: (R: any) => R.max(60) },
    { name: 'seoDescription', type: 'text',   title: 'Meta Description (SEO)', validation: (R: any) => R.max(160) },
    { name: 'keywords',       type: 'array',  title: 'Mots-clés', of: [{ type: 'string' }] },
    {
      name: 'openGraphImage',
      type: 'image',
      title: 'Image Open Graph',
      description: 'Recommandé : 1200×630px',
    },
  ],
  preview: {
    select: { title: 'title', media: 'heroImage', subtitle: 'hub' },
  },
};
```

---

### 2.4 Schéma CTA Contextuel

```typescript
// sanity/schemas/cta.ts
export const ctaSchema = {
  name: 'cta',
  title: 'CTA (Appel à l\'action)',
  type: 'document',
  fields: [
    { name: 'label',     type: 'string', title: 'Texte du bouton', validation: (R: any) => R.required().max(80) },
    { name: 'href',      type: 'url',    title: 'URL cible' },
    { name: 'variant',   type: 'string', title: 'Style', options: { list: ['primary', 'secondary', 'ghost'] } },
    { name: 'icon',      type: 'image',  title: 'Icône optionnelle' },
    { name: 'context',   type: 'string', title: 'Contexte (ex: page QHSE)', description: 'Usage interne pour documentation' },
    { name: 'isExternal',type: 'boolean',title: 'Lien externe ?' },
  ],
};
```

---

### 2.5 Schéma Référence Client

```typescript
// sanity/schemas/clientReference.ts
export const clientReferenceSchema = {
  name: 'clientReference',
  title: 'Référence Client',
  type: 'document',
  fields: [
    { name: 'name',        type: 'string',   title: 'Nom du client',      validation: (R: any) => R.required() },
    { name: 'slug',        type: 'slug',     title: 'Slug',               options: { source: 'name' } },
    { name: 'logo',        type: 'image',    title: 'Logo',               options: { hotspot: false } },
    {
      name: 'sectors',
      type: 'array',
      title: 'Secteurs d\'activité',
      of: [{ type: 'string' }],
      options: {
        list: ['Industrie', 'Santé', 'Luxe & Retail', 'Tech & Digital', 'Finance', 'Énergie', 'Agroalimentaire'],
      },
    },
    { name: 'description', type: 'text',   title: 'Description du projet' },
    { name: 'caseStudyUrl',type: 'url',    title: 'URL de l\'étude de cas' },
    { name: 'isFeatured',  type: 'boolean',title: 'Mise en avant ?' },
    { name: 'order',       type: 'number', title: 'Ordre d\'affichage' },
  ],
};
```

---

### 2.6 SEO & Maillage Interne

#### 2.6.1 Structure d'URLs canoniques

```
/evenements/                                 → Hub Événements Stratégiques
/evenements/conventions-kickoffs             → Sous-service
/evenements/soirees-de-gala                  → Sous-service
/architecture-de-marque/                     → Hub Architecture de Marque
/architecture-de-marque/marque-employeur     → Sous-service
/architecture-de-marque/communication-qhse  → Sous-service
/la-fabrique/                                → Hub La Fabrique
/references/                                 → Toutes les références
/references/[slug]                           → Étude de cas
```

#### 2.6.2 Génération dynamique des balises meta

```typescript
// app/evenements/[slug]/page.tsx
import type { Metadata } from 'next';
import { getServiceBySlug } from '@/lib/sanity';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = await getServiceBySlug('evenements', params.slug);
  return {
    title:       service.seoTitle       ?? `${service.title} | Epitaphe360`,
    description: service.seoDescription ?? service.accroche,
    keywords:    service.keywords?.join(', '),
    openGraph: {
      title:       service.seoTitle ?? service.title,
      description: service.seoDescription ?? service.accroche,
      images: service.openGraphImage
        ? [{ url: service.openGraphImage.url, width: 1200, height: 630 }]
        : [],
      type: 'website',
      locale: 'fr_FR',
    },
    alternates: {
      canonical: `https://epitaphe360.com/evenements/${params.slug}`,
      languages: { 'en-US': `https://epitaphe360.com/en/events/${params.slug}` },
    },
  };
}
```

#### 2.6.3 Maillage interne

- Chaque page de service lien vers → **2 à 3 études de cas** du même secteur.
- Les études de cas lient vers → **services correspondants** + **La Fabrique** si applicable.
- La page Références filtrée par secteur lie vers → **pages de services** du secteur.
- Footer : liens vers toutes les pages de hubs (niveau 1 de profondeur).

**Critères d'acceptation** :
- Chaque page service contient au minimum 1 lien interne entrant et 2 liens internes sortants.
- Le slug est automatiquement généré par Sanity depuis le titre, modifiable par le rédacteur.
- Les balises meta sont toujours renseignées (fallbacks automatiques si vides dans le CMS).

---

## 3. Module La Fabrique & Innovation 3D

### 3.1 Objectif

Présenter les capacités de production interne d'Epitaphe360, différencier la proposition de valeur "zéro sous-traitance", et offrir une expérience de visualisation 3D interactive pour les stands et scénographies.

---

### 3.2 Structure des Pôles de Production

#### 3.2.1 Schéma de données d'un Pôle

```typescript
// sanity/schemas/fabricPole.ts
export const fabricPoleSchema = {
  name: 'fabricPole',
  title: 'Pôle La Fabrique',
  type: 'document',
  fields: [
    { name: 'title',       type: 'string', title: 'Nom du pôle',   validation: (R: any) => R.required() },
    { name: 'slug',        type: 'slug',   title: 'Slug',          options: { source: 'title' } },
    { name: 'icon',        type: 'image',  title: 'Icône du pôle' },
    { name: 'description', type: 'text',   title: 'Description courte (max 200 car.)', validation: (R: any) => R.max(200) },
    {
      name: 'services',
      type: 'array',
      title: 'Services offerts',
      of: [{
        type: 'object',
        fields: [
          { name: 'label',       type: 'string', title: 'Libellé du service' },
          { name: 'description', type: 'text',   title: 'Description' },
        ],
      }],
    },
    {
      name: 'gallery',
      type: 'array',
      title: 'Galerie de réalisations',
      of: [{
        type: 'object',
        fields: [
          { name: 'media',       type: 'image',  title: 'Photo/Image' },
          { name: 'videoUrl',    type: 'url',    title: 'URL Vidéo (optionnel)' },
          { name: 'caption',     type: 'string', title: 'Légende' },
          { name: 'isHighlight', type: 'boolean',title: 'En vedette ?' },
        ],
      }],
    },
    {
      name: 'testimonials',
      type: 'array',
      title: 'Témoignages spécifiques au pôle',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
    },
    { name: 'order', type: 'number', title: 'Ordre d\'affichage' },
  ],
};
```

#### 3.2.2 Les 4 Pôles

| Pôle | Slug | Description |
|---|---|---|
| Atelier d'Impression | `impression` | Impression grand format, textile, signalétique numérique |
| Menuiserie & Fabrication | `menuiserie` | Structures bois, stands sur mesure, mobilier événementiel |
| Signalétique & Wayfinding | `signalétique` | Signalétique permanente et temporaire, totems, balisage |
| Aménagement d'Espaces | `amenagement` | Scénographie, décoration, espaces de marque |

---

### 3.3 Composant 3D Interactif (Three.js / React Three Fiber)

#### 3.3.1 Schéma de données pour les modèles 3D

```typescript
// types/model3D.ts
export interface HotSpot {
  id:          string;
  position:    [number, number, number];  // Coordonnées 3D (x, y, z)
  label:       string;
  description: string;
  linkUrl?:    string;                    // Lien vers un service ou une étude de cas
}

export interface MaterialVariant {
  id:          string;
  name:        string;
  textureUrl:  string;           // URL de la texture diffuse
  normalMapUrl?:string;          // Normal map optionnelle
  color?:      string;           // Couleur hexadécimale si pas de texture
  thumbnail:   string;           // Miniature pour le sélecteur
}

export interface Model3DConfig {
  id:             string;
  title:          string;
  slug:           string;
  modelFile:      string;        // URL du fichier GLTF (optimisé, < 10 Mo)
  previewImage:   string;        // Image de fallback si WebGL non supporté
  hotSpots:       HotSpot[];
  materialVariants: MaterialVariant[];
  initialCamera: {
    position:   [number, number, number];
    fov:        number;
  };
  lights: Array<{
    type:       'ambient' | 'directional' | 'point';
    intensity:  number;
    position?:  [number, number, number];
    color?:     string;
  }>;
}
```

#### 3.3.2 Composant React Three Fiber

```typescript
// components/3d/StandViewer.tsx
import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Html } from '@react-three/drei';
import type { Model3DConfig } from '@/types/model3D';

interface StandViewerProps {
  config: Model3DConfig;
}

function StandModel({ config, activeMaterial }: { config: Model3DConfig; activeMaterial: string }) {
  const { scene } = useGLTF(config.modelFile);
  // Application dynamique de la texture sélectionnée
  // ...
  return <primitive object={scene} />;
}

export function StandViewer({ config }: StandViewerProps) {
  const [activeMaterial, setActiveMaterial] = useState(config.materialVariants[0]?.id);
  const [activeHotSpot, setActiveHotSpot] = useState<string | null>(null);

  return (
    <div className="relative w-full aspect-video bg-neutral-900 rounded-none">
      {/* Fallback si WebGL non disponible */}
      <Canvas
        camera={{ position: config.initialCamera.position, fov: config.initialCamera.fov }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}  // Limite le pixel ratio pour les performances
      >
        <Suspense fallback={null}>
          <StandModel config={config} activeMaterial={activeMaterial} />
          <Environment preset="studio" />
          {config.hotSpots.map((hs) => (
            <Html key={hs.id} position={hs.position}>
              <button
                onClick={() => setActiveHotSpot(hs.id)}
                className="w-6 h-6 rounded-full bg-brand-gold border-2 border-white shadow-lg animate-pulse"
                aria-label={hs.label}
              />
            </Html>
          ))}
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={10}
          autoRotate={false}
          makeDefault
        />
      </Canvas>

      {/* Sélecteur de matériaux */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        {config.materialVariants.map((mat) => (
          <button
            key={mat.id}
            onClick={() => setActiveMaterial(mat.id)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              activeMaterial === mat.id ? 'border-brand-gold scale-110' : 'border-white/40'
            }`}
            style={{ backgroundImage: `url(${mat.thumbnail})`, backgroundSize: 'cover' }}
            aria-label={`Matériau : ${mat.name}`}
          />
        ))}
      </div>
    </div>
  );
}
```

#### 3.3.3 Optimisation des modèles 3D

| Critère | Cible | Méthode |
|---|---|---|
| Taille fichier GLTF | < 5 Mo | Compression Draco + optimisation via `gltf-pipeline` |
| Textures | Max 1024×1024px | Format KTX2 avec compression basisu |
| Polygones | < 100 000 tris | LOD (Level of Detail) avec DRACOLoader |
| Temps de chargement | < 3s sur 4G | Préchargement avec `useGLTF.preload(url)` |
| Fallback | Image statique | Détection WebGL avec `try/catch` sur `getContext('webgl2')` |

---

### 3.4 Galeries Média

```typescript
// components/media/LightboxGallery.tsx
// Fonctionnalités :
// - Ouverture en plein écran avec AnimatePresence (Framer Motion)
// - Navigation clavier : ← → Échap
// - Swipe tactile (useSwipeable de react-swipeable)
// - Lecture automatique des vidéos avec contrôle volume
// - Lazy loading via IntersectionObserver
// - Compteur : "3 / 12"
// - Téléchargement optionnel de l'image

interface GalleryItem {
  type:     'image' | 'video';
  src:      string;
  thumb:    string;
  caption?: string;
  videoUrl?:string;    // Pour les vidéos : URL Vimeo/MP4
  poster?:  string;    // Miniature vidéo
}
```

---

### 3.5 Message Clé "Made in Epitaphe"

- **Bandeau persistant** : En haut de la page La Fabrique, un bandeau pleine largeur en `brand-black` avec texte doré : *"100% Made in Epitaphe — Zéro sous-traitance, maîtrise totale de la chaîne de valeur."*
- **Badge sur chaque pôle** : Icône "Fabrication interne" + texte court.
- **Section dédiée** : Comparaison visuelle "Avec vs. Sans La Fabrique" (délais, coûts, qualité).

---

### 3.6 Flux Utilisateur

```
Page La Fabrique (/la-fabrique)
  ├── Section Hero → Message "Made in Epitaphe" + vidéo atelier
  ├── Navigation par pôles (tabs ou scroll horizontal)
  │     ├── Clic sur "Menuiserie & Fabrication"
  │     │     └── Défilement vers le pôle + galerie se charge
  │     └── Clic sur une image de galerie → Lightbox plein écran
  └── Section 3D Interactive
        ├── Chargement progressif du modèle (barre de progression)
        ├── Rotation libre à 360° + zoom
        ├── Clic sur un hotspot → Tooltip avec description + lien service
        └── Changement de matériau → Texture appliquée en temps réel
```

**Critères d'acceptation** :
- Le viewer 3D affiche un spinner et l'image de fallback pendant le chargement.
- L'interactivité 3D est désactivée sur les appareils avec `prefers-reduced-motion: reduce`.
- La galerie lightbox est navigable au clavier (accessibilité WCAG 2.1 AA).

---

## 4. Module Lead Generation & Outils Interactifs

### 4.1 Objectif

Concevoir les outils de conversion (formulaire de brief, Vigilance-Score QHSE, calculateur), les CTA permanents et le lead magnet, en garantissant validation robuste, sécurité des données et tracking des conversions.

---

### 4.2 Formulaire de Brief Stratégique Dynamique

#### 4.2.1 Structure des étapes

```typescript
// types/brief-form.ts
import { z } from 'zod';

export const stepSchemas = {
  step1: z.object({
    sector: z.enum(['Industrie', 'Santé', 'Luxe & Retail', 'Tech & Digital', 'Finance', 'Énergie', 'Agroalimentaire', 'Autre']),
  }),
  step2: z.object({
    needs: z.array(z.enum([
      'Événement corporate',
      'Signalétique / Wayfinding',
      'Aménagement d\'espace',
      'Communication QHSE',
      'Marque Employeur',
      'Stand / Scénographie',
      'Autre',
    ])).min(1, 'Sélectionnez au moins un besoin'),
  }),
  step3: z.object({
    description: z.string().min(20, 'Décrivez votre projet en au moins 20 caractères').max(2000),
    budget: z.enum(['< 10 000€', '10 000 – 50 000€', '50 000 – 200 000€', '> 200 000€', 'Non défini']).optional(),
    deadline: z.string().optional(),  // Date souhaitée
  }),
  step4: z.object({
    firstName:   z.string().min(2),
    lastName:    z.string().min(2),
    position:    z.string().min(2),
    company:     z.string().min(2),
    email:       z.string().email('Email professionnel requis').refine(
      (e) => !['gmail.', 'yahoo.', 'hotmail.', 'outlook.'].some((d) => e.includes(d)),
      { message: 'Merci d\'utiliser votre email professionnel' }
    ),
    phone:       z.string().regex(/^(\+33|0)[1-9](\d{8})$/, 'Numéro de téléphone invalide'),
    consent:     z.literal(true, { errorMap: () => ({ message: 'Consentement requis' }) }),
  }),
};

export type BriefFormData = {
  step1: z.infer<typeof stepSchemas.step1>;
  step2: z.infer<typeof stepSchemas.step2>;
  step3: z.infer<typeof stepSchemas.step3>;
  step4: z.infer<typeof stepSchemas.step4>;
};
```

#### 4.2.2 Flux d'envoi & Stockage

```typescript
// server/api/brief.ts (API Route Next.js)
import { briefFormSchema } from '@/lib/validations';
import { sendConfirmationEmail, sendInternalNotification } from '@/lib/email';
import { db } from '@/server/db';
import { leads } from '@/shared/schema';

export async function POST(request: Request) {
  const body = await request.json();

  // 1. Validation serveur (zod)
  const parsed = briefFormSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ errors: parsed.error.flatten() }, { status: 422 });
  }

  // 2. Sanitisation (XSS)
  const sanitized = sanitizeBriefData(parsed.data);

  // 3. Stockage en base (PostgreSQL via Drizzle)
  const [lead] = await db.insert(leads).values({
    ...sanitized,
    source: 'brief-form',
    createdAt: new Date(),
    status: 'new',
  }).returning();

  // 4. Email de confirmation (prospect)
  await sendConfirmationEmail({
    to: sanitized.email,
    name: `${sanitized.firstName} ${sanitized.lastName}`,
    briefId: lead.id,
  });

  // 5. Notification interne (Slack + email équipe)
  await sendInternalNotification({ lead });

  // 6. Tracking GA4 (côté serveur via Measurement Protocol)
  await trackConversion('brief_submitted', { lead_id: lead.id, sector: sanitized.sector });

  return Response.json({ success: true, leadId: lead.id }, { status: 201 });
}
```

---

### 4.3 Vigilance-Score (Outil QHSE)

#### 4.3.1 Structure des 5 questions

```typescript
// data/vigilance-score.ts
export interface VScoreQuestion {
  id:      number;
  text:    string;
  weight:  number;       // Pondération pour le calcul du score
  options: Array<{
    label: string;
    value: number;       // 0 à 4
    description: string;
  }>;
}

export const vigilanceQuestions: VScoreQuestion[] = [
  {
    id: 1, weight: 25,
    text: "Comment gérez-vous votre devoir de vigilance envers vos prestataires événementiels ?",
    options: [
      { value: 0, label: "Pas de processus", description: "Aucune vérification systématique" },
      { value: 1, label: "Ponctuel",          description: "Vérifications occasionnelles" },
      { value: 2, label: "Partiel",           description: "Processus documenté mais non systématique" },
      { value: 3, label: "Structuré",         description: "Processus formalisé et audité annuellement" },
      { value: 4, label: "Exemplaire",        description: "Certification ISO 20121 ou équivalent" },
    ],
  },
  {
    id: 2, weight: 20,
    text: "Vos prestataires disposent-ils des certifications QHSE requises ?",
    options: [
      { value: 0, label: "Inconnu" },
      { value: 1, label: "Partiellement" },
      { value: 2, label: "Majoritairement" },
      { value: 3, label: "Totalement" },
      { value: 4, label: "Certifiés et audités" },
    ],
  },
  // ... questions 3, 4, 5
];

// Calcul du score (0-100)
export function calculateVScore(answers: Record<number, number>): number {
  return vigilanceQuestions.reduce((total, q) => {
    const answer = answers[q.id] ?? 0;
    return total + (answer / 4) * q.weight;
  }, 0);
}

// Niveaux de résultat
export function getScoreLevel(score: number): 'critique' | 'fragile' | 'solide' | 'exemplaire' {
  if (score < 25) return 'critique';
  if (score < 50) return 'fragile';
  if (score < 75) return 'solide';
  return 'exemplaire';
}
```

#### 4.3.2 Génération du Mini-Rapport PDF

```typescript
// lib/generate-pdf.ts
// Utilise @react-pdf/renderer pour générer un PDF côté serveur

interface VScoreReport {
  companyName:   string;
  score:         number;
  level:         string;
  answers:       Record<number, number>;
  recommendations: string[];
  generatedAt:   Date;
  auditProposal?: { calendarUrl: string; message: string };
}

// Contenu dynamique selon le niveau :
const reportContent: Record<string, { headline: string; recommendations: string[] }> = {
  critique: {
    headline: "Votre exposition aux risques QHSE est significative.",
    recommendations: [
      "Mettre en place immédiatement un processus de vérification des prestataires",
      "Former vos équipes aux exigences légales de la loi Sapin II et Vigilance",
      "Demander un audit de conformité urgent",
    ],
  },
  exemplaire: {
    headline: "Votre maturité QHSE est un avantage concurrentiel.",
    recommendations: ["Capitaliser sur cette maturité dans votre communication RFP"],
  },
};
```

---

### 4.4 Calculateur d'Optimisation Fabrique

```typescript
// components/tools/FabriqueCalculator.tsx
interface CalculatorInputs {
  numberOfProviders:    number;   // Nombre de prestataires actuels
  currentLeadTimeDays:  number;   // Délai actuel en jours
  currentCostEuros:     number;   // Budget moyen par projet (€)
  projectsPerYear:      number;   // Nombre de projets par an
}

interface CalculatorResults {
  timeSavedDaysPerProject: number;
  timeSavedPercent:        number;
  costSavedEuros:          number;
  costSavedPercent:        number;
  riskReductionPercent:    number;
  annualSavingsEuros:      number;
}

// Formules de calcul (estimations basées sur les données Epitaphe)
export function calculate(inputs: CalculatorInputs): CalculatorResults {
  const coordinationOverhead = Math.min(inputs.numberOfProviders * 0.15, 0.60); // max 60%
  const timeSavedPercent     = coordinationOverhead * 100;
  const costSavedPercent     = coordinationOverhead * 0.85 * 100; // efficience légèrement inférieure
  const timeSavedDays        = inputs.currentLeadTimeDays * coordinationOverhead;
  const costSaved            = inputs.currentCostEuros * (coordinationOverhead * 0.85);

  return {
    timeSavedDaysPerProject: Math.round(timeSavedDays),
    timeSavedPercent:        Math.round(timeSavedPercent),
    costSavedEuros:          Math.round(costSaved),
    costSavedPercent:        Math.round(costSavedPercent),
    riskReductionPercent:    Math.round(inputs.numberOfProviders * 8),  // Cap à 80%
    annualSavingsEuros:      Math.round(costSaved * inputs.projectsPerYear),
  };
}
```

---

### 4.5 CTA Contextuels Permanents

| Page | CTA Principal | CTA Secondaire |
|---|---|---|
| `/evenements/*` | "Planifier mon événement" | "Voir nos références" |
| `/architecture-de-marque/communication-qhse` | "Sécuriser ma performance opérationnelle" | "Tester mon Vigilance-Score" |
| `/la-fabrique/*` | "Demander un devis Fabrique" | "Voir nos modèles 3D" |
| `/references` | "Discuter de votre projet" | "Télécharger une étude de cas" |
| Global (footer) | "Déposer un brief stratégique" | "Nous contacter" |

---

### 4.6 Lead Magnet

```typescript
// sanity/schemas/leadMagnet.ts
export const leadMagnetSchema = {
  name: 'leadMagnet',
  type: 'document',
  fields: [
    { name: 'title',       type: 'string', title: 'Titre du guide' },
    { name: 'description', type: 'array',  title: 'Description', of: [{ type: 'block' }] },
    { name: 'file',        type: 'file',   title: 'Fichier PDF',  options: { accept: '.pdf' } },
    { name: 'thumbnail',   type: 'image',  title: 'Miniature couverture' },
    { name: 'ctaLabel',    type: 'string', title: 'Texte du CTA de téléchargement' },
    { name: 'thankYouMessage', type: 'text', title: 'Message post-téléchargement' },
  ],
};

// Flux de capture :
// 1. Saisie email → Validation (email pro uniquement)
// 2. Enregistrement en DB + intégration CRM (Hubspot/Brevo via API)
// 3. Envoi email automatique avec lien PDF signé (URL signée S3, expiration 24h)
// 4. Tracking GA4 : event "lead_magnet_download"
// 5. Affichage du message de remerciement + CTA "Discuter de votre projet"
```

**Critères d'acceptation** :
- La validation Zod s'exécute côté client ET côté serveur.
- Le formulaire multi-étapes conserve les données entre les étapes (React state ou Zustand).
- En cas d'erreur réseau, un toast d'erreur s'affiche et les données ne sont pas perdues.
- Le PDF du Vigilance-Score se génère en < 5 secondes.

---

## 5. Module CMS, SEO & Performance

### 5.1 Objectif

Définir l'architecture complète du back-office headless (Sanity.io), la stratégie SEO technique, les optimisations Core Web Vitals et l'intégration analytics.

---

### 5.2 Schémas de Données CMS Complets

#### 5.2.1 Étude de Cas

```typescript
// sanity/schemas/caseStudy.ts
export const caseStudySchema = {
  name: 'caseStudy',
  title: 'Étude de Cas',
  type: 'document',
  fields: [
    { name: 'title',    type: 'string', title: 'Titre' },
    { name: 'slug',     type: 'slug',   title: 'Slug', options: { source: 'title' } },
    { name: 'client',   type: 'reference', to: [{ type: 'clientReference' }], title: 'Client' },
    { name: 'problem',  type: 'array',  title: 'Problématique', of: [{ type: 'block' }] },
    { name: 'solution', type: 'array',  title: 'Solution Epitaphe', of: [{ type: 'block' }] },
    { name: 'results',  type: 'array',  title: 'Résultats', of: [{ type: 'block' }] },
    {
      name: 'kpis',
      type: 'array',
      title: 'KPIs clés',
      of: [{
        type: 'object',
        fields: [
          { name: 'value',  type: 'string', title: 'Valeur (ex: +32%)' },
          { name: 'label',  type: 'string', title: 'Libellé' },
          { name: 'icon',   type: 'string', title: 'Icône Lucide' },
        ],
      }],
    },
    {
      name: 'gallery',
      type: 'array',
      title: 'Galerie',
      of: [{
        type: 'object',
        fields: [
          { name: 'image',   type: 'image',  title: 'Image', options: { hotspot: true } },
          { name: 'caption', type: 'string', title: 'Légende' },
        ],
      }],
    },
    {
      name: 'relatedServices',
      type: 'array',
      title: 'Services liés',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
    },
    { name: 'seoTitle',       type: 'string', title: 'Meta Title' },
    { name: 'seoDescription', type: 'text',   title: 'Meta Description' },
    { name: 'openGraphImage', type: 'image',  title: 'Image Open Graph (1200×630)' },
    { name: 'publishedAt',    type: 'datetime', title: 'Date de publication' },
    { name: 'isFeatured',     type: 'boolean',   title: 'En vedette ?' },
  ],
};
```

#### 5.2.2 Article de Blog

```typescript
// sanity/schemas/post.ts
export const postSchema = {
  name: 'post',
  title: 'Article de Blog',
  type: 'document',
  fields: [
    { name: 'title',         type: 'string',   title: 'Titre' },
    { name: 'slug',          type: 'slug',     title: 'Slug', options: { source: 'title' } },
    { name: 'author',        type: 'reference',title: 'Auteur', to: [{ type: 'teamMember' }] },
    { name: 'publishedAt',   type: 'datetime', title: 'Date de publication' },
    { name: 'mainImage',     type: 'image',    title: 'Image principale', options: { hotspot: true } },
    {
      name: 'body',
      type: 'array',
      title: 'Contenu',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
        { type: 'code' },  // Blocs de code
      ],
    },
    {
      name: 'categories',
      type: 'array',
      title: 'Catégories',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    },
    { name: 'tags',           type: 'array',  title: 'Tags', of: [{ type: 'string' }] },
    { name: 'excerpt',        type: 'text',   title: 'Extrait (max 200 car.)', validation: (R: any) => R.max(200) },
    { name: 'seoTitle',       type: 'string', title: 'Meta Title',       validation: (R: any) => R.max(60) },
    { name: 'seoDescription', type: 'text',   title: 'Meta Description', validation: (R: any) => R.max(160) },
    { name: 'openGraphImage', type: 'image',  title: 'Image Open Graph' },
    { name: 'readingTime',    type: 'number', title: 'Temps de lecture (min)', readOnly: true },
  ],
};
```

#### 5.2.3 Témoignage

```typescript
export const testimonialSchema = {
  name: 'testimonial', type: 'document', title: 'Témoignage',
  fields: [
    { name: 'quote',       type: 'text',   title: 'Citation', validation: (R: any) => R.required().max(500) },
    { name: 'authorName',  type: 'string', title: 'Nom' },
    { name: 'authorTitle', type: 'string', title: 'Poste' },
    { name: 'companyName', type: 'string', title: 'Entreprise' },
    { name: 'companyLogo', type: 'image',  title: 'Logo entreprise' },
    { name: 'rating',      type: 'number', title: 'Note (1-5)',  validation: (R: any) => R.min(1).max(5) },
    { name: 'date',        type: 'date',   title: 'Date du témoignage' },
    { name: 'isPublished', type: 'boolean',title: 'Publié ?' },
  ],
};
```

#### 5.2.4 Équipe Agence

```typescript
export const teamMemberSchema = {
  name: 'teamMember', type: 'document', title: 'Membre de l\'équipe',
  fields: [
    { name: 'name',     type: 'string', title: 'Nom complet' },
    { name: 'position', type: 'string', title: 'Poste' },
    { name: 'bio',      type: 'array',  title: 'Biographie', of: [{ type: 'block' }] },
    { name: 'photo',    type: 'image',  title: 'Photo', options: { hotspot: true } },
    {
      name: 'socialLinks',
      type: 'array',
      title: 'Liens sociaux',
      of: [{
        type: 'object',
        fields: [
          { name: 'platform', type: 'string', options: { list: ['LinkedIn', 'Twitter', 'GitHub'] } },
          { name: 'url',      type: 'url' },
        ],
      }],
    },
    { name: 'order', type: 'number', title: 'Ordre d\'affichage' },
  ],
};
```

---

### 5.3 SEO Technique & Stratégie en Silos

#### 5.3.1 Données structurées Schema.org

```typescript
// lib/structured-data.ts
import type { WithContext, Organization, LocalBusiness, Service } from 'schema-dts';

export const organizationSchema: WithContext<Organization> = {
  '@context':   'https://schema.org',
  '@type':      'Organization',
  name:         'Epitaphe360',
  url:          'https://epitaphe360.com',
  logo:         'https://epitaphe360.com/logo.png',
  description:  'Agence événementielle et communication corporate B2B haut de gamme.',
  contactPoint: { '@type': 'ContactPoint', telephone: '+33-X-XX-XX-XX-XX', contactType: 'sales' },
  sameAs: ['https://www.linkedin.com/company/epitaphe360'],
};

export function generateServiceSchema(service: any): WithContext<Service> {
  return {
    '@context':    'https://schema.org',
    '@type':       'Service',
    name:          service.title,
    description:   service.accroche,
    provider:      { '@type': 'Organization', name: 'Epitaphe360' },
    url:           `https://epitaphe360.com/evenements/${service.slug.current}`,
    serviceType:   service.hub,
  };
}
```

#### 5.3.2 Sitemap XML dynamique (Next.js)

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllServices, getAllCaseStudies, getAllPosts } from '@/lib/sanity';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, caseStudies, posts] = await Promise.all([
    getAllServices(),
    getAllCaseStudies(),
    getAllPosts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: 'https://epitaphe360.com/',           changeFrequency: 'weekly',  priority: 1.0,  lastModified: new Date() },
    { url: 'https://epitaphe360.com/evenements', changeFrequency: 'weekly',  priority: 0.9 },
    { url: 'https://epitaphe360.com/la-fabrique',changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://epitaphe360.com/references', changeFrequency: 'weekly',  priority: 0.8 },
    { url: 'https://epitaphe360.com/contact',    changeFrequency: 'monthly', priority: 0.7 },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...services.map((s: any) => ({
      url: `https://epitaphe360.com/${s.hub}/${s.slug.current}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      lastModified: new Date(s._updatedAt),
    })),
    ...caseStudies.map((cs: any) => ({
      url: `https://epitaphe360.com/references/${cs.slug.current}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...posts.map((p: any) => ({
      url: `https://epitaphe360.com/blog/${p.slug.current}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      lastModified: new Date(p._updatedAt),
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
```

#### 5.3.3 Internationalisation (next-intl)

```
app/
├── [locale]/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── evenements/
│   │   └── [slug]/page.tsx
│   └── ...
├── i18n.ts
└── middleware.ts   ← Détection de locale

messages/
├── fr.json
└── en.json
```

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales:       ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix:  'as-needed',   // /fr/ omis pour la langue par défaut
});
```

---

### 5.4 Performance & Core Web Vitals

```typescript
// Stratégies d'optimisation

// 1. Polices — Chargement optimisé
// app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '700', '800'],
});

// 2. Code Splitting par route (automatique avec Next.js App Router)
// 3. Préchargement ressources critiques
// app/layout.tsx <head>
<link rel="preconnect" href="https://cdn.sanity.io" />
<link rel="dns-prefetch" href="https://www.googletagmanager.com" />

// 4. ISR pour les pages de services (revalidation toutes les heures)
export const revalidate = 3600;

// 5. React.lazy pour les composants lourds (viewer 3D)
const StandViewer = React.lazy(() => import('@/components/3d/StandViewer'));
```

---

### 5.5 Tableau de Bord Analytics

#### 5.5.1 Intégrations

| Outil | Usage | Événements trackés |
|---|---|---|
| **GA4** | Trafic, sources, conversions | `brief_submitted`, `lead_magnet_download`, `case_study_view`, `cta_click` |
| **Hotjar / Clarity** | Heatmaps, enregistrements de sessions | Pages `/evenements/*`, `/contact/*` |
| **GTM** | Gestionnaire de tags centralisé | Tous les events custom |

#### 5.5.2 Dashboard back-office Sanity

```typescript
// Widget Sanity Studio personnalisé affichant :
// - Nombre de formulaires brief soumis (7 derniers jours)
// - Nombre de téléchargements lead magnet
// - Nombre de démarrages du Vigilance-Score
// - Top 5 pages les plus consultées (via GA4 Data API)
// Données récupérées via un widget React personnalisé dans le panneau Sanity
```

**Critères d'acceptation** :
- GTM est chargé de manière non-bloquante (attribut `async`).
- Le consentement RGPD (bannière Axeptio ou CookieYes) est requis avant activation de GA4/Hotjar.
- Tous les schémas Sanity disposent d'une prévisualisation en direct (`live preview`).
- Le versioning de contenu (historique des révisions) est activé dans Sanity.

---

## 6. Module Espace Client & PWA (Phase 2)

### 6.1 Objectif

Déployer des fonctionnalités avancées de fidélisation : accès hors-ligne via PWA, espace client sécurisé avec suivi de projet, coffre-fort numérique, bibliothèque de ressources et QR codes intelligents.

---

### 6.2 Progressive Web App (PWA)

#### 6.2.1 Configuration Service Worker (next-pwa)

```typescript
// next.config.ts — Intégration next-pwa
import withPWA from 'next-pwa';

const config = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/cdn\.sanity\.io\/.*/,
      handler:    'CacheFirst',
      options:    { cacheName: 'sanity-assets', expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 3600 } },
    },
    {
      urlPattern: /^https:\/\/epitaphe360\.com\/api\/.*/,
      handler:    'NetworkFirst',
      options:    { cacheName: 'api-cache', networkTimeoutSeconds: 5 },
    },
    {
      urlPattern: /\.(mp4|webm)$/,
      handler:    'CacheFirst',
      options:    { cacheName: 'video-cache', expiration: { maxEntries: 20, maxAgeSeconds: 7 * 24 * 3600 } },
    },
  ],
});
```

#### 6.2.2 Web App Manifest

```json
// public/manifest.json
{
  "name": "Epitaphe360",
  "short_name": "E360",
  "description": "Portail B2B Epitaphe360 — Événements & Communication Corporate",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1A1A1A",
  "theme_color": "#C8A96E",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/pwa-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable any" },
    { "src": "/icons/pwa-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable any" }
  ],
  "screenshots": [
    { "src": "/screenshots/mobile-home.png", "sizes": "390x844", "type": "image/png", "form_factor": "narrow" },
    { "src": "/screenshots/desktop-home.png","sizes": "1440x900","type": "image/png", "form_factor": "wide" }
  ]
}
```

#### 6.2.3 Notifications Push Stratégiques

```typescript
// types/push-notification.ts
export type PushNotificationCategory =
  | 'project_update'        // Nouveau statut sur un projet client
  | 'new_case_study'        // Nouvelle étude de cas publiée
  | 'event_invitation'      // Invitation à un événement Epitaphe
  | 'report_ready'          // Rapport (Vigilance-Score, devis) disponible
  | 'newsletter';           // Communication marketing (opt-in requis séparément)

export interface PushPayload {
  category:  PushNotificationCategory;
  title:     string;
  body:      string;
  icon?:     string;
  badge?:    string;
  image?:    string;   // Image enrichie (optionnel)
  url:       string;   // URL de deep linking
  data?:     Record<string, unknown>;
}

// Gestion des abonnements : stockage en DB (table push_subscriptions)
// Envoi via Web Push Protocol (bibliothèque web-push)
// Gestion du RGPD : opt-in explicite, révocable depuis l'espace client
```

---

### 6.3 Espace Client Privé Sécurisé

#### 6.3.1 Architecture d'authentification

```typescript
// Architecture : NextAuth.js v5 (Auth.js)
// Providers : Email Magic Link + OAuth (Google, Microsoft 365)

// shared/schema.ts — Tables Drizzle
export const users = pgTable('users', {
  id:           uuid('id').defaultRandom().primaryKey(),
  email:        varchar('email', { length: 255 }).notNull().unique(),
  name:         varchar('name', { length: 255 }),
  role:         varchar('role', { length: 50 }).default('client').notNull(),
  // Rôles : 'client' | 'client_admin' | 'epitaphe_manager' | 'admin'
  companyId:    uuid('company_id').references(() => companies.id),
  biometricKey: text('biometric_key'),   // Clé publique WebAuthn
  createdAt:    timestamp('created_at').defaultNow(),
  lastLoginAt:  timestamp('last_login_at'),
  isActive:     boolean('is_active').default(true),
});

export const companies = pgTable('companies', {
  id:         uuid('id').defaultRandom().primaryKey(),
  name:       varchar('name', { length: 255 }).notNull(),
  sector:     varchar('sector', { length: 100 }),
  logoUrl:    text('logo_url'),
  createdAt:  timestamp('created_at').defaultNow(),
});
```

#### 6.3.2 Authentification Biométrique (WebAuthn / FIDO2)

```typescript
// lib/webauthn.ts
// Utilise SimpleWebAuthn (simplewebauthn/server + browser)

// Inscription : génère un challenge, l'utilisateur valide avec FaceID/Fingerprint
// La clé publique est stockée dans users.biometric_key
// Connexion : le serveur envoie un challenge, le navigateur signe avec la clé privée

// Secteurs prioritaires pour l'obligation biométrique :
const BIOMETRIC_REQUIRED_SECTORS = ['Finance', 'Santé', 'Énergie', 'Défense'];
```

#### 6.3.3 Tableau de Bord de Suivi de Projet

```typescript
// Schéma de données (Drizzle / PostgreSQL)
export const projects = pgTable('projects', {
  id:           uuid('id').defaultRandom().primaryKey(),
  title:        varchar('title', { length: 255 }).notNull(),
  companyId:    uuid('company_id').references(() => companies.id),
  managerId:    uuid('manager_id').references(() => users.id),    // Responsable Epitaphe
  status:       varchar('status', { length: 50 }).default('brief').notNull(),
  // Statuts : 'brief' | 'esquisse' | 'validation' | 'production' | 'livraison' | 'archive'
  startDate:    date('start_date'),
  deliveryDate: date('delivery_date'),
  budget:       numeric('budget', { precision: 12, scale: 2 }),
  createdAt:    timestamp('created_at').defaultNow(),
  updatedAt:    timestamp('updated_at').defaultNow(),
});

export const projectMilestones = pgTable('project_milestones', {
  id:          uuid('id').defaultRandom().primaryKey(),
  projectId:   uuid('project_id').references(() => projects.id).notNull(),
  title:       varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status:      varchar('status', { length: 50 }).default('pending'),
  dueDate:     date('due_date'),
  completedAt: timestamp('completed_at'),
});

export const projectComments = pgTable('project_comments', {
  id:        uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  authorId:  uuid('author_id').references(() => users.id).notNull(),
  body:      text('body').notNull(),
  isInternal:boolean('is_internal').default(false), // Commentaire visible client ou interne
  createdAt: timestamp('created_at').defaultNow(),
});
```

---

### 6.4 Coffre-Fort Numérique

```typescript
// Stockage : AWS S3 (ou Cloudflare R2) avec chiffrement AES-256 côté serveur
// Accès : URLs signées (expiration configurable : 1h, 24h, 7j)

export const documents = pgTable('documents', {
  id:          uuid('id').defaultRandom().primaryKey(),
  projectId:   uuid('project_id').references(() => projects.id),
  companyId:   uuid('company_id').references(() => companies.id).notNull(),
  fileName:    varchar('file_name', { length: 255 }).notNull(),
  fileType:    varchar('file_type', { length: 50 }),       // 'pdf' | 'image' | 'zip'
  fileSize:    integer('file_size'),                        // en octets
  s3Key:       text('s3_key').notNull(),                    // Clé S3 (ne pas exposer)
  version:     integer('version').default(1),
  uploadedBy:  uuid('uploaded_by').references(() => users.id),
  isArchived:  boolean('is_archived').default(false),
  createdAt:   timestamp('created_at').defaultNow(),
});

// Politique d'accès par rôle :
// - client       : lecture des documents de son entreprise uniquement
// - client_admin : lecture + upload pour son entreprise
// - manager      : lecture + upload + partage
// - admin        : accès total
```

---

### 6.5 Bibliothèque de l'Influence (Ressources)

```typescript
// sanity/schemas/resource.ts
export const resourceSchema = {
  name: 'resource', type: 'document', title: 'Ressource (Bibliothèque)',
  fields: [
    { name: 'title',       type: 'string',   title: 'Titre' },
    { name: 'slug',        type: 'slug',     title: 'Slug', options: { source: 'title' } },
    {
      name: 'type',
      type: 'string',
      title: 'Type de ressource',
      options: { list: ['White Paper', 'Modèle', 'Article', 'Checklist', 'Webinar', 'Étude sectorielle'] },
    },
    {
      name: 'accessLevel',
      type: 'string',
      title: 'Niveau d\'accès',
      options: { list: ['public', 'lead', 'client'] },
      description: 'public = tous | lead = email requis | client = connexion requise',
    },
    { name: 'description', type: 'text',     title: 'Description (max 300 car.)', validation: (R: any) => R.max(300) },
    { name: 'file',        type: 'file',     title: 'Fichier', options: { accept: '.pdf,.docx,.xlsx,.zip' } },
    { name: 'thumbnail',   type: 'image',    title: 'Miniature' },
    { name: 'categories',  type: 'array',    title: 'Catégories', of: [{ type: 'string' }] },
    { name: 'tags',        type: 'array',    title: 'Tags', of: [{ type: 'string' }] },
    { name: 'publishedAt', type: 'datetime', title: 'Date de publication' },
    { name: 'isFeatured',  type: 'boolean',  title: 'En vedette ?' },
  ],
};
```

---

### 6.6 QR Codes avec Deep Linking

#### 6.6.1 Schéma de données

```typescript
// sanity/schemas/qrCode.ts
export const qrCodeSchema = {
  name: 'qrCode', type: 'document', title: 'QR Code',
  fields: [
    { name: 'label',       type: 'string', title: 'Libellé interne (ex: Stand salon 2026)' },
    { name: 'targetPath',  type: 'string', title: 'Chemin cible (ex: /la-fabrique/stands)' },
    {
      name: 'utmParams',
      type: 'object',
      title: 'Paramètres UTM (tracking)',
      fields: [
        { name: 'source',   type: 'string', title: 'utm_source  (ex: stand-physique)' },
        { name: 'medium',   type: 'string', title: 'utm_medium  (ex: qr-code)' },
        { name: 'campaign', type: 'string', title: 'utm_campaign (ex: salon-industrie-2026)' },
        { name: 'content',  type: 'string', title: 'utm_content  (ex: atelier-impression)' },
      ],
    },
    { name: 'generatedQr', type: 'image',  title: 'QR Code généré (SVG/PNG)', readOnly: true },
    { name: 'isActive',    type: 'boolean',title: 'Actif ?' },
    { name: 'createdAt',   type: 'datetime', title: 'Créé le' },
  ],
};
```

#### 6.6.2 Génération des QR codes

```typescript
// lib/qr-generator.ts
import QRCode from 'qrcode';

export async function generateQRCode(config: {
  targetPath: string;
  utmParams:  Record<string, string>;
  baseUrl:    string;
}): Promise<string> {  // Retourne un SVG string
  const params = new URLSearchParams(
    Object.fromEntries(
      Object.entries(config.utmParams)
        .filter(([_, v]) => v)
        .map(([k, v]) => [`utm_${k}`, v])
    )
  );

  const fullUrl = `${config.baseUrl}${config.targetPath}?${params.toString()}`;

  return QRCode.toString(fullUrl, {
    type: 'svg',
    color: { dark: '#1A1A1A', light: '#FFFFFF' },
    width: 400,
    margin: 2,
    errorCorrectionLevel: 'H',  // Haute tolérance aux erreurs (logo intégrable)
  });
}
```

**Critères d'acceptation** :
- L'espace client est inaccessible sans authentification (middleware Next.js).
- Les URLs signées S3 expirent et ne sont pas indexées par les moteurs de recherche.
- Le Service Worker ne met pas en cache les routes de l'espace client (données sensibles).
- Les QR codes fonctionnent hors-ligne vers des routes mises en cache par le Service Worker.
- La biométrie WebAuthn n'est proposée qu'après une première connexion réussie par magic link.

---

## Annexes

### A. Stack Technique Consolidée

| Couche | Technologie |
|---|---|
| **Framework** | Next.js 14+ (App Router) |
| **Langage** | TypeScript 5+ |
| **Style** | Tailwind CSS 3.4+ |
| **Composants UI** | shadcn/ui + Radix UI |
| **Animations** | Framer Motion 11+ |
| **3D** | React Three Fiber + Drei + Three.js |
| **Formulaires** | React Hook Form + Zod |
| **CMS** | Sanity.io v3 |
| **Base de données** | PostgreSQL (Drizzle ORM) |
| **Authentification** | Auth.js (NextAuth v5) + SimpleWebAuthn |
| **Internationalisation** | next-intl |
| **PWA** | next-pwa |
| **Push Notifications** | web-push |
| **PDF** | @react-pdf/renderer |
| **QR Codes** | qrcode |
| **Hébergement** | Railway (prod) + Vercel (preview) |
| **CDN** | Cloudflare |
| **Analytics** | GA4 + GTM + Hotjar |

### B. Arborescence Complète des URLs

```
/                                        → Accueil
/evenements/                             → Hub Événements
/evenements/conventions-kickoffs
/evenements/soirees-de-gala
/evenements/roadshows-tournees
/evenements/salons-expositions
/architecture-de-marque/                 → Hub Architecture de Marque
/architecture-de-marque/marque-employeur
/architecture-de-marque/communication-qhse
/architecture-de-marque/experience-clients
/la-fabrique/                            → Hub La Fabrique
/la-fabrique/impression
/la-fabrique/menuiserie
/la-fabrique/signalétique
/la-fabrique/amenagement
/references/                             → Toutes les références
/references/[slug]                       → Étude de cas
/blog/                                   → Blog
/blog/[slug]                             → Article
/contact/                                → Contact général
/contact/brief                           → Formulaire de brief
/outils/vigilance-score                  → Outil QHSE
/outils/calculateur-fabrique             → Calculateur ROI
/ressources/                             → Bibliothèque (public + lead)
/espace-client/                          → Hub espace client (auth requise)
/espace-client/projets                   → Liste des projets
/espace-client/projets/[id]              → Détail projet + jalons
/espace-client/documents                 → Coffre-fort numérique
/espace-client/ressources                → Ressources réservées clients
```

### C. Contraintes Légales & Conformité

| Exigence | Mesure |
|---|---|
| **RGPD** | Bannière de consentement, politique de confidentialité, DPA avec les sous-traitants |
| **Loi Sapin II** | Outil Vigilance-Score aligné sur les exigences de la loi |
| **Accessibilité (RGAA 4.1)** | Objectif WCAG 2.1 AA sur toutes les pages publiques |
| **Sécurité** | HTTPS obligatoire, CSP headers, rate limiting sur les APIs, audit OWASP |
| **Cookies** | Google Analytics en mode consentement, pas de tracking sans opt-in |

---

*Document généré le 21 mars 2026 — Epitaphe360 © Tous droits réservés*
