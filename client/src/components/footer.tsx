import { MapPin, Phone, Mail, Linkedin, Facebook, Instagram, Cookie } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { Link } from "wouter";
import { resetCookieConsent } from "@/components/cookie-consent-banner";
import { useEmbed } from "@/contexts/embed-context";

const defaultServicesLinks = [
  { label: "Événements", href: "/evenements" },
  { label: "Architecture de Marque", href: "/architecture-de-marque" },
  { label: "La Fabrique", href: "/la-fabrique" },
  { label: "Outils", href: "/outils/vigilance-score" },
];

const defaultCompanyLinks = [
  { label: "Références", href: "/nos-references" },
  { label: "Blog", href: "/blog" },
  { label: "Ressources", href: "/ressources" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const isEmbed = useEmbed();
  const { settings } = useSettings("footer", {
    footer_address: "Rez de chaussée Immeuble 7-9 Rue Bussang, Casablanca - Maroc",
    footer_phone: "+212 662 744 741",
    footer_email: "info@epitaphe.ma",
    footer_description: "Agence de communication 360° à Casablanca. Basée au Maroc depuis plus de 20 ans, nous accompagnons les entreprises dans leur stratégie de communication globale.",
    footer_linkedin: "",
    footer_facebook: "https://www.facebook.com/epitaphe360",
    footer_instagram: "",
    footer_links_services: JSON.stringify(defaultServicesLinks),
    footer_links_company: JSON.stringify(defaultCompanyLinks),
  });

  const { settings: siteIdentity } = useSettings("site_identity", {
    logo_white_url: "https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png"
  });

  if (isEmbed) return null;

  const parsedServicesLinks = (() => {
    try {
      return typeof settings.footer_links_services === "string" 
        ? JSON.parse(settings.footer_links_services) 
        : defaultServicesLinks;
    } catch (e) {
      return defaultServicesLinks;
    }
  })();

  const parsedCompanyLinks = (() => {
    try {
      return typeof settings.footer_links_company === "string"
        ? JSON.parse(settings.footer_links_company)
        : defaultCompanyLinks;
    } catch (e) {
      return defaultCompanyLinks;
    }
  })();

  const logoUrl = siteIdentity.logo_white_url || "https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png";

  return (
    <footer
      className="bg-[#0A0A0B] text-white py-16 md:py-24 relative overflow-hidden"
      data-testid="section-footer"
    >
      {/* Grain texture */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "256px 256px" }} />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14 mb-16">
          <div className="lg:col-span-1">
            <div className="mb-5">
              <img
                src={logoUrl}
                alt="Epitaphe 360"
                className="h-10 w-auto brightness-0 invert"
                data-testid="img-footer-logo"
              />
            </div>
            {/* Gold rule */}
            <div className="w-10 h-px bg-[#C8A96E] mb-5" />
            <p className="text-white/55 text-sm leading-relaxed mb-7">
              {settings.footer_description}
            </p>
            {/* Social icons — hidden if no URL */}
            <div className="flex gap-2">
              {settings.footer_linkedin && (
                <a href={settings.footer_linkedin} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border border-white/12 flex items-center justify-center text-white/45 hover:text-[#C8A96E] hover:border-[#C8A96E]/40 transition-all duration-200"
                  data-testid="link-linkedin" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings.footer_facebook && (
                <a href={settings.footer_facebook} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border border-white/12 flex items-center justify-center text-white/45 hover:text-[#C8A96E] hover:border-[#C8A96E]/40 transition-all duration-200"
                  data-testid="link-facebook" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.footer_instagram && (
                <a href={settings.footer_instagram} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border border-white/12 flex items-center justify-center text-white/45 hover:text-[#C8A96E] hover:border-[#C8A96E]/40 transition-all duration-200"
                  data-testid="link-instagram" aria-label="Instagram">
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#C8A96E] mb-5 font-montserrat">Nos services</h4>
            <ul className="space-y-3">
              {parsedServicesLinks.map((link: { label: string; href: string }) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 hover:text-white transition-colors duration-150"
                    data-testid={`link-footer-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#C8A96E] mb-5 font-montserrat">L'agence</h4>
            <ul className="space-y-3">
              {parsedCompanyLinks.map((link: { label: string; href: string }) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 hover:text-white transition-colors duration-150"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-[#C8A96E] mb-5 font-montserrat">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C8A96E] mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/55 leading-relaxed">
                  {settings.footer_address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C8A96E] flex-shrink-0" />
                <a href={`tel:${settings.footer_phone?.replace(/\s/g, "")}`}
                  className="text-sm text-white/55 hover:text-white transition-colors">{settings.footer_phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C8A96E] flex-shrink-0" />
                <a href={`mailto:${settings.footer_email}`}
                  className="text-sm text-white/55 hover:text-white transition-colors">{settings.footer_email}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.07] pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30 font-montserrat">
              &copy; {new Date().getFullYear()} Epitaphe 360. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <Link 
                href="/mentions-legales"
                className="text-xs text-white/30 hover:text-white/70 transition-colors"
                data-testid="link-mentions-legales"
              >
                Mentions légales
              </Link>
              <Link 
                href="/politique-confidentialite"
                className="text-xs text-white/30 hover:text-white/70 transition-colors"
                data-testid="link-politique-confidentialite"
              >
                Politique de confidentialité
              </Link>
              <button
                onClick={resetCookieConsent}
                className="text-xs text-white/30 hover:text-white/70 transition-colors flex items-center gap-1"
                data-testid="link-cookie-settings"
              >
                <Cookie className="w-3 h-3" /> Paramètres cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
