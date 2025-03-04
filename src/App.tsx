
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import RootLayout from "./components/RootLayout";
import AdminLayout from "./components/admin/AdminLayout";
import AdminRoute from "./components/auth/AdminRoute";
import PrivateRoute from "./components/auth/PrivateRoute";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Clothes from "./pages/Clothes";
import Outfits from "./pages/Outfits";
import TrendingOutfits from "./pages/TrendingOutfits";
import AdminDashboard from "./pages/AdminDashboard";
import Suitcases from "./pages/Suitcases";
import VirtualTryOn from "./pages/VirtualTryOn";
import Shop from "./pages/Shop";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/hooks/use-toast";
import { PrelaunchRedirect } from "./components/home/PrelaunchRedirect";
import Waitlist from "./pages/Waitlist";
import AdminWaitlist from "./pages/admin/AdminWaitlist";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <PrelaunchRedirect>
          <RootLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/landing" replace />} />
              <Route path="/landing" element={<Landing />} />
              <Route path="/waitlist" element={<Waitlist />} />
              
              {/* Auth Routes */}
              <Route path="/auth/*" element={<Auth />} />
              
              {/* Private Routes */}
              <Route path="/app" element={<PrivateRoute />}>
                <Route index element={<Home />} />
                <Route path="feed" element={<Feed />} />
                <Route path="profile" element={<Profile />} />
                <Route path="clothes" element={<Clothes />} />
                <Route path="outfits" element={<Outfits />} />
                <Route path="trending" element={<TrendingOutfits />} />
                <Route path="suitcases" element={<Suitcases />} />
                <Route path="try-on" element={<VirtualTryOn />} />
                <Route path="shop" element={<Shop />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<Admin />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="waitlist" element={<AdminWaitlist />} />
              </Route>
              
              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RootLayout>
        </PrelaunchRedirect>
        <Toaster />
      </ToastProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
