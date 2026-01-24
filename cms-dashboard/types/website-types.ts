// Types spécifiques pour le contenu du site Epitaph

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
  schema?: object;
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  content: string;
  seo: SEOData;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
  author: string;
}

export interface MenuLink {
  id: string;
  label: string;
  href: string;
  hash?: string;
  hasSubmenu: boolean;
  order: number;
  isActive: boolean;
  submenu?: SubMenuLink[];
}

export interface SubMenuLink {
  id: string;
  label: string;
  href: string;
  description?: string;
  order: number;
  isActive: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  tags: string[];
  category: string;
  author: string;
  publishedAt: Date;
  status: 'draft' | 'published' | 'scheduled';
  seo: SEOData;
  createdAt: Date;
  updatedAt: Date;
}

export interface Solution {
  id: string;
  slug: string;
  label: string;
  category: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  needs: string[];
  content: string;
  seo: SEOData;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  logoUrl?: string;
  faviconUrl?: string;
  defaultSeo: SEOData;
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  socialLinks: {
    platform: string;
    url: string;
  }[];
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
}

export interface NavigationStructure {
  id: string;
  name: string;
  location: 'header' | 'footer' | 'sidebar';
  links: MenuLink[];
  isActive: boolean;
  updatedAt: Date;
}