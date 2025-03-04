
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { getAuthService } from "@/core/auth/infrastructure/authDependencyProvider";
import { getUserService } from "@/core/users/infrastructure/userDependencyProvider";
import { supabase } from "@/integrations/supabase/client";

const useAdminCheck = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const authService = getAuthService();
  const userService = getUserService();
  const location = useLocation();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        
        // Vérifier la session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erreur de session:", sessionError);
          toast({
            variant: "destructive",
            title: "Erreur de session",
            description: "Impossible de vérifier votre session",
          });
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        if (!session) {
          console.log("AdminRoute - Aucune session active");
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Veuillez vous connecter pour accéder à cette page",
          });
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        const user = session.user;
        
        if (process.env.NODE_ENV === 'development') { 
          console.log("Vérification du statut admin pour l'utilisateur:", user?.id); 
        }

        if (!user) {
          console.log("AdminRoute - Utilisateur non trouvé dans la session");
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

        // Vérifier si l'utilisateur est admin via RPC
        try {
          const { data: isUserAdmin, error: rpcError } = await supabase.rpc('is_admin', {
            user_id: user.id
          });
          
          if (rpcError) {
            console.error("Erreur RPC is_admin:", rpcError);
            // Continue with fallback
          } else if (isUserAdmin !== undefined) {
            console.log("Statut admin (via RPC):", isUserAdmin);
            setIsAdmin(!!isUserAdmin);
            setLoading(false);
            
            if (!isUserAdmin) {
              toast({
                variant: "destructive",
                title: "Accès refusé",
                description: "Vous n'avez pas les droits administrateur nécessaires",
              });
            }
            
            return;
          }
        } catch (rpcError) {
          console.log("RPC is_admin non disponible, utilisation de la méthode alternative");
        }

        // Méthode alternative via le service utilisateur
        const isUserAdmin = await userService.isUserAdmin(user.id);
        console.log("Statut admin (via service):", isUserAdmin);
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
        console.error("Erreur dans la vérification du statut admin:", error);
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
  }, [toast, location.pathname]);

  return { loading, isAdmin };
};

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { loading, isAdmin } = useAdminCheck();
  const location = useLocation();

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
    console.log("Accès refusé: L'utilisateur n'est pas admin, redirection vers la page d'accueil");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  console.log("Accès admin accordé");
  return <>{children}</>;
}
