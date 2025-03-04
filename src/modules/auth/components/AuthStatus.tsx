
/**
 * Composant d'affichage de l'état d'authentification
 */
import { useAuth } from "../hooks/useAuth";

export const AuthStatus = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Chargement de l'état d'authentification...</div>;
  }
  
  if (!isAuthenticated) {
    return <div>Non connecté</div>;
  }
  
  return (
    <div>
      Connecté en tant que: {user?.email}
    </div>
  );
};
