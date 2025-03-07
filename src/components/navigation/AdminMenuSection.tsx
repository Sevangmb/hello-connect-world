
import React, { useState, useEffect } from "react";
import { Shield, ChevronDown, ChevronRight } from "lucide-react";
import { DynamicMenu } from "@/components/menu/DynamicMenu";
import { useMenuItemsByCategory } from "@/hooks/menu/useMenuItems";
import { useToast } from "@/hooks/use-toast";
import { useEvents } from "@/hooks/useEvents";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

interface AdminMenuSectionProps {
  isUserAdmin: boolean;
}

const AdminMenuSection: React.FC<AdminMenuSectionProps> = ({ isUserAdmin }) => {
  const [showContent, setShowContent] = useState(false);
  const { toast } = useToast();
  const { subscribe, EVENT_TYPES } = useEvents();
  
  // Ne montrer le contenu que si l'utilisateur est administrateur pour éviter le flash
  useEffect(() => {
    if (isUserAdmin) {
      setShowContent(true);
    }
  }, [isUserAdmin]);
  
  // S'abonner aux événements de changement de statut admin
  useEffect(() => {
    const unsubscribe = subscribe(EVENT_TYPES.ADMIN_ACCESS_GRANTED, () => {
      setShowContent(true);
    });
    
    return unsubscribe;
  }, [subscribe, EVENT_TYPES]);
  
  // Ne pas rendre le menu admin si l'utilisateur n'est pas administrateur
  if (!showContent) {
    return null;
  }

  return (
    <>
      <Separator className="my-3" />
      <Accordion type="single" collapsible defaultValue="admin" className="w-full">
        <AccordionItem value="admin" className="border-none">
          <AccordionTrigger 
            className="py-2 px-3 text-sm font-medium text-primary rounded-md hover:bg-primary/5 transition-colors hover:no-underline group"
          >
            <span className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-primary" />
              <span className="font-semibold">Administration</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-2 px-1 space-y-1">
            {/* Menu principal d'administration avec structure hiérarchique */}
            <DynamicMenu 
              category="admin" 
              hierarchical={true}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default AdminMenuSection;
