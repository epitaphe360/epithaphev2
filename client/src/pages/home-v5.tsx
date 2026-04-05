import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  motion, 
  useInView, 
  useScroll, 
  useTransform, 
  useSpring,
  useMotionValue,
  animate,
  stagger,
} from "framer-motion";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChevronRight, Phone } from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useSettings } from "@/hooks/useSettings";

/* ─── Framer Motion Animations ───────────────────────────── */
const revealVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } 
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const textRevealVariants = {
  hidden: { opacity: 0, y: "100%" },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1, ease: [0.25, 1, 0.5, 1] } 
  },
};

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={revealVariants}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function RevealText({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <div ref={ref} className="overflow-hidden inline-block">
      <motion.div
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={textRevealVariants}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─── Physics-based Stats Counter ────────────────────────── */
function StatsCounter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 40,
    stiffness: 100,
    mass: 1,
  });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (inView) {
      motionValue.set(to);
    }
  }, [inView, to, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest));
    });
  }, [springValue]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
}

/* ─── Infinite Marquee ───────────────────────────────────── */
function InfiniteMarquee({ items }: { items: string[] }) {
  // Triple the items to ensure smooth infinite loop
  const marqueeItems = [...items, ...items, ...items];
  
  return (
    <div className="relative flex overflow-hidden w-full py-12 bg-white">
      <motion.div
        className="flex whitespace-nowrap items-center min-w-max"
        animate={{ x: ["0%", "-33.333333%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 30, // Adjust speed here
        }}
      >
        {marqueeItems.map((item, idx) => (
          <div 
            key={`${item}-${idx}`} 
            className="flex items-center justify-center px-12 lg:px-24 mx-4"
          >
            <span className="text-3xl lg:text-5xl font-extrabold text-[#F8F9FA] stroke-text uppercase tracking-widest hover:text-[#111111] transition-colors duration-500 cursor-default">
              {item}
            </span>
          </div>
        ))}
      </motion.div>
      <style>{`
        .stroke-text {
          -webkit-text-stroke: 1px #EAEAEA;
          color: transparent;
        }
        .stroke-text:hover {
          -webkit-text-stroke: 1px #111111;
          color: #111111;
        }
      `}</style>
    </div>
  );
}

/* ─── Parallax Image ─────────────────────────────────────── */
function ParallaxImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img 
        src={src} 
        alt={alt}
        className="absolute inset-0 w-full h-[120%] object-cover"
        style={{ y }}
        loading="lazy"
      />
    </div>
  );
}

