/**
 * Espace Client — Portail sécurisé
 * Connecté à l'API réelle via JWT
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen, Calendar, CheckCircle2, Clock, Download,
  MessageSquare, LogOut, ChevronRight, FileText, Bell,
  User, Briefcase, BarChart2, AlertCircle, Lock, Loader2,
  Fingerprint, BookOpen, Shield
} from "lucide-react";
import { useLocation } from "wouter";
import { startAuthentication } from "@simplewebauthn/browser";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageMeta } from "@/components/seo/page-meta";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

/* ─── Types ─────────────────────────────────────────── */
type ProjectStatus = "en_cours" | "en_attente" | "termine" | "en_pause";
type MilestoneStatus = "done" | "active" | "pending";

interface Milestone { label: string; date: string; status: MilestoneStatus; }
interface Document  { name: string; type: string; size: string; date: string; url: string; }
interface Project {
  id: string; title: string; type: string;
  status: ProjectStatus; progress: number;
  startDate: string; endDate: string;
  manager: string; managerEmail: string;
  milestones: Milestone[];
  documents: Document[];
  unreadMessages?: number;
}

interface ClientInfo {
  id: number;
  name: string;
  company: string | null;
  email: string;
}

const TOKEN_KEY = "epitaphe_client_token";

/* ─── Helper — appel API authentifié ────────────────── */
async function apiGet<T>(path: string, token: string): Promise<T> {
  const res = await fetch(path, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/* ─── Normaliser réponse API → Project ─────────────── */
function mapProject(p: any): Project {
  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString("fr-MA", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return {
    id: String(p.id),
    title: p.title ?? "",
    type: p.type ?? "Projet",
    status: (p.status ?? "en_cours") as ProjectStatus,
    progress: p.progress ?? 0,
    startDate: fmt(p.startDate),
    endDate: fmt(p.endDate),
    manager: p.managerName ?? "Votre équipe",
    managerEmail: p.managerEmail ?? "",
    unreadMessages: p.unreadMessages ?? 0,
    milestones: (p.milestones ?? []).map((m: any): Milestone => ({
      label: m.label,
      date: m.dueDate ?? "",
      status: (m.status ?? "pending") as MilestoneStatus,
    })),
    documents: (p.documents ?? []).map((d: any): Document => ({
      name: d.name,
      type: d.fileType ?? "PDF",
      size: d.fileSize ?? "",
      date: fmt(d.uploadedAt),
      url: d.url,
    })),
  };
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bg: string; dot: string }> = {
  en_cours:   { label: "En cours",    color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   dot: "bg-blue-500"  },
  en_attente: { label: "En attente",  color: "text-orange-700", bg: "bg-orange-50 border-orange-200", dot: "bg-orange-500" },
  termine:    { label: "Terminé",     color: "text-green-700",  bg: "bg-green-50 border-green-200",  dot: "bg-green-500" },
  en_pause:   { label: "En pause",    color: "text-gray-600",   bg: "bg-gray-50 border-gray-200",    dot: "bg-gray-400"  },
};

/* ─── Login form ─────────────────────────────────────── */
const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});
type LoginForm = z.infer<typeof loginSchema>;

function LoginScreen({ onLogin }: { onLogin: (token: string, client: ClientInfo) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError, getValues } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [biometricError, setBiometricError] = useState("");

  const submit = handleSubmit(async (data) => {
    try {
      const res = await fetch("/api/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError("password", { message: json.error ?? "Identifiants incorrects" });
        return;
      }
      localStorage.setItem(TOKEN_KEY, json.token);
      onLogin(json.token, json.client);
    } catch {
      setError("password", { message: "Erreur de connexion, réessayez" });
    }
  });

  const loginWithBiometrics = async () => {
    const email = getValues("email");
    if (!email) {
      setBiometricError("Saisissez votre email puis cliquez sur Biométrie");
      return;
    }
    setBiometricLoading(true);
    setBiometricError("");
    try {
      // 1. Obtenir le challenge
      const challengeRes = await fetch("/api/client/webauthn/auth-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!challengeRes.ok) {
        const err = await challengeRes.json().catch(() => ({}));
        throw new Error((err as any).error ?? "Aucun appareil biométrique enregistré");
      }
      const options = await challengeRes.json();

      // 2. Dialogue biométrique natif
      const credential = await startAuthentication({ optionsJSON: options });

      // 3. Vérifier côté serveur
      const verifyRes = await fetch("/api/client/webauthn/auth-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, credential }),
      });
      const json = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(json.error ?? "Échec de la vérification");

      localStorage.setItem(TOKEN_KEY, json.token);
      onLogin(json.token, json.client);
    } catch (e: any) {
      setBiometricError(e.message ?? "Authentification biométrique échouée");
    } finally {
      setBiometricLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-8 w-full max-w-sm shadow-lg">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground text-center mb-1">Espace Client</h2>
        <p className="text-muted-foreground text-sm text-center mb-7">Accédez à vos projets et livrables</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <input {...register("email")} type="email" placeholder="Email professionnel"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input {...register("password")} type="password" placeholder="Mot de passe"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
          </div>
          <a
            href="/espace-client/reset-password"
            className="block text-xs text-primary hover:underline text-right"
          >
            Mot de passe oublié ?
          </a>
          <button type="submit" disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Connexion
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">ou</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          type="button"
          onClick={loginWithBiometrics}
          disabled={biometricLoading}
          className="w-full border border-border rounded-xl py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {biometricLoading
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Fingerprint className="w-4 h-4 text-primary" />}
          Se connecter avec Face ID / Empreinte
        </button>
        {biometricError && (
          <p className="text-destructive text-xs text-center mt-2">{biometricError}</p>
        )}

        <p className="text-xs text-muted-foreground text-center mt-5">
          Pas encore de compte ? Contactez votre chargé de compte.
        </p>

        {/* Boutons de test — connexion rapide */}
        <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3 font-medium">🔧 Accès test (dev)</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/dev/auto-login-client", { method: "POST" });
                    if (!res.ok) throw new Error("Échec auto-login client");
                    const json = await res.json();
                    localStorage.setItem(TOKEN_KEY, json.token);
                    onLogin(json.token, json.client);
                  } catch (e) {
                    alert("Auto-login client échoué. Vérifiez que le serveur dev tourne.");
                  }
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" /> Client Test
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/dev/auto-login-admin", { method: "POST" });
                    if (!res.ok) throw new Error("Échec auto-login admin");
                    const json = await res.json();
                    const authData = { state: { user: json.user, token: json.token, isAuthenticated: true, isLoading: false }, version: 0 };
                    localStorage.setItem("cms-auth-storage", JSON.stringify(authData));
                    window.location.href = "/admin";
                  } catch (e) {
                    alert("Auto-login admin échoué. Vérifiez que le serveur dev tourne.");
                  }
                }}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5" /> Admin Test
              </button>
            </div>
          </div>
      </motion.div>
    </div>
  );
}

