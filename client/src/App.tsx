import { Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { AnimatePresence, motion } from "framer-motion";
import { MagentaCursor } from "@/components/custom-cursor";
import { useLocation } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import { OrganizationSchema } from "@/components/seo/schema-org";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { PushPermissionBanner } from "@/components/push-permission-banner";
import { PwaInstallPrompt }     from "@/components/pwa-install-prompt";

// ── Admin routes (lazy-loaded, code-split) ────────────────────────────────────
import { AdminRoutes } from "@/routes/admin-routes";

// ── Public pages ──────────────────────────────────────────────────────────────
import HomeV5 from "@/pages/home-v5";
import HomeV4 from "@/pages/home-v4";
import HomeV1 from "@/pages/home-v1";
import HomeV2 from "@/pages/home-v2";
import HomeV3 from "@/pages/home-v3";
import DesignPreview from "@/pages/design-preview";
import DynamicPage from "@/pages/dynamic-page";
import ReferencesPage from "@/pages/references";
import ReferenceDetailPage from "@/pages/references/detail";
import BlogPage from "@/pages/blog";
import BlogArticlePage from "@/pages/blog-article";
import SolutionPage from "@/pages/solution";
import NotFound from "@/pages/not-found";

// ── Événements ────────────────────────────────────────────────────────────────
import EvenementsHub from "@/pages/evenements/index";
import ConventionsKickoffs from "@/pages/evenements/conventions-kickoffs";
import SoireesDeGala from "@/pages/evenements/soirees-de-gala";
import Roadshows from "@/pages/evenements/roadshows";
import Salons from "@/pages/evenements/salons";

// ── Architecture de Marque ────────────────────────────────────────────────────
import ArchitectureDeMarqueHub from "@/pages/architecture-de-marque/index";
import MarqueEmployeur from "@/pages/architecture-de-marque/marque-employeur";
import CommunicationQhse from "@/pages/architecture-de-marque/communication-qhse";
import ExperienceClients from "@/pages/architecture-de-marque/experience-clients";

// ── La Fabrique ───────────────────────────────────────────────────────────────
import LaFabriqueHub from "@/pages/la-fabrique/index";
import Impression from "@/pages/la-fabrique/impression";
import Menuiserie from "@/pages/la-fabrique/menuiserie";
import Signaletique from "@/pages/la-fabrique/signaletique";
import Amenagement from "@/pages/la-fabrique/amenagement";

// ── Contact & Lead Gen ────────────────────────────────────────────────────────
import ContactPage from "@/pages/contact/index";
import BriefPage from "@/pages/contact/brief";

// ── Outils ────────────────────────────────────────────────────────────────────
import VigilanceScore from "@/pages/outils/vigilance-score";
import CalculateurFabrique from "@/pages/outils/calculateur-fabrique";
import StandViewerPage from "@/pages/outils/stand-viewer";

// ── Ressources ────────────────────────────────────────────────────────────────
import RessourcesPage from "@/pages/ressources/index";

// ── Espace Client ─────────────────────────────────────────────────────────────
import EspaceClientPage from "@/pages/espace-client/index";
import ProjetsList   from "@/pages/espace-client/projets/index";
import ProjetDetail  from "@/pages/espace-client/projets/detail";
import DocumentsPage from "@/pages/espace-client/documents";
import EcRessources  from "@/pages/espace-client/ressources";
import EcSecurite    from "@/pages/espace-client/securite";

// ── Analytics ─────────────────────────────────────────────────────────────────
import AnalyticsPage from "@/pages/analytics/index";

// ─────────────────────────────────────────────────────────────────────────────

function Router() {
  const [location] = useLocation();
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
          {/* ── Home & Design variants ──────────────────────────── */}
          <Route path="/" component={HomeV5} />
          <Route path="/design-v4" component={HomeV4} />
          <Route path="/design-preview" component={DesignPreview} />
          <Route path="/design/v1" component={HomeV1} />
          <Route path="/design/v2" component={HomeV2} />
          <Route path="/design/v3" component={HomeV3} />

          {/* ── Contenu ─────────────────────────────────────────── */}
          <Route path="/nos-references" component={ReferencesPage} />
          <Route path="/nos-references/:slug" component={ReferenceDetailPage} />
          <Route path="/blog" component={BlogPage} />
          <Route path="/blog/:slug" component={BlogArticlePage} />
          <Route path="/solutions/:slug" component={SolutionPage} />
          <Route path="/page/:slug" component={DynamicPage} />

          {/* ── Événements ──────────────────────────────────────── */}
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

          {/* ── La Fabrique ─────────────────────────────────────── */}
          <Route path="/la-fabrique" component={LaFabriqueHub} />
          <Route path="/la-fabrique/impression" component={Impression} />
          <Route path="/la-fabrique/menuiserie" component={Menuiserie} />
          <Route path="/la-fabrique/signaletique" component={Signaletique} />
          <Route path="/la-fabrique/amenagement" component={Amenagement} />

          {/* ── Contact & Lead Gen ──────────────────────────────── */}
          <Route path="/contact" component={ContactPage} />
          <Route path="/contact/brief" component={BriefPage} />

          {/* ── Outils ──────────────────────────────────────────── */}
          <Route path="/outils/vigilance-score" component={VigilanceScore} />
          <Route path="/outils/calculateur-fabrique" component={CalculateurFabrique} />
          <Route path="/outils/stand-viewer" component={StandViewerPage} />

          {/* ── Ressources ──────────────────────────────────────── */}
          <Route path="/ressources" component={RessourcesPage} />

          {/* ── Espace Client ───────────────────────────────────── */}
          <Route path="/espace-client" component={EspaceClientPage} />
          <Route path="/espace-client/projets" component={ProjetsList} />
          <Route path="/espace-client/projets/:id" component={ProjetDetail} />
          <Route path="/espace-client/documents" component={DocumentsPage} />
          <Route path="/espace-client/ressources" component={EcRessources} />
          <Route path="/espace-client/securite" component={EcSecurite} />

          {/* ── Analytics ───────────────────────────────────────── */}
          <Route path="/analytics" component={AnalyticsPage} />

          {/* ── Admin CMS (lazy-loaded) ──────────────────────────── */}
          <AdminRoutes />

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
