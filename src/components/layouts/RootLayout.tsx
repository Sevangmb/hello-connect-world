
import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { SidebarProvider } from "@/contexts/SidebarContext";

export function RootLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <MainSidebar />
        <main className="flex-1 pt-16 md:pl-64">
          <Outlet />
        </main>
        <CartSidebar open={false} onClose={() => {}} />
      </div>
    </SidebarProvider>
  );
}
