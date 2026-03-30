// ========================================
// CMS Dashboard - Router Configuration
// ========================================

import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';

// Import pages
import { DashboardLayout } from './layouts/DashboardLayout';
import { NewLoginPage } from './pages/NewLoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MediaLibrary } from './pages/MediaLibrary';
import { ArticlesList, ArticleForm } from './pages/articles';
import { EventsList, EventForm } from './pages/events';
import { PagesList, PageForm } from './pages/pages';
import { CategoriesList } from './pages/categories';
import { UsersList } from './pages/users';
import { GeneralSettings, SEOSettings, IntegrationSettings } from './pages/settings';
import { VisualEditorManagement } from './pages/plasmic';
import GrapesJSEditor from './pages/plasmic/GrapesJSEditor';

// ── Nouvelles pages câblées ──────────────────────────────────────────────────
import { BlogManagement } from './pages/blog/BlogManagement';
import { CaseStudiesList } from './pages/case-studies/CaseStudiesList';
import { CaseStudyForm } from './pages/case-studies/CaseStudyForm';
import { ClientsList } from './pages/clients/ClientsList';
import { ContactsList } from './pages/contacts/ContactsList';
import { LeadsList } from './pages/leads/LeadsList';
import { MenuManagement } from './pages/menu/MenuManagement';
import { NewsletterList } from './pages/newsletter/NewsletterList';
import { PushBroadcastPage } from './pages/push/PushBroadcastPage';
import { QRCodesList } from './pages/qr-codes/QRCodesList';
import { ReferencesList } from './pages/references/ReferencesList';
import { ReferenceForm } from './pages/references/ReferenceForm';
import { ResourcesList } from './pages/resources/ResourcesList';
import { ServicesList } from './pages/services/ServicesList';
import { ServiceForm } from './pages/services/ServiceForm';
import { SolutionManagement } from './pages/solutions/SolutionManagement';
import { TeamList } from './pages/team/TeamList';
import { TeamForm } from './pages/team/TeamForm';
import { TestimonialsList } from './pages/testimonials/TestimonialsList';
import { TestimonialForm } from './pages/testimonials/TestimonialForm';
import { PageManagement } from './pages/website/PageManagement';
import { HomepageSettings } from './pages/homepage/HomepageSettings';
import { ScoringResultsList } from './pages/scoring/ScoringResultsList';
import { ClientProjectsAdmin } from './pages/clients/ClientProjectsAdmin';
import { BriefFormEditor } from './pages/forms/BriefFormEditor';
import { ScoringQuestionsEditor } from './pages/forms/ScoringQuestionsEditor';
import { AppearanceSettings } from './pages/appearance/AppearanceSettings';

// Auth guard component
interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  loginPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated,
  loginPath = '/admin/login',
}) => {
  if (!isAuthenticated) {
    return <Navigate to={loginPath} replace />;
  }
  return <>{children}</>;
};

