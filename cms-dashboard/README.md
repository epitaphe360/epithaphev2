# 📦 CMS Dashboard Module

Module de tableau de bord administrateur réutilisable pour tout site web.

## 🚀 Installation

1. Copiez le dossier `cms-dashboard` dans votre projet
2. Installez les dépendances requises :

```bash
npm install zustand react-router-dom lucide-react axios react-hot-toast react-quill
```

3. Configurez votre API backend

## 📁 Structure du Module

```
cms-dashboard/
├── components/         # Composants UI réutilisables
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Table.tsx
│   ├── Badge.tsx
│   └── RichTextEditor.tsx
├── layouts/
│   └── DashboardLayout.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── articles/
│   ├── events/
│   ├── pages/
│   └── media/
├── store/
│   └── authStore.ts
├── hooks/
│   └── useApi.ts
├── lib/
│   └── api.ts
├── types/
│   └── index.ts
├── config.ts           # Configuration personnalisable
└── index.tsx           # Point d'entrée
```

## ⚙️ Configuration

```typescript
// config.ts
export const dashboardConfig = {
  appName: 'Mon Site',
  logo: '/logo.png',
  primaryColor: '#E63946',
  apiUrl: 'http://localhost:5000/api',
  modules: {
    articles: true,
    events: true,
    pages: true,
    media: true,
  },
  navigation: [
    { name: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { name: 'Articles', href: '/admin/articles', icon: 'FileText' },
    { name: 'Événements', href: '/admin/evenements', icon: 'Calendar' },
    { name: 'Pages', href: '/admin/pages', icon: 'FileEdit' },
    { name: 'Médias', href: '/admin/media', icon: 'Image' },
  ],
};
```

## 🔧 Utilisation

```tsx
import { CMSDashboard, dashboardRoutes } from './cms-dashboard';

// Dans votre App.tsx
<Route path="/admin/*" element={
  <ProtectedRoute>
    <CMSDashboard config={dashboardConfig} />
  </ProtectedRoute>
}>
  {dashboardRoutes}
</Route>
```

## 🎨 Personnalisation

Le module supporte la personnalisation via :
- `config.ts` : Configuration globale
- Tailwind CSS : Styles personnalisables
- Slots : Injection de composants custom

## 📋 Fonctionnalités

- ✅ Authentification avec JWT
- ✅ Gestion des articles (CRUD)
- ✅ Gestion des événements (CRUD)
- ✅ Gestion des pages dynamiques
- ✅ Médiathèque avec upload
- ✅ Éditeur de texte riche
- ✅ Responsive design
- ✅ Dark mode ready
