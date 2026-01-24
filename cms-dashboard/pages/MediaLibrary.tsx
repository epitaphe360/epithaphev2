// ========================================
// CMS Dashboard - Médiathèque
// ========================================

import React, { useState, useEffect } from 'react';
import { Upload, Grid, List, Search, Trash2, Download, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button, IconButton } from '../components/Button';
import { SearchInput, Select } from '../components/Input';
import { FileUpload, MediaGrid } from '../components/FileUpload';
import { Modal, ConfirmDialog } from '../components/Modal';
import { useToast } from '../components/Toast';
import { getApi } from '../lib/api';
import { Media } from '../types';

export const MediaLibrary: React.FC = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<Media | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const toast = useToast();

  useEffect(() => {
    loadMedia();
  }, [filter, search]);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const api = getApi();
      const response = await api.media.getAll({
        type: filter === 'all' ? undefined : filter,
        search: search || undefined,
      });
      setMedia(response.data || response);
    } catch (error) {
      toast.error('Erreur', 'Impossible de charger les médias');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    try {
      const api = getApi();
      for (const file of files) {
        await api.media.upload(file);
      }
      toast.success('Succès', `${files.length} fichier(s) uploadé(s)`);
      loadMedia();
      setShowUpload(false);
    } catch (error) {
      toast.error('Erreur', 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const api = getApi();
      await api.media.delete(deleteId);
      toast.success('Succès', 'Média supprimé');
      loadMedia();
      setSelected(null);
    } catch (error) {
      toast.error('Erreur', 'Impossible de supprimer le média');
    } finally {
      setDeleteId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      const api = getApi();
      await Promise.all(selectedIds.map((id) => api.media.delete(id)));
      toast.success('Succès', `${selectedIds.length} média(s) supprimé(s)`);
      setSelectedIds([]);
      loadMedia();
    } catch (error) {
      toast.error('Erreur', 'Erreur lors de la suppression');
    }
  };

  const toggleSelect = (item: Media) => {
    setSelectedIds((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id]
    );
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('Copié', 'URL copiée dans le presse-papier');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Médiathèque</h1>
          <p className="text-gray-600">Gérez vos images et fichiers</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <Button variant="danger" onClick={handleBulkDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer ({selectedIds.length})
            </Button>
          )}
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Uploader
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un fichier..."
              />
            </div>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: 'all', label: 'Tous les types' },
                { value: 'image', label: 'Images' },
                { value: 'video', label: 'Vidéos' },
                { value: 'document', label: 'Documents' },
              ]}
            />
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun média trouvé</p>
              <Button variant="secondary" className="mt-4" onClick={() => setShowUpload(true)}>
                Uploader des fichiers
              </Button>
            </div>
          ) : (
            <MediaGrid
              items={media}
              onSelect={(item) => setSelected(item)}
              onRemove={(id) => setDeleteId(id)}
              selectable={true}
              selectedIds={selectedIds}
            />
          )}
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <Modal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        title="Uploader des fichiers"
        size="lg"
      >
        <FileUpload
          onUpload={handleUpload}
          accept="image/*,video/*,application/pdf"
          multiple={true}
          maxSize={50}
        />
      </Modal>

      {/* Media Detail Modal */}
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Détails du média"
        size="lg"
      >
        {selected && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {selected.type?.startsWith('image/') ? (
                <img
                  src={selected.url}
                  alt={selected.filename}
                  className="w-full rounded-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">{selected.type}</span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nom du fichier</label>
                <p className="text-gray-900">{selected.filename}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <p className="text-gray-900">{selected.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Taille</label>
                <p className="text-gray-900">{formatFileSize(selected.size || 0)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={selected.url}
                    readOnly
                    className="flex-1 text-sm bg-gray-50 border rounded px-2 py-1"
                  />
                  <Button size="sm" variant="secondary" onClick={() => copyUrl(selected.url)}>
                    Copier
                  </Button>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => window.open(selected.url, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setDeleteId(selected.id);
                    setSelected(null);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer le média"
        message="Êtes-vous sûr de vouloir supprimer ce fichier ? Cette action est irréversible."
        confirmText="Supprimer"
      />
    </div>
  );
};

export default MediaLibrary;
