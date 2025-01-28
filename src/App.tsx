import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Auth from "@/pages/Auth";
import Feed from "@/pages/Feed";
import Clothes from "@/pages/Clothes";
import Personal from "@/pages/Personal";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Explore from "@/pages/Explore";
import Community from "@/pages/Community";
import Challenges from "@/pages/Challenges";
import Friends from "@/pages/Friends";
import Suggestions from "@/pages/Suggestions";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/clothes" element={<Clothes />} />
            <Route path="/wardrobe" element={<Navigate to="/clothes" replace />} />
            <Route path="/personal" element={<Personal />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/community" element={<Community />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;