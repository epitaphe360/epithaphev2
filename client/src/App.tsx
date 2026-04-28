import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import DevShortcuts from "./components/DevShortcuts";
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
import { OrganizationSchema, WebSiteSchema, LocalBusinessSchema } from "@/components/seo/schema-org";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { PushPermissionBanner } from "@/components/push-permission-banner";
import { PwaInstallPrompt }     from "@/components/pwa-install-prompt";
import { CookieConsentBanner }  from "@/components/cookie-consent-banner";
import { EmbedProvider, useEmbed } from "@/contexts/embed-context";
import { EmbedResizeReporter } from "@/components/embed-resize-reporter";

// ── Espace client reset password ─────────────────────────────────────────────
import ClientResetPasswordPage from "@/pages/espace-client/reset-password";

// ── Admin routes (lazy-loaded, code-split) ────────────────────────────────────
import { AdminRoutes } from "@/routes/admin-routes";

// ── Pages critiques — restent statiques (LCP) ────────────────────────────────
import HomeV6 from "@/pages/home-v6";
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

// ── Contact ─────────────────────────────────────────────────────────────────
// /contact est géré par DynamicPage (sections en DB)
// /contact/brief reste statique (formulaire interactif)
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


// ── Espace Client ─────────────────────────────────────────────────────────────
const EspaceClientPage = lazy(() => import("@/pages/espace-client/index"));
const ProjetsList      = lazy(() => import("@/pages/espace-client/projets/index"));
const ProjetDetail     = lazy(() => import("@/pages/espace-client/projets/detail"));
const DocumentsPage    = lazy(() => import("@/pages/espace-client/documents"));
const EcRessources     = lazy(() => import("@/pages/espace-client/ressources"));
const EcSecurite       = lazy(() => import("@/pages/espace-client/securite"));
const AbonnementPage   = lazy(() => import("@/pages/espace-client/abonnement"));

// ── Devis public ──────────────────────────────────────────────────────────────
const DevisPage = lazy(() => import("@/pages/devis/index"));

// ── Pages paiement (retour PayPal / CMI) ─────────────────────────────────────
const PaiementSucces = lazy(() => import("@/pages/paiement-succes"));
const PaiementEchec  = lazy(() => import("@/pages/paiement-echec"));

// ── Pages légales ─────────────────────────────────────────────────────────────
const MentionsLegales          = lazy(() => import("@/pages/mentions-legales"));
const PolitiqueConfidentialite = lazy(() => import("@/pages/politique-confidentialite"));

// ─────────────────────────────────────────────────────────────────────────────
// a-propos, faq, nos-poles, evenements, architecture-de-marque, la-fabrique,
// ressources → tous gérés par DynamicPage (sections JSON en DB)

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={isAdmin ? "admin" : location}
        initial={isAdmin ? {} : { opacity: 0 }}
        animate={isAdmin ? {} : { opacity: 1 }}
        exit={isAdmin ? {} : { opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Switch>
          {/* ── Home & Design variants ──────────────────────────── */}
          <Route path="/" component={HomeV6} />
          <Route path="/design-v5" component={HomeV5} />
          <Route path="/design-v4" component={HomeV4} />
          <Route path="/design-preview" component={DesignPreview} />
          
          
          

          {/* ── Contenu ─────────────────────────────────────────── */}
          <Route path="/nos-references" component={ReferencesPage} />
          <Route path="/nos-references/:slug" component={ReferenceDetailPage} />
          <Route path="/blog" component={BlogPage} />
          <Route path="/blog/:slug" component={BlogArticlePage} />
          <Route path="/solutions/:slug" component={SolutionPage} />

          {/* ── Contact brief (statique, formulaire interactif) ─── */}
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

          {/* ── Alias /tools/ → /outils/ (redirections SEO) ─────── */}
          <Route path="/tools/commpulse">{() => { window.location.replace('/outils/commpulse'); return null; }}</Route>
          <Route path="/tools/talentprint">{() => { window.location.replace('/outils/talentprint'); return null; }}</Route>
          <Route path="/tools/safesignal">{() => { window.location.replace('/outils/safesignal'); return null; }}</Route>
          <Route path="/tools/impacttrace">{() => { window.location.replace('/outils/impacttrace'); return null; }}</Route>
          <Route path="/tools/eventimpact">{() => { window.location.replace('/outils/eventimpact'); return null; }}</Route>
          <Route path="/tools/spacescore">{() => { window.location.replace('/outils/spacescore'); return null; }}</Route>
          <Route path="/tools/finnarrative">{() => { window.location.replace('/outils/finnarrative'); return null; }}</Route>

          {/* Ressources / a-propos / faq / nos-poles → DynamicPage (DB) */}

          {/* ── Espace Client ───────────────────────────────────── */}
          <Route path="/espace-client" component={EspaceClientPage} />
          <Route path="/espace-client/projets" component={ProjetsList} />
          <Route path="/espace-client/projets/:id" component={ProjetDetail} />
          <Route path="/espace-client/documents" component={DocumentsPage} />
          <Route path="/espace-client/ressources" component={EcRessources} />
          <Route path="/espace-client/securite" component={EcSecurite} />
          <Route path="/espace-client/abonnement" component={AbonnementPage} />
          <Route path="/espace-client/reset-password" component={ClientResetPasswordPage} />

          {/* ── Devis public ────────────────────────────────────── */}
          <Route path="/devis/:reference" component={DevisPage} />

          {/* ── Paiement callbacks (PayPal / CMI) ───────────────── */}
          <Route path="/paiement/succes" component={PaiementSucces} />
          <Route path="/paiement/echec"  component={PaiementEchec} />
          <Route path="/paiement/annule" component={PaiementEchec} />

          {/* ── Pages légales ───────────────────────────────────── */}
          <Route path="/mentions-legales" component={MentionsLegales} />
          <Route path="/politique-confidentialite" component={PolitiqueConfidentialite} />

          {/* ── Admin CMS (lazy-loaded) ──────────────────────────── */}
          {/* IMPORTANT: invoquer comme fonction pour que les <Route> deviennent enfants directs du Switch.
              Sinon wouter v3 traite <AdminRoutes /> sans prop `path` comme un match par défaut qui avale tout. */}
          {AdminRoutes()}

          {/* ── Catch-all: pages pilotées par sections JSON en DB ─── */}
          {/* Pas de prop `path` → match toute URL non capturée précédemment.
              DynamicPage gère lui-même son 404 si la page n'existe pas en DB. */}
          <Route component={DynamicPage} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function AppInner() {
  const isEmbed = useEmbed();
  return (
    <>
      <EmbedResizeReporter />
      {!isEmbed && <OrganizationSchema />}
      {!isEmbed && <WebSiteSchema />}
      {!isEmbed && <LocalBusinessSchema />}
      <Toaster />
      {!isEmbed && <DevShortcuts />}
      {!isEmbed && <MagentaCursor />}
      {!isEmbed && <WhatsAppButton />}
      {!isEmbed && <PushPermissionBanner />}
      {!isEmbed && <PwaInstallPrompt />}
      {!isEmbed && <CookieConsentBanner />}
      <Suspense fallback={
        <div style={{ minHeight: isEmbed ? 'auto' : '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #EC4899', borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      }>
        <Router />
      </Suspense>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider defaultTheme="light" storageKey="epitaphe-theme">
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <EmbedProvider>
                <AppInner />
              </EmbedProvider>
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;

