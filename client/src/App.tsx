import { lazy, Suspense } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { AnimatePresence, motion } from "framer-motion";
import { MagentaCursor } from "@/components/custom-cursor";
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
// CMS Dashboard — lazy loaded (non chargé sur les pages publiques)
import { useAuthStore } from "../../cms-dashboard/store/authStore";
import type { ReactNode } from "react";
const DashboardLayout    = lazy(() => import("../../cms-dashboard/layouts/DashboardLayout").then(m => ({ default: m.DashboardLayout })));
const NewLoginPage       = lazy(() => import("../../cms-dashboard/pages/NewLoginPage").then(m => ({ default: m.NewLoginPage })));
const DashboardPage      = lazy(() => import("../../cms-dashboard/pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const MenuManagement     = lazy(() => import("../../cms-dashboard/pages/menu/MenuManagement"));
const BlogManagement     = lazy(() => import("../../cms-dashboard/pages/blog/BlogManagement"));
const PageManagement     = lazy(() => import("../../cms-dashboard/pages/website/PageManagement"));
const SolutionManagement = lazy(() => import("../../cms-dashboard/pages/solutions/SolutionManagement"));
const ArticlesList       = lazy(() => import("../../cms-dashboard/pages/articles").then(m => ({ default: m.ArticlesList })));
const ArticleForm        = lazy(() => import("../../cms-dashboard/pages/articles").then(m => ({ default: m.ArticleForm })));
const EventsList         = lazy(() => import("../../cms-dashboard/pages/events").then(m => ({ default: m.EventsList })));
const EventForm          = lazy(() => import("../../cms-dashboard/pages/events").then(m => ({ default: m.EventForm })));
const PagesList          = lazy(() => import("../../cms-dashboard/pages/pages").then(m => ({ default: m.PagesList })));
const PageForm           = lazy(() => import("../../cms-dashboard/pages/pages").then(m => ({ default: m.PageForm })));
const MediaLibrary       = lazy(() => import("../../cms-dashboard/pages/MediaLibrary").then(m => ({ default: m.MediaLibrary })));
const CategoriesList     = lazy(() => import("../../cms-dashboard/pages/categories").then(m => ({ default: m.CategoriesList })));
const UsersList          = lazy(() => import("../../cms-dashboard/pages/users").then(m => ({ default: m.UsersList })));
const GeneralSettings    = lazy(() => import("../../cms-dashboard/pages/settings").then(m => ({ default: m.GeneralSettings })));
const SEOSettings        = lazy(() => import("../../cms-dashboard/pages/settings").then(m => ({ default: m.SEOSettings })));
const IntegrationSettings = lazy(() => import("../../cms-dashboard/pages/settings").then(m => ({ default: m.IntegrationSettings })));
const VisualEditorManagement = lazy(() => import("../../cms-dashboard/pages/plasmic").then(m => ({ default: m.VisualEditorManagement })));
const GrapesJSEditor     = lazy(() => import("../../cms-dashboard/pages/plasmic/GrapesJSEditor"));
const ServicesList       = lazy(() => import("../../cms-dashboard/pages/services").then(m => ({ default: m.ServicesList })));
const ReferencesList     = lazy(() => import("../../cms-dashboard/pages/references").then(m => ({ default: m.ReferencesList })));
const CaseStudiesList    = lazy(() => import("../../cms-dashboard/pages/case-studies").then(m => ({ default: m.CaseStudiesList })));
const TestimonialsList   = lazy(() => import("../../cms-dashboard/pages/testimonials").then(m => ({ default: m.TestimonialsList })));
const TeamList           = lazy(() => import("../../cms-dashboard/pages/team").then(m => ({ default: m.TeamList })));
const LeadsList          = lazy(() => import("../../cms-dashboard/pages/leads").then(m => ({ default: m.LeadsList })));
const NewsletterList     = lazy(() => import("../../cms-dashboard/pages/newsletter").then(m => ({ default: m.NewsletterList })));
const ContactsList       = lazy(() => import("../../cms-dashboard/pages/contacts").then(m => ({ default: m.ContactsList })));
const QRCodesList        = lazy(() => import("../../cms-dashboard/pages/qr-codes/QRCodesList").then(m => ({ default: m.QRCodesList })));
const PushBroadcastPage  = lazy(() => import("../../cms-dashboard/pages/push/PushBroadcastPage").then(m => ({ default: m.PushBroadcastPage })));
const AdminResourcesList = lazy(() => import("../../cms-dashboard/pages/resources/ResourcesList").then(m => ({ default: m.ResourcesList })));

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
  const [location] = useLocation();
  // Only animate public routes (not admin)
  const isAdmin = location.startsWith("/admin");
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={isAdmin ? "admin" : location}
        initial={isAdmin ? {} : { opacity: 0, y: 12 }}
        animate={isAdmin ? {} : { opacity: 1, y: 0 }}
        exit={isAdmin ? {} : { opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
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
      </motion.div>
    </AnimatePresence>
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
              <MagentaCursor />
              <WhatsAppButton />
              {/* Phase 2 — Composants globaux */}
              <PushPermissionBanner />
              <PwaInstallPrompt />
              <Suspense fallback={
                <div style={{ minHeight: '100vh', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #EC4899', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              }>
                <Router />
              </Suspense>
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
