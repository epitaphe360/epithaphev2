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
import BlogPage from "@/pages/blog";
import BlogArticlePage from "@/pages/blog-article";
import SolutionPage from "@/pages/solution";
import NotFound from "@/pages/not-found";
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
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogArticlePage} />
      <Route path="/solutions/:slug" component={SolutionPage} />
      <Route path="/page/:slug" component={DynamicPage} />
      
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
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="epitaphe-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
