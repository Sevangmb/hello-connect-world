import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, Menu } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminMenu } from "@/components/admin/AdminMenu";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function AdminLayout() {
  const [adminRole, setAdminRole] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { metrics } = useAdminMetrics();

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/');
          return;
        }

        // D'abord essayer avec RPC si disponible
        try {
          const { data: isUserAdmin, error: rpcError } = await supabase.rpc('is_admin', {
            user_id: user.id
          });
          
          if (rpcError) {
            console.error("RPC error:", rpcError);
          } else if (isUserAdmin !== undefined) {
            if (!isUserAdmin) {
              toast({
                variant: "destructive",
                title: "Accès refusé",
                description: "Vous n'avez pas les droits d'administration nécessaires."
              });
              navigate('/');
              return;
            }
            setAdminRole(!!isUserAdmin);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.log("RPC not available, using direct query");
        }

        // Requête directe comme fallback
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error checking admin role:", error);
          navigate('/');
          return;
        }

        if (!profile?.is_admin) {
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Vous n'avez pas les droits d'administration nécessaires."
          });
          navigate('/');
          return;
        }

        setAdminRole(profile?.is_admin || false);
      } catch (error) {
        console.error("Error checking admin role:", error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    // Mode développement: permettre l'accès admin plus facilement
    if (process.env.NODE_ENV === 'development') {
      const devBypass = localStorage.getItem('dev_admin_bypass');
      if (devBypass === 'true') {
        console.warn("DEV MODE: Admin bypass enabled");
        setAdminRole(true);
        setIsLoading(false);
        return;
      }
    }

    checkAdminRole();
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la déconnexion",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!adminRole) {
    return null; // Le useEffect redirigera l'utilisateur
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
          <div className="mb-8 flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">FRING! Administration</h1>
              <p className="text-sm text-muted-foreground">
                Gérer votre plateforme et vos utilisateurs
              </p>
            </div>
            
            {/* Mobile menu */}
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0 pt-16">
                  <AdminMenu />
                </SheetContent>
              </Sheet>
              
              <Button
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Déconnexion
              </Button>
            </div>
          </div>
          
          {/* Admin stats overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-muted-foreground">Utilisateurs</h3>
              <p className="text-2xl font-bold">{metrics.totalUsers}</p>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">+{metrics.newUsers}</span> nouveaux ce mois
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-muted-foreground">Actifs</h3>
              <p className="text-2xl font-bold">{metrics.activeUsers}</p>
              <p className="text-xs text-muted-foreground">
                Taux de rétention: {metrics.retentionRate}%
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-muted-foreground">Croissance</h3>
              <p className="text-2xl font-bold">{metrics.growthRate}%</p>
              <p className="text-xs text-muted-foreground">
                Par rapport au mois précédent
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-sm font-medium text-muted-foreground">Taux d'abandon</h3>
              <p className="text-2xl font-bold">{metrics.churnRate}%</p>
              <p className="text-xs text-muted-foreground">
                Utilisateurs inactifs
              </p>
            </div>
          </div>
          
          <Outlet />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
