/**
 * useCmsPage — charge le contenu HTML d'une page depuis la DB via /api/pages/by-slug
 * Retourne null si pas de contenu → le composant affiche son fallback JSX
 */
import { useState, useEffect } from "react";
import { sanitizeHtml } from "@/lib/sanitize";

export function useCmsPage(slug: string): string | null {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    fetch(`/api/pages/by-slug?slug=${encodeURIComponent(slug)}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!cancelled && d?.content) {
          setHtmlContent(sanitizeHtml(d.content));
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [slug]);

  return htmlContent;
}
