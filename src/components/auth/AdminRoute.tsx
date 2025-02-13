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
          setLoading(false);
          return;
        }

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
          setLoading(false);
          return;
        }

        if (process.env.NODE_ENV === 'development') { 
          console.log("Admin check result for user", session.user.id, ":", profile?.is_admin); 
        }

        if (!profile?.is_admin) {
          toast({
            variant: "destructive",
            title: "Accès refusé",
            description: "Vous n'avez pas les permissions d'administrateur nécessaires",
          });
        }

        setIsAdmin(profile?.is_admin || false);
        setLoading(false);
      } catch (error) {
        console.error("Error in admin check:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification des permissions",
        });
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
        <Loader2 className="h-8 w-8 animate-spin text-facebook-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
