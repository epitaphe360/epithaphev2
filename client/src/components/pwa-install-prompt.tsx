/**
 * PwaInstallPrompt.tsx
 * Phase 2 — Bannière d'installation PWA
 *
 * Intercepte l'événement `beforeinstallprompt` du navigateur
 * et affiche une UI branded pour inviter l'utilisateur à installer l'app.
 *
 * Compatible Chrome, Edge, Samsung Internet (Android/Desktop)
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone, Monitor } from "lucide-react";

const DISMISS_KEY = "e360_pwa_dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow]   = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Ne pas afficher si déjà dismissed ou déjà installée (standalone)
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Délai pour ne pas agresser l'utilisateur à l'arrivée
      setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      sessionStorage.setItem(DISMISS_KEY, "1");
    }
    setShow(false);
    setDeferredPrompt(null);
  }

  function handleDismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -80 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm mx-4"
          role="dialog"
          aria-label="Installer l'application Epitaphe360"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-[#C8A96E]/20 p-4 relative overflow-hidden">
            {/* Fond gold subtle */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#C8A96E]/5 to-transparent pointer-events-none" />

            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition z-10"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 relative">
              {/* Logo / icône */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8A96E] to-[#b8965e] flex items-center justify-center shrink-0 shadow-md">
                <span className="text-white font-bold text-lg">E</span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-gray-900 text-sm">Epitaphe360</p>
                  {isMobile
                    ? <Smartphone className="w-3.5 h-3.5 text-gray-400" />
                    : <Monitor className="w-3.5 h-3.5 text-gray-400" />
                  }
                </div>
                <p className="text-xs text-gray-500 leading-tight">
                  Installez l'app pour un accès rapide à votre espace client.
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-4 relative">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition font-medium"
              >
                Plus tard
              </button>
              <button
                onClick={handleInstall}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#C8A96E] text-white text-xs font-medium hover:bg-[#b8965e] transition"
              >
                <Download className="w-3.5 h-3.5" />
                Installer
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
