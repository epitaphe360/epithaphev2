/**
 * Page Détail — Étude de cas (/nos-references/:slug)
 * Sections CDC 2.5 : Hero, Problématique, Solution, Résultats, KPIs, Galerie,
 * Services liés (maillage interne), Témoignage, CTA Brief
 */
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageMeta } from "@/components/seo/page-meta";
import { RevealSection } from "@/components/reveal-section";
import { LightboxGallery, type GalleryItem } from "@/components/lightbox-gallery";
import {
  ArrowLeft, ArrowRight, ChevronRight, TrendingUp, Award, Users, BarChart2,
  Star, Quote, ExternalLink, Calendar,
} from "lucide-react";

/* ──────── Types ──────────────────────────────────────────── */
interface KPI {
  value: string;
  label: string;
  icon?: string;
}

interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  clientName?: string;
  problem?: string;
  solution?: string;
  results?: string;
  kpis?: KPI[];
  gallery?: GalleryItem[];
  relatedServiceSlugs?: string[];
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  openGraphImage?: string;
  publishedAt?: string;
  testimonial?: {
    id: string;
    quote: string;
    authorName: string;
    authorTitle?: string;
    companyName?: string;
    companyLogo?: string;
    rating?: number;
  } | null;
}

/* ──────── Icône KPI ──────────────────────────────────────── */
const KPI_ICONS: Record<string, React.ReactNode> = {
  "trending-up":   <TrendingUp  className="w-5 h-5" />,
  "award":         <Award       className="w-5 h-5" />,
  "users":         <Users       className="w-5 h-5" />,
  "bar-chart":     <BarChart2   className="w-5 h-5" />,
};

/* ──────── Carte service lié ─────────────────────────────── */
const SERVICE_LABELS: Record<string, { label: string; href: string }> = {
  "evenements":                        { label: "Événements",                href: "/evenements" },
  "conventions-kickoffs":              { label: "Conventions & Kickoffs",    href: "/evenements/conventions-kickoffs" },
  "soirees-de-gala":                   { label: "Soirées de gala",           href: "/evenements/soirees-de-gala" },
  "roadshows":                         { label: "Roadshows & Tournées",      href: "/evenements/roadshows" },
  "salons":                            { label: "Salons & Expositions",      href: "/evenements/salons" },
  "architecture-de-marque":            { label: "Architecture de Marque",    href: "/architecture-de-marque" },
  "marque-employeur":                  { label: "Marque Employeur",          href: "/architecture-de-marque/marque-employeur" },
  "communication-qhse":                { label: "Communication QHSE",        href: "/architecture-de-marque/communication-qhse" },
  "experience-clients":                { label: "Expérience Clients",        href: "/architecture-de-marque/experience-clients" },
  "la-fabrique":                       { label: "La Fabrique",               href: "/la-fabrique" },
  "impression":                        { label: "Impression grand format",   href: "/la-fabrique/impression" },
  "menuiserie":                        { label: "Menuiserie & Décor",        href: "/la-fabrique/menuiserie" },
  "signaletique":                      { label: "Signalétique",              href: "/la-fabrique/signaletique" },
  "amenagement":                       { label: "Aménagement Espace",        href: "/la-fabrique/amenagement" },
};

/* ──────── Squelette de chargement ──────────────────────── */
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

