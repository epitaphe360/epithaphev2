// ========================================
// CMS Dashboard - Liste des Événements
// ========================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from '../../hooks/useRouterParams';
import { Link } from 'wouter';
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { SearchInput, Select } from '../../components/Input';
import { Table, Column, Pagination } from '../../components/Table';
import { StatusBadge } from '../../components/Badge';
import { ConfirmDialog } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { getApi } from '../../lib/api';
import { useSimplePagination, useDebounce } from '../../hooks/useApi';
import { Event } from '../../types';

export const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();
  const debouncedSearch = useDebounce(search, 300);
  const { page, setPage, limit, totalPages } = useSimplePagination(total);

  useEffect(() => {
    loadEvents();
  }, [page, debouncedSearch, statusFilter]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const api = getApi();
      const response = await api.events.getAll({
        page,
        limit,
        search: debouncedSearch || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setEvents(response.data);
      setTotal(response.total);
    } catch (error) {
      toast.error('Erreur', 'Impossible de charger les événements');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const api = getApi();
      await api.events.delete(deleteId);
      toast.success('Succès', 'Événement supprimé');
      loadEvents();
    } catch (error) {
      toast.error('Erreur', 'Impossible de supprimer l\'événement');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns: Column<Event>[] = [
    {
      key: 'title',
      header: 'Événement',
      render: (event) => (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex flex-col items-center justify-center">
            <span className="text-xs text-primary-600 font-medium">
              {new Date(event.startDate).toLocaleDateString('fr-FR', { month: 'short' })}
            </span>
            <span className="text-lg font-bold text-primary-700">
              {new Date(event.startDate).getDate()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{event.title}</p>
            {event.location && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {event.location}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'startDate',
      header: 'Date & Heure',
      render: (event) => (
        <div>
          <p className="text-sm text-gray-900">{formatDate(event.startDate)}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTime(event.startDate)}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (event) => <StatusBadge status={event.status} />,
    },
    {
      key: 'capacity',
      header: 'Capacité',
      render: (event) => (
        <span className="text-sm text-gray-600">
          {event.registrations || 0} / {event.capacity || '∞'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '120px',
      render: (event) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/evenements/${event.slug}`, '_blank');
            }}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            title="Voir"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/events/${event.id}/edit`);
            }}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(event.id);
            }}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Événements</h1>
          <p className="text-gray-600">Gérez vos événements</p>
        </div>
        <Link to="/admin/events/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvel événement
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-md">
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un événement..."
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'DRAFT', label: 'Brouillon' },
                { value: 'PUBLISHED', label: 'Publié' },
                { value: 'CANCELLED', label: 'Annulé' },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          data={events}
          loading={loading}
          emptyMessage="Aucun événement trouvé"
          onRowClick={(event) => navigate(`/admin/events/${event.id}/edit`)}
        />
        {total > limit && (
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onPageChange={setPage}
          />
        )}
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Supprimer l'événement"
        message="Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible."
        confirmText="Supprimer"
        loading={deleting}
      />
    </div>
  );
};

export default EventsList;
