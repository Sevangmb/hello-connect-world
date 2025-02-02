import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { Admin } from "@/layouts/Admin";
import { AdminRoute } from "@/components/auth/AdminRoute";
import ShopDetail from "@/pages/ShopDetail";
import ClothesDetail from "@/pages/ClothesDetail";
import OutfitDetail from "@/pages/OutfitDetail";
import Help from "@/pages/Help";
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
      {/* Auth Section */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/login" element={<Auth />} />
      <Route path="/auth/admin" element={<AdminLogin />} />

      {/* Admin Section */}
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

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
      <Route path="/shops/create" element={<CreateShop />} /> {/* Ajout de la nouvelle route */}
      <Route path="/shops/:id" element={<ShopDetail />} />

      {/* Personal Section */}
      <Route path="/clothes" element={<Clothes />} />
      <Route path="/clothes/:id" element={<ClothesDetail />} />
      <Route path="/clothes/:id" element={<ClothesDetail />} />
      <Route path="/outfits" element={<Outfits />} />
      <Route path="/outfits/:id" element={<OutfitDetail />} />
      <Route path="/outfits/:id" element={<OutfitDetail />} />
      <Route path="/personal" element={<Personal />} />

      {/* Community Section */}
      <Route path="/community" element={<Community />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/groups" element={<Groups />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/friends" element={<Friends />} />
      <Route path="/find-friends" element={<FindFriends />} />

      {/* Profile Section */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/settings" element={<Settings />} />
      <Route path="/marketplace" element={<Shops />} />
      <Route path="/help" element={<Help />} />

      {/* 404 */}
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