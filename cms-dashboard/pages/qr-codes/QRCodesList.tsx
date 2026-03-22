/**
 * cms-dashboard/pages/qr-codes/QRCodesList.tsx
 * Phase 2 — Administration des QR Codes avec UTM Deep Linking
 *
 * Permet de : créer, prévisualiser, télécharger et désactiver des QR codes
 */
import { useState, useEffect } from "react";
import {
  QrCode, Plus, Download, Trash2, BarChart2,
  ExternalLink, Loader2, AlertCircle, CheckCircle2, Copy,
} from "lucide-react";

interface QrCodeItem {
  id:          string;
  label:       string;
  targetPath:  string;
  utmSource:   string;
  utmMedium:   string;
  utmCampaign: string;
  utmContent:  string | null;
  isActive:    boolean;
  scanCount:   number;
  createdAt:   string;
}

interface CreateForm {
  label:       string;
  targetPath:  string;
  utmSource:   string;
  utmMedium:   string;
  utmCampaign: string;
  utmContent:  string;
}

const INITIAL_FORM: CreateForm = {
  label:       "",
  targetPath:  "/",
  utmSource:   "qrcode",
  utmMedium:   "print",
  utmCampaign: "",
  utmContent:  "",
};

const UTM_MEDIUM_OPTIONS = ["print", "display", "email", "social", "banner", "event", "other"];

const APP_URL = import.meta.env.VITE_APP_URL ?? "https://epitaphe360.com";

function buildUrl(item: QrCodeItem) {
  const url = new URL(`${APP_URL}${item.targetPath}`);
  url.searchParams.set("utm_source",   item.utmSource);
  url.searchParams.set("utm_medium",   item.utmMedium);
  url.searchParams.set("utm_campaign", item.utmCampaign);
  if (item.utmContent) url.searchParams.set("utm_content", item.utmContent);
  return url.toString();
}

const QR_IFRAME_STYLE = "width:400px;height:400px;border:none;background:white;";

export function QRCodesList() {
  const [items, setItems]       = useState<QrCodeItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState<CreateForm>(INITIAL_FORM);
  const [preview, setPreview]   = useState<{ id: string; svgUrl: string } | null>(null);
  const [copied, setCopied]     = useState<string | null>(null);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/qr-codes");
      if (!res.ok) throw new Error("Erreur serveur");
      setItems(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadItems(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/qr-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).error ?? "Création échouée");
      }
      setForm(INITIAL_FORM);
      setShowForm(false);
      await loadItems();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Désactiver ce QR code ?")) return;
    await fetch(`/api/admin/qr-codes/${id}`, { method: "DELETE" });
    await loadItems();
  }

  function handleDownload(id: string) {
    window.open(`/api/admin/qr-codes/${id}/svg`, "_blank");
  }

  async function handleCopy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#C8A96E]/10 rounded-xl">
            <QrCode className="w-6 h-6 text-[#C8A96E]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">QR Codes</h1>
            <p className="text-sm text-gray-500">Génération avec UTM deep linking · {items.length} code{items.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#C8A96E] text-white rounded-xl text-sm font-medium hover:bg-[#b8965e] transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Nouveau QR Code
        </button>
      </div>

      {/* Erreur */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl text-red-600 text-sm mb-6">
          <AlertCircle className="w-5 h-5 shrink-0" /> {error}
        </div>
      )}

      {/* Formulaire de création */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-5">Créer un QR Code</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Label (nom interne)</label>
              <input
                required value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="ex: Gitex 2025 — Stand B12"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A96E]/30 focus:border-[#C8A96E] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Chemin cible</label>
              <input
                required value={form.targetPath}
                onChange={(e) => setForm((f) => ({ ...f, targetPath: e.target.value }))}
                placeholder="/evenements/salons"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A96E]/30 focus:border-[#C8A96E] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">UTM Source</label>
              <input
                required value={form.utmSource}
                onChange={(e) => setForm((f) => ({ ...f, utmSource: e.target.value }))}
                placeholder="qrcode"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A96E]/30 focus:border-[#C8A96E] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">UTM Medium</label>
              <select
                value={form.utmMedium}
                onChange={(e) => setForm((f) => ({ ...f, utmMedium: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A96E]/30 focus:border-[#C8A96E] transition bg-white"
              >
                {UTM_MEDIUM_OPTIONS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">UTM Campaign *</label>
              <input
                required value={form.utmCampaign}
                onChange={(e) => setForm((f) => ({ ...f, utmCampaign: e.target.value }))}
                placeholder="gitex-2025"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A96E]/30 focus:border-[#C8A96E] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">UTM Content (optionnel)</label>
              <input
                value={form.utmContent}
                onChange={(e) => setForm((f) => ({ ...f, utmContent: e.target.value }))}
                placeholder="stand-b12"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A96E]/30 focus:border-[#C8A96E] transition"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setShowForm(false)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition font-medium">
              Annuler
            </button>
            <button type="submit" disabled={creating}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#C8A96E] text-white text-sm font-medium hover:bg-[#b8965e] transition disabled:opacity-60">
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Générer le QR Code
            </button>
          </div>
        </form>
      )}

      {/* Liste */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#C8A96E]" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <QrCode className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Aucun QR code créé. Commencez par en créer un ci-dessus.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${!item.isActive ? "opacity-50" : "border-gray-100"}`}>
              {/* Preview SVG (chargée via /api/admin/qr-codes/:id/svg) */}
              <div className="bg-gray-50 flex items-center justify-center h-40 border-b border-gray-100 relative overflow-hidden">
                {preview?.id === item.id ? (
                  <img src={`/api/admin/qr-codes/${item.id}/svg`} alt={item.label} className="w-32 h-32" />
                ) : (
                  <div className="flex flex-col items-center text-gray-300 gap-2">
                    <QrCode className="w-12 h-12" />
                    <button
                      onClick={() => setPreview({ id: item.id, svgUrl: `/api/admin/qr-codes/${item.id}/svg` })}
                      className="text-xs text-[#C8A96E] hover:underline"
                    >
                      Aperçu
                    </button>
                  </div>
                )}
                {!item.isActive && (
                  <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow">Désactivé</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-gray-900 text-sm leading-tight">{item.label}</p>
                  <div className="flex items-center gap-1 text-xs text-[#C8A96E] bg-[#C8A96E]/10 px-2 py-0.5 rounded-full ml-2 shrink-0">
                    <BarChart2 className="w-3 h-3" />
                    {item.scanCount}
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-1">
                  <span className="font-medium text-gray-600">{item.targetPath}</span>
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  utm: {item.utmSource}/{item.utmMedium}/{item.utmCampaign}{item.utmContent ? `/${item.utmContent}` : ""}
                </p>

                {/* Lien de scan avec copie */}
                <div className="mt-3 p-2 bg-gray-50 rounded-lg flex items-center gap-2">
                  <code className="text-[10px] text-gray-500 truncate flex-1">
                    {APP_URL}/qr/{item.id}
                  </code>
                  <button
                    onClick={() => handleCopy(`${APP_URL}/qr/${item.id}`, item.id)}
                    className="shrink-0 p-1 text-gray-400 hover:text-[#C8A96E] transition"
                    title="Copier le lien"
                  >
                    {copied === item.id
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      : <Copy className="w-3.5 h-3.5" />
                    }
                  </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleDownload(item.id)}
                    title="Télécharger le SVG"
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition text-xs font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    SVG
                  </button>
                  <a
                    href={buildUrl(item)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 py-2 px-3 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition text-xs font-medium"
                    title="Tester l'URL"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  {item.isActive && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Désactiver"
                      className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
