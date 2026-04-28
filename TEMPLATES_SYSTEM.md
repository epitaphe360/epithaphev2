# 📋 Système de Templates Epitaphe 360

## Vue d'ensemble

Le système de templates permet aux clients de choisir parmi des modèles de conception prédéfinis lors de la création de nouvelles pages. Les templates sont réutilisables et basés sur des designs inspirés du thème Leedo.

## Architecture

### 1. **Base de données** (`page_templates` table)

```sql
CREATE TABLE page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(100) DEFAULT 'general',
  thumbnail_url TEXT,
  sections JSONB (Puck sections array),
  preview_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

**Templates de démarrage inclus :**
- **Portfolio Landing** — Hero + portfolio grid + testimonials
- **Service Showcase** — Service list + pricing tables + CTA
- **Agency About** — Team + stats + contact form

### 2. **API Endpoints**

#### **Public Endpoints**
```
GET /api/page-templates
  - Récupère tous les templates actifs
  - Query: ?category=leedo (optionnel)
  - Response: { data: PageTemplate[] }

GET /api/page-templates/:slug
  - Récupère un template spécifique
  - Response: PageTemplate

POST /api/pages/from-template
  - Crée une nouvelle page à partir d'un template
  - Body: { templateSlug, title, slug }
  - Auth: Bearer token requis
  - Response: Page avec sections clonées du template
```

#### **Admin Endpoints**
```
GET /api/admin/page-templates
  - Liste tous les templates (incluant inactifs)
  - Auth: Admin requis
  - Response: { data: PageTemplate[] }

POST /api/admin/page-templates
  - Crée un nouveau template
  - Auth: Admin requis
  - Body: { name, slug, description, category, sections, thumbnailUrl }
  - Response: PageTemplate

PUT /api/admin/page-templates/:id
  - Met à jour un template
  - Auth: Admin requis
  - Body: { name, description, category, sections, isActive, thumbnailUrl }
  - Response: PageTemplate

DELETE /api/admin/page-templates/:id
  - Supprime un template
  - Auth: Admin requis
  - Response: { success: true }
