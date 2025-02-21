import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
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
import AdminMarketplace from "@/pages/admin/AdminMarketplace";
import AdminContent from "@/pages/admin/AdminContent";
import AdminStats from "@/pages/admin/AdminStats";
import AdminMarketing from "@/pages/admin/AdminMarketing";
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

const routeComponents = {
  '/suggestions': Suggestions,
  '/feed': Feed,
  '/challenges': Challenges,
  '/challenge/:id': Challenge,
  '/search': Search,
  '/trending/outfits': TrendingOutfits,
  '/hashtags': Hashtags,
  '/explore': Explore,
  '/boutiques': Boutiques,
  '/shops/:id': ShopDetail,
  '/shops/create': CreateShop,
  '/clothes': Clothes,
  '/outfits': Outfits,
  '/personal': Personal,
  '/suitcases': Suitcases,
  '/community': Community,
  '/messages': Messages,
  '/groups': Groups,
  '/notifications': Notifications,
  '/friends': Friends,
  '/find-friends': FindFriends,
  '/profile': Profile,
  '/profile/settings': Settings,
  '/marketplace': Shops,
  '/help': HelpAndSupport,
  '/virtual-tryon': VirtualTryOn,
  '/cart': Cart,
  '/checkout': Checkout,
  '/favorites': Favorites,
  '/calendar': Calendar,
};

const App = () => {
  return (
    <Routes>
      <Route path="/landing" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/login" element={<Auth />} />
      <Route path="/auth/admin" element={<AdminLogin />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Index />
          </PrivateRoute>
        }
      />

      <Route path="/" element={<Navigate to="/landing" replace />} />

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
        <Route path="marketplace" element={<AdminMarketplace />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="stats" element={<AdminStats />} />
        <Route path="marketing" element={<AdminMarketing />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="help" element={<AdminHelp />} />
      </Route>

      {Object.entries(routeComponents).map(([path, Component]) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute>
              <Component />
            </PrivateRoute>
          }
        />
      ))}

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
