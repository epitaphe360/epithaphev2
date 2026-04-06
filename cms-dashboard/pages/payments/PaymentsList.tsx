/**
 * Admin — Historique des paiements (PayPal, CMI, Virement)
 */
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

interface Payment {
  id: number;
  type: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string | null;
  clientId: number | null;
  devisId: number | null;
  subscriptionId: number | null;
  scoringResultId: string | null;
  invoiceId: number | null;
  paypalOrderId: string | null;
  paypalCaptureId: string | null;
  cmiOrderId: string | null;
  cmiTransactionId: string | null;
  createdAt: string;
  metadata?: Record<string, string>;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: "En attente",  color: "bg-yellow-100 text-yellow-700" },
  paid:      { label: "Payé",        color: "bg-green-100 text-green-700" },
  succeeded: { label: "Réussi",      color: "bg-green-100 text-green-700" },
  failed:    { label: "Échoué",      color: "bg-red-100 text-red-700" },
  refunded:  { label: "Remboursé",   color: "bg-purple-100 text-purple-700" },
  cancelled: { label: "Annulé",      color: "bg-gray-100 text-gray-600" },
};

const METHOD_LABELS: Record<string, { label: string; color: string }> = {
  paypal:   { label: "PayPal",   color: "bg-blue-100 text-blue-700" },
  cmi:      { label: "CMI",      color: "bg-orange-100 text-orange-700" },
  virement: { label: "Virement", color: "bg-teal-100 text-teal-700" },
  cheque:   { label: "Chèque",   color: "bg-amber-100 text-amber-700" },
  card:     { label: "Carte",    color: "bg-indigo-100 text-indigo-700" },
};

const TYPE_LABELS: Record<string, string> = {
  intelligence: "Intelligence BMI 360™",
  subscription: "Abonnement",
  devis:        "Devis",
};

export function PaymentsList() {
  const token = useAuthStore((s) => s.token);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch("/api/admin/payments?limit=100", { headers })
      .then(r => r.ok ? r.json() : Promise.reject("Erreur"))
      .then(json => setPayments(Array.isArray(json) ? json : json.data ?? []))
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const paidPayments  = payments.filter(p => p.status === 'paid' || p.status === 'succeeded');
  const totalRevenue  = paidPayments.reduce((acc, p) => acc + p.amount, 0);
  const pendingCount  = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
        <p className="text-gray-500 text-sm mt-1">Historique des transactions — PayPal, CMI Maroc, Virement</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Revenus encaissés</p>
          <p className="text-2xl font-bold text-gray-900">{(totalRevenue / 100).toLocaleString("fr-MA")} MAD</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Transactions payées</p>
          <p className="text-2xl font-bold text-green-700">{paidPayments.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">En attente</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
      </div>

      {loading && <p className="text-gray-500 py-8 text-center">Chargement…</p>}
      {error && <p className="text-red-600 py-4">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["#", "Type", "Méthode", "Montant", "Statut", "Référence", "Facture", "Date"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                      Aucun paiement enregistré
                    </td>
                  </tr>
                )}
                {payments.map(p => {
                  const st     = STATUS_LABELS[p.status]        ?? { label: p.status,        color: "bg-gray-100 text-gray-600" };
                  const method = METHOD_LABELS[p.paymentMethod ?? ''] ?? { label: p.paymentMethod ?? '—', color: "bg-gray-100 text-gray-600" };
                  const refId  = p.paypalOrderId ?? p.cmiOrderId ?? (p.metadata as Record<string,string>)?.paymentRef ?? '—';

                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{p.id}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-gray-700">
                          {TYPE_LABELS[p.type] ?? p.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${method.color}`}>
                          {method.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium whitespace-nowrap">
                        {(p.amount / 100).toLocaleString("fr-MA")} {(p.currency ?? 'MAD').toUpperCase()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-400 max-w-32 truncate">
                        {refId}
                      </td>
                      <td className="px-4 py-3">
                        {p.invoiceId ? (
                          <a
                            href={`/admin/facturation`}
                            className="text-xs text-indigo-600 hover:underline"
                          >
                            FAC #{p.invoiceId}
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentsList;
