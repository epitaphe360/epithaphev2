/**
 * Breadcrumbs — fil d'Ariane avec Schema.org BreadcrumbList
 * Injecte automatiquement le JSON-LD et affiche visuellement le fil.
 * Usage : <Breadcrumbs />  — auto-détecte le chemin via wouter
 *         <Breadcrumbs items={[...]} />  — items personnalisés
 */
import { useLocation, Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { Helmet } from "react-helmet-async";

export interface BreadcrumbItem {
  label: string;
  path: string;
}

/* ─── Map segment → label ──────────────────────────────────────────── */
const SEGMENT_LABELS: Record<string, string> = {
  "evenements": "Événements",
  "conventions-kickoffs": "Conventions & Kickoffs",
  "soirees-de-gala": "Soirées de Gala",
  "roadshows": "Roadshows",
  "salons": "Salons & Expositions",
  "architecture-de-marque": "Architecture de Marque",
  "marque-employeur": "Marque Employeur",
  "communication-qhse": "Communication QHSE",
  "experience-clients": "Expérience Clients",
  "la-fabrique": "La Fabrique",
  "impression": "Impression",
  "menuiserie": "Menuiserie & Agencement",
  "signaletique": "Signalétique",
  "amenagement": "Aménagement d'Espaces",
  "contact": "Contact",
  "brief": "Brief Projet",
  "outils": "Outils",
  "vigilance-score": "Vigilance Score",
  "calculateur-fabrique": "Calculateur Fabrique",
  "stand-viewer": "Stand Viewer 3D",
  "blog": "Blog",
  "references": "Références",
  "ressources": "Ressources",
  "espace-client": "Espace Client",
  "analytics": "Analytics",
};

const BASE_URL = "https://epitaphe360.ma";

/** Génère les items breadcrumb à partir du chemin URL */
function buildFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [{ label: "Accueil", path: "/" }];
  let accumulated = "";
  for (const seg of segments) {
    accumulated += `/${seg}`;
    items.push({ label: SEGMENT_LABELS[seg] ?? seg, path: accumulated });
  }
  return items;
}

interface BreadcrumbsProps {
  /** Items personnalisés — si omis, auto-généré depuis l'URL */
  items?: BreadcrumbItem[];
  /** Masquer le breadcrumb sur la page d'accueil */
  hideOnHome?: boolean;
  className?: string;
}

export function Breadcrumbs({ items, hideOnHome = true, className = "" }: BreadcrumbsProps) {
  const [location] = useLocation();
  const crumbs = items ?? buildFromPath(location);

  if (hideOnHome && location === "/") return null;
  if (crumbs.length <= 1) return null;

  /* JSON-LD Schema.org BreadcrumbList */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.label,
      "item": `${BASE_URL}${crumb.path}`,
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <nav
        aria-label="Fil d'Ariane"
        className={`flex items-center flex-wrap gap-1 text-sm text-muted-foreground py-3 px-4 ${className}`}
      >
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <span key={crumb.path} className="flex items-center gap-1">
              {index === 0 ? (
                <Link
                  href={crumb.path}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                  aria-label="Accueil"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span className="sr-only">Accueil</span>
                </Link>
              ) : isLast ? (
                <span
                  className="font-medium text-foreground max-w-[200px] truncate"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className="hover:text-primary transition-colors"
                >
                  {crumb.label}
                </Link>
              )}

              {!isLast && (
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}

export default Breadcrumbs;
