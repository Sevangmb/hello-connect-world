
/**
 * Hook pour déterminer le statut administrateur de l'utilisateur
 * Utilise la fonction RPC is_admin pour une meilleure performance
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { moduleMenuCoordinator } from '@/services/coordination/ModuleMenuCoordinator';
import { eventBus } from '@/core/event-bus/EventBus';

// Événement émis lorsque le statut admin est mis à jour
export const ADMIN_STATUS_UPDATED = 'auth:admin-status-updated';

// Interface pour la gestion du cache
interface CachedResult {
  isAdmin: boolean;
  timestamp: number;
}

export const useAdminStatus = () => {
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const checkInProgress = useRef(false);
  const cachedResult = useRef<CachedResult | null>(null);
  
  // Cache TTL: 60 secondes
  const CACHE_TTL = 60 * 1000;
  
  // Vérifier le statut admin
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
      
      // Obtenir l'utilisateur actuel via la session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.log("Aucune session active trouvée");
        setIsUserAdmin(false);
        cachedResult.current = { isAdmin: false, timestamp: Date.now() };
        return;
      }
      
      const user = session.user;
      if (!user) {
        console.log("Aucun utilisateur dans la session");
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
          // Publier l'événement de mise à jour
          eventBus.publish(ADMIN_STATUS_UPDATED, { isAdmin: true });
          return;
        }
      }
      
      // Utiliser la fonction RPC is_admin pour vérifier le statut admin
      const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin', {
        user_id: user.id
      });
      
      if (!rpcError) {
        console.log("Résultat RPC is_admin:", isAdmin);
        setIsUserAdmin(!!isAdmin);
        
        // Mettre à jour le coordinateur de menu
        if (isAdmin) {
          moduleMenuCoordinator.enableAdminAccess();
        } else {
          moduleMenuCoordinator.disableAdminAccess();
        }
        
        // Mettre à jour le cache
        cachedResult.current = { isAdmin: !!isAdmin, timestamp: Date.now() };
        
        // Publier l'événement de mise à jour
        eventBus.publish(ADMIN_STATUS_UPDATED, { isAdmin: !!isAdmin });
        return;
      } else {
        console.warn("RPC non disponible, vérification via la table profiles:", rpcError);
        
        // Fallback: vérifier dans la table profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error("Erreur lors de la vérification du statut admin via profiles:", profileError);
          setIsUserAdmin(false);
          cachedResult.current = { isAdmin: false, timestamp: Date.now() };
        } else {
          const isAdmin = !!profileData?.is_admin;
          console.log("Résultat profiles isUserAdmin:", isAdmin);
          setIsUserAdmin(isAdmin);
          
          // Mettre à jour le coordinateur de menu
          if (isAdmin) {
            moduleMenuCoordinator.enableAdminAccess();
          } else {
            moduleMenuCoordinator.disableAdminAccess();
          }
          
          cachedResult.current = { isAdmin, timestamp: Date.now() };
          
          // Publier l'événement de mise à jour
          eventBus.publish(ADMIN_STATUS_UPDATED, { isAdmin });
        }
      }
    } catch (err) {
      console.error("Erreur lors de la vérification du statut admin:", err);
      setIsUserAdmin(false);
      moduleMenuCoordinator.disableAdminAccess();
      cachedResult.current = { isAdmin: false, timestamp: Date.now() };
      
      // Publier l'événement d'erreur
      eventBus.publish(ADMIN_STATUS_UPDATED, { isAdmin: false, error: err });
    } finally {
      setLoading(false);
      checkInProgress.current = false;
    }
  }, []);
  
  // Écouter les changements d'authentification Supabase
  useEffect(() => {
    checkAdminStatus();
    
    // S'abonner aux changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      console.log("Événement d'authentification Supabase:", event);
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
