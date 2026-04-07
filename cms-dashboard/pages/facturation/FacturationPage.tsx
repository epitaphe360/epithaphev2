/**
 * Module Facturation — CMS Dashboard Epitaphe 360
 * Gestion complète des factures avec TVA 20% (Maroc)
 *
 * Fonctionnalités :
 * - Liste paginée + filtres (statut, outil, recherche)
 * - Téléchargement PDF par facture
 * - Changement de statut (draft → sent → paid)
 * - Statistiques : HT, TVA, TTC (global + mois courant)
 * - Tableau de bord financier
 */

import React, { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '../../lib/toast';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Invoice {
  id:            number;
  invoiceNumber: string;
  clientEmail:   string;
  clientName:    string;
  clientCompany?: string;
  toolId?:        string;
  description?:   string;
  amountHT:      number;
  tvaRate:        number;
  amountTVA:     number;
  amountTTC:     number;
  currency:       string;
  status:         'draft' | 'sent' | 'paid' | 'cancelled';
  issuedAt?:      string;
  paidAt?:        string;
  sentAt?:        string;
  createdAt:      string;
}

interface InvoiceStats {
  total:    number;
  paid:     number;
  pending:  number;
  totalHT:  number;
  totalTVA: number;
  totalTTC: number;
  monthHT:  number;
  monthTVA: number;
  monthTTC: number;
  currency: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem('cms_token') ?? '';
  return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
};

function fmtMAD(centimes: number, currency = 'MAD'): string {
  return (centimes / 100).toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + currency;
}

function fmtDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  try {
    return format(new Date(dateStr), 'dd MMM yyyy', { locale: fr });
  } catch {
    return '—';
  }
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft:     { label: 'Brouillon',  color: 'bg-gray-100 text-gray-600' },
  sent:      { label: 'Envoyée',    color: 'bg-blue-100 text-blue-700' },
  paid:      { label: 'Payée',      color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Annulée',    color: 'bg-red-100 text-red-700' },
};

const TOOL_LABELS: Record<string, string> = {
  commpulse:   'CommPulse',
  talentprint: 'TalentPrint',
  impacttrace: 'ImpacTrace',
  safesignal:  'SafeSignal',
  eventimpact: 'EventImpact',
  spacescore:  'SpaceScore',
  finnarrative:'FinNarrative',
};

// ─── Carte statistique ─────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className={`rounded-xl border p-4 ${color ?? 'bg-white'}`}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Badge statut ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const { label, color } = STATUS_LABELS[status] ?? { label: status, color: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}

// ─── Page principale ────────────────────────────────────────────────────────────

export function FacturationPage() {
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState('');
  const [toolFilter,   setToolFilter]   = useState('');
  const [search,       setSearch]       = useState('');
  const [page,         setPage]         = useState(1);
  const PAGE_SIZE = 25;

  // ── Fetch stats ──────────────────────────────────────────────────────────────
  const { data: stats } = useQuery<InvoiceStats>({
    queryKey: ['invoices-stats'],
    queryFn:  async () => {
      const res = await fetch('/api/admin/invoices/stats', { headers: authHeaders() });
      if (!res.ok) throw new Error('Erreur stats');
      return res.json();
    },
  });

  // ── Fetch liste ──────────────────────────────────────────────────────────────
  const { data, isLoading } = useQuery<{ data: Invoice[]; total: number }>({
    queryKey: ['invoices', statusFilter, toolFilter, search, page],
    queryFn:  async () => {
      const params = new URLSearchParams({
        limit:  String(PAGE_SIZE),
        offset: String((page - 1) * PAGE_SIZE),
      });
      if (statusFilter) params.set('status', statusFilter);
      if (toolFilter)   params.set('toolId', toolFilter);
      const res = await fetch(`/api/admin/invoices?${params}`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Erreur chargement');
      return res.json();
    },
  });

  // ── Mutation : changement statut ─────────────────────────────────────────────
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/admin/invoices/${id}/status`, {
        method:  'PATCH',
        headers: authHeaders(),
        body:    JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Erreur mise à jour');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoices-stats'] });
    },
  });

  // ── Télécharger PDF ──────────────────────────────────────────────────────────
  const downloadPDF = useCallback(async (invoice: Invoice) => {
    const token = localStorage.getItem('cms_token') ?? '';
    const res = await fetch(`/api/admin/invoices/${invoice.id}/pdf`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) { toast.warning('PDF non disponible'); return; }
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `facture-${invoice.invoiceNumber}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const invoiceList = (data?.data ?? []).filter(inv =>
    !search || [inv.clientName, inv.clientEmail, inv.invoiceNumber, inv.clientCompany]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE);

  return (
    <div className="space-y-6 p-6">
      {/* Titre */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Facturation</h1>
          <p className="text-sm text-gray-500 mt-1">
            Factures générées automatiquement avec TVA 20% (Maroc)
          </p>
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total facturé (TTC)"
            value={fmtMAD(stats.totalTTC, stats.currency)}
            sub={`HT : ${fmtMAD(stats.totalHT, stats.currency)}`}
            color="bg-indigo-50 border-indigo-200"
          />
          <StatCard
            label="TVA collectée"
            value={fmtMAD(stats.totalTVA, stats.currency)}
            sub="TVA 20% Maroc"
            color="bg-purple-50 border-purple-200"
          />
          <StatCard
            label="Ce mois (TTC)"
            value={fmtMAD(stats.monthTTC, stats.currency)}
            sub={`HT : ${fmtMAD(stats.monthHT, stats.currency)}`}
            color="bg-green-50 border-green-200"
          />
          <div className="grid grid-rows-2 gap-2">
            <StatCard label="Factures payées"   value={String(stats.paid)}    />
            <StatCard label="En attente"         value={String(stats.pending)} />
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="search"
          placeholder="Rechercher (client, email, N° facture…)"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="sent">Envoyée</option>
          <option value="paid">Payée</option>
          <option value="cancelled">Annulée</option>
        </select>
        <select
          value={toolFilter}
          onChange={e => { setToolFilter(e.target.value); setPage(1); }}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Tous les outils</option>
          {Object.entries(TOOL_LABELS).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
        {(statusFilter || toolFilter || search) && (
          <button
            onClick={() => { setStatusFilter(''); setToolFilter(''); setSearch(''); setPage(1); }}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">N° Facture</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Client</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Outil</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">HT</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">TVA 20%</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">TTC</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Statut</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Date</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">
                    Chargement…
                  </td>
                </tr>
              ) : invoiceList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">
                    Aucune facture trouvée
                  </td>
                </tr>
              ) : (
                invoiceList.map(inv => (
                  <tr key={inv.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-indigo-700">
                      {inv.invoiceNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{inv.clientName}</div>
                      <div className="text-xs text-gray-500">{inv.clientEmail}</div>
                      {inv.clientCompany && (
                        <div className="text-xs text-gray-400">{inv.clientCompany}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {inv.toolId ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-medium">
                          {TOOL_LABELS[inv.toolId] ?? inv.toolId}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      {fmtMAD(inv.amountHT, '')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm text-purple-600">
                      {fmtMAD(inv.amountTVA, '')}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-bold">
                      {fmtMAD(inv.amountTTC, inv.currency)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {fmtDate(inv.issuedAt ?? inv.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {/* Télécharger PDF */}
                        <button
                          onClick={() => downloadPDF(inv)}
                          title="Télécharger PDF"
                          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>

                        {/* Marquer comme payée */}
                        {inv.status === 'sent' && (
                          <button
                            onClick={() => updateStatus.mutate({ id: inv.id, status: 'paid' })}
                            title="Marquer comme payée"
                            className="p-1.5 rounded hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}

                        {/* Annuler */}
                        {(inv.status === 'draft' || inv.status === 'sent') && (
                          <button
                            onClick={() => {
                              if (window.confirm('Annuler cette facture ?')) {
                                updateStatus.mutate({ id: inv.id, status: 'cancelled' });
                              }
                            }}
                            title="Annuler la facture"
                            className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <span className="text-sm text-gray-500">
              {data?.total ?? 0} facture{(data?.total ?? 0) > 1 ? 's' : ''} au total
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border rounded hover:bg-white disabled:opacity-40 transition-colors"
              >
                ← Précédent
              </button>
              <span className="px-3 py-1.5 text-sm text-gray-600">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm border rounded hover:bg-white disabled:opacity-40 transition-colors"
              >
                Suivant →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Information TVA */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>Note fiscale :</strong> Toutes les factures appliquent la TVA à 20% conformément à la
        législation fiscale marocaine. Les montants sont exprimés en Dirham Marocain (MAD).
      </div>
    </div>
  );
}

export default FacturationPage;
