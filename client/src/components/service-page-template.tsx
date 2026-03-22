import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { RevealSection } from "./reveal-section";
import { TestimonialCard } from "./testimonial-card";
import { LightboxGallery, type GalleryItem } from "./lightbox-gallery";

/* ─── Types ─────────────────────────────────────────────────── */
export interface ServiceBlock {
  title: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  features?: string[];
}

export interface CaseStudyPreview {
  title: string;
  client: string;
  sector: string;
  image?: string;
  slug: string;
  excerpt: string;
}

export interface Testimonial {
  author: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
  avatarUrl?: string;
}

export interface Reference {
  name: string;
  logoUrl?: string;
}

export interface ServicePageData {
  /** Section 1 — Hero */
  heroTitle: string;
  heroSubtitle: string;
  heroTag?: string;
  heroImage?: string;
  heroCta?: { label: string; href: string };

  /** Section 2 — Accroche / Pitch */
  pitchTitle: string;
  pitchBody: string;
  pitchStats?: { value: string; label: string }[];

  /** Section 3 — Blocs de service */
  serviceBlocks: ServiceBlock[];

  /** Section 4 — Avantage La Fabrique */
  fabriqueCta?: {
    title: string;
    body: string;
    image?: string;
  };

  /** Section 5 — Références logos */
  references?: Reference[];

  /** Section 6 — Étude(s) de cas */
  caseStudies?: CaseStudyPreview[];

  /** Section 7 — Témoignage */
  testimonials?: Testimonial[];

  /** Galerie */
  gallery?: GalleryItem[];

  /** Section 8 — CTA final */
  ctaTitle: string;
  ctaBody: string;
  ctaHref?: string;
  ctaLabel?: string;
}

/* ─── Divider décoratif ─────────────────────────────────────── */
function GoldDivider({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="w-2 h-2 rotate-45 bg-primary/40 flex-shrink-0" />
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}

/* ─── Page template ─────────────────────────────────────────── */
export function ServicePageTemplate({ data }: { data: ServicePageData }) {
  return (
    <main className="min-h-screen bg-background">

      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        {data.heroImage && (
          <div className="absolute inset-0">
            <img src={data.heroImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
          </div>
        )}
        {!data.heroImage && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        )}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
            {data.heroTag && (
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                {data.heroTag}
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground max-w-2xl leading-tight mb-4">
              {data.heroTitle}
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-8">{data.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3">
              {data.heroCta && (
                <Link href={data.heroCta.href}>
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
                  >
                    {data.heroCta.label} <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              )}
              <Link href="/contact/brief">
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-xl font-semibold text-sm hover:border-primary hover:text-primary transition-colors"
                >
                  Déposer un brief <ChevronRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. Pitch ─────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{data.pitchTitle}</h2>
            <GoldDivider className="mb-6 mx-auto max-w-xs" />
            <p className="text-muted-foreground leading-relaxed text-base md:text-lg">{data.pitchBody}</p>
          </RevealSection>
          {data.pitchStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.pitchStats.map((stat, i) => (
                <RevealSection key={i} delay={i * 0.08} className="text-center bg-card border border-border rounded-2xl p-6">
                  <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </RevealSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. Blocs de service ──────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <RevealSection className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Nos prestations</h2>
            <GoldDivider className="mx-auto max-w-xs" />
          </RevealSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.serviceBlocks.map((block, i) => (
              <RevealSection key={i} delay={i * 0.07} direction="up">
                <div className="h-full bg-card border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300 group">
                  {block.image && (
                    <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                      <img src={block.image} alt={block.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  {block.icon && (
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                      {block.icon}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{block.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{block.description}</p>
                  {block.features && (
                    <ul className="space-y-1.5">
                      {block.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Avantage La Fabrique ──────────────────────────── */}
      {data.fabriqueCta && (
        <section className="py-16 md:py-20 bg-foreground text-background overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <RevealSection direction="right">
                <span className="inline-block bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wide">
                  100% Made in Epitaphe
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{data.fabriqueCta.title}</h2>
                <p className="text-background/70 leading-relaxed mb-6">{data.fabriqueCta.body}</p>
                <Link href="/la-fabrique">
                  <motion.button
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm"
                  >
                    Découvrir La Fabrique <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </RevealSection>
              {data.fabriqueCta.image && (
                <RevealSection direction="left">
                  <img src={data.fabriqueCta.image} alt="La Fabrique Epitaphe" className="rounded-2xl w-full object-cover max-h-80" />
                </RevealSection>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. Références logos ──────────────────────────────── */}
      {data.references && data.references.length > 0 && (
        <section className="py-14 border-y border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <RevealSection className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ils nous font confiance</p>
            </RevealSection>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {data.references.map((ref, i) => (
                <RevealSection key={i} delay={i * 0.05} direction="none">
                  {ref.logoUrl ? (
                    <img src={ref.logoUrl} alt={ref.name} className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" />
                  ) : (
                    <span className="text-sm font-semibold text-muted-foreground">{ref.name}</span>
                  )}
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 6. Études de cas ─────────────────────────────────── */}
      {data.caseStudies && data.caseStudies.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <RevealSection className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Études de cas</h2>
              <GoldDivider className="mx-auto max-w-xs" />
            </RevealSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.caseStudies.map((cs, i) => (
                <RevealSection key={i} delay={i * 0.08}>
                  <Link href={`/nos-references/${cs.slug}`}>
                    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                      className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                      {cs.image && (
                        <div className="relative h-44 overflow-hidden">
                          <img src={cs.image} alt={cs.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full">{cs.sector}</span>
                        </div>
                      )}
                      <div className="p-5">
                        <p className="text-xs text-muted-foreground mb-1">{cs.client}</p>
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-2">{cs.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{cs.excerpt}</p>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-3">
                          Voir le cas <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Galerie ───────────────────────────────────────────── */}
      {data.gallery && data.gallery.length > 0 && (
        <section className="py-16 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <RevealSection className="text-center mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-3">Notre réalisation en images</h2>
              <GoldDivider className="mx-auto max-w-xs" />
            </RevealSection>
            <LightboxGallery items={data.gallery} columns={3} />
          </div>
        </section>
      )}

      {/* ── 7. Témoignages ───────────────────────────────────── */}
      {data.testimonials && data.testimonials.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <RevealSection className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Ce que disent nos clients</h2>
              <GoldDivider className="mx-auto max-w-xs" />
            </RevealSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.testimonials.map((t, i) => (
                <RevealSection key={i} delay={i * 0.08}>
                  <TestimonialCard {...t} />
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. CTA final ─────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <RevealSection>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">{data.ctaTitle}</h2>
            <p className="text-muted-foreground mb-8 text-lg">{data.ctaBody}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={data.ctaHref ?? "/contact/brief"}>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  {data.ctaLabel ?? "Déposer un brief"} <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link href="/contact">
                <button className="px-8 py-3.5 rounded-xl border border-border font-semibold text-foreground hover:border-primary hover:text-primary transition-colors">
                  Nous contacter
                </button>
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>
    </main>
  );
}
