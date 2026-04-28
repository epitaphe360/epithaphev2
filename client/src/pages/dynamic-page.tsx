/**
 * DynamicPage — composant générique pour toutes les pages pilotées par sections JSON (DB).
 * Route wouter: /:slug*  (capture /a-propos, /architecture-de-marque/marque-employeur, etc.)
 *
 * Flow :
 *   1. Lit le slug depuis useLocation() (méthode fiable pour wouter v3).
 *   2. Fetch /api/pages/by-slug?slug=<slug> via React Query.
 *   3. Rend <PageSectionsRenderer sections={page.sections} />.
 *   4. 404 si page non trouvée, spinner pendant le chargement.
 */
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { PageMeta } from '@/components/seo/page-meta';
import { BreadcrumbSchema, ServiceSchema, SpeakableSchema } from '@/components/seo/schema-org';
import { PageSectionsRenderer } from '@/components/sections/HomePageRenderer';
import type { HomeSection } from '@shared/home-sections';

interface PageData {
  id: number;
  slug: string;
  title: string;
  metaDescription?: string;
  template?: string;
  sections: HomeSection[];
}

async function fetchPageBySlug(slug: string): Promise<PageData> {
  console.log('[DynamicPage] fetch slug:', slug);
  const res = await fetch(`/api/pages/by-slug?slug=${encodeURIComponent(slug)}`);
  console.log('[DynamicPage] response status:', res.status);
  if (res.status === 404) throw new Error('not-found');
  if (!res.ok) throw new Error('fetch-error');
  const data = await res.json();
  console.log('[DynamicPage] raw data:', data);
  // Normalise : sections peut être un array ou un objet (ancien format)
  const raw = data.sections;
  const sections: HomeSection[] = Array.isArray(raw) ? raw : [];
  console.log('[DynamicPage] normalized sections:', sections.length, sections.map(s => s.type));
  return { ...data, sections };
}

export function DynamicPage() {
  const [location] = useLocation();
  // useLocation() retourne le chemin courant (ex: "/evenements/conventions-kickoffs")
  // On retire le slash initial et les éventuels query params / hash
  const slug = location.split('?')[0].split('#')[0].replace(/^\//, '') || 'home';
  console.log('[DynamicPage] location=', location, '→ slug=', slug);

  const { data: page, isLoading, isError, error } = useQuery<PageData, Error>({
    queryKey: ['page', slug],
    queryFn: () => fetchPageBySlug(slug),
    staleTime: 1000 * 60 * 5,
    retry: (count, err) => err.message !== 'not-found' && count < 2,
  });

  console.log('[DynamicPage] render state:', { slug, isLoading, isError, errMsg: error?.message, hasPage: !!page, sectionsLen: page?.sections?.length });

  // Détermine le type de schéma selon le slug
  const isServiceSlug = ['evenements', 'architecture-de-marque', 'la-fabrique', 'nos-poles'].some(
    (s) => slug === s || slug.startsWith(`${s}/`)
  );

  // Construit le fil d'Ariane à partir du slug (/a/b/c → [{name:A, url:/a}, {name:A/B, url:/a/b}, ...])
  const breadcrumbItems = (() => {
    const parts = slug.split('/').filter(Boolean);
    const items = [{ name: 'Accueil', url: '/' }];
    let path = '';
    for (const part of parts) {
      path += `/${part}`;
      items.push({ name: part.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), url: path });
    }
    return items;
  })();

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title={page?.title ?? 'Epitaphe 360'}
        description={page?.metaDescription ?? ''}
        canonicalPath={`/${slug}`}
        schemaType={isServiceSlug ? 'Service' : 'WebPage'}
      />
      {page && <BreadcrumbSchema items={breadcrumbItems} />}
      {isServiceSlug && page && (
        <ServiceSchema
          name={page.title}
          description={page.metaDescription ?? ''}
          url={`/${slug}`}
        />
      )}
      {isServiceSlug && <SpeakableSchema />}
      <Navigation />

      {isLoading && (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      )}

      {isError && error?.message === 'not-found' && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
          <p className="text-6xl font-bold text-muted-foreground/30">404</p>
          <h1 className="text-2xl font-bold text-foreground">Page introuvable</h1>
          <p className="text-muted-foreground">La page <code className="text-sm bg-muted px-2 py-0.5 rounded">/{slug}</code> n'existe pas.</p>
          <a href="/" className="mt-4 inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-sm text-sm font-semibold hover:bg-primary/90 transition-colors">
            Retour à l'accueil
          </a>
        </div>
      )}

      {isError && error?.message !== 'not-found' && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
          <p className="text-muted-foreground">Erreur lors du chargement. Veuillez réessayer.</p>
          <button onClick={() => window.location.reload()} className="text-primary underline text-sm">Recharger</button>
        </div>
      )}

      {page && page.sections.length > 0 && (
        <PageSectionsRenderer sections={page.sections} />
      )}

      {page && page.sections.length === 0 && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
          <h1 className="text-3xl font-bold text-foreground">{page.title}</h1>
          <p className="text-muted-foreground">Cette page est en cours de construction.</p>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default DynamicPage;

