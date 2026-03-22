/**
 * useServicePage — hook qui charge les données d'une page de service
 * depuis la BDD via /api/pages/slug/:slug.
 *
 * Retourne les données BDD si disponibles (allows admin editing),
 * sinon retourne le fallback hardcodé passé en paramètre.
 */
import { useState, useEffect } from "react";
import type { ServicePageData } from "@/components/service-page-template";
import { resolveServicePageIcons } from "@/lib/iconMap";

interface UseServicePageResult {
  data: ServicePageData;
  loading: boolean;
  fromDB: boolean;
}

export function useServicePage(
  slug: string,
  fallback: ServicePageData
): UseServicePageResult {
  const [data, setData] = useState<ServicePageData>(fallback);
  const [loading, setLoading] = useState(true);
  const [fromDB, setFromDB] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setFromDB(false);

    async function fetchPage() {
      try {
        const res = await fetch(`/api/pages/slug/${encodeURIComponent(slug)}`);
        if (!res.ok) {
          // Page not in DB yet → use fallback silently
          return;
        }
        const page = await res.json();
        if (!cancelled && page?.sections && typeof page.sections === 'object' && !Array.isArray(page.sections)) {
          setData(resolveServicePageIcons(page.sections as ServicePageData));
          setFromDB(true);
        }
      } catch {
        // Network error or BDD unavailable → use hardcoded fallback silently
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPage();
    return () => { cancelled = true; };
  }, [slug]);

  return { data, loading, fromDB };
}
