/**
 * CDC §5.2.3 — Sélecteur de langue FR/EN
 */
import { useTranslation } from "react-i18next";
import { changeLanguage } from "@/i18n";
import { Globe } from "lucide-react";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { i18n } = useTranslation();
  const current = i18n.language;

  return (
    <button
      onClick={() => changeLanguage(current === "fr" ? "en" : "fr")}
      className={`flex items-center gap-1.5 text-sm font-medium px-2.5 py-1.5 rounded-lg transition-colors hover:bg-white/10 text-white/75 hover:text-white ${className}`}
      aria-label={current === "fr" ? "Switch to English" : "Passer en français"}
      title={current === "fr" ? "English" : "Français"}
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase font-semibold text-xs">{current === "fr" ? "EN" : "FR"}</span>
    </button>
  );
}
