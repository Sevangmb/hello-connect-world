
import React from "react";
import { useModuleVisibility } from "./hooks/useModuleVisibility";
import { CategoryGroupProps } from "./types/moduleMenu";
import { DynamicMenu } from "@/components/menu/DynamicMenu";
import { AccordionItem, AccordionTrigger, AccordionContent, Accordion } from "@/components/ui/accordion";

const CategoryGroup: React.FC<CategoryGroupProps> = ({ title, category }) => {
  const { menuItems, loading } = useModuleVisibility(category);
  
  // Ne pas rendre la catégorie si elle n'a pas d'éléments visibles
  if (!loading && (!menuItems || menuItems.length === 0)) {
    return null;
  }

  return (
    <Accordion type="single" collapsible defaultValue={category} className="w-full">
      <AccordionItem value={category} className="border-none">
        <AccordionTrigger className="py-2 px-3 text-sm font-medium text-gray-500 hover:text-gray-900 hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent className="pt-1 pb-2">
          <DynamicMenu category={category} className="px-1" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CategoryGroup;
