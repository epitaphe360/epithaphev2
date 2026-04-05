/**
 * ClientProjectsAdmin — Gestion complète des projets espace client
 * CRUD projet + jalons + documents depuis le tableau de bord agence
 */
import React, { useState, useEffect } from 'react';
import {
  FolderOpen, Plus, Pencil, Trash2, ChevronDown, ChevronRight,
  CheckCircle2, Clock, Pause, XCircle, Flag, FileText, Upload, X,
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Card, CardContent } from '../../components/Card';
import { Input, Textarea, Select } from '../../components/Input';
import { useToast } from '../../components/Toast';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Milestone { id: number; label: string; dueDate: string; status: string; order: number }
interface Document  { id: number; name: string; fileType: string; fileSize: string; url: string; uploadedAt: string }
interface Project {
  id: number; clientId: number; title: string; type: string; status: string;
  progress: number; managerName: string; managerEmail: string;
  startDate: string | null; endDate: string | null; description: string;
  createdAt: string;
  milestones?: Milestone[];
  documents?: Document[];
}
interface Client { id: number; name: string; company: string | null; email: string }

const STATUS_OPTS = [
  { value: 'en_cours',  label: '🟢 En cours'   },
  { value: 'en_attente', label: '🟡 En attente' },
  { value: 'termine',  label: '✅ Terminé'     },
  { value: 'en_pause', label: '⏸️ En pause'    },
];
const MILESTONE_STATUS = [
  { value: 'done',    label: '✅ Fait'    },
  { value: 'active',  label: '🔵 En cours' },
  { value: 'pending', label: '⏳ À venir'  },
];