/* ─── Barre de progression ───────────────────────────── */
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
      <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
    </div>
  );
}

/* ─── Vue projet détail ──────────────────────────────── */
function ProjectDetail({ project, token, onBack }: { project: Project; token: string; onBack: () => void }) {
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  const st = STATUS_CONFIG[project.status];

  const sendMessage = async () => {
    if (!msg.trim()) return;
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/client/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ projectId: Number(project.id), content: msg.trim() }),
      });
      if (res.ok) {
        setSent(true);
        setMsg("");
      } else {
        const err = await res.json().catch(() => ({}));
        setSendError((err as any).error ?? "Erreur lors de l'envoi");
      }
    } catch {
      setSendError("Erreur réseau, réessayez");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
      <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
        ← Retour aux projets
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Infos + jalons */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">{project.type}</span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">{project.title}</h2>
              </div>
              <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold flex-shrink-0 ${st.bg} ${st.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} /> {st.label}
              </span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between text-sm text-muted-foreground mb-1.5">
                <span>Avancement global</span><span className="font-semibold text-foreground">{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
              <div><span className="text-muted-foreground">Début :</span> <span className="font-medium">{project.startDate}</span></div>
              <div><span className="text-muted-foreground">Fin prévue :</span> <span className="font-medium">{project.endDate}</span></div>
              <div><span className="text-muted-foreground">Chef de projet :</span> <span className="font-medium">{project.manager}</span></div>
              {project.managerEmail && <div><a href={`mailto:${project.managerEmail}`} className="text-primary hover:underline text-xs">{project.managerEmail}</a></div>}
            </div>
          </div>

          {/* Jalons */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Planning des jalons</h3>
            {project.milestones.length === 0 ? (
              <p className="text-muted-foreground text-sm">Aucun jalon défini pour ce projet.</p>
            ) : (
              <div className="space-y-3">
                {project.milestones.map((m, i) => (
                  <div key={m.label ?? i} className="flex items-center gap-4">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      m.status === "done" ? "bg-green-100 text-green-600" : m.status === "active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {m.status === "done" ? <CheckCircle2 className="w-4 h-4" /> : m.status === "active" ? <Clock className="w-4 h-4 animate-pulse" /> : <div className="w-2 h-2 bg-current rounded-full" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${m.status === "pending" ? "text-muted-foreground" : "text-foreground"}`}>{m.label}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{m.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Documents + Message */}
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Documents ({project.documents.length})</h3>
            {project.documents.length === 0 ? (
              <p className="text-muted-foreground text-sm">Aucun document disponible.</p>
            ) : (
              <div className="space-y-3">
                {project.documents.map((doc, i) => (
                  <div key={doc.url ?? doc.name ?? i} className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl hover:bg-muted transition-colors">
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.size} · {doc.date}</p>
                    </div>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/70 transition-colors flex-shrink-0">
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary" /> Contacter mon équipe</h3>
            {sent ? (
              <p className="text-green-600 text-sm font-medium py-2">✓ Message envoyé avec succès</p>
            ) : (
              <>
                <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4}
                  placeholder="Posez votre question ou laissez un commentaire…"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 mb-3" />
                {sendError && <p className="text-destructive text-xs mb-2">{sendError}</p>}
                <button onClick={sendMessage} disabled={sending || !msg.trim()}
                  className="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {sending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Envoyer
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Dashboard principal ────────────────────────────── */
function ClientDashboard({ clientInfo, token, onLogout }: { clientInfo: ClientInfo; token: string; onLogout: () => void }) {
  const [, navigate] = useLocation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const raw = await apiGet<any[]>("/api/client/projects", token);
      setProjects(Array.isArray(raw) ? raw.map(mapProject) : []);
    } catch (e: any) {
      setError(e.message ?? "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const totalDocs = projects.reduce((n, p) => n + p.documents.length, 0);
  const avgProgress = projects.length ? Math.round(projects.reduce((n, p) => n + p.progress, 0) / projects.length) : 0;
  const nextDeadline = projects
    .flatMap((p) => p.milestones.filter((m) => m.status === "active"))
    .map((m) => m.date)[0] ?? "—";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-muted-foreground text-sm">Bienvenue,</p>
          <h1 className="text-2xl font-bold text-foreground">
            {clientInfo.name}
            {clientInfo.company && <span className="text-muted-foreground font-normal text-base"> — {clientInfo.company}</span>}
          </h1>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors border border-border rounded-lg px-3 py-2">
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
          <p className="text-destructive font-medium mb-4">{error}</p>
          <button onClick={loadProjects} className="text-sm text-primary hover:underline">Réessayer</button>
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Projets actifs", value: String(projects.filter((p) => p.status === "en_cours").length), icon: <Briefcase className="w-5 h-5" />, color: "text-blue-600" },
              { label: "Documents", value: String(totalDocs), icon: <FileText className="w-5 h-5" />, color: "text-purple-600" },
              { label: "Prochaine échéance", value: nextDeadline, icon: <Calendar className="w-5 h-5" />, color: "text-orange-600" },
              { label: "Avancement moyen", value: `${avgProgress}%`, icon: <BarChart2 className="w-5 h-5" />, color: "text-green-600" },
            ].map((k) => (
              <div key={k.label} className="bg-card border border-border rounded-2xl p-4">
                <div className={`w-9 h-9 rounded-xl bg-current/10 flex items-center justify-center mb-3 ${k.color}`}>{k.icon}</div>
                <p className="text-2xl font-bold text-foreground">{k.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Navigation tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {[
              { label: "Mes Projets",   icon: <Briefcase className="w-6 h-6" />,  path: "/espace-client/projets",   desc: "Suivi en temps réel",   color: "text-blue-600",   bg: "bg-blue-50" },
              { label: "Documents",     icon: <FileText className="w-6 h-6" />,    path: "/espace-client/documents", desc: "Coffre-fort sécurisé",  color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Ressources",    icon: <BookOpen className="w-6 h-6" />,    path: "/espace-client/ressources",desc: "Guides & modèles",       color: "text-green-600",  bg: "bg-green-50" },
              { label: "Sécurité",      icon: <Shield className="w-6 h-6" />,      path: "/espace-client/securite",  desc: "Clés biométriques",     color: "text-orange-600", bg: "bg-orange-50" },
            ].map((tile) => (
              <motion.button key={tile.path} whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,.07)" }}
                onClick={() => navigate(tile.path)}
                className="bg-card border border-border rounded-2xl p-5 text-left transition-all hover:border-primary/30 flex flex-col items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tile.bg} ${tile.color}`}>{tile.icon}</div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{tile.label}</p>
                  <p className="text-xs text-muted-foreground">{tile.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Mes projets récents</h2>
            <button onClick={() => navigate("/espace-client/projets")}
              className="text-sm text-primary hover:underline flex items-center gap-1">
              Voir tout <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Aucun projet en cours pour le moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {projects.slice(0, 4).map((p) => {
                const st = STATUS_CONFIG[p.status];
                return (
                  <motion.button key={p.id} whileHover={{ y: -2 }} onClick={() => navigate(`/espace-client/projets/${p.id}`)}
                    className="bg-card border border-border rounded-2xl p-6 text-left hover:border-primary/40 transition-colors w-full">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-xs text-muted-foreground">{p.type}</span>
                        <h3 className="font-bold text-foreground mt-0.5">{p.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {(p.unreadMessages ?? 0) > 0 && (
                          <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                            {p.unreadMessages}
                          </span>
                        )}
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${st.bg} ${st.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} /> {st.label}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Avancement</span><span>{p.progress}%</span>
                      </div>
                      <ProgressBar value={p.progress} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Chef de projet : {p.manager}</span>
                      <span className="flex items-center gap-1 text-primary font-medium">Voir <ChevronRight className="w-3 h-3" /></span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Page principale ────────────────────────────────── */
export default function EspaceClientPage() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [checking, setChecking] = useState(true);
  const [magicError, setMagicError] = useState("");

  /* Vérifier token existant et gérer magic link au montage */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loginHint = params.get("login_hint");
    const magicToken = params.get("magic_token");

    if (loginHint && magicToken) {
      // Effacer les params de l'URL sans rechargement
      window.history.replaceState({}, "", "/espace-client");

      fetch("/api/client/magic-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginHint, token: magicToken }),
      })
        .then((r) => r.json())
        .then((json) => {
          if (json.token) {
            localStorage.setItem(TOKEN_KEY, json.token);
            setToken(json.token);
            setClientInfo(json.client);
          } else {
            setMagicError(json.error ?? "Lien invalide ou expiré");
          }
          setChecking(false);
        })
        .catch(() => {
          setMagicError("Erreur de connexion, veuillez vous connecter manuellement");
          setChecking(false);
        });
      return;
    }

    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (!storedToken) { setChecking(false); return; }

    apiGet<ClientInfo>("/api/client/me", storedToken)
      .then((info) => { setClientInfo(info); setChecking(false); })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setChecking(false);
      });
  }, []);

  const handleLogin = (newToken: string, client: ClientInfo) => {
    setToken(newToken);
    setClientInfo(client);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setClientInfo(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Espace Client"
        description="Suivez vos projets Epitaphe360 en temps réel : jalons, documents, livrables et communication directe avec votre équipe dédiée."
        canonicalPath="/espace-client"
        noIndex
      />
      <Navigation />
      <main>
        {checking ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : token && clientInfo ? (
          <ClientDashboard clientInfo={clientInfo} token={token} onLogout={handleLogout} />
        ) : (
          <>
            {magicError && (
              <div className="max-w-sm mx-auto mt-8 px-4">
                <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-center">
                  <p className="text-destructive text-sm font-medium">{magicError}</p>
                </div>
              </div>
            )}
            <LoginScreen onLogin={handleLogin} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
