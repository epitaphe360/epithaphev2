// ========================================
// Hook wrapper pour compatibilité react-router-dom → wouter
// ========================================

import { useLocation } from 'wouter';

/**
 * Hook compatibilité: simule useParams() de react-router-dom
 * avec le comportement de wouter
 */
export function useParams() {
  const [currentPath] = useLocation();
  
  // Extrait les paramètres de l'URL actuelle
  // Cela fonctionne avec les routes définie dans App.tsx
  const params: Record<string, string> = {};
  
  // Essayer d'extraire les params basés sur les patterns de route connus
  // Pattern: /admin/articles/:id/edit
  if (currentPath.includes('/admin/articles/') && currentPath.includes('/edit')) {
    const match = currentPath.match(/\/admin\/articles\/([^/]+)/);
    if (match) params.id = match[1];
  }
  
  // Pattern: /admin/events/:id/edit
  if (currentPath.includes('/admin/events/') && currentPath.includes('/edit')) {
    const match = currentPath.match(/\/admin\/events\/([^/]+)/);
    if (match) params.id = match[1];
  }
  
  // Pattern: /admin/pages/:id/edit
  if (currentPath.includes('/admin/pages/') && currentPath.includes('/edit')) {
    const match = currentPath.match(/\/admin\/pages\/([^/]+)/);
    if (match) params.id = match[1];
  }
  
  // Pattern: /admin/visual-editor/edit/:pageId
  if (currentPath.includes('/admin/visual-editor/edit/')) {
    const match = currentPath.match(/\/admin\/visual-editor\/edit\/([^/]+)/);
    if (match) params.pageId = match[1];
  }
  
  return params;
}

/**
 * Hook compatibilité: simule useNavigate() de react-router-dom
 * retourne une fonction navigate(path) qui fonctionne avec wouter
 */
export function useNavigate() {
  const [, setLocation] = useLocation();

  return (path: string) => {
    setLocation(path);
  };
}
