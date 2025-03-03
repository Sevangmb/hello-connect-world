
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const useAdminCheck = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        
        // Vérifier la session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (process.env.NODE_ENV === 'development') { 
          console.log("Checking admin status for session:", session); 
        }

        if (!session) {
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

        // Vérifier si l'utilisateur est admin directement avec RPC
        try {
          const { data: isUserAdmin, error: rpcError } = await supabase.rpc('is_admin', {
            user_id: session.user.id
          });
          
          if (rpcError) {
            console.error("Error checking admin status with RPC:", rpcError);
            // Si la fonction RPC échoue, revenons à la méthode directe
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('is_admin')
              .eq('id', session.user.id)
              .single();

            if (error) {
              console.error("Error checking admin status:", error);
              toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de vérifier les permissions d'administrateur",
              });
              setIsAdmin(false);
            } else {
              setIsAdmin(profile?.is_admin || false);
            }
          } else {
            // Utiliser le résultat de la fonction RPC
            console.log("Admin status from RPC:", isUserAdmin);
            setIsAdmin(!!isUserAdmin);
          }
        } catch (error) {
          console.error("Error in admin check:", error);
          // Fallback à la méthode directe
          const { data: profile, error: queryError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();

          if (queryError) {
            console.error("Error checking admin status:", queryError);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de vérifier les permissions d'administrateur",
            });
            setIsAdmin(false);
          } else {
            setIsAdmin(profile?.is_admin || false);
          }
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

    checkAdminStatus();
  }, [toast]);

  return { loading, isAdmin };
};

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { loading, isAdmin } = useAdminCheck();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-facebook-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    console.log("Access denied: User is not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("Admin access granted");
  return <>{children}</>;
}
