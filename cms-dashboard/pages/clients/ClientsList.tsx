/**
 * CMS Admin — Gestion des comptes Espace Client
 * CRUD : email, nom, société, téléphone, actif/inactif + réinitialise mot de passe
 */
import { useState, useEffect } from "react";
import {
  Users, Plus, Pencil, Trash2, CheckCircle2, AlertCircle,
  Loader2, X, Eye, EyeOff, ShieldCheck, ShieldOff,
} from "lucide-react";

interface ClientAccount {
  id: number;
  email: string;
  name: string;
  company: string | null;
  phone: string | null;
  isActive: boolean | null;
  lastLoginAt: string | null;
  createdAt: string;
}

const emptyForm = (): Partial<ClientAccount> & { password?: string } => ({
  email: "", name: "", company: "", phone: "", isActive: true, password: "",
});

export function ClientsList() {
  const [clients, setClients]   = useState<ClientAccount[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<ClientAccount | null>(null);
  const [form, setForm]         = useState<ReturnType<typeof emptyForm>>(emptyForm());
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/clients")
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((json) => setClients(json.data ?? json))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (c: ClientAccount) => {
    setEditing(c);
    setForm({ ...c, password: "" });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); };

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      const url  = editing ? `/api/admin/clients/${editing.id}` : "/api/admin/clients";
      const method = editing ? "PUT" : "POST";
      const body: any = { ...form };
      if (!body.password) delete body.password;
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const err = await r.json();
        throw new Error(err.error ?? "Erreur");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      closeForm();
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: number) => {
    if (!confirm("Supprimer ce compte client ? Ses projets seront aussi supprimés.")) return;
    setDeleting(id);
    await fetch(`/api/admin/clients/${id}`, { method: "DELETE" });
    setDeleting(null);
    load();
  };

  const toggleActive = async (c: ClientAccount) => {
    await fetch(`/api/admin/clients/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !c.isActive }),
    });
    load();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-[#C8A96E]" />
          <h1 className="text-xl font-bold text-gray-900">Comptes Espace Client</h1>
          <span className="text-sm text-gray-500">({clients.length})</span>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-[#C8A96E] text-[#0B1121] px-4 py-2 rounded-xl font-semibold text-sm hover:bg-[#b89355] transition-colors">
          <Plus className="w-4 h-4" /> Nouveau client
        </button>
      </div>

      {/* Feedback */}
      {error && (
        <div className="mb-4 bg-red-900/40 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />{error}
          <button className="ml-auto" onClick={() => setError("")}><X className="w-4 h-4" /></button>
        </div>
      )}
      {saved && (
        <div className="mb-4 bg-green-900/40 border border-green-500/40 text-green-300 px-4 py-3 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Client enregistré avec succès.
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[#C8A96E]" /></div>
      ) : clients.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Aucun compte client encore créé.</p>
          <p className="text-xs mt-1">Cliquez sur "Nouveau client" pour en créer un.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E2D4A] text-gray-500">
                <th className="text-left py-3 px-4 font-medium">Nom</th>
                <th className="text-left py-3 px-4 font-medium">Email</th>
                <th className="text-left py-3 px-4 font-medium">Société</th>
                <th className="text-left py-3 px-4 font-medium">Dernière connexion</th>
                <th className="text-left py-3 px-4 font-medium">Statut</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-[#1E2D4A]/50 hover:bg-[#1E2D4A]/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{c.name}</td>
                  <td className="py-3 px-4 text-gray-600">{c.email}</td>
                  <td className="py-3 px-4 text-gray-500">{c.company ?? "—"}</td>
                  <td className="py-3 px-4 text-gray-500 text-xs">
                    {c.lastLoginAt ? new Date(c.lastLoginAt).toLocaleDateString("fr-FR") : "Jamais"}
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => toggleActive(c)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                        c.isActive ? "bg-green-900/40 text-green-300 hover:bg-red-900/40 hover:text-red-300" 
                                   : "bg-red-900/40 text-red-300 hover:bg-green-900/40 hover:text-green-300"
                      }`}>
                      {c.isActive ? <><ShieldCheck className="w-3 h-3" /> Actif</> : <><ShieldOff className="w-3 h-3" /> Inactif</>}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(c)} title="Modifier"
                        className="p-1.5 rounded-lg hover:bg-[#1E2D4A] text-gray-500 hover:text-[#C8A96E] transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => del(c.id)} title="Supprimer"
                        className="p-1.5 rounded-lg hover:bg-red-900/30 text-gray-500 hover:text-red-400 transition-colors">
                        {deleting === c.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Formulaire modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={closeForm}>
          <div className="bg-white border border-gray-300 rounded-2xl p-6 w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-900 font-bold text-lg">
                {editing ? "Modifier le client" : "Nouveau compte client"}
              </h2>
              <button onClick={closeForm} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nom complet *</label>
                <input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0D1527] border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email *</label>
                <input type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0D1527] border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Mot de passe {editing ? "(laisser vide = inchangé)" : "*"}
                </label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={form.password ?? ""} onChange={(e) => set("password", e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0D1527] border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E] pr-10" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Société</label>
                  <input value={form.company ?? ""} onChange={(e) => set("company", e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0D1527] border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Téléphone</label>
                  <input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#0D1527] border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#C8A96E]" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActiveCheck" checked={form.isActive ?? true}
                  onChange={(e) => set("isActive", e.target.checked)}
                  className="w-4 h-4 accent-[#C8A96E]" />
                <label htmlFor="isActiveCheck" className="text-sm text-gray-600">Compte actif (peut se connecter)</label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={closeForm}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-gray-600 text-sm hover:bg-[#1E2D4A] transition-colors">
                Annuler
              </button>
              <button onClick={save} disabled={saving}
                className="flex-1 px-4 py-2.5 bg-[#C8A96E] text-[#0B1121] rounded-xl font-semibold text-sm hover:bg-[#b89355] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</> : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientsList;
