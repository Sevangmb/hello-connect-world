
import React, { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { DynamicMenu } from "@/components/menu/DynamicMenu";
import { useModuleVisibility } from "./hooks/useModuleVisibility";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminMenuSectionProps {
  isUserAdmin: boolean;
}

const AdminMenuSection: React.FC<AdminMenuSectionProps> = ({ isUserAdmin }) => {
  const { menuItems, loading } = useModuleVisibility('admin');
  const [showContent, setShowContent] = useState(false);
  
  // Ne montrer le contenu que si l'utilisateur est administrateur pour éviter le flash
  useEffect(() => {
    if (isUserAdmin) {
      setShowContent(true);
    }
  }, [isUserAdmin]);
  
  // Ne pas rendre le menu admin si l'utilisateur n'est pas administrateur
  // ou s'il n'y a pas d'éléments de menu admin
  if (!showContent || (!loading && (!menuItems || menuItems.length === 0))) {
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
          {loading ? (
            <div className="space-y-2 px-1">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded" />
              ))}
            </div>
          ) : (
            <DynamicMenu 
              category="admin" 
              className="px-1" 
            />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AdminMenuSection;
