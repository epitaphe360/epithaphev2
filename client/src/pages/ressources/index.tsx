import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText, Download, Search, Filter, BookOpen,
  Video, Image, BarChart2, ArrowRight, ExternalLink
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { RevealSection } from "@/components/reveal-section";
import { PageMeta } from "@/components/seo/page-meta";
import { Link } from "wouter";

/* ─── Types & données ────────────────────────────────────── */
type Category = "tous" | "guides" | "etudes" | "templates" | "videos" | "outils";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: Category;
  format: "PDF" | "Vidéo" | "Template" | "Outil" | "Guide";
  size?: string;
  duration?: string;
  downloadUrl?: string;
  externalUrl?: string;
  isGated: boolean;       // true = email requis
  featured?: boolean;
  tags: string[];
  date: string;
}

const RESOURCES: Resource[] = [
  {
    id: "guide-evenement-zero",
    title: "Guide : Organiser un événement corporate de A à Z",
    description: "Le guide complet pour planifier, budgéter et exécuter votre prochain événement d'entreprise. 48 pages illustrées avec check-lists et modèles prêts à l'emploi.",
    category: "guides",
    format: "PDF",
    size: "4.2 Mo",
    isGated: true,
    featured: true,
    tags: ["événementiel", "planification", "budget"],
    date: "2025-11-01",
  },
  {
    id: "checklist-qhse-affichage",
    title: "Checklist : Conformité affichage QHSE 2026",
    description: "60 points de contrôle pour auditer votre signalétique QHSE selon les normes marocaines en vigueur. Format A4 imprimable.",
    category: "templates",
    format: "Template",
    size: "1.1 Mo",
    isGated: false,
    downloadUrl: "/downloads/checklist-qhse-2026.pdf",
    tags: ["QHSE", "signalétique", "conformité"],
    date: "2026-01-15",
  },
  {
    id: "etude-roi-evenements",
    title: "Étude : ROI des événements corporate au Maroc (2024–2025)",
    description: "Analyse de 120 événements B2B marocains. Indicateurs clés, benchmarks sectoriels et facteurs de succès identifiés par notre équipe.",
    category: "etudes",
    format: "PDF",
    size: "6.8 Mo",
    isGated: true,
    featured: true,
    tags: ["ROI", "événementiel", "benchmark", "Maroc"],
    date: "2026-02-01",
  },
  {
    id: "template-brief-evenement",
    title: "Template : Brief événement — version Word",
    description: "Modèle de brief structuré en 12 sections pour communiquer efficacement avec votre agence. Compatible Word & Google Docs.",
    category: "templates",
    format: "Template",
    size: "280 Ko",
    isGated: false,
    downloadUrl: "/downloads/template-brief-evenement.docx",
    tags: ["template", "brief", "événementiel"],
    date: "2025-09-10",
  },
  {
    id: "video-stand-premium",
    title: "Vidéo : Fabrication d'un stand premium — coulisses",
    description: "Visites nos ateliers de menuiserie et d'impression grand format. 12 minutes de reportage dans La Fabrique Epitaphe360.",
    category: "videos",
    format: "Vidéo",
    duration: "12 min",
    externalUrl: "https://www.youtube.com/watch?v=example",
    isGated: false,
    tags: ["La Fabrique", "stand", "coulisses"],
    date: "2025-10-20",
  },
  {
    id: "guide-marque-employeur",
    title: "Guide : Marque employeur — les 7 leviers visuels",
    description: "Comment utiliser la communication visuelle pour attirer et fidéliser vos talents. Exemples concrets de campagnes réussies au Maroc.",
    category: "guides",
    format: "Guide",
    size: "3.5 Mo",
    isGated: true,
    tags: ["marque employeur", "RH", "communication"],
    date: "2026-01-28",
  },
  {
    id: "calculateur-budget-stand",
    title: "Outil : Calculateur budget stand salon",
    description: "Estimez le coût de votre stand en fonction de la surface, du niveau d'équipement et des prestations additionnelles.",
    category: "outils",
    format: "Outil",
    externalUrl: "/outils/calculateur-fabrique",
    isGated: false,
    tags: ["stand", "budget", "salon", "calculateur"],
    date: "2026-03-01",
  },
  {
    id: "etude-cas-ram",
    title: "Étude de cas : Événement de lancement Royal Air Maroc",
    description: "Comment nous avons produit un événement de lancement de flotte pour 800 invités en 6 semaines. Timeline, solutions techniques, résultats.",
    category: "etudes",
    format: "PDF",
    size: "2.9 Mo",
    isGated: true,
    featured: true,
    tags: ["étude de cas", "événementiel", "aviation"],
    date: "2025-12-05",
  },
];

const CATEGORIES: { key: Category; label: string; icon: React.ReactNode }[] = [
  { key: "tous", label: "Tout voir", icon: <BookOpen className="w-4 h-4" /> },
  { key: "guides", label: "Guides", icon: <FileText className="w-4 h-4" /> },
  { key: "etudes", label: "Études de cas", icon: <BarChart2 className="w-4 h-4" /> },
  { key: "templates", label: "Templates", icon: <FileText className="w-4 h-4" /> },
  { key: "videos", label: "Vidéos", icon: <Video className="w-4 h-4" /> },
  { key: "outils", label: "Outils", icon: <Image className="w-4 h-4" /> },
];

const FORMAT_COLORS: Record<string, string> = {
  "PDF": "bg-red-100 text-red-700",
  "Guide": "bg-blue-100 text-blue-700",
  "Template": "bg-purple-100 text-purple-700",
  "Vidéo": "bg-orange-100 text-orange-700",
  "Outil": "bg-green-100 text-green-700",
  "Étude": "bg-indigo-100 text-indigo-700",
};

