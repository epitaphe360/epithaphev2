/**
 * Espace Client — Page Sécurité
 * Gestion des clés biométriques WebAuthn + préférences push + changement de mot de passe
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, ChevronLeft, Bell, CheckCircle2, Loader2, Key, Lock, Eye, EyeOff, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageMeta } from "@/components/seo/page-meta";
import { BiometricSetup } from "@/components/biometric-setup";

const TOKEN_KEY = "epitaphe_client_token";

const PUSH_CATEGORIES = [
  { id: "project_update",    label: "Mises à jour de projet",           desc: "Jalons validés, nouveaux documents" },
  { id: "new_case_study",    label: "Nouvelles études de cas",           desc: "Publication d'un nouveau cas client" },
  { id: "event_invitation",  label: "Invitations événements",            desc: "Webinaires, conférences, portes ouvertes" },
  { id: "report_ready",      label: "Rapports disponibles",              desc: "Rapport mensuel ou bilan de campagne prêt" },
  { id: "newsletter",        label: "Newsletter Epitaphe360",            desc: "Actualités marketing & tendances digitales" },
];

// ── Changement de mot de passe ────────────────────────────────────────────────
function PasswordChangeSection({ token }: { token: string }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (next.length < 8) { setError("Le nouveau mot de passe doit contenir au moins 8 caractères."); return; }
    if (next !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/client/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur serveur");
      setSuccess(true);
      setCurrent(""); setNext(""); setConfirm("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-10">
      <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
        <Key className="w-4 h-4 text-primary" /> Changer le mot de passe
      </h2>
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
        {/* Mot de passe actuel */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Mot de passe actuel</label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
              className="w-full px-4 py-2.5 pr-10 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Nouveau mot de passe */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Nouveau mot de passe</label>
          <div className="relative">
            <input
              type={showNext ? "text" : "password"}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
              className="w-full px-4 py-2.5 pr-10 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Minimum 8 caractères"
            />
            <button type="button" onClick={() => setShowNext(!showNext)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {next && next.length < 8 && (
            <p className="text-xs text-destructive mt-1">Au moins 8 caractères requis</p>
          )}
        </div>

        {/* Confirmation */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Confirmer le nouveau mot de passe</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="••••••••"
          />
          {confirm && next !== confirm && (
            <p className="text-xs text-destructive mt-1">Les mots de passe ne correspondent pas</p>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {success && (
          <p className="flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle2 className="w-4 h-4" /> Mot de passe changé avec succès
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !current || !next || !confirm}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          Changer le mot de passe
        </button>
      </form>
    </section>
  );
}

// ── Session info ──────────────────────────────────────────────────────────────
function SessionSection({ token }: { token: string }) {
  const [, navigate] = useLocation();

  // Decode JWT payload (no verification — just display)
  let expiresAt: Date | null = null;
  let email = "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp) expiresAt = new Date(payload.exp * 1000);
    email = payload.email ?? "";
  } catch {}

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    navigate("/espace-client");
  };

  return (
    <section className="mb-10">
      <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
        <Shield className="w-4 h-4 text-primary" /> Session active
      </h2>
      <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">{email || "Session actuelle"}</p>
          {expiresAt && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Expire le {expiresAt.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-destructive/30 text-destructive text-sm hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Se déconnecter
        </button>
      </div>
    </section>
  );
}

// ── Page principale ────────────────────────────────────────────────────────────
export default function SecuritePage() {
  const [, navigate] = useLocation();
  const [token] = useState<string | null>(() => {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  });

  const [pushCategories, setPushCategories] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("push_categories") ?? "[]"); } catch { return []; }
  });
  const [pushSaving, setPushSaving] = useState(false);
  const [pushSaved, setPushSaved] = useState(false);
  const [pushError, setPushError] = useState("");

  useEffect(() => {
    if (!token) navigate("/espace-client");
  }, [token, navigate]);

  if (!token) return null;

  const toggleCategory = (id: string) => {
    setPushCategories((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
    setPushSaved(false);
  };

  const savePushPrefs = async () => {
    setPushSaving(true);
    setPushError("");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) { setPushError("Aucun abonnement push actif. Activez d'abord les notifications via la bannière."); return; }
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ subscription: sub.toJSON(), categories: pushCategories }),
      });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
      localStorage.setItem("push_categories", JSON.stringify(pushCategories));
      setPushSaved(true);
    } catch (e: any) {
      setPushError(e.message ?? "Erreur réseau");
    } finally {
      setPushSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PageMeta
        title="Sécurité — Espace Client"
        description="Gérez vos appareils biométriques, mot de passe et préférences de notifications."
        canonicalPath="/espace-client/securite"
        noIndex
      />
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <button onClick={() => navigate("/espace-client")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Retour au tableau de bord
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sécurité</h1>
            <p className="text-muted-foreground text-sm">Appareils biométriques, mot de passe et notifications</p>
          </div>
        </div>

        {/* Changement de mot de passe */}
        <PasswordChangeSection token={token} />

        {/* Session active */}
        <SessionSection token={token} />

        {/* WebAuthn biometrics */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-foreground mb-4">Appareils biométriques enregistrés</h2>
          <BiometricSetup />
        </section>

        {/* Push notifications */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" /> Préférences de notifications push
          </h2>
          <p className="text-xs text-muted-foreground mb-5">
            Choisissez les catégories pour lesquelles vous souhaitez recevoir des notifications.
          </p>
          <motion.div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
            {PUSH_CATEGORIES.map((cat) => (
              <label key={cat.id} className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer hover:bg-muted/40 transition-colors">
                <div>
                  <p className="font-medium text-sm text-foreground">{cat.label}</p>
                  <p className="text-xs text-muted-foreground">{cat.desc}</p>
                </div>
                <input type="checkbox" checked={pushCategories.includes(cat.id)} onChange={() => toggleCategory(cat.id)}
                  className="w-4 h-4 rounded accent-primary" />
              </label>
            ))}
          </motion.div>

          {pushError && <p className="text-destructive text-xs mt-3">{pushError}</p>}

          <button onClick={savePushPrefs} disabled={pushSaving}
            className="mt-5 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60">
            {pushSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : pushSaved ? <CheckCircle2 className="w-4 h-4" /> : null}
            {pushSaved ? "Préférences sauvegardées" : "Enregistrer les préférences"}
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