// Get dashboard routes
export const getDashboardRoutes = (
  basePath: string = '/admin',
  isAuthenticated: boolean = false
): RouteObject[] => {
  return [
    {
      path: `${basePath}/login`,
      element: <NewLoginPage />,
    },
    {
      path: basePath,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        // Articles
        {
          path: 'articles',
          element: <ArticlesList />,
        },
        {
          path: 'articles/new',
          element: <ArticleForm />,
        },
        {
          path: 'articles/:id/edit',
          element: <ArticleForm />,
        },
        // Events
        {
          path: 'events',
          element: <EventsList />,
        },
        {
          path: 'events/new',
          element: <EventForm />,
        },
        {
          path: 'events/:id/edit',
          element: <EventForm />,
        },
        // Pages
        {
          path: 'pages',
          element: <PagesList />,
        },
        {
          path: 'pages/new',
          element: <PageForm />,
        },
        {
          path: 'pages/:id/edit',
          element: <PageForm />,
        },
        // Visual Editor (GrapesJS)
        {
          path: 'visual-editor',
          element: <VisualEditorManagement />,
        },
        {
          path: 'visual-editor/edit/:pageId',
          element: <GrapesJSEditor />,
        },
        // Media
        {
          path: 'media',
          element: <MediaLibrary />,
        },
        // Categories
        {
          path: 'categories',
          element: <CategoriesList />,
        },
        // Users
        {
          path: 'users',
          element: <UsersList />,
        },
        // Settings
        {
          path: 'appearance',
          element: <AppearanceSettings />,
        },
        {
          path: 'settings/general',
          element: <GeneralSettings />,
        },
        {
          path: 'settings/seo',
          element: <SEOSettings />,
        },
        {
          path: 'settings/integrations',
          element: <IntegrationSettings />,
        },
        // ── Blog → redirige vers Articles (doublon éliminé)
        {
          path: 'blog',
          element: <Navigate to={`${basePath}/articles`} replace />,
        },
        // ── Resources ───────────────────────────────────────────────────────
        {
          path: 'resources',
          element: <ResourcesList />,
        },
        // ── Clients (Espace Client accounts) ────────────────────────────────
        {
          path: 'clients',
          element: <ClientsList />,
        },
        // ── Newsletter ───────────────────────────────────────────────────────
        {
          path: 'newsletter',
          element: <NewsletterList />,
        },
        // ── Leads ────────────────────────────────────────────────────────────
        {
          path: 'leads',
          element: <LeadsList />,
        },
        // ── Contacts ─────────────────────────────────────────────────────────
        {
          path: 'contacts',
          element: <ContactsList />,
        },
        // ── Services ─────────────────────────────────────────────────────────
        {
          path: 'services',
          element: <ServicesList />,
        },
        {
          path: 'services/new',
          element: <ServiceForm />,
        },
        {
          path: 'services/:id/edit',
          element: <ServiceForm />,
        },
        // ── Case Studies ─────────────────────────────────────────────────────
        {
          path: 'case-studies',
          element: <CaseStudiesList />,
        },
        {
          path: 'case-studies/new',
          element: <CaseStudyForm />,
        },
        {
          path: 'case-studies/:id/edit',
          element: <CaseStudyForm />,
        },
        // ── Testimonials ──────────────────────────────────────────────────────
        {
          path: 'testimonials',
          element: <TestimonialsList />,
        },
        {
          path: 'testimonials/new',
          element: <TestimonialForm />,
        },
        {
          path: 'testimonials/:id/edit',
          element: <TestimonialForm />,
        },
        // ── Team ─────────────────────────────────────────────────────────────
        {
          path: 'team',
          element: <TeamList />,
        },
        {
          path: 'team/new',
          element: <TeamForm />,
        },
        {
          path: 'team/:id/edit',
          element: <TeamForm />,
        },
        // ── References ───────────────────────────────────────────────────────
        {
          path: 'references',
          element: <ReferencesList />,
        },
        {
          path: 'references/new',
          element: <ReferenceForm />,
        },
        {
          path: 'references/:id/edit',
          element: <ReferenceForm />,
        },
        // ── Solutions ────────────────────────────────────────────────────────
        {
          path: 'solutions',
          element: <SolutionManagement />,
        },
        // ── Menu ─────────────────────────────────────────────────────────────
        {
          path: 'menu',
          element: <MenuManagement />,
        },
        // ── Website pages ────────────────────────────────────────────────────
        {
          path: 'website',
          element: <PageManagement />,
        },
        // ── Push notifications ───────────────────────────────────────────────
        {
          path: 'push',
          element: <PushBroadcastPage />,
        },
        // ── QR Codes ─────────────────────────────────────────────────────────
        {
          path: 'qr-codes',
          element: <QRCodesList />,
        },
        // ── Homepage Settings ─────────────────────────────────────────────────
        {
          path: 'homepage',
          element: <HomepageSettings />,
        },
        // ── Scoring BMI 360™ ─────────────────────────────────────────────────
        {
          path: 'scoring',
          element: <ScoringResultsList />,
        },
        // ── Projets Clients ────────────────────────────────────────────────────
        {
          path: 'client-projects',
          element: <ClientProjectsAdmin />,
        },
        // ── Formulaires ──────────────────────────────────────────────────────
        {
          path: 'forms/brief',
          element: <BriefFormEditor />,
        },
        {
          path: 'forms/scoring',
          element: <ScoringQuestionsEditor />,
        },
      ],
    },
  ];
};

export default getDashboardRoutes;
