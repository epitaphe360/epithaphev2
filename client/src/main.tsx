import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeApi } from "../../cms-dashboard/lib/api";

// Initialize API Client
initializeApi({
  baseURL: "/api",
  onUnauthorized: () => {
    // Redirect to login if needed, or handle session expiry
    if (!window.location.pathname.includes('/admin/login')) {
      window.location.href = '/admin/login';
    }
  }
});

createRoot(document.getElementById("root")!).render(<App />);

// ── Enregistrement Service Worker (PWA) — production uniquement ──────────────
// En dev, le SW Cache-First sur les scripts crée une double instance React
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("[SW] Enregistré :", reg.scope))
      .catch((err) => console.warn("[SW] Échec d'enregistrement :", err));
  });
} else if ("serviceWorker" in navigator && import.meta.env.DEV) {
  // Désinscrire tout SW actif en dev pour éviter les caches périmés
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  });
}
