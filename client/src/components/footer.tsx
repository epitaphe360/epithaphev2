import { MapPin, Phone, Mail, Linkedin, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  services: [
    { label: "Digital", href: "#services" },
    { label: "Publicité", href: "#services" },
    { label: "Contenu", href: "#services" },
    { label: "Événementiel", href: "#services" },
  ],
  company: [
    { label: "À propos", href: "#about" },
    { label: "Références", href: "#portfolio" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
  ],
};

export function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
                src="https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png"
                alt="Epitaphe 360"
                className="h-10 w-auto brightness-0 invert"
                data-testid="img-footer-logo"
              />
            </div>
            <p className="text-background/70 text-sm leading-relaxed mb-6">
              Agence de communication 360° à Casablanca. Inspirez. Connectez. Marquez
              Durablement.
            </p>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-background/70 hover:text-primary hover:bg-background/10"
                data-testid="link-linkedin"
              >
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-background/70 hover:text-primary hover:bg-background/10"
                data-testid="link-facebook"
              >
                <Facebook className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-background/70 hover:text-primary hover:bg-background/10"
                data-testid="link-instagram"
              >
                <Instagram className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">Nos services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4">L'agence</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.label}
                  </button>
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
                  Casablanca, Maroc
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-background/70">+212 5 22 XX XX XX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-background/70">
                  contact@epitaphe.ma
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
              <button 
                className="text-sm text-background/50 hover:text-primary transition-colors"
                data-testid="link-mentions-legales"
              >
                Mentions légales
              </button>
              <button 
                className="text-sm text-background/50 hover:text-primary transition-colors"
                data-testid="link-politique-confidentialite"
              >
                Politique de confidentialité
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
