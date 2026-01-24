// ========================================
// CMS Dashboard - Liste des Articles
// ========================================

import { useState, useEffect } from "react";
import { useNavigate } from "../../hooks/useRouterParams";
import { Plus, Search, Edit2, Trash2, Eye } from "lucide-react";
import { Card } from "../../components/Card";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { Badge } from "../../components/Badge";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  author?: string;
  category?: string;
}

export function ArticlesList() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Données de démonstration
  const demoArticles: Article[] = [
    {
      id: "1",
      title: "Guide complet des services funéraires",
      excerpt: "Découvrez tous nos services pour vous accompagner dans les moments difficiles",
      status: "published",
      createdAt: new Date().toISOString(),
      author: "Admin",
      category: "Guides",
    },
    {
      id: "2",
      title: "L'importance de la préparation",
      excerpt: "Pourquoi anticiper ses funérailles peut soulager vos proches",
      status: "draft",
      createdAt: new Date().toISOString(),
      author: "Admin",
      category: "Conseils",
    },
  ];

  useEffect(() => {
    setArticles(demoArticles);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;
    setArticles(articles.filter((a) => a.id !== id));
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Publié";
      case "draft":
        return "Brouillon";
      case "archived":
        return "Archivé";
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Articles</h1>
          <p className="text-gray-600">
            Gérez vos articles de blog et actualités
          </p>
        </div>
        <Button onClick={() => navigate("/admin/articles/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Article
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher un article..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="p-4">
            <p className="text-sm font-medium text-blue-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-blue-900">{articles.length}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="p-4">
            <p className="text-sm font-medium text-green-600 mb-1">Publiés</p>
            <p className="text-2xl font-bold text-green-900">
              {articles.filter((a) => a.status === "published").length}
            </p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="p-4">
            <p className="text-sm font-medium text-yellow-600 mb-1">Brouillons</p>
            <p className="text-2xl font-bold text-yellow-900">
              {articles.filter((a) => a.status === "draft").length}
            </p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <div className="p-4">
            <p className="text-sm font-medium text-gray-600 mb-1">Archivés</p>
            <p className="text-2xl font-bold text-gray-900">
              {articles.filter((a) => a.status === "archived").length}
            </p>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Auteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {search
                      ? "Aucun article trouvé"
                      : "Aucun article. Créez votre premier article !"}
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{article.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {article.excerpt}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {article.category || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {article.author || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusColor(article.status) as any}>
                        {getStatusLabel(article.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/articles/${article.id}/edit`)}
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(`/blog/${article.id}`, "_blank")}
                          title="Voir"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(article.id)}
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
    </div>
  );
}

export default ArticlesList;
