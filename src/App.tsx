
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import Explore from "./pages/Explore";
import Profile from "./pages/Profile";
import Settings from "./pages/Profile/Settings";
import './App.css';
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";
import AdminStats from "./pages/admin/AdminStats";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminHelp from "./pages/admin/AdminHelp";
import AdminLogin from "./pages/AdminLogin";
import AdminMarketplace from "./pages/admin/AdminMarketplace";
import AdminShops from "./pages/admin/AdminShops";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMarketing from "./pages/admin/AdminMarketing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Suitcases from "./pages/Suitcases";
import SuitcaseCalendar from "./pages/SuitcaseCalendar";
import Landing from "./pages/Landing";
import VirtualTryOn from "./pages/VirtualTryOn";
import StoresMap from "./pages/StoresMap";
import Shop from "./pages/Shop";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Clothes from "./pages/Clothes";
import CreateClothe from "./pages/CreateClothe";
import Favorites from "./pages/Favorites";
import EditClothe from "./pages/EditClothe";
import Personal from "./pages/Personal";
import StoresList from "./pages/StoresList";
import Challenges from "./pages/Challenges";
import Calendar from "./pages/Calendar";
import Shops from "./pages/Shops";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Boutiques from "./pages/Boutiques";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Friends from "./pages/Friends";
import PaymentSuccess from "./pages/payment-success";
import PaymentCancelled from "./pages/payment-cancelled";
import Outfits from "./pages/Outfits";
import TrendingOutfits from "./pages/TrendingOutfits";
import Community from "./pages/Community";
import CreateShop from "./pages/CreateShop";
import ShopDetail from "./pages/ShopDetail";
import EditShop from "./pages/EditShop";
import Challenge from "./pages/Challenge";
import FindFriends from "./pages/FindFriends";
import Groups from "./pages/Groups";
import Search from "./pages/Search";
import AdminModules from "./pages/admin/AdminModules";
import Hashtags from "./pages/Hashtags";
import Suggestions from "./pages/Suggestions";
import HelpAndSupport from "./pages/HelpAndSupport";
import { ModuleApiProvider } from "./hooks/modules/ModuleApiContext";

// Créer une instance du client de requête
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModuleApiProvider>
        <Router>
          <Routes>
            <Route path="/landing" element={<Landing />} />
            
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="stats" element={<AdminStats />} />
              <Route path="marketplace" element={<AdminMarketplace />} />
              <Route path="shops" element={<AdminShops />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="marketing" element={<AdminMarketing />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="help" element={<AdminHelp />} />
              <Route path="modules" element={<AdminModules />} />
            </Route>
            
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="clothes" element={<Clothes />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="create-clothe" element={<CreateClothe />} />
              <Route path="edit-clothe/:id" element={<EditClothe />} />
              <Route path="create-shop" element={<CreateShop />} />
              <Route path="edit-shop/:id" element={<EditShop />} />
              <Route path="personal" element={<Personal />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/settings" element={<Settings />} />
              <Route path="suitcases" element={<Suitcases />} />
              <Route path="suitcase-calendar" element={<SuitcaseCalendar />} />
              <Route path="virtual-tryon" element={<VirtualTryOn />} />
              <Route path="stores-map" element={<StoresMap />} />
              <Route path="stores-list" element={<StoresList />} />
              <Route path="shop" element={<Shop />} />
              <Route path="challenges" element={<Challenges />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="shops" element={<Shops />} />
              <Route path="shop/:id" element={<ShopDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="boutiques" element={<Boutiques />} />
              <Route path="feed" element={<Feed />} />
              <Route path="messages" element={<Messages />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="friends" element={<Friends />} />
              <Route path="find-friends" element={<FindFriends />} />
              <Route path="payment-success" element={<PaymentSuccess />} />
              <Route path="payment-cancelled" element={<PaymentCancelled />} />
              <Route path="outfits" element={<Outfits />} />
              <Route path="trending/outfits" element={<TrendingOutfits />} />
              <Route path="community" element={<Community />} />
              <Route path="challenge/:id" element={<Challenge />} />
              <Route path="groups" element={<Groups />} />
              <Route path="search" element={<Search />} />
              <Route path="hashtags" element={<Hashtags />} />
              <Route path="suggestions" element={<Suggestions />} />
              <Route path="help" element={<HelpAndSupport />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
        <SonnerToaster richColors closeButton position="top-right" />
      </ModuleApiProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
