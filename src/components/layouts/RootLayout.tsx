
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { CartSidebar } from "@/components/cart/CartSidebar";
import MainSidebar from "@/components/MainSidebar";

export function RootLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MainSidebar />
      <main className="flex-1 pt-16 md:pl-64">
        <Outlet />
      </main>
      <CartSidebar open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
