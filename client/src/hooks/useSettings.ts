import { useState, useEffect } from "react";

type SettingsRecord = Record<string, any>;

const cache: Record<string, { data: SettingsRecord; ts: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Récupère les paramètres publics depuis /api/settings?group=XXX
 * Retourne un objet clé/valeur avec les valeurs par défaut en fallback.
 */
export function useSettings(group: string, defaults: SettingsRecord = {}): {
  settings: SettingsRecord;
  loading: boolean;
} {
  const [settings, setSettings] = useState<SettingsRecord>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const cached = cache[group];
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      setSettings({ ...defaults, ...cached.data });
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/settings?group=${encodeURIComponent(group)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        // L'API renvoie directement { key: value, ... }
        const data: SettingsRecord = (json && typeof json === "object" && !Array.isArray(json)) ? json : {};
        if (!cancelled) {
          cache[group] = { data, ts: Date.now() };
          setSettings({ ...defaults, ...data });
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSettings(defaults);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [group]);

  return { settings, loading };
}
