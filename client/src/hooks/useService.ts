import { useState, useEffect } from "react";
import type { SolutionItem } from "@/data/solutionsData";

interface ServiceBlock {
  icon?: string;
  title: string;
  description?: string;
}

interface DbService {
  id: string;
  title: string;
  slug: string;
  hub: string;
  accroche?: string;
  heroImage?: string;
  heroVideo?: string;
  body?: string;
  serviceBlocks?: ServiceBlock[];
  status: string;
}

function dbServiceToSolutionItem(service: DbService): SolutionItem {
  const needs = Array.isArray(service.serviceBlocks)
    ? service.serviceBlocks.map((b) => b.title)
    : [];

  return {
    slug: service.slug,
    label: service.title,
    description: service.accroche || "",
    heroTitle: service.title,
    heroSubtitle: service.accroche || "",
    heroImage: service.heroImage || "",
    needs,
    content: service.body || "",
  };
}

interface UseServiceResult {
  data: SolutionItem;
  loading: boolean;
  fromDb: boolean;
}

export function useService(
  slug: string,
  fallback: SolutionItem
): UseServiceResult {
  const [data, setData] = useState<SolutionItem>(fallback);
  const [loading, setLoading] = useState(true);
  const [fromDb, setFromDb] = useState(false);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    fetch(`/api/services/slug/${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<DbService>;
      })
      .then((service) => {
        if (cancelled) return;
        setData(dbServiceToSolutionItem(service));
        setFromDb(true);
      })
      .catch(() => {
        // Silently fall back to hardcoded data — no visual impact
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { data, loading, fromDb };
}
