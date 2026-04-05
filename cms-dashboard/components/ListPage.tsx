// ========================================
// CMS Dashboard — Composant ListPage réutilisable
// ========================================
import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, RefreshCw, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Badge } from './Badge';

export interface Column<T> {
  key:       string;
  label:     string;
  render?:   (item: T) => React.ReactNode;
  width?:    string;
}

export interface ListPageAction<T> {
  label:    string;
  icon?:    React.ReactNode | ((item: T) => React.ReactNode);
  onClick:  (item: T) => void;
  variant?: 'default' | 'danger';
  visible?: (item: T) => boolean;
}

interface ListPageProps<T> {
  title:          string;
  subtitle?:      string;
  columns:        Column<T>[];
  items:          T[];
  total:          number;
  loading:        boolean;
  error?:         string | null;
  page:           number;
  limit:          number;
  onPageChange:   (p: number) => void;
  onSearch?:      (s: string) => void;
  onAdd?:         () => void;
  addLabel?:      string;
  actions?:       ListPageAction<T>[];
  filters?:       React.ReactNode;
  emptyLabel?:    string;
  onRefresh?:     () => void;
}

export function ListPage<T extends { id: string }>({
  title, subtitle, columns, items, total, loading, error,
  page, limit, onPageChange, onSearch, onAdd, addLabel = 'Nouveau',
  actions = [], filters, emptyLabel = 'Aucun élément trouvé.', onRefresh,
}: ListPageProps<T>) {
  const [searchValue, setSearchValue] = useState('');
  const totalPages = Math.ceil(total / limit);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
          {onAdd && (
            <Button onClick={onAdd} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {addLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onSearch && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchValue}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-900 placeholder-slate-500 focus:outline-none focus:border-[#C8A96E] transition-colors text-sm"
            />
          </div>
        )}
        {filters && <div className="flex items-center gap-2">{filters}</div>}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Stats bar */}
      <div className="text-sm text-gray-500">
        {loading ? 'Chargement...' : `${total} élément${total !== 1 ? 's' : ''} au total`}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-200/50">
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-4 py-4">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-20 ml-auto" />
                      </td>
                    )}
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="px-4 py-12 text-center text-slate-500">
                    {emptyLabel}
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200/50 hover:bg-gray-100/30 transition-colors"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3.5 text-sm text-gray-600">
                        {col.render ? col.render(item) : (item as any)[col.key] ?? '—'}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          {actions
                            .filter((a) => !a.visible || a.visible(item))
                            .map((action, ai) => (
                              <button
                                key={ai}
                                onClick={() => action.onClick(item)}
                                title={action.label}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  action.variant === 'danger'
                                    ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                                    : 'text-gray-500 hover:bg-[#CBD5E1] hover:text-gray-700'
                                }`}
                              >
                                {typeof action.icon === 'function' ? (action.icon as (item: T) => React.ReactNode)(item) : action.icon}
                              </button>
                            ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page + 1} sur {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              className="p-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = totalPages <= 7 ? i : Math.max(0, Math.min(page - 3, totalPages - 7)) + i;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-[#C8A96E] text-black'
                      : 'bg-gray-100 border border-gray-300 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {p + 1}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className="p-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
