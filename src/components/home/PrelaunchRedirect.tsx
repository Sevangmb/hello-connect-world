
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
  if (location.pathname === "/landing") {
    return <>{children}</>;
  }
  
  // Permettre l'accès aux utilisateurs authentifiés 
  // ou aux routes d'administration ou d'authentification
  if (
    user || 
    location.pathname.startsWith("/admin") || 
    location.pathname.startsWith("/auth")
  ) {
    return <>{children}</>;
  }
  
  // Rediriger vers la liste d'attente
  return <Navigate to="/waitlist" replace />;
};
