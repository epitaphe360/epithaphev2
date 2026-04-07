/**
 * Espace Client — Abonnement
 * Gérez votre plan d'abonnement Epitaphe360
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, AlertCircle, Loader2, Star } from "lucide-react";
import { useLocation } from "wouter";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { PageMeta } from "@/components/seo/page-meta";
import { ClientPageHeader } from "@/components/client-page-header";

const TOKEN_KEY = "epitaphe_client_token";

interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
}

interface Subscription {
  id: number;
  planId: number;
  status: string;
  billingCycle: "monthly" | "annual";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  plan: Plan;
}

interface Devis {
  id: number;
  reference: string;
  status: string;
  total: number;
  sourceTool: string | null;
  createdAt: string;
}

async function apiGet<T>(path: string, token: string): Promise<T> {
  const res = await fetch(path, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function apiPost<T>(path: string, token: string, body?: object): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft:    { label: "Brouillon",  color: "text-gray-400" },
  sent:     { label: "Envoyé",     color: "text-blue-400" },
  viewed:   { label: "Consulté",   color: "text-yellow-400" },
  accepted: { label: "Accepté",    color: "text-green-400" },
  refused:  { label: "Refusé",     color: "text-red-400" },
  expired:  { label: "Expiré",     color: "text-gray-500" },
};

export default function AbonnementPage() {
  const [, navigate] = useLocation();
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [devisList, setDevisList] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"subscription" | "devis">("subscription");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  useEffect(() => {
    if (!token) { navigate("/espace-client"); return; }
    loadAll();
  }, [token, navigate]);

  async function loadAll() {
    try {
      setLoading(true);
      const [plansData, subData, devisData] = await Promise.allSettled([
        fetch("/api/plans").then(r => r.json()),
        apiGet<Subscription | null>("/api/client/subscription", token!),
        apiGet<Devis[]>("/api/client/devis", token!),
      ]);
      if (plansData.status === "fulfilled") setPlans(Array.isArray(plansData.value) ? plansData.value : []);
      if (subData.status === "fulfilled") setSubscription(subData.value);
      if (devisData.status === "fulfilled") setDevisList(Array.isArray(devisData.value) ? devisData.value : []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function subscribe(planId: number) {
    if (!token) return;
    setActionLoading(true);
    try {
      await apiPost("/api/client/subscription", token, { planId, billingCycle });
      await loadAll();
    } catch (e: any) {
      setError("Erreur : " + e.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function cancelSubscription() {
    if (!token) return;
    if (!window.confirm("Annuler l'abonnement à la fin de la période en cours ?")) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/client/subscription", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur annulation");
      await loadAll();
    } catch (e: any) {
      setError("Erreur : " + e.message);
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <>
      <PageMeta
        title="Mon abonnement — Epitaphe360"
        description="Gérez votre abonnement et consultez vos devis"
        noIndex
      />
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <main className="max-w-5xl mx-auto px-4 pt-28 pb-20">
          <ClientPageHeader
            title="Mon abonnement"
            subtitle="Gérez votre plan Epitaphe360 et consultez vos devis"
            breadcrumbs={[
              { label: "Tableau de bord", href: "/espace-client" },
              { label: "Abonnement" },
            ]}
          />

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-gray-200/60 rounded-xl mb-8 w-fit">
            {[
              { key: "subscription", label: "Abonnement" },
              { key: "devis", label: `Devis${devisList.length > 0 ? ` (${devisList.length})` : ""}` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-[#C8A96E] text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex items-center gap-3 text-gray-400 py-12">
              <Loader2 className="w-5 h-5 animate-spin" />
              Chargement…
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {!loading && !error && activeTab === "subscription" && (
            <div className="space-y-8">
              {/* Abonnement actif */}
              {subscription && subscription.status === "active" && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-[#C8A96E]/10 to-[#b8965e]/5 border border-[#C8A96E]/25 rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-[#C8A96E]" />
                        <span className="text-xs text-[#C8A96E] font-medium uppercase tracking-wider">Plan actif</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900">{subscription.plan.name}</h2>
                      <p className="text-gray-500 text-sm mt-1">
                        {(subscription.billingCycle === "annual"
                          ? subscription.plan.priceAnnual
                          : subscription.plan.priceMonthly) / 100
                        } MAD / {subscription.billingCycle === "annual" ? "an" : "mois"}
                      </p>
                      {subscription.currentPeriodEnd && (
                        <p className="text-gray-500 text-xs mt-2">
                          {subscription.cancelAtPeriodEnd
                            ? `Annulation prévue le ${new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-FR")}`
                            : `Renouvellement le ${new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-FR")}`}
                        </p>
                      )}
                    </div>
                    {!subscription.cancelAtPeriodEnd && (
                      <button
                        onClick={cancelSubscription}
                        disabled={actionLoading}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors border border-gray-200 hover:border-red-300 px-3 py-1.5 rounded-lg"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Sélecteur cycle de facturation */}
              {(!subscription || subscription.status !== "active") && (
                <div className="flex items-center gap-2 justify-center">
                  <span className={`text-sm ${billingCycle === "monthly" ? "text-white" : "text-gray-500"}`}>Mensuel</span>
                  <button
                    onClick={() => setBillingCycle(c => c === "monthly" ? "annual" : "monthly")}
                    className={`relative w-12 h-6 rounded-full transition-colors ${billingCycle === "annual" ? "bg-[#C8A96E]" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${billingCycle === "annual" ? "left-7" : "left-1"}`} />
                  </button>
                  <span className={`text-sm ${billingCycle === "annual" ? "text-white" : "text-gray-500"}`}>
                    Annuel <span className="text-green-400 text-xs">-15%</span>
                  </span>
                </div>
              )}

              {/* Grille des plans */}
              <div className="grid md:grid-cols-3 gap-4">
                {plans.filter(p => p.slug !== "custom").map((plan) => {
                  const isCurrent = subscription?.planId === plan.id && subscription?.status === "active";
                  const price = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;
                  const isPopular = plan.slug === "pro";
                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`relative rounded-2xl p-6 border transition-all bg-white shadow-sm hover:shadow-md${
                        isCurrent
                          ? " border-[#C8A96E]/50"
                          : isPopular
                          ? " border-[#C8A96E]/30"
                          : " border-gray-200"
                      }`}
                    >
                      {isPopular && !isCurrent && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C8A96E] text-white text-xs px-3 py-0.5 rounded-full font-medium">
                          Populaire
                        </span>
                      )}
                      {isCurrent && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C8A96E] text-white text-xs px-3 py-0.5 rounded-full font-medium">
                          Votre plan
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                      {plan.description && <p className="text-gray-500 text-xs mb-4">{plan.description}</p>}
                      <div className="mb-5">
                        <span className="text-3xl font-bold text-gray-900">{(price / 100).toLocaleString("fr-MA")}</span>
                        <span className="text-gray-400 text-sm ml-1">MAD/{billingCycle === "annual" ? "an" : "mois"}</span>
                      </div>

                      {plan.features?.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                              <Check className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}

                      <button
                        onClick={() => subscribe(plan.id)}
                        disabled={isCurrent || actionLoading}
                        className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isCurrent
                            ? "bg-gray-100 text-gray-400 cursor-default"
                            : "bg-[#C8A96E] text-white hover:bg-[#b8965e] active:scale-95"
                        }`}
                      >
                        {isCurrent ? "Plan actuel" : actionLoading ? "Traitement…" : "Choisir ce plan"}
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {plans.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <CreditCard className="w-10 h-10 mx-auto mb-3 text-[#C8A96E]/30" />
                  <p>Aucun plan disponible pour le moment.</p>
                </div>
              )}
            </div>
          )}

          {/* Onglet Devis */}
          {!loading && !error && activeTab === "devis" && (
            <div className="space-y-3">
              {devisList.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>Vous n'avez pas encore de devis.</p>
                </div>
              )}
              {devisList.map(d => {
                const st = STATUS_LABELS[d.status] ?? { label: d.status, color: "text-gray-400" };
                return (
                  <motion.a
                    key={d.id}
                    href={`/devis/${d.reference}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 hover:border-[#C8A96E]/40 hover:shadow-sm transition-all group"
                  >
                    <div>
                      <div className="font-mono text-xs text-gray-400">{d.reference}</div>
                      <div className="font-medium text-gray-900 mt-0.5">
                        {(d.total / 100).toLocaleString("fr-MA")} MAD
                      </div>
                      {d.sourceTool && <div className="text-xs text-gray-500 mt-0.5">{d.sourceTool}</div>}
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium ${st.color}`}>{st.label}</span>
                      <div className="text-xs text-gray-500 mt-1">{new Date(d.createdAt).toLocaleDateString("fr-FR")}</div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
