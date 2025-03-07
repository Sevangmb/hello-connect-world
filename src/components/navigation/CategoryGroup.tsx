
import React from "react";
import { useModuleVisibility } from "./hooks/useModuleVisibility";
import { CategoryGroupProps } from "./types/moduleMenu";
import { DynamicMenu } from "@/components/menu/DynamicMenu";
import { AccordionItem, AccordionTrigger, AccordionContent, Accordion } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import * as LucideIcons from "lucide-react";
import { getIcon } from "@/components/menu/utils/menuUtils";

const CategoryGroup: React.FC<CategoryGroupProps> = ({ title, category, icon }) => {
  const { menuItems, loading, error } = useModuleVisibility(category);
  
  // Récupérer et rendre l'icône à partir de la bibliothèque Lucide
  const renderIcon = () => {
    if (!icon) return null;
    
    const IconComponent = getIcon(icon);
    return IconComponent ? <IconComponent className="h-4 w-4 mr-2" /> : null;
  };

  // Pendant le chargement, nous affichons un squelette pour une meilleure UX
  if (loading) {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value={category} className="border-none">
          <AccordionTrigger className="py-2 px-3 text-sm font-medium text-gray-500 hover:text-gray-900 hover:no-underline">
            {renderIcon()}
            {title}
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
            {renderIcon()}
            {title}
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

  // Ne pas rendre la catégorie si elle n'a pas d'éléments visibles
  if (!menuItems || menuItems.length === 0) {
    return null;
  }

  return (
    <Accordion type="single" collapsible defaultValue={category} className="w-full">
      <AccordionItem value={category} className="border-none">
        <AccordionTrigger className="py-2 px-3 text-sm font-medium text-gray-500 hover:text-gray-900 hover:no-underline flex items-center">
          {renderIcon()}
          <span>{title}</span>
        </AccordionTrigger>
        <AccordionContent className="pt-1 pb-2">
          <DynamicMenu category={category} className="px-1" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategoryGroup;
