
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, MenuItemCategory } from "../types";
import { v4 as uuidv4 } from "uuid";

/**
 * Service for seeding the menu items in the database
 */
export class MenuSeeder {
  /**
   * Seeds the default menu items if none exist
   */
  async seedDefaultMenuItems(): Promise<void> {
    try {
      // Check if any menu items exist
      const { count, error } = await supabase
        .from('menu_items')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error("Error checking menu items:", error);
        return;
      }

      // If menu items already exist, skip seeding
      if (count && count > 0) {
        console.log("Menu items already seeded, skipping...");
        return;
      }

      // Get current timestamp
      const now = new Date().toISOString();

      // Define main menu items
      const mainMenuItems: Omit<MenuItem, 'position' | 'children'>[] = [
        {
          id: uuidv4(),
          name: "Accueil",
          path: "/",
          icon: "home",
          category: "main",
          is_visible: true,
          requires_auth: false,
          module_code: "core",
          is_active: true,
          parent_id: null,
          order: 10,
          created_at: now,
          updated_at: now,
        },
        {
          id: uuidv4(),
          name: "Recherche",
          path: "/search",
          icon: "search",
          category: "main",
          is_visible: true,
          requires_auth: false,
          module_code: "core",
          is_active: true,
          parent_id: null,
          order: 20,
          created_at: now,
          updated_at: now,
        },
        {
          id: uuidv4(),
          name: "Explorateur",
          path: "/explore",
          icon: "compass",
          category: "main",
          is_visible: true,
          requires_auth: false,
          module_code: "core",
          is_active: true,
          parent_id: null,
          order: 30,
          created_at: now,
          updated_at: now,
        }
      ];

      // Define wardrobe items
      const wardrobeItems: Omit<MenuItem, 'position' | 'children'>[] = [
        {
          id: uuidv4(),
          name: "Mes Vêtements",
          path: "/clothes",
          icon: "shirt",
          category: "wardrobe",
          is_visible: true,
          requires_auth: true,
          module_code: "clothes",
          is_active: true,
          parent_id: null,
          order: 10,
          created_at: now,
          updated_at: now,
        },
        {
          id: uuidv4(),
          name: "Mes Tenues",
          path: "/outfits",
          icon: "outfit",
          category: "wardrobe",
          is_visible: true,
          requires_auth: true,
          module_code: "outfits",
          is_active: true,
          parent_id: null,
          order: 20,
          created_at: now,
          updated_at: now,
        },
        {
          id: uuidv4(),
          name: "Mes Valises",
          path: "/suitcases",
          icon: "suitcase",
          category: "wardrobe",
          is_visible: true,
          requires_auth: true,
          module_code: "suitcases",
          is_active: true,
          parent_id: null,
          order: 30,
          created_at: now,
          updated_at: now,
        }
      ];

      // Define social items
      const socialItems: Omit<MenuItem, 'position' | 'children'>[] = [
        {
          id: uuidv4(),
          name: "Amis",
          path: "/friends",
          icon: "users",
          category: "social",
          is_visible: true,
          requires_auth: true,
          module_code: "social",
          is_active: true,
          parent_id: null,
          order: 10,
          created_at: now,
          updated_at: now,
        },
        {
          id: uuidv4(),
          name: "Messages",
          path: "/messages",
          icon: "message-circle",
          category: "social",
          is_visible: true,
          requires_auth: true,
          module_code: "social",
          is_active: true,
          parent_id: null,
          order: 20,
          created_at: now,
          updated_at: now,
        },
        {
          id: uuidv4(),
          name: "Défis",
          path: "/social/challenges",
          icon: "trophy",
          category: "social",
          is_visible: true,
          requires_auth: true,
          module_code: "challenges",
          is_active: true,
          parent_id: null,
          order: 30,
          created_at: now,
          updated_at: now,
        },
        {
          id: uuidv4(),
          name: "Groupes",
          path: "/groups",
          icon: "users-2",
          category: "social",
          is_visible: true,
          requires_auth: true,
          module_code: "social",
          is_active: true,
          parent_id: null,
          order: 40,
          created_at: now,
          updated_at: now,
        }
      ];

      // Define marketplace items
      const marketplaceItems: Omit<MenuItem, 'position' | 'children'>[] = [
        {
          id: uuidv4(),
          name: "Boutiques",
          path: "/boutiques",
          icon: "shopping-bag",
          category: "marketplace",
          is_visible: true,
          requires_auth: false,
          module_code: "marketplace",
          is_active: true,
          parent_id: null,
          order: 10,
          created_at: now,
          updated_at: now,
        },
        {
          id: uuidv4(),
          name: "Magasins",
          path: "/stores",
          icon: "store",
          category: "marketplace",
          is_visible: true,
          requires_auth: false,
          module_code: "marketplace",
          is_active: true,
          parent_id: null,
          order: 20,
          created_at: now,
          updated_at: now,
        },
        {
          id: uuidv4(),
          name: "Panier",
          path: "/cart",
          icon: "shopping-cart",
          category: "marketplace",
          is_visible: true,
          requires_auth: true,
          module_code: "marketplace",
          is_active: true,
          parent_id: null,
          order: 30,
          created_at: now,
          updated_at: now,
        }
      ];

      // Define utility items
      const utilityItems: Omit<MenuItem, 'position' | 'children'>[] = [
        {
          id: uuidv4(),
          name: "Notifications",
          path: "/notifications",
          icon: "bell",
          category: "utility",
          is_visible: true,
          requires_auth: true,
          module_code: "core",
          is_active: true,
          parent_id: null,
          order: 10,
          created_at: now,
          updated_at: now,
        },
        {
          id: uuidv4(),
          name: "Paramètres",
          path: "/settings",
          icon: "settings",
          category: "utility",
          is_visible: true,
          requires_auth: true,
          module_code: "core",
          is_active: true,
          parent_id: null,
          order: 20,
          created_at: now,
          updated_at: now,
        },
        {
          id: uuidv4(),
          name: "Profil",
          path: "/profile",
          icon: "user",
          category: "utility",
          is_visible: true,
          requires_auth: true,
          module_code: "core",
          is_active: true,
          parent_id: null,
          order: 30,
          created_at: now,
          updated_at: now,
        }
      ];

      // Define admin items
      const adminItems: Omit<MenuItem, 'position' | 'children'>[] = [
        {
          id: uuidv4(),
          name: "Tableau de bord",
          path: "/admin",
          icon: "layout-dashboard",
          category: "admin",
          is_visible: true,
          requires_auth: true,
          requires_admin: true,
          module_code: "admin",
          is_active: true,
          parent_id: null,
          order: 10,
          created_at: now,
          updated_at: now,
        },
        {
          id: uuidv4(),
          name: "Modules",
          path: "/admin/modules",
          icon: "boxes",
          category: "admin",
          is_visible: true,
          requires_auth: true,
          requires_admin: true,
          module_code: "admin",
          is_active: true,
          parent_id: null,
          order: 20,
          created_at: now,
          updated_at: now,
        },
        {
          id: uuidv4(),
          name: "Utilisateurs",
          path: "/admin/users",
          icon: "users",
          category: "admin",
          is_visible: true,
          requires_auth: true,
          requires_admin: true,
          module_code: "admin",
          is_active: true,
          parent_id: null,
          order: 30,
          created_at: now,
          updated_at: now,
        },
        {
          id: uuidv4(),
          name: "Contenu",
          path: "/admin/content",
          icon: "file-text",
          category: "admin",
          is_visible: true,
          requires_auth: true,
          requires_admin: true,
          module_code: "admin",
          is_active: true,
          parent_id: null,
          order: 40,
          created_at: now,
          updated_at: now,
        },
        {
          id: uuidv4(),
          name: "Paramètres",
          path: "/admin/settings",
          icon: "settings",
          category: "admin",
          is_visible: true,
          requires_auth: true,
          requires_admin: true,
          module_code: "admin",
          is_active: true,
          parent_id: null,
          order: 50,
          created_at: now,
          updated_at: now,
        }
      ];

      // Combine all menu items
      const allMenuItems = [
        ...mainMenuItems,
        ...wardrobeItems,
        ...socialItems,
        ...marketplaceItems,
        ...utilityItems,
        ...adminItems
      ];

      // Insert menu items one by one for type safety
      for (const item of allMenuItems) {
        const { error } = await supabase
          .from('menu_items')
          .insert({
            id: item.id,
            name: item.name,
            path: item.path,
            icon: item.icon,
            category: item.category as MenuItemCategory,
            is_visible: item.is_visible,
            requires_auth: item.requires_auth,
            requires_admin: item.requires_admin,
            module_code: item.module_code,
            is_active: item.is_active,
            parent_id: item.parent_id,
            order: item.order,
            created_at: item.created_at,
            updated_at: item.updated_at,
          });
          
        if (error) {
          console.error(`Error inserting menu item ${item.name}:`, error);
        }
      }

      console.log("Default menu items seeded successfully");
    } catch (error) {
      console.error("Error seeding default menu items:", error);
    }
  }
}

export const menuSeeder = new MenuSeeder();
