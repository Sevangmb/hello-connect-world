
import React, { useState, useEffect } from "react";
import { useModuleVisibility } from "./hooks/useModuleVisibility";
import { CategoryGroupProps } from "./types/moduleMenu";
import { DynamicMenu } from "@/components/menu/DynamicMenu";
import { AccordionItem, AccordionTrigger, AccordionContent, Accordion } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { getIcon } from "@/components/menu/utils/menuUtils";
import { MenuStructureTransformer } from "@/services/menu/infrastructure/utils/MenuStructureTransformer";

const CategoryGroup: React.FC<CategoryGroupProps> = ({ title, category, icon }) => {
  const { menuItems, loading, error } = useModuleVisibility(category);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Récupérer et rendre l'icône à partir de la bibliothèque Lucide
  const renderIcon = () => {
    if (!icon) return null;
    
    const IconComponent = getIcon(icon);
    // Use type assertion to help TypeScript understand this can be a React component
    if (IconComponent) {
      return React.createElement(IconComponent as React.ComponentType<any>, { className: "h-4 w-4 mr-2" });
    }
    return null;
  };
  
  // Déterminer si cette catégorie devrait être hiérarchique
  const shouldBeHierarchical = () => {
    const hierarchicalCategories = [
      'admin', 'settings', 'favorites', 'add_clothing', 'marketplace',
      'admin_users', 'admin_shops', 'admin_content', 'admin_marketing',
      'admin_stats', 'admin_settings', 'admin_marketplace'
    ];
    
    return hierarchicalCategories.includes(category);
  };

  // Pendant le chargement, nous affichons un squelette pour une meilleure UX
  if (loading) {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={category} className="border-none">
          <AccordionTrigger className="py-2 px-3 text-sm font-medium text-gray-500 hover:text-gray-900 hover:no-underline">
            <span className="flex items-center">
              {renderIcon()}
              {title}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-2">
            <div className="space-y-2 px-1">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded" />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  // En cas d'erreur, afficher un message compact
  if (error) {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={category} className="border-none">
          <AccordionTrigger className="py-2 px-3 text-sm font-medium text-gray-500 hover:text-gray-900 hover:no-underline">
            <span className="flex items-center">
              {renderIcon()}
              {title}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-2">
            <div className="text-sm text-red-500 px-3">
              Impossible de charger les éléments de menu
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  // Déterminer si c'est une catégorie principale pour l'état par défaut
  const isMainCategory = ['main', 'explore', 'personal', 'social', 'profile'].includes(category);
  
  // Vérifier s'il y a des sous-catégories pour cette catégorie
  const hasSubcategories = MenuStructureTransformer.getSubcategoriesForSection(category).length > 0 ||
                        MenuStructureTransformer.getLevel2Subcategories(category).length > 0;
  
  // Ne pas rendre la catégorie si elle n'a pas d'éléments visibles et ce n'est pas une catégorie principale
  // et elle n'a pas de sous-catégories
  if (!isMainCategory && (!menuItems || menuItems.length === 0) && !hasSubcategories) {
    return null;
  }

  return (
    <Accordion 
      type="single" 
      collapsible 
      defaultValue={isMainCategory ? category : undefined} 
      className="w-full"
      onValueChange={(value) => setIsExpanded(!!value)}
    >
      <AccordionItem value={category} className="border-none">
        <AccordionTrigger 
          className={`py-2 px-3 text-sm font-medium ${isExpanded || isMainCategory ? 'text-primary font-semibold' : 'text-gray-600'} hover:text-gray-900 hover:no-underline`}
        >
          <span className="flex items-center">
            {renderIcon()}
            <span>{title}</span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="pt-1 pb-2">
          <DynamicMenu 
            category={category} 
            className="px-1" 
            hierarchical={shouldBeHierarchical()}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategoryGroup;
