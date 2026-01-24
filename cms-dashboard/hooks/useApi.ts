// ========================================
// CMS Dashboard - Custom Hooks
// ========================================

import { useState, useEffect, useCallback } from 'react';
import { AxiosInstance, AxiosError } from 'axios';
import { getApi } from '../lib/api';

// Hook simplifié pour utiliser l'API directement
export function useApi() {
  const api = getApi();
  
  const get = async (url: string, params?: any) => {
    const response = await api.get(url, { params });
    return response.data;
  };

  const post = async (url: string, data?: any) => {
    const response = await api.post(url, data);
    return response.data;
  };

  const put = async (url: string, data?: any) => {
    const response = await api.put(url, data);
    return response.data;
  };

  const patch = async (url: string, data?: any) => {
    const response = await api.patch(url, data);
    return response.data;
  };

  const deleteApi = async (url: string) => {
    const response = await api.delete(url);
    return response.data;
  };

  return { get, post, put, patch, delete: deleteApi };
}

// Hook pour les requêtes API avec état
interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApiQuery<T>(
  fetcher: (api: AxiosInstance) => Promise<{ data: T }>,
  deps: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const api = getApi();
      const response = await fetcher(api);
      setData(response.data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// Hook pour les mutations (create, update, delete)
interface UseMutationState<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | null>;
  data: TData | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export function useMutation<TData, TVariables>(
  mutator: (api: AxiosInstance, variables: TVariables) => Promise<{ data: TData }>
): UseMutationState<TData, TVariables> {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (variables: TVariables): Promise<TData | null> => {
    setLoading(true);
    setError(null);

    try {
      const api = getApi();
      const response = await mutator(api, variables);
      setData(response.data);
      return response.data;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const errorMessage = axiosError.response?.data?.message || 'Une erreur est survenue';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { mutate, data, loading, error, reset };
}

// Hook pour la pagination
interface UsePaginationState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  totalPages: number;
  total: number;
  hasMore: boolean;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
  goToPage: (page: number) => void;
  refetch: () => Promise<void>;
}

export function usePagination<T>(
  fetcher: (api: AxiosInstance, page: number, limit: number) => Promise<{
    data: { data: T[]; pagination: { total: number; totalPages: number } };
  }>,
  limit = 10
): UsePaginationState<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const api = getApi();
      const response = await fetcher(api, page, limit);
      setItems(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotal(response.data.pagination.total);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(axiosError.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    items,
    loading,
    error,
    page,
    limit,
    totalPages,
    total,
    hasMore: page < totalPages,
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
    setPage: (p: number) => setPage(Math.max(1, Math.min(p, totalPages))),
    goToPage: (p: number) => setPage(Math.max(1, Math.min(p, totalPages))),
    refetch: fetch,
  };
}

// Hook de pagination simple (état seulement)
export function useSimplePagination(totalItems: number, limitItems: number = 10) {
  const [page, setPage] = useState(1);
  const [limit] = useState(limitItems);

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));
  const goToPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  return {
    page,
    setPage,
    limit,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    hasMore: page < totalPages
  };
}

// Hook pour le debounce
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Hook pour la confirmation
interface UseConfirmState {
  isOpen: boolean;
  message: string;
  confirm: (message: string) => Promise<boolean>;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export function useConfirm(): UseConfirmState {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);

  const confirm = (msg: string): Promise<boolean> => {
    setMessage(msg);
    setIsOpen(true);
    
    return new Promise((resolve) => {
      setResolveRef(() => resolve);
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolveRef?.(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolveRef?.(false);
  };

  return { isOpen, message, confirm, handleConfirm, handleCancel };
}

// Hook pour la gestion des médias
export function useMediaUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File): Promise<string | null> => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const api = getApi();
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      });

      return response.data.url;
    } catch (err) {
      setError('Erreur lors du téléchargement');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, progress, error };
}
