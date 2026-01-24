# 🔧 BACKEND - Routes API à Implémenter

Ce document liste toutes les routes API backend nécessaires pour le tableau de bord CMS.

---

## 📁 CATÉGORIES

### GET /api/categories
Récupère toutes les catégories.

**Réponse:**
```json
[
  {
    "id": "cat-1",
    "name": "Actualités",
    "slug": "actualites",
    "description": "Dernières actualités",
    "type": "article",
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

### POST /api/categories
Crée une nouvelle catégorie.

**Body:**
```json
{
  "name": "Tutoriels",
  "slug": "tutoriels",
  "description": "Guides et tutoriels",
  "type": "article"
}
```

### PUT /api/categories/:id
Met à jour une catégorie.

### DELETE /api/categories/:id
Supprime une catégorie.

---

## 👥 UTILISATEURS

### GET /api/users
Récupère tous les utilisateurs.

**Réponse:**
```json
[
  {
    "id": "user-1",
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "role": "admin",
    "status": "active",
    "bio": "Administrateur principal",
    "phone": "+33 6 12 34 56 78",
    "lastLogin": "2024-01-15T14:30:00Z",
    "createdAt": "2024-01-01T10:00:00Z"
  }
]
```

### POST /api/users
Crée un nouvel utilisateur.

**Body:**
```json
{
  "name": "Marie Martin",
  "email": "marie@example.com",
  "password": "SecurePassword123!",
  "role": "editor",
  "status": "active",
  "bio": "Éditrice de contenu",
  "phone": "+33 6 98 76 54 32"
}
```

**Important:**
- Hasher le mot de passe avec bcrypt (saltRounds: 10)
- Valider l'unicité de l'email
- Valider la force du mot de passe (min 8 caractères)

### PUT /api/users/:id
Met à jour un utilisateur.

**Note:** Si `password` est omis ou vide, ne pas modifier le mot de passe existant.

### DELETE /api/users/:id
Supprime un utilisateur.

**Important:** Ne pas permettre de supprimer le dernier admin.

---

## ⚙️ PARAMÈTRES GÉNÉRAUX

### GET /api/settings/general
Récupère les paramètres généraux.

**Réponse:**
```json
{
  "siteName": "Mon Site Web",
  "siteDescription": "Description de mon site",
  "siteUrl": "https://example.com",
  "contactEmail": "contact@example.com",
  "contactPhone": "+33 1 23 45 67 89",
  "logo": "https://cdn.example.com/logo.png",
  "favicon": "https://cdn.example.com/favicon.ico",
  "copyrightText": "© 2024 Mon Site. Tous droits réservés."
}
```

### PUT /api/settings/general
Met à jour les paramètres généraux.

---

## 🔍 PARAMÈTRES SEO

### GET /api/settings/seo
Récupère les paramètres SEO.

**Réponse:**
```json
{
  "metaTitle": "Mon Site - Slogan accrocheur",
  "metaDescription": "Description optimisée pour SEO",
  "metaKeywords": "mot-clé1, mot-clé2, mot-clé3",
  "ogImage": "https://cdn.example.com/og-image.jpg",
  "googleAnalyticsId": "G-XXXXXXXXXX",
  "googleSearchConsoleId": "abc123def456",
  "robotsTxt": "User-agent: *\nDisallow: /admin/\nAllow: /",
  "sitemapEnabled": true
}
```

### PUT /api/settings/seo
Met à jour les paramètres SEO.

---

## 🔗 PARAMÈTRES D'INTÉGRATION

### GET /api/settings/integrations
Récupère les paramètres d'intégration.

**Réponse:**
```json
{
  "smtpHost": "smtp.gmail.com",
  "smtpPort": "587",
  "smtpUser": "noreply@example.com",
  "smtpPassword": "encrypted_password",
  "smtpFromEmail": "noreply@example.com",
  "smtpFromName": "Mon Site",
  "facebookUrl": "https://facebook.com/monentreprise",
  "twitterUrl": "https://twitter.com/monentreprise",
  "instagramUrl": "https://instagram.com/monentreprise",
  "linkedinUrl": "https://linkedin.com/company/monentreprise",
  "youtubeUrl": "https://youtube.com/@monentreprise",
  "disqusShortname": "mon-site",
  "mailchimpApiKey": "abc123-us1",
  "stripePublicKey": "pk_live_...",
  "customScripts": "<script>...</script>"
}
```

**Important:** Chiffrer les mots de passe et clés API avant stockage.

### PUT /api/settings/integrations
Met à jour les paramètres d'intégration.

---

## 📊 SCHÉMAS DE BASE DE DONNÉES

### Table: categories

```sql
CREATE TABLE categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  type ENUM('article', 'event') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Table: users

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor', 'author') NOT NULL DEFAULT 'author',
  status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  bio TEXT,
  phone VARCHAR(20),
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Table: settings

