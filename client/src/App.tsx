import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import Home from "@/pages/home";
import DynamicPage from "@/pages/dynamic-page";
import ReferencesPage from "@/pages/references";
import ReferenceDetailPage from "@/pages/references/detail";
import BlogPage from "@/pages/blog";
import BlogArticlePage from "@/pages/blog-article";
import SolutionPage from "@/pages/solution";
import NotFound from "@/pages/not-found";
// ── Module 2 : Pages publiques ───────────────────────────────────────────────
import EvenementsHub from "@/pages/evenements/index";
import ConventionsKickoffs from "@/pages/evenements/conventions-kickoffs";
import SoireesDeGala from "@/pages/evenements/soirees-de-gala";
import Roadshows from "@/pages/evenements/roadshows";
import Salons from "@/pages/evenements/salons";
import ArchitectureDeMarqueHub from "@/pages/architecture-de-marque/index";
import MarqueEmployeur from "@/pages/architecture-de-marque/marque-employeur";
import CommunicationQhse from "@/pages/architecture-de-marque/communication-qhse";
import ExperienceClients from "@/pages/architecture-de-marque/experience-clients";
import LaFabriqueHub from "@/pages/la-fabrique/index";
import Impression from "@/pages/la-fabrique/impression";
import Menuiserie from "@/pages/la-fabrique/menuiserie";
import Signaletique from "@/pages/la-fabrique/signaletique";
import Amenagement from "@/pages/la-fabrique/amenagement";
// ── Module 4 : Lead Gen ──────────────────────────────────────────────────────
import ContactPage from "@/pages/contact/index";
import BriefPage from "@/pages/contact/brief";
import VigilanceScore from "@/pages/outils/vigilance-score";
import CalculateurFabrique from "@/pages/outils/calculateur-fabrique";
// ── Module 5 : SEO / Ressources ──────────────────────────────────────────────
import RessourcesPage from "@/pages/ressources/index";
import { OrganizationSchema } from "@/components/seo/schema-org";
// ── Espace Client ────────────────────────────────────────────────────────────
import EspaceClientPage from "@/pages/espace-client/index";
// ── Espace Client — Phase 2 ───────────────────────────────────────────────────
import ProjetsList     from "@/pages/espace-client/projets/index";
import ProjetDetail    from "@/pages/espace-client/projets/detail";
import DocumentsPage   from "@/pages/espace-client/documents";
import EcRessources    from "@/pages/espace-client/ressources";
import EcSecurite      from "@/pages/espace-client/securite";
// ── Phase 2 — Composants globaux ──────────────────────────────────────────────
import { PushPermissionBanner } from "@/components/push-permission-banner";
import { PwaInstallPrompt }     from "@/components/pwa-install-prompt";
// ── Analytics ────────────────────────────────────────────────────────────────
import AnalyticsPage from "@/pages/analytics/index";
// ── StandViewer 3D ───────────────────────────────────────────────────────────
import StandViewerPage from "@/pages/outils/stand-viewer";
// ── React Helmet ─────────────────────────────────────────────────────────────
import { HelmetProvider } from "react-helmet-async";
// ── WhatsApp ──────────────────────────────────────────────────────────────────
import { WhatsAppButton } from "@/components/whatsapp-button";
// CMS Dashboard imports
import { DashboardLayout } from "../../cms-dashboard/layouts/DashboardLayout";
import { NewLoginPage } from "../../cms-dashboard/pages/NewLoginPage";
import { DashboardPage } from "../../cms-dashboard/pages/DashboardPage";
import MenuManagement from "../../cms-dashboard/pages/menu/MenuManagement";
import BlogManagement from "../../cms-dashboard/pages/blog/BlogManagement";
import PageManagement from "../../cms-dashboard/pages/website/PageManagement";
import SolutionManagement from "../../cms-dashboard/pages/solutions/SolutionManagement";
import { ArticlesList } from "../../cms-dashboard/pages/articles";
import { ArticleForm } from "../../cms-dashboard/pages/articles";
import { EventsList } from "../../cms-dashboard/pages/events";
import { EventForm } from "../../cms-dashboard/pages/events";
import { PagesList } from "../../cms-dashboard/pages/pages";
import { PageForm } from "../../cms-dashboard/pages/pages";
import { MediaLibrary } from "../../cms-dashboard/pages/MediaLibrary";
import { CategoriesList } from "../../cms-dashboard/pages/categories";
import { UsersList } from "../../cms-dashboard/pages/users";
import { GeneralSettings, SEOSettings, IntegrationSettings } from "../../cms-dashboard/pages/settings";
import { VisualEditorManagement } from "../../cms-dashboard/pages/plasmic";
import GrapesJSEditor from "../../cms-dashboard/pages/plasmic/GrapesJSEditor";
// Nouveaux modules
import { ServicesList } from "../../cms-dashboard/pages/services";
import { ReferencesList } from "../../cms-dashboard/pages/references";
import { CaseStudiesList } from "../../cms-dashboard/pages/case-studies";
import { TestimonialsList } from "../../cms-dashboard/pages/testimonials";
import { TeamList } from "../../cms-dashboard/pages/team";
import { LeadsList } from "../../cms-dashboard/pages/leads";
import { NewsletterList } from "../../cms-dashboard/pages/newsletter";
import { ContactsList } from "../../cms-dashboard/pages/contacts";
// ── Phase 2 — Admin CMS QR Codes ─────────────────────────────────────────────
import { QRCodesList }      from "../../cms-dashboard/pages/qr-codes/QRCodesList";
import { PushBroadcastPage } from "../../cms-dashboard/pages/push/PushBroadcastPage";
import { ResourcesList as AdminResourcesList } from "../../cms-dashboard/pages/resources/ResourcesList";
import { useAuthStore } from "../../cms-dashboard/store/authStore";
import type { ReactNode } from "react";

