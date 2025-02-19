import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import MainSidebar from "@/components/MainSidebar";
import { LogOut } from "lucide-react";

export function AdminLayout() {
  const [adminRole, setAdminRole] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (!profile?.is_admin) {
          navigate('/');
          return;
        }

        setAdminRole(profile?.is_admin || false);
      } catch (error) {
        console.error("Error checking admin role:", error);
        navigate('/');
      }
    };

    checkAdminRole();
  }, [navigate]);

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MainSidebar />
      
      {/* Main content */}
      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold">FRING! Admin</h1>
            <Button
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Déconnexion
            </Button>
          </div>
          
          <Outlet />
        </div>
      </div>
    </div>
  );
}
