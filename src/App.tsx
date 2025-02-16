
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "./components/ui/button";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Shop from "./pages/Shop";
import CreateShop from "./pages/CreateShop";
import EditShop from "./pages/EditShop";
import CreateClothe from "./pages/CreateClothe";
import EditClothe from "./pages/EditClothe";
import PaymentSuccess from "./pages/payment-success";
import PaymentCancelled from "./pages/payment-cancelled";
import { CartSidebar } from "./components/cart/CartSidebar";
import MainSidebar from "./components/MainSidebar";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Menu button sur mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        <MainSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <div className="md:pl-64 pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shops/:shopId" element={<Shop />} />
            <Route path="/shops/create" element={<CreateShop />} />
            <Route path="/shops/:shopId/edit" element={<EditShop />} />
            <Route path="/shops/:shopId/clothes/create" element={<CreateClothe />} />
            <Route path="/shops/:shopId/clothes/:clotheId/edit" element={<EditClothe />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancelled" element={<PaymentCancelled />} />
          </Routes>
        </div>
        <CartSidebar />
      </div>
    </Router>
  );
}
