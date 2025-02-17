
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, ShoppingCart } from "lucide-react";
import { Button } from "../components/ui/button";
import MainSidebar from "../components/MainSidebar";
import { CartSidebar } from "../components/cart/CartSidebar";

export function RootLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
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

      {/* Cart button */}
      <Button
        variant="outline"
        size="default"
        className="fixed top-4 right-4 z-50"
        onClick={() => setIsCartOpen(true)}
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Voir mon panier
      </Button>

      <MainSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <div className="md:pl-64 pt-16">
        <Outlet />
      </div>

      {isCartOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsCartOpen(false)}
          />
          <CartSidebar onClose={() => setIsCartOpen(false)} />
        </>
      )}
    </div>
  );
}