/**
 * useHomeSections — charge `pages.sections` depuis la DB pour slug='home'.
 * Retourne le tableau de sections OU le fallback si rien en base / requête échouée.
 */
import { useEffect, useState } from 'react';
import type { HomeSection } from '@shared/home-sections';
import { DEFAULT_HOME_SECTIONS } from '@/components/sections/default-home-sections';

export function useHomeSections(): { sections: HomeSection[]; loading: boolean; fromDB: boolean } {
  const [sections, setSections] = useState<HomeSection[]>(DEFAULT_HOME_SECTIONS);
  const [loading, setLoading] = useState(true);
  const [fromDB, setFromDB] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/pages/by-slug?slug=home')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (cancelled) return;
        if (Array.isArray(d?.sections) && d.sections.length > 0) {
          setSections(d.sections as HomeSection[]);
          setFromDB(true);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { sections, loading, fromDB };
}
