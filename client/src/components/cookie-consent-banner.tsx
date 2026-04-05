/**
 * CDC §5.3.4 + Annexe Legal — Bannière de consentement cookies RGPD
 * - Opt-in explicite avant activation GA4/GTM/Hotjar
 * - Mémorisation du choix (localStorage)
 * - Révocable depuis le footer
 */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Shield, ChevronDown, ChevronUp, X } from "lucide-react";

/* ── Types ────────────────────────────────────────────────── */
interface ConsentState {
  necessary: boolean;   // Toujours actif
  analytics: boolean;   // GA4, Hotjar, Clarity
  marketing: boolean;   // GTM, remarketing
  timestamp: string;
}

const STORAGE_KEY = "epitaphe_cookie_consent";
const CONSENT_VERSION = "1.0";

/* ── Helpers ──────────────────────────────────────────────── */
function getSavedConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveConsent(consent: ConsentState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
}

/** Activer/désactiver les scripts tiers en fonction du consentement */
function applyConsent(consent: ConsentState) {
  if (typeof window === "undefined") return;

  // GA4 consent mode v2
  if ((window as any).gtag) {
    (window as any).gtag("consent", "update", {
      analytics_storage:  consent.analytics ? "granted" : "denied",
      ad_storage:         consent.marketing ? "granted" : "denied",
      ad_user_data:       consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied",
    });
  }

  // Clarity
  if (!consent.analytics && (window as any).clarity) {
    (window as any).clarity("stop");
  }
}

/* ── Composant ────────────────────────────────────────────── */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = getSavedConsent();
    if (saved) {
      applyConsent(saved);
    } else {
      // Attendre 1s avant d'afficher (UX : ne pas bloquer immédiatement)
      const t = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    const consent: ConsentState = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    saveConsent(consent);
    applyConsent(consent);
    setVisible(false);
  }, []);

  const handleRejectAll = useCallback(() => {
    const consent: ConsentState = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    saveConsent(consent);
    applyConsent(consent);
    setVisible(false);
  }, []);

  const handleSavePreferences = useCallback(() => {
    const consent: ConsentState = {
      necessary: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    };
    saveConsent(consent);
    applyConsent(consent);
    setVisible(false);
  }, [analytics, marketing]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 inset-x-0 z-[200] p-4 sm:p-6"
          role="dialog"
          aria-label="Paramètres de cookies"
        >
          <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* En-tête */}
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-brand-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground">
                    Nous respectons votre vie privée
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et
                    personnaliser les contenus. Vous pouvez choisir les catégories que vous acceptez.
                  </p>
                </div>
                <button
                  onClick={handleRejectAll}
                  className="flex-shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                  aria-label="Fermer sans accepter"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Détails repliables */}
              <button
                onClick={() => setShowDetails((d) => !d)}
                className="flex items-center gap-1.5 text-xs font-medium text-brand-gold hover:underline mb-3"
              >
                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showDetails ? "Masquer les détails" : "Personnaliser mes choix"}
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pb-4 border-b border-border mb-4">
                      {/* Nécessaires — toujours actif */}
                      <label className="flex items-center justify-between gap-3 p-3 bg-muted/40 rounded-xl">
                        <div>
                          <p className="text-sm font-medium text-foreground">Cookies nécessaires</p>
                          <p className="text-xs text-muted-foreground">Essentiels au fonctionnement du site</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Shield className="w-3 h-3" /> Toujours actif
                        </div>
                      </label>

                      {/* Analytics */}
                      <label className="flex items-center justify-between gap-3 p-3 bg-muted/40 rounded-xl cursor-pointer">
                        <div>
                          <p className="text-sm font-medium text-foreground">Cookies analytiques</p>
                          <p className="text-xs text-muted-foreground">Google Analytics 4, Hotjar, Clarity</p>
                        </div>
                        <button
                          role="switch"
                          type="button"
                          aria-checked={analytics}
                          onClick={() => setAnalytics((a) => !a)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            analytics ? "bg-brand-gold" : "bg-muted-foreground/30"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              analytics ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </label>

                      {/* Marketing */}
                      <label className="flex items-center justify-between gap-3 p-3 bg-muted/40 rounded-xl cursor-pointer">
                        <div>
                          <p className="text-sm font-medium text-foreground">Cookies marketing</p>
                          <p className="text-xs text-muted-foreground">Publicités personnalisées, remarketing</p>
                        </div>
                        <button
                          role="switch"
                          type="button"
                          aria-checked={marketing}
                          onClick={() => setMarketing((m) => !m)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            marketing ? "bg-brand-gold" : "bg-muted-foreground/30"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              marketing ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-2">
                {showDetails ? (
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 px-4 py-2.5 bg-brand-gold text-white rounded-xl text-sm font-semibold hover:bg-brand-gold-dark transition-colors"
                  >
                    Enregistrer mes préférences
                  </button>
                ) : (
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 px-4 py-2.5 bg-brand-gold text-white rounded-xl text-sm font-semibold hover:bg-brand-gold-dark transition-colors"
                  >
                    Tout accepter
                  </button>
                )}
                <button
                  onClick={handleRejectAll}
                  className="flex-1 px-4 py-2.5 bg-muted text-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-colors"
                >
                  Tout refuser
                </button>
              </div>

              {/* Lien politique */}
              <p className="mt-3 text-xs text-center text-muted-foreground">
                En savoir plus dans notre{" "}
                <a href="/politique-confidentialite" className="underline underline-offset-2 hover:text-foreground">
                  politique de confidentialité
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Utilitaire pour réouvrir la bannière depuis le footer
 * Appeler: resetCookieConsent() puis recharger
 */
export function resetCookieConsent() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}
