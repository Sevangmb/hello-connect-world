
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { CartSidebar } from "@/components/cart/CartSidebar";

export function RootLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MainSidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />
      <main className="flex-1 pt-16 md:pl-64">
        <Outlet />
      </main>
      <CartSidebar open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
