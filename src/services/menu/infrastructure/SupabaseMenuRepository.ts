
import { supabase } from '@/integrations/supabase/client';
import { moduleApiGateway } from '@/services/api-gateway/ModuleApiGateway';
import { IMenuRepository } from '../domain/interfaces/IMenuRepository';
import { MenuItem, MenuItemCategory, CreateMenuItemParams, UpdateMenuItemParams } from '../types';

export class MenuRepository implements IMenuRepository {
  async getAllMenuItems(): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_active', true)
        .order('position');
      
      if (error) throw error;
      return data as MenuItem[];
    } catch (error) {
      console.error('Erreur lors de la récupération des éléments de menu:', error);
      throw error;
    }
  }

  async getMenuItemsByCategory(category: MenuItemCategory): Promise<MenuItem[]> {
    try {
      // Créer la requête Supabase de base sans filtre par catégorie
      let query = supabase
        .from('menu_items')
        .select('*')
        .eq('is_active', true)
        .order('position');
      
      // Ajouter le filtre de catégorie avec le cast approprié
      // Pour résoudre l'erreur TypeScript, on utilise une assertion de type
      query = query.eq('category', category as string);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data as MenuItem[];
    } catch (error) {
      console.error(`Erreur lors de la récupération des éléments de menu pour la catégorie ${category}:`, error);
      throw error;
    }
  }

  async getMenuItemsByModule(moduleCode: string, isAdmin: boolean = false): Promise<MenuItem[]> {
    try {
      // Vérifier si le module est actif via le moduleApiGateway
      const isModuleActive = await moduleApiGateway.isModuleActive(moduleCode);
      
      // Si le module n'est pas actif et que l'utilisateur n'est pas admin,
      // et que ce n'est pas le module admin, retourner un tableau vide
      if (!isModuleActive && !isAdmin && moduleCode !== 'admin' && !moduleCode.startsWith('admin_')) {
        console.log(`Module ${moduleCode} inactif, aucun élément de menu affiché`);
        return [];
      }
      
      // Construire la requête en fonction du statut admin
      let query = supabase
        .from('menu_items')
        .select('*')
        .eq('module_code', moduleCode)
        .eq('is_active', true)
        .order('position', { ascending: true });
      
      // Si l'utilisateur n'est pas admin, filtrer les éléments qui nécessitent des droits admin
      if (!isAdmin) {
        query = query.eq('requires_admin', false).eq('is_visible', true);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error(`Erreur lors de la récupération des éléments de menu pour le module ${moduleCode}:`, error);
        throw error;
      }
      
      return data || [];
    } catch (err) {
      console.error(`Exception lors du chargement des éléments de menu pour le module ${moduleCode}:`, err);
      throw err;
    }
  }
  
  async getMenuItemsByParent(parentId: string | null): Promise<MenuItem[]> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('parent_id', parentId)
        .eq('is_active', true)
        .order('position', { ascending: true });
        
      if (error) {
        console.error(`Erreur lors de la récupération des éléments de menu pour le parent ${parentId}:`, error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des éléments de menu pour le parent ${parentId}:`, error);
      throw error;
    }
  }
  
  async createMenuItem(item: CreateMenuItemParams): Promise<MenuItem | null> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([item as any])
        .select()
        .single();
        
      if (error) {
        console.error('Error creating menu item:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la création d\'un élément de menu:', error);
      return null;
    }
  }
  
  async updateMenuItem(id: string, updates: UpdateMenuItemParams): Promise<MenuItem | null> {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();
        
      if (error) {
        console.error(`Error updating menu item ${id}:`, error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'élément de menu ${id}:`, error);
      return null;
    }
  }
  
  async deleteMenuItem(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error(`Error deleting menu item ${id}:`, error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'élément de menu ${id}:`, error);
      return false;
    }
  }
}

export const menuRepository = new MenuRepository();
