
import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useModuleRegistry } from "@/hooks/modules/useModuleRegistry";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { DynamicMenu } from "@/components/menu/DynamicMenu";
import { useMenu } from "@/hooks/useMenu";
import { MenuItemCategory } from "@/services/menu/types";

interface CategoryGroupProps {
  title: string;
  category: MenuItemCategory;
}

// Composant pour grouper les éléments de menu par catégorie
const CategoryGroup: React.FC<CategoryGroupProps> = ({ title, category }) => {
  const { menuItems, loading } = useMenu({ category });
  
  // Ne pas afficher si aucun élément dans cette catégorie
  if (!loading && menuItems.length === 0) {
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

// Composant de menu d'administration conditionnel
const AdminMenuGroup: React.FC = () => {
  const { isUserAdmin } = useMenu();
  
  if (!isUserAdmin) {
    return null;
  }
  
  return <CategoryGroup title="Administration" category="admin" />;
};

// Composant de menu principal
export const ModuleMenu: React.FC = () => {
  const { isModuleDegraded } = useModuleRegistry();
  
  return (
    <TooltipProvider>
      <div className="flex flex-col gap-2 w-full">
        {/* Menus par catégorie */}
        <CategoryGroup title="Principales" category="main" />
        <CategoryGroup title="Social" category="social" />
        <CategoryGroup title="Marketplace" category="marketplace" />
        <CategoryGroup title="Utilitaires" category="utility" />
        
        {/* Menu d'administration toujours affiché pour les admin */}
        <AdminMenuGroup />
        
        <CategoryGroup title="Système" category="system" />
      </div>
    </TooltipProvider>
  );
};

export default ModuleMenu;
