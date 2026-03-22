/**
 * Espace Client — Bibliothèque Ressources (accès = "client")
 * /espace-client/ressources
 *
 * Ressources chargées depuis l'API (table resources en DB)
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  BookOpen, Download, ChevronRight, Lock, Loader2,
  FileText, Search, Tag, LogOut, AlertCircle,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageMeta } from "@/components/seo/page-meta";

const TOKEN_KEY = "epitaphe_client_token";

interface Resource {
  id: number;
  title: string;
  description: string | null;
  category: string;
  format: string | null;
  fileSize: string | null;
  downloadUrl: string | null;
  tags: string[];
  isNew: boolean | null;
}

const FORMAT_COLORS: Record<string, string> = {
  PDF:   "bg-red-50 text-red-600",
  XLSX:  "bg-green-50 text-green-600",
  DOCX:  "bg-blue-50 text-blue-600",
  ZIP:   "bg-yellow-50 text-yellow-600",
  VIDEO: "bg-purple-50 text-purple-600",
};

const CATEGORY_LABELS: Record<string, string> = {
  guide:           "Guides",
  modele:          "Modèles",
  etude_de_cas:    "Études de cas",
  fiche_technique: "Fiches techniques",
  video:           "Vidéos",
  webinaire:       "Webinaires",
};

export default function EspaceClientRessources() {
  const [, setLocation] = useLocation();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [category, setCategory]   = useState("Tous");
  const [search, setSearch]       = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  useEffect(() => {
    if (!token) return;
    fetch("/api/client/resources", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(setResources)
      .catch((e: Error) => setError(e.message ?? "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) { setLocation("/espace-client"); return null; }

  const allCategories = ["Tous", ...Array.from(new Set(resources.map((r) => r.category)))];
  const filtered = resources.filter((r) => {
    const matchCat = category === "Tous" || r.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || r.title.toLowerCase().includes(q) || (r.description ?? "").toLowerCase().includes(q) || (r.tags ?? []).some((t) => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const handleDownload = async (res: Resource) => {
    try {
      const r = await fetch(`/api/client/resources/${res.id}/download`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const json = await r.json();
      if (json.downloadUrl) window.open(json.downloadUrl, "_blank");
    } catch { /* silencieux */ }
  };

  return (
    <>
      <PageMeta title="Ressources — Espace Client" description="Ressources exclusives clients." canonicalPath="/espace-client/ressources" noIndex />
      <Navigation />
      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/espace-client"><span className="hover:text-[#C8A96E] cursor-pointer">Espace Client</span></Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-700">Ressources</span>
          </nav>

          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[#C8A96E]/10 rounded-xl"><Lock className="w-6 h-6 text-[#C8A96E]" /></div>
                <h1 className="text-3xl font-bold text-gray-900">Ressources Clients</h1>
              </div>
              <p className="text-gray-500 text-sm">Guides, templates et outils réservés à nos clients.</p>
            </div>
            <button onClick={() => { localStorage.removeItem(TOKEN_KEY); setLocation("/espace-client"); }} className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A96E]/30 text-sm" />
            </div>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat ? "bg-[#C8A96E] text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-[#C8A96E]"}`}>
                  {cat === "Tous" ? "Tous" : (CATEGORY_LABELS[cat] ?? cat)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#C8A96E]" /></div>
          ) : error ? (
            <div className="flex flex-col items-center py-20 gap-3 text-gray-500"><AlertCircle className="w-10 h-10 text-red-400" /><p className="text-sm">{error}</p></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400"><BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" /><p>Aucune ressource trouvée</p></div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((res, i) => (
                <motion.div key={res.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${FORMAT_COLORS[res.format ?? "PDF"] ?? "bg-gray-100 text-gray-600"}`}>{res.format ?? "PDF"}</span>
                    {res.isNew && <span className="text-xs bg-[#C8A96E]/10 text-[#C8A96E] font-semibold px-2 py-0.5 rounded-full">Nouveau</span>}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#C8A96E]/10 flex items-center justify-center mb-3"><FileText className="w-6 h-6 text-[#C8A96E]" /></div>
                  <h3 className="font-semibold text-gray-900 mb-2 leading-tight">{res.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{res.description}</p>
                  {(res.tags ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {(res.tags ?? []).map((tag) => (
                        <span key={tag} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full flex items-center gap-1"><Tag className="w-2.5 h-2.5" /> {tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <span className="text-xs text-gray-400">{res.fileSize ?? ""}</span>
                    <button onClick={() => handleDownload(res)} className="flex items-center gap-1.5 text-sm font-medium text-[#C8A96E] hover:text-[#b8965e] transition-colors">
                      <Download className="w-4 h-4" /> Télécharger
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
