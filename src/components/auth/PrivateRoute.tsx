import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const useAuthCheck = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth status:", error);
          toast({
            variant: "destructive",
            title: "Erreur d'authentification",
            description: "Veuillez vous reconnecter",
          });
          setAuthenticated(false);
          
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            await supabase.auth.signOut();
          }
        } else {
          setAuthenticated(!!session);
        }
      } catch (error) {
        console.error("Error in auth check:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token was refreshed successfully');
      }
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setAuthenticated(false);
      }

      setAuthenticated(!!session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return { loading, authenticated };
};

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { loading, authenticated } = useAuthCheck();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-facebook-primary" />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
