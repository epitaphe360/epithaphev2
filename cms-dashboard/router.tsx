// ========================================
// CMS Dashboard - Router Configuration
// ========================================

import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';

// Import pages
import { DashboardLayout } from './layouts/DashboardLayout';
import { NewLoginPage } from './pages/NewLoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { MediaLibrary } from './pages/MediaLibrary';
import { ArticlesList, ArticleForm } from './pages/articles';
import { EventsList, EventForm } from './pages/events';
import { PagesList, PageForm } from './pages/pages';
import HomeSectionsEditor from './pages/pages/HomeSectionsEditor';
import { CategoriesList } from './pages/categories';
import { UsersList, UserForm } from './pages/users';
import { GeneralSettings, SEOSettings, IntegrationSettings, InvoiceSettings } from './pages/settings';
import { VisualEditorManagement } from './pages/plasmic';
import GrapesJSEditor from './pages/plasmic/GrapesJSEditor';
import { ServicesList, ServiceForm } from './pages/services';
import { ReferencesList, ReferenceForm } from './pages/references';
import { CaseStudiesList, CaseStudyForm } from './pages/case-studies';
import { TestimonialsList, TestimonialForm } from './pages/testimonials';
import { TeamList, TeamForm } from './pages/team';
import { LeadsList } from './pages/leads';
import { NewsletterList } from './pages/newsletter';
import { ContactsList } from './pages/contacts';
import { QRCodesList } from './pages/qr-codes/QRCodesList';
import { PushBroadcastPage } from './pages/push/PushBroadcastPage';
import { ResourcesList } from './pages/resources/ResourcesList';
import MenuManagement from './pages/menu/MenuManagement';
import { ClientAccountsPage } from './pages/client-accounts/ClientAccountsPage';
import { AuditLogsPage } from './pages/audit-logs/AuditLogsPage';
import { FacturationPage } from './pages/facturation/FacturationPage';

