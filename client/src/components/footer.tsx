import { MapPin, Phone, Mail, Linkedin, Facebook, Instagram, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/useSettings";
import { Link } from "wouter";
import { resetCookieConsent } from "@/components/cookie-consent-banner";

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
      className="bg-foreground text-background py-16 md:py-20"
      data-testid="section-footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img
                src={logoUrl}
                alt="Epitaphe 360"
                className="h-10 w-auto brightness-0 invert"
                data-testid="img-footer-logo"
              />
            </div>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              {settings.footer_description}
            </p>
            <div className="flex gap-3">
              {settings.footer_linkedin ? (
                <a href={settings.footer_linkedin} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="text-background/70 hover:text-primary hover:bg-background/10" data-testid="link-linkedin">
                    <Linkedin className="w-5 h-5" />
                  </Button>
                </a>
              ) : (
                <Button variant="ghost" size="icon" className="text-background/70 hover:text-primary hover:bg-background/10" data-testid="link-linkedin">
                  <Linkedin className="w-5 h-5" />
                </Button>
              )}
              {settings.footer_facebook ? (
                <a href={settings.footer_facebook} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="text-background/70 hover:text-primary hover:bg-background/10" data-testid="link-facebook">
                    <Facebook className="w-5 h-5" />
                  </Button>
                </a>
              ) : (
                <Button variant="ghost" size="icon" className="text-background/70 hover:text-primary hover:bg-background/10" data-testid="link-facebook">
                  <Facebook className="w-5 h-5" />
                </Button>
              )}
              {settings.footer_instagram ? (
                <a href={settings.footer_instagram} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="text-background/70 hover:text-primary hover:bg-background/10" data-testid="link-instagram">
                    <Instagram className="w-5 h-5" />
                  </Button>
                </a>
              ) : (
                <Button variant="ghost" size="icon" className="text-background/70 hover:text-primary hover:bg-background/10" data-testid="link-instagram">
                  <Instagram className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Nos services</h4>
            <ul className="space-y-2">
              {parsedServicesLinks.map((link: any) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">L'agence</h4>
            <ul className="space-y-2">
              {parsedCompanyLinks.map((link: any) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-background/70">
                  {settings.footer_address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-background/70">{settings.footer_phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-background/70">
                  {settings.footer_email}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/50">
              © {new Date().getFullYear()} Epitaphe 360. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <Link 
                href="/mentions-legales"
                className="text-sm text-background/50 hover:text-primary transition-colors"
                data-testid="link-mentions-legales"
              >
                Mentions légales
              </Link>
              <Link 
                href="/politique-confidentialite"
                className="text-sm text-background/50 hover:text-primary transition-colors"
                data-testid="link-politique-confidentialite"
              >
                Politique de confidentialité
              </Link>
              <button
                onClick={resetCookieConsent}
                className="text-sm text-background/50 hover:text-primary transition-colors flex items-center gap-1"
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
