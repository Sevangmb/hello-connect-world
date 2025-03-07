
import React from "react";
import { Shield } from "lucide-react";
import { DynamicMenu } from "@/components/menu/DynamicMenu";
import { useModuleVisibility } from "./hooks/useModuleVisibility";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface AdminMenuSectionProps {
  isUserAdmin: boolean;
}

const AdminMenuSection: React.FC<AdminMenuSectionProps> = ({ isUserAdmin }) => {
  const { menuItems, loading } = useModuleVisibility('admin');
  
  // Ne pas rendre le menu admin si l'utilisateur n'est pas administrateur
  // ou s'il n'y a pas d'éléments de menu admin
  if (!isUserAdmin || (!loading && (!menuItems || menuItems.length === 0))) {
    return null;
  }

  return (
    <Accordion type="single" collapsible defaultValue="admin" className="w-full">
      <AccordionItem value="admin" className="border-none">
        <AccordionTrigger className="py-2 px-3 text-sm font-medium text-primary hover:text-primary-dark hover:no-underline group">
          <span className="flex items-center">
            <Shield className="h-4 w-4 mr-2 text-primary" />
            Administration
          </span>
        </AccordionTrigger>
        <AccordionContent className="pt-1 pb-2">
          <DynamicMenu 
            category="admin" 
            className="px-1" 
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AdminMenuSection;
