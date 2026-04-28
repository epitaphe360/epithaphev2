/**
 * PushPermissionBanner.tsx
 * Phase 2 — Composant opt-in RGPD pour les push notifications
 *
 * S'affiche uniquement si :
 *   - Le navigateur supporte les push notifications
 *   - L'utilisateur n'a pas encore pris de décision
 *
 * Catégories activées par défaut : ["project_update", "event_invitation"]
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCircle2, BellOff } from "lucide-react";

const PUSH_PREF_KEY = "e360_push_decision"; // "accepted" | "declined"

type PushDecision = "accepted" | "declined" | null;

function urlBase64ToUint8Array(b64: string): Uint8Array {
  const padding = "=".repeat((4 - (b64.length % 4)) % 4);
  const base64 = (b64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return new Uint8Array(Array.from(raw).map((c) => c.charCodeAt(0)));
}

export function PushPermissionBanner() {
  const [show, setShow]     = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [vapidKey, setVapidKey] = useState<string | null>(null);

  useEffect(() => {
    // Vérifications préalables
    if (!("Notification" in window)) return;
    if (!("serviceWorker" in navigator)) return;
    if (!("PushManager" in window)) return;

    const decision: PushDecision = localStorage.getItem(PUSH_PREF_KEY) as PushDecision;
    if (decision) return; // déjà décidé

    if (Notification.permission === "granted") {
      localStorage.setItem(PUSH_PREF_KEY, "accepted");
      return;
    }
    if (Notification.permission === "denied") {
      localStorage.setItem(PUSH_PREF_KEY, "declined");
      return;
    }

    // Récupérer la clé VAPID
    fetch("/api/push/vapid-public-key")
      .then(async (r) => {
        if (!r.ok) return null; // 503 → push non configuré
        const d = await r.json();
        return d?.publicKey ?? null;
      })
      .then((key) => {
        if (!key) return; // pas de clé → on n'affiche pas le banner
        setVapidKey(key);
        setShow(true);
      })
      .catch(() => {}); // Push non configuré, on ignore
  }, []);

  async function handleAccept() {
    if (!vapidKey) return;
    setStatus("loading");

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("error");
        localStorage.setItem(PUSH_PREF_KEY, "declined");
        setTimeout(() => setShow(false), 2000);
        return;
      }

      const sw = await navigator.serviceWorker.ready;
      const subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const subJson = subscription.toJSON();
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(localStorage.getItem("epitaphe_client_token")
            ? { Authorization: `Bearer ${localStorage.getItem("epitaphe_client_token")}` }
            : {}),
        },
        body: JSON.stringify({
          endpoint:   subJson.endpoint,
          keys:       subJson.keys,
          categories: ["project_update", "event_invitation"],
        }),
      });

      localStorage.setItem(PUSH_PREF_KEY, "accepted");
      setStatus("success");
      setTimeout(() => setShow(false), 2500);
    } catch (err) {
      console.error("[push] Abonnement échoué :", err);
      setStatus("error");
      localStorage.setItem(PUSH_PREF_KEY, "declined");
      setTimeout(() => setShow(false), 2000);
    }
  }

  function handleDecline() {
    localStorage.setItem(PUSH_PREF_KEY, "declined");
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md mx-4"
          role="dialog"
          aria-label="Activer les notifications"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 relative">
            {/* Bouton fermer */}
            <button
              onClick={handleDecline}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition"
              aria-label="Ignorer"
            >
              <X className="w-4 h-4" />
            </button>

            {status === "success" ? (
              <div className="flex items-center gap-3 text-emerald-600">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <p className="font-medium">Notifications activées ! Merci.</p>
              </div>
            ) : status === "error" ? (
              <div className="flex items-center gap-3 text-red-500">
                <BellOff className="w-6 h-6 shrink-0" />
                <p className="font-medium">Activation impossible (accès refusé).</p>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-2.5 bg-[#C8A96E]/10 rounded-xl shrink-0">
                    <Bell className="w-5 h-5 text-[#C8A96E]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Restez informé</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Recevez des alertes pour vos projets, nouveaux événements et études de cas.
                      Vous pouvez vous désabonner à tout moment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleDecline}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition font-medium"
                  >
                    Pas maintenant
                  </button>
                  <button
                    onClick={handleAccept}
                    disabled={status === "loading"}
                    className="flex-1 py-2.5 rounded-xl bg-[#C8A96E] text-white text-sm font-medium hover:bg-[#b8965e] transition disabled:opacity-60"
                  >
                    {status === "loading" ? "Activation…" : "Activer"}
                  </button>
                </div>

                <p className="text-[10px] text-gray-300 mt-3 text-center">
                  Conforme au RGPD · Révocable dans vos paramètres
                </p>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

