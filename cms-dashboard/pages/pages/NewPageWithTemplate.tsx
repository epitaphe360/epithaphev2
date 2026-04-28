import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, ChevronRight, Layout } from 'lucide-react';
import { useNavigate } from '../../hooks/useRouterParams';
import { useAuthStore } from '../../store/authStore';

// Lit le token directement depuis l'état Zustand (sans hook, évite les re-renders)
const getToken = () => useAuthStore.getState().token;

interface PageTemplate {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  sections?: any[];
}

const TEMPLATE_PREVIEWS: Record<string, { icon: string; color: string; sections: string[]; photo?: string }> = {
  'portfolio-landing': {
    icon: '🎪',
    color: 'from-purple-700 to-indigo-900',
    sections: ['Hero', 'Clients', 'À propos', 'Expertises', 'Visuels', 'Stats', 'Témoignage', 'CTA'],
    photo: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&h=240&q=70',
  },
  'service-showcase': {
    icon: '🎶',
    color: 'from-gray-900 to-purple-950',
    sections: ['Hero', 'Date & Lieu', 'Programmation', 'Production', 'Pratique', 'FAQ', 'Billetterie'],
    photo: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&h=240&q=70',
  },
  'agency-about': {
    icon: '🏆',
    color: 'from-rose-600 to-pink-900',
    sections: ['Hero', 'ADN', 'Approche', 'Équipe', 'Stats', 'Studio', 'Partenaires', 'Contact'],
    photo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&h=240&q=70',
  },
};

const STEP_CHOOSE = 1;
const STEP_FORM = 2;

export const NewPageWithTemplate: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEP_CHOOSE);
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate | null>(null);
  const [templates, setTemplates] = useState<PageTemplate[]>([]);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/page-templates')
      .then((r) => r.json())
      .then((data) => setTemplates(data.data || []))
      .catch(() => setError('Impossible de charger les modèles'))
      .finally(() => setLoading(false));
  }, []);

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setPageTitle(title);
    setPageSlug(generateSlug(title));
  };

  const handleSelectTemplate = (template: PageTemplate) => {
    setSelectedTemplate(template);
    setStep(STEP_FORM);
  };

  const handleCreatePage = async () => {
    if (!pageTitle.trim() || !pageSlug.trim() || !selectedTemplate) return;
    setCreating(true);
    try {
      const res = await fetch('/api/pages/from-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
        },
        body: JSON.stringify({
          templateSlug: selectedTemplate.slug,
          title: pageTitle,
          slug: pageSlug,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur création');
      }
      navigate(`/admin/pages/${pageSlug}/sections`);
    } catch (err) {
      alert(`Erreur: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={() => (step === STEP_FORM ? setStep(STEP_CHOOSE) : navigate('/admin/pages'))}
          className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Créer une nouvelle page</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {step === STEP_CHOOSE ? 'Étape 1 sur 2 — Choisissez un modèle' : 'Étape 2 sur 2 — Informations de la page'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-8">
        <div className={`flex items-center gap-2 text-sm font-medium ${step === STEP_CHOOSE ? 'text-blue-600' : 'text-green-600'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs ${step === STEP_CHOOSE ? 'bg-blue-600' : 'bg-green-500'}`}>
            {step === STEP_FORM ? <Check size={14} /> : '1'}
          </span>
          Choisir un modèle
        </div>
        <div className="flex-1 h-px bg-gray-300 mx-2"></div>
        <div className={`flex items-center gap-2 text-sm font-medium ${step === STEP_FORM ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs ${step === STEP_FORM ? 'bg-blue-600' : 'bg-gray-300'}`}>
            2
          </span>
          Informations
        </div>
      </div>

      {step === STEP_CHOOSE && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Layout size={20} className="text-blue-500" />
            Choisissez un modèle de départ
          </h2>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
          )}

          {!loading && !error && templates.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">Aucun modèle disponible</p>
              <p className="text-sm mt-1">Contactez un administrateur pour ajouter des modèles</p>
            </div>
          )}

          {!loading && templates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => {
                const preview = TEMPLATE_PREVIEWS[template.slug] ?? {
                  icon: '📄',
                  color: 'from-gray-400 to-gray-600',
                  sections: [],
                };
                return (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="group bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 overflow-hidden text-left transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <div className={`h-40 relative overflow-hidden`}>
                      {preview.photo ? (
                        <img
                          src={preview.photo}
                          alt={template.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-br ${preview.color}`} />
                      )}
                      <div className="absolute inset-0 bg-black/40" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <span className="text-4xl">{preview.icon}</span>
                        <p className="text-white font-bold text-lg drop-shadow">{template.name}</p>
                      </div>
                      <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5 text-white text-xs font-medium">
                        {template.category}
                      </div>
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 flex items-center justify-center transition-all">
                        <span className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg shadow opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 text-sm flex items-center gap-1">
                          Choisir ce modèle <ChevronRight size={14} />
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{template.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{template.description}</p>
                      {preview.sections.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {preview.sections.map((s) => (
                            <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {step === STEP_FORM && selectedTemplate && (
        <div className="max-w-xl mx-auto">
          {(() => {
            const preview = TEMPLATE_PREVIEWS[selectedTemplate.slug] ?? { icon: '📄', color: 'from-gray-400 to-gray-600', sections: [] };
            return (
              <div className={`bg-gradient-to-r ${preview.color} rounded-xl p-4 flex items-center gap-3 mb-6 text-white`}>
                <span className="text-3xl">{preview.icon}</span>
                <div className="flex-1">
                  <p className="text-sm opacity-80">Modèle sélectionné</p>
                  <p className="font-bold text-lg">{selectedTemplate.name}</p>
                </div>
                <button
                  onClick={() => setStep(STEP_CHOOSE)}
                  className="text-white/80 hover:text-white text-sm underline"
                >
                  Changer
                </button>
              </div>
            );
          })()}

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Titre de la page <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={pageTitle}
                onChange={handleTitleChange}
                placeholder="Ex : Notre Portfolio"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                URL (slug) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm whitespace-nowrap">epitaphe360.com/</span>
                <input
                  type="text"
                  value={pageSlug}
                  onChange={(e) => setPageSlug(e.target.value)}
                  placeholder="notre-portfolio"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 font-mono text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleCreatePage}
              disabled={!pageTitle.trim() || !pageSlug.trim() || creating}
              className={`w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition ${
                !pageTitle.trim() || !pageSlug.trim() || creating
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-98'
              }`}
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Création en cours...
                </>
              ) : (
                <>
                  Créer la page <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
