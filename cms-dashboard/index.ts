// ========================================
// CMS Dashboard - Main Entry Point
// ========================================

// Configuration
export { 
  DashboardConfigProvider, 
  useDashboardConfig, 
  defaultConfig,
  type DashboardConfig,
  type NavigationItem,
  type ModuleConfig 
} from './config.tsx';

// Types
export * from './types';
export * from './types/templates';

// Store
export { createAuthStore, useAuthStore } from './store/authStore';

// API
export { createApiClient, initializeApi, getApi, apiHelpers } from './lib/api';

// Hooks
export {
  useApiQuery,
  useMutation,
  usePagination,
  useDebounce,
  useConfirm,
  useMediaUpload,
} from './hooks/useApi';

// UI Components
export { Button, IconButton } from './components/Button';
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from './components/Card';
export { Input, PasswordInput, SearchInput, Textarea, Select } from './components/Input';
export { Modal, ConfirmDialog, AlertDialog } from './components/Modal';
export { Table, Pagination, type Column, type TableProps } from './components/Table';
export { Badge, StatusBadge, CountBadge } from './components/Badge';
export { RichTextEditor, MarkdownEditor } from './components/RichTextEditor';
export { FileUpload, ImagePreview, MediaGrid } from './components/FileUpload';
export { ToastProvider, useToast } from './components/Toast';
export { Sidebar } from './components/Sidebar';

// Layouts
export { DashboardLayout } from './layouts/DashboardLayout';

// Pages
export { NewLoginPage as LoginPage } from './pages/NewLoginPage';
export { default as Dashboard } from './pages/Dashboard';
export { DashboardPage } from './pages/DashboardPage';
export { MediaLibrary } from './pages/MediaLibrary';
export { ArticlesList, ArticleForm } from './pages/articles';
export { EventsList, EventForm } from './pages/events';
export { PagesList, PageForm } from './pages/pages';
