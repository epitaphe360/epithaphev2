/**
 * Espace Client — Liste des Projets
 * /espace-client/projets
 */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Briefcase, Clock, CheckCircle2, PauseCircle, ChevronRight,
  Calendar, User, BarChart2, MessageSquare, AlertCircle, Loader2, LogOut,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageMeta } from "@/components/seo/page-meta";

/* ─── Types ─────────────────────────────────────────────── */
type Status = "en_cours" | "en_attente" | "termine" | "en_pause";

interface Milestone {
  id: number; label: string; dueDate: string | null;
  status: "done" | "active" | "pending"; order: number;
}
interface Project {
  id: number; title: string; type: string; status: Status;
  progress: number; startDate: string | null; endDate: string | null;
  managerName: string | null; managerEmail: string | null;
  description: string | null;
  milestones: Milestone[];
  unreadMessages: number;
}

const TOKEN_KEY = "epitaphe_client_token";

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: React.ElementType }> = {
  en_cours:    { label: "En cours",    color: "text-emerald-600 bg-emerald-50", icon: BarChart2    },
  en_attente:  { label: "En attente",  color: "text-amber-600 bg-amber-50",    icon: Clock        },
  termine:     { label: "Terminé",     color: "text-blue-600 bg-blue-50",      icon: CheckCircle2 },
  en_pause:    { label: "En pause",    color: "text-gray-500 bg-gray-100",     icon: PauseCircle  },
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-MA", { day: "2-digit", month: "short", year: "numeric" });
}

/* ─── Carte projet ──────────────────────────────────────── */
function ProjectCard({ project }: { project: Project }) {
  const cfg = STATUS_CONFIG[project.status];
  const Icon = cfg.icon as React.FC<{ className?: string }>;
  const activeMilestone = project.milestones.find((m) => m.status === "active");

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate text-lg">{project.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{project.type}</p>
        </div>
        <span className={`ml-3 shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
          <Icon className="w-3.5 h-3.5" />
          {cfg.label}
        </span>
      </div>

      {/* Progression */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1.5">
          <span>Avancement</span>
          <span className="font-medium text-[#C8A96E]">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-2 rounded-full bg-gradient-to-r from-[#C8A96E] to-[#b8965e]"
          />
        </div>
      </div>

      {/* Jalon actif */}
      {activeMilestone && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700">
            <span className="font-medium">En cours :</span> {activeMilestone.label}
            {activeMilestone.dueDate && ` · ${activeMilestone.dueDate}`}
          </p>
        </div>
      )}

      {/* Meta */}
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>Début : {fmtDate(project.startDate)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>Fin : {fmtDate(project.endDate)}</span>
        </div>
        {project.managerName && (
          <div className="flex items-center gap-1.5 col-span-2">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <span>Chef de projet : {project.managerName}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2">
          {project.unreadMessages > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-medium">
              <MessageSquare className="w-3 h-3" />
              {project.unreadMessages} nouveau{project.unreadMessages > 1 ? "x" : ""}
            </span>
          )}
        </div>
        <Link href={`/espace-client/projets/${project.id}`}>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-[#C8A96E] hover:text-[#b8965e] transition-colors cursor-pointer">
            Voir le détail
            <ChevronRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </motion.div>
  );
}

/* ─── Page principale ───────────────────────────────────── */
export default function ProjetsList() {
  const [, setLocation] = useLocation();
  const [projects, setProjects]= useState<Project[]>([]);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState<string | null>(null);
  const [filter, setFilter]    = useState<Status | "all">("all");

  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  useEffect(() => {
    if (!token) { setLocation("/espace-client"); return; }

    (async () => {
      try {
        const res = await fetch("/api/client/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) { setLocation("/espace-client"); return; }
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        setProjects(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, setLocation]);

  const filtered = filter === "all" ? projects : projects.filter((p) => p.status === filter);
  const counts: Record<string, number> = { all: projects.length };
  for (const s of ["en_cours", "en_attente", "termine", "en_pause"] as const) {
    counts[s] = projects.filter((p) => p.status === s).length;
  }

  return (
    <>
      <PageMeta
        title="Mes Projets — Espace Client Epitaphe360"
        description="Suivez l'avancement de vos projets en temps réel."
        canonicalPath="/espace-client/projets"
      />
      <Navigation />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/espace-client"><span className="hover:text-[#C8A96E] cursor-pointer">Espace Client</span></Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-700">Mes Projets</span>
          </nav>

          {/* Titre */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Projets</h1>
              <p className="text-gray-500 mt-1">{projects.length} projet{projects.length !== 1 ? "s" : ""} au total</p>
            </div>
            <button
              onClick={() => { localStorage.removeItem(TOKEN_KEY); setLocation("/espace-client"); }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2 mb-8">
            {([["all", "Tous"], ["en_cours", "En cours"], ["en_attente", "En attente"], ["termine", "Terminés"], ["en_pause", "En pause"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === key
                    ? "bg-[#C8A96E] text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#C8A96E] hover:text-[#C8A96E]"
                }`}
              >
                {label}
                <span className="ml-1.5 text-xs opacity-70">({counts[key] ?? 0})</span>
              </button>
            ))}
          </div>

          {/* Contenu */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#C8A96E]" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl text-red-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Aucun projet dans cette catégorie</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <ProjectCard project={p} />
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
