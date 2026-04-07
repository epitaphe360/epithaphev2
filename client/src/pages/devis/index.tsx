/**
 * Devis public — /devis/:reference
 * Accessible sans auth, via lien envoyé au client par email.
 * Permet de consulter, accepter ou refuser un devis.
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText, Check, X, Clock, AlertCircle, Loader2, CheckCircle2
} from "lucide-react";
import { useParams } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageMeta } from "@/components/seo/page-meta";

interface DevisItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface DevisDetail {
  id: number;
  reference: string;
  clientName: string | null;
  clientEmail: string | null;
  status: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  currency: string;
  notes: string | null;
  validUntil: string | null;
  items: DevisItem[];
  createdAt: string;
  sentAt: string | null;
  sourceTool: string | null;
}

const STATUS_INFO: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  draft:    { label: "Brouillon",  icon: <Clock className="w-4 h-4" />,         color: "text-gray-500",   bg: "bg-gray-100" },
  sent:     { label: "Envoyé",     icon: <FileText className="w-4 h-4" />,      color: "text-blue-600",  bg: "bg-blue-50" },
  viewed:   { label: "Consulté",   icon: <FileText className="w-4 h-4" />,      color: "text-amber-600", bg: "bg-amber-50" },
  accepted: { label: "Accepté ✓",  icon: <CheckCircle2 className="w-4 h-4" />, color: "text-emerald-600",bg: "bg-emerald-50" },
  refused:  { label: "Refusé",     icon: <X className="w-4 h-4" />,             color: "text-red-600",   bg: "bg-red-50" },
  expired:  { label: "Expiré",     icon: <AlertCircle className="w-4 h-4" />,   color: "text-gray-400",  bg: "bg-gray-50" },
};

export default function DevisPage() {
  const params = useParams<{ reference: string }>();
  const reference = params.reference;

  const [devis, setDevis] = useState<DevisDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionDone, setActionDone] = useState<"accepted" | "refused" | null>(null);
  const [pendingAction, setPendingAction] = useState<"accept" | "refuse" | null>(null);

  useEffect(() => {
    if (!reference) return;
    fetch(`/api/devis/${reference}`)
      .then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e.error ?? "Devis introuvable")))
      .then(setDevis)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, [reference]);

  async function handleAction(action: "accept" | "refuse") {
    if (!reference) return;
    setPendingAction(action);
  }

  async function confirmAction(action: "accept" | "refuse") {
    if (!reference) return;
    setPendingAction(null);
    setActionLoading(true);
    try {
      const res = await fetch(`/api/devis/${reference}/${action}`, { method: "POST" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).error ?? "Erreur");
      }
      setActionDone(action === "accept" ? "accepted" : "refused");
      // Refresh
      const updated = await fetch(`/api/devis/${reference}`).then(r => r.json());
      setDevis(updated);
    } catch (e: any) {
      setError("Erreur : " + e.message);
    } finally {
      setActionLoading(false);
    }
  }

  const statusInfo = devis ? (STATUS_INFO[devis.status] ?? STATUS_INFO.sent) : null;
  const canAct = devis && (devis.status === "sent" || devis.status === "viewed");

  return (
    <>
      <PageMeta
        title={`Devis ${reference ?? ""} — Epitaphe360`}
        description="Consultez votre devis personnalisé"
        noIndex
      />
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <main className="max-w-3xl mx-auto px-4 pt-28 pb-20">
          {loading && (
            <div className="flex items-center justify-center gap-3 text-gray-400 py-20">
              <Loader2 className="w-6 h-6 animate-spin text-[#C8A96E]" />
              Chargement du devis…
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center gap-4 py-20 text-center">
              <AlertCircle className="w-10 h-10 text-red-400" />
              <h2 className="text-lg font-semibold text-gray-900">Devis introuvable</h2>
              <p className="text-gray-500 text-sm">{error}</p>
              <a href="/" className="text-sm text-[#C8A96E] hover:underline mt-2">← Retour à l'accueil</a>
            </div>
          )}

          {!loading && !error && devis && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* En-tête */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Devis {devis.reference}</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Émis le {new Date(devis.createdAt).toLocaleDateString("fr-FR")}
                    {devis.validUntil && ` · Valable jusqu'au ${new Date(devis.validUntil).toLocaleDateString("fr-FR")}`}
                  </p>
                </div>
                {statusInfo && (
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${statusInfo.bg}`}>
                    <span className={statusInfo.color}>{statusInfo.icon}</span>
                    <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                  </div>
                )}
              </div>

              {/* Info client */}
              {(devis.clientName || devis.clientEmail) && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Établi pour</p>
                  <p className="font-medium text-gray-900">{devis.clientName ?? "—"}</p>
                  {devis.clientEmail && <p className="text-sm text-gray-500">{devis.clientEmail}</p>}
                </div>
              )}

              {/* Lignes du devis */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 uppercase tracking-wider">
                    <span className="col-span-6">Description</span>
                    <span className="col-span-2 text-center">Qté</span>
                    <span className="col-span-2 text-right">PU HT</span>
                    <span className="col-span-2 text-right">Total HT</span>
                  </div>
                </div>
                {devis.items?.length > 0 ? (
                  devis.items.map((item, i) => (
                    <div key={i} className="px-5 py-3 border-b border-gray-100 grid grid-cols-12 gap-2 text-sm">
                      <span className="col-span-6 text-gray-900">{item.description}</span>
                      <span className="col-span-2 text-center text-gray-500">{item.quantity}</span>
                      <span className="col-span-2 text-right text-gray-500">
                        {(item.unitPrice / 100).toLocaleString("fr-MA")} MAD
                      </span>
                      <span className="col-span-2 text-right font-medium text-gray-900">
                        {(item.total / 100).toLocaleString("fr-MA")} MAD
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-6 text-center text-gray-500 text-sm">Aucune ligne de devis</div>
                )}

                {/* Totaux */}
                <div className="px-5 py-4 space-y-2 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Sous-total HT</span>
                    <span>{(devis.subtotal / 100).toLocaleString("fr-MA")} MAD</span>
                  </div>
                  {devis.taxAmount > 0 && (
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>TVA</span>
                      <span>{(devis.taxAmount / 100).toLocaleString("fr-MA")} MAD</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total TTC</span>
                    <span>{(devis.total / 100).toLocaleString("fr-MA")} {(devis.currency ?? "MAD").toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {devis.notes && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Notes</p>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{devis.notes}</p>
                </div>
              )}

              {/* Confirmation inline */}
              {pendingAction && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-5 border border-amber-200 bg-amber-50"
                >
                  <p className="text-sm font-semibold text-amber-800 mb-4">
                    {pendingAction === "accept"
                      ? "Confirmer l'acceptation de ce devis ?"
                      : "Confirmer le refus de ce devis ?"}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => confirmAction(pendingAction)}
                      disabled={actionLoading}
                      className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                        pendingAction === "accept"
                          ? "bg-[#C8A96E] hover:bg-[#b8965e] text-white"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      {actionLoading ? "Traitement…" : pendingAction === "accept" ? "Oui, accepter" : "Oui, refuser"}
                    </button>
                    <button
                      onClick={() => setPendingAction(null)}
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm transition-all"
                    >
                      Annuler
                    </button>
                  </div>
                </motion.div>
              )}

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Résultat accepté / refusé */}
              {actionDone && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-xl p-4 flex items-center gap-3 ${
                    actionDone === "accepted"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                      : "bg-red-50 border border-red-200 text-red-600"
                  }`}
                >
                  {actionDone === "accepted" ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  <span className="font-medium">
                    {actionDone === "accepted"
                      ? "Devis accepté ! Notre équipe vous contactera prochainement."
                      : "Devis refusé. Contactez-nous si vous souhaitez modifier la proposition."}
                  </span>
                </motion.div>
              )}

              {/* Actions */}
              {canAct && !actionDone && !pendingAction && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleAction("accept")}
                    disabled={actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#C8A96E] hover:bg-[#b8965e] text-white font-medium py-3 rounded-xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    {actionLoading ? "Traitement…" : "Accepter ce devis"}
                  </button>
                  <button
                    onClick={() => handleAction("refuse")}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 px-5 rounded-xl transition-all"
                  >
                    <X className="w-4 h-4" />
                    Refuser
                  </button>
                </div>
              )}

              {/* Contact */}
              <div className="text-center pt-4">
                <p className="text-xs text-gray-500">
                  Des questions ?{" "}
                  <a href="/contact" className="text-[#C8A96E] hover:underline">Contactez-nous</a>
                </p>
              </div>
            </motion.div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
