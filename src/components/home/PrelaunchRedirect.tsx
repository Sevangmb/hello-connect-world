
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const PrelaunchRedirect: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Permettre l'accès à la page de liste d'attente
  if (location.pathname === "/waitlist") {
    return <>{children}</>;
  }
  
  // Permettre l'accès à la page d'accueil
  if (location.pathname === "/landing" || location.pathname === "/") {
    return <>{children}</>;
  }
  
  // Permettre l'accès à la page d'authentification
  if (location.pathname === "/auth") {
    return <>{children}</>;
  }
  
  // Permettre l'accès aux utilisateurs authentifiés 
  // ou aux routes d'administration
  if (
    user || 
    location.pathname.startsWith("/admin")
  ) {
    return <>{children}</>;
  }
  
  // Rediriger vers la page d'accueil
  return <Navigate to="/" replace />;
};