/* ─── Modal email gated ──────────────────────────────────── */
function GatedModal({ resource, onClose }: { resource: Resource; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const FREE = ["gmail", "yahoo", "hotmail", "outlook", "yopmail", "live"];

  const submit = () => {
    if (!email.includes("@")) { setErr("Email invalide"); return; }
    const dom = email.split("@")[1]?.split(".")[0]?.toLowerCase() ?? "";
    if (FREE.includes(dom)) { setErr("Email professionnel requis"); return; }
    setDone(true);
    setTimeout(() => {
      if (resource.downloadUrl) window.open(resource.downloadUrl, "_blank");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        {done ? (
          <div className="text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-7 h-7 text-green-600" />
            </div>
            <p className="font-bold text-foreground text-lg">Téléchargement en cours…</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-bold text-foreground mb-2">Accéder à la ressource</h3>
            <p className="text-muted-foreground text-sm mb-1 font-medium">{resource.title}</p>
            <p className="text-muted-foreground text-xs mb-6">Entrez votre email professionnel pour un accès immédiat et gratuit.</p>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }}
              placeholder="vous@entreprise.ma" className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm mb-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            {err && <p className="text-destructive text-xs mb-3">{err}</p>}
            <button onClick={submit} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
              Accéder gratuitement <ArrowRight className="w-4 h-4 inline ml-1" />
            </button>
            <button onClick={onClose} className="w-full mt-2 text-muted-foreground text-xs hover:text-foreground transition-colors py-2">Annuler</button>
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Carte ressource ────────────────────────────────────── */
function ResourceCard({ resource, onDownload }: { resource: Resource; onDownload: (r: Resource) => void }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${FORMAT_COLORS[resource.format] ?? "bg-muted text-muted-foreground"}`}>
          {resource.format}
        </span>
        {resource.featured && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary">★ Populaire</span>
        )}
      </div>
      <h3 className="font-bold text-foreground text-base mb-2 leading-tight">{resource.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{resource.description}</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {resource.tags.slice(0, 3).map((t) => (
          <span key={t} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{t}</span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{resource.size ?? resource.duration ?? ""}</span>
        {resource.isGated ? (
          <button onClick={() => onDownload(resource)}
            className="flex items-center gap-1.5 text-primary hover:text-primary/70 font-semibold text-sm transition-colors">
            <Download className="w-4 h-4" /> Télécharger
          </button>
        ) : resource.externalUrl?.startsWith("/") ? (
          <Link href={resource.externalUrl}>
            <a className="flex items-center gap-1.5 text-primary hover:text-primary/70 font-semibold text-sm transition-colors">
              <ArrowRight className="w-4 h-4" /> Accéder
            </a>
          </Link>
        ) : (
          <a href={resource.externalUrl ?? resource.downloadUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-primary hover:text-primary/70 font-semibold text-sm transition-colors">
            {resource.format === "Vidéo" ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            {resource.format === "Vidéo" ? "Voir" : "Télécharger"}
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Page principale ────────────────────────────────────── */
export default function RessourcesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("tous");
  const [search, setSearch] = useState("");
  const [gatedResource, setGatedResource] = useState<Resource | null>(null);

  const filtered = RESOURCES.filter((r) => {
    const matchCat = activeCategory === "tous" || r.category === activeCategory;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Bibliothèque de ressources"
        description="Guides, études de cas, templates et outils gratuits pour optimiser vos événements, communication QHSE et stratégie de marque."
        canonicalPath="/ressources"
        keywords="guide événementiel, template brief, étude de cas, QHSE signalétique, marque employeur"
      />
      <Navigation />
      <main>
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-muted/40 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <RevealSection>
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
                Ressources gratuites
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Bibliothèque Epitaphe360
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Guides pratiques, études de cas, templates et outils pour piloter vos projets de communication avec efficacité.
              </p>
              {/* Barre de recherche */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une ressource…"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border bg-card text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm" />
              </div>
            </RevealSection>
          </div>
        </section>

        {/* Stats rapides */}
        <section className="py-8 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap justify-center gap-8 text-center">
              {[
                { val: "8+", label: "Ressources disponibles" },
                { val: "100%", label: "Gratuit" },
                { val: "48h", label: "Mis à jour régulièrement" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-primary">{s.val}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filtres + grille */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Catégories */}
            <div className="flex flex-wrap gap-2 mb-8">
              {CATEGORIES.map((cat) => (
                <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    activeCategory === cat.key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-foreground hover:border-primary/50"
                  }`}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Grille */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Search className="w-10 h-10 mx-auto mb-4 opacity-30" />
                <p>Aucune ressource correspondante.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((r, i) => (
                  <RevealSection key={r.id} delay={i * 0.05}>
                    <ResourceCard resource={r} onDownload={setGatedResource} />
                  </RevealSection>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA newsletter */}
        <section className="py-16 bg-muted/40 border-t border-border">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <RevealSection>
              <h2 className="text-2xl font-bold text-foreground mb-3">Recevez chaque nouvelle ressource</h2>
              <p className="text-muted-foreground mb-6 text-sm">Inscrivez-vous à notre newsletter — 1 ressource exclusive par mois, zéro spam.</p>
              <div className="flex gap-2 max-w-sm mx-auto">
                <input type="email" placeholder="votre@email.ma" className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary" />
                <button className="bg-primary text-primary-foreground px-5 py-3 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors">
                  S'abonner
                </button>
              </div>
            </RevealSection>
          </div>
        </section>
      </main>

      {gatedResource && <GatedModal resource={gatedResource} onClose={() => setGatedResource(null)} />}

      <Footer />
    </div>
  );
}
