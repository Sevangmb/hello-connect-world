
/**
 * Hook pour déterminer le statut administrateur de l'utilisateur
 */
import { useState, useEffect, useCallback } from 'react';
import { getUserService } from '../services/userDependencyProvider';
import { getAuthService } from '../services/authDependencyProvider';
import { moduleMenuCoordinator } from '@/services/coordination/ModuleMenuCoordinator';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStatus = () => {
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const userService = getUserService();
  const authService = getAuthService();
  
  const checkAdminStatus = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Vérification du statut administrateur...");
      
      const user = await authService.getCurrentUser();
      if (!user) {
        console.log("Aucun utilisateur connecté");
        setIsUserAdmin(false);
        return;
      }
      
      // Mode développement: permettre le bypass admin pour le débogage
      if (process.env.NODE_ENV === 'development') {
        const devBypass = localStorage.getItem('dev_admin_bypass');
        if (devBypass === 'true') {
          console.warn("DEV MODE: Admin bypass enabled");
          setIsUserAdmin(true);
          moduleMenuCoordinator.enableAdminAccess();
          return;
        }
      }
      
      console.log("Vérification des droits admin pour l'utilisateur:", user.id);
      
      // Essayer d'abord avec la RPC
      try {
        const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin', {
          user_id: user.id
        });
        
        if (rpcError) {
          console.warn("Erreur RPC is_admin:", rpcError);
        } else {
          console.log("Résultat RPC is_admin:", isAdmin);
          setIsUserAdmin(!!isAdmin);
          
          if (isAdmin) {
            moduleMenuCoordinator.enableAdminAccess();
          } else {
            moduleMenuCoordinator.disableAdminAccess();
          }
          
          return;
        }
      } catch (err) {
        console.warn("RPC non disponible, utilisation de la méthode repository:", err);
      }
      
      // Fallback sur la méthode repository
      const isAdmin = await userService.isUserAdmin(user.id);
      console.log("Résultat repository isUserAdmin:", isAdmin);
      setIsUserAdmin(isAdmin);
      
      if (isAdmin) {
        moduleMenuCoordinator.enableAdminAccess();
      } else {
        moduleMenuCoordinator.disableAdminAccess();
      }
    } catch (err) {
      console.error("Erreur lors de la vérification du statut admin:", err);
      setIsUserAdmin(false);
      moduleMenuCoordinator.disableAdminAccess();
    } finally {
      setLoading(false);
    }
  }, [authService, userService]);
  
  useEffect(() => {
    checkAdminStatus();
    
    // Ajouter un écouteur pour les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [checkAdminStatus]);
  
  return {
    isUserAdmin,
    loading,
    adminCheckComplete: !loading,
    refreshAdminStatus: checkAdminStatus
  };
};
