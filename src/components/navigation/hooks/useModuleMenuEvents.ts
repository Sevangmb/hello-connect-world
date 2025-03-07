
import { useState, useEffect } from "react";
import { useAdminStatus } from "@/hooks/menu/useAdminStatus";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
 * Hook pour gérer les événements et l'état du menu
 */
export const useModuleMenuEvents = (): ModuleMenuHookResult => {
  const { isUserAdmin } = useAdminStatus();
  const [isShopOwner, setIsShopOwner] = useState(false);
  const [activeShop, setActiveShop] = useState<Shop | null>(null);
  const navigate = useNavigate();

  // Fonction pour naviguer vers une route
  const navigateToRoute = (route: string) => {
    console.log(`Navigation vers: ${route}`);
    navigate(route);
  };

  // Vérifier si l'utilisateur est propriétaire d'une boutique
  useEffect(() => {
    const checkShopOwnership = async () => {
      try {
        // Récupérer l'utilisateur connecté
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsShopOwner(false);
          setActiveShop(null);
          return;
        }
        
        // Chercher les boutiques de l'utilisateur
        const { data: shops, error } = await supabase
          .from('shops')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .limit(1);
        
        if (error) {
          console.error('Erreur lors de la récupération des boutiques:', error);
          setIsShopOwner(false);
          setActiveShop(null);
          return;
        }
        
        if (shops && shops.length > 0) {
          setIsShopOwner(true);
          setActiveShop(shops[0]);
        } else {
          setIsShopOwner(false);
          setActiveShop(null);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du statut de boutique:', error);
        setIsShopOwner(false);
        setActiveShop(null);
      }
    };
    
    // Uniquement exécuter si l'utilisateur est connecté
    if (isUserAdmin !== undefined) {
      checkShopOwnership();
    }
  }, [isUserAdmin]);

  return {
    isUserAdmin,
    isShopOwner,
    activeShop,
    navigateToRoute
  };
};
