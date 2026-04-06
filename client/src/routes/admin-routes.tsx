/**
 * Admin Routes — CMS Dashboard
 * Lazy-loaded pour ne pas impacter le bundle des pages publiques.
 */
import { lazy, Suspense, useEffect } from "react";
import { Route, useLocation } from "wouter";
import { useAuthStore } from "../../../cms-dashboard/store/authStore";
import { ErrorBoundary } from "@/components/error-boundary";
import type { ReactNode } from "react";

// ─── Lazy imports ─────────────────────────────────────────────────────────────
const DashboardLayout       = lazy(() => import("../../../cms-dashboard/layouts/DashboardLayout").then(m => ({ default: m.DashboardLayout })));
const NewLoginPage          = lazy(() => import("../../../cms-dashboard/pages/NewLoginPage").then(m => ({ default: m.NewLoginPage })));
const DashboardPage         = lazy(() => import("../../../cms-dashboard/pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const MenuManagement        = lazy(() => import("../../../cms-dashboard/pages/menu/MenuManagement"));
const BlogManagement        = lazy(() => import("../../../cms-dashboard/pages/blog/BlogManagement"));
const PageManagement        = lazy(() => import("../../../cms-dashboard/pages/website/PageManagement"));
const SolutionManagement    = lazy(() => import("../../../cms-dashboard/pages/solutions/SolutionManagement"));
const ArticlesList          = lazy(() => import("../../../cms-dashboard/pages/articles").then(m => ({ default: m.ArticlesList })));
const ArticleForm           = lazy(() => import("../../../cms-dashboard/pages/articles").then(m => ({ default: m.ArticleForm })));
const EventsList            = lazy(() => import("../../../cms-dashboard/pages/events").then(m => ({ default: m.EventsList })));
const EventForm             = lazy(() => import("../../../cms-dashboard/pages/events").then(m => ({ default: m.EventForm })));
const PagesList             = lazy(() => import("../../../cms-dashboard/pages/pages").then(m => ({ default: m.PagesList })));
const PageForm              = lazy(() => import("../../../cms-dashboard/pages/pages").then(m => ({ default: m.PageForm })));
const MediaLibrary          = lazy(() => import("../../../cms-dashboard/pages/MediaLibrary").then(m => ({ default: m.MediaLibrary })));
const CategoriesList        = lazy(() => import("../../../cms-dashboard/pages/categories").then(m => ({ default: m.CategoriesList })));
const UsersList             = lazy(() => import("../../../cms-dashboard/pages/users").then(m => ({ default: m.UsersList })));
const GeneralSettings       = lazy(() => import("../../../cms-dashboard/pages/settings").then(m => ({ default: m.GeneralSettings })));
const SEOSettings           = lazy(() => import("../../../cms-dashboard/pages/settings").then(m => ({ default: m.SEOSettings })));
const IntegrationSettings   = lazy(() => import("../../../cms-dashboard/pages/settings").then(m => ({ default: m.IntegrationSettings })));
const VisualEditorMgmt      = lazy(() => import("../../../cms-dashboard/pages/plasmic").then(m => ({ default: m.VisualEditorManagement })));
const GrapesJSEditor        = lazy(() => import("../../../cms-dashboard/pages/plasmic/GrapesJSEditor"));
const ServicesList          = lazy(() => import("../../../cms-dashboard/pages/services").then(m => ({ default: m.ServicesList })));
const ReferencesList        = lazy(() => import("../../../cms-dashboard/pages/references").then(m => ({ default: m.ReferencesList })));
const CaseStudiesList       = lazy(() => import("../../../cms-dashboard/pages/case-studies").then(m => ({ default: m.CaseStudiesList })));
const TestimonialsList      = lazy(() => import("../../../cms-dashboard/pages/testimonials").then(m => ({ default: m.TestimonialsList })));
const TeamList              = lazy(() => import("../../../cms-dashboard/pages/team").then(m => ({ default: m.TeamList })));
const LeadsList             = lazy(() => import("../../../cms-dashboard/pages/leads").then(m => ({ default: m.LeadsList })));
const NewsletterList        = lazy(() => import("../../../cms-dashboard/pages/newsletter").then(m => ({ default: m.NewsletterList })));
const ContactsList          = lazy(() => import("../../../cms-dashboard/pages/contacts").then(m => ({ default: m.ContactsList })));
const QRCodesList           = lazy(() => import("../../../cms-dashboard/pages/qr-codes/QRCodesList").then(m => ({ default: m.QRCodesList })));
const PushBroadcastPage     = lazy(() => import("../../../cms-dashboard/pages/push/PushBroadcastPage").then(m => ({ default: m.PushBroadcastPage })));
const AdminResourcesList    = lazy(() => import("../../../cms-dashboard/pages/resources/ResourcesList").then(m => ({ default: m.ResourcesList })));
const ScoringResultsList    = lazy(() => import("../../../cms-dashboard/pages/scoring/ScoringResultsList").then(m => ({ default: m.ScoringResultsList })));
const ClientProjectsAdmin   = lazy(() => import("../../../cms-dashboard/pages/clients/ClientProjectsAdmin").then(m => ({ default: m.ClientProjectsAdmin })));
const ClientsList           = lazy(() => import("../../../cms-dashboard/pages/clients/ClientsList").then(m => ({ default: m.ClientsList })));
const DevisList             = lazy(() => import("../../../cms-dashboard/pages/devis/DevisList").then(m => ({ default: m.DevisList })));
const PlansList             = lazy(() => import("../../../cms-dashboard/pages/plans/PlansList").then(m => ({ default: m.PlansList })));
const PaymentsList          = lazy(() => import("../../../cms-dashboard/pages/payments/PaymentsList").then(m => ({ default: m.PaymentsList })));
const AnalyticsDashboard    = lazy(() => import("../pages/analytics/index"));
const HomepageSettings      = lazy(() => import("../../../cms-dashboard/pages/homepage/HomepageSettings").then(m => ({ default: m.HomepageSettings })));
const AppearanceSettings    = lazy(() => import("../../../cms-dashboard/pages/appearance/AppearanceSettings").then(m => ({ default: m.AppearanceSettings })));
const BriefFormEditor       = lazy(() => import("../../../cms-dashboard/pages/forms/BriefFormEditor").then(m => ({ default: m.BriefFormEditor })));
const ScoringQuestionsEditor = lazy(() => import("../../../cms-dashboard/pages/forms/ScoringQuestionsEditor").then(m => ({ default: m.ScoringQuestionsEditor })));
const ClientAccountsPage    = lazy(() => import("../../../cms-dashboard/pages/client-accounts/ClientAccountsPage").then(m => ({ default: m.ClientAccountsPage })));
const AuditLogsPage         = lazy(() => import("../../../cms-dashboard/pages/audit-logs/AuditLogsPage").then(m => ({ default: m.AuditLogsPage })));
const ForgotPasswordPage    = lazy(() => import("../../../cms-dashboard/pages/ForgotPasswordPage").then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage     = lazy(() => import("../../../cms-dashboard/pages/ResetPasswordPage").then(m => ({ default: m.ResetPasswordPage })));

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

// ─── Helper: wraps page in ProtectedRoute + DashboardLayout ──────────────────
function AdminPage({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

// ─── AdminRoutes ──────────────────────────────────────────────────────────────
export function AdminRoutes() {
  return (
    <>
      <Route path="/admin/login" component={NewLoginPage} />
      <Route path="/admin/forgot-password" component={ForgotPasswordPage} />
      <Route path="/admin/reset-password" component={ResetPasswordPage} />

      {/* Dashboard */}
      <Route path="/admin">
        {() => <AdminPage><DashboardPage /></AdminPage>}
      </Route>

      {/* Articles */}
      <Route path="/admin/articles">
        {() => <AdminPage><ArticlesList /></AdminPage>}
      </Route>
      <Route path="/admin/articles/new">
        {() => <AdminPage><ArticleForm /></AdminPage>}
      </Route>
      <Route path="/admin/articles/:id/edit">
        {() => <AdminPage><ArticleForm /></AdminPage>}
      </Route>

      {/* Events */}
      <Route path="/admin/events">
        {() => <AdminPage><EventsList /></AdminPage>}
      </Route>
      <Route path="/admin/events/new">
        {() => <AdminPage><EventForm /></AdminPage>}
      </Route>
      <Route path="/admin/events/:id/edit">
        {() => <AdminPage><EventForm /></AdminPage>}
      </Route>

      {/* Pages */}
      <Route path="/admin/pages">
        {() => <AdminPage><PagesList /></AdminPage>}
      </Route>
      <Route path="/admin/pages/new">
        {() => <AdminPage><PageForm /></AdminPage>}
      </Route>
      <Route path="/admin/pages/:id/edit">
        {() => <AdminPage><PageForm /></AdminPage>}
      </Route>

      {/* Visual Editor */}
      <Route path="/admin/visual-editor">
        {() => <AdminPage><VisualEditorMgmt /></AdminPage>}
      </Route>
      <Route path="/admin/visual-editor/edit/:pageId">
        {() => <AdminPage><GrapesJSEditor /></AdminPage>}
      </Route>

      {/* Media */}
      <Route path="/admin/media">
        {() => <AdminPage><MediaLibrary /></AdminPage>}
      </Route>

      {/* Categories */}
      <Route path="/admin/categories">
        {() => <AdminPage><CategoriesList /></AdminPage>}
      </Route>

      {/* Users */}
      <Route path="/admin/users">
        {() => <AdminPage><UsersList /></AdminPage>}
      </Route>

      {/* Settings */}
      <Route path="/admin/settings/general">
        {() => <AdminPage><GeneralSettings /></AdminPage>}
      </Route>
      <Route path="/admin/settings/seo">
        {() => <AdminPage><SEOSettings /></AdminPage>}
      </Route>
      <Route path="/admin/settings/integrations">
        {() => <AdminPage><IntegrationSettings /></AdminPage>}
      </Route>

      {/* Services */}
      <Route path="/admin/services">
        {() => <AdminPage><ServicesList /></AdminPage>}
      </Route>

      {/* Références */}
      <Route path="/admin/references">
        {() => <AdminPage><ReferencesList /></AdminPage>}
      </Route>

      {/* Études de cas */}
      <Route path="/admin/case-studies">
        {() => <AdminPage><CaseStudiesList /></AdminPage>}
      </Route>

      {/* Témoignages */}
      <Route path="/admin/testimonials">
        {() => <AdminPage><TestimonialsList /></AdminPage>}
      </Route>

      {/* Équipe */}
      <Route path="/admin/team">
        {() => <AdminPage><TeamList /></AdminPage>}
      </Route>

      {/* Leads */}
      <Route path="/admin/leads">
        {() => <AdminPage><LeadsList /></AdminPage>}
      </Route>

      {/* Newsletter */}
      <Route path="/admin/newsletter">
        {() => <AdminPage><NewsletterList /></AdminPage>}
      </Route>

      {/* Contacts */}
      <Route path="/admin/contacts">
        {() => <AdminPage><ContactsList /></AdminPage>}
      </Route>

      {/* QR Codes */}
      <Route path="/admin/qr-codes">
        {() => <AdminPage><QRCodesList /></AdminPage>}
      </Route>

      {/* Push Broadcast */}
      <Route path="/admin/push">
        {() => <AdminPage><PushBroadcastPage /></AdminPage>}
      </Route>

      {/* Ressources Clients */}
      <Route path="/admin/resources">
        {() => <AdminPage><AdminResourcesList /></AdminPage>}
      </Route>

      {/* Analytics */}
      <Route path="/admin/analytics">
        {() => <AdminPage><AnalyticsDashboard /></AdminPage>}
      </Route>

      {/* Scoring — résultats des outils */}
      <Route path="/admin/scoring">
        {() => <AdminPage><ScoringResultsList /></AdminPage>}
      </Route>

      {/* Clients — projets */}
      <Route path="/admin/clients/projects">
        {() => <AdminPage><ClientProjectsAdmin /></AdminPage>}
      </Route>

      {/* Devis */}
      <Route path="/admin/devis">
        {() => <AdminPage><DevisList /></AdminPage>}
      </Route>

      {/* Plans d'abonnement */}
      <Route path="/admin/plans">
        {() => <AdminPage><PlansList /></AdminPage>}
      </Route>

      {/* Paiements */}
      <Route path="/admin/payments">
        {() => <AdminPage><PaymentsList /></AdminPage>}
      </Route>

      {/* Homepage settings */}
      <Route path="/admin/homepage">
        {() => <AdminPage><HomepageSettings /></AdminPage>}
      </Route>

      {/* Apparence */}
      <Route path="/admin/appearance">
        {() => <AdminPage><AppearanceSettings /></AdminPage>}
      </Route>

      {/* Formulaires CMS (alias /admin/menu pour le lien sidebar) */}
      <Route path="/admin/menu">
        {() => <AdminPage><MenuManagement /></AdminPage>}
      </Route>

      {/* Comptes clients */}
      <Route path="/admin/clients">
        {() => <AdminPage><ClientsList /></AdminPage>}
      </Route>
      <Route path="/admin/client-accounts">
        {() => <AdminPage><ClientAccountsPage /></AdminPage>}
      </Route>

      {/* Projets clients (alias sidebar) */}
      <Route path="/admin/client-projects">
        {() => <AdminPage><ClientProjectsAdmin /></AdminPage>}
      </Route>

      {/* Formulaires — Brief + Scoring */}
      <Route path="/admin/forms/brief">
        {() => <AdminPage><BriefFormEditor /></AdminPage>}
      </Route>
      <Route path="/admin/forms/scoring">
        {() => <AdminPage><ScoringQuestionsEditor /></AdminPage>}
      </Route>

      {/* Legacy routes */}
      <Route path="/admin/menus">
        {() => <AdminPage><MenuManagement /></AdminPage>}
      </Route>
      <Route path="/admin/audit-logs">
        {() => <AdminPage><AuditLogsPage /></AdminPage>}
      </Route>
      <Route path="/admin/blog">
        {() => <AdminPage><BlogManagement /></AdminPage>}
      </Route>
      <Route path="/admin/solutions">
        {() => <AdminPage><SolutionManagement /></AdminPage>}
      </Route>
      <Route path="/admin/website">
        {() => <AdminPage><PageManagement /></AdminPage>}
      </Route>
    </>
  );
}
