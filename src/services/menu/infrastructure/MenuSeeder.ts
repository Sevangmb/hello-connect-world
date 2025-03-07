import { supabase } from '@/integrations/supabase/client';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';

// Fonction d'exportation pour l'initialisation des éléments de menu
export const seedMenuItems = async (): Promise<boolean> => {
  return await seedAllMenuItems();
};

// Fonction principale pour créer tous les éléments de menu
const seedAllMenuItems = async (): Promise<boolean> => {
  try {
    // Vérifier si les éléments de menu existent déjà
    const { count, error } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error("Erreur lors de la vérification des éléments de menu:", error);
      return false;
    }
    
    // Si des éléments existent déjà, ne rien faire
    if (count && count > 0) {
      console.log(`${count} éléments de menu existent déjà, pas besoin de seeder.`);
      return true;
    }
    
    // Créer les éléments de menu principaux
    const success = await createMainMenuItems();
    
    return success;
  } catch (error) {
    console.error("Erreur lors du seeding des éléments de menu:", error);
    return false;
  }
};

// Fonction pour créer les éléments de menu principaux
const createMainMenuItems = async (): Promise<boolean> => {
  try {
    // Créer les menus un par un pour éviter les problèmes
    const menuItems: Omit<MenuItem, "id" | "children" | "position">[] = [
      // Menu principal
      {
        name: "Accueil",
        path: "/",
        icon: "home",
        category: "main" as MenuItemCategory,
        parent_id: null,
        order: 1,
        is_visible: true,
        module_code: "core",
        requires_auth: false,
        requires_admin: false,
        is_active: true,
        description: "Page d'accueil"
      },
      
      // Sections personnelles
      {
        name: "Ma garde-robe",
        path: "/wardrobe",
        icon: "shirt",
        category: "personal" as MenuItemCategory,
        parent_id: null,
        order: 2,
        is_visible: true,
        module_code: "wardrobe",
        requires_auth: true,
        requires_admin: false,
        is_active: true,
        description: "Gérer mes vêtements"
      },
      
      // ... Autres éléments de menu
      {
        name: "Tenues",
        path: "/wardrobe/outfits",
        icon: "outfit",
        category: "personal" as MenuItemCategory,
        parent_id: null,
        order: 3,
        is_visible: true,
        module_code: "wardrobe",
        requires_auth: true,
        requires_admin: false,
        is_active: true,
        description: "Mes tenues"
      },
      
      // Sections sociales
      {
        name: "Amis",
        path: "/social/friends",
        icon: "users",
        category: "social" as MenuItemCategory,
        parent_id: null,
        order: 4,
        is_visible: true,
        module_code: "social",
        requires_auth: true,
        requires_admin: false,
        is_active: true,
        description: "Gérer mes amis"
      },
      
      // ... Autres éléments de menu
      
      // Sections administrateur
      {
        name: "Administration",
        path: "/admin",
        icon: "settings",
        category: "admin" as MenuItemCategory,
        parent_id: null,
        order: 10,
        is_visible: true,
        module_code: "admin",
        requires_auth: true,
        requires_admin: true,
        is_active: true,
        description: "Panneau d'administration"
      }
    ];
    
    // Insérer les éléments de menu
    for (const item of menuItems) {
      const { error } = await supabase
        .from('menu_items')
        .insert({
          name: item.name,
          path: item.path,
          icon: item.icon,
          category: item.category,
          parent_id: item.parent_id,
          order: item.order,
          is_visible: item.is_visible,
          module_code: item.module_code,
          requires_auth: item.requires_auth,
          requires_admin: item.requires_admin,
          is_active: item.is_active,
          description: item.description
        });
        
      if (error) {
        console.error(`Erreur lors de l'insertion de l'élément de menu ${item.name}:`, error);
        return false;
      }
    }
    
    console.log(`${menuItems.length} éléments de menu créés avec succès.`);
    return true;
  } catch (error) {
    console.error("Erreur lors de la création des éléments de menu:", error);
    return false;
  }
};

export default seedMenuItems;
