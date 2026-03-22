/**
 * Espace Client — Détail d'un Projet
 * /espace-client/projets/:id
 *
 * Affiche : timeline jalons, documents, messagerie client ↔ agence
 */
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, CheckCircle2, Circle, Clock, Download,
  FileText, MessageSquare, Send, AlertCircle, Loader2,
  BarChart2, Calendar, User, PauseCircle, LogOut, RefreshCw,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageMeta } from "@/components/seo/page-meta";

/* ─── Types ─────────────────────────────────────────────── */
type MilestoneStatus = "done" | "active" | "pending";
type ProjectStatus   = "en_cours" | "en_attente" | "termine" | "en_pause";

interface Milestone { id: number; label: string; dueDate: string | null; status: MilestoneStatus; order: number; }
interface Document  { id: number; name: string; fileType: string; fileSize: string | null; url: string; uploadedAt: string; }
interface Message   { id: number; senderRole: "client" | "agency"; content: string; isRead: boolean; createdAt: string; }

interface ProjectDetail {
  id: number; title: string; type: string; status: ProjectStatus;
  progress: number; startDate: string | null; endDate: string | null;
  managerName: string | null; managerEmail: string | null;
  description: string | null;
  milestones: Milestone[];
  documents:  Document[];
  messages:   Message[];
}

const TOKEN_KEY = "epitaphe_client_token";

const MILESTONE_ICON: Record<MilestoneStatus, React.ElementType> = {
  done:    CheckCircle2,
  active:  Clock,
  pending: Circle,
};
const MILESTONE_COLOR: Record<MilestoneStatus, string> = {
  done:    "text-emerald-500",
  active:  "text-[#C8A96E]",
  pending: "text-gray-300",
};
const MILESTONE_LINE: Record<MilestoneStatus, string> = {
  done:    "bg-emerald-200",
  active:  "bg-[#C8A96E]/30",
  pending: "bg-gray-100",
};

