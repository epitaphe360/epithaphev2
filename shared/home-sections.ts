/**
 * Types des sections de toutes les pages du site.
 * Chaque section possède un `type` discriminant qui détermine
 * le composant React utilisé pour la rendre côté client.
 *
 * Stockées dans `pages.sections` (JSONB) pour chaque page.
 */

export type HomeSection =
  | HeroSection
  | IntroSection
  | StatsSection
  | ClientsSection
  | AvantagesSection
  | PolesSection
  | CommPulseSection
  | FabriqueSection
  | ArticlesSection
  | CtaSection
  | RichTextSection
  | ServiceHeroSection
  | ServiceBlocksSection
  | HubCardsSection
  | PitchSection
  | ReferencesStripSection
  | TestimonialSection
  | ContactFormSection
  | ImageTextSection
  | TeamSection
  | FaqSection
  | ToolsGridSection
  | ResourcesGridSection;

export interface BaseSection {
  id: string;
  order: number;
  enabled?: boolean;
}

export interface HeroSection extends BaseSection {
  type: 'hero';
  backgroundImage: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface IntroSection extends BaseSection {
  type: 'intro';
  eyebrow: string;
  title: string;
  bodyHtml: string;
  bullets: string[];
  image: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface StatsSection extends BaseSection {
  type: 'stats';
  title?: string;
  items: { value: number; suffix?: string; label: string }[];
}

export interface ClientsSection extends BaseSection {
  type: 'clients';
  title: string;
  subtitle?: string;
  logos: { name: string; logo: string }[];
  ctaLabel?: string;
  ctaHref?: string;
}

export interface AvantagesSection extends BaseSection {
  type: 'avantages';
  title: string;
  subtitle?: string;
  items: { title: string; desc: string }[];
}

export interface PolesSection extends BaseSection {
  type: 'poles';
  title: string;
  subtitle?: string;
  items: { num: string; title: string; desc: string; href: string }[];
}

export interface CommPulseSection extends BaseSection {
  type: 'commpulse';
  badge?: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  image?: string;
}

export interface FabriqueSection extends BaseSection {
  type: 'fabrique';
  eyebrow: string;
  title: string;
  body: string;
  services: { title: string; href: string }[];
  images: string[];
  ctaLabel?: string;
  ctaHref?: string;
}

export interface ArticlesSection extends BaseSection {
  type: 'articles';
  title: string;
  subtitle?: string;
  limit: number;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface CtaSection extends BaseSection {
  type: 'cta';
  title: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  background?: 'primary' | 'dark' | 'light';
}

export interface RichTextSection extends BaseSection {
  type: 'richtext';
  html: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// ─── Nouveaux types ──────────────────────────────────────────────────────────

/** Hero de page de service (titre + tag + image + CTA) */
export interface ServiceHeroSection extends BaseSection {
  type: 'service-hero';
  tag?: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  primaryCta?: { label: string; href: string };
}

/** Grille 4 blocs de service (titre + desc + features) */
export interface ServiceBlocksSection extends BaseSection {
  type: 'service-blocks';
  title?: string;
  items: { icon?: string; title: string; description: string; features: string[] }[];
}

/** Grille de cartes hub (liens vers pages enfants) */
export interface HubCardsSection extends BaseSection {
  type: 'hub-cards';
  title: string;
  subtitle?: string;
  items: { title: string; description: string; href: string; features?: string[]; image?: string }[];
}

/** Section pitch : titre + corps + stats */
export interface PitchSection extends BaseSection {
  type: 'pitch';
  title: string;
  body: string;
  stats?: { value: string; label: string }[];
}

/** Bande logos clients/références */
export interface ReferencesStripSection extends BaseSection {
  type: 'references-strip';
  title?: string;
  items: { name: string; logo?: string }[];
}

/** Témoignage client */
export interface TestimonialSection extends BaseSection {
  type: 'testimonial';
  author: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
}

/** Page Contact : infos + formulaire React intégré */
export interface ContactFormSection extends BaseSection {
  type: 'contact-form';
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  address: string[];
  phone: string[];
  email: string[];
  hours: string[];
}

/** Bloc image (gauche ou droite) + texte */
export interface ImageTextSection extends BaseSection {
  type: 'image-text';
  image: string;
  imageAlt?: string;
  imagePosition: 'left' | 'right';
  eyebrow?: string;
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}

/** Grille équipe */
export interface TeamSection extends BaseSection {
  type: 'team';
  title: string;
  subtitle?: string;
  members: { name: string; role: string; photo?: string; bio?: string }[];
}

/** FAQ accordéon */
export interface FaqSection extends BaseSection {
  type: 'faq';
  title: string;
  items: { question: string; answer: string }[];
}

/** Grille d'outils / produits */
export interface ToolsGridSection extends BaseSection {
  type: 'tools-grid';
  title: string;
  subtitle?: string;
  items: { title: string; description: string; href: string; tag?: string; color?: string }[];
}

/** Grille de ressources téléchargeables */
export interface ResourcesGridSection extends BaseSection {
  type: 'resources-grid';
  title: string;
  subtitle?: string;
  items: { title: string; description: string; category: string; format: string; href: string }[];
}

/** Liste des types disponibles pour l'admin (dropdown ajout de section). */
export const HOME_SECTION_TYPES: { value: HomeSection['type']; label: string; group?: string }[] = [
  // ── Génériques ──
  { value: 'hero',              label: 'Hero (bandeau principal)',                group: 'Génériques' },
  { value: 'service-hero',      label: 'Hero page de service',                    group: 'Génériques' },
  { value: 'richtext',          label: 'Texte libre HTML',                        group: 'Génériques' },
  { value: 'image-text',        label: 'Image + Texte (50/50)',                   group: 'Génériques' },
  { value: 'cta',               label: 'Call to Action',                          group: 'Génériques' },
  // ── Contenus ──
  { value: 'intro',             label: 'Intro agence (texte + image + bullets)',  group: 'Contenus' },
  { value: 'pitch',             label: 'Pitch (titre + corps + stats)',           group: 'Contenus' },
  { value: 'hub-cards',         label: 'Cartes hub (liens services)',             group: 'Contenus' },
  { value: 'service-blocks',    label: 'Blocs de services (grille 4)',            group: 'Contenus' },
  { value: 'avantages',         label: 'Avantages (grille 6 cartes)',             group: 'Contenus' },
  { value: 'poles',             label: 'Pôles d\'expertise (numérotés)',          group: 'Contenus' },
  { value: 'faq',               label: 'FAQ accordéon',                           group: 'Contenus' },
  { value: 'team',              label: 'Équipe (grille membres)',                 group: 'Contenus' },
  // ── Social proof ──
  { value: 'stats',             label: 'Statistiques chiffrées',                  group: 'Social proof' },
  { value: 'clients',           label: 'Logos clients (carousel)',                group: 'Social proof' },
  { value: 'references-strip',  label: 'Bande références / logos',                group: 'Social proof' },
  { value: 'testimonial',       label: 'Témoignage client',                       group: 'Social proof' },
  // ── Outils & ressources ──
  { value: 'commpulse',         label: 'Bandeau CommPulse',                       group: 'Outils' },
  { value: 'fabrique',          label: 'La Fabrique 360',                         group: 'Outils' },
  { value: 'tools-grid',        label: 'Grille d\'outils / produits',             group: 'Outils' },
  { value: 'resources-grid',    label: 'Grille de ressources',                    group: 'Outils' },
  { value: 'articles',          label: 'Derniers articles de blog',               group: 'Outils' },
  // ── Spécial ──
  { value: 'contact-form',      label: 'Formulaire de contact',                   group: 'Spécial' },
];