```sql
CREATE TABLE settings (
  id VARCHAR(36) PRIMARY KEY,
  category ENUM('general', 'seo', 'integrations') NOT NULL,
  key VARCHAR(255) NOT NULL,
  value TEXT,
  type VARCHAR(50) DEFAULT 'string',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_category_key (category, key)
);
```

### Relations avec tables existantes

```sql
-- Ajouter category_id aux articles
ALTER TABLE articles 
ADD COLUMN category_id VARCHAR(36),
ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Ajouter author_id aux articles
ALTER TABLE articles 
ADD COLUMN author_id VARCHAR(36),
ADD FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;

-- Ajouter category_id aux événements
ALTER TABLE events 
ADD COLUMN category_id VARCHAR(36),
ADD FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- Ajouter organizer_id aux événements
ALTER TABLE events 
ADD COLUMN organizer_id VARCHAR(36),
ADD FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE SET NULL;
```

---

## 🔐 MIDDLEWARE D'AUTHENTIFICATION

### Vérification des rôles

```typescript
// middleware/auth.ts
export const requireRole = (roles: string[]) => {
  return (req, res, next) => {
    const user = req.user; // Depuis JWT ou session
    
    if (!user) {
      return res.status(401).json({ error: 'Non authentifié' });
    }
    
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Non autorisé' });
    }
    
    next();
  };
};
```

### Permissions par endpoint

```typescript
// Routes protégées par rôle
router.get('/api/articles', authenticate, getAllArticles);
router.post('/api/articles', authenticate, requireRole(['admin', 'editor', 'author']), createArticle);
router.put('/api/articles/:id', authenticate, checkArticleOwnership, updateArticle);
router.delete('/api/articles/:id', authenticate, requireRole(['admin', 'editor']), deleteArticle);

// Catégories - admin/editor seulement
router.post('/api/categories', authenticate, requireRole(['admin', 'editor']), createCategory);

// Utilisateurs - admin seulement
router.post('/api/users', authenticate, requireRole(['admin']), createUser);

// Paramètres - admin seulement
router.put('/api/settings/*', authenticate, requireRole(['admin']), updateSettings);
```

---

## 📝 VALIDATION DES DONNÉES

### Catégories

```typescript
const categorySchema = {
  name: { type: 'string', required: true, minLength: 2, maxLength: 255 },
  slug: { type: 'string', required: true, pattern: /^[a-z0-9-]+$/ },
  description: { type: 'string', maxLength: 1000 },
  type: { type: 'enum', values: ['article', 'event'], required: true }
};
```

### Utilisateurs

```typescript
const userSchema = {
  name: { type: 'string', required: true, minLength: 2, maxLength: 255 },
  email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { type: 'string', required: true, minLength: 8 },
  role: { type: 'enum', values: ['admin', 'editor', 'author'], required: true },
  status: { type: 'enum', values: ['active', 'inactive'], required: true },
  bio: { type: 'string', maxLength: 5000 },
  phone: { type: 'string', pattern: /^\+?[0-9\s\-()]+$/ }
};
```

