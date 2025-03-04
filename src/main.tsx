
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { ModuleGuard } from "@/components/modules/ModuleGuard";
import { ModulePageRegistry } from "@/services/modules/ModulePageRegistry";
import { RootLayout } from "@/components/RootLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { PrelaunchRedirect } from "@/components/home/PrelaunchRedirect";
import { Toaster } from "@/components/ui/toaster";
import Landing from "@/pages/Landing";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";
import AdminLogin from "@/pages/AdminLogin";
import Waitlist from "@/pages/Waitlist";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminShops from "@/pages/admin/AdminShops";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminMarketplace from "@/pages/admin/AdminMarketplace";
import AdminContent from "@/pages/admin/AdminContent";
import AdminStats from "@/pages/admin/AdminStats";
import AdminMarketing from "@/pages/admin/AdminMarketing";
import AdminModules from "@/pages/admin/AdminModules";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminHelp from "@/pages/admin/AdminHelp";
import AdminReports from "@/pages/admin/AdminReports";
import AdminPayments from "@/pages/admin/AdminPayments";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminModeration from "@/pages/admin/AdminModeration";
import AdminApiKeys from "@/pages/admin/AdminApiKeys";
import AdminNotifications from "@/pages/admin/AdminNotifications";
import AdminBackup from "@/pages/admin/AdminBackup";
import AdminMenuPage from "@/pages/admin/AdminMenus";
import Settings from "@/pages/Settings";
import Notifications from "@/pages/Notifications";
import Home from "@/pages/Home";
import Feed from "@/pages/Feed";
import Profile from "@/pages/Profile";
import Clothes from "@/pages/Clothes";
import Outfits from "@/pages/Outfits";
import TrendingOutfits from "@/pages/TrendingOutfits";
import Suitcases from "@/pages/Suitcases";
import VirtualTryOn from "@/pages/VirtualTryOn";
import Shop from "@/pages/Shop";
import Admin from "@/pages/Admin";
import AdminWaitlist from "@/pages/admin/AdminWaitlist";
import { lazy, Suspense } from "react";
import "./index.css";

// Création du client de requête pour React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Récupérer les pages pour les routes
const modulePages = ModulePageRegistry.getAllPages();

// Loading fallback pour les composants chargés dynamiquement
const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

// Composant principal qui contient toutes les routes de l'application
const App = () => {
  return (
    <Routes>
      {/* Rediriger la route racine vers /app si authentifié, sinon vers /landing */}
      <Route
        path="/"
        element={<Navigate to="/app" replace />}
      />
      
      {/* Page d'accueil publique avec authentification intégrée */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/waitlist" element={<Waitlist />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/login" element={<Auth />} />
      <Route path="/auth/admin" element={<AdminLogin />} />
      
      {/* Application authentifiée */}
      <Route
        path="/app"
        element={
          <PrivateRoute>
            <Index />
          </PrivateRoute>
        }
      />
      
      {/* Routes utilisateur */}
      <Route
        path="/profile/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <Notifications />
          </PrivateRoute>
        }
      />

      {/* Routes d'administration */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="shops" element={<AdminShops />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="marketplace" element={<AdminMarketplace />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="stats" element={<AdminStats />} />
        <Route path="marketing" element={<AdminMarketing />} />
        <Route path="modules" element={<AdminModules />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="help" element={<AdminHelp />} />
        <Route path="menus" element={<AdminMenuPage />} />
        <Route path="waitlist" element={<AdminWaitlist />} />
        {/* Nouvelles routes d'administration */}
        <Route path="reports" element={<AdminReports />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="moderation" element={<AdminModeration />} />
        <Route path="api-keys" element={<AdminApiKeys />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="backup" element={<AdminBackup />} />
      </Route>

      {/* Routes des modules - générées dynamiquement */}
      {modulePages.map(page => {
        // Utiliser directement le composant lazy de la définition de page
        const PageComponent = page.component as React.ComponentType<any>;

        return (
          <Route
            key={page.path}
            path={page.path}
            element={
              <PrivateRoute>
                <ModuleGuard 
                  moduleCode={page.moduleCode} 
                  fallback={<Navigate to="/app" replace />}
                >
                  <Suspense fallback={<LoadingFallback />}>
                    <PageComponent />
                  </Suspense>
                </ModuleGuard>
              </PrivateRoute>
            }
          />
        );
      })}

      {/* Route 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Rendu du composant racine
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PrelaunchRedirect>
          <App />
        </PrelaunchRedirect>
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
