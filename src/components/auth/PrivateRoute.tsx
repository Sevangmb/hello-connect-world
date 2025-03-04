
"use client"

import * as React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAuthService } from "@/core/auth/infrastructure/authDependencyProvider";
import { supabase } from "@/integrations/supabase/client";

const useAuthCheck = () => {
  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(false);
  const { toast } = useToast();
  const authService = getAuthService();

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Vérification de l'authentification dans PrivateRoute");
        // Vérifier d'abord la session active
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Erreur de session:", sessionError);
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        if (!session) {
          console.log("Aucune session active - redirection vers /auth");
          setAuthenticated(false);
          setLoading(false);
          return;
        }
        
        // Récupérer l'utilisateur pour confirmer
        const user = await authService.getCurrentUser();
        const isAuth = !!user;
        console.log("État d'authentification:", isAuth ? 'Authentifié' : 'Non authentifié');
        setAuthenticated(isAuth);
      } catch (error) {
        console.error("Erreur dans la vérification d'authentification:", error);
        toast({
          variant: "destructive",
          title: "Erreur d'authentification",
          description: "Veuillez vous reconnecter",
        });
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // S'abonner aux changements d'état d'authentification
    const unsubscribe = authService.subscribeToAuthChanges((user) => {
      console.log("Changement d'état d'auth dans PrivateRoute:", user ? 'Authentifié' : 'Non authentifié');
      setAuthenticated(!!user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authenticated) {
    console.log("Non authentifié - redirection vers /auth depuis", location.pathname);
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log("Authentifié - accès autorisé à", location.pathname);
  return <>{children}</>;
}
