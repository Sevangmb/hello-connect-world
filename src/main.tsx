import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Shops from "@/pages/Shops";
import CreateShop from "@/pages/CreateShop"; // Ajout de l'import
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
import { AdminRoute } from "@/components/auth/AdminRoute";
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

// App component merged directly into main
const App = () => {
  return (
    <Routes>
      {/* Auth Section - Public routes for authentication (login, admin login) */}
      <Route path="/auth" element={<Auth />} />
      
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
      </Route>

      {/* Home Section - Public routes for general site content (Index, feed, challenges, etc.) */}
      <Route path="/" element={<Index />} />
      <Route path="/suggestions" element={<Suggestions />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/challenges" element={<Challenges />} />
      <Route path="/challenge/:id" element={<Challenge />} />

      {/* Explore Section - Public routes for exploring content (search, trending, hashtags, shops, stores, etc.) */}
      <Route path="/search" element={<Search />} />
      <Route path="/trending/outfits" element={<TrendingOutfits />} />
      <Route path="/hashtags" element={<Hashtags />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/shops" element={<Shops />} />
      <Route path="/shops/create" element={<CreateShop />} /> {/* Ajout de la nouvelle route */}
      <Route path="/stores/map" element={<StoresList />} />
      <Route path="/stores/search" element={<StoresList />} />
      <Route path="/stores/list" element={<StoresList />} />

      {/* Personal Section - Public routes for personalized user content (clothes, outfits, personal profile) */}
      <Route path="/clothes" element={<Clothes />} />
      <Route path="/outfits" element={<Outfits />} />
      <Route path="/personal" element={<Personal />} />

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
      <Route path="/help" element={<NotFound />} />

      {/* Fallback Route - Catches unmatched paths and renders NotFound component */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{/* Provides routing context for the application */}
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);