
import React, { useState, useEffect } from "react";
import { Shield, ChevronDown, ChevronRight } from "lucide-react";
import { DynamicMenu } from "@/components/menu/DynamicMenu";
import { useModuleVisibility } from "./hooks/useModuleVisibility";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useEvents } from "@/hooks/useEvents";
import { useMenuItemsByCategory } from "@/hooks/menu/useMenuItems";

interface AdminMenuSectionProps {
  isUserAdmin: boolean;
}

const AdminMenuSection: React.FC<AdminMenuSectionProps> = ({ isUserAdmin }) => {
  const { menuItems, loading, error, refreshMenu } = useModuleVisibility('admin');
  const [showContent, setShowContent] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { toast } = useToast();
  const { subscribe, EVENT_TYPES } = useEvents();
  
  // Charger tous les sous-menus admin
  const { data: allAdminMenuItems, isLoading: isLoadingAdminItems } = useMenuItemsByCategory('admin');
  
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
      refreshMenu();
    });
    
    return unsubscribe;
  }, [subscribe, EVENT_TYPES, refreshMenu]);
  
  // Gérer les erreurs
  useEffect(() => {
    if (error && isUserAdmin) {
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger le menu d'administration",
        variant: "destructive"
      });
    }
  }, [error, isUserAdmin, toast]);
  
  // Fonction pour basculer l'expansion du menu
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Ne pas rendre le menu admin si l'utilisateur n'est pas administrateur
  if (!showContent) {
    return null;
  }

  // Organiser les sections administratives
  const adminSections = [
    { 
      title: "Tableau de bord", 
      moduleCode: "admin_dashboard",
      defaultExpanded: true
    },
    { 
      title: "Modules", 
      moduleCode: "admin_modules",
      defaultExpanded: false
    },
    { 
      title: "Utilisateurs", 
      moduleCode: "admin_users",
      defaultExpanded: false
    },
    { 
      title: "Marketplace", 
      moduleCode: "admin_marketplace",
      defaultExpanded: false
    },
    { 
      title: "Contenu", 
      moduleCode: "admin_content",
      defaultExpanded: false
    },
    { 
      title: "Paramètres", 
      moduleCode: "admin_settings",
      defaultExpanded: false
    }
  ];

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
          {loading || isLoadingAdminItems ? (
            <div className="space-y-2 px-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded" />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-500 text-sm px-3 py-2">
              {error}
            </div>
          ) : (
            <div className="px-1 space-y-1">
              {/* Menu principal d'administration avec structure hiérarchique */}
              <DynamicMenu 
                category="admin" 
                hierarchical={true}
              />
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AdminMenuSection;
