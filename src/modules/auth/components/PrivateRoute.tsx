
/**
 * Composant de route protégée
 * Redirige vers la page d'authentification si l'utilisateur n'est pas connecté
 */
import * as React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated, refreshAuth } = useAuth();
  const location = useLocation();

  // Forcer une vérification d'authentification au chargement de la route protégée
  React.useEffect(() => {
    console.log("PrivateRoute - Vérification de l'authentification");
    refreshAuth();
  }, [refreshAuth, location.pathname]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    console.log("PrivateRoute - Non authentifié - redirection vers /auth depuis", location.pathname);
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log("PrivateRoute - Authentifié - accès autorisé à", location.pathname);
  return <>{children}</>;
}
