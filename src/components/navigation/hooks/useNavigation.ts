
import { useNavigate } from "react-router-dom";

/**
 * Hook pour gérer la navigation dans l'application
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  
  const navigateTo = (path: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }
    navigate(path);
  };
  
  return {
    navigateTo
  };
};