// Pages additionnelles (modules métier)
import DevisList from './pages/devis/DevisList';
import HomepageSettings from './pages/homepage/HomepageSettings';
import PaymentsList from './pages/payments/PaymentsList';
import PlansList from './pages/plans/PlansList';
import ScoringResultsList from './pages/scoring/ScoringResultsList';
import FunnelPage from './pages/scoring/FunnelPage';
import ConsultationsPage from './pages/scoring/ConsultationsPage';
import ScoringPromptSettings from './pages/scoring/ScoringPromptSettings';
import SolutionManagement from './pages/solutions/SolutionManagement';
import PageManagement from './pages/website/PageManagement';
import ClientsList from './pages/clients/ClientsList';
import ClientProjectsAdmin from './pages/clients/ClientProjectsAdmin';
import BriefFormEditor from './pages/forms/BriefFormEditor';
import ScoringQuestionsEditor from './pages/forms/ScoringQuestionsEditor';
import AppearanceSettings from './pages/appearance/AppearanceSettings';
import BlogManagement from './pages/blog/BlogManagement';

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
    // Auth publiques
    { path: `${basePath}/login`,           element: <NewLoginPage /> },
    { path: `${basePath}/forgot-password`, element: <ForgotPasswordPage /> },
    { path: `${basePath}/reset-password`,  element: <ResetPasswordPage /> },

    // Dashboard protégé
    {
      path: basePath,
      element: (
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <DashboardPage /> },

        // ── Contenu ────────────────────────────────────
        { path: 'articles',            element: <ArticlesList /> },
        { path: 'articles/new',        element: <ArticleForm /> },
        { path: 'articles/:id/edit',   element: <ArticleForm /> },

        { path: 'events',              element: <EventsList /> },
        { path: 'events/new',          element: <EventForm /> },
        { path: 'events/:id/edit',     element: <EventForm /> },

        { path: 'pages',               element: <PagesList /> },
        { path: 'pages/home/sections', element: <HomeSectionsEditor /> },
        { path: 'pages/:pageSlug/sections', element: <HomeSectionsEditor /> },
        { path: 'pages/new',           element: <PageForm /> },
        { path: 'pages/:id/edit',      element: <PageForm /> },

        { path: 'visual-editor',                element: <VisualEditorManagement /> },
        { path: 'visual-editor/edit/:pageId',   element: <GrapesJSEditor /> },

        { path: 'services',            element: <ServicesList /> },
        { path: 'services/new',        element: <ServiceForm /> },
        { path: 'services/:id/edit',   element: <ServiceForm /> },

        { path: 'references',          element: <ReferencesList /> },
        { path: 'references/new',      element: <ReferenceForm /> },
        { path: 'references/:id/edit', element: <ReferenceForm /> },

        { path: 'case-studies',            element: <CaseStudiesList /> },
        { path: 'case-studies/new',        element: <CaseStudyForm /> },
        { path: 'case-studies/:id/edit',   element: <CaseStudyForm /> },

        { path: 'testimonials',            element: <TestimonialsList /> },
        { path: 'testimonials/new',        element: <TestimonialForm /> },
        { path: 'testimonials/:id/edit',   element: <TestimonialForm /> },

        { path: 'team',                element: <TeamList /> },
        { path: 'team/new',            element: <TeamForm /> },
        { path: 'team/:id/edit',       element: <TeamForm /> },

        // ── Communications ─────────────────────────────
        { path: 'leads',               element: <LeadsList /> },
        { path: 'newsletter',          element: <NewsletterList /> },
        { path: 'contacts',            element: <ContactsList /> },
        { path: 'push',                element: <PushBroadcastPage /> },

        // ── Outils ────────────────────────────────────
        { path: 'qr-codes',            element: <QRCodesList /> },
        { path: 'resources',           element: <ResourcesList /> },
        { path: 'menus',               element: <MenuManagement /> },

        // ── Espace Client ──────────────────────────────
        { path: 'client-accounts',     element: <ClientAccountsPage /> },
        { path: 'clients',             element: <ClientsList /> },
        { path: 'clients/projects',    element: <ClientProjectsAdmin /> },
        // ── Facturation & Commerce ─────────────────────────────
        { path: 'facturation',         element: <FacturationPage /> },
        { path: 'devis',               element: <DevisList /> },
        { path: 'payments',            element: <PaymentsList /> },
        { path: 'plans',               element: <PlansList /> },
        // ── Scoring / Funnel / Consultations ───────────────────
        { path: 'scoring',                element: <ScoringResultsList /> },
        { path: 'scoring/results',        element: <ScoringResultsList /> },
        { path: 'scoring/funnel',         element: <FunnelPage /> },
        { path: 'scoring/consultations',  element: <ConsultationsPage /> },
        { path: 'scoring/prompts',        element: <ScoringPromptSettings /> },
        { path: 'bmi360/funnel',          element: <FunnelPage /> },
        { path: 'bmi360/consultations',   element: <ConsultationsPage /> },
        { path: 'bmi360/prompts',         element: <ScoringPromptSettings /> },
        // ── Site / Contenu ─────────────────────────────────────
        { path: 'homepage',            element: <HomepageSettings /> },
        { path: 'website',             element: <PageManagement /> },
        { path: 'solutions',           element: <SolutionManagement /> },
        { path: 'blog',                element: <BlogManagement /> },
        { path: 'appearance',          element: <AppearanceSettings /> },
        // ── Formulaires (éditeurs) ────────────────────────────
        { path: 'forms/brief',         element: <BriefFormEditor /> },
        { path: 'forms/scoring',       element: <ScoringQuestionsEditor /> },
        // ── Administration ─────────────────────────────
        { path: 'audit-logs',          element: <AuditLogsPage /> },
        { path: 'categories',          element: <CategoriesList /> },
        { path: 'media',               element: <MediaLibrary /> },

        { path: 'users',               element: <UsersList /> },
        { path: 'users/new',           element: <UserForm /> },
        { path: 'users/:id/edit',      element: <UserForm /> },

        { path: 'settings/general',       element: <GeneralSettings /> },
        { path: 'settings/seo',           element: <SEOSettings /> },
        { path: 'settings/integrations',  element: <IntegrationSettings /> },
        { path: 'settings/invoice',       element: <InvoiceSettings /> },
      ],
    },
  ];
};

export default getDashboardRoutes;
