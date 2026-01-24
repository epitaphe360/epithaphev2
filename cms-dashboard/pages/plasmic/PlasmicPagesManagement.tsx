import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Modal } from "../../components/Modal";
import { Badge } from "../../components/Badge";
import { Plus, Edit2, Trash2, Eye, Save, Code } from "lucide-react";

interface GrapesPageData {
  id: string;
  name: string;
  path: string;
  html: string;
  css: string;
  status: "draft" | "published";
  lastModified: string;
}

export default function VisualEditorManagement() {
  const [, setLocation] = useLocation();
  const [pages, setPages] = useState<GrapesPageData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<GrapesPageData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    path: "",
    status: "draft" as "draft" | "published",
  });

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      const response = await fetch("/api/grapes/pages");
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des pages:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingPage
        ? `/api/grapes/pages/${editingPage.id}`
        : "/api/grapes/pages";
      
      const method = editingPage ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedPage = await response.json();
        loadPages();
        closeModal();
        // Rediriger vers l'éditeur pour la nouvelle page
        if (!editingPage) {
          setLocation(`/admin/visual-editor/edit/${savedPage.id}`);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette page ?")) return;

    try {
      const response = await fetch(`/api/grapes/pages/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadPages();
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const openModal = (page?: GrapesPageData) => {
    if (page) {
      setEditingPage(page);
      setFormData({
        name: page.name,
        path: page.path,
        status: page.status,
      });
    } else {
      setEditingPage(null);
      setFormData({
        name: "",
        path: "",
        status: "draft",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPage(null);
    setFormData({
      name: "",
      path: "",
      status: "draft",
    });
  };

  const openEditor = (page: GrapesPageData) => {
    setLocation(`/admin/visual-editor/edit/${page.id}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Éditeur Visuel GrapesJS</h1>
          <p className="text-gray-600">
            Créez et gérez vos pages avec l'éditeur visuel drag & drop
          </p>
        </div>
        <Button onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Page
        </Button>
      </div>

      {/* Guide rapide */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <div className="p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Code className="w-4 h-4" />
            Comment utiliser GrapesJS
          </h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Cliquez sur "Nouvelle Page" pour créer une page</li>
            <li>Cliquez sur "Éditer" pour ouvrir l'éditeur visuel intégré</li>
            <li>Utilisez le drag & drop pour construire votre page</li>
            <li>Sauvegardez et prévisualisez en temps réel</li>
            <li>Publiez la page quand vous êtes prêt</li>
          </ol>
        </div>
      </Card>

      {/* Liste des pages */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chemin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière modification
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Aucune page créée. Commencez par créer votre première page !
                  </td>
                </tr>
              ) : (
                pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{page.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {page.path}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={page.status === "published" ? "success" : "default"}
                      >
                        {page.status === "published" ? "Publié" : "Brouillon"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(page.lastModified).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditor(page)}
                          title="Éditer avec GrapesJS"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(page.path, "_blank")}
                          title="Prévisualiser"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openModal(page)}
                          title="Modifier les paramètres"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(page.id)}
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de création/édition */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingPage ? "Modifier la page" : "Nouvelle page"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom de la page</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ex: Page d'accueil personnalisée"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Chemin URL</label>
            <Input
              value={formData.path}
              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
              placeholder="ex: /landing-special"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Le chemin où la page sera accessible sur votre site
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "draft" | "published",
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={closeModal}>
              Annuler
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              {editingPage ? "Mettre à jour" : "Créer"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