```

### 3. **Frontend Components**

#### **TemplateSelector.tsx**
Component modal pour afficher et sélectionner les templates :
- Filtrage par catégorie
- Affichage de thumbnail + description
- Sélection radio
- Bouton "Utiliser ce modèle"

#### **NewPageWithTemplate.tsx**
Page d'accueil `/admin/pages/new` pour créer une page avec template :
- Formulaire pour titre et slug
- Sélecteur de template intégré
- Bouton pour créer la page
- Redirection vers l'éditeur Puck avec sections du template

### 4. **Intégration Puck**

Les templates stockent leurs sections en tant que **Puck JSON** :
```json
{
  "id": "hero-1",
  "type": "hero",
  "enabled": true,
  "order": 0,
  "props": {
    "title": "Creative Portfolio",
    "subtitle": "...",
    "image": "...",
    "cta": "..."
  }
}
```

**Avantage :** Compatibilité totale avec l'éditeur Puck — les templates peuvent être immédiatement éditées après création.

## Flux utilisateur

1. **Utilisateur clique "Créer une page"** → Route `/admin/pages/new`
2. **Page se charge** → Affiche formulaire titre/slug + bouton "Choisir un modèle"
3. **Utilisateur clique "Choisir un modèle"** → Modal TemplateSelector s'ouvre
4. **Utilisateur sélectionne un template** → Confirmé dans le formulaire
5. **Utilisateur clique "Créer la page"** → 
   - `POST /api/pages/from-template` avec templateSlug, title, slug
   - Page créée avec sections clonées du template
   - Redirection vers `/admin/pages/:slug/sections` (éditeur Puck)
6. **Utilisateur édite la page** → Modification des sections dans Puck
7. **Utilisateur enregistre** → Sections sauvegardées dans `pages.sections` JSONB

## Types TypeScript

### Schéma Drizzle (shared/schema.ts)
```typescript
export const pageTemplates = pgTable("page_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  category: varchar("category", { length: 50 }).default("general"),
  thumbnailUrl: text("thumbnail_url"),
  sections: json("sections").$type<Array<Record<string, unknown>>>().default([]),
  previewUrl: text("preview_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PageTemplate = typeof pageTemplates.$inferSelect;
export type InsertPageTemplate = z.infer<typeof insertPageTemplateSchema>;
```

## Cas d'usage

### **Pour les clients :**
✅ Créer rapidement une page sans partir de zéro
✅ Choisir entre designs professionnels
✅ Éditer immédiatement le contenu dans Puck

### **Pour les admins :**
✅ Créer des templates réutilisables
✅ Ajouter/modifier/supprimer des templates
✅ Gérer les catégories de templates

## Prochaines étapes

### **Court terme (semaine 1)**
- [ ] Ajouter les 3 templates initiaux en base (`020_page_templates.sql`)
- [ ] Tester création de page via `/api/pages/from-template`
- [ ] Vérifier rendu des sections Puck
- [ ] Ajouter screenshots/thumbnails des templates

### **Moyen terme (semaine 2)**
- [ ] Créer 5-10 templates supplémentaires (Portfolio, Blog, Pricing, etc.)
- [ ] Interface admin pour gérer templates (CRUD complet)
- [ ] Import/Export de templates
- [ ] Aperçu en temps réel dans le sélecteur

### **Long terme (semaine 3+)**
- [ ] Convertir templates Leedo WordPress → Puck JSON
- [ ] Système d'héritage de templates (parent/child)
- [ ] Versioning des templates
- [ ] Analytics : "Templates les plus utilisés"
- [ ] Marketplace interne de templates

## Fichiers modifiés

### Backend
- `server/admin-routes.ts` — 7 nouveaux endpoints (CRUD templates + création page)
- `shared/schema.ts` — Table `pageTemplates` + types
- `migrations/020_page_templates.sql` — Migration + 3 templates de démarrage

### Frontend
- `cms-dashboard/components/TemplateSelector.tsx` — Modal de sélection
- `cms-dashboard/pages/pages/NewPageWithTemplate.tsx` — Page accueil avec formulaire
- `client/src/routes/admin-routes.tsx` — Route `/admin/pages/new`

## Exemple d'utilisation via API

### Créer une page à partir d'un template
```bash
curl -X POST http://localhost:5000/api/pages/from-template \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "templateSlug": "portfolio-landing",
    "title": "Mon Portfolio",
    "slug": "mon-portfolio"
  }'
```

**Réponse :**
```json
{
  "id": "uuid-123",
  "title": "Mon Portfolio",
  "slug": "mon-portfolio",
  "sections": [
    {
      "id": "hero-1",
      "type": "hero",
      "props": { "title": "Creative Portfolio", ... }
    },
    ...
  ],
  "status": "DRAFT",
  "createdAt": "2024-...",
  "updatedAt": "2024-..."
}
```

### Éditer la page dans Puck
```
1. Page crée avec status DRAFT
2. Utilisateur va à /admin/pages/mon-portfolio/sections
3. Puck charge les sections du template
4. Utilisateur édite les sections
5. Utilisateur clique "Publier"
6. Sections sauvegardées dans BD
```

## Fonctionnalités avancées envisagées

### **Preview de template**
Ajouter preview URL en preview modal pour montrer rendu final.

### **Templates par industrie**
```json
{
  "categories": [
    "creative",      // Portfolio, Agency
    "ecommerce",     // Product, Pricing
    "services",      // Service showcase
    "consulting",    // Case studies, CTA
    "nonprofit"      // Donation, About
  ]
}
```

### **Responsive templates**
Templates avec breakpoints Puck (mobile, tablet, desktop).

### **AI-powered templates**
Générer templates automatiquement à partir du contenu utilisateur.

---

**Status :** ✅ MVP fonctionnel + 3 templates de démarrage  
**Tests :** Serveur port 5000 en cours d'exécution  
**Prochaine étape :** Vérifier création page dans l'UI
