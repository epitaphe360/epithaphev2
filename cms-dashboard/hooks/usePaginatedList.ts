// ========================================
// CMS Dashboard — Hook pagination générique
// ========================================
import { useState, useEffect, useCallback, useRef } from 'react';
import { getApi } from '../lib/api';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface UsePaginatedListOptions {
  endpoint: string;          // ex: '/admin/services'
  limit?: number;
  defaultParams?: Record<string, any>;
}

export interface UsePaginatedListReturn<T> {
  items: T[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  search: string;
  filters: Record<string, any>;
  setPage: (p: number) => void;
  setSearch: (s: string) => void;
  setFilter: (key: string, value: any) => void;
  refetch: () => void;
}

export function usePaginatedList<T = any>({
  endpoint,
  limit = 20,
  defaultParams = {},
}: UsePaginatedListOptions): UsePaginatedListReturn<T> {
  const [items, setItems]     = useState<T[]>([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [page, setPage]       = useState(0);
  const [search, setSearchRaw] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>(defaultParams);
  const debounceRef           = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const api = getApi();
      const params = {
        ...filters,
        limit,
        offset: page * limit,
        ...(search ? { search } : {}),
      };
      const res = await api.get(endpoint, { params });
      const result: PaginatedResult<T> = res.data ?? res;
      setItems(result.data ?? []);
      setTotal(result.total ?? 0);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [endpoint, limit, page, search, filters]);

  useEffect(() => { fetch(); }, [fetch]);

  const setSearch = (s: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchRaw(s);
      setPage(0);
    }, 350);
  };

  const setFilter = (key: string, value: any) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(0);
  };

  return { items, total, loading, error, page, limit, search, filters, setPage, setSearch, setFilter, refetch: fetch };
}
