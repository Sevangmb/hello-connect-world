
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { getAuthService } from "@/core/auth/infrastructure/authDependencyProvider";
import { getUserService } from "@/core/users/infrastructure/userDependencyProvider";

const useAdminCheck = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const authService = getAuthService();
  const userService = getUserService();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        
        // Vérifier la session
        const user = await authService.getCurrentUser();
        
        if (process.env.NODE_ENV === 'development') { 
          console.log("Checking admin status for user:", user?.id); 
        }

        if (!user) {
          if (process.env.NODE_ENV === 'development') { 
            console.log("No active session found"); 
          }
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Veuillez vous connecter pour accéder à cette page",
          });
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Mode développement: permettre l'accès admin plus facilement
        if (process.env.NODE_ENV === 'development') {
          const devBypass = localStorage.getItem('dev_admin_bypass');
          if (devBypass === 'true') {
            console.warn("DEV MODE: Admin bypass enabled");
            setIsAdmin(true);
            setLoading(false);
            return;
          }
        }

        // Vérifier si l'utilisateur est admin
        const isUserAdmin = await userService.isUserAdmin(user.id);
        setIsAdmin(isUserAdmin);
        
        if (!isUserAdmin) {
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Vous n'avez pas les droits administrateur nécessaires",
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error in admin check:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification des permissions",
        });
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [toast]);

  return { loading, isAdmin };
};

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { loading, isAdmin } = useAdminCheck();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // En mode développement, autoriser l'accès admin même sans authentification
  if (process.env.NODE_ENV === 'development' && localStorage.getItem('dev_admin_bypass') === 'true') {
    console.warn("DEV MODE: Admin bypass active - accès admin autorisé sans vérification");
    return <>{children}</>;
  }

  if (!isAdmin) {
    console.log("Access denied: User is not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("Admin access granted");
  return <>{children}</>;
}