// Protected Route Component
function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page
    setLocation("/admin/login");
    return null;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/nos-references" component={ReferencesPage} />
      <Route path="/nos-references/:slug" component={ReferenceDetailPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogArticlePage} />
      <Route path="/solutions/:slug" component={SolutionPage} />
      <Route path="/page/:slug" component={DynamicPage} />

      {/* ── Événements ───────────────────────────────────────── */}
      <Route path="/evenements" component={EvenementsHub} />
      <Route path="/evenements/conventions-kickoffs" component={ConventionsKickoffs} />
      <Route path="/evenements/soirees-de-gala" component={SoireesDeGala} />
      <Route path="/evenements/roadshows" component={Roadshows} />
      <Route path="/evenements/salons" component={Salons} />

      {/* ── Architecture de Marque ───────────────────────────── */}
      <Route path="/architecture-de-marque" component={ArchitectureDeMarqueHub} />
      <Route path="/architecture-de-marque/marque-employeur" component={MarqueEmployeur} />
      <Route path="/architecture-de-marque/communication-qhse" component={CommunicationQhse} />
      <Route path="/architecture-de-marque/experience-clients" component={ExperienceClients} />

      {/* ── La Fabrique ──────────────────────────────────────── */}
      <Route path="/la-fabrique" component={LaFabriqueHub} />
      <Route path="/la-fabrique/impression" component={Impression} />
      <Route path="/la-fabrique/menuiserie" component={Menuiserie} />
      <Route path="/la-fabrique/signaletique" component={Signaletique} />
      <Route path="/la-fabrique/amenagement" component={Amenagement} />

      {/* ── Contact & Lead Gen ───────────────────────────────── */}
      <Route path="/contact" component={ContactPage} />
      <Route path="/contact/brief" component={BriefPage} />

      {/* ── Outils ───────────────────────────────────────────── */}
      <Route path="/outils/vigilance-score" component={VigilanceScore} />
      <Route path="/outils/calculateur-fabrique" component={CalculateurFabrique} />
      <Route path="/outils/stand-viewer" component={StandViewerPage} />

      {/* ── Ressources ───────────────────────────────────────── */}
      <Route path="/ressources" component={RessourcesPage} />

      {/* ── Espace Client ────────────────────────────────────── */}
      <Route path="/espace-client" component={EspaceClientPage} />
      {/* Phase 2 — Espace Client sous-pages */}
      <Route path="/espace-client/projets" component={ProjetsList} />
      <Route path="/espace-client/projets/:id" component={ProjetDetail} />
      <Route path="/espace-client/documents" component={DocumentsPage} />
      <Route path="/espace-client/ressources" component={EcRessources} />
      <Route path="/espace-client/securite" component={EcSecurite} />

      {/* ── Analytics (public dashboard) ─────────────────────── */}
      <Route path="/analytics" component={AnalyticsPage} />

      {/* CMS Admin Routes */}
      <Route path="/admin/login" component={NewLoginPage} />
      
      {/* Dashboard */}
      <Route path="/admin">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Articles */}
      <Route path="/admin/articles">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
              <ArticlesList />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/articles/new">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
              <ArticleForm />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/articles/:id/edit">
        {(params) => (
          <ProtectedRoute>
            <DashboardLayout>
              <ArticleForm />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Events */}
      <Route path="/admin/events">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
            <EventsList />
          </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/events/new">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
            <EventForm />
          </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/events/:id/edit">
        {(params) => (
          <ProtectedRoute>
            <DashboardLayout>
              <EventForm />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Pages */}
      <Route path="/admin/pages">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
            <PagesList />
          </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/pages/new">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
            <PageForm />
          </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/pages/:id/edit">
        {(params) => (
          <ProtectedRoute>
            <DashboardLayout>
              <PageForm />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Visual Editor */}
      <Route path="/admin/visual-editor">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
            <VisualEditorManagement />
          </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/visual-editor/edit/:pageId">
        {(params) => (
          <ProtectedRoute>
            <DashboardLayout>
              <GrapesJSEditor />
            </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Media */}
      <Route path="/admin/media">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
            <MediaLibrary />
          </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Categories */}
      <Route path="/admin/categories">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
            <CategoriesList />
          </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Users */}
      <Route path="/admin/users">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
            <UsersList />
          </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      {/* Settings */}
      <Route path="/admin/settings/general">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
            <GeneralSettings />
          </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/settings/seo">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
            <SEOSettings />
          </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/settings/integrations">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
            <IntegrationSettings />
          </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>

      {/* Services */}
      <Route path="/admin/services">
        {() => (<ProtectedRoute><DashboardLayout><ServicesList /></DashboardLayout></ProtectedRoute>)}
      </Route>

      {/* Références Clients */}
      <Route path="/admin/references">
        {() => (<ProtectedRoute><DashboardLayout><ReferencesList /></DashboardLayout></ProtectedRoute>)}
      </Route>

      {/* Études de Cas */}
      <Route path="/admin/case-studies">
        {() => (<ProtectedRoute><DashboardLayout><CaseStudiesList /></DashboardLayout></ProtectedRoute>)}
      </Route>

      {/* Témoignages */}
      <Route path="/admin/testimonials">
        {() => (<ProtectedRoute><DashboardLayout><TestimonialsList /></DashboardLayout></ProtectedRoute>)}
      </Route>

      {/* Équipe */}
      <Route path="/admin/team">
        {() => (<ProtectedRoute><DashboardLayout><TeamList /></DashboardLayout></ProtectedRoute>)}
      </Route>

      {/* Leads */}
      <Route path="/admin/leads">
        {() => (<ProtectedRoute><DashboardLayout><LeadsList /></DashboardLayout></ProtectedRoute>)}
      </Route>

      {/* Newsletter */}
      <Route path="/admin/newsletter">
        {() => (<ProtectedRoute><DashboardLayout><NewsletterList /></DashboardLayout></ProtectedRoute>)}
      </Route>

      {/* Contacts */}
      <Route path="/admin/contacts">
        {() => (<ProtectedRoute><DashboardLayout><ContactsList /></DashboardLayout></ProtectedRoute>)}
      </Route>

      {/* Phase 2 — QR Codes */}
      <Route path="/admin/qr-codes">
        {() => (<ProtectedRoute><DashboardLayout><QRCodesList /></DashboardLayout></ProtectedRoute>)}
      </Route>

      {/* Phase 2 — Push Broadcast */}
      <Route path="/admin/push">
        {() => (<ProtectedRoute><DashboardLayout><PushBroadcastPage /></DashboardLayout></ProtectedRoute>)}
      </Route>

      {/* Phase 2 — Ressources Clients */}
      <Route path="/admin/resources">
        {() => (<ProtectedRoute><DashboardLayout><AdminResourcesList /></DashboardLayout></ProtectedRoute>)}
      </Route>
      
      {/* Legacy routes */}
      <Route path="/admin/menus">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
            <MenuManagement />
          </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/blog">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
            <BlogManagement />
          </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin/solutions">
        {() => (
          <ProtectedRoute>
            <DashboardLayout>
            <SolutionManagement />
          </DashboardLayout>
          </ProtectedRoute>
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="light" storageKey="epitaphe-theme">
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <OrganizationSchema />
              <Toaster />
              <WhatsAppButton />
              {/* Phase 2 — Composants globaux */}
              <PushPermissionBanner />
              <PwaInstallPrompt />
              <Router />
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
