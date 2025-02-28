
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { ModuleGuard } from "@/components/modules/ModuleGuard";
import Landing from "@/pages/Landing";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import HelpAndSupport from "@/pages/HelpAndSupport";
import Shops from "@/pages/Shops";
import CreateShop from "@/pages/CreateShop";
import StoresMap from "@/pages/StoresMap";
import StoresList from "@/pages/StoresList";
import Search from "@/pages/Search";
import TrendingOutfits from "@/pages/TrendingOutfits";
import Hashtags from "@/pages/Hashtags";
import Explore from "@/pages/Explore";
import Suggestions from "@/pages/Suggestions";
import Feed from "@/pages/Feed";
import Challenges from "@/pages/Challenges";
import Challenge from "@/pages/Challenge";
import Clothes from "@/pages/Clothes";
import Outfits from "@/pages/Outfits";
import Personal from "@/pages/Personal";
import Community from "@/pages/Community";
import Groups from "@/pages/Groups";
import Messages from "@/pages/Messages";
import Notifications from "@/pages/Notifications";
import Friends from "@/pages/Friends";
import FindFriends from "@/pages/FindFriends";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Auth from "@/pages/Auth";
import AdminLogin from "@/pages/AdminLogin";
import Calendar from "@/pages/Calendar";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Boutiques from "@/pages/Boutiques";
import ShopDetail from "@/pages/ShopDetail";
import Suitcases from "@/pages/Suitcases";
import VirtualTryOn from "@/pages/VirtualTryOn";
import Cart from "@/pages/Cart";
import Favorites from "@/pages/Favorites";
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
import Checkout from "@/pages/Checkout";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Configuration des modules pour chaque route
const moduleRoutes = {
  '/suggestions': { component: Suggestions, moduleCode: 'suggestions' },
  '/feed': { component: Feed, moduleCode: 'social_feed' },
  '/challenges': { component: Challenges, moduleCode: 'challenges' },
  '/challenge/:id': { component: Challenge, moduleCode: 'challenges' },
  '/search': { component: Search, moduleCode: 'search' },
  '/trending/outfits': { component: TrendingOutfits, moduleCode: 'trending' },
  '/hashtags': { component: Hashtags, moduleCode: 'hashtags' },
  '/explore': { component: Explore, moduleCode: 'explore' },
  '/boutiques': { component: Boutiques, moduleCode: 'marketplace' },
  '/shops/:id': { component: ShopDetail, moduleCode: 'marketplace' },
  '/shops/create': { component: CreateShop, moduleCode: 'marketplace' },
  '/clothes': { component: Clothes, moduleCode: 'wardrobe' },
  '/outfits': { component: Outfits, moduleCode: 'outfits' },
  '/personal': { component: Personal, moduleCode: 'profile' },
  '/suitcases': { component: Suitcases, moduleCode: 'suitcases' },
  '/community': { component: Community, moduleCode: 'community' },
  '/messages': { component: Messages, moduleCode: 'messaging' },
  '/groups': { component: Groups, moduleCode: 'groups' },
  '/notifications': { component: Notifications, moduleCode: 'notifications' },
  '/friends': { component: Friends, moduleCode: 'friends' },
  '/find-friends': { component: FindFriends, moduleCode: 'friends' },
  '/profile': { component: Profile, moduleCode: 'profile' },
  '/profile/settings': { component: Settings, moduleCode: 'profile' },
  '/marketplace': { component: Shops, moduleCode: 'marketplace' },
  '/help': { component: HelpAndSupport, moduleCode: 'help' },
  '/virtual-tryon': { component: VirtualTryOn, moduleCode: 'virtual_tryon' },
  '/cart': { component: Cart, moduleCode: 'shopping' },
  '/checkout': { component: Checkout, moduleCode: 'shopping' },
  '/favorites': { component: Favorites, moduleCode: 'favorites' },
  '/calendar': { component: Calendar, moduleCode: 'calendar' },
};

// Routes qui sont toujours disponibles (core)
const alwaysAvailableRoutes = [
  { path: "/landing", element: <Landing /> },
  { path: "/auth", element: <Auth /> },
  { path: "/auth/login", element: <Auth /> },
  { path: "/auth/admin", element: <AdminLogin /> },
];

const App = () => {
  return (
    <Routes>
      {/* Routes toujours disponibles */}
      {alwaysAvailableRoutes.map(route => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Index />
          </PrivateRoute>
        }
      />

      {/* Route par défaut redirige vers landing */}
      <Route path="*" element={<Navigate to="/landing" replace />} />

      {/* Routes d'administration (protégées par AdminRoute) */}
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
      </Route>

      {/* Routes modulaires */}
      {Object.entries(moduleRoutes).map(([path, { component: Component, moduleCode }]) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute>
              <ModuleGuard 
                moduleCode={moduleCode} 
                fallback={<Navigate to="/" replace />}
              >
                <Component />
              </ModuleGuard>
            </PrivateRoute>
          }
        />
      ))}

      {/* Catch-all route pour les URLs non reconnues */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
