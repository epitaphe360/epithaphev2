import { MapPin, Phone, Mail, Linkedin, Facebook, Instagram, Cookie } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { Link } from "wouter";
import { resetCookieConsent } from "@/components/cookie-consent-banner";
import { useEmbed } from "@/contexts/embed-context";

const polesLinks = [
  { label: "COM' Interne",      href: "/nos-poles/com-interne" },
  { label: "Marque Employeur",  href: "/architecture-de-marque/marque-employeur" },
  { label: "COM'SST-QHSE",      href: "/architecture-de-marque/communication-qhse" },
  { label: "COM'RSE",           href: "/nos-poles/com-rse" },
  { label: "COM' Ã‰vÃ©nementiel", href: "/evenements" },
];

const fabriqueLinks = [
  { label: "Branding de siÃ¨ge",            href: "/la-fabrique/branding-siege" },
  { label: "Stands et Showroom",           href: "/la-fabrique/menuiserie" },
  { label: "Enseignes et signalÃ©tiques",   href: "/la-fabrique/signaletique" },
  { label: "Impression grand format",      href: "/la-fabrique/impression" },
  { label: "Lettrage & dÃ©coupe Laser/CNC", href: "/la-fabrique/amenagement" },
  { label: "PLV & dispositifs retail",     href: "/la-fabrique/impression" },
];

const scoringLinks = [
  { label: "CommPulseâ„¢",       href: "/outils/commpulse" },
  { label: "TalentPrintâ„¢",     href: "/outils/talentprint" },
  { label: "SafeSignalâ„¢",      href: "/outils/safesignal" },
  { label: "ImpactTraceâ„¢",     href: "/outils/impacttrace" },
  { label: "EventImpactâ„¢",     href: "/outils/eventimpact" },
  { label: "SpaceScoreâ„¢",      href: "/outils/spacescore" },
  { label: "FinNarrativeâ„¢",    href: "/outils/finnarrative" },
  { label: "Tableau BMI 360â„¢", href: "/outils/bmi360" },
];

const liensLinks = [
  { label: "Ressources",           href: "/ressources" },
  { label: "RÃ©fÃ©rences",           href: "/nos-references" },
  { label: "FAQ",                  href: "/faq" },
  { label: "Contact",              href: "/contact" },
  { label: "Conditions gÃ©nÃ©rales", href: "/mentions-legales" },
];

function FooterLinkList({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="space-y-2.5">
      {links.map((l) => (
        <li key={l.href + l.label}>
          <Link href={l.href} className="text-sm text-white/50 hover:text-white transition-colors duration-150">
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  const isEmbed = useEmbed();
  const { settings } = useSettings("footer", {
    footer_address: "RDC 7-9, Rue Bussang Maarif Casablanca â€“ Maroc",
    footer_phone: "+212 662 744 741",
    footer_email: "info@epitaphe.ma",
    footer_description: "Agence de communication 360Â° au Maroc. Depuis plus de 20 ans, nous accompagnons les entreprises dans leur stratÃ©gie de communication globale.",
    footer_linkedin: "https://www.linkedin.com/company/epitaphe360",
    footer_facebook: "https://www.facebook.com/epitaphe360",
    footer_instagram: "https://www.instagram.com/epitaphe360",
  });

  const { settings: siteIdentity } = useSettings("site_identity", {
    logo_white_url: "https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png",
  });

  if (isEmbed) return null;

  const logoUrl =
    siteIdentity.logo_white_url ||
    "https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png";

  return (
    <footer
      className="bg-[#0A0A0B] text-white pt-16 pb-8 md:pt-20 relative overflow-hidden"
      data-testid="section-footer"
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "256px 256px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* â”€â”€ Main grid â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-10 xl:gap-8 mb-14">

          {/* Col 1-2: Brand block */}
          <div className="sm:col-span-2 xl:col-span-2">
            <img
              src={logoUrl}
              alt="Epitaphe 360"
              className="h-10 w-auto brightness-0 invert mb-5"
              data-testid="img-footer-logo"
            />
            <div className="w-10 h-px bg-[#C8A96E] mb-5" />
            <p className="text-white/50 text-sm leading-relaxed mb-7 max-w-xs">
              {settings.footer_description}
            </p>
            {/* Contact compact */}
            <ul className="space-y-3 mb-7">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C8A96E] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/50 leading-snug">{settings.footer_address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C8A96E] flex-shrink-0" />
                <a
                  href={`tel:${(settings.footer_phone || "").replace(/\s/g, "")}`}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {settings.footer_phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C8A96E] flex-shrink-0" />
                <a
                  href={`mailto:${settings.footer_email}`}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {settings.footer_email}
                </a>
              </li>
            </ul>
            {/* Social icons â€” always visible */}
            <div className="flex gap-2">
              <a
                href={settings.footer_facebook || "https://www.facebook.com/epitaphe360"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-white/12 flex items-center justify-center text-white/45 hover:text-[#C8A96E] hover:border-[#C8A96E]/40 transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.footer_instagram || "https://www.instagram.com/epitaphe360"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-white/12 flex items-center justify-center text-white/45 hover:text-[#C8A96E] hover:border-[#C8A96E]/40 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.footer_linkedin || "https://www.linkedin.com/company/epitaphe360"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg border border-white/12 flex items-center justify-center text-white/45 hover:text-[#C8A96E] hover:border-[#C8A96E]/40 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Nos pÃ´les d'expertise */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#C8A96E] mb-5 font-montserrat">
              Nos pÃ´les d'expertise
            </h4>
            <FooterLinkList links={polesLinks} />
          </div>

          {/* Col 4: La Fabrique 360 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#C8A96E] mb-5 font-montserrat">
              La Fabrique 360
            </h4>
            <FooterLinkList links={fabriqueLinks} />
          </div>

          {/* Col 5: Scoring */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#C8A96E] mb-5 font-montserrat">
              Scoring
            </h4>
            <FooterLinkList links={scoringLinks} />
          </div>

          {/* Col 6: Liens utiles */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#C8A96E] mb-5 font-montserrat">
              Liens
            </h4>
            <FooterLinkList links={liensLinks} />
          </div>
        </div>

        {/* â”€â”€ Bottom bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="border-t border-white/[0.07] pt-7">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30 font-montserrat order-2 sm:order-1">
              &copy; {new Date().getFullYear()} Epitaphe 360. Tous droits rÃ©servÃ©s.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 order-1 sm:order-2">
              <Link
                href="/mentions-legales"
                className="text-xs text-white/30 hover:text-white/70 transition-colors"
              >
                Mentions lÃ©gales
              </Link>
              <Link
                href="/politique-confidentialite"
                className="text-xs text-white/30 hover:text-white/70 transition-colors"
              >
                Politique de confidentialitÃ©
              </Link>
              <button
                onClick={resetCookieConsent}
                className="text-xs text-white/30 hover:text-white/70 transition-colors flex items-center gap-1"
              >
                <Cookie className="w-3 h-3" /> Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