/* ─── Default Data ───────────────────────────────────────── */
const DEFAULT_SERVICES = [
  { img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&q=100", title: "Événementiel Corporate", href: "/evenements" },
  { img: "https://images.unsplash.com/photo-1541123356219-284ebe98ae3b?w=1920&q=100", title: "Architecture & Stands", href: "/la-fabrique/menuiserie" },
  { img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&q=100", title: "Signalétique & Wayfinding", href: "/la-fabrique/signaletique" },
  { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=100", title: "Impression Grand Format", href: "/la-fabrique/impression" },
];

const DEFAULT_CLIENTS = [
  "Qatar Airways", "HPS", "Schneider Electric", "Vinci Energies",
  "Dell", "SNEP", "Ajial", "Wafa Assurance", "LafargeHolcim", "OCP Group",
];

const DEFAULT_PORTFOLIO = [
  { client: "Qatar Airways", type: "Dîner de Gala", thumb: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=100" },
  { client: "Schneider Electric", type: "Convention Life Is On", thumb: "https://images.unsplash.com/photo-1541123356219-284ebe98ae3b?w=1920&q=100" },
  { client: "Dell", type: "Stand & Exposition", thumb: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&q=100" },
  { client: "Ajial", type: "Scénographie", thumb: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920&q=100" },
];

/* ─── M A I N   C O M P O N E N T ────────────────────────── */
export default function HomeV5() {
  const { settings: cfg } = useSettings("homepage");
  
  const heroImg = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=3840&q=100";
  const aboutImg1 = "https://images.unsplash.com/photo-1541123356219-284ebe98ae3b?w=3840&q=100";
  const aboutImg2 = "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=3840&q=100";

  const heroTitle = cfg?.hero?.title ?? "Inspirez. Connectez. Marquez durablement.";
  const heroSubtitle = cfg?.hero?.subtitle ?? "Agence de communication 360° basée à Casablanca. Nous gérons vos projets de l'idée créative à la fabrication et l'exécution sur le terrain.";
  const aboutH2 = cfg?.about?.h2 ?? "Créativité & pragmatisme. L'agence des défis complexes.";
  const aboutDesc = cfg?.about?.description ?? "Depuis 20 ans, Epitaphe 360 accompagne les grandes entreprises, multinationales et PME. Nous comprenons vos contraintes de directeurs marketing ou communication : délais serrés, attentes élevées, besoin constant d'innovation.";
  const aboutBullets = Array.isArray(cfg?.about?.bullets) && cfg.about.bullets.length ? cfg.about.bullets : [
    "Une maîtrise totale de A à Z (conception & exécution)",
    "Un atelier de fabrication interne (menuiserie, impression, signalétique)",
    "Respect strict des délais et des budgets",
    "Un seul interlocuteur pour tout votre projet",
  ];
  const statsList = Array.isArray(cfg?.stats) && cfg.stats.length ? cfg.stats : [
    { val: 20, suffix: "+", label: "Années d'expérience" },
    { val: 200, suffix: "+", label: "Projets réalisés" },
    { val: 50, suffix: "+", label: "Clients actifs" },
    { val: 100, suffix: "%", label: "Autonomie de production" },
  ];
  
  const servicesList = Array.isArray(cfg?.services) && cfg.services.length ? cfg.services : DEFAULT_SERVICES;
  const clientsList = Array.isArray(cfg?.clients) && cfg.clients.length ? cfg.clients : DEFAULT_CLIENTS;
  const portfolioList = Array.isArray(cfg?.portfolio) && cfg.portfolio.length ? cfg.portfolio : DEFAULT_PORTFOLIO;

  return (
    <div className="bg-white text-[#111111] font-sans antialiased overflow-x-hidden">
      <Helmet>
        <title>Epitaphe 360 | Agence de communication 360° à Casablanca</title>
        <meta name="description" content="Epitaphe 360 accompagne depuis 20 ans les grandes entreprises. Événementiel, stands, signalétique et impression grand format à Casablanca, Maroc." />
      </Helmet>

      <Navigation />

      {/* ─── HERO SECTION ───────────────────────────────────── */}
      <section className="relative h-screen min-h-[800px] mt-16 w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            src={heroImg}
            alt="Événement Epitaphe" 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 md:px-12">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl lg:text-[6rem] font-bold text-white leading-[1.05] tracking-tight mb-8">
              <RevealText>
                {heroTitle.includes('Marquez') ? (
                  <>{heroTitle.split('Marquez')[0]}Marquez <span className="text-[#E3001B]">durablement.</span></>
                ) : heroTitle}
              </RevealText>
            </h1>
            <motion.p 
              variants={revealVariants}
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl font-light leading-relaxed"
            >
              {heroSubtitle}
            </motion.p>
            <motion.div variants={revealVariants} className="flex flex-wrap gap-6">
              <Link href="/contact/brief">
                <button className="px-10 py-5 text-lg font-bold text-white bg-[#E3001B] hover:bg-[#C20017] flex items-center gap-3 transition-colors duration-300 rounded-none">
                  Démarrer un projet <ArrowRight size={24} />
                </button>
              </Link>
              <button 
                onClick={() => document.querySelector('#expertises')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 text-lg font-bold text-white border-2 border-white hover:bg-white hover:text-[#111111] flex items-center gap-3 transition-colors duration-300 rounded-none bg-transparent"
              >
                Nos métiers
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── ABOUT SECTION ──────────────────────────────────── */}
      <section className="py-32 lg:py-48 bg-white" id="about">
        <div className="max-w-[90rem] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          <div className="lg:col-span-6">
            <FadeUp>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight leading-tight text-[#111111]">
                <RevealText>{aboutH2}</RevealText>
              </h2>
              <p className="text-xl md:text-2xl leading-relaxed mb-10 text-[#555555] font-light">
                {aboutDesc}
              </p>
              <ul className="mb-12 space-y-6">
                {aboutBullets.map((item, idx) => (
                  <motion.li 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-2.5 flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-[#E3001B]"></div>
                    </div>
                    <span className="text-xl font-medium text-[#111111]">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <Link href="/nos-references">
                <span className="inline-flex items-center gap-2 text-xl font-bold text-[#E3001B] hover:text-[#C20017] transition-colors group cursor-pointer">
                  Découvrir l'agence 
                  <motion.span whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                </span>
              </Link>
            </FadeUp>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-6 relative">
            <div className="pt-24">
              <ParallaxImage src={aboutImg1} alt="Production Epitaphe" className="w-full h-[500px]" />
            </div>
            <div>
              <ParallaxImage src={aboutImg2} alt="Stand Epitaphe" className="w-full h-[600px]" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS SECTION ──────────────────────────────────── */}
      <section className="py-32 bg-[#111111] relative overflow-hidden">
        <div className="absolute -top-[50%] -left-[10%] w-[120%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(227,0,27,0.05)_0%,transparent_50%)] z-0"></div>
        <div className="max-w-[90rem] mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 divide-x-0 md:divide-x divide-white/20 text-center">
            {statsList.map((stat, i) => (
              <div key={i} className="px-4 flex flex-col items-center justify-center">
                <p className="text-6xl md:text-8xl font-black text-white mb-4 tracking-tighter">
                  <StatsCounter to={stat.val} suffix={stat.suffix || stat.suf} />
                </p>
                <p className="text-lg md:text-xl font-medium uppercase tracking-[0.2em] text-[#AAAAAA] max-w-[200px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES SECTION ───────────────────────────────── */}
      <section id="expertises" className="py-32 lg:py-48 bg-[#F8F9FA]">
        <div className="max-w-[90rem] mx-auto px-6 md:px-12">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <FadeUp>
              <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight text-[#111111]">
                Nos domaines d'intervention.
              </h2>
              <p className="text-2xl text-[#555555] font-light leading-relaxed">
                Qu'il s'agisse d'une soirée de gala, de l'aménagement de vos locaux ou de la conception d'un stand sur-mesure, nous avons la solution.
              </p>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicesList.map((service, idx) => (
              <FadeUp key={idx} delay={idx * 0.1}>
                <Link href={service.href}>
                  <motion.div 
                    whileHover="hover"
                    className="group cursor-pointer bg-white overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="relative h-[400px] overflow-hidden">
                      <motion.img 
                        src={service.img} 
                        alt={service.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                        variants={{
                          hover: { scale: 1.05 }
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                    </div>
                    <div className="p-8 border border-t-0 border-[#EAEAEA] bg-white relative z-10">
                      <h3 className="text-2xl font-bold mb-4 text-[#111111] group-hover:text-[#E3001B] transition-colors duration-300">
                        {service.title}
                      </h3>
                      <span className="text-lg font-bold flex items-center gap-2 text-[#E3001B]">
                        En savoir plus 
                        <motion.span variants={{ hover: { x: 5 } }}>
                          <ChevronRight size={20} />
                        </motion.span>
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PORTFOLIO / REFERENCES ─────────────────────────── */}
      <section className="py-32 lg:py-48 bg-white border-b border-[#EAEAEA]">
        <div className="max-w-[90rem] mx-auto px-6 md:px-12">
          <FadeUp>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-[#111111]">
                Ils nous font <span className="text-[#E3001B]">confiance</span>
              </h2>
              <Link href="/nos-references">
                <span className="hidden md:flex text-xl font-bold items-center gap-2 hover:text-[#E3001B] transition-colors cursor-pointer group pb-4">
                  Voir tout le portfolio 
                  <motion.span whileHover={{ x: 5 }}>
                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                </span>
              </Link>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
            {portfolioList.map((item, idx) => (
              <FadeUp key={idx} delay={idx * 0.1}>
                <div className="group relative overflow-hidden h-[500px] lg:h-[700px] cursor-pointer bg-[#111111]">
                  <motion.img 
                    src={item.thumb} 
                    alt={item.client} 
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-10 left-10 right-10 z-10">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <p className="text-white/80 font-bold uppercase tracking-[0.2em] text-sm mb-3">
                        {item.type}
                      </p>
                      <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                        {item.client}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          <FadeUp>
            <div className="text-center pt-16">
              <p className="text-center font-bold uppercase tracking-[0.2em] text-[#555555] mb-16 text-lg">
                Gros comptes & institutions
              </p>
            </div>
          </FadeUp>
        </div>
        
        {/* Infinite Marquee via Framer Motion */}
        <InfiniteMarquee items={clientsList} />
      </section>

      {/* ─── CALL TO ACTION FINAL ───────────────────────────── */}
      <section className="py-32 lg:py-48 text-center bg-[#E3001B] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=50')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <FadeUp>
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-10 tracking-tight leading-[1.1]">
              Prêt à donner vie à votre projet ?
            </h2>
            <p className="text-2xl lg:text-3xl text-white/90 mb-16 font-light">
              Un interlocuteur dédié vous répond sous 24h ouvrées.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link href="/contact/brief">
                <button className="w-full sm:w-auto px-12 py-6 bg-white text-[#111111] text-xl font-bold hover:bg-[#F8F9FA] transition-colors flex items-center justify-center gap-3 shadow-2xl">
                  Déposer un brief en ligne <ChevronRight size={24} />
                </button>
              </Link>
              <a href="tel:212662744741" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-12 py-6 border-2 border-white text-white text-xl font-bold hover:bg-white hover:text-[#111111] transition-colors flex items-center justify-center gap-3 bg-transparent">
                  <Phone size={24} /> Nous appeler
                </button>
              </a>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}

