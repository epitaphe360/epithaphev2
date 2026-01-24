// ========================================
// CMS Dashboard - Formulaire Utilisateur
// ========================================

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Modal } from '../../components/Modal';
import { Input, Textarea, Select } from '../../components/Input';
import { Button } from '../../components/Button';

interface UserFormProps {
  user?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'AUTHOR',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Never pre-fill password
        role: user.role || 'AUTHOR',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email) {
      alert('Le nom et l\'email sont requis');
      return;
    }

    if (!user && !formData.password) {
      alert('Le mot de passe est requis pour un nouvel utilisateur');
      return;
    }

    // Remove password from data if editing and password is empty
    const dataToSubmit = { ...formData };
    if (user && !formData.password) {
      delete (dataToSubmit as any).password;
    }

    onSave(dataToSubmit);
  };

  return (
    <Modal isOpen={true} onClose={onCancel}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {user ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="px-6 py-4 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jean Dupont"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jean.dupont@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe {!user && '*'}
              </label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={user ? 'Laisser vide pour ne pas modifier' : 'Choisir un mot de passe'}
                required={!user}
              />
              {user && (
                <p className="text-xs text-gray-500 mt-1">
                  Laisser vide si vous ne voulez pas changer le mot de passe
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle *
              </label>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                options={[
                  { value: 'AUTHOR', label: 'Auteur - Peut créer et modifier ses propres contenus' },
                  { value: 'EDITOR', label: 'Éditeur - Peut modifier tous les contenus' },
                  { value: 'ADMIN', label: 'Administrateur - Accès complet au système' },
                ]}
              />
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              {user ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UserForm;
