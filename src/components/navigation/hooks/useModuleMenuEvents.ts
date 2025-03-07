
import { useState, useEffect } from "react";
import { useAdminStatus } from "@/hooks/menu/useAdminStatus";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { eventBus, EVENTS } from "@/services/events/EventBus";

interface Shop {
  id: string;
  name: string;
  status: string;
}

interface ModuleMenuHookResult {
  isUserAdmin: boolean;
  isShopOwner: boolean;
  activeShop: Shop | null;
  navigateToRoute: (route: string) => void;
}

/**
 * Hook simplifié pour gérer les événements et l'état du menu
 */
export const useModuleMenuEvents = (): ModuleMenuHookResult => {
  const { isUserAdmin } = useAdminStatus();
  const [isShopOwner, setIsShopOwner] = useState(false);
  const [activeShop, setActiveShop] = useState<Shop | null>(null);
  const navigate = useNavigate();

  // Fonction pour naviguer vers une route
  const navigateToRoute = (route: string) => {
    console.log(`Navigation vers: ${route}`);
    
    // Publier l'événement de navigation
    eventBus.publish(EVENTS.NAVIGATION.ROUTE_CHANGED, {
      to: route
    });
    
    navigate(route);
  };

  // Vérifier si l'utilisateur est propriétaire d'une boutique
  useEffect(() => {
    let isMounted = true;
    
    const checkShopOwnership = async () => {
      try {
        // Récupérer l'utilisateur connecté
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user || !isMounted) return;
        
        // Chercher les boutiques de l'utilisateur avec caching
        const { data: shops, error } = await supabase
          .from('shops')
          .select('id, name, status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .limit(1);
        
        if (error || !isMounted) return;
        
        if (shops && shops.length > 0) {
          setIsShopOwner(true);
          setActiveShop(shops[0]);
        } else {
          setIsShopOwner(false);
          setActiveShop(null);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du statut de boutique:', error);
      }
    };
    
    // Uniquement exécuter si l'utilisateur est connecté
    if (isUserAdmin !== undefined) {
      checkShopOwnership();
    }
    
    return () => {
      isMounted = false;
    };
  }, [isUserAdmin]);

  return {
    isUserAdmin,
    isShopOwner,
    activeShop,
    navigateToRoute
  };
};