function fmtTime(d: string) {
  return new Date(d).toLocaleString("fr-MA", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-MA", { day: "2-digit", month: "short", year: "numeric" });
}

/* ─── Composant Timeline ─────────────────────────────────── */
function Timeline({ milestones }: { milestones: Milestone[] }) {
  return (
    <ol className="relative">
      {milestones.map((m, i) => {
        const Icon = MILESTONE_ICON[m.status] as React.FC<{ className?: string }>;
        const color = MILESTONE_COLOR[m.status];
        const isLast = i === milestones.length - 1;
        return (
          <li key={m.id} className="flex gap-4 pb-6">
            <div className="flex flex-col items-center">
              <Icon className={`w-5 h-5 ${color} shrink-0 mt-0.5`} />
              {!isLast && <div className={`w-0.5 flex-1 mt-2 ${MILESTONE_LINE[m.status]}`} />}
            </div>
            <div className="pb-1">
              <p className={`font-medium ${m.status === "active" ? "text-[#C8A96E]" : m.status === "done" ? "text-gray-700" : "text-gray-400"}`}>
                {m.label}
              </p>
              {m.dueDate && (
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {m.dueDate}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ─── Page principale ───────────────────────────────────── */
export default function ProjetDetail() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const projectId = params?.id;

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [msgInput, setMsgInput] = useState("");
  const [sending, setSending]   = useState(false);
  const [activeTab, setActiveTab] = useState<"jalons" | "documents" | "messages">("jalons");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  async function loadProject() {
    if (!token || !projectId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/client/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { setLocation("/espace-client"); return; }
      if (res.status === 404) { setError("Projet introuvable"); return; }
      if (!res.ok) throw new Error("Erreur serveur");
      setProject(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token) { setLocation("/espace-client"); return; }
    loadProject();
  }, [token, projectId]);

  useEffect(() => {
    if (activeTab === "messages") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [project?.messages, activeTab]);

  async function sendMessage() {
    if (!msgInput.trim() || !token || !project) return;
    setSending(true);
    try {
      const res = await fetch("/api/client/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ projectId: project.id, content: msgInput.trim() }),
      });
      if (!res.ok) throw new Error("Échec envoi");
      const msg = await res.json();
      setProject((p) => p ? { ...p, messages: [...p.messages, msg] } : p);
      setMsgInput("");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSending(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#C8A96E]" />
    </div>
  );

  if (error || !project) return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <p className="text-gray-600 mb-4">{error ?? "Projet introuvable"}</p>
          <Link href="/espace-client/projets">
            <span className="text-[#C8A96E] hover:underline cursor-pointer">Retour aux projets</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <PageMeta
        title={`${project.title} — Espace Client Epitaphe360`}
        description="Suivi détaillé de votre projet."
        canonicalPath={`/espace-client/projets/${project.id}`}
      />
      <Navigation />

      <main className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/espace-client"><span className="hover:text-[#C8A96E] cursor-pointer">Espace Client</span></Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/espace-client/projets"><span className="hover:text-[#C8A96E] cursor-pointer">Projets</span></Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-700 truncate max-w-xs">{project.title}</span>
          </nav>

          {/* En-tête */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-gray-500 mt-1 text-sm">{project.type}</p>
                {project.description && <p className="text-gray-600 mt-2 text-sm">{project.description}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={loadProject} className="p-2 rounded-lg hover:bg-gray-50 transition text-gray-400 hover:text-gray-600">
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { localStorage.removeItem(TOKEN_KEY); setLocation("/espace-client"); }}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Déconnexion
                </button>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="mt-5">
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Avancement global</span>
                <span className="font-semibold text-[#C8A96E]">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-2.5 rounded-full bg-gradient-to-r from-[#C8A96E] to-[#b8965e]"
                />
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-1">Début</p>
                <p className="font-medium text-gray-700">{fmtDate(project.startDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Fin prévue</p>
                <p className="font-medium text-gray-700">{fmtDate(project.endDate)}</p>
              </div>
              {project.managerName && (
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 mb-1">Chef de projet</p>
                  <p className="font-medium text-gray-700">
                    {project.managerName}
                    {project.managerEmail && (
                      <a href={`mailto:${project.managerEmail}`} className="ml-2 text-xs text-[#C8A96E] hover:underline">
                        {project.managerEmail}
                      </a>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Onglets */}
          <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 mb-6 max-w-md">
            {([
              ["jalons",    "Jalons",     project.milestones.length],
              ["documents", "Documents",  project.documents.length],
              ["messages",  "Messages",   project.messages.filter((m) => !m.isRead && m.senderRole === "agency").length],
            ] as const).map(([key, label, badge]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === key
                    ? "bg-[#C8A96E] text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {label}
                {badge > 0 && (
                  <span className={`text-xs rounded-full px-1.5 py-0.5 ${activeTab === key ? "bg-white/20" : "bg-gray-100"}`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Contenu onglets */}
          <AnimatePresence mode="wait">
            {activeTab === "jalons" && (
              <motion.div key="jalons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-6">Jalons du projet</h2>
                {project.milestones.length === 0 ? (
                  <p className="text-gray-400 text-sm">Aucun jalon défini</p>
                ) : (
                  <Timeline milestones={project.milestones} />
                )}
              </motion.div>
            )}

            {activeTab === "documents" && (
              <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-6">Documents & Livrables</h2>
                {project.documents.length === 0 ? (
                  <p className="text-gray-400 text-sm">Aucun document disponible</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {project.documents.map((doc) => (
                      <div key={doc.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#C8A96E]/10 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-[#C8A96E]" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 text-sm">{doc.name}</p>
                            <p className="text-xs text-gray-400">
                              {doc.fileType} {doc.fileSize && `· ${doc.fileSize}`} · {fmtDate(doc.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-gray-50 text-[#C8A96E] hover:text-[#b8965e] transition"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "messages" && (
              <motion.div key="msgs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Messages */}
                <div className="h-96 overflow-y-auto p-6 space-y-4">
                  {project.messages.length === 0 && (
                    <p className="text-center text-gray-400 text-sm mt-16">
                      Pas de messages pour ce projet.
                      <br />Posez votre première question ci-dessous.
                    </p>
                  )}
                  {project.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.senderRole === "client" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2.5 ${
                        msg.senderRole === "client"
                          ? "bg-[#C8A96E] text-white rounded-br-sm"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.senderRole === "client" ? "text-white/60" : "text-gray-400"}`}>
                          {fmtTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Zone de saisie */}
                <div className="border-t border-gray-100 p-4 flex gap-3">
                  <input
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Votre message..."
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A96E]/30 focus:border-[#C8A96E] transition"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!msgInput.trim() || sending}
                    className="p-2.5 rounded-xl bg-[#C8A96E] text-white hover:bg-[#b8965e] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </>
  );
}
