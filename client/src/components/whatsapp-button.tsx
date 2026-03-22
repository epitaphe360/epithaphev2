/**
 * WhatsApp Business — bouton flottant
 * Apparaît après 3 s, pulse toutes les 4 s
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const WA_NUMBER = "212600000000"; // ← Remplacer par le numéro réel sans +
const WA_MESSAGE = encodeURIComponent(
  "Bonjour Epitaphe 360 👋 Je souhaite obtenir plus d'informations sur vos services."
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  /* Apparaît après 3 s */
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  /* Auto-ouvre le tooltip après 5 s */
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setTooltipOpen(true);
      setTimeout(() => setTooltipOpen(false), 4000);
    }, 2000);
    return () => clearTimeout(timer);
  }, [visible]);

  const handleClick = () => {
    trackEvent("whatsapp_button_click", { event_category: "cta" });
    window.open(WA_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {visible && (
        <div
          className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
          style={{ pointerEvents: "none" }}
        >
          {/* Tooltip bulle */}
          <AnimatePresence>
            {tooltipOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative bg-white border border-gray-200 shadow-xl rounded-2xl py-3 px-4 max-w-[220px]"
                style={{ pointerEvents: "auto" }}
              >
                <button
                  onClick={() => setTooltipOpen(false)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-gray-400 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                <p className="text-xs font-semibold text-gray-800 leading-tight">
                  💬 Besoin d&apos;un devis rapide ?
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Discutez avec nous sur WhatsApp !
                </p>
                {/* Flèche vers le bas */}
                <div className="absolute -bottom-2 right-6 w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bouton principal */}
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={handleClick}
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
            aria-label="Contacter Epitaphe 360 sur WhatsApp"
            style={{ pointerEvents: "auto" }}
            className="relative w-14 h-14 rounded-full shadow-2xl flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2"
          >
            {/* Fond vert WhatsApp */}
            <span
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: "#25D366" }}
            />
            {/* Pulse ring */}
            <motion.span
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: "#25D366", opacity: 0.35 }}
              animate={{ scale: [1, 1.45, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Icône SVG WhatsApp officielle */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              width="28"
              height="28"
              fill="white"
              className="relative z-10"
              aria-hidden="true"
            >
              <path d="M16 0C7.163 0 0 7.163 0 16c0 2.836.74 5.5 2.035 7.819L.064 32l8.37-1.947A15.94 15.94 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.79-1.862l-.486-.29-5.009 1.165 1.188-4.881-.318-.5A13.267 13.267 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.28-9.796c-.397-.2-2.35-1.16-2.714-1.292-.364-.133-.63-.2-.894.2-.267.4-1.03 1.293-1.262 1.56-.233.267-.465.3-.862.1-.397-.2-1.676-.617-3.194-1.972-1.18-1.053-1.977-2.353-2.21-2.75-.232-.4-.025-.616.175-.815.18-.18.397-.467.596-.7.198-.234.265-.4.397-.667.133-.267.066-.5-.033-.7-.1-.2-.894-2.153-1.224-2.95-.322-.774-.648-.668-.894-.68l-.762-.013c-.265 0-.696.1-.1.06 1.5.63.133 1.5-1.99 3.47v.001z" />
            </svg>
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
}
