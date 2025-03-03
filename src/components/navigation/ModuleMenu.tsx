
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Globe, 
  Settings, 
  Boxes, 
  Layers, 
  ActivitySquare,
  AlertCircle,
  CheckCircle2,
  Store,
  ShoppingCart,
  User,
  Calendar,
  MessageSquare,
  Bell,
  Award,
  Users,
  HelpCircle,
  Shirt,
  Palette,
  LucideIcon
} from "lucide-react";
import { useModuleRegistry } from "@/hooks/modules/useModuleRegistry";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ModulePageRegistry, ModulePageDefinition } from "@/services/modules/ModulePageRegistry";

export interface ModuleMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  moduleCode?: string;
  isAdmin?: boolean;
  category: 'main' | 'admin' | 'system' | 'marketplace' | 'social' | 'utility';
  description?: string;
  isDegraded?: boolean;
}

// Mapping des noms d'icônes aux composants LucideIcon
const iconMap: Record<string, LucideIcon> = {
  Globe,
  Settings,
  Boxes,
  Layers,
  ActivitySquare,
  Store,
  ShoppingCart,
  User,
  Calendar,
  MessageSquare,
  Bell,
  Award,
  Users,
  HelpCircle,
  Shirt,
  Palette
};

// Convertir les définitions de pages en éléments de menu
const convertPageToMenuItem = (page: ModulePageDefinition, isDegraded = false): ModuleMenuItem => {
  const icon = iconMap[page.icon] || Globe;
  
  return {
    id: page.path.replace('/', ''),
    label: page.name,
    icon,
    path: page.path,
    moduleCode: page.moduleCode,
    isAdmin: page.moduleCode.startsWith('admin_'),
    category: page.category as 'main' | 'admin' | 'system' | 'marketplace' | 'social' | 'utility',
    description: page.description,
    isDegraded
  };
};

export const ModuleMenu: React.FC = () => {
  const { isModuleActive, isModuleDegraded } = useModuleRegistry();
  const navigate = useNavigate();
  const location = useLocation();
  const [availableMenuItems, setAvailableMenuItems] = useState<ModuleMenuItem[]>([]);
  
  // Filtrer les modules disponibles
  useEffect(() => {
    const filterMenuItems = async () => {
      // Récupérer toutes les pages du menu
      const menuPages = ModulePageRegistry.getMenuPages();
      
      // Convertir les pages en éléments de menu et vérifier leur disponibilité
      const availableItems = await Promise.all(
        menuPages.map(async (page) => {
          // Les éléments admin sont toujours disponibles (vérification faite ailleurs)
          if (page.moduleCode.startsWith('admin_')) {
            return convertPageToMenuItem(page, false);
          }
          
          // Vérifier si le module est actif
          const isAvailable = await isModuleActive(page.moduleCode);
          const isDegraded = isAvailable ? await isModuleDegraded(page.moduleCode) : false;
          
          const menuItem = convertPageToMenuItem(page, isDegraded);
          return { ...menuItem, isAvailable };
        })
      );
      
      // Ne garder que les éléments disponibles
      setAvailableMenuItems(availableItems.filter(item => item.isAvailable));
    };
    
    filterMenuItems();
  }, [isModuleActive, isModuleDegraded]);

  // Vérifier si un chemin est actif
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Regrouper les éléments par catégorie
  const mainItems = availableMenuItems.filter(item => item.category === 'main');
  const socialItems = availableMenuItems.filter(item => item.category === 'social');
  const marketplaceItems = availableMenuItems.filter(item => item.category === 'marketplace');
  const utilityItems = availableMenuItems.filter(item => item.category === 'utility');
  const adminItems = availableMenuItems.filter(item => item.category === 'admin');
  const systemItems = availableMenuItems.filter(item => item.category === 'system');

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6 w-full">
        {/* Modules principaux */}
        {mainItems.length > 0 && (
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Principales
            </h3>
            <nav className="space-y-1">
              {mainItems.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md group",
                        isActive(item.path)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.isDegraded && (
                        <Badge variant="outline" className="ml-auto text-xs px-1 bg-amber-100 text-amber-800 border-amber-300">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Dégradé
                        </Badge>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.description}</p>
                    {item.isDegraded && (
                      <p className="text-amber-600 text-xs mt-1">Ce module fonctionne en mode dégradé</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>
        )}

        {/* Modules sociaux */}
        {socialItems.length > 0 && (
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Social
            </h3>
            <nav className="space-y-1">
              {socialItems.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md group",
                        isActive(item.path)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.isDegraded && (
                        <Badge variant="outline" className="ml-auto text-xs px-1 bg-amber-100 text-amber-800 border-amber-300">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Dégradé
                        </Badge>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.description}</p>
                    {item.isDegraded && (
                      <p className="text-amber-600 text-xs mt-1">Ce module fonctionne en mode dégradé</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>
        )}

        {/* Modules marketplace */}
        {marketplaceItems.length > 0 && (
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Marketplace
            </h3>
            <nav className="space-y-1">
              {marketplaceItems.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md group",
                        isActive(item.path)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.isDegraded && (
                        <Badge variant="outline" className="ml-auto text-xs px-1 bg-amber-100 text-amber-800 border-amber-300">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Dégradé
                        </Badge>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.description}</p>
                    {item.isDegraded && (
                      <p className="text-amber-600 text-xs mt-1">Ce module fonctionne en mode dégradé</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>
        )}

        {/* Modules utilitaires */}
        {utilityItems.length > 0 && (
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Utilitaires
            </h3>
            <nav className="space-y-1">
              {utilityItems.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md group",
                        isActive(item.path)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.isDegraded && (
                        <Badge variant="outline" className="ml-auto text-xs px-1 bg-amber-100 text-amber-800 border-amber-300">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Dégradé
                        </Badge>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.description}</p>
                    {item.isDegraded && (
                      <p className="text-amber-600 text-xs mt-1">Ce module fonctionne en mode dégradé</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>
        )}

        {/* Modules admin */}
        {adminItems.length > 0 && (
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Administration
            </h3>
            <nav className="space-y-1">
              {adminItems.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md group",
                        isActive(item.path)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>
        )}

        {/* Modules système (si présents) */}
        {systemItems.length > 0 && (
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Système
            </h3>
            <nav className="space-y-1">
              {systemItems.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md group",
                        isActive(item.path)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
