import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Menu, X, ChevronDown, Calendar, Trophy, Truck, Store,
  Briefcase, ShieldCheck, Users, Printer, Hammer, Signpost, LayoutGrid,
  BookOpen, BarChart2, Calculator, Mail, LogIn, ArrowRight, ImageIcon,
} from "lucide-react";

/* === Types ==================================================== */
interface SubEntry {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  previewImage?: string;  // Image de prévisualisation au survol (CDC 1.2)
}
interface NavEntry {
  label: string;
  href?: string;
  mega?: boolean;
  previewImage?: string;  // Image par défaut pour le bloc mega
  entries?: SubEntry[];
}

/* === État prévisualisation interne ============================ */

/* === Data ===================================================== */
const navConfig: NavEntry[] = [
  {
    label: "Événements",
    mega: true,
    previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/conventions.jpg",
    entries: [
      { label: "Conventions & Kickoffs",   description: "Fédérez vos équipes autour de vos ambitions",   href: "/evenements/conventions-kickoffs", icon: <Calendar className="w-5 h-5" />, previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/conventions.jpg" },
      { label: "Soirées de gala",          description: "Créez des moments d'exception inoubliables",    href: "/evenements/soirees-de-gala",      icon: <Trophy   className="w-5 h-5" />, previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/soiree-gala.jpg" },
      { label: "Roadshows & Tournées",     description: "Portez votre message dans toute la région",    href: "/evenements/roadshows",            icon: <Truck    className="w-5 h-5" />, previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/roadshow.jpg" },
      { label: "Salons & Expositions",     description: "Maximisez votre visibilité sur les salons B2B",href: "/evenements/salons",               icon: <Store    className="w-5 h-5" />, previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/salon.jpg" },
    ],
  },
  {
    label: "Architecture de Marque",
    mega: true,
    previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/marque-employeur.jpg",
    entries: [
      { label: "Marque Employeur",    description: "Attirez et retenez les meilleurs talents",    href: "/architecture-de-marque/marque-employeur",   icon: <Briefcase   className="w-5 h-5" />, previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/marque-employeur.jpg" },
      { label: "Communication QHSE", description: "Sécurité & conformité avec impact visuel",    href: "/architecture-de-marque/communication-qhse", icon: <ShieldCheck className="w-5 h-5" />, previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/qhse.jpg" },
      { label: "Expérience Clients", description: "Différenciation et fidélisation durables",    href: "/architecture-de-marque/experience-clients", icon: <Users       className="w-5 h-5" />, previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/experience-client.jpg" },
    ],
  },
  {
    label: "La Fabrique",
    mega: true,
    previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/impression.jpg",
    entries: [
      { label: "Impression grand format", description: "Bâches, adhésifs, toiles rétroéclairées",    href: "/la-fabrique/impression",   icon: <Printer   className="w-5 h-5" />, previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/impression.jpg" },
      { label: "Menuiserie & Décor",      description: "Stands sur mesure, mobilier d'ambiance",     href: "/la-fabrique/menuiserie",   icon: <Hammer    className="w-5 h-5" />, previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/menuiserie.jpg" },
      { label: "Signalétique",            description: "Totems, enseignes, wayfinding professionnel",href: "/la-fabrique/signaletique", icon: <Signpost  className="w-5 h-5" />, previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/signaletique.jpg" },
      { label: "Aménagement Espace",      description: "Scénographie & architecture éphémère",       href: "/la-fabrique/amenagement",  icon: <LayoutGrid className="w-5 h-5" />, previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/amenagement.jpg" },
    ],
  },
  { label: "Références", href: "/nos-references" },
  { label: "Blog",       href: "/blog" },
  {
    label: "Outils",
    entries: [
      { label: "Vigilance-Score QHSE",    description: "Évaluez votre niveau de conformité QHSE", href: "/outils/vigilance-score",       icon: <BarChart2   className="w-5 h-5" /> },
      { label: "Calculateur La Fabrique", description: "Estimez vos économies de production",     href: "/outils/calculateur-fabrique",  icon: <Calculator  className="w-5 h-5" /> },
      { label: "Bibliothèque",            description: "Guides, templates et livres blancs",      href: "/ressources",                   icon: <BookOpen    className="w-5 h-5" /> },
    ],
  },
  { label: "Contact", href: "/contact" },
];

/* === Framer Motion variants =================================== */
const megaMenuVariants = {
  hidden:  { opacity: 0, y: -8, scale: 0.97 },
  visible: { opacity: 1, y:  0, scale: 1.00, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1], delay: 0.05 } },
  exit:    { opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.14, ease: "easeIn",           delay: 0.08 } },
};
const drawerVariants = {
  hidden:  { x: "100%", transition: { duration: 0.3,  ease: [0.32, 0, 0.67, 0] } },
  visible: { x: "0%",   transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

/* === Desktop dropdown ========================================= */
function DesktopMenu({ entry }: { entry: NavEntry }) {
  const [open, setOpen] = useState(false);
  const [hoveredSub, setHoveredSub] = useState<SubEntry | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Image courante à afficher : sub survolé → entry par défaut
  const previewImg = (hoveredSub?.previewImage ?? entry.previewImage) ?? null;

  if (!entry.entries) {
    return (
      <Link href={entry.href!} className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
        {entry.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => { if (timer.current) clearTimeout(timer.current); setOpen(true); }}
      onMouseLeave={() => { timer.current = setTimeout(() => { setOpen(false); setHoveredSub(null); }, 150); }}
    >
      <button
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
        onClick={() => setOpen((o) => !o)}
      >
        {entry.label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            variants={megaMenuVariants} initial="hidden" animate="visible" exit="exit"
            className={`absolute top-full left-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-[100] overflow-hidden ${entry.mega ? "w-[760px] -left-20" : "w-72"}`}
          >
            {entry.mega ? (
              /* ─── Mega menu : liens à gauche + preview à droite ─── */
              <div className="flex">
                {/* Colonne liens */}
                <div className="flex-1 p-4 grid grid-cols-1 gap-1">
                  {entry.entries.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setHoveredSub(sub)}
                      onMouseLeave={() => setHoveredSub(null)}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors group"
                    >
                      <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mt-0.5">
                        {sub.icon}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{sub.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{sub.description}</p>
                      </div>
                    </Link>
                  ))}
                  {/* Pied : voir tout */}
                  <div className="pt-2 mt-1 border-t border-border flex items-center justify-between px-1">
                    <p className="text-xs text-muted-foreground">Toutes nos expertises en {entry.label.toLowerCase()}</p>
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                      Voir tout <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
                {/* Colonne prévisualisation image */}
                <div className="w-56 flex-shrink-0 bg-muted/40 border-l border-border overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    {previewImg ? (
                      <motion.img
                        key={previewImg}
                        src={previewImg}
                        alt=""
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground/40"
                      >
                        <ImageIcon className="w-10 h-10" />
                        <span className="text-xs">Aperçu</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Overlay gradient bas → titre */}
                  {previewImg && hoveredSub && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white text-xs font-semibold leading-tight">{hoveredSub.label}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ─── Dropdown standard ─── */
              <div className="p-4 grid grid-cols-1 gap-2">
                {entry.entries.map((sub) => (
                  <Link key={sub.href} href={sub.href} onClick={() => setOpen(false)}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary/5 transition-colors group">
                    <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors mt-0.5">
                      {sub.icon}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{sub.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{sub.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* === Composant Navigation principal =========================== */
export function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [location] = useLocation();
  const { scrollY } = useScroll();
  const bgColor   = useTransform(scrollY, [0, 80], ["rgba(255,255,255,0.0)", "rgba(255,255,255,0.97)"]);
  const shadow    = useTransform(scrollY, [0, 80], ["0 0 0 0 transparent",   "0 1px 24px rgba(0,0,0,0.08)"]);
  const borderCol = useTransform(scrollY, [0, 80], ["rgba(0,0,0,0)",          "rgba(0,0,0,0.07)"]);

  useEffect(() => { setDrawerOpen(false); setMobileExpanded(null); }, [location]);
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <motion.header style={{ backgroundColor: bgColor, boxShadow: shadow, borderColor: borderCol }}
        className="fixed top-0 left-0 right-0 z-[90] backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex-shrink-0">
            <img src="https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png" alt="Epitaphe 360" className="h-9 w-auto" />
          </Link>
          <nav className="hidden lg:flex items-center gap-0.5">
            {navConfig.map((entry) => <DesktopMenu key={entry.label} entry={entry} />)}
          </nav>
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/contact/brief">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                <Mail className="w-4 h-4" /> Déposer un brief
              </motion.button>
            </Link>
            <Link href="/admin/login">
              <button className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2 rounded-xl transition-colors">
                <LogIn className="w-4 h-4" /> Espace admin
              </button>
            </Link>
          </div>
          <button onClick={() => setDrawerOpen((o) => !o)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-foreground hover:bg-muted transition-colors"
            aria-label="Menu">
            <AnimatePresence mode="wait">
              {drawerOpen
                ? <motion.span key="x"    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}  transition={{ duration: 0.15 }}><X    className="w-5 h-5" /></motion.span>
                : <motion.span key="menu" initial={{ rotate:  90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}><Menu className="w-5 h-5" /></motion.span>}
            </AnimatePresence>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[95] bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setDrawerOpen(false)} />
            <motion.div variants={drawerVariants} initial="hidden" animate="visible" exit="hidden"
              className="fixed top-0 right-0 bottom-0 z-[100] w-[85vw] max-w-sm bg-card border-l border-border flex flex-col lg:hidden overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <img src="https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png" alt="Epitaphe 360" className="h-8 w-auto" />
                <button onClick={() => setDrawerOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navConfig.map((entry) => (
                  <div key={entry.label}>
                    {entry.entries ? (
                      <>
                        <button onClick={() => setMobileExpanded(mobileExpanded === entry.label ? null : entry.label)}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
                          {entry.label}
                          <motion.span animate={{ rotate: mobileExpanded === entry.label ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {mobileExpanded === entry.label && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                              <div className="pl-4 pt-1 space-y-1">
                                {entry.entries.map((sub) => (
                                  <Link key={sub.href} href={sub.href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors">
                                    <span className="text-primary w-4 h-4 flex-shrink-0">{sub.icon}</span>
                                    {sub.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link href={entry.href!} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors">
                        {entry.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
              <div className="p-4 border-t border-border space-y-2">
                <Link href="/contact/brief">
                  <motion.button whileTap={{ scale: 0.96 }} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold">
                    <Mail className="w-4 h-4" /> Déposer un brief
                  </motion.button>
                </Link>
                <Link href="/admin/login">
                  <button className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary py-2 transition-colors">
                    <LogIn className="w-4 h-4" /> Espace admin
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="h-16" />
    </>
  );
}
