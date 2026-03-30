import { Suspense, lazy } from "react";
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
import { CookieConsentBanner }  from "@/components/cookie-consent-banner";

// ── Admin routes (lazy-loaded, code-split) ────────────────────────────────────
import { AdminRoutes } from "@/routes/admin-routes";

// ── Pages critiques — restent statiques (LCP) ────────────────────────────────
import HomeV5 from "@/pages/home-v5";
import NotFound from "@/pages/not-found";

// ── Toutes les autres pages — lazy-loaded (code splitting) ───────────────────
const HomeV4                 = lazy(() => import("@/pages/home-v4"));
const DesignPreview          = lazy(() => import("@/pages/design-preview"));
const DynamicPage            = lazy(() => import("@/pages/dynamic-page"));
const ReferencesPage         = lazy(() => import("@/pages/references"));
const ReferenceDetailPage    = lazy(() => import("@/pages/references/detail"));
const BlogPage               = lazy(() => import("@/pages/blog"));
const BlogArticlePage        = lazy(() => import("@/pages/blog-article"));
const SolutionPage           = lazy(() => import("@/pages/solution"));

// ── Événements ────────────────────────────────────────────────────────────────
const EvenementsHub          = lazy(() => import("@/pages/evenements/index"));
const ConventionsKickoffs    = lazy(() => import("@/pages/evenements/conventions-kickoffs"));
const SoireesDeGala          = lazy(() => import("@/pages/evenements/soirees-de-gala"));
const Roadshows              = lazy(() => import("@/pages/evenements/roadshows"));
const Salons                 = lazy(() => import("@/pages/evenements/salons"));

// ── Architecture de Marque ────────────────────────────────────────────────────
const ArchitectureDeMarqueHub = lazy(() => import("@/pages/architecture-de-marque/index"));
const MarqueEmployeur         = lazy(() => import("@/pages/architecture-de-marque/marque-employeur"));
const CommunicationQhse       = lazy(() => import("@/pages/architecture-de-marque/communication-qhse"));
const ExperienceClients       = lazy(() => import("@/pages/architecture-de-marque/experience-clients"));

// ── La Fabrique ───────────────────────────────────────────────────────────────
const LaFabriqueHub   = lazy(() => import("@/pages/la-fabrique/index"));
const Impression      = lazy(() => import("@/pages/la-fabrique/impression"));
const Menuiserie      = lazy(() => import("@/pages/la-fabrique/menuiserie"));
const Signaletique    = lazy(() => import("@/pages/la-fabrique/signaletique"));
const Amenagement     = lazy(() => import("@/pages/la-fabrique/amenagement"));

// ── Contact & Lead Gen ────────────────────────────────────────────────────────
const ContactPage  = lazy(() => import("@/pages/contact/index"));
const BriefPage    = lazy(() => import("@/pages/contact/brief"));

// ── Outils ────────────────────────────────────────────────────────────────────
const VigilanceScore      = lazy(() => import("@/pages/outils/vigilance-score"));
const CalculateurFabrique = lazy(() => import("@/pages/outils/calculateur-fabrique"));
const StandViewerPage     = lazy(() => import("@/pages/outils/stand-viewer"));
const OutilsHub           = lazy(() => import("@/pages/outils/index"));

// ── BMI 360™ Scoring Outils ───────────────────────────────────────────────────
const CommPulsePage   = lazy(() => import("@/pages/outils/commpulse"));
const TalentPrintPage = lazy(() => import("@/pages/outils/talentprint"));
const ImpactTracePage = lazy(() => import("@/pages/outils/impacttrace"));
const SafeSignalPage  = lazy(() => import("@/pages/outils/safesignal"));
const EventImpactPage = lazy(() => import("@/pages/outils/eventimpact"));
const SpaceScorePage  = lazy(() => import("@/pages/outils/spacescore"));
const FinNarrativePage = lazy(() => import("@/pages/outils/finnarrative"));
const BMI360Page      = lazy(() => import("@/pages/outils/bmi360"));

// ── Ressources ────────────────────────────────────────────────────────────────
const RessourcesPage = lazy(() => import("@/pages/ressources/index"));

// ── Espace Client ─────────────────────────────────────────────────────────────
const EspaceClientPage = lazy(() => import("@/pages/espace-client/index"));
const ProjetsList      = lazy(() => import("@/pages/espace-client/projets/index"));
const ProjetDetail     = lazy(() => import("@/pages/espace-client/projets/detail"));
const DocumentsPage    = lazy(() => import("@/pages/espace-client/documents"));
const EcRessources     = lazy(() => import("@/pages/espace-client/ressources"));
const EcSecurite       = lazy(() => import("@/pages/espace-client/securite"));

// ── Analytics ─────────────────────────────────────────────────────────────────
const AnalyticsPage = lazy(() => import("@/pages/analytics/index"));

// ── Pages légales ─────────────────────────────────────────────────────────────
const MentionsLegales          = lazy(() => import("@/pages/mentions-legales"));
const PolitiqueConfidentialite = lazy(() => import("@/pages/politique-confidentialite"));
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
          <Route path="/outils" component={OutilsHub} />
          <Route path="/outils/vigilance-score" component={VigilanceScore} />
          <Route path="/outils/calculateur-fabrique" component={CalculateurFabrique} />
          <Route path="/outils/stand-viewer" component={StandViewerPage} />
          {/* ── BMI 360™ Scoring Intelligence ──────────────────── */}
          <Route path="/outils/commpulse" component={CommPulsePage} />
          <Route path="/outils/talentprint" component={TalentPrintPage} />
          <Route path="/outils/impacttrace" component={ImpactTracePage} />
          <Route path="/outils/safesignal" component={SafeSignalPage} />
          <Route path="/outils/eventimpact" component={EventImpactPage} />
          <Route path="/outils/spacescore" component={SpaceScorePage} />
          <Route path="/outils/finnarrative" component={FinNarrativePage} />
          <Route path="/outils/bmi360" component={BMI360Page} />

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

          {/* ── Pages légales ───────────────────────────────────── */}
          <Route path="/mentions-legales" component={MentionsLegales} />
          <Route path="/politique-confidentialite" component={PolitiqueConfidentialite} />

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
              <CookieConsentBanner />
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
