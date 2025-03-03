
import React, { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useModuleRegistry } from "@/hooks/modules/useModuleRegistry";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DynamicMenu } from "@/components/menu/DynamicMenu";
import { useMenu } from "@/hooks/useMenu";
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
  
  // Ne pas afficher la catégorie admin si l'utilisateur n'est pas admin
  if (category === 'admin' && !isUserAdmin) {
    return null;
  }
  
  // Ne pas afficher si aucun élément dans cette catégorie et ce n'est pas admin en cours de chargement
  if (!loading && menuItems.length === 0 && !(category === 'admin' && isUserAdmin)) {
    return null;
  }
  
  return (
    <div className="space-y-1 mb-6">
      <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
      <DynamicMenu category={category} />
    </div>
  );
};

// Composant de menu principal
export const ModuleMenu: React.FC = () => {
  const { isModuleDegraded } = useModuleRegistry();
  const { isUserAdmin, refreshMenu } = useMenu();
  const navigate = useNavigate();
  
  // Écouter les événements de mise à jour de menu et de modules
  useEffect(() => {
    const handleMenuUpdate = () => {
      refreshMenu();
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
      unsubscribeMenuUpdated();
      unsubscribeModuleStatus();
      unsubscribeAdminAccess();
      unsubscribeAdminRevoked();
    };
  }, [refreshMenu]);
  
  // Initialiser le statut admin dans le coordinateur
  useEffect(() => {
    if (isUserAdmin) {
      moduleMenuCoordinator.enableAdminAccess();
    }
  }, [isUserAdmin]);
  
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2 w-full">
        {/* Menus par catégorie */}
        <CategoryGroup title="Principales" category="main" />
        <CategoryGroup title="Social" category="social" />
        <CategoryGroup title="Marketplace" category="marketplace" />
        <CategoryGroup title="Utilitaires" category="utility" />
        
        {/* Menu d'administration - toujours affiché pour les admin */}
        {isUserAdmin && (
          <>
            <CategoryGroup title="Administration" category="admin" />
            <div className="px-3 py-2 mt-2">
              <Button 
                onClick={() => navigate('/admin')}
                variant="outline" 
                className="w-full bg-primary/5 hover:bg-primary/10 text-primary"
              >
                Console d'administration
              </Button>
            </div>
          </>
        )}
        
        <CategoryGroup title="Système" category="system" />
      </div>
    </TooltipProvider>
  );
};

export default ModuleMenu;
