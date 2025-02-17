import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Protection des routes
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";

// Layouts
import { RootLayout } from "./components/RootLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";

// Pages issues de main.tsx
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import AdminLogin from "@/pages/AdminLogin";
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
import VirtualTryOn from "@/pages/VirtualTryOn";
import Suitcases from "@/pages/Suitcases";
import Boutiques from "@/pages/Boutiques";
import ShopDetail from "@/pages/ShopDetail";
import Cart from "@/pages/Cart";

// Pages issues de App.tsx
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import EditShop from "./pages/EditShop";
import CreateClothe from "./pages/CreateClothe";
import EditClothe from "./pages/EditClothe";
import PaymentSuccess from "./pages/payment-success";
import PaymentCancelled from "./pages/payment-cancelled";

// Pages Admin
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminShops from "@/pages/admin/AdminShops";
import AdminMarketplace from "@/pages/admin/AdminMarketplace";
import AdminContent from "@/pages/admin/AdminContent";
import AdminStats from "@/pages/admin/AdminStats";
import AdminMarketing from "@/pages/admin/AdminMarketing";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminHelp from "@/pages/admin/AdminHelp";

import "./index.css";

// Création du client react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Mapping des routes issues de main.tsx (en complément des routes d'App.tsx)
const mainRouteComponents = {
  "/suggestions": Suggestions,
  "/feed": Feed,
  "/challenges": Challenges,
  "/challenge/:id": Challenge,
  "/search": Search,
  "/trending/outfits": TrendingOutfits,
  "/hashtags": Hashtags,
  "/explore": Explore,
  "/boutiques": Boutiques,
  // La route "/shops/:id" est ignorée au profit de "/shops/:shopId"
  "/clothes": Clothes,
  "/outfits": Outfits,
  "/personal": Personal,
  "/suitcases": Suitcases,
  "/community": Community,
  "/messages": Messages,
  "/groups": Groups,
  "/notifications": Notifications,
  "/friends": Friends,
  "/find-friends": FindFriends,
  "/profile/settings": Settings,
  "/marketplace": Shops,
  "/help": HelpAndSupport,
  "/virtual-tryon": VirtualTryOn,
  "/cart": Cart
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Routes Publiques */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/login" element={<Auth />} />
      <Route path="/auth/admin" element={<AdminLogin />} />

      {/* Section Admin */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="shops" element={<AdminShops />} />
        <Route path="marketplace" element={<AdminMarketplace />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="stats" element={<AdminStats />} />
        <Route path="marketing" element={<AdminMarketing />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="help" element={<AdminHelp />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Routes protégées sous RootLayout */}
      <Route element={<PrivateRoute><RootLayout /></PrivateRoute>}>
        {/* Routes d'App.tsx */}
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shops/:shopId" element={<Shop />} />
        <Route path="/shops/create" element={<CreateShop />} />
        <Route path="/shops/:shopId/edit" element={<EditShop />} />
        <Route path="/shops/:shopId/clothes/create" element={<CreateClothe />} />
        <Route path="/shops/:shopId/clothes/:clotheId/edit" element={<EditClothe />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancelled" element={<PaymentCancelled />} />

        {/* Routes supplémentaires issues de main.tsx */}
        {Object.entries(mainRouteComponents).map(([path, Component]) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Fallback global */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
