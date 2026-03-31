/**
 * Espace Client — Page Sécurité
 * Gestion des clés biométriques WebAuthn + préférences push
 */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, ChevronLeft, Bell, CheckCircle2, Loader2 } from "lucide-react";
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
  { id: "newsletter",        label: "Newsletter Epitaphe360",            desc: "Actualités RSE & funéraire" },
];

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
    setPushCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
    setPushSaved(false);
  };

  const savePushPrefs = async () => {
    setPushSaving(true);
    setPushError("");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) {
        setPushError("Aucun abonnement push actif. Activez d'abord les notifications via la bannière.");
        return;
      }
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
        description="Gérez vos appareils biométriques et vos préférences de notifications."
        canonicalPath="/espace-client/securite"
        noIndex
      />
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Retour */}
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
            <p className="text-muted-foreground text-sm">Appareils biométriques et préférences notifications</p>
          </div>
        </div>

        {/* Section WebAuthn */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            Appareils biométriques enregistrés
          </h2>
          <BiometricSetup />
        </section>

        {/* Section Push */}
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
                <input
                  type="checkbox"
                  checked={pushCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="w-4 h-4 rounded accent-primary"
                />
              </label>
            ))}
          </motion.div>

          {pushError && (
            <p className="text-destructive text-xs mt-3">{pushError}</p>
          )}

          <button
            onClick={savePushPrefs}
            disabled={pushSaving}
            className="mt-5 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {pushSaving
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : pushSaved
              ? <CheckCircle2 className="w-4 h-4" />
              : null}
            {pushSaved ? "Préférences sauvegardées" : "Enregistrer les préférences"}
          </button>
        </section>
      </main>
      <Footer />
    </div>
  );
}
