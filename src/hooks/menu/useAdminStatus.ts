
import { useState, useEffect } from 'react';
import { getUserService } from '@/core/users/infrastructure/userDependencyProvider';
import { getAuthService } from '@/core/auth/infrastructure/authDependencyProvider';
import { moduleMenuCoordinator } from '@/services/coordination/ModuleMenuCoordinator';

/**
 * Hook pour déterminer le statut administrateur de l'utilisateur
 */
export const useAdminStatus = () => {
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const userService = getUserService();
  const authService = getAuthService();
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setLoading(true);
        const user = await authService.getCurrentUser();
        if (!user) {
          setIsUserAdmin(false);
          return;
        }
        
        const isAdmin = await userService.isUserAdmin(user.id);
        setIsUserAdmin(isAdmin);
        
        if (isAdmin) {
          moduleMenuCoordinator.enableAdminAccess();
        } else {
          moduleMenuCoordinator.disableAdminAccess();
        }
      } catch (err) {
        console.error("Erreur lors de la vérification du statut admin:", err);
        setIsUserAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, []);
  
  return {
    isUserAdmin,
    loading,
    adminCheckComplete: !loading
  };
};
