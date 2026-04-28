/**
 * ImageUploadField — Champ image réutilisable avec upload depuis PC + saisie URL
 * Stocke automatiquement dans /api/admin/media
 */
import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export interface ImageUploadFieldProps {
  /** Libellé affiché au-dessus du champ */
  label?: string;
  /** URL actuelle */
  value: string;
  /** Callback appelé avec la nouvelle URL (upload ou saisie manuelle) */
  onChange: (url: string) => void;
  placeholder?: string;
  /** Classes CSS supplémentaires sur le conteneur */
  className?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  placeholder = 'https://...',
  className = '',
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = useAuthStore((s) => s.token);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Seules les images sont acceptées (jpg, png, webp…)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Fichier trop lourd (max 10 Mo)');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Erreur ${res.status}`);
      }
      const data = await res.json();
      onChange(data.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur upload');
    } finally {
      setUploading(false);
    }
  };

  const inputClass =
    'block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-gray-700">{label}</label>
      )}

      {/* Prévisualisation */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="aperçu"
            className="h-24 w-auto max-w-full rounded-lg border border-gray-200 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
            title="Supprimer l'image"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Saisie URL */}
      <input
        type="text"
        className={inputClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />

      {/* Bouton upload depuis PC */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          {uploading ? 'Envoi…' : 'Choisir depuis mon PC'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default ImageUploadField;
