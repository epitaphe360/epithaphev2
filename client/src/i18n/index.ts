/**
 * CDC §5.2.3 — Internationalisation i18n (FR / EN)
 * Remplace next-intl (Next.js) par i18next + react-i18next (compatible Vite)
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import fr from "./locales/fr.json";
import en from "./locales/en.json";

// Détection de la langue stockée ou langue du navigateur
function detectLanguage(): string {
  try {
    const stored = localStorage.getItem("epitaphe_lang");
    if (stored && ["fr", "en"].includes(stored)) return stored;
  } catch { /* localStorage unavailable */ }
  try {
    const nav = navigator.language.split("-")[0];
    return ["fr", "en"].includes(nav) ? nav : "fr";
  } catch { return "fr"; }
}

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: detectLanguage(),
  fallbackLng: "fr",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;

/** Changer la langue et persister le choix */
export function changeLanguage(lang: "fr" | "en") {
  try { localStorage.setItem("epitaphe_lang", lang); } catch { /* quota exceeded */ }
  i18n.changeLanguage(lang);
  try { document.documentElement.lang = lang; } catch { /* SSR safety */ }
}