/* ──────── Page principale ──────────────────────────────── */
export default function ReferenceDetailPage() {
  const [, params] = useRoute("/nos-references/:slug");
  const slug = params?.slug ?? "";

  const { data: caseStudy, isLoading, isError } = useQuery<CaseStudy>({
    queryKey: ["case-study", slug],
    queryFn: async () => {
      const res = await fetch(`/api/case-studies/${slug}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    enabled: !!slug,
  });

  if (isLoading) return (
    <>
      <Navigation />
      <div className="pt-24 pb-16 max-w-4xl mx-auto px-4 space-y-8">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
      </div>
      <Footer />
    </>
  );

  if (isError || !caseStudy) return (
    <>
      <Navigation />
      <div className="pt-32 pb-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Étude de cas introuvable</h1>
        <Link href="/nos-references">
          <button className="flex items-center gap-2 mx-auto text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" /> Retour aux références
          </button>
        </Link>
      </div>
      <Footer />
    </>
  );

  const gallery: GalleryItem[] = Array.isArray(caseStudy.gallery) ? caseStudy.gallery : [];
  const kpis: KPI[]          = Array.isArray(caseStudy.kpis)    ? caseStudy.kpis    : [];
  const relatedSlugs: string[] = Array.isArray(caseStudy.relatedServiceSlugs) ? caseStudy.relatedServiceSlugs : [];

  return (
    <>
      <PageMeta
        title={caseStudy.metaTitle ?? `${caseStudy.title} — Epitaphe 360`}
        description={caseStudy.metaDescription ?? caseStudy.problem ?? ""}
        ogImage={caseStudy.openGraphImage ?? caseStudy.featuredImage}
      />
      <Navigation />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative pt-24 pb-0 overflow-hidden">
        {caseStudy.featuredImage ? (
          <div className="absolute inset-0 z-0">
            <img
              src={caseStudy.featuredImage}
              alt={caseStudy.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/10 via-primary/5 to-background" />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          {/* Fil d'ariane */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/nos-references" className="hover:text-white transition-colors">Références</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/90">{caseStudy.clientName ?? caseStudy.title}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            {caseStudy.clientName && (
              <span className="inline-block bg-primary/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                {caseStudy.clientName}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              {caseStudy.title}
            </h1>
            {caseStudy.publishedAt && (
              <p className="flex items-center gap-2 text-white/60 text-sm">
                <Calendar className="w-4 h-4" />
                {new Date(caseStudy.publishedAt).toLocaleDateString("fr-FR", {
                  year: "numeric", month: "long",
                })}
              </p>
            )}
          </motion.div>
        </div>

        {/* Courbe de transition */}
        <div className="relative z-10 h-16">
          <svg viewBox="0 0 1440 64" className="absolute bottom-0 w-full text-background fill-current" preserveAspectRatio="none">
            <path d="M0,64 C240,32 480,0 720,0 C960,0 1200,32 1440,64 L1440,64 L0,64 Z" />
          </svg>
        </div>
      </section>

      {/* ── KPIs ─────────────────────────────────────────── */}
      {kpis.length > 0 && (
        <section className="bg-background py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <RevealSection>
              <div className={`grid grid-cols-2 md:grid-cols-${Math.min(kpis.length, 4)} gap-4 md:gap-6`}>
                {kpis.map((kpi, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
                  >
                    {kpi.icon && KPI_ICONS[kpi.icon] && (
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                        {KPI_ICONS[kpi.icon]}
                      </div>
                    )}
                    <p className="text-3xl md:text-4xl font-bold text-primary mb-1">{kpi.value}</p>
                    <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  </motion.div>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>
      )}

      {/* ── Contenu principal (3 blocs) ─────────────────── */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">

          {/* Problématique */}
          {caseStudy.problem && (
            <RevealSection>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-1 rounded-full bg-red-400" />
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="text-red-400">01</span> La problématique
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{caseStudy.problem}</p>
                </div>
              </div>
            </RevealSection>
          )}

          {/* Solution */}
          {caseStudy.solution && (
            <RevealSection>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-1 rounded-full bg-primary" />
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="text-primary">02</span> Notre solution
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{caseStudy.solution}</p>
                </div>
              </div>
            </RevealSection>
          )}

          {/* Résultats */}
          {caseStudy.results && (
            <RevealSection>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-1 rounded-full bg-green-500" />
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="text-green-500">03</span> Les résultats
                  </h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{caseStudy.results}</p>
                </div>
              </div>
            </RevealSection>
          )}

        </div>
      </section>

      {/* ── Galerie ──────────────────────────────────────── */}
      {gallery.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <RevealSection>
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Galerie du projet</h2>
              <LightboxGallery items={gallery} />
            </RevealSection>
          </div>
        </section>
      )}

      {/* ── Témoignage ───────────────────────────────────── */}
      {caseStudy.testimonial && (
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <RevealSection>
              <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
                <Quote className="absolute top-6 right-6 w-16 h-16 text-primary/10" />
                {/* Étoiles */}
                {caseStudy.testimonial.rating && (
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (caseStudy.testimonial!.rating ?? 5) ? "text-amber-400 fill-amber-400" : "text-muted"}`}
                      />
                    ))}
                  </div>
                )}
                <blockquote className="text-lg md:text-xl italic text-foreground/80 leading-relaxed mb-6">
                  "{caseStudy.testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  {caseStudy.testimonial.companyLogo && (
                    <img
                      src={caseStudy.testimonial.companyLogo}
                      alt={caseStudy.testimonial.companyName ?? ""}
                      className="h-8 w-auto object-contain"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{caseStudy.testimonial.authorName}</p>
                    {(caseStudy.testimonial.authorTitle || caseStudy.testimonial.companyName) && (
                      <p className="text-sm text-muted-foreground">
                        {[caseStudy.testimonial.authorTitle, caseStudy.testimonial.companyName].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>
        </section>
      )}

      {/* ── Services liés (maillage interne) ────────────── */}
      {relatedSlugs.length > 0 && (
        <section className="py-16 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <RevealSection>
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Services mobilisés</h2>
              <p className="text-muted-foreground text-center mb-8">Découvrez les expertises Epitaphe 360 ayant contribué à ce projet</p>
              <div className="flex flex-wrap justify-center gap-3">
                {relatedSlugs.map((s) => {
                  const svc = SERVICE_LABELS[s];
                  if (!svc) return null;
                  return (
                    <Link key={s} href={svc.href}>
                      <motion.span
                        whileHover={{ scale: 1.04 }}
                        className="inline-flex items-center gap-1.5 bg-card border border-border rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-primary hover:text-white hover:border-primary transition-colors cursor-pointer"
                      >
                        {svc.label} <ExternalLink className="w-3 h-3 opacity-60" />
                      </motion.span>
                    </Link>
                  );
                })}
              </div>
            </RevealSection>
          </div>
        </section>
      )}

      {/* ── CTA Brief ────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <RevealSection>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Un projet similaire en tête ?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Parlez-nous de votre contexte — nous vous proposerons une approche sur mesure sous 48 h.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/contact/brief">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Déposer un brief <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/nos-references">
                <button className="flex items-center gap-2 text-foreground/70 hover:text-primary px-4 py-3.5 transition-colors text-sm font-medium">
                  <ArrowLeft className="w-4 h-4" /> Voir toutes nos références
                </button>
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      <Footer />
    </>
  );
}
