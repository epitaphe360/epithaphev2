/**
 * CMS Admin — Push Broadcast
 * Envoyer une notification push à tous les abonnés par catégorie
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Send, Users, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const CATEGORIES = [
  { id: "project_update",   label: "Mises à jour de projet" },
  { id: "new_case_study",   label: "Nouvelles études de cas" },
  { id: "event_invitation", label: "Invitations événements" },
  { id: "report_ready",     label: "Rapports disponibles" },
  { id: "newsletter",       label: "Newsletter" },
  { id: "all",              label: "Tous les abonnés" },
];

interface SubStats {
  total: number;
  byCategory: Record<string, number>;
}

export function PushBroadcastPage() {
  const [form, setForm] = useState({
    categories: [] as string[],
    title: "",
    body: "",
    url: "",
    icon: "/icons/icon-192x192.png",
  });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<SubStats | null>(null);

  useEffect(() => {
    fetch("/api/admin/push/subscribers")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const toggleCat = (id: string) => {
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(id) ? f.categories.filter((c) => c !== id) : [...f.categories, id],
    }));
    setResult(null);
  };

  const send = async () => {
    if (!form.categories.length || !form.title || !form.body) return;
    setSending(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/admin/push/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erreur serveur");
      setResult({ sent: json.sent, failed: json.failed });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Push Broadcast</h1>
          <p className="text-muted-foreground text-sm">Envoyer une notification à vos abonnés</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="bg-muted/40 rounded-xl p-4 mb-6 flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">{stats.total} abonné{stats.total !== 1 ? "s" : ""} au total</p>
            <p className="text-xs text-muted-foreground">
              {Object.entries(stats.byCategory).map(([k, v]) => `${k}: ${v}`).join(" • ")}
            </p>
          </div>
        </div>
      )}

      {/* Catégories */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-foreground mb-2">Catégories visées *</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} type="button" onClick={() => toggleCat(cat.id)}
              className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                form.categories.includes(cat.id)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/50"
              }`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1.5">Titre *</label>
        <input
          value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Ex: Nouveau rapport disponible"
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Body */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
        <textarea
          value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          placeholder="Ex: Votre rapport mensuel de janvier est désormais disponible dans votre espace client."
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      {/* URL */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-1.5">URL (optionnel)</label>
        <input
          value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          placeholder="https://epitaphe360.com/espace-client"
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Result / Error */}
      {result && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-5">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-800 text-sm">Envoi terminé</p>
            <p className="text-xs text-green-700">{result.sent} envoyée(s) • {result.failed} échouée(s)</p>
          </div>
        </motion.div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        onClick={send}
        disabled={sending || !form.categories.length || !form.title || !form.body}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {sending ? "Envoi en cours…" : "Envoyer la notification"}
      </button>
    </div>
  );
}
