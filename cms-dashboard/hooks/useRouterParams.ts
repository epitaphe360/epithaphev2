// ========================================
// Hook wrapper pour compatibilité react-router-dom → wouter
// ========================================

import { useLocation } from 'wouter';

// Tous les segments d'URL admin qui contiennent un :id
const EDIT_SEGMENTS = [
  '/admin/articles/',
  '/admin/events/',
  '/admin/pages/',
  '/admin/services/',
  '/admin/references/',
  '/admin/case-studies/',
  '/admin/testimonials/',
  '/admin/team/',
  '/admin/categories/',
  '/admin/users/',
  '/admin/leads/',
  '/admin/resources/',
];

/**
 * Hook compatibilité: simule useParams() de react-router-dom
 * avec le comportement de wouter
 */
export function useParams() {
  const [currentPath] = useLocation();

  const params: Record<string, string> = {};

  // Pattern générique: /admin/<section>/:id[/edit]
  for (const segment of EDIT_SEGMENTS) {
    if (currentPath.includes(segment)) {
      const escaped = segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const match = currentPath.match(new RegExp(escaped + '([^/]+)'));
      if (match) {
        params.id = match[1];
        break;
      }
    }
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
