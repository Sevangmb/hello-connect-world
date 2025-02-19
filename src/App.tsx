import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddShopItem from "@/pages/shop/AddShopItem";
import Home from "./pages/Home";
import Boutiques from "./pages/Boutiques";
import CreateShop from "./pages/CreateShop";
import ShopDetail from "./pages/ShopDetail";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import EditShop from "./pages/EditShop";
import Cart from "./pages/Cart";
import PaymentSuccess from "./pages/payment-success";
import PaymentCancel from "./pages/payment-cancel";
import Admin from "./pages/admin/Admin";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminMarketplace from "./pages/admin/AdminMarketplace";
import AdminShops from "./pages/admin/AdminShops";
import Auth from "./pages/Auth";
import Clothes from "./pages/Clothes";
import Suitcases from "./pages/Suitcases";
import Likes from "./pages/Likes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/boutiques" element={<Boutiques />} />
          <Route path="/shops" element={<Boutiques />} />
          <Route path="/shops/create" element={<CreateShop />} />
          <Route path="/shops/:id" element={<ShopDetail />} />
          <Route path="/shops/:shopId/edit" element={<EditShop />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/marketplace" element={<AdminMarketplace />} />
          <Route path="/admin/shops" element={<AdminShops />} />
          <Route path="/clothes" element={<Clothes />} />
          <Route path="/suitcases" element={<Suitcases />} />
          <Route path="/likes" element={<Likes />} />
          <Route path="/shops/:shopId/items/new" element={<AddShopItem />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
