
import React, { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useModuleMenuEvents } from "./hooks/useModuleMenuEvents";
import { SimpleModuleMenu } from "./SimpleModuleMenu";

/**
 * Menu principal simplifié et optimisé par modules
 */
export const ModuleMenu: React.FC = () => {
  const { isUserAdmin, isShopOwner, activeShop } = useModuleMenuEvents();
  
  // Groupes de modules à afficher
  const moduleGroups = useMemo(() => {
    return {
      main: ['main', 'explore', 'personal', 'social', 'profile'],
      shop: isShopOwner ? ['shop_dashboard', 'shop_storefront', 'shop_orders', 'shop_messages'] : [],
      admin: isUserAdmin ? ['admin'] : []
    };
  }, [isUserAdmin, isShopOwner]);

  return (
    <TooltipProvider>
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col gap-1 w-full pr-3">
          {/* Menu principal */}
          <SimpleModuleMenu 
            modules={moduleGroups.main}
            title="Menu principal"
          />
          
          {/* Menu boutique */}
          {isShopOwner && (
            <>
              <Separator className="my-2" />
              <div className="px-2 py-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase">
                  {activeShop?.name || 'Ma Boutique'}
                </h3>
              </div>
              <SimpleModuleMenu 
                modules={moduleGroups.shop}
                title="Boutique"
              />
            </>
          )}
          
          {/* Menu admin avec accès à tous les sous-menus */}
          {isUserAdmin && (
            <>
              <Separator className="my-2" />
              <div className="px-2 py-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase">
                  Administration
                </h3>
              </div>
              <SimpleModuleMenu 
                modules={moduleGroups.admin}
                title="Admin"
                showAllAdminSubCategories={true}
              />
            </>
          )}
        </div>
      </ScrollArea>
    </TooltipProvider>
  );
};

export default ModuleMenu;
