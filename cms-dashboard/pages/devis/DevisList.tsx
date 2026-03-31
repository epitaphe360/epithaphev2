/**
 * Admin — Gestion des devis
 * Liste, détail, création et envoi de devis aux clients.
 */
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

interface DevisItem {
  id: number;
  reference: string;
  clientId: number | null;
  clientName: string | null;
  clientEmail: string | null;
  status: string;
  total: number;
  sourceTool: string | null;
  createdAt: string;
  sentAt: string | null;
  validUntil: string | null;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft:    { label: "Brouillon",  color: "bg-gray-100 text-gray-700" },
  sent:     { label: "Envoyé",     color: "bg-blue-100 text-blue-700" },
  viewed:   { label: "Consulté",   color: "bg-yellow-100 text-yellow-700" },
  accepted: { label: "Accepté",    color: "bg-green-100 text-green-700" },
  refused:  { label: "Refusé",     color: "bg-red-100 text-red-700" },
  expired:  { label: "Expiré",     color: "bg-gray-100 text-gray-500" },
};

export function DevisList() {
  const token = useAuthStore((s) => s.token);
  const [devisList, setDevisList] = useState<DevisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const headers = { Authorization: `Bearer ${token}` };

  async function fetchDevis() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/devis", { headers });
      if (!res.ok) throw new Error("Erreur chargement devis");
      const data = await res.json();
      setDevisList(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchDevis(); }, []);

  async function sendDevis(id: number) {
    if (!confirm("Envoyer ce devis par email au client ?")) return;
    setSendingId(id);
    try {
      const res = await fetch(`/api/admin/devis/${id}/send`, {
        method: "POST",
        headers,
      });
      if (!res.ok) throw new Error("Erreur envoi");
      await fetchDevis();
    } catch (e: any) {
      alert("Erreur : " + e.message);
    } finally {
      setSendingId(null);
    }
  }

  async function deleteDevis(id: number) {
    if (!confirm("Supprimer ce devis ?")) return;
    try {
      const res = await fetch(`/api/admin/devis/${id}`, { method: "DELETE", headers });
      if (!res.ok) throw new Error("Erreur suppression");
      await fetchDevis();
    } catch (e: any) {
      alert("Erreur : " + e.message);
    }
  }

  const filtered = filter === "all" ? devisList : devisList.filter(d => d.status === filter);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Devis</h1>
          <p className="text-gray-500 text-sm mt-1">Gestion des propositions commerciales</p>
        </div>
        <a
          href="/admin/devis/new"
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          + Nouveau devis
        </a>
      </div>

      {/* Filtres statut */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[["all", "Tous"], ...Object.entries(STATUS_LABELS).map(([k, v]) => [k, v.label])].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
              filter === key
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500 py-8 text-center">Chargement…</p>}
      {error && <p className="text-red-600 py-4">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["Référence", "Client", "Statut", "Montant", "Source", "Date", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Aucun devis trouvé</td></tr>
              )}
              {filtered.map((d) => {
                const st = STATUS_LABELS[d.status] ?? { label: d.status, color: "bg-gray-100 text-gray-600" };
                return (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-800">{d.reference}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{d.clientName ?? "—"}</div>
                      {d.clientEmail && <div className="text-xs text-gray-400">{d.clientEmail}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {(d.total / 100).toLocaleString("fr-MA")} MAD
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{d.sourceTool ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(d.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <a
                          href={`/devis/${d.reference}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Voir
                        </a>
                        {d.status === "draft" && (
                          <button
                            onClick={() => sendDevis(d.id)}
                            disabled={sendingId === d.id}
                            className="text-xs text-green-600 hover:underline disabled:opacity-50"
                          >
                            {sendingId === d.id ? "Envoi…" : "Envoyer"}
                          </button>
                        )}
                        <button
                          onClick={() => deleteDevis(d.id)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DevisList;
