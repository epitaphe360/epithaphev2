/**
 * Home — page d'accueil pilotée par sections JSON depuis la DB.
 * Architecture :
 *   1. useHomeSections() charge `pages.sections` (slug='home') ou tombe sur le fallback.
 *   2. <HomePageRenderer> mappe chaque section à son composant React (registry).
 *   3. Les composants Navigation / Footer restent globaux (pas pilotés par sections).
 *
 * Édition : via /admin/pages → page "Accueil" → onglet Sections.
 */
import { PageMeta } from '@/components/seo/page-meta';
import { SpeakableSchema } from '@/components/seo/schema-org';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { HomePageRenderer } from '@/components/sections/HomePageRenderer';
import { useHomeSections } from '@/hooks/useHomeSections';

export default function HomeV6() {
  const { sections } = useHomeSections();

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Epitaphe 360 — Agence de Communication Stratégique à Casablanca"
        description="Agence de communication stratégique basée à Casablanca. Structuring influence. Securing growth. Partenaire des organisations au cœur des 12 régions du Maroc."
        canonicalPath="/"
        schemaType="WebPage"
      />
      <SpeakableSchema cssSelectors={["h1", ".hero-title", ".hero-description", "section:first-of-type p"]} />
      <Navigation />
      <HomePageRenderer sections={sections} />
      <Footer />
    </div>
  );
}
