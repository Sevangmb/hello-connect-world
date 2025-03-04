
import React, { useEffect, useState, useMemo } from "react";
import { AlertCircle } from "lucide-react";
import { useModuleRegistry } from "@/hooks/modules/useModuleRegistry";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DynamicMenu } from "@/components/menu/DynamicMenu";
import { useMenu } from "@/hooks/menu";
import { MenuItemCategory } from "@/services/menu/types";
import { moduleMenuCoordinator } from "@/services/coordination/ModuleMenuCoordinator";
import { eventBus } from "@/core/event-bus/EventBus";
import { MODULE_MENU_EVENTS } from "@/services/coordination/ModuleMenuCoordinator";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CategoryGroupProps {
  title: string;
  category: MenuItemCategory;
}

// Composant pour grouper les éléments de menu par catégorie
const CategoryGroup: React.FC<CategoryGroupProps> = ({ title, category }) => {
  const { menuItems, loading, isUserAdmin } = useMenu({ category });
  
  // Éviter de monter/démonter les catégories pour réduire le clignotement
  // Ne pas afficher la catégorie admin si l'utilisateur n'est pas admin
  if (category === 'admin' && !isUserAdmin) {
    return null;
  }
  
  // Utiliser une approche qui évite les changements brusques de hauteur
  return (
    <div className="space-y-1 mb-6">
      <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <DynamicMenu category={category} />
    </div>
  );
};

// Composant de menu principal avec optimisations pour éviter le clignotement
export const ModuleMenu: React.FC = () => {
  const { isModuleDegraded } = useModuleRegistry();
  const { isUserAdmin, refreshMenu } = useMenu();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);
  
  // Optimiser les mises à jour de menu pour éviter le clignotement
  useEffect(() => {
    // Marquer comme initialisé après le premier rendu
    if (!initialized) {
      setInitialized(true);
      // Initialiser le statut admin dans le coordinateur
      if (isUserAdmin) {
        moduleMenuCoordinator.enableAdminAccess();
      }
    }
    
    // Écouter les événements de mise à jour de menu et de modules
    // en utilisant un délai pour éviter les rafraîchissements trop fréquents
    let refreshTimeout: NodeJS.Timeout | null = null;
    
    const handleMenuUpdate = () => {
      // Annuler tout timeout existant
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
      
      // Planifier un rafraîchissement avec un délai
      refreshTimeout = setTimeout(() => {
        refreshMenu();
        refreshTimeout = null;
      }, 300); // Délai pour regrouper les mises à jour rapprochées
    };
    
    const unsubscribeMenuUpdated = eventBus.subscribe(
      MODULE_MENU_EVENTS.MENU_UPDATED, 
      handleMenuUpdate
    );
    
    const unsubscribeModuleStatus = eventBus.subscribe(
      MODULE_MENU_EVENTS.MODULE_STATUS_CHANGED, 
      handleMenuUpdate
    );
    
    const unsubscribeAdminAccess = eventBus.subscribe(
      MODULE_MENU_EVENTS.ADMIN_ACCESS_GRANTED, 
      handleMenuUpdate
    );
    
    const unsubscribeAdminRevoked = eventBus.subscribe(
      MODULE_MENU_EVENTS.ADMIN_ACCESS_REVOKED, 
      handleMenuUpdate
    );
    
    return () => {
      // Nettoyer les abonnements
      unsubscribeMenuUpdated();
      unsubscribeModuleStatus();
      unsubscribeAdminAccess();
      unsubscribeAdminRevoked();
      
      // Annuler tout timeout en attente
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
  }, [refreshMenu, isUserAdmin, initialized]);
  
  // Optimiser en mémorisant les catégories pour éviter les re-rendus inutiles
  const categories = useMemo(() => [
    { id: 'main', title: 'Principales', category: 'main' as MenuItemCategory },
    { id: 'social', title: 'Social', category: 'social' as MenuItemCategory },
    { id: 'marketplace', title: 'Marketplace', category: 'marketplace' as MenuItemCategory },
    { id: 'utility', title: 'Utilitaires', category: 'utility' as MenuItemCategory },
    { id: 'system', title: 'Système', category: 'system' as MenuItemCategory },
  ], []);
  
  // Optimiser la navigation vers l'admin
  const handleNavigateToAdmin = (event: React.MouseEvent) => {
    event.preventDefault();
    navigate('/admin');
  };
  
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2 w-full">
        {/* Menus par catégorie - éviter les changements de DOM qui causent des clignotements */}
        {categories.map(cat => (
          <CategoryGroup key={cat.id} title={cat.title} category={cat.category} />
        ))}
        
        {/* Menu d'administration - uniquement rendu si admin */}
        {isUserAdmin && (
          <>
            <CategoryGroup title="Administration" category="admin" />
            <div className="px-3 py-2 mt-2">
              <Button 
                onClick={handleNavigateToAdmin}
                variant="outline" 
                className="w-full bg-primary/5 hover:bg-primary/10 text-primary"
              >
                Console d'administration
              </Button>
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
};

export default ModuleMenu;
