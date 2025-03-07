
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { eventBus } from "@/core/event-bus/EventBus";
import { MODULE_MENU_EVENTS, moduleMenuCoordinator } from "@/services/coordination/ModuleMenuCoordinator";
import { getAuthService } from "@/core/auth/infrastructure/authDependencyProvider";
import { getUserService } from "@/core/users/infrastructure/userDependencyProvider";

/**
 * Hook pour gérer les événements liés au menu des modules
 */
export const useModuleMenuEvents = () => {
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Vérifier le statut administrateur au chargement
    const checkAdminStatus = async () => {
      try {
        const authService = getAuthService();
        const userService = getUserService();
        
        const user = await authService.getCurrentUser();
        
        if (!user) {
          setIsUserAuthenticated(false);
          return;
        }
        
        setIsUserAuthenticated(true);
        
        // En mode développement, on peut bypasser la vérification
        if (process.env.NODE_ENV === 'development') {
          const devBypass = localStorage.getItem('dev_admin_bypass');
          if (devBypass === 'true') {
            console.warn("DEV MODE: Admin bypass enabled");
            setIsUserAdmin(true);
            moduleMenuCoordinator.enableAdminAccess();
            return;
          }
        }
        
        // Vérifier si l'utilisateur est admin avec le service utilisateur
        const isAdmin = await userService.isUserAdmin(user.id);
        setIsUserAdmin(isAdmin);
        
        if (isAdmin) {
          moduleMenuCoordinator.enableAdminAccess();
        } else {
          moduleMenuCoordinator.disableAdminAccess();
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut admin:", error);
        toast({
          title: "Erreur",
          description: "Impossible de vérifier vos privilèges d'administration",
          variant: "destructive",
        });
      }
    };
    
    checkAdminStatus();
    
    // S'abonner aux événements de changement de statut admin
    const adminGrantedHandler = () => {
      console.log("Admin access granted event received");
      setIsUserAdmin(true);
    };
    
    const adminRevokedHandler = () => {
      console.log("Admin access revoked event received");
      setIsUserAdmin(false);
    };
    
    const unsubscribeGranted = eventBus.subscribe(MODULE_MENU_EVENTS.ADMIN_ACCESS_GRANTED, adminGrantedHandler);
    const unsubscribeRevoked = eventBus.subscribe(MODULE_MENU_EVENTS.ADMIN_ACCESS_REVOKED, adminRevokedHandler);
    
    return () => {
      unsubscribeGranted();
      unsubscribeRevoked();
    };
  }, [toast]);
  
  return {
    isUserAdmin,
    isUserAuthenticated,
  };
};
