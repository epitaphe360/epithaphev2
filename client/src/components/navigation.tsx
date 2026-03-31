import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Menu, X, ChevronDown, Calendar, Trophy, Truck, Store,
  Briefcase, ShieldCheck, Users, Printer, Hammer, Signpost, LayoutGrid,
  BookOpen, BarChart2, Calculator, Mail, LogIn, ArrowRight, ImageIcon,
  FolderOpen, Lock, FileText, UserCircle, Palette, MonitorPlay, Layers,
  Settings,
} from "lucide-react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useSettings } from "@/hooks/useSettings";

interface SubEntryConfig {
  label: string;
  description: string;
  href: string;
  icon: string | null;
  previewImage?: string;
  isGroupHeader?: boolean;
}
interface NavEntryConfig {
  label: string;
  href?: string;
  mega?: boolean;
  rightAlign?: boolean;
  previewImage?: string;
  entries?: SubEntryConfig[];
}

interface SubEntry {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  previewImage?: string;
  isGroupHeader?: boolean;
}
interface NavEntry {
  label: string;
  href?: string;
  mega?: boolean;
  rightAlign?: boolean;
  previewImage?: string;
  entries?: SubEntry[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Calendar: <Calendar className="w-5 h-5" />,
  Trophy: <Trophy className="w-5 h-5" />,
  Truck: <Truck className="w-5 h-5" />,
  Store: <Store className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Printer: <Printer className="w-5 h-5" />,
  Hammer: <Hammer className="w-5 h-5" />,
  Signpost: <Signpost className="w-5 h-5" />,
  LayoutGrid: <LayoutGrid className="w-5 h-5" />,
  BookOpen: <BookOpen className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  ImageIcon: <ImageIcon className="w-5 h-5" />,
  BarChart2: <BarChart2 className="w-5 h-5" />,
  Calculator: <Calculator className="w-5 h-5" />,
  Mail: <Mail className="w-5 h-5" />,
  FolderOpen: <FolderOpen className="w-5 h-5" />,
  Lock: <Lock className="w-5 h-5" />,
  UserCircle: <UserCircle className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  MonitorPlay: <MonitorPlay className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />
};

/* === Data ===================================================== */
const defaultNavConfig: NavEntryConfig[] = [
  {
    label: "�v�nements",
    mega: true,
    href: "/evenements",
    previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/conventions.jpg",
    entries: [
      { label: "Conventions & Kickoffs",   description: "F�d�rez vos �quipes autour de vos ambitions",    href: "/evenements/conventions-kickoffs",  icon: "Calendar", previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/conventions.jpg" },
      { label: "Soir�es de gala",          description: "Cr�ez des moments d'exception inoubliables",     href: "/evenements/soirees-de-gala",       icon: "Trophy", previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/soiree-gala.jpg" },
      { label: "Roadshows & Tourn�es",     description: "Portez votre message dans toute la r�gion",      href: "/evenements/roadshows",    icon: "Truck", previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/roadshow.jpg" },
      { label: "Salons & Expositions",     description: "Maximisez votre visibilit� sur les salons B2B",  href: "/evenements/salons",    icon: "Store", previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/salon.jpg" },
    ],
  },
  {
    label: "Architecture de Marque",
    mega: true,
    href: "/architecture-de-marque",
    previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/marque-employeur.jpg",
    entries: [
      { label: "Marque Employeur",    description: "Attirez et retenez les meilleurs talents",    href: "/architecture-de-marque/marque-employeur",   icon: "Briefcase", previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/marque-employeur.jpg" },
      { label: "Communication QHSE", description: "S�curit� & conformit� avec impact visuel",    href: "/architecture-de-marque/communication-qhse", icon: "ShieldCheck", previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/qhse.jpg" },
      { label: "Exp�rience Clients", description: "Diff�renciation et fid�lisation durables",    href: "/architecture-de-marque/experience-clients", icon: "Users", previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/experience-client.jpg" },
    ],
  },
  {
    label: "La Fabrique",
    mega: true,
    href: "/la-fabrique",
    rightAlign: true,
    previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/impression.jpg",
    entries: [
      { label: "Impression grand format", description: "B�ches, adh�sifs, toiles r�tro�clair�es",     href: "/la-fabrique/impression",    icon: "Printer", previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/impression.jpg" },
      { label: "Menuiserie & D�cor",      description: "Stands sur mesure, mobilier d'ambiance",      href: "/la-fabrique/menuiserie",    icon: "Hammer", previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/menuiserie.jpg" },
      { label: "Signal�tique",            description: "Totems, enseignes, wayfinding professionnel", href: "/la-fabrique/signaletique",  icon: "Signpost", previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/signaletique.jpg" },
      { label: "Am�nagement Espace",      description: "Sc�nographie & architecture �ph�m�re",        href: "/la-fabrique/amenagement",   icon: "LayoutGrid", previewImage: "https://epitaphe.ma/wp-content/uploads/2020/05/amenagement.jpg" },
    ],
  },
  { label: "R�f�rences", href: "/nos-references" },
  { label: "Blog",       href: "/blog" },
  {
    label: "Ressources",
    href: "/ressources",
    entries: [
      { label: "Biblioth�que",            description: "Guides, templates et livres blancs (acc�s libre)", href: "/ressources",                  icon: "BookOpen" },
      { label: "�tudes de cas",           description: "D�couvrez nos r�alisations sectorielles",          href: "/nos-references",              icon: "FileText" },
      { label: "Blog & Actualit�s",       description: "Insights, conseils et tendances �v�nementielles",  href: "/blog",                        icon: "ImageIcon" },
    ],
  },
  {
    label: "Outils",
    href: "/outils",
    rightAlign: true,
    entries: [
      { label: "BMI 360™ Intelligence", description: "", href: "#", icon: null, isGroupHeader: true },
      { label: "CommPulse™",      description: "Score Communication Interne",    href: "/outils/commpulse",            icon: "BarChart2" },
      { label: "TalentPrint™",     description: "Score Marque Employeur",        href: "/outils/talentprint",          icon: "BarChart2" },
      { label: "ImpactTrace™",     description: "Score RSE et Impact",           href: "/outils/impacttrace",          icon: "BarChart2" },
      { label: "SafeSignal™",      description: "Score Sécurité QHSE",             href: "/outils/safesignal",           icon: "BarChart2" },
      { label: "EventImpact™",     description: "Score Événementiel",              href: "/outils/eventimpact",          icon: "BarChart2" },
      { label: "SpaceScore™",      description: "Score Brand Physique",          href: "/outils/spacescore",           icon: "BarChart2" },
      { label: "FinNarrative™",    description: "Score Com Financière",          href: "/outils/finnarrative",         icon: "BarChart2" },
      { label: "Tableau BMI 360™",  description: "Vue globale de votre intelligence", href: "/outils/bmi360", icon: "BarChart2" },
      { label: "Calculateur Fabrique", description: "Estimez vos économies de production", href: "/outils/calculateur-fabrique", icon: "Calculator" },
      { label: "Déposer un brief",  description: "Formulaire stratégique multi-étapes", href: "/contact/brief", icon: "Mail" },
    ],
  },
  {
    label: "Espace Client",
    rightAlign: true,
    entries: [
      { label: "Se connecter",     description: "Accéder à votre espace personnel",          href: "/espace-client",            icon: "LogIn" },
      { label: "Mes projets",      description: "Suivi temps réel de vos projets en cours", href: "/espace-client/projets",    icon: "FolderOpen" },
      { label: "Mes documents",    description: "Coffre-fort numérique et livrables signés",  href: "/espace-client/documents",  icon: "Lock" },
      { label: "Mon abonnement",   description: "Plans, facturation et devis",                href: "/espace-client/abonnement", icon: "UserCircle" },
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
function DesktopMenu({ entry, rightAlign = false }: { entry: NavEntry; rightAlign?: boolean }) {
  const [open, setOpen] = useState(false);
  const [hoveredSub, setHoveredSub] = useState<SubEntry | null>(null);
  const [resolvedRight, setResolvedRight] = useState(rightAlign);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();

  const isActive = entry.href
    ? location === entry.href || location.startsWith(entry.href + "/")
    : entry.entries?.some((s) => location === s.href || location.startsWith(s.href + "/"));

  const previewImg = (hoveredSub?.previewImage ?? entry.previewImage) ?? null;

  // D�tection d�bordement viewport apr�s affichage
  useEffect(() => {
    if (open && panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth - 8) setResolvedRight(true);
      else setResolvedRight(rightAlign);
    } else if (!open) {
      setResolvedRight(rightAlign);
    }
  }, [open, rightAlign]);

  if (!entry.entries) {
    return (
      <Link
        href={entry.href!}
        className={`px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
          isActive ? "text-white bg-white/10" : "text-white/75 hover:text-white hover:bg-white/[0.08]"
        }`}
      >
        {entry.label}
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => { if (timer.current) clearTimeout(timer.current); openTimer.current = setTimeout(() => setOpen(true), 150); }}
      onMouseLeave={() => { if (openTimer.current) clearTimeout(openTimer.current); timer.current = setTimeout(() => { setOpen(false); setHoveredSub(null); }, 200); }}
    >
      <button
        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
          isActive ? "text-white bg-white/10" : "text-white/75 hover:text-white hover:bg-white/[0.08]"
        }`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {entry.label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            variants={megaMenuVariants} initial="hidden" animate="visible" exit="exit"
            className={`absolute top-full mt-2 bg-card border border-border rounded-2xl shadow-xl z-[100] overflow-hidden ${
              entry.mega
                ? `w-[min(760px,calc(100vw-1.5rem))] ${resolvedRight ? "right-0 left-auto" : "left-0"}`
                : `w-72 ${resolvedRight ? "right-0 left-auto" : "left-0"}`
            }`}
          >
            {entry.mega ? (
              /* --- Mega menu : liens � gauche + preview � droite --- */
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
                  {/* Pied : voir tout � lien fonctionnel */}
                  {entry.href && (
                    <div className="pt-2 mt-1 border-t border-border">
                      <Link
                        href={entry.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between px-1 py-1.5 rounded-lg hover:bg-primary/5 transition-colors group"
                      >
                        <p className="text-xs text-muted-foreground">Toutes nos expertises en {entry.label.toLowerCase()}</p>
                        <span className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline underline-offset-2">
                          Voir tout <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </Link>
                    </div>
                  )}
                </div>
                {/* Colonne pr�visualisation image */}
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
                        <span className="text-xs">Aper�u</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {/* Overlay gradient bas ? titre */}
                  {previewImg && hoveredSub && (
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <p className="text-white text-xs font-semibold leading-tight">{hoveredSub.label}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* --- Dropdown standard --- */
              <div className="p-4 grid grid-cols-1 gap-1">
                {entry.entries.map((sub) => {
                  if (sub.isGroupHeader) {
                    return (
                      <p key={sub.label} className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/60 pt-3 pb-1 px-3 first:pt-1">
                        {sub.label}
                      </p>
                    );
                  }
                  return (
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
                  );
                })}
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
  const { settings: navSettings } = useSettings('nav_config');
  const { settings: siteIdentity } = useSettings('site_identity');
  
  const rawNavConfig: NavEntryConfig[] = Array.isArray(navSettings) ? navSettings : defaultNavConfig;
  
  const navConfig: NavEntry[] = rawNavConfig.map(entry => ({
    ...entry,
    entries: entry.entries?.map(sub => ({
      ...sub,
      icon: sub.icon ? (ICON_MAP[sub.icon] || null) : null
    }))
  }));

  const logoUrl = siteIdentity?.logo_url || "https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png";

  // Navbar: fond sombre semi-transparent au repos, plus opaque au scroll
  const bgColor   = useTransform(scrollY, [0, 60], ["rgba(3,0,12,0.75)",     "rgba(3,0,12,0.95)"]);
  const shadow    = useTransform(scrollY, [0, 60], ["0 0 0 0 transparent",   "0 2px 32px rgba(0,0,0,0.45)"]);
  const borderCol = useTransform(scrollY, [0, 60], ["rgba(236,72,153,0.0)",  "rgba(236,72,153,0.18)"]);

  useEffect(() => { setDrawerOpen(false); setMobileExpanded(null); }, [location]);
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <motion.header style={{ backgroundColor: bgColor, boxShadow: shadow, borderColor: borderCol }}
        className="fixed top-0 left-0 right-0 z-[90] backdrop-blur-xl border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex-shrink-0">
            <img src={logoUrl} alt="Epitaphe 360" className="h-9 w-auto" />
          </Link>
          <nav className="hidden lg:flex items-center gap-0.5">
            {navConfig.map((entry) => (
              <DesktopMenu key={entry.label} entry={entry} rightAlign={entry.rightAlign} />
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-2">
            <LanguageSwitcher />
            <Link href="/contact/brief">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                <Mail className="w-4 h-4" /> D�poser un brief
              </motion.button>
            </Link>
            <Link href="/espace-client">
              <button className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2 rounded-xl transition-colors">
                <UserCircle className="w-4 h-4" /> Espace client
              </button>
            </Link>
            <Link href="/admin">
              <button className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary px-2 py-2 rounded-xl transition-colors" title="Tableau de bord admin">
                <Settings className="w-4 h-4" />
              </button>
            </Link>
          </div>
          <button onClick={() => setDrawerOpen((o) => !o)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl text-foreground hover:bg-muted transition-colors"
            aria-label={drawerOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={drawerOpen}
            aria-controls="mobile-nav-drawer">
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
              className="fixed inset-0 z-[50] bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setDrawerOpen(false)} />
            <motion.div
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navigation"
              variants={drawerVariants} initial="hidden" animate="visible" exit="hidden"
              className="fixed top-0 right-0 bottom-0 z-[60] w-[85vw] max-w-sm bg-card border-l border-border flex flex-col lg:hidden overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <img src={logoUrl} alt="Epitaphe 360" className="h-8 w-auto" />
                <button onClick={() => setDrawerOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted text-muted-foreground" aria-label="Fermer le menu">
                  <X className="w-4 h-4" aria-hidden />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1" aria-label="Navigation principale">
                {navConfig.map((entry) => (
                  <div key={entry.label}>
                    {entry.entries ? (
                      <>
                        <button
                          onClick={() => setMobileExpanded(mobileExpanded === entry.label ? null : entry.label)}
                          aria-expanded={mobileExpanded === entry.label}
                          aria-controls={`mobile-submenu-${entry.label.replace(/\s+/g, '-')}`}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-colors">
                          {entry.label}
                          <motion.span animate={{ rotate: mobileExpanded === entry.label ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {mobileExpanded === entry.label && (
                            <motion.div
                              id={`mobile-submenu-${entry.label.replace(/\s+/g, '-')}`}
                              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
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
                    <Mail className="w-4 h-4" /> D�poser un brief
                  </motion.button>
                </Link>
                <Link href="/espace-client">
                  <button className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary py-2 transition-colors">
                    <UserCircle className="w-4 h-4" /> Espace client
                  </button>
                </Link>
                <Link href="/admin">
                  <button className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary py-2 transition-colors">
                    <Settings className="w-4 h-4" /> Tableau de bord
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

