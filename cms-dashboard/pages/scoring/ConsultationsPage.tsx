/**
 * ConsultationsPage — Admin BMI 360™
 * Gestion des demandes de RDV expert (phase Transform)
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Phone, Mail, Building2, MessageSquare, Check, Clock, X, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { useToast } from '../../components/Toast';

interface Consultation {
  id: string;
  scoringResultId: string | null;
  toolId: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  companyName: string | null;
  jobTitle: string | null;
  companySize: string | null;
  message: string | null;
  preferredSlot: string | null;
  preferredChannel: string;
  status: string;
  scheduledAt: string | null;
  expertNotes: string | null;
  source: string;
  createdAt: string;
}

const STATUS_LABELS: Record<string, string> = {
  new:        'Nouveau',
  contacted:  'Contacté',
  scheduled:  'Planifié',
  done:       'Terminé',
  cancelled:  'Annulé',
};

const STATUS_COLORS: Record<string, string> = {
  new:        'bg-blue-100 text-blue-700',
  contacted:  'bg-yellow-100 text-yellow-700',
  scheduled:  'bg-purple-100 text-purple-700',
  done:       'bg-green-100 text-green-700',
  cancelled:  'bg-gray-100 text-gray-500',
};

const TOOL_LABELS: Record<string, string> = {
  commpulse:    'CommPulse™',
  talentprint:  'TalentPrint™',
  impacttrace:  'ImpactTrace™',
  safesignal:   'SafeSignal™',
  eventimpact:  'EventImpact™',
  spacescore:   'SpaceScore™',
  finnarrative: 'FinNarrative™',
};

const CHANNEL_ICONS: Record<string, string> = {
  visio:        '🎥',
  telephone:    '📞',
  presentiel:   '🏢',
};

export function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected]   = useState<Consultation | null>(null);
  const [notes, setNotes]         = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [saving, setSaving]       = useState(false);
  const toast = useToast();

  const token = localStorage.getItem('cms_token');
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/consultations', { headers });
      if (!res.ok) throw new Error('Erreur chargement');
      const data = await res.json() as Consultation[];
      setConsultations(data);
    } catch {
      toast.error('Impossible de charger les consultations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const patch = async (id: string, patch: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/consultations/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error('Erreur mise à jour');
      const updated = await res.json() as Consultation;
      setConsultations(prev => prev.map(c => c.id === id ? updated : c));
      if (selected?.id === id) setSelected(updated);
      toast.success('Consultation mise à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const filtered = filterStatus
    ? consultations.filter(c => c.status === filterStatus)
    : consultations;

  const counts = consultations.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultations Expert</h1>
          <p className="text-sm text-gray-500 mt-1">Demandes de RDV BMI 360™ — Phase Transform</p>
        </div>
        <Button variant="outline" onClick={load} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </Button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {['new', 'contacted', 'scheduled', 'done', 'cancelled'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
            className={`text-left p-3 rounded-xl border transition-all ${filterStatus === s ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
          >
            <div className="text-2xl font-bold text-gray-900">{counts[s] ?? 0}</div>
            <div className="text-xs text-gray-500 mt-0.5">{STATUS_LABELS[s]}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste */}
        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Chargement…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Aucune consultation{filterStatus ? ` (${STATUS_LABELS[filterStatus]})` : ''}</div>
          ) : (
            filtered.map(c => (
              <button
                key={c.id}
                onClick={() => { setSelected(c); setNotes(c.expertNotes ?? ''); setScheduledAt(c.scheduledAt ? c.scheduledAt.slice(0, 16) : ''); }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${selected?.id === c.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{c.contactName}</div>
                    <div className="text-xs text-gray-500 truncate">{c.companyName ?? c.contactEmail}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[c.status] ?? STATUS_COLORS.new}`}>
                      {STATUS_LABELS[c.status] ?? c.status}
                    </span>
                    {c.toolId && (
                      <span className="text-xs text-gray-400">{TOOL_LABELS[c.toolId] ?? c.toolId}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>{CHANNEL_ICONS[c.preferredChannel] ?? '📅'} {c.preferredChannel}</span>
                  {c.preferredSlot && <span>· {c.preferredSlot}</span>}
                  <span>· {new Date(c.createdAt).toLocaleDateString('fr-MA')}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Détail / actions */}
        {selected ? (
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selected.contactName}</h2>
                  {selected.jobTitle && <p className="text-sm text-gray-500">{selected.jobTitle}</p>}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[selected.status] ?? STATUS_COLORS.new}`}>
                  {STATUS_LABELS[selected.status] ?? selected.status}
                </span>
              </div>

              {/* Infos contact */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <a href={`mailto:${selected.contactEmail}`} className="hover:text-pink-600 truncate">{selected.contactEmail}</a>
                </div>
                {selected.contactPhone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <a href={`tel:${selected.contactPhone}`} className="hover:text-pink-600">{selected.contactPhone}</a>
                  </div>
                )}
                {selected.companyName && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{selected.companyName}{selected.companySize ? ` (${selected.companySize})` : ''}</span>
                  </div>
                )}
                {selected.toolId && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-gray-400 text-xs">Outil :</span>
                    <span className="font-medium">{TOOL_LABELS[selected.toolId] ?? selected.toolId}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span>{CHANNEL_ICONS[selected.preferredChannel] ?? ''} {selected.preferredChannel} · {selected.preferredSlot ?? 'Flexible'}</span>
                </div>
              </div>

              {/* Message */}
              {selected.message && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1.5">
                    <MessageSquare className="w-3.5 h-3.5" /> Message
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.message}</p>
                </div>
              )}

              {/* Planification */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">Date/heure RDV</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30"
                />
              </div>

              {/* Notes expert */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">Notes expert</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Compte-rendu, actions, suivi…"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30 resize-none"
                />
              </div>

              {/* Actions statut */}
              <div className="flex flex-wrap gap-2">
                {['contacted', 'scheduled', 'done', 'cancelled'].map(s => (
                  <button
                    key={s}
                    disabled={saving || selected.status === s}
                    onClick={() => patch(selected.id, {
                      status: s,
                      ...(scheduledAt ? { scheduledAt: new Date(scheduledAt).toISOString() } : {}),
                      expertNotes: notes,
                    })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40 ${STATUS_COLORS[s] ?? 'bg-gray-100 text-gray-600'} hover:opacity-80`}
                  >
                    {s === 'done' ? <Check className="w-3.5 h-3.5" /> : s === 'cancelled' ? <X className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {STATUS_LABELS[s]}
                  </button>
                ))}
                <button
                  disabled={saving}
                  onClick={() => patch(selected.id, {
                    expertNotes: notes,
                    ...(scheduledAt ? { scheduledAt: new Date(scheduledAt).toISOString() } : {}),
                  })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-pink-100 text-pink-700 hover:bg-pink-200 transition-all disabled:opacity-40"
                >
                  Sauvegarder notes
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Sélectionnez une consultation pour voir les détails
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsultationsPage;
