
import { useMenu } from "@/hooks/menu";
import { moduleMenuCoordinator } from "@/services/coordination/ModuleMenuCoordinator";
import { MenuItem } from "@/services/menu/types";
import { useEffect, useState, useCallback } from "react";
import { useModules } from "@/hooks/modules/useModules";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook pour gérer la visibilité des modules dans le menu
 */
export const useModuleVisibility = (category: string) => {
  const { menuItems, loading, isUserAdmin, refreshMenu } = useMenu({ category });
  const [visibleItems, setVisibleItems] = useState<MenuItem[]>([]);
  const { modules, isInitialized } = useModules();
  const [localLoading, setLocalLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Fonction de filtrage des éléments de menu
  const filterMenuItems = useCallback(() => {
    if (!menuItems) {
      return;
    }
    
    try {
      setError(null);
      
      // Appliquer les règles de visibilité des modules
      const filteredItems = menuItems.filter(item => {
        // Si l'élément nécessite d'être admin et que l'utilisateur n'est pas admin, le cacher
        if (item.requires_admin && !isUserAdmin) {
          return false;
        }
        
        // Si l'élément est lié à un module, vérifier la visibilité du module
        if (item.module_code) {
          return moduleMenuCoordinator.isModuleVisibleInMenu(
            item.module_code, 
            modules
          );
        }
        
        return item.is_visible !== false;
      });
      
      // Trier les éléments par ordre (si spécifié)
      const sortedItems = [...filteredItems].sort((a, b) => {
        return (a.order || 999) - (b.order || 999);
      });
      
      console.log(`useModuleVisibility: Éléments de menu pour la catégorie ${category}:`, 
        `${sortedItems.length}/${menuItems.length} éléments visibles`);
      
      setVisibleItems(sortedItems);
    } catch (error: any) {
      console.error(`Erreur lors du filtrage des éléments de menu pour la catégorie ${category}:`, error);
      setError(`Erreur de chargement: ${error.message || 'Erreur inconnue'}`);
      setVisibleItems([]);
      
      toast({
        title: "Erreur de chargement du menu",
        description: `Problème avec la catégorie ${category}`,
        variant: "destructive"
      });
    } finally {
      setLocalLoading(false);
    }
  }, [menuItems, isUserAdmin, category, modules, toast]);
  
  // Effet initial pour précharger les données
  useEffect(() => {
    setLocalLoading(true);
    
    // Timeout de sécurité pour éviter un chargement infini
    const safetyTimeout = setTimeout(() => {
      setLocalLoading(false);
      if (visibleItems.length === 0 && !error) {
        setError("Temps de chargement dépassé");
      }
    }, 3000);
    
    return () => clearTimeout(safetyTimeout);
  }, [category, visibleItems.length, error]);
  
  // Filtrer les éléments de menu lorsque les dépendances changent
  useEffect(() => {
    filterMenuItems();
  }, [filterMenuItems]);
  
  // Mettre en place une actualisation périodique en cas d'erreur
  useEffect(() => {
    if (error) {
      const retryTimer = setTimeout(() => {
        console.log(`Tentative de rechargement de la catégorie ${category} après erreur`);
        refreshMenu();
      }, 5000);
      
      return () => clearTimeout(retryTimer);
    }
  }, [error, category, refreshMenu]);
  
  return {
    menuItems: visibleItems,
    loading: loading || localLoading || !isInitialized,
    isUserAdmin,
    refreshMenu,
    error
  };
};
