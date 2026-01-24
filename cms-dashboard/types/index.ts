// ========================================
// CMS Dashboard - Types
// ========================================

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'USER';
  avatar?: string;
  createdAt?: string;
}

// Article types
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  author?: User;
  authorId: string;
  tag?: string; 
  categoryId?: string;
  category?: Category;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// Event types
export interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  content: string;
  featuredImage?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  address?: string;
  price?: string;
  isOnline: boolean;
  registrationUrl?: string;
  maxAttendees?: number;
  capacity?: number;
  registrations?: number;
  metaTitle?: string;
  metaDescription?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED';
  author?: User;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

// Page types
export interface PageSection {
  id: string;
  type: string;
  order: number;
  title?: string;
  subtitle?: string;
  content?: string;
  [key: string]: any;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isHomePage: boolean;
  metaTitle?: string;
  metaDescription?: string;
  template?: string;
  sections: PageSection[];
  author?: User;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

// Media types
export interface Media {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  type?: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  caption?: string;
  uploadedBy?: User;
  uploadedById: string;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface ArticleFormData {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  status: 'DRAFT' | 'PUBLISHED';
  categoryId?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
}

export interface EventFormData {
  title: string;
  slug?: string;
  description?: string;
  content: string;
  featuredImage?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  address?: string;
  price?: string;
  isOnline: boolean;
  registrationUrl?: string;
  maxAttendees?: number;
  capacity?: number;
  status: 'DRAFT' | 'PUBLISHED';
  metaTitle?: string;
  metaDescription?: string;
}

export interface PageFormData {
  title: string;
  slug?: string;
  status: 'DRAFT' | 'PUBLISHED';
  isHomePage: boolean;
  metaTitle?: string;
  metaDescription?: string;
  sections: PageSection[];
}

// Stats types
export interface DashboardStats {
  articles: number;
  events: number;
  pages: number;
  media: number;
  users?: number;
}

// Table types
export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: 'primary' | 'secondary' | 'danger';
  condition?: (item: T) => boolean;
}

// Import website-specific types
export * from './website-types';
