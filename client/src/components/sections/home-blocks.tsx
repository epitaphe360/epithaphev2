/**
 * Composants de sections de toutes les pages — purs, props depuis JSON DB.
 * Importés et mappés par <PageSectionsRenderer />.
 */
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronRight, CheckCircle2, Calendar, MapPin, Phone, Mail, Clock, Send, Star, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { sanitizeHtml } from '@/lib/sanitize';
import { RevealSection } from '@/components/reveal-section';
import { StatsSection as StatsSectionComp } from '@/components/stats-section';
import { ContextualCta } from '@/components/contextual-cta';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import type {
  HeroSection, IntroSection, StatsSection, ClientsSection,
  AvantagesSection, PolesSection, CommPulseSection, FabriqueSection,
  ArticlesSection, CtaSection, RichTextSection,
  ServiceHeroSection, ServiceBlocksSection, HubCardsSection, PitchSection,
  ReferencesStripSection, TestimonialSection, ContactFormSection,
  ImageTextSection, TeamSection, FaqSection, ToolsGridSection, ResourcesGridSection,
} from '@shared/home-sections';

// ─── Hero ────────────────────────────────────────────────────────────────────
export function HeroBlock({ data }: { data: HeroSection }) {
  return (
    <section className="relative pt-20 min-h-[65vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${data.backgroundImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
        >
          <span className="inline-block bg-primary px-4 py-2">{data.titleLine1}</span>
          <br />
          <span className="inline-block bg-primary px-4 py-2 mt-2">{data.titleLine2}</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-white/80 text-lg mb-8"
        >{data.subtitle}</motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Link href={data.primaryCta.href}>
            <span className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-7 py-3.5 text-sm font-semibold transition-all duration-200 cursor-pointer rounded-sm">
              {data.primaryCta.label} <ArrowRight size={16} />
            </span>
          </Link>
          {data.secondaryCta && (
            <Link href={data.secondaryCta.href}>
              <span className="inline-flex items-center gap-2 border border-white/50 hover:border-white text-white/80 hover:text-white px-7 py-3.5 text-sm transition-all duration-200 cursor-pointer rounded-sm">
                {data.secondaryCta.label}
              </span>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Intro Agence ────────────────────────────────────────────────────────────
export function IntroBlock({ data }: { data: IntroSection }) {
  return (
    <section className="py-16 md:py-24 bg-muted/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealSection>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4">{data.eyebrow}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6">{data.title}</h2>
              <div
                className="text-muted-foreground leading-relaxed mb-6 space-y-4"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.bodyHtml) }}
              />
              <div className="space-y-3">
                {data.bullets.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              {data.ctaLabel && data.ctaHref && (
                <div className="mt-8">
                  <Link href={data.ctaHref}>
                    <span className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all cursor-pointer">
                      {data.ctaLabel} <ArrowRight size={16} />
                    </span>
                  </Link>
                </div>
              )}
            </div>
            <div className="relative aspect-square overflow-hidden rounded-sm">
              <img src={data.image} alt={data.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

// ─── Stats ───────────────────────────────────────────────────────────────────
export function StatsBlock({ data: _data }: { data: StatsSection }) {
  // StatsSection existant lit déjà depuis settings, on le réutilise tel quel.
  return <StatsSectionComp />;
}

// ─── Clients ─────────────────────────────────────────────────────────────────
export function ClientsBlock({ data }: { data: ClientsSection }) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{data.title}</h2>
            {data.subtitle && <p className="text-muted-foreground">{data.subtitle}</p>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center">
            {data.logos.map((c) => (
              <div key={c.name} className="flex items-center justify-center p-4 bg-muted/30 rounded-sm hover:bg-muted/50 transition-colors h-24">
                <img src={c.logo} alt={c.name} className="max-h-12 max-w-full object-contain grayscale hover:grayscale-0 transition-all" loading="lazy" />
              </div>
            ))}
          </div>
          {data.ctaLabel && data.ctaHref && (
            <div className="text-center mt-10">
              <Link href={data.ctaHref}>
                <span className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all cursor-pointer">
                  {data.ctaLabel} <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          )}
        </RevealSection>
      </div>
    </section>
  );
}

// ─── Avantages ───────────────────────────────────────────────────────────────
export function AvantagesBlock({ data }: { data: AvantagesSection }) {
  return (
    <section className="py-16 md:py-24 bg-muted/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{data.title}</h2>
            {data.subtitle && <p className="text-muted-foreground">{data.subtitle}</p>}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((a) => (
              <div key={a.title} className="bg-background p-6 rounded-sm border border-border hover:border-primary/40 transition-colors">
                <CheckCircle2 className="text-primary mb-4" size={24} />
                <h3 className="font-semibold text-foreground mb-2">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

// ─── Pôles ───────────────────────────────────────────────────────────────────
export function PolesBlock({ data }: { data: PolesSection }) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{data.title}</h2>
            {data.subtitle && <p className="text-muted-foreground">{data.subtitle}</p>}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((p) => (
              <Link key={p.num} href={p.href}>
                <div className="group bg-muted/20 p-8 rounded-sm border border-border hover:border-primary hover:bg-muted/40 transition-all cursor-pointer h-full">
                  <div className="text-primary text-5xl font-bold mb-4 opacity-30 group-hover:opacity-100 transition-opacity">{p.num}</div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex items-center gap-1 text-primary text-sm font-semibold">
                    En savoir plus <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

// ─── CommPulse Banner ────────────────────────────────────────────────────────
export function CommPulseBlock({ data }: { data: CommPulseSection }) {
  return (
    <section className="py-16 md:py-20 bg-primary/5 border-y border-primary/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {data.badge && (
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-sm mb-4">{data.badge}</span>
        )}
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{data.title}</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">{data.body}</p>
        <Link href={data.ctaHref}>
          <span className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-7 py-3.5 text-sm font-semibold transition-all rounded-sm cursor-pointer">
            {data.ctaLabel} <ArrowRight size={16} />
          </span>
        </Link>
      </div>
    </section>
  );
}

// ─── Fabrique ────────────────────────────────────────────────────────────────
export function FabriqueBlock({ data }: { data: FabriqueSection }) {
  return (
    <section className="py-16 md:py-24 bg-muted/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealSection>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4">{data.eyebrow}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{data.title}</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{data.body}</p>
              <ul className="space-y-3 mb-8">
                {data.services.map((s) => (
                  <li key={s.title}>
                    <Link href={s.href}>
                      <span className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors cursor-pointer">
                        <ChevronRight size={14} className="text-primary" /> {s.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {data.ctaLabel && data.ctaHref && (
                <Link href={data.ctaHref}>
                  <span className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 text-sm font-semibold transition-all rounded-sm cursor-pointer">
                    {data.ctaLabel} <ArrowRight size={16} />
                  </span>
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {data.images.slice(0, 4).map((img, i) => (
                <div key={i} className={`overflow-hidden rounded-sm ${i % 2 === 0 ? 'aspect-[4/5]' : 'aspect-square'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

// ─── Articles (fetch dynamique) ──────────────────────────────────────────────
export function ArticlesBlock({ data }: { data: ArticlesSection }) {
  const [articles, setArticles] = useState<Array<{ id: string; title: string; slug: string; excerpt?: string; featuredImage?: string; publishedAt?: string }>>([]);
  useEffect(() => {
    fetch(`/api/articles?limit=${data.limit}&status=PUBLISHED`)
      .then(r => r.ok ? r.json() : { data: [] })
      .then(d => {
        const items = Array.isArray(d) ? d : (d?.data ?? d?.articles ?? []);
        setArticles(items.slice(0, data.limit));
      })
      .catch(() => {});
  }, [data.limit]);

  if (articles.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{data.title}</h2>
            {data.subtitle && <p className="text-muted-foreground">{data.subtitle}</p>}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((a) => (
              <Link key={a.id} href={`/blog/${a.slug}`}>
                <article className="group bg-muted/20 rounded-sm overflow-hidden border border-border hover:border-primary/40 transition-all cursor-pointer h-full flex flex-col">
                  {a.featuredImage && (
                    <div className="aspect-video overflow-hidden bg-muted/30">
                      <img
                        src={a.featuredImage}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    {a.publishedAt && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                        <Calendar size={12} /> {new Date(a.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    )}
                    <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">{a.title}</h3>
                    {a.excerpt && <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{a.excerpt}</p>}
                  </div>
                </article>
              </Link>
            ))}
          </div>
          {data.ctaLabel && data.ctaHref && (
            <div className="text-center mt-10">
              <Link href={data.ctaHref}>
                <span className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all cursor-pointer">
                  {data.ctaLabel} <ArrowRight size={16} />
                </span>
              </Link>
            </div>
          )}
        </RevealSection>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
export function CtaBlock({ data }: { data: CtaSection }) {
  const bg = data.background === 'dark'
    ? 'bg-foreground text-background'
    : data.background === 'light'
    ? 'bg-muted/30 text-foreground'
    : 'bg-primary text-white';
  return (
    <section className={`py-16 md:py-20 ${bg}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl md:text-4xl font-bold mb-4">{data.title}</h2>
        <p className="text-base md:text-lg opacity-90 mb-8 max-w-2xl mx-auto">{data.body}</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href={data.primaryCta.href}>
            <span className="inline-flex items-center gap-2 bg-white text-primary hover:bg-white/90 px-7 py-3.5 text-sm font-semibold transition-all rounded-sm cursor-pointer">
              {data.primaryCta.label} <ArrowRight size={16} />
            </span>
          </Link>
          {data.secondaryCta && (
            <Link href={data.secondaryCta.href}>
              <span className="inline-flex items-center gap-2 border border-white/50 hover:border-white text-white px-7 py-3.5 text-sm transition-all rounded-sm cursor-pointer">
                {data.secondaryCta.label}
              </span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── RichText (HTML libre) ───────────────────────────────────────────────────
export function RichTextBlock({ data }: { data: RichTextSection }) {
  const max = data.maxWidth === 'sm' ? 'max-w-2xl' : data.maxWidth === 'md' ? 'max-w-3xl'
    : data.maxWidth === 'xl' ? 'max-w-7xl' : data.maxWidth === 'full' ? 'max-w-none' : 'max-w-4xl';
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className={`${max} mx-auto px-4 sm:px-6 prose prose-neutral dark:prose-invert`}
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.html) }} />
    </section>
  );
}

// ─── Fallback Contextual CTA (utilise composant existant) ────────────────────
export function ContextualCtaBlock() {
  return <ContextualCta pageKey="home" />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOUVEAUX BLOCS — tous les types de pages
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Service Hero ─────────────────────────────────────────────────────────────
export function ServiceHeroBlock({ data }: { data: ServiceHeroSection }) {
  return (
    <section className="relative pt-20 min-h-[55vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${data.backgroundImage}')` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {data.tag && (
          <span className="inline-block bg-primary/80 text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 mb-4">{data.tag}</span>
        )}
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
          {data.title.split(' — ').map((part, i) => (
            <span key={i} className="inline-block bg-primary px-4 py-2 mt-2 block">{part}</span>
          ))}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-white/80 text-lg mb-8">{data.subtitle}</motion.p>
        {data.primaryCta && (
          <Link href={data.primaryCta.href}>
            <span className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-7 py-3.5 text-sm font-semibold transition-all rounded-sm cursor-pointer">
              {data.primaryCta.label} <ArrowRight size={16} />
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}

// ─── Service Blocks (grille 4 blocs) ─────────────────────────────────────────
export function ServiceBlocksBlock({ data }: { data: ServiceBlocksSection }) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {data.title && (
          <RevealSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">{data.title}</h2>
            </div>
          </RevealSection>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          {data.items.map((b, i) => (
            <RevealSection key={i} delay={i * 0.1}>
              <div className="bg-muted/20 border border-border rounded-sm p-6 hover:border-primary/40 transition-colors">
                <h3 className="text-lg font-bold text-foreground mb-3">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{b.description}</p>
                <ul className="space-y-1.5">
                  {b.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 size={12} className="text-primary flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Hub Cards ────────────────────────────────────────────────────────────────
export function HubCardsBlock({ data }: { data: HubCardsSection }) {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{data.title}</h2>
            {data.subtitle && <p className="text-muted-foreground">{data.subtitle}</p>}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {data.items.map((item, i) => (
              <Link key={i} href={item.href}>
                <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}
                  className="group bg-card border border-border rounded-sm p-6 hover:border-primary/40 hover:shadow-xl transition-all cursor-pointer h-full flex flex-col">
                  {item.image && (
                    <div className="aspect-video overflow-hidden rounded-sm mb-4">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{item.description}</p>
                  {item.features && (
                    <ul className="space-y-1.5 mb-4">
                      {item.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 size={12} className="text-primary flex-shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex items-center gap-1 text-primary text-sm font-semibold">
                    Découvrir <ArrowRight size={14} />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

// ─── Pitch (titre + corps + stats) ───────────────────────────────────────────
export function PitchBlock({ data }: { data: PitchSection }) {
  return (
    <section className="py-16 md:py-20 bg-muted/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealSection>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 leading-tight">{data.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{data.body}</p>
            </div>
            {data.stats && data.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {data.stats.map((s, i) => (
                  <div key={i} className="bg-background border border-border rounded-sm p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{s.value}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

// ─── References Strip ────────────────────────────────────────────────────────
export function ReferencesStripBlock({ data }: { data: ReferencesStripSection }) {
  return (
    <section className="py-10 bg-muted/10 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {data.title && <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground text-center mb-6">{data.title}</p>}
        <div className="flex flex-wrap justify-center items-center gap-6">
          {data.items.map((ref, i) => (
            ref.logo
              ? <img key={i} src={ref.logo} alt={ref.name} className="h-8 max-w-[120px] object-contain grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all" loading="lazy" />
              : <span key={i} className="text-sm font-semibold text-muted-foreground/60">{ref.name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonial ─────────────────────────────────────────────────────────────
export function TestimonialBlock({ data }: { data: TestimonialSection }) {
  return (
    <section className="py-14 bg-background border-t border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {data.rating && (
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: data.rating }).map((_, i) => (
              <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        )}
        <blockquote className="text-lg md:text-xl text-foreground italic leading-relaxed mb-6">
          "{data.content}"
        </blockquote>
        <div>
          <p className="font-semibold text-foreground">{data.author}</p>
          {(data.role || data.company) && (
            <p className="text-sm text-muted-foreground">{[data.role, data.company].filter(Boolean).join(' — ')}</p>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Objet requis'),
  message: z.string().min(20, 'Message trop court (20 car. min)'),
});
type ContactFormData = z.infer<typeof contactSchema>;

export function ContactFormBlock({ data }: { data: ContactFormSection }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (fd: ContactFormData) => {
    try {
      await axios.post('/api/leads', { name: fd.name, email: fd.email, phone: fd.phone, message: `${fd.subject}\n\n${fd.message}`, source: 'contact_form' });
      setSent(true);
    } catch { setError("Erreur lors de l'envoi. Réessayez ou appelez-nous."); }
  };

  const infoItems = [
    { icon: <MapPin className="w-5 h-5" />, title: 'Adresse', lines: data.address },
    { icon: <Phone className="w-5 h-5" />, title: 'Téléphone', lines: data.phone },
    { icon: <Mail className="w-5 h-5" />, title: 'Email', lines: data.email },
    { icon: <Clock className="w-5 h-5" />, title: 'Horaires', lines: data.hours },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-20 min-h-[45vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${data.heroImage}')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-background" />
        <div className="relative z-10 text-center px-4">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {data.heroTitle.split(' — ').map((part, i) => (
              <span key={i} className="inline-block bg-primary px-4 py-2 mt-2 block">{part}</span>
            ))}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/80 text-lg">{data.heroSubtitle}</motion.p>
        </div>
      </section>

      {/* Contact grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Nos coordonnées</h2>
              <p className="text-muted-foreground mb-8">Plusieurs façons de nous joindre. Disponibles du lundi au samedi.</p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {infoItems.map((info, i) => (
                  <div key={i} className="bg-card border border-border rounded-sm p-5 flex gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary">{info.icon}</div>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">{info.title}</p>
                      {info.lines.map((l, j) => <p key={j} className="text-muted-foreground text-sm">{l}</p>)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full h-52 rounded-sm flex items-center justify-center text-muted-foreground text-sm border border-border bg-muted/20">
                <MapPin className="w-4 h-4 mr-2 text-primary" /> Carte interactive — Casablanca, Maroc
              </div>
            </div>

            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Message rapide</h2>
              <p className="text-muted-foreground mb-8">Remplissez le formulaire, nous vous répondons dans les 24h.</p>
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div key="ok" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-sm p-10 text-center bg-emerald-50 border border-emerald-100">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                    <p className="text-emerald-700 font-semibold text-lg mb-2">Message envoyé !</p>
                    <p className="text-emerald-600/80 text-sm">Notre équipe vous contactera sous 24 heures.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-foreground">Nom complet <span className="text-primary">*</span></label>
                        <input {...register('name')} placeholder="Votre nom" className="input-premium" />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-sm font-semibold text-foreground">Email <span className="text-primary">*</span></label>
                        <input {...register('email')} type="email" placeholder="vous@domaine.com" className="input-premium" />
                        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-foreground">Téléphone <span className="text-muted-foreground font-normal">(optionnel)</span></label>
                      <input {...register('phone')} type="tel" placeholder="+212 6 XX XX XX XX" className="input-premium" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-foreground">Objet <span className="text-primary">*</span></label>
                      <input {...register('subject')} placeholder="Ex : Projet événementiel 2025" className="input-premium" />
                      {errors.subject && <p className="text-red-500 text-xs">{errors.subject.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-foreground">Message <span className="text-primary">*</span></label>
                      <textarea {...register('message')} rows={5} placeholder="Décrivez votre projet..." className="input-premium resize-none" />
                      {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
                    </div>
                    {error && <p className="text-red-600 text-sm px-4 py-3 rounded-sm bg-red-50 border border-red-100">{error}</p>}
                    <button type="submit" disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-sm font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60">
                      {isSubmitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
                      {isSubmitting ? 'Envoi...' : 'Envoyer le message'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Image + Text (50/50) ─────────────────────────────────────────────────────
export function ImageTextBlock({ data }: { data: ImageTextSection }) {
  const isRight = data.imagePosition === 'right';
  const content = (
    <div>
      {data.eyebrow && <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-4">{data.eyebrow}</p>}
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 leading-tight">{data.title}</h2>
      <p className="text-muted-foreground leading-relaxed mb-6">{data.body}</p>
      {data.ctaLabel && data.ctaHref && (
        <Link href={data.ctaHref}>
          <span className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all cursor-pointer">
            {data.ctaLabel} <ArrowRight size={16} />
          </span>
        </Link>
      )}
    </div>
  );
  const image = (
    <div className="relative aspect-video overflow-hidden rounded-sm">
      <img src={data.image} alt={data.imageAlt || data.title} className="w-full h-full object-cover" loading="lazy" />
    </div>
  );
  return (
    <section className="py-16 md:py-24 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealSection>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {isRight ? <>{content}{image}</> : <>{image}{content}</>}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

// ─── Team ─────────────────────────────────────────────────────────────────────
export function TeamBlock({ data }: { data: TeamSection }) {
  return (
    <section className="py-16 md:py-24 bg-muted/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{data.title}</h2>
            {data.subtitle && <p className="text-muted-foreground">{data.subtitle}</p>}
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.members.map((m, i) => (
              <div key={i} className="text-center">
                <div className="w-24 h-24 rounded-full bg-muted/50 overflow-hidden mx-auto mb-4">
                  {m.photo ? <img src={m.photo} alt={m.name} className="w-full h-full object-cover" loading="lazy" /> : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-muted-foreground">{m.name[0]}</div>
                  )}
                </div>
                <h3 className="font-semibold text-foreground">{m.name}</h3>
                <p className="text-sm text-primary mb-2">{m.role}</p>
                {m.bio && <p className="text-xs text-muted-foreground leading-relaxed">{m.bio}</p>}
              </div>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

// ─── FAQ Accordéon ────────────────────────────────────────────────────────────
export function FaqBlock({ data }: { data: FaqSection }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-16 md:py-24 bg-background border-t border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center">{data.title}</h2>
        <div className="space-y-3">
          {data.items.map((item, i) => (
            <div key={i} className="border border-border rounded-sm overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-foreground hover:bg-muted/20 transition-colors">
                {item.question}
                <ChevronDown size={18} className={`flex-shrink-0 text-muted-foreground transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden">
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{item.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Tools Grid ───────────────────────────────────────────────────────────────
export function ToolsGridBlock({ data }: { data: ToolsGridSection }) {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{data.title}</h2>
            {data.subtitle && <p className="text-muted-foreground">{data.subtitle}</p>}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.items.map((tool, i) => (
              <Link key={i} href={tool.href}>
                <div className="group bg-card border border-border rounded-sm p-6 hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
                  {tool.tag && (
                    <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-sm mb-3">{tool.tag}</span>
                  )}
                  <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{tool.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-primary text-xs font-semibold">
                    Accéder <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

// ─── Resources Grid ───────────────────────────────────────────────────────────
export function ResourcesGridBlock({ data }: { data: ResourcesGridSection }) {
  const [filter, setFilter] = useState<string>('');
  const categories = Array.from(new Set(data.items.map(r => r.category)));
  const filtered = filter ? data.items.filter(r => r.category === filter) : data.items;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealSection>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{data.title}</h2>
            {data.subtitle && <p className="text-muted-foreground">{data.subtitle}</p>}
          </div>
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <button onClick={() => setFilter('')}
              className={`px-4 py-1.5 rounded-sm text-sm font-medium transition-colors ${filter === '' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`}>
              Tout
            </button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-sm text-sm font-medium transition-colors ${filter === cat ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((res, i) => (
              <a key={i} href={res.href} target="_blank" rel="noopener noreferrer"
                className="group bg-card border border-border rounded-sm p-6 hover:border-primary/40 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-sm">{res.category}</span>
                  <span className="text-xs text-muted-foreground">{res.format}</span>
                </div>
                <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{res.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{res.description}</p>
              </a>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

