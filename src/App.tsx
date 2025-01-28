import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { toast, Toaster as Sonner } from "sonner";

// Page imports
import Auth from "@/pages/Auth";
import Feed from "@/pages/Feed";
import Personal from "@/pages/Personal";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Explore from "@/pages/Explore";
import Community from "@/pages/Community";
import Challenges from "@/pages/Challenges";
import Friends from "@/pages/Friends";
import Suggestions from "@/pages/Suggestions";
import NotFound from "@/pages/NotFound";
import Clothes from "@/pages/Clothes";
import { OutfitsList } from "@/components/outfits/OutfitsList";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            {/* Routes principales */}
            <Route path="/" element={<Feed />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Routes Mon Univers */}
            <Route path="/clothes" element={<Clothes />} />
            <Route path="/wardrobe" element={<Navigate to="/clothes" replace />} />
            <Route path="/outfits" element={<OutfitsList />} />
            <Route path="/looks" element={<Navigate to="/clothes" replace />} />
            <Route path="/suitcases" element={<Navigate to="/clothes" replace />} />
            <Route path="/favorites" element={<Navigate to="/clothes" replace />} />
            <Route path="/add-clothes" element={<Navigate to="/clothes" replace />} />
            <Route path="/create-outfit" element={<Navigate to="/clothes" replace />} />
            <Route path="/publish-look" element={<Navigate to="/clothes" replace />} />
            
            {/* Routes Communauté */}
            <Route path="/personal" element={<Personal />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/community" element={<Community />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/groups" element={<Navigate to="/community" replace />} />
            
            {/* Routes Vide-Dressing */}
            <Route path="/marketplace" element={<Navigate to="/clothes" replace />} />
            <Route path="/add-item" element={<Navigate to="/clothes" replace />} />
            <Route path="/sales-history" element={<Navigate to="/clothes" replace />} />
            <Route path="/purchases" element={<Navigate to="/clothes" replace />} />
            
            {/* Routes Récompenses */}
            <Route path="/badges" element={<Navigate to="/profile" replace />} />
            
            {/* Routes Paramètres */}
            <Route path="/privacy" element={<Navigate to="/profile" replace />} />
            
            {/* Routes IA */}
            <Route path="/suggestions" element={<Suggestions />} />

            {/* Routes Administration */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/shops" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/marketplace" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/content" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/stats" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/marketing" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/settings" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/help" element={<Navigate to="/admin/dashboard" replace />} />
            
            {/* Route 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;