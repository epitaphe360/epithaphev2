import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Moon, Sun, ShoppingCart, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { solutionCategories } from "@/data/solutionsData";

const metiersSubmenu = [
  { label: "Communication corporate", href: "/solutions/communication-corporate", description: "Stratégie de marque et identité" },
  { label: "Communication produits", href: "/solutions/communication-produits", description: "Lancements et activations" },
  { label: "Communication événementielle", href: "/solutions/communication-evenementielle", description: "Organisation de A à Z" },
  { label: "Communication financière", href: "/solutions/communication-financiere", description: "Rapports et relations investisseurs" },
  { label: "Communication interne", href: "/solutions/communication-interne", description: "Engagement des collaborateurs" },
];

type NavLink = {
  label: string;
  href: string;
  hash?: string;
  hasSubmenu: boolean;
  hasMegaMenu?: boolean;
  submenu?: typeof metiersSubmenu;
};

const navLinks: NavLink[] = [
  { label: "A propos", href: "/", hash: "#about", hasSubmenu: false },
  { label: "Nos métiers", href: "#", hasSubmenu: true, submenu: metiersSubmenu },
  { label: "Nos solutions", href: "#", hasSubmenu: true, hasMegaMenu: true },
  { label: "Nos références", href: "/nos-references", hasSubmenu: false },
  { label: "Ressources", href: "/blog", hasSubmenu: false },
  { label: "Contact", href: "/", hash: "#contact", hasSubmenu: false },
  { label: "Se connecter", href: "/admin/login", hasSubmenu: false },
];

function DropdownMenu({ 
  label, 
  submenu,
}: { 
  label: string; 
  submenu: typeof metiersSubmenu; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      ref={menuRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
        data-testid={`link-nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-popover border border-border rounded-md shadow-lg p-2 z-50">
          {submenu.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block w-full text-left p-3 rounded-md hover:bg-accent/50 transition-colors"
              data-testid={`link-submenu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="text-sm font-medium text-foreground">{item.label}</div>
              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SolutionsMegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(solutionCategories[0].slug);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div 
      ref={menuRef}
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
        data-testid="link-nav-nos-solutions"
        onClick={() => setIsOpen(!isOpen)}
      >
        Nos solutions
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-popover border border-border rounded-md shadow-lg z-50 flex">
          <div className="w-64 border-r border-border p-2">
            {solutionCategories.map((category) => (
              <div
                key={category.slug}
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                  activeCategory === category.slug ? "bg-primary/10 text-primary" : "hover:bg-accent/50"
                }`}
                onMouseEnter={() => setActiveCategory(category.slug)}
                data-testid={`link-category-${category.slug}`}
              >
                <span className="text-sm font-medium">{category.label}</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            ))}
          </div>
          
          <div className="w-72 p-2 max-h-96 overflow-y-auto">
            {solutionCategories
              .find(cat => cat.slug === activeCategory)
              ?.items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/solutions/${item.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="block p-3 rounded-md hover:bg-accent/50 transition-colors"
                  data-testid={`link-solution-${item.slug}`}
                >
                  <div className="text-sm font-medium text-foreground">{item.label}</div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NavLinkItem({ 
  link, 
  currentPath, 
  onClose,
  className,
  navigate
}: { 
  link: NavLink; 
  currentPath: string; 
  onClose: () => void;
  className: string;
  navigate: (path: string) => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    
    if (link.hash) {
      if (currentPath === "/") {
        const element = document.querySelector(link.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate("/");
        window.history.replaceState(null, "", "/" + link.hash);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const element = document.querySelector(link.hash!);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          });
        });
      }
    } else {
      navigate(link.href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {link.label}
    </button>
  );
}

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white dark:bg-background border-b border-border ${
          isScrolled ? "shadow-sm" : ""
        }`}
        data-testid="header-navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link
              href="/"
              className="flex items-center"
              data-testid="link-logo"
            >
              <img
                src="https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png"
                alt="Epitaphe 360"
                className="h-10 md:h-12 w-auto"
                data-testid="img-logo"
              />
            </Link>

            <nav className="hidden lg:flex items-center">
              {navLinks.map((link) => (
                link.hasMegaMenu ? (
                  <SolutionsMegaMenu key={link.label} />
                ) : link.hasSubmenu ? (
                  <DropdownMenu
                    key={link.label}
                    label={link.label}
                    submenu={link.submenu!}
                  />
                ) : (
                  <NavLinkItem
                    key={link.label}
                    link={link}
                    currentPath={location}
                    onClose={() => {}}
                    className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                    navigate={setLocation}
                  />
                )
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                data-testid="button-theme-toggle"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              <Button
                className="hidden md:inline-flex"
                data-testid="button-boutique"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Boutique
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
                data-testid="button-mobile-menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-background/98 backdrop-blur-md lg:hidden overflow-y-auto"
          data-testid="mobile-menu-overlay"
        >
          <div className="flex flex-col min-h-full">
            <div className="flex items-center justify-between px-4 h-16 border-b border-border">
              <img
                src="https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png"
                alt="Epitaphe 360"
                className="h-8 w-auto"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="button-close-mobile-menu"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col py-6 px-4 flex-1">
              {navLinks.map((link) => (
                <div key={link.label} className="border-b border-border/50">
                  {link.hasMegaMenu ? (
                    <Collapsible
                      open={openMobileSubmenu === link.label}
                      onOpenChange={(open) =>
                        setOpenMobileSubmenu(open ? link.label : null)
                      }
                    >
                      <CollapsibleTrigger
                        className="flex items-center justify-between w-full py-4 text-lg font-semibold text-foreground"
                        data-testid="link-mobile-nos-solutions"
                      >
                        {link.label}
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${
                            openMobileSubmenu === link.label ? "rotate-180" : ""
                          }`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="pl-4 pb-4 space-y-4">
                          {solutionCategories.map((category) => (
                            <div key={category.slug}>
                              <p className="text-sm font-bold text-primary mb-2">{category.label}</p>
                              <div className="space-y-1 pl-2">
                                {category.items.map((item) => (
                                  <Link
                                    key={item.slug}
                                    href={`/solutions/${item.slug}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block w-full text-left py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                                    data-testid={`link-mobile-solution-${item.slug}`}
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : link.hasSubmenu ? (
                    <Collapsible
                      open={openMobileSubmenu === link.label}
                      onOpenChange={(open) =>
                        setOpenMobileSubmenu(open ? link.label : null)
                      }
                    >
                      <CollapsibleTrigger
                        className="flex items-center justify-between w-full py-4 text-lg font-semibold text-foreground"
                        data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {link.label}
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${
                            openMobileSubmenu === link.label ? "rotate-180" : ""
                          }`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="pl-4 pb-4 space-y-2">
                          {link.submenu?.map((item) => (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block w-full text-left py-2 text-base text-muted-foreground hover:text-primary transition-colors"
                              data-testid={`link-mobile-submenu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <NavLinkItem
                      link={link}
                      currentPath={location}
                      onClose={() => setIsMobileMenuOpen(false)}
                      className="block w-full text-left py-4 text-lg font-semibold text-foreground hover:text-primary transition-colors"
                      navigate={setLocation}
                    />
                  )}
                </div>
              ))}
              <Button
                className="mt-6"
                size="lg"
                data-testid="button-mobile-boutique"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Boutique
              </Button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
