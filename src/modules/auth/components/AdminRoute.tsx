
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
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { isUserAdmin, loading: adminLoading, refreshAdminStatus } = useAdminStatus();
  const location = useLocation();
  const { toast } = useToast();
  const [hasShownToast, setHasShownToast] = React.useState<boolean>(false);

  // Rafraîchir le statut admin uniquement au montage et changement de chemin
  React.useEffect(() => {
    console.log("AdminRoute - Vérification des droits admin");
    refreshAdminStatus();
  }, [refreshAdminStatus, location.pathname]);

  // Éviter les rendus inutiles en regroupant les états
  const isLoading = authLoading || adminLoading;
  
  // Afficher le statut pour le débogage (une seule fois)
  React.useEffect(() => {
    if (!isLoading) {
      console.log("Admin route status:", {
        isAuthenticated,
        isUserAdmin,
        path: location.pathname
      });
    }
  }, [isAuthenticated, isUserAdmin, isLoading, location.pathname]);

  // Afficher l'état de chargement
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si non authentifié
  if (!isAuthenticated || !user) {
    // Eviter les toasts multiples
    if (!hasShownToast) {
      console.log("AdminRoute - Non authentifié - redirection vers /auth");
      toast({
        title: "Accès refusé",
        description: "Veuillez vous connecter pour accéder à cette page",
        variant: "destructive"
      });
      setHasShownToast(true);
    }
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Si non admin
  if (!isUserAdmin) {
    // Eviter les toasts multiples
    if (!hasShownToast) {
      console.log("AdminRoute - Non admin - redirection vers /app");
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'administration nécessaires",
        variant: "destructive"
      });
      setHasShownToast(true);
    }
    return <Navigate to="/app" replace />;
  }

  // Reset le state quand on est authentifié admin
  React.useEffect(() => {
    if (isAuthenticated && isUserAdmin) {
      setHasShownToast(false);
    }
  }, [isAuthenticated, isUserAdmin]);

  console.log("AdminRoute - Admin authentifié - accès autorisé à", location.pathname);
  return <>{children}</>;
}
