import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Auth from "@/pages/Auth";
import Feed from "@/pages/Feed";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import Index from "@/pages/Index";
import Explore from "@/pages/Explore";
import Personal from "@/pages/Personal";
import Community from "@/pages/Community";
import Profile from "@/pages/Profile";
import Challenges from "@/pages/Challenges";
import Challenge from "@/pages/Challenge";
import Messages from "@/pages/Messages";
import Groups from "@/pages/Groups";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Profile/Settings";
import Clothes from "@/pages/Clothes";
import Outfits from "@/pages/Outfits";

function App() {
  const { toast } = useToast();

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_IN') {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue !",
        });
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Déconnexion",
          description: "À bientôt !",
        });
      } else if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={<Auth />} />

      {/* Protected routes */}
      <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
      <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
      <Route path="/explore" element={<PrivateRoute><Explore /></PrivateRoute>} />
      <Route path="/personal" element={<PrivateRoute><Personal /></PrivateRoute>} />
      <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/profile/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      
      {/* Challenges routes */}
      <Route path="/challenges" element={<PrivateRoute><Challenges /></PrivateRoute>} />
      <Route path="/challenges/:id" element={<PrivateRoute><Challenge /></PrivateRoute>} />
      
      {/* Community routes */}
      <Route path="/messages" element={<PrivateRoute><Messages /></PrivateRoute>} />
      <Route path="/groups" element={<PrivateRoute><Groups /></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
      
      {/* Personal routes */}
      <Route path="/clothes" element={<PrivateRoute><Clothes /></PrivateRoute>} />
      <Route path="/outfits" element={<PrivateRoute><Outfits /></PrivateRoute>} />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;