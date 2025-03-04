
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated, refreshAuth } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        
        // Forcer une vérification d'authentification
        await refreshAuth();
        
        if (!isAuthenticated || !user) {
          console.log("AdminRoute - Non authentifié - redirection vers /auth");
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
            throw rpcError;
          }
          
          console.log("Statut admin (via RPC):", isUserAdmin);
          setIsAdmin(!!isUserAdmin);
          
          if (!isUserAdmin) {
            toast({
              variant: "destructive",
              title: "Accès refusé",
              description: "Vous n'avez pas les droits administrateur nécessaires",
            });
          }
        } catch (error) {
          console.error("Erreur dans la vérification du statut admin:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de la vérification des permissions",
          });
          setIsAdmin(false);
        } finally {
          setLoading(false);
        }
      } catch (error) {
        console.error("Exception lors de la vérification du statut admin:", error);
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [toast, location.pathname, user, isAuthenticated, refreshAuth]);

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
