
/**
 * Composant de route protégée pour l'administration
 * Redirige vers la page d'accueil si l'utilisateur n'est pas connecté ou n'est pas admin
 */
import * as React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAdminStatus } from "../hooks/useAdminStatus";
import { useToast } from "@/hooks/use-toast";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated, refreshAuth } = useAuth();
  const { isUserAdmin, loading: adminLoading } = useAdminStatus();
  const location = useLocation();
  const { toast } = useToast();

  React.useEffect(() => {
    console.log("AdminRoute - Vérification de l'authentification et des droits admin");
    refreshAuth();
  }, [refreshAuth, location.pathname]);

  // Afficher le statut pour le débogage
  React.useEffect(() => {
    console.log("Admin route status:", {
      isAuthenticated,
      isUserAdmin,
      loading,
      adminLoading,
      path: location.pathname
    });
  }, [isAuthenticated, isUserAdmin, loading, adminLoading, location.pathname]);

  if (loading || adminLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log("AdminRoute - Non authentifié - redirection vers /auth depuis", location.pathname);
    toast({
      title: "Accès refusé",
      description: "Veuillez vous connecter pour accéder à cette page",
      variant: "destructive"
    });
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isUserAdmin) {
    console.log("AdminRoute - Non admin - redirection vers /app");
    toast({
      title: "Accès refusé",
      description: "Vous n'avez pas les droits d'administration nécessaires",
      variant: "destructive"
    });
    return <Navigate to="/app" replace />;
  }

  console.log("AdminRoute - Admin authentifié - accès autorisé à", location.pathname);
  return <>{children}</>;
}
