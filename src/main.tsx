import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
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
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminShops from "@/pages/admin/AdminShops";
import AdminMarketplace from "@/pages/admin/AdminMarketplace";
import AdminContent from "@/pages/admin/AdminContent";
import AdminStats from "@/pages/admin/AdminStats";
import AdminMarketing from "@/pages/admin/AdminMarketing";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminHelp from "@/pages/admin/AdminHelp";
import { AdminRoute } from "@/components/auth/AdminRoute";
import VirtualTryOn from "@/pages/VirtualTryOn";
import Suitcases from "@/pages/Suitcases";
import Boutiques from "@/pages/Boutiques";
import ShopDetail from "@/pages/ShopDetail";
import "./index.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/login" element={<Auth />} />
      <Route path="/auth/admin" element={<AdminLogin />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Index />
          </PrivateRoute>
        }
      />

      {/* Redirect root to landing for non-authenticated users */}
      <Route path="/" element={<Navigate to="/landing" replace />} />

      {/* Admin Section */}
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

      {/* Protected routes */}
      {[
        "/suggestions",
        "/feed",
        "/challenges",
        "/challenge/:id",
        "/search",
        "/trending/outfits",
        "/hashtags",
        "/explore",
        "/boutiques",
        "/shops/:id",
        "/shops/create",
        "/clothes",
        "/outfits",
        "/personal",
        "/suitcases",
        "/community",
        "/messages",
        "/groups",
        "/notifications",
        "/friends",
        "/find-friends",
        "/profile",
        "/profile/settings",
        "/marketplace",
        "/help",
        "/virtual-tryon"
      ].map((path) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute>
              {React.createElement(
                // Dynamically import the component based on the path
                require(`@/pages${path.replace(':id', '[id]')}`).default
              )}
            </PrivateRoute>
          }
        />
      ))}

      {/* Fallback Route */}
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
