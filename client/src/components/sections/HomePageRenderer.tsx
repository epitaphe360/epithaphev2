/**
 * PageSectionsRenderer — rend une liste de sections JSON via un registry de composants.
 * Supporte tous les types de pages (home, services, hubs, contact, etc.).
 * Si une section a un `type` inconnu, elle est silencieusement ignorée.
 */
import React from 'react';
import type { HomeSection } from '@shared/home-sections';
import {
  HeroBlock, IntroBlock, StatsBlock, ClientsBlock, AvantagesBlock,
  PolesBlock, CommPulseBlock, FabriqueBlock, ArticlesBlock, CtaBlock, RichTextBlock,
  ServiceHeroBlock, ServiceBlocksBlock, HubCardsBlock, PitchBlock,
  ReferencesStripBlock, TestimonialBlock, ContactFormBlock,
  ImageTextBlock, TeamBlock, FaqBlock, ToolsGridBlock, ResourcesGridBlock,
} from './home-blocks';
import {
  HeadingBlock, ParagraphBlock, ButtonBlock, ImageBlock, DividerBlock, SpacerBlock, IconBlock,
  SectionBlock, ColumnsBlock, TabsBlock, AccordionBlock,
  VideoBlock, GalleryBlock, CarouselBlock, MapBlock,
  IconBoxBlock, CounterBlock, PricingTableBlock, TestimonialCardBlock, CtaBannerBlock, AlertBlock,
  SocialIconsBlock, LatestPostsBlock,
} from './elementor-blocks';

const REGISTRY: Record<string, React.ComponentType<{ data: any }>> = {
  // Custom Epitaphe blocks
  hero: HeroBlock,
  intro: IntroBlock,
  stats: StatsBlock,
  clients: ClientsBlock,
  avantages: AvantagesBlock,
  poles: PolesBlock,
  commpulse: CommPulseBlock,
  fabrique: FabriqueBlock,
  articles: ArticlesBlock,
  cta: CtaBlock,
  richtext: RichTextBlock,
  'service-hero': ServiceHeroBlock,
  'service-blocks': ServiceBlocksBlock,
  'hub-cards': HubCardsBlock,
  pitch: PitchBlock,
  'references-strip': ReferencesStripBlock,
  testimonial: TestimonialBlock,
  'contact-form': ContactFormBlock,
  'image-text': ImageTextBlock,
  team: TeamBlock,
  faq: FaqBlock,
  'tools-grid': ToolsGridBlock,
  'resources-grid': ResourcesGridBlock,
  // Elementor-like widgets — Basique
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  button: ButtonBlock,
  image: ImageBlock,
  divider: DividerBlock,
  spacer: SpacerBlock,
  icon: IconBlock,
  // Layout
  section: SectionBlock,
  columns: ColumnsBlock,
  tabs: TabsBlock,
  accordion: AccordionBlock,
  // Média
  video: VideoBlock,
  gallery: GalleryBlock,
  carousel: CarouselBlock,
  map: MapBlock,
  // Interactif
  'icon-box': IconBoxBlock,
  counter: CounterBlock,
  'pricing-table': PricingTableBlock,
  'testimonial-card': TestimonialCardBlock,
  'cta-banner': CtaBannerBlock,
  alert: AlertBlock,
  // Social
  'social-icons': SocialIconsBlock,
  'latest-posts': LatestPostsBlock,
};

interface Props {
  sections: HomeSection[];
}

export function PageSectionsRenderer({ sections }: Props) {
  const sorted = [...sections]
    .filter(s => s.enabled !== false)
    .sort((a, b) => a.order - b.order);

  console.log('[PageSectionsRenderer] sections in:', sections.length, '→ visible:', sorted.length, sorted.map(s => `${s.type}#${s.id}`));

  return (
    <>
      {sorted.map((section) => {
        const Comp = REGISTRY[section.type];
        if (!Comp) {
          console.warn('[PageSectionsRenderer] no component for type:', section.type);
          return null;
        }
        try {
          return <Comp key={section.id} data={section} />;
        } catch (err) {
          console.error('[PageSectionsRenderer] crash in', section.type, '#', section.id, err);
          return <div key={section.id} style={{padding:20,background:'#fee',color:'#900',margin:8,border:'1px solid #c00'}}>Erreur rendu section <b>{section.type}</b> #{section.id}</div>;
        }
      })}
    </>
  );
}

/** Alias pour compatibilité ascendante (home-v6.tsx) */
export const HomePageRenderer = PageSectionsRenderer;