---

## 🧪 TESTS À EFFECTUER

### Catégories
- [ ] GET /api/categories retourne toutes les catégories
- [ ] POST /api/categories crée une catégorie
- [ ] POST /api/categories vérifie l'unicité du slug
- [ ] PUT /api/categories/:id met à jour
- [ ] DELETE /api/categories/:id supprime
- [ ] DELETE vérifie qu'aucun article n'utilise la catégorie

### Utilisateurs
- [ ] GET /api/users retourne tous les utilisateurs
- [ ] POST /api/users crée avec mot de passe hashé
- [ ] POST /api/users vérifie l'unicité de l'email
- [ ] PUT /api/users/:id met à jour sans changer password si vide
- [ ] PUT /api/users/:id change password si fourni
- [ ] DELETE /api/users/:id empêche la suppression du dernier admin

### Paramètres
- [ ] GET /api/settings/* retourne les paramètres
- [ ] PUT /api/settings/* met à jour
- [ ] Validation des formats (email, URL, etc.)
- [ ] Chiffrement des données sensibles

### Permissions
- [ ] Admin a accès à tout
- [ ] Editor ne peut pas gérer utilisateurs/paramètres
- [ ] Author ne peut modifier que ses contenus

---

## 🚀 EXEMPLE D'IMPLÉMENTATION (Express.js)

```typescript
// routes/categories.ts
import express from 'express';
import { authenticate, requireRole } from '../middleware/auth';
import { db } from '../database';

const router = express.Router();

// GET all categories
router.get('/api/categories', authenticate, async (req, res) => {
  try {
    const categories = await db.query('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST create category
router.post('/api/categories', authenticate, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { name, slug, description, type } = req.body;
    
    // Validation
    if (!name || !slug || !type) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }
    
    // Check unique slug
    const existing = await db.query('SELECT id FROM categories WHERE slug = ?', [slug]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Ce slug existe déjà' });
    }
    
    // Insert
    const id = generateId();
    await db.query(
      'INSERT INTO categories (id, name, slug, description, type) VALUES (?, ?, ?, ?, ?)',
      [id, name, slug, description, type]
    );
    
    res.status(201).json({ id, name, slug, description, type });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT update category
router.put('/api/categories/:id', authenticate, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, type } = req.body;
    
    await db.query(
      'UPDATE categories SET name = ?, slug = ?, description = ?, type = ? WHERE id = ?',
      [name, slug, description, type, id]
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE category
router.delete('/api/categories/:id', authenticate, requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category is used
    const articles = await db.query('SELECT id FROM articles WHERE category_id = ?', [id]);
    if (articles.length > 0) {
      return res.status(409).json({ error: 'Cette catégorie est utilisée par des articles' });
    }
    
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
```

---

## 📦 DÉPENDANCES RECOMMANDÉES

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "mysql2": "^3.6.5",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-validator": "^7.0.1"
  }
}
```

---

## ✅ CHECKLIST BACKEND

- [ ] Créer les tables de base de données
- [ ] Implémenter routes catégories (5 endpoints)
- [ ] Implémenter routes utilisateurs (5 endpoints)
- [ ] Implémenter routes paramètres (6 endpoints)
- [ ] Ajouter middleware d'authentification
- [ ] Ajouter middleware de rôles
- [ ] Hasher les mots de passe (bcrypt)
- [ ] Chiffrer les données sensibles
- [ ] Valider toutes les entrées
- [ ] Gérer les erreurs correctement
- [ ] Ajouter logging des actions
- [ ] Écrire les tests unitaires
- [ ] Écrire les tests d'intégration
- [ ] Documenter l'API (Swagger/OpenAPI)
- [ ] Configurer CORS correctement
- [ ] Limiter les requêtes (rate limiting)

---

**Date :** Janvier 2024  
**Version :** 1.0.0  
**Statut :** 📋 Spécifications complètes
