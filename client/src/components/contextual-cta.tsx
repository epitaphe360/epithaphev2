/**
 * CTAs Contextuels — CDC 4.5
 * Affiche 2 boutons d'action pertinents selon la page / le contexte
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export interface CtaConfig {
  primary: {
    label: string;
    href: string;
    variant?: "primary" | "secondary";
  };
  secondary?: {
    label: string;
    href: string;
  };
  /** Texte accroche optionnel au-dessus des boutons */
  eyebrow?: string;
}

/** Table des CTAs par secteur/page (CDC 4.5) */
const CONTEXTUAL_CTAS: Record<string, CtaConfig> = {
  /* Événements */
  "evenements": {
    eyebrow: "Prêt à passer à l'action ?",
    primary:   { label: "Planifier mon événement",  href: "/contact/brief" },
    secondary: { label: "Voir nos références",       href: "/nos-references" },
  },
  "evenements/conventions-kickoffs": {
    eyebrow: "Votre prochaine convention vous attend.",
    primary:   { label: "Déposer un brief",          href: "/contact/brief" },
    secondary: { label: "Voir nos références",       href: "/nos-references" },
  },
  "evenements/soirees-de-gala": {
    eyebrow: "Une soirée d'exception, ça se prépare.",
    primary:   { label: "Organiser ma soirée",       href: "/contact/brief" },
    secondary: { label: "Voir nos références",       href: "/nos-references" },
  },
  "evenements/roadshows": {
    eyebrow: "Portez votre message partout.",
    primary:   { label: "Lancer mon roadshow",       href: "/contact/brief" },
    secondary: { label: "Voir nos références",       href: "/nos-references" },
  },
  "evenements/salons": {
    eyebrow: "Dominez votre prochain salon.",
    primary:   { label: "Concevoir mon stand",       href: "/contact/brief" },
    secondary: { label: "Voir nos modèles 3D",       href: "/outils/stand-viewer" },
  },

  /* Architecture de Marque */
  "architecture-de-marque": {
    eyebrow: "Votre marque mérite une stratégie solide.",
    primary:   { label: "Construire ma marque",      href: "/contact/brief" },
    secondary: { label: "Tester mon Vigilance-Score", href: "/outils/vigilance-score" },
  },
  "architecture-de-marque/marque-employeur": {
    eyebrow: "Devenez l'employeur qui attire les talents.",
    primary:   { label: "Lancer mon projet marque employeur", href: "/contact/brief" },
    secondary: { label: "Voir nos références",       href: "/nos-references" },
  },
  "architecture-de-marque/communication-qhse": {
    eyebrow: "Sécurisez votre performance opérationnelle.",
    primary:   { label: "Sécuriser ma performance",  href: "/contact/brief" },
    secondary: { label: "Tester mon Vigilance-Score", href: "/outils/vigilance-score" },
  },
  "architecture-de-marque/experience-clients": {
    eyebrow: "Fidélisez chaque point de contact.",
    primary:   { label: "Améliorer mon expérience client", href: "/contact/brief" },
    secondary: { label: "Voir nos références",       href: "/nos-references" },
  },

  /* La Fabrique */
  "la-fabrique": {
    eyebrow: "Tout pour donner vie à votre projet physique.",
    primary:   { label: "Demander un devis Fabrique", href: "/contact/brief" },
    secondary: { label: "Voir nos modèles 3D",        href: "/outils/stand-viewer" },
  },
  "la-fabrique/impression": {
    eyebrow: "Grand format, grand impact.",
    primary:   { label: "Obtenir un devis impression", href: "/outils/calculateur-fabrique" },
    secondary: { label: "Voir nos réalisations",       href: "/nos-references" },
  },
  "la-fabrique/menuiserie": {
    eyebrow: "Des espaces taillés sur mesure.",
    primary:   { label: "Concevoir mon stand",        href: "/contact/brief" },
    secondary: { label: "Visualiser en 3D",           href: "/outils/stand-viewer" },
  },
  "la-fabrique/signaletique": {
    eyebrow: "Guidez, valorisez, sécurisez.",
    primary:   { label: "Demander une étude signalétique", href: "/contact/brief" },
    secondary: { label: "Voir nos références",             href: "/nos-references" },
  },
  "la-fabrique/amenagement": {
    eyebrow: "Scénographiez chaque espace.",
    primary:   { label: "Lancer mon projet d'aménagement", href: "/contact/brief" },
    secondary: { label: "Visualiser en 3D",                href: "/outils/stand-viewer" },
  },
};

const DEFAULT_CTA: CtaConfig = {
  primary:   { label: "Déposer un brief", href: "/contact/brief" },
  secondary: { label: "Voir nos références", href: "/nos-references" },
};

/* ── Props ─────────────────────────────────────────────────── */
interface ContextualCtaProps {
  /** Ex: "evenements/salons" ou "la-fabrique/impression" */
  pageKey: string;
  className?: string;
  /** Affiche dans une section full-width avec fond nuancé */
  asSection?: boolean;
}

/* ── Composant ─────────────────────────────────────────────── */
export function ContextualCta({ pageKey, className = "", asSection = true }: ContextualCtaProps) {
  const config = CONTEXTUAL_CTAS[pageKey] ?? DEFAULT_CTA;

  const inner = (
    <div className={`flex flex-col items-center text-center gap-5 ${className}`}>
      {config.eyebrow && (
        <p className="text-lg md:text-xl font-semibold text-foreground max-w-xl">
          {config.eyebrow}
        </p>
      )}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link href={config.primary.href}>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
          >
            {config.primary.label} <ArrowRight className="w-4 h-4" />
          </motion.button>
        </Link>
        {config.secondary && (
          <Link href={config.secondary.href}>
            <button className="flex items-center gap-2 text-foreground/70 hover:text-primary px-4 py-3 transition-colors text-sm font-medium border border-border rounded-xl hover:border-primary/40">
              {config.secondary.label}
            </button>
          </Link>
        )}
      </div>
    </div>
  );

  if (!asSection) return inner;

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-primary/3 border-t border-border/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {inner}
      </div>
    </section>
  );
}
