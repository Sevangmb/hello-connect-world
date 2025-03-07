
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Hook pour gérer la navigation dans l'application
 * Utilise le hook useNavigate de React Router pour assurer une navigation SPA correcte
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  
  /**
   * Navigue vers le chemin spécifié
   * @param path Chemin de destination
   * @param event Événement de clic (optionnel)
   */
  const navigateTo = useCallback((path: string, event?: React.MouseEvent) => {
    // Empêcher le comportement par défaut du lien pour éviter les rechargements de page
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Logs pour le débogage
    console.log(`Navigation vers: ${path}`);
    
    // Vérifier que le chemin est valide
    if (!path) {
      console.error("Tentative de navigation avec un chemin vide ou null");
      return;
    }
    
    // Effectuer la navigation
    try {
      // Utiliser navigate sans options supplémentaires pour une navigation simple
      navigate(path);
    } catch (error) {
      console.error(`Erreur lors de la navigation vers ${path}:`, error);
    }
  }, [navigate]);
  
  return {
    navigateTo
  };
};
