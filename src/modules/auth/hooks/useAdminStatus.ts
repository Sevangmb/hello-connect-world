
/**
 * Hook pour déterminer le statut administrateur de l'utilisateur
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { getUserService } from '../services/userDependencyProvider';
import { getAuthService } from '../services/authDependencyProvider';
import { moduleMenuCoordinator } from '@/services/coordination/ModuleMenuCoordinator';
import { supabase } from '@/integrations/supabase/client';

export const useAdminStatus = () => {
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const userService = getUserService();
  const authService = getAuthService();
  const checkInProgress = useRef(false);
  const cachedResult = useRef<{isAdmin: boolean, timestamp: number} | null>(null);
  
  // Cache TTL: 60 seconds
  const CACHE_TTL = 60 * 1000;
  
  const checkAdminStatus = useCallback(async () => {
    // Éviter les vérifications simultanées
    if (checkInProgress.current) {
      console.log("Vérification du statut admin déjà en cours, ignorée");
      return;
    }
    
    // Vérifier si nous avons un résultat en cache récent
    if (cachedResult.current && (Date.now() - cachedResult.current.timestamp < CACHE_TTL)) {
      console.log("Utilisation du résultat en cache pour le statut admin:", cachedResult.current.isAdmin);
      setIsUserAdmin(cachedResult.current.isAdmin);
      setLoading(false);
      return;
    }
    
    try {
      checkInProgress.current = true;
      setLoading(true);
      console.log("Vérification du statut administrateur...");
      
      const user = await authService.getCurrentUser();
      if (!user) {
        console.log("Aucun utilisateur connecté");
        setIsUserAdmin(false);
        cachedResult.current = { isAdmin: false, timestamp: Date.now() };
        return;
      }
      
      // Mode développement: permettre le bypass admin pour le débogage
      if (process.env.NODE_ENV === 'development') {
        const devBypass = localStorage.getItem('dev_admin_bypass');
        if (devBypass === 'true') {
          console.warn("DEV MODE: Admin bypass enabled");
          setIsUserAdmin(true);
          moduleMenuCoordinator.enableAdminAccess();
          cachedResult.current = { isAdmin: true, timestamp: Date.now() };
          return;
        }
      }
      
      // Essayer d'abord avec la RPC - plus rapide
      try {
        const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin', {
          user_id: user.id
        });
        
        if (!rpcError) {
          console.log("Résultat RPC is_admin:", isAdmin);
          setIsUserAdmin(!!isAdmin);
          
          if (isAdmin) {
            moduleMenuCoordinator.enableAdminAccess();
          } else {
            moduleMenuCoordinator.disableAdminAccess();
          }
          
          cachedResult.current = { isAdmin: !!isAdmin, timestamp: Date.now() };
          return;
        }
      } catch (err) {
        console.warn("RPC non disponible, utilisation de la méthode repository");
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
      
      cachedResult.current = { isAdmin, timestamp: Date.now() };
    } catch (err) {
      console.error("Erreur lors de la vérification du statut admin:", err);
      setIsUserAdmin(false);
      moduleMenuCoordinator.disableAdminAccess();
      cachedResult.current = { isAdmin: false, timestamp: Date.now() };
    } finally {
      setLoading(false);
      checkInProgress.current = false;
    }
  }, [authService, userService]);
  
  useEffect(() => {
    checkAdminStatus();
    
    // Ajouter un écouteur pour les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      // Invalider le cache lors d'un changement d'authentification
      cachedResult.current = null;
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
