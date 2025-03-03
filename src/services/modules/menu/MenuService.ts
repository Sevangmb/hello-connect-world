
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, MenuSection, MenuConfiguration } from "./types";
import { eventBus } from "@/core/event-bus/EventBus";
import { MENU_MODULE_CODE } from "@/hooks/modules/constants";

/**
 * Classe de service pour le module Menu
 * Gère la récupération et la manipulation des menus
 */
export class MenuService {
  /**
   * Récupère tous les éléments de menu depuis Supabase
   */
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('position');
      
      if (error) {
        console.error("Erreur lors de la récupération des éléments de menu:", error);
        throw error;
      }
      
      return data as unknown as MenuItem[];
    } catch (error) {
      console.error("Exception lors de la récupération des éléments de menu:", error);
      return [];
    }
  }

  /**
   * Récupère la configuration du menu pour un module spécifique
   */
  async getMenuConfiguration(moduleCode: string): Promise<MenuConfiguration> {
    try {
      // Récupérer d'abord tous les éléments de menu
      const menuItems = await this.getMenuItems();
      
      // Filtrer par module si nécessaire
      const filteredItems = moduleCode 
        ? menuItems.filter(item => item.module_code === moduleCode)
        : menuItems;
      
      // Organiser les éléments par section
      const sections: { [key: string]: MenuSection } = {};
      
      filteredItems.forEach(item => {
        const sectionId = item.parent_id || 'main';
        if (!sections[sectionId]) {
          sections[sectionId] = {
            id: sectionId,
            name: sectionId === 'main' ? 'Principal' : sectionId,
            items: []
          };
        }
        sections[sectionId].items.push(item);
      });
      
      return {
        sections: Object.values(sections),
        defaultActiveItem: filteredItems.length > 0 ? filteredItems[0].id : undefined
      };
    } catch (error) {
      console.error("Erreur lors de la récupération de la configuration du menu:", error);
      return { sections: [] };
    }
  }

  /**
   * Ajoute un nouvel élément de menu
   */
  async addMenuItem(item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<MenuItem | null> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([item])
        .select()
        .single();
      
      if (error) {
        console.error("Erreur lors de l'ajout d'un élément de menu:", error);
        throw error;
      }
      
      // Publier un événement pour notifier les composants de menu
      eventBus.publish('menu:updated', { action: 'add', item: data });
      
      return data as unknown as MenuItem;
    } catch (error) {
      console.error("Exception lors de l'ajout d'un élément de menu:", error);
      return null;
    }
  }

  /**
   * Met à jour un élément de menu existant
   */
  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id);
      
      if (error) {
        console.error("Erreur lors de la mise à jour d'un élément de menu:", error);
        throw error;
      }
      
      // Publier un événement pour notifier les composants de menu
      eventBus.publish('menu:updated', { action: 'update', itemId: id, updates });
      
      return true;
    } catch (error) {
      console.error("Exception lors de la mise à jour d'un élément de menu:", error);
      return false;
    }
  }

  /**
   * Supprime un élément de menu
   */
  async deleteMenuItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Erreur lors de la suppression d'un élément de menu:", error);
        throw error;
      }
      
      // Publier un événement pour notifier les composants de menu
      eventBus.publish('menu:updated', { action: 'delete', itemId: id });
      
      return true;
    } catch (error) {
      console.error("Exception lors de la suppression d'un élément de menu:", error);
      return false;
    }
  }

  /**
   * Réorganise les éléments de menu
   */
  async reorderMenuItems(itemIds: string[]): Promise<boolean> {
    try {
      // Mettre à jour la position de chaque élément
      for (let i = 0; i < itemIds.length; i++) {
        const { error } = await supabase
          .from('menu_items')
          .update({ position: i })
          .eq('id', itemIds[i]);
          
        if (error) {
          console.error(`Erreur lors de la mise à jour de la position du menu ${itemIds[i]}:`, error);
          throw error;
        }
      }
      
      // Publier un événement pour notifier les composants de menu
      eventBus.publish('menu:updated', { action: 'reorder' });
      
      return true;
    } catch (error) {
      console.error("Exception lors de la réorganisation des éléments de menu:", error);
      return false;
    }
  }
}

// Exporter une instance unique pour toute l'application
export const menuService = new MenuService();
