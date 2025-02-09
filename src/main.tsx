import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import HelpAndSupport from "@/pages/HelpAndSupport";
import Shops from "@/pages/Shops";
import CreateShop from "@/pages/CreateShop";
import StoresMap from "@/pages/StoresMap"; // Mise à jour de l'import
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
import "./index.css";
import VirtualTryOn from "@/pages/VirtualTryOn";
import Suitcases from "@/pages/Suitcases";

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
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/login" element={<Auth />} />
      <Route path="/auth/admin" element={<AdminLogin />} />

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

      {/* Home Section */}
      <Route path="/" element={<Index />} />
      <Route path="/suggestions" element={<Suggestions />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="/challenge/:id" element={<Challenge />} />

      {/* Explore Section */}
      <Route path="/search" element={<Search />} />
      <Route path="/trending/outfits" element={<TrendingOutfits />} />
      <Route path="/hashtags" element={<Hashtags />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/shops" element={<Shops />} />
      <Route path="/shops/create" element={<CreateShop />} />
      <Route path="/stores/map" element={<StoresMap />} /> {/* Correction de la route */}
      <Route path="/stores/search" element={<StoresList />} />
      <Route path="/stores/list" element={<StoresList />} />

      <Route path="/clothes" element={<Clothes />} />
      <Route path="/outfits" element={<Outfits />} />
      <Route path="/personal" element={<Personal />} />
      <Route path="/suitcases" element={<Suitcases />} />

      {/* Community Section - Public routes for community interaction (community, messages, groups, notifications, friends) */}
      <Route path="/community" element={<Community />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/groups" element={<Groups />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/find-friends" element={<FindFriends />} />

      {/* Profile Section - Public routes for user profile and settings, plus marketplace/help fallback */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/settings" element={<Settings />} />
      <Route path="/marketplace" element={<StoresList />} />
      <Route path="/help" element={<HelpAndSupport />} />

      <Route path="/virtual-tryon" element={<VirtualTryOn />} />

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
