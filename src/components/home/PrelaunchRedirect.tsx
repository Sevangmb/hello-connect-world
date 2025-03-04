
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const PrelaunchRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirection vers la page de préinscription
    // Vous pouvez ajouter une vérification plus complexe ici si nécessaire
    // Par exemple, vérifier un token spécial pour les testeurs ou les admins
    const isPrelaunch = true; // Mettre à false pour désactiver la redirection
    
    if (isPrelaunch) {
      // Vérifier si l'utilisateur n'est pas déjà sur la page d'attente ou d'admin
      if (!['/waitlist', '/admin'].some(path => window.location.pathname.startsWith(path))) {
        navigate('/waitlist');
      }
    }
  }, [navigate]);
  
  return <>{children}</>;
};

export default PrelaunchRedirect;
