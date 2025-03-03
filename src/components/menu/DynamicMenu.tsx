
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMenu } from '@/hooks/useMenu';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Menu as MenuIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ModuleGuard } from '@/components/modules/ModuleGuard';
import { MENU_MODULE_CODE } from '@/hooks/modules/constants';

interface DynamicMenuProps {
  moduleCode?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Composant de menu dynamique
 * Affiche les éléments de menu basés sur la configuration
 */
export const DynamicMenu: React.FC<DynamicMenuProps> = ({ 
  moduleCode,
  className,
  compact = false
}) => {
  const { menuConfig, loading, error } = useMenu(moduleCode);
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Détecter si un chemin est actif
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Gérer le clic sur un élément de menu
  const handleMenuItemClick = (path: string) => {
    navigate(path);
  };

  // Gérer l'expansion/réduction des sections
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Rendu en cas de chargement
  if (loading) {
    return (
      <div className={cn("space-y-4 p-2", className)}>
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <div className="space-y-1 pl-4">
              {[1, 2, 3].map(j => (
                <Skeleton key={j} className="h-8 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Rendu en cas d'erreur
  if (error) {
    return (
      <div className={cn("p-4 text-red-500", className)}>
        <p>Erreur: {error}</p>
      </div>
    );
  }

  // Si aucun élément de menu n'est disponible
  if (menuConfig.sections.length === 0) {
    return (
      <div className={cn("p-4 text-gray-400 text-center", className)}>
        <MenuIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>Aucun élément de menu disponible</p>
      </div>
    );
  }

  return (
    <ModuleGuard moduleCode={MENU_MODULE_CODE}>
      <nav className={cn("space-y-4", className)}>
        {menuConfig.sections.map(section => (
          <div key={section.id} className="space-y-1">
            {section.name !== 'main' && (
              <>
                <h3 className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {section.name}
                </h3>
                <Separator className="my-1" />
              </>
            )}
            
            {compact ? (
              // Version compacte du menu (accordéon)
              <Accordion
                type="multiple"
                value={expandedSections}
                className="space-y-1"
              >
                {section.items.map(item => (
                  <AccordionItem key={item.id} value={item.id} className="border-none">
                    <AccordionTrigger
                      className={cn(
                        "py-2 px-3 text-sm rounded-md hover:bg-gray-100 transition-colors",
                        isActive(item.path) && "bg-blue-50 text-blue-700 font-medium"
                      )}
                      onClick={() => handleMenuItemClick(item.path)}
                    >
                      {item.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      {/* Contenu des sous-menus ici si nécessaire */}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              // Version standard du menu
              <div className="space-y-1">
                {section.items.map(item => (
                  <TooltipProvider key={item.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={cn(
                            "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive(item.path)
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                          onClick={() => handleMenuItemClick(item.path)}
                        >
                          {/* Icône à ajouter si disponible */}
                          <span className="truncate">{item.name}</span>
                          
                          {/* Indicateur de sous-menu si nécessaire */}
                          {false && (
                            <ChevronRight className="ml-auto h-4 w-4" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </ModuleGuard>
  );
};
