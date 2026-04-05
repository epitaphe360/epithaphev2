/**
 * CMS Admin — Gestion des Ressources Clients
 * CRUD complet : title, category, format, access_level, tags, isNew, downloadUrl
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Plus, Pencil, Trash2, CheckCircle2, AlertCircle,
  Loader2, X, Tag, Download, Eye, EyeOff,
} from "lucide-react";

interface Resource {
  id: number;
  title: string;
  description: string | null;
  category: string;
  format: string | null;
  fileSize: string | null;
  downloadUrl: string | null;
  accessLevel: string | null;
  tags: string[];
  isNew: boolean | null;
  isPublished: boolean | null;
  sortOrder: number | null;
  downloadCount: number | null;
}

const CATEGORY_OPTIONS = [
  { value: "guide",           label: "Guide" },
  { value: "modele",          label: "Modèle / Template" },
  { value: "etude_de_cas",    label: "Étude de cas" },
  { value: "fiche_technique", label: "Fiche technique" },
  { value: "video",           label: "Vidéo" },
  { value: "webinaire",       label: "Webinaire" },
];

const FORMAT_OPTIONS = ["PDF", "DOCX", "XLSX", "ZIP", "VIDEO", "LINK"];

const ACCESS_OPTIONS = [
  { value: "public", label: "Public (tous)" },
  { value: "lead",   label: "Lead (formulaire requis)" },
  { value: "client", label: "Client (connecté)" },
];

const ACCESS_COLORS: Record<string, string> = {
  public: "bg-green-50 text-green-700 border-green-200",
  lead:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  client: "bg-blue-50 text-blue-700 border-blue-200",
};

const emptyForm = (): Partial<Resource> => ({
  title: "", description: "", category: "guide", format: "PDF",
  fileSize: "", downloadUrl: "", accessLevel: "client",
  tags: [], isNew: false, isPublished: true, sortOrder: 0,
});

export function ResourcesList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState<Resource | null>(null);
  const [form, setForm]           = useState<Partial<Resource>>(emptyForm());
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [tagInput, setTagInput]   = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/admin/resources")
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((json) => setResources(Array.isArray(json) ? json : json.data ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setTagInput("");
    setSaved(false);
    setShowForm(true);
  };

  const openEdit = (r: Resource) => {
    setEditing(r);
    setForm({ ...r });
    setTagInput("");
    setSaved(false);
    setShowForm(true);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !(form.tags ?? []).includes(t)) {
      setForm((f) => ({ ...f, tags: [...(f.tags ?? []), t] }));
    }
    setTagInput("");
  };

  const removeTag = (t: string) =>
    setForm((f) => ({ ...f, tags: (f.tags ?? []).filter((x) => x !== t) }));

  const save = async () => {
    if (!form.title || !form.category) return;
    setSaving(true);
    try {
      const method = editing ? "PATCH" : "POST";
      const url    = editing ? `/api/admin/resources/${editing.id}` : "/api/admin/resources";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erreur lors de la sauvegarde");
      setSaved(true);
      load();
      setTimeout(() => setShowForm(false), 1200);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteResource = async (id: number) => {
    if (!confirm("Supprimer cette ressource ?")) return;
    await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
    load();
  };

  const togglePublish = async (r: Resource) => {
    await fetch(`/api/admin/resources/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !r.isPublished }),
    });
    load();
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Ressources Clients</h1>
            <p className="text-muted-foreground text-sm">{resources.length} ressource{resources.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Nouvelle ressource
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-5 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Titre</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Catégorie</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Accès</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">DL</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {resources.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {!r.isPublished && <EyeOff className="w-3 h-3 text-muted-foreground flex-shrink-0" />}
                      <div>
                        <p className="font-medium text-foreground leading-tight">{r.title}</p>
                        {r.isNew && <span className="text-xs text-primary font-medium">Nouveau</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground capitalize">{r.category.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${ACCESS_COLORS[r.accessLevel ?? "client"] ?? ""}`}>
                      {r.accessLevel ?? "client"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell text-muted-foreground">{r.downloadCount ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => togglePublish(r)} title={r.isPublished ? "Dépublier" : "Publier"}
                        className="text-muted-foreground hover:text-foreground transition-colors">
                        {r.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openEdit(r)} className="text-muted-foreground hover:text-primary transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteResource(r.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {resources.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">Aucune ressource</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }}
              className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-foreground text-lg">{editing ? "Modifier" : "Nouvelle ressource"}</h2>
                <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Titre *</label>
                  <input value={form.title ?? ""} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Catégorie *</label>
                    <select value={form.category ?? "guide"} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
                      {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Format</label>
                    <select value={form.format ?? "PDF"} onChange={(e) => setForm((f) => ({ ...f, format: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
                      {FORMAT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Niveau d'accès</label>
                    <select value={form.accessLevel ?? "client"} onChange={(e) => setForm((f) => ({ ...f, accessLevel: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary">
                      {ACCESS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Taille du fichier</label>
                    <input value={form.fileSize ?? ""} onChange={(e) => setForm((f) => ({ ...f, fileSize: e.target.value }))}
                      placeholder="Ex: 2.4 MB"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">URL de téléchargement</label>
                  <input value={form.downloadUrl ?? ""} onChange={(e) => setForm((f) => ({ ...f, downloadUrl: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      placeholder="Ajouter un tag…"
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary" />
                    <button type="button" onClick={addTag} className="px-3 py-2 bg-muted rounded-lg text-sm">+</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(form.tags ?? []).map((t) => (
                      <span key={t} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
                        <Tag className="w-2.5 h-2.5" /> {t}
                        <button onClick={() => removeTag(t)} className="ml-0.5 text-muted-foreground hover:text-destructive">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.isNew ?? false} onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))}
                      className="w-4 h-4 rounded accent-primary" />
                    Marquée "Nouveau"
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.isPublished ?? true} onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                      className="w-4 h-4 rounded accent-primary" />
                    Publiée
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button onClick={save} disabled={saving || !form.title}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : null}
                  {saved ? "Sauvegardé !" : "Enregistrer"}
                </button>
                <button onClick={() => setShowForm(false)} className="text-sm text-muted-foreground hover:text-foreground">Annuler</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
