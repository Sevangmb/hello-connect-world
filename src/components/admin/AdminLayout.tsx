
import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminMenu } from "@/components/admin/AdminMenu";
import { useAdminAuth } from "@/components/admin/hooks/useAdminAuth";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMetricsOverview } from "@/components/admin/AdminMetricsOverview";

export function AdminLayout() {
  const { adminRole, isLoading, handleLogout } = useAdminAuth();
  const { metrics } = useAdminMetrics();

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Header />
      
      {/* Sidebar for desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 overflow-y-auto border-r border-gray-200 bg-white pt-16 md:block">
        <AdminMenu />
      </aside>
      
      {/* Main content */}
      <div className="pt-16 md:pl-64 w-full">
        <div className="p-8">
          <AdminHeader handleLogout={handleLogout} />
          <AdminMetricsOverview metrics={metrics} />
          <Outlet />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
