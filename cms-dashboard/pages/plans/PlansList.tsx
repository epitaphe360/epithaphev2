/**
 * Admin — Gestion des plans d'abonnement
 */
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

export function PlansList() {
  const token = useAuthStore((s) => s.token);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Plan>>({});
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  async function fetchPlans() {
    const res = await fetch("/api/admin/plans", { headers });
    if (res.ok) setPlans(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchPlans(); }, []);

  async function saveEdit() {
    if (!editingId) return;
    const res = await fetch(`/api/admin/plans/${editingId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      setEditingId(null);
      setEditForm({});
      fetchPlans();
    } else {
      alert("Erreur lors de la sauvegarde");
    }
  }

  async function toggleActive(plan: Plan) {
    await fetch(`/api/admin/plans/${plan.id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ isActive: !plan.isActive }),
    });
    fetchPlans();
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Plans d'abonnement</h1>
        <p className="text-gray-500 text-sm mt-1">Gérez les offres d'abonnement clients</p>
      </div>

      {loading && <p className="text-gray-500 py-8 text-center">Chargement…</p>}

      <div className="grid gap-4">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl border border-gray-200 p-5">
            {editingId === plan.id ? (
              <div className="space-y-3">
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={editForm.name ?? plan.name}
                  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nom du plan"
                />
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={editForm.description ?? plan.description ?? ""}
                  onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Description"
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Prix mensuel (MAD centimes)</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={editForm.priceMonthly ?? plan.priceMonthly}
                      onChange={e => setEditForm(f => ({ ...f, priceMonthly: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Prix annuel (MAD centimes)</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={editForm.priceAnnual ?? plan.priceAnnual}
                      onChange={e => setEditForm(f => ({ ...f, priceAnnual: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="bg-black text-white px-4 py-1.5 rounded-lg text-sm">
                    Enregistrer
                  </button>
                  <button onClick={() => { setEditingId(null); setEditForm({}); }} className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-sm">
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${plan.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {plan.isActive ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  {plan.description && <p className="text-sm text-gray-500 mb-2">{plan.description}</p>}
                  <div className="flex gap-4 text-sm">
                    <span className="font-medium text-gray-900">
                      {(plan.priceMonthly / 100).toLocaleString("fr-MA")} MAD/mois
                    </span>
                    <span className="text-gray-500">
                      {(plan.priceAnnual / 100).toLocaleString("fr-MA")} MAD/an
                    </span>
                  </div>
                  {plan.features?.length > 0 && (
                    <ul className="mt-2 space-y-0.5">
                      {plan.features.map((f, i) => (
                        <li key={i} className="text-xs text-gray-500">• {f}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditingId(plan.id); setEditForm({}); }}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => toggleActive(plan)}
                    className={`text-xs hover:underline ${plan.isActive ? "text-red-500" : "text-green-600"}`}
                  >
                    {plan.isActive ? "Désactiver" : "Activer"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {!loading && plans.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <p className="text-yellow-800 font-medium mb-2">Aucun plan configuré</p>
          <p className="text-sm text-yellow-600">
            Lancez la migration <code className="bg-yellow-100 px-1 rounded">009_seed_plans.sql</code> pour créer les plans par défaut.
          </p>
        </div>
      )}
    </div>
  );
}

export default PlansList;
