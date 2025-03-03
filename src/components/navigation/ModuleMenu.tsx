
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Globe, 
  Settings, 
  Boxes, 
  Layers, 
  ActivitySquare,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useModuleRegistry } from "@/hooks/modules/useModuleRegistry";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface ModuleMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  moduleCode?: string;
  isAdmin?: boolean;
  category: 'main' | 'admin' | 'system';
  description?: string;
}

export const ModuleMenu: React.FC = () => {
  const { isModuleActive, isModuleDegraded } = useModuleRegistry();
  const navigate = useNavigate();
  const location = useLocation();
  const [availableMenuItems, setAvailableMenuItems] = useState<ModuleMenuItem[]>([]);
  
  // Définition des éléments du menu
  const menuItems: ModuleMenuItem[] = [
    // Modules principaux
    { 
      id: 'dashboard', 
      label: 'Tableau de bord', 
      icon: ActivitySquare, 
      path: '/', 
      category: 'main',
      description: 'Vue d\'ensemble de l\'application'
    },
    { 
      id: 'wardrobe', 
      label: 'Garde-robe', 
      icon: Boxes, 
      path: '/wardrobe', 
      moduleCode: 'wardrobe',
      category: 'main',
      description: 'Gérer votre collection de vêtements'
    },
    { 
      id: 'explore', 
      label: 'Explorer', 
      icon: Globe, 
      path: '/explore', 
      moduleCode: 'explore',
      category: 'main',
      description: 'Découvrir de nouvelles tendances'
    },
    
    // Modules admin
    { 
      id: 'admin-modules', 
      label: 'Modules', 
      icon: Layers, 
      path: '/admin/modules', 
      isAdmin: true,
      moduleCode: 'admin_modules',
      category: 'admin',
      description: 'Gérer les modules de l\'application'
    },
    { 
      id: 'admin-settings', 
      label: 'Paramètres', 
      icon: Settings, 
      path: '/admin/settings', 
      isAdmin: true,
      moduleCode: 'admin_settings',
      category: 'admin',
      description: 'Configurer les paramètres système'
    }
  ];

  // Filtrer les modules disponibles
  useEffect(() => {
    const filterMenuItems = async () => {
      const availableItems = await Promise.all(
        menuItems.map(async (item) => {
          // Les éléments sans moduleCode sont toujours disponibles
          if (!item.moduleCode) return { ...item, isAvailable: true, isDegraded: false };
          
          // Les modules admin sont toujours disponibles
          if (item.isAdmin) return { ...item, isAvailable: true, isDegraded: false };
          
          // Vérifier si le module est actif
          const isAvailable = await isModuleActive(item.moduleCode);
          const isDegraded = isAvailable ? await isModuleDegraded(item.moduleCode) : false;
          
          return { ...item, isAvailable, isDegraded };
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
  const adminItems = availableMenuItems.filter(item => item.category === 'admin');
  const systemItems = availableMenuItems.filter(item => item.category === 'system');

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-6 w-full">
        {/* Modules principaux */}
        <div className="space-y-1">
          <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
            Application
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
                      <Badge variant="warning" className="ml-auto text-xs px-1">
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
