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
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
}

export function useServicePage(
  slug: string,
  fallback: ServicePageData
): UseServicePageResult {
  const [data, setData] = useState<ServicePageData>(fallback);
  const [loading, setLoading] = useState(true);
  const [fromDB, setFromDB] = useState(false);
  const [seoTitle, setSeoTitle] = useState<string | undefined>();
  const [seoDescription, setSeoDescription] = useState<string | undefined>();
  const [seoImage, setSeoImage] = useState<string | undefined>();

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
        if (!cancelled) {
          // SEO fields from DB
          if (page?.metaTitle) setSeoTitle(page.metaTitle);
          if (page?.metaDescription) setSeoDescription(page.metaDescription);
          if (page?.featuredImage) setSeoImage(page.featuredImage);
          // Content sections from DB — MERGE with fallback so missing fields stay intact
          if (page?.sections && typeof page.sections === 'object' && !Array.isArray(page.sections)) {
            const dbSections = resolveServicePageIcons(page.sections as ServicePageData);
            // Only override fields that are actually present and non-empty in DB
            const merged: ServicePageData = { ...fallback };
            const keys = Object.keys(dbSections) as Array<keyof ServicePageData>;
            for (const key of keys) {
              const val = dbSections[key];
              if (val !== null && val !== undefined && val !== '') {
                if (Array.isArray(val) && val.length === 0) continue; // skip empty arrays
                (merged as Record<string, unknown>)[key] = val;
              }
            }
            setData(merged);
            setFromDB(true);
          }
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

  return { data, loading, fromDB, seoTitle, seoDescription, seoImage };
}
