
import { useNavigate } from "react-router-dom";

/**
 * Hook pour gérer la navigation dans l'application
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  
  /**
   * Navigue vers le chemin spécifié
   * @param path Chemin de destination
   * @param event Événement de clic (optionnel)
   */
  const navigateTo = (path: string, event?: React.MouseEvent) => {
    // Empêcher le comportement par défaut du lien
    if (event) {
      event.preventDefault();
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
      navigate(path);
    } catch (error) {
      console.error(`Erreur lors de la navigation vers ${path}:`, error);
    }
  };
  
  return {
    navigateTo
  };
};
