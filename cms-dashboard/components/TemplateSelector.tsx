import React, { useState, useEffect } from 'react';
import { PageTemplate } from '@shared/schema';

interface TemplateSelectorProps {
  onSelect: (template: PageTemplate | null) => void;
  onConfirm: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelect,
  onConfirm,
  isOpen,
  onClose,
}) => {
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const url = category === 'all' 
        ? '/api/page-templates'
        : `/api/page-templates?category=${category}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selected = templates.find(t => t.id === selectedId);
  const categories = ['all', ...new Set(templates.map(t => t.category))];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b p-6">
          <h2 className="text-2xl font-bold mb-4">Choisir un modèle</h2>
          
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setSelectedId(null);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  category === cat
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? 'Tous' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Chargement des modèles...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <p>Aucun modèle disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => {
                    setSelectedId(template.id);
                    onSelect(template);
                  }}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                    selectedId === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Thumbnail */}
                  {template.thumbnailUrl && (
                    <img
                      src={template.thumbnailUrl}
                      alt={template.name}
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                  )}
                  
                  {/* Template Info */}
                  <h3 className="font-bold text-lg mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                    {template.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              if (selected) {
                onConfirm();
              }
            }}
            disabled={!selected}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selected
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Utiliser ce modèle
          </button>
        </div>
      </div>
    </div>
  );
};
