
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminMenu } from "@/components/admin/AdminMenu";
import { useAdminAuth } from "@/components/admin/hooks/useAdminAuth";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMetricsOverview } from "@/components/admin/AdminMetricsOverview";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export function AdminLayout() {
  const { adminRole, isLoading, handleLogout } = useAdminAuth();
  const { metrics, loading } = useAdminMetrics();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Notification pour confirmer l'accès admin
    if (adminRole && !isLoading) {
      toast({
        title: "Accès administrateur activé",
        description: "Vous avez accès à toutes les fonctionnalités d'administration",
      });
    }
  }, [adminRole, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!adminRole) {
    return null; // Le useEffect dans useAdminAuth redirigera l'utilisateur
  }

  // Toggle du menu mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Header />
      
      {/* Overlay pour mobile - s'affiche uniquement quand le menu est ouvert */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar pour mobile et desktop */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 overflow-y-auto border-r border-gray-200 bg-white pt-16 z-30",
        "transform transition-transform duration-200 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex items-center justify-between p-4 md:hidden">
          <h1 className="text-xl font-bold">Administration</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <Separator className="md:hidden" />
        <AdminMenu />
      </aside>
      
      {/* Bouton de menu pour mobile - uniquement visible sur mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 right-4 z-40 md:hidden rounded-full bg-primary p-3 text-white shadow-lg"
      >
        <Menu className="h-6 w-6" />
      </button>
      
      {/* Main content */}
      <div className="pt-16 w-full md:pl-64 transition-all duration-200">
        <div className="p-4 md:p-8">
          <AdminHeader handleLogout={handleLogout} />
          <AdminMetricsOverview metrics={metrics} />
          <div className="mt-6">
            <Outlet />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