function statusBadge(s: string) {
  const map: Record<string, string> = {
    en_cours: 'bg-green-500/20 text-green-300',
    en_attente: 'bg-yellow-500/20 text-yellow-300',
    termine: 'bg-slate-500/20 text-slate-300',
    en_pause: 'bg-orange-500/20 text-orange-300',
  };
  const label: Record<string, string> = { en_cours: 'En cours', en_attente: 'En attente', termine: 'Terminé', en_pause: 'En pause' };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[s] ?? 'bg-slate-600 text-slate-300'}`}>{label[s] ?? s}</span>;
}

const emptyProject = (): Partial<Project> => ({
  title: '', type: 'Projet', status: 'en_cours', progress: 0,
  managerName: '', managerEmail: '', description: '', startDate: null, endDate: null,
});

export function ClientProjectsAdmin() {
  const [projects, setProjects]   = useState<Project[]>([]);
  const [clients, setClients]     = useState<Client[]>([]);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);
  const [expanded, setExpanded]   = useState<number | null>(null);
  const [expandedData, setExpandedData] = useState<{ milestones: Milestone[]; documents: Document[] } | null>(null);

  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState<Project | null>(null);
  const [form, setForm]           = useState<Partial<Project> & { clientId?: number }>(emptyProject());

  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({ label: '', dueDate: '', status: 'pending', order: 0 });
  const [milestoneProjectId, setMilestoneProjectId] = useState<number | null>(null);

  const [showDoc, setShowDoc]     = useState(false);
  const [docForm, setDocForm]     = useState({ name: '', fileType: 'PDF', fileSize: '', url: '' });
  const [docProjectId, setDocProjectId] = useState<number | null>(null);

  const [filterClient, setFilterClient]   = useState('');
  const [filterStatus, setFilterStatus]   = useState('');
  const [page, setPage] = useState(0);
  const LIMIT = 15;

  const toast = useToast();
  const token = localStorage.getItem('cms_token');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => { loadClients(); }, []);
  useEffect(() => { loadProjects(); }, [filterClient, filterStatus, page]);

  const loadClients = async () => {
    try {
      const res = await fetch('/api/admin/clients', { headers });
      if (res.ok) { const j = await res.json(); setClients(j.data ?? j); }
    } catch { /* ignore */ }
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: String(LIMIT), offset: String(page * LIMIT) });
      if (filterClient) params.set('clientId', filterClient);
      if (filterStatus) params.set('status', filterStatus);
      const res = await fetch(`/api/admin/client-projects?${params}`, { headers });
      if (res.ok) { const j = await res.json(); setProjects(j.data ?? []); setTotal(j.total ?? 0); }
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  const toggleExpand = async (id: number) => {
    if (expanded === id) { setExpanded(null); setExpandedData(null); return; }
    setExpanded(id);
    try {
      const res = await fetch(`/api/admin/client-projects/${id}`, { headers });
      if (res.ok) { const j = await res.json(); setExpandedData({ milestones: j.milestones ?? [], documents: j.documents ?? [] }); }
    } catch { /* ignore */ }
  };

  const saveProject = async () => {
    try {
      const url = editing ? `/api/admin/client-projects/${editing.id}` : '/api/admin/client-projects';
      const method = editing ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? 'Erreur'); }
      toast.success('Sauvegardé', editing ? 'Projet mis à jour' : 'Projet créé');
      setShowForm(false); setEditing(null); loadProjects();
    } catch (e: any) { toast.error('Erreur', e.message); }
  };

  const deleteProject = async (id: number) => {
    if (!confirm('Supprimer ce projet et tous ses jalons/documents ?')) return;
    await fetch(`/api/admin/client-projects/${id}`, { method: 'DELETE', headers });
    toast.success('Supprimé', 'Projet supprimé'); loadProjects();
  };

  const saveMilestone = async () => {
    if (!milestoneProjectId) return;
    try {
      await fetch(`/api/admin/client-projects/${milestoneProjectId}/milestones`, {
        method: 'POST', headers, body: JSON.stringify(milestoneForm),
      });
      toast.success('Jalon ajouté', ''); setShowMilestone(false);
      toggleExpand(milestoneProjectId);
    } catch { toast.error('Erreur', 'Impossible d\'ajouter le jalon'); }
  };

  const updateMilestoneStatus = async (projectId: number, mid: number, status: string) => {
    await fetch(`/api/admin/client-projects/${projectId}/milestones/${mid}`, {
      method: 'PUT', headers, body: JSON.stringify({ status }),
    });
    toggleExpand(projectId);
  };

  const deleteMilestone = async (projectId: number, mid: number) => {
    await fetch(`/api/admin/client-projects/${projectId}/milestones/${mid}`, { method: 'DELETE', headers });
    toggleExpand(projectId);
  };

  const saveDoc = async () => {
    if (!docProjectId) return;
    try {
      await fetch(`/api/admin/client-projects/${docProjectId}/documents`, {
        method: 'POST', headers, body: JSON.stringify(docForm),
      });
      toast.success('Document ajouté', ''); setShowDoc(false);
      toggleExpand(docProjectId);
    } catch { toast.error('Erreur', 'Impossible d\'ajouter le document'); }
  };

  const deleteDoc = async (projectId: number, did: number) => {
    await fetch(`/api/admin/client-projects/${projectId}/documents/${did}`, { method: 'DELETE', headers });
    toggleExpand(projectId);
  };

  const clientName = (id: number) => {
    const c = clients.find(c => c.id === id);
    return c ? `${c.name}${c.company ? ` — ${c.company}` : ''}` : `Client #${id}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-blue-400" />
            Projets Espace Client
          </h1>
          <p className="text-slate-400 text-sm mt-1">{total} projet{total !== 1 ? 's' : ''} au total</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyProject()); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Nouveau projet
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex gap-3 flex-wrap">
        <select value={filterClient} onChange={e => { setFilterClient(e.target.value); setPage(0); }}
          className="bg-[#1E293B] text-white border border-slate-600 rounded-lg px-3 py-2 text-sm">
          <option value="">Tous les clients</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ''}</option>)}
        </select>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(0); }}
          className="bg-[#1E293B] text-white border border-slate-600 rounded-lg px-3 py-2 text-sm">
          <option value="">Tous les statuts</option>
          {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {loading ? (
          <Card><CardContent className="py-12 text-center text-slate-500">Chargement…</CardContent></Card>
        ) : projects.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-slate-500">Aucun projet</CardContent></Card>
        ) : projects.map(p => (
          <Card key={p.id}>
            <div className="p-4">
              {/* Row header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button onClick={() => toggleExpand(p.id)} className="text-slate-400 hover:text-white transition-colors flex-shrink-0">
                    {expanded === p.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{p.title}</p>
                    <p className="text-xs text-slate-400">{clientName(p.clientId)} · {p.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Progress */}
                  <div className="hidden md:flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs text-slate-400">{p.progress}%</span>
                  </div>
                  {statusBadge(p.status)}
                  <button onClick={() => { setEditing(p); setForm({ ...p }); setShowForm(true); }}
                    className="text-slate-400 hover:text-white p-1"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => deleteProject(p.id)} className="text-slate-400 hover:text-red-400 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Manager + dates */}
              {(p.managerName || p.startDate) && (
                <div className="mt-2 ml-7 flex gap-4 text-xs text-slate-500">
                  {p.managerName && <span>Chef de projet : {p.managerName}</span>}
                  {p.startDate && <span>Début : {new Date(p.startDate).toLocaleDateString('fr-MA')}</span>}
                  {p.endDate && <span>Fin : {new Date(p.endDate).toLocaleDateString('fr-MA')}</span>}
                </div>
              )}
            </div>

            {/* Expanded: milestones + docs */}
            {expanded === p.id && expandedData && (
              <div className="border-t border-slate-700 p-4 space-y-5 bg-slate-900/30">
                {/* Jalons */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Flag className="w-4 h-4 text-blue-400" /> Jalons ({expandedData.milestones.length})
                    </h4>
                    <button onClick={() => { setMilestoneProjectId(p.id); setMilestoneForm({ label: '', dueDate: '', status: 'pending', order: 0 }); setShowMilestone(true); }}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300">
                      <Plus className="w-3 h-3" /> Ajouter
                    </button>
                  </div>
                  {expandedData.milestones.length === 0 ? (
                    <p className="text-xs text-slate-500">Aucun jalon</p>
                  ) : (
                    <div className="space-y-2">
                      {expandedData.milestones.map(m => (
                        <div key={m.id} className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-3 py-2">
                          <select value={m.status} onChange={e => updateMilestoneStatus(p.id, m.id, e.target.value)}
                            className="bg-transparent text-xs text-slate-300 border border-slate-600 rounded px-1 py-0.5">
                            {MILESTONE_STATUS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                          <span className="text-sm text-white flex-1">{m.label}</span>
                          {m.dueDate && <span className="text-xs text-slate-400">{m.dueDate}</span>}
                          <button onClick={() => deleteMilestone(p.id, m.id)} className="text-slate-500 hover:text-red-400">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Documents */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-400" /> Documents ({expandedData.documents.length})
                    </h4>
                    <button onClick={() => { setDocProjectId(p.id); setDocForm({ name: '', fileType: 'PDF', fileSize: '', url: '' }); setShowDoc(true); }}
                      className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300">
                      <Plus className="w-3 h-3" /> Ajouter
                    </button>
                  </div>
                  {expandedData.documents.length === 0 ? (
                    <p className="text-xs text-slate-500">Aucun document</p>
                  ) : (
                    <div className="space-y-2">
                      {expandedData.documents.map(d => (
                        <div key={d.id} className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-3 py-2">
                          <span className="text-xs font-bold text-slate-400 w-10">{d.fileType}</span>
                          <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-300 hover:underline flex-1 truncate">{d.name}</a>
                          {d.fileSize && <span className="text-xs text-slate-500">{d.fileSize}</span>}
                          <button onClick={() => deleteDoc(p.id, d.id)} className="text-slate-500 hover:text-red-400">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {total > LIMIT && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">{page * LIMIT + 1}–{Math.min((page + 1) * LIMIT, total)} sur {total}</p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setPage(p => p - 1)} disabled={page === 0}>Précédent</Button>
            <Button variant="secondary" onClick={() => setPage(p => p + 1)} disabled={(page + 1) * LIMIT >= total}>Suivant</Button>
          </div>
        </div>
      )}

      {/* ─── Modal Projet ─────────────────────────────────────────────── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-[#0F1928] border border-slate-700 rounded-2xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-700">
              <h2 className="text-lg font-bold text-white">{editing ? 'Modifier le projet' : 'Nouveau projet'}</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Client *</label>
                <select value={form.clientId ?? ''} onChange={e => setForm(f => ({ ...f, clientId: parseInt(e.target.value) }))}
                  className="w-full bg-[#1E293B] text-white border border-slate-600 rounded-lg px-3 py-2 text-sm">
                  <option value="">Choisir un client…</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ''}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Titre du projet *</label>
                <Input value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="ex: Convention Annuelle 2026" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Type</label>
                  <Input value={form.type ?? ''} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} placeholder="Événement, Stand…" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Statut</label>
                  <select value={form.status ?? 'en_cours'} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full bg-[#1E293B] text-white border border-slate-600 rounded-lg px-3 py-2 text-sm">
                    {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Avancement ({form.progress ?? 0}%)</label>
                <input type="range" min={0} max={100} value={form.progress ?? 0}
                  onChange={e => setForm(f => ({ ...f, progress: parseInt(e.target.value) }))}
                  className="w-full accent-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Chef de projet</label>
                  <Input value={form.managerName ?? ''} onChange={e => setForm(f => ({ ...f, managerName: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email chef de projet</label>
                  <Input type="email" value={form.managerEmail ?? ''} onChange={e => setForm(f => ({ ...f, managerEmail: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Date de début</label>
                  <Input type="date" value={form.startDate?.slice(0, 10) ?? ''} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Date de fin</label>
                  <Input type="date" value={form.endDate?.slice(0, 10) ?? ''} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <Textarea value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-slate-700">
              <Button variant="secondary" onClick={() => setShowForm(false)}>Annuler</Button>
              <Button onClick={saveProject} disabled={!form.title || !form.clientId}>Enregistrer</Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Jalon ──────────────────────────────────────────────── */}
      {showMilestone && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F1928] border border-slate-700 rounded-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="font-bold text-white">Ajouter un jalon</h3>
              <button onClick={() => setShowMilestone(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Label *</label>
                <Input value={milestoneForm.label} onChange={e => setMilestoneForm(f => ({ ...f, label: e.target.value }))} placeholder="ex: Validation brief créatif" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Date (affiché)</label>
                  <Input value={milestoneForm.dueDate} onChange={e => setMilestoneForm(f => ({ ...f, dueDate: e.target.value }))} placeholder="ex: 15 Mar" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Statut</label>
                  <select value={milestoneForm.status} onChange={e => setMilestoneForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full bg-[#1E293B] text-white border border-slate-600 rounded-lg px-3 py-2 text-sm">
                    {MILESTONE_STATUS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-slate-700">
              <Button variant="secondary" onClick={() => setShowMilestone(false)}>Annuler</Button>
              <Button onClick={saveMilestone} disabled={!milestoneForm.label}>Ajouter</Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Modal Document ───────────────────────────────────────────── */}
      {showDoc && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0F1928] border border-slate-700 rounded-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="font-bold text-white">Ajouter un document</h3>
              <button onClick={() => setShowDoc(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Nom du document *</label>
                <Input value={docForm.name} onChange={e => setDocForm(f => ({ ...f, name: e.target.value }))} placeholder="ex: Rapport Final Q2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Type</label>
                  <select value={docForm.fileType} onChange={e => setDocForm(f => ({ ...f, fileType: e.target.value }))}
                    className="w-full bg-[#1E293B] text-white border border-slate-600 rounded-lg px-3 py-2 text-sm">
                    {['PDF','PPT','WORD','XLSX','ZIP','IMG'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Taille (affiché)</label>
                  <Input value={docForm.fileSize} onChange={e => setDocForm(f => ({ ...f, fileSize: e.target.value }))} placeholder="ex: 2.4 Mo" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">URL du fichier *</label>
                <Input value={docForm.url} onChange={e => setDocForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-slate-700">
              <Button variant="secondary" onClick={() => setShowDoc(false)}>Annuler</Button>
              <Button onClick={saveDoc} disabled={!docForm.name || !docForm.url}>Ajouter</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientProjectsAdmin;
