/**
 * HOME V5 — B2B INDUSTRIEL OFFICIEL
 * Direction: Le VRAI Epitaphe 360. 
 * Couleurs réelles : Blanc (#FFF), Noir (#111), Gris chaud (#F8F9FA), Rouge Signature (#E3001B)
 * Ton : Direct, institutionnel, B2B, grosse mise en avant des visuels d'événements.
 * Typographie : Inter (propre, lisible, sans fioritures).
 */

import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Menu, X, ChevronRight, Play, MapPin, Phone, Mail } from "lucide-react";

/* ─── Palette Officielle ─────────────────────────────────── */
const C = {
  white: "#FFFFFF",
  bg: "#F8F9FA", // Gris très clair B2B
  dark: "#111111",
  red: "#E3001B", // Le vrai rouge Epitaphe
  redHover: "#C20017",
  grayText: "#555555",
  border: "#EAEAEA",
};

/* ─── Composants d'animation simples ─────────────────────── */
function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function StatsCounter({ to, suffix }: { to: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 40);
    const timer = setInterval(() => {
      start = Math.min(start + step, to);
      setVal(start);
      if (start >= to) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Données ────────────────────────────────────────────── */
const SERVICES = [
  { img: "https://epitaphe.ma/wp-content/uploads/2018/10/eventqatar.jpg", title: "Événementiel Corporate", href: "/evenements" },
  { img: "https://epitaphe.ma/wp-content/uploads/2018/10/LIFE.jpg", title: "Architecture & Stands", href: "/la-fabrique/menuiserie" },
  { img: "https://epitaphe.ma/wp-content/uploads/2018/10/REARapport.jpg", title: "Signalétique & Wayfinding", href: "/la-fabrique/signaletique" },
  { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", title: "Impression Grand Format", href: "/la-fabrique/impression" },
];

const CLIENTS = [
  "Qatar Airways", "HPS", "Schneider Electric", "Vinci Energies",
  "Dell", "SNEP", "Ajial", "Wafa Assurance", "LafargeHolcim", "OCP Group",
];

const PORTFOLIO = [
  { client: "Qatar Airways", type: "Dîner de Gala", thumb: "https://epitaphe.ma/wp-content/uploads/2018/10/eventqatar.jpg" },
  { client: "Schneider Electric", type: "Convention Life Is On", thumb: "https://epitaphe.ma/wp-content/uploads/2018/10/LIFE.jpg" },
  { client: "Dell", type: "Stand & Exposition", thumb: "https://epitaphe.ma/wp-content/uploads/2018/10/dell-rea.jpg" },
  { client: "Ajial", type: "Scénographie", thumb: "https://epitaphe.ma/wp-content/uploads/2018/10/Ajial2-1.jpg" },
];

export default function HomeV5() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ backgroundColor: C.white, color: C.dark, fontFamily: "Inter, sans-serif" }}>
      <Helmet>
        <title>Epitaphe 360 | Agence de communication 360° à Casablanca</title>
        <meta name="description" content="Epitaphe 360 accompagne depuis 20 ans les grandes entreprises. Événementiel, stands, signalétique et impression grand format à Casablanca, Maroc." />
      </Helmet>

      {/* ─── HEADER (Classique, Blanc, Propre) ────────────── */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b" style={{ borderColor: C.border }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/">
            <img src="https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png" alt="Epitaphe 360" className="h-10 w-auto" />
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/evenements"><span className="text-[15px] font-medium hover:text-[#E3001B] transition-colors cursor-pointer" style={{ color: C.dark }}>Événementiel</span></Link>
            <Link href="/la-fabrique"><span className="text-[15px] font-medium hover:text-[#E3001B] transition-colors cursor-pointer" style={{ color: C.dark }}>La Fabrique</span></Link>
            <Link href="/architecture-de-marque"><span className="text-[15px] font-medium hover:text-[#E3001B] transition-colors cursor-pointer" style={{ color: C.dark }}>Architecture de marque</span></Link>
            <Link href="/nos-references"><span className="text-[15px] font-medium hover:text-[#E3001B] transition-colors cursor-pointer" style={{ color: C.dark }}>Références</span></Link>
          </nav>

          <div className="hidden lg:block">
            <Link href="/contact">
              <button 
                className="px-6 py-2.5 text-[15px] font-bold text-white transition-colors"
                style={{ backgroundColor: C.red }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = C.redHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = C.red}
              >
                Nous contacter
              </button>
            </Link>
          </div>

          <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden absolute top-20 left-0 right-0 bg-white border-b shadow-lg p-6 flex flex-col gap-4" style={{ borderColor: C.border }}>
            <Link href="/evenements"><span className="text-lg font-medium block" onClick={() => setMenuOpen(false)}>Événementiel</span></Link>
            <Link href="/la-fabrique"><span className="text-lg font-medium block" onClick={() => setMenuOpen(false)}>La Fabrique</span></Link>
            <Link href="/architecture-de-marque"><span className="text-lg font-medium block" onClick={() => setMenuOpen(false)}>Architecture de marque</span></Link>
            <Link href="/nos-references"><span className="text-lg font-medium block" onClick={() => setMenuOpen(false)}>Références</span></Link>
            <Link href="/contact"><span className="text-lg font-bold block mt-4" style={{ color: C.red }} onClick={() => setMenuOpen(false)}>Nous contacter</span></Link>
          </div>
        )}
      </header>

      {/* ─── HERO SECTION (L'image prime) ─────────────────── */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://epitaphe.ma/wp-content/uploads/2018/10/eventqatar.jpg" 
            alt="Événement Epitaphe" 
            className="w-full h-full object-cover"
          />
          {/* Un overlay noir simple pour garantir la lisibilité du texte blanc */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Inspirez. Connectez. <br />
              <span style={{ color: C.red }}>Marquez durablement.</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-xl font-light">
              Agence de communication 360° basée à Casablanca. Nous gérons vos projets de l'idée créative à la fabrication et l'exécution sur le terrain.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/contact/brief">
                <button 
                  className="px-8 py-4 text-[16px] font-bold text-white flex items-center gap-2 transition-colors"
                  style={{ backgroundColor: C.red }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = C.redHover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = C.red}
                >
                  Démarrer un projet <ArrowRight size={20} />
                </button>
              </Link>
              <button 
                  onClick={() => document.querySelector('#expertises')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 text-[16px] font-bold text-white border-2 border-white flex items-center gap-2 hover:bg-white hover:text-black transition-colors"
                >
                  Nos métiers
                </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── ABOUT / INTRO (Corporate et direct) ──────────── */}
      <section className="py-24" style={{ backgroundColor: C.white }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Créativité & pragmatisme. <br />
              L'agence des <span style={{ color: C.red }}>défis complexes.</span>
            </h2>
            <p className="text-lg leading-relaxed mb-6" style={{ color: C.grayText }}>
              Depuis 20 ans, Epitaphe 360 accompagne les grandes entreprises, multinationales et PME. Nous comprenons vos contraintes de directeurs marketing ou communication : délais serrés, attentes élevées, besoin constant d'innovation.
            </p>
            <ul className="mb-8 space-y-4">
              {[
                "Une maîtrise totale de A à Z (conception & exécution)",
                "Un atelier de fabrication interne (menuiserie, impression, signalétique)",
                "Respect strict des délais et des budgets",
                "Un seul interlocuteur pour tout votre projet"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.red }}></div>
                  </div>
                  <span className="text-[16px] font-medium" style={{ color: C.dark }}>{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/nos-references">
              <span className="font-bold flex items-center gap-1 hover:underline" style={{ color: C.red }}>
                Découvrir l'agence <ChevronRight size={18} />
              </span>
            </Link>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://epitaphe.ma/wp-content/uploads/2018/10/LIFE.jpg" alt="Production Epitaphe" className="w-full h-64 object-cover" />
              <img src="https://epitaphe.ma/wp-content/uploads/2018/10/dell-rea.jpg" alt="Stand Epitaphe" className="w-full h-64 object-cover mt-8" />
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ─── STATS B2B (Barre de crédibilité) ─────────────── */}
      <section className="py-16" style={{ backgroundColor: C.dark }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10 text-center">
            {[
              { val: 20, suf: "+", label: "Années d'expérience" },
              { val: 200, suf: "+", label: "Projets réalisés" },
              { val: 50, suf: "+", label: "Clients actifs" },
              { val: 100, suf: "%", label: "Autonomie de production" }
            ].map((stat, i) => (
              <div key={i} className="px-4">
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                  <StatsCounter to={stat.val} suffix={stat.suf} />
                </p>
                <p className="text-sm font-medium uppercase tracking-wider" style={{ color: "#AAA" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NOS MÉTIERS (Visuel et clair) ────────────────── */}
      <section id="expertises" className="py-24" style={{ backgroundColor: C.bg }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Nos domaines d'intervention.</h2>
            <p className="text-lg" style={{ color: C.grayText }}>
              Qu'il s'agisse d'une soirée de gala, de l'aménagement de vos locaux ou de la conception d'un stand sur-mesure, nous avons la solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, idx) => (
              <FadeUp key={idx} delay={idx * 0.1}>
                <Link href={service.href}>
                  <div className="group cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={service.img} 
                        alt={service.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                    <div className="p-6 border border-t-0" style={{ borderColor: C.border }}>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-[#E3001B] transition-colors">{service.title}</h3>
                      <span className="text-sm font-bold flex items-center gap-1" style={{ color: C.red }}>
                        En savoir plus <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RÉFÉRENCES (Leur vrai point fort) ────────────── */}
      <section className="py-24" style={{ backgroundColor: C.white }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ils nous font <span style={{ color: C.red }}>confiance</span></h2>
            <Link href="/nos-references">
              <span className="hidden md:flex font-bold items-center gap-1 hover:underline cursor-pointer" style={{ color: C.dark }}>
                Voir tout le portfolio <ArrowRight size={18} />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {PORTFOLIO.map((item, idx) => (
              <FadeUp key={idx} delay={idx * 0.1}>
                <div className="group relative overflow-hidden h-[400px] cursor-pointer bg-black">
                  <img 
                    src={item.thumb} 
                    alt={item.client} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white/80 font-bold uppercase tracking-widest text-xs mb-2">{item.type}</p>
                    <p className="text-3xl font-bold text-white">{item.client}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Bandeau Logos Clients basique */}
          <div className="border-t pt-12" style={{ borderColor: C.border }}>
            <p className="text-center font-bold uppercase tracking-widest text-sm mb-8" style={{ color: C.grayText }}>Gros comptes & institutions</p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
              {CLIENTS.map(c => (
                <span key={c} className="text-xl font-bold text-gray-300 hover:text-gray-800 transition-colors uppercase tracking-widest">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION FINAL B2B ─────────────────────── */}
      <section className="py-24 text-center" style={{ backgroundColor: C.red }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Prêt à donner vie à votre projet ?</h2>
          <p className="text-xl text-white/90 mb-10">
            Un interlocuteur dédié vous répond sous 24h ouvrées.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact/brief">
              <button className="px-8 py-4 bg-white text-black text-[16px] font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
                Déposer un brief en ligne
              </button>
            </Link>
            <a href="tel:212662744741">
              <button className="px-8 py-4 border-2 border-white text-white text-[16px] font-bold hover:bg-white hover:text-black transition-colors flex items-center gap-2">
                <Phone size={20} /> Nous appeler
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* ─── FOOTER CORPORATE ─────────────────────────────── */}
      <footer className="py-16 pb-8" style={{ backgroundColor: C.dark, color: "white" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
            <div className="md:col-span-2">
              <img src="https://epitaphe.ma/wp-content/uploads/2020/05/LOGO-epitaphe360-1.png" alt="Epitaphe 360" className="h-10 w-auto brightness-0 invert mb-6" />
              <p className="text-gray-400 max-w-sm">
                L'agence de communication globale qui produit en interne. Événementiel, signalétique, impression grand format au Maroc.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Informations</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/evenements"><span className="hover:text-white cursor-pointer">Événementiel</span></Link></li>
                <li><Link href="/la-fabrique"><span className="hover:text-white cursor-pointer">La Fabrique (Atelier)</span></Link></li>
                <li><Link href="/architecture-de-marque"><span className="hover:text-white cursor-pointer">Architecture de marque</span></Link></li>
                <li><Link href="/nos-references"><span className="hover:text-white cursor-pointer">Nos références</span></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Contact</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <MapPin size={20} className="text-[#E3001B] shrink-0 mt-1" />
                  <span>Rez de chaussée Immeuble 7, <br/>9 Rue Bussang. Casablanca<br/>Maroc</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={20} className="text-[#E3001B]" />
                  <a href="tel:212662744741" className="hover:text-white">+212 6 62 74 47 41</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={20} className="text-[#E3001B]" />
                  <a href="mailto:info@epitaphe.ma" className="hover:text-white">info@epitaphe.ma</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
            <p>Epitaphe 360 © {new Date().getFullYear()}. Tous droits réservés.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/mentions-legales"><span className="hover:text-white">Mentions légales</span></Link>
              <Link href="/politique-confidentialite"><span className="hover:text-white">Politique de confidentialité</span></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
