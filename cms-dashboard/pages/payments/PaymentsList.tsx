/**
 * Admin — Historique des paiements
 */
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

interface Payment {
  id: number;
  type: string;
  amount: number;
  currency: string;
  status: string;
  clientId: number | null;
  devisId: number | null;
  subscriptionId: number | null;
  stripePaymentIntentId: string | null;
  createdAt: string;
  metadata?: Record<string, string>;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:   { label: "En attente",  color: "bg-yellow-100 text-yellow-700" },
  succeeded: { label: "Réussi",      color: "bg-green-100 text-green-700" },
  failed:    { label: "Échoué",      color: "bg-red-100 text-red-700" },
  refunded:  { label: "Remboursé",   color: "bg-purple-100 text-purple-700" },
};

export function PaymentsList() {
  const token = useAuthStore((s) => s.token);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch("/api/admin/payments", { headers })
      .then(r => r.ok ? r.json() : Promise.reject("Erreur"))
      .then(setPayments)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = payments
    .filter(p => p.status === "succeeded")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
        <p className="text-gray-500 text-sm mt-1">Historique des transactions</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Revenus totaux</p>
          <p className="text-2xl font-bold text-gray-900">{(totalRevenue / 100).toLocaleString("fr-MA")} MAD</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Transactions réussies</p>
          <p className="text-2xl font-bold text-gray-900">{payments.filter(p => p.status === "succeeded").length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Total transactions</p>
          <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
        </div>
      </div>

      {loading && <p className="text-gray-500 py-8 text-center">Chargement…</p>}
      {error && <p className="text-red-600 py-4">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["#", "Type", "Montant", "Statut", "Stripe ID", "Date"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Aucun paiement enregistré</td></tr>
              )}
              {payments.map(p => {
                const st = STATUS_LABELS[p.status] ?? { label: p.status, color: "bg-gray-100 text-gray-600" };
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{p.id}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.type === "subscription" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                        {p.type === "subscription" ? "Abonnement" : "Devis"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {(p.amount / 100).toLocaleString("fr-MA")} {p.currency.toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${st.color}`}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">
                      {p.stripePaymentIntentId ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(p.createdAt).toLocaleDateString("fr-FR")}
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

export default PaymentsList;
