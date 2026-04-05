// ========================================
// CMS Dashboard - Liste des Articles (real API)
// ========================================

import React, { useState } from "react";
import { useNavigate } from "../../hooks/useRouterParams";
import { Edit2, Trash2 } from "lucide-react";
import { Badge } from "../../components/Badge";
import { ListPage, Column, ListPageAction } from "../../components/ListPage";
import { usePaginatedList } from "../../hooks/usePaginatedList";
import { getApi } from "../../lib/api";

interface Article {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  authorId?: string | null;
  categoryId?: string | null;
}

const STATUS_VARIANTS: Record<string, "success" | "warning" | "default"> = {
  published: "success",
  draft: "warning",
  archived: "default",
};

export function ArticlesList() {
  const navigate = useNavigate();

  const { items, total, loading, error, page, limit, setPage, setSearch, setFilter, refetch } =
    usePaginatedList<Article>({ endpoint: "/admin/articles", limit: 20 });

  const handleDelete = async (item: Article) => {
    if (!confirm(`Supprimer "${item.title}" ?`)) return;
    try { await getApi().delete(`/admin/articles/${item.id}`); refetch(); }
    catch { alert("Erreur lors de la suppression"); }
  };

  const columns: Column<Article>[] = [
    {
      key: "title",
      label: "Article",
      render: (a) => (
        <div>
          <p className="font-medium text-gray-900">{a.title}</p>
          <p className="text-xs text-gray-500">{a.slug}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      width: "120px",
      render: (a) => <Badge variant={STATUS_VARIANTS[a.status] ?? "default"}>{a.status === "published" ? "Publié" : a.status === "draft" ? "Brouillon" : "Archivé"}</Badge>,
    },
    {
      key: "createdAt",
      label: "Créé le",
      width: "130px",
      render: (a) => <span className="text-gray-500 text-xs">{new Date(a.createdAt).toLocaleDateString("fr-FR")}</span>,
    },
  ];

  const actions: ListPageAction<Article>[] = [
    { label: "Modifier",  icon: <Edit2 className="w-4 h-4" />,  onClick: (a) => navigate(`/admin/articles/${a.id}/edit`) },
    { label: "Supprimer", icon: <Trash2 className="w-4 h-4" />, onClick: handleDelete, variant: "danger" },
  ];

  const statusFilter = (
    <select
      onChange={(e) => setFilter("status", e.target.value || undefined)}
      className="px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-[#EC4899]"
    >
      <option value="">Tous les statuts</option>
      <option value="draft">Brouillon</option>
      <option value="published">Publié</option>
      <option value="archived">Archivé</option>
    </select>
  );

  return (
    <ListPage
      title="Articles"
      subtitle="Gérez les articles du blog Epitaphe360"
      columns={columns}
      items={items}
      total={total}
      loading={loading}
      error={error}
      page={page}
      limit={limit}
      onPageChange={setPage}
      onSearch={setSearch}
      onAdd={() => navigate("/admin/articles/new")}
      addLabel="Nouvel Article"
      actions={actions}
      filters={statusFilter}
      emptyLabel="Aucun article publié."
      onRefresh={refetch}
    />
  );
}

