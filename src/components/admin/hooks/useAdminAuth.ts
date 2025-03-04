
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function useAdminAuth() {
  const [adminRole, setAdminRole] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return {
    adminRole,
    isLoading,
    handleLogout
  };
}
