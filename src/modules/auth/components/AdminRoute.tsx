
/**
 * Composant de route protégée pour l'administration
 * Redirige vers la page d'accueil si l'utilisateur n'est pas connecté ou n'est pas admin
 */
import * as React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAdminStatus } from "../hooks/useAdminStatus";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated, refreshAuth } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminStatus();
  const location = useLocation();

  React.useEffect(() => {
    console.log("AdminRoute - Vérification de l'authentification");
    refreshAuth();
  }, [refreshAuth, location.pathname]);

  if (loading || adminLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log("AdminRoute - Non authentifié - redirection vers /landing depuis", location.pathname);
    return <Navigate to="/landing" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    console.log("AdminRoute - Non admin - redirection vers /app");
    return <Navigate to="/app" replace />;
  }

  console.log("AdminRoute - Admin authentifié - accès autorisé à", location.pathname);
  return <>{children}</>;
}
