import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { SupabaseProvider } from "@/contexts/SupabaseContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Clothes from "@/pages/Clothes";
import Outfits from "@/pages/Outfits";
import Shops from "@/pages/Shops";
import CreateShop from "@/pages/CreateShop";
import Shop from "@/pages/Shop";
import Challenges from "@/pages/Challenges";
import Challenge from "@/pages/Challenge";
import CreateChallenge from "@/pages/CreateChallenge";
import Friends from "@/pages/Friends";
import Groups from "@/pages/Groups";
import Group from "@/pages/Group";
import CreateGroup from "@/pages/CreateGroup";
import Messages from "@/pages/Messages";
import Conversation from "@/pages/Conversation";
import Notifications from "@/pages/Notifications";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseProvider>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/clothes" element={<Clothes />} />
                <Route path="/outfits" element={<Outfits />} />
                <Route path="/shops" element={<Shops />} />
                <Route path="/shops/create" element={<CreateShop />} />
                <Route path="/shops/:id" element={<Shop />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/challenges/:id" element={<Challenge />} />
                <Route path="/challenges/create" element={<CreateChallenge />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/groups/:id" element={<Group />} />
                <Route path="/groups/create" element={<CreateGroup />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/messages/:id" element={<Conversation />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </SupabaseProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;