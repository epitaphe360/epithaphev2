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
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetch("/api/admin/push/subscribers")
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
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

  const confirmAndSend = () => {
    if (!form.categories.length || !form.title || !form.body) return;
    setShowConfirm(true);
  };

  const send = async () => {
    setShowConfirm(false);
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
      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#0B1121', border: '1px solid rgba(236,72,153,0.25)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.15)' }}>
                <Bell className="w-5 h-5 text-[#EC4899]" />
              </div>
              <h3 className="text-gray-900 font-bold text-lg">Confirmer l'envoi</h3>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              Vous allez envoyer <strong className="text-gray-900">"{form.title}"</strong> à :
            </p>
            <p className="text-[#EC4899] text-sm font-semibold mb-4">
              {form.categories.includes('all') ? 'Tous les abonnés' : form.categories.map(c => CATEGORIES.find(x=>x.id===c)?.label).filter(Boolean).join(', ')}
            </p>
            <p className="text-gray-500 text-xs mb-6">Cette action est irréversible et sera envoyée immédiatement.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:text-gray-700 text-sm font-semibold transition-colors">
                Annuler
              </button>
              <button onClick={send}
                className="flex-1 py-2.5 rounded-xl text-gray-900 text-sm font-bold transition-all"
                style={{ background: '#EC4899', boxShadow: '0 0 20px rgba(236,72,153,0.35)' }}>
                Envoyer maintenant
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.25)' }}>
          <Bell className="w-5 h-5 text-[#EC4899]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Push Broadcast</h1>
          <p className="text-gray-500 text-sm">Envoyer une notification à vos abonnés</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="rounded-xl p-4 mb-6 flex items-center gap-3" style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)' }}>
          <Users className="w-5 h-5 text-[#EC4899]" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{stats.total} abonné{stats.total !== 1 ? "s" : ""} au total</p>
            <p className="text-xs text-gray-500">
              {Object.entries(stats.byCategory).map(([k, v]) => `${k}: ${v}`).join(" · ")}
            </p>
          </div>
        </div>
      )}

      {/* Catégories */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wider">Catégories visées *</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} type="button" onClick={() => toggleCat(cat.id)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={form.categories.includes(cat.id)
                ? { background: '#EC4899', color: '#fff', border: '1px solid #EC4899', boxShadow: '0 0 12px rgba(236,72,153,0.3)' }
                : { background: 'rgba(13,15,30,0.8)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }
              }>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Titre *</label>
        <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder="Ex: Nouveau rapport disponible"
          className="w-full px-4 py-2.5 rounded-xl text-sm text-gray-900 outline-none transition-all"
          style={{ background: 'rgba(13,15,30,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
          onFocus={e => (e.target.style.border = '1px solid rgba(236,72,153,0.5)')}
          onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
        />
      </div>

      {/* Body */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Message *</label>
        <textarea value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          placeholder="Ex: Votre rapport mensuel est disponible dans votre espace client."
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl text-sm text-gray-900 outline-none resize-none transition-all"
          style={{ background: 'rgba(13,15,30,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
          onFocus={e => (e.target.style.border = '1px solid rgba(236,72,153,0.5)')}
          onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
        />
      </div>

      {/* URL */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">URL (optionnel)</label>
        <input value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          placeholder="https://epitaphe360.com/espace-client"
          className="w-full px-4 py-2.5 rounded-xl text-sm text-gray-900 outline-none transition-all"
          style={{ background: 'rgba(13,15,30,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
          onFocus={e => (e.target.style.border = '1px solid rgba(236,72,153,0.5)')}
          onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
        />
      </div>

      {/* Prévisualisation */}
      {(form.title || form.body) && (
        <div className="rounded-xl p-4 mb-5" style={{ background: 'rgba(13,15,30,0.8)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">Aperçu notification</p>
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-[#EC4899] flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-gray-900" />
            </div>
            <div>
              <p className="text-gray-900 text-sm font-semibold">{form.title || 'Titre…'}</p>
              <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{form.body || 'Message…'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Result / Error */}
      {result && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl p-4 mb-5"
          style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
          <div>
            <p className="font-semibold text-green-300 text-sm">Envoi terminé</p>
            <p className="text-xs text-green-500">{result.sent} envoyée(s) · {result.failed} échouée(s)</p>
          </div>
        </motion.div>
      )}
      {error && (
        <div className="flex items-center gap-3 rounded-xl p-4 mb-5"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <button
        onClick={confirmAndSend}
        disabled={sending || !form.categories.length || !form.title || !form.body}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-gray-900 transition-all disabled:opacity-40"
        style={{ background: '#EC4899', boxShadow: '0 0 25px rgba(236,72,153,0.35)' }}
      >
        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {sending ? "Envoi en cours…" : "Envoyer la notification"}
      </button>
    </div>
  );
}
