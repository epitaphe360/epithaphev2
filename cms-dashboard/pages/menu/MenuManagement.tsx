import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, GripVertical, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import { Table } from '../../components/Table';
import { Badge } from '../../components/Badge';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { MenuLink, SubMenuLink, NavigationStructure } from '../../types/website-types';
import { useApi } from '../../hooks/useApi';

export const MenuManagement: React.FC = () => {
  const [navigations, setNavigations] = useState<NavigationStructure[]>([]);
  const [selectedNav, setSelectedNav] = useState<NavigationStructure | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<MenuLink | null>(null);

  const { get, post, put, delete: deleteApi } = useApi();

  useEffect(() => {
    loadNavigations();
  }, []);

  const loadNavigations = async () => {
    try {
      const data = await get('/api/admin/navigations');
      setNavigations(data);
    } catch (error) {
      console.error('Erreur chargement navigations:', error);
    }
  };

  const saveNavigation = async (navigation: NavigationStructure) => {
    try {
      if (navigation.id) {
        await put(`/api/admin/navigations/${navigation.id}`, navigation);
      } else {
        await post('/api/admin/navigations', navigation);
      }
      loadNavigations();
    } catch (error) {
      console.error('Erreur sauvegarde navigation:', error);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination || !selectedNav) return;

    const items = Array.from(selectedNav.links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    const updatedNav = {
      ...selectedNav,
      links: updatedItems,
    };

    setSelectedNav(updatedNav);
    saveNavigation(updatedNav);
  };

  const toggleLinkVisibility = (linkId: string) => {
    if (!selectedNav) return;

    const updatedLinks = selectedNav.links.map(link =>
      link.id === linkId ? { ...link, isActive: !link.isActive } : link
    );

    const updatedNav = {
      ...selectedNav,
      links: updatedLinks,
    };

    setSelectedNav(updatedNav);
    saveNavigation(updatedNav);
  };

  const openLinkModal = (link?: MenuLink) => {
    setEditingLink(link || {
      id: '',
      label: '',
      href: '',
      hasSubmenu: false,
      order: selectedNav?.links.length || 0,
      isActive: true,
      submenu: []
    });
    setIsModalOpen(true);
  };

  const saveLinkData = async (linkData: MenuLink) => {
    if (!selectedNav) return;

    let updatedLinks;
    if (linkData.id) {
      // Modification
      updatedLinks = selectedNav.links.map(link =>
        link.id === linkData.id ? linkData : link
      );
    } else {
      // Nouveau lien
      const newLink = {
        ...linkData,
        id: Date.now().toString(),
      };
      updatedLinks = [...selectedNav.links, newLink];
    }

    const updatedNav = {
      ...selectedNav,
      links: updatedLinks,
    };

    setSelectedNav(updatedNav);
    await saveNavigation(updatedNav);
    setIsModalOpen(false);
  };

  const deleteLinkData = async (linkId: string) => {
    if (!selectedNav || !confirm('Supprimer ce lien ?')) return;

    const updatedLinks = selectedNav.links.filter(link => link.id !== linkId);
    const updatedNav = {
      ...selectedNav,
      links: updatedLinks,
    };

    setSelectedNav(updatedNav);
    await saveNavigation(updatedNav);
  };

  const navigationColumns = [
    {
      key: 'name',
      header: 'Nom',
      render: (nav: NavigationStructure) => (
        <div>
          <div className="font-medium">{nav.name}</div>
          <div className="text-sm text-gray-500">{nav.location}</div>
        </div>
      )
    },
    {
      key: 'links',
      header: 'Liens',
      render: (nav: NavigationStructure) => (
        <Badge variant="secondary">{nav.links.length} liens</Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (nav: NavigationStructure) => (
        <Badge variant={nav.isActive ? 'success' : 'secondary'}>
          {nav.isActive ? 'Actif' : 'Inactif'}
        </Badge>
      )
    }
  ];

  const navigationActions = [
    {
      label: 'Gérer',
      icon: <Pencil size={16} />,
      onClick: (nav: NavigationStructure) => setSelectedNav(nav),
      variant: 'primary' as const
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des Menus</h1>
      </div>

      {!selectedNav ? (
        <Card>
          <Table
            data={navigations}
            columns={navigationColumns}
            actions={navigationActions}
          />
        </Card>
      ) : (
        <Card>
          <div className="flex justify-between items-center mb-6">
            <div>
              <Button
                variant="secondary"
                onClick={() => setSelectedNav(null)}
              >
                ← Retour
              </Button>
              <h2 className="text-xl font-semibold mt-2">{selectedNav.name}</h2>
            </div>
            <Button onClick={() => openLinkModal()}>
              <Plus size={16} className="mr-2" />
              Ajouter un lien
            </Button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="menu-links">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {selectedNav.links.map((link, index) => (
                    <Draggable
                      key={link.id}
                      draggableId={link.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-4 border rounded-lg mb-2 bg-white ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab"
                              >
                                <GripVertical size={20} className="text-gray-400" />
                              </div>
                              <div>
                                <div className="font-medium">{link.label}</div>
                                <div className="text-sm text-gray-500">{link.href}</div>
                                {link.hasSubmenu && (
                                  <Badge variant="info" className="mt-1">
                                    {link.submenu?.length || 0} sous-menus
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => toggleLinkVisibility(link.id)}
                              >
                                {link.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => openLinkModal(link)}
                              >
                                <Pencil size={16} />
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => deleteLinkData(link.id)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLink?.id ? 'Modifier le lien' : 'Nouveau lien'}
      >
        {editingLink && (
          <MenuLinkForm
            link={editingLink}
            onSave={saveLinkData}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

const MenuLinkForm: React.FC<{
  link: MenuLink;
  onSave: (link: MenuLink) => void;
  onCancel: () => void;
}> = ({ link, onSave, onCancel }) => {
  const [formData, setFormData] = useState(link);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Libellé"
        value={formData.label}
        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
        required
      />
      
      <Input
        label="URL"
        value={formData.href}
        onChange={(e) => setFormData({ ...formData, href: e.target.value })}
        required
      />

      <Input
        label="Ancre (optionnel)"
        value={formData.hash || ''}
        onChange={(e) => setFormData({ ...formData, hash: e.target.value })}
        placeholder="#section"
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="hasSubmenu"
          checked={formData.hasSubmenu}
          onChange={(e) => setFormData({ ...formData, hasSubmenu: e.target.checked })}
        />
        <label htmlFor="hasSubmenu">A des sous-menus</label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default MenuManagement;