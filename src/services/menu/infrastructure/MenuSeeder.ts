
import { supabase } from '@/integrations/supabase/client';
import { MenuItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Define standard menu items without position or children
const standardMenuItems: Omit<MenuItem, 'position' | 'children'>[] = [
  // Core navigation
  {
    id: uuidv4(),
    name: 'Accueil',
    path: '/home',
    icon: 'home',
    category: 'main',
    parent_id: null,
    order: 1,
    is_visible: true,
    module_code: 'core',
    requires_auth: false,
    requires_admin: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Mes vêtements',
    path: '/clothes',
    icon: 'shirt',
    category: 'main',
    parent_id: null,
    order: 2,
    is_visible: true,
    module_code: 'clothes',
    requires_auth: true,
    requires_admin: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Boutique',
    path: '/shop',
    icon: 'shopping-bag',
    category: 'main',
    parent_id: null,
    order: 3,
    is_visible: true,
    module_code: 'shop',
    requires_auth: false,
    requires_admin: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Admin section
  {
    id: uuidv4(),
    name: 'Administration',
    path: '/admin',
    icon: 'settings',
    category: 'admin',
    parent_id: null,
    order: 1,
    is_visible: true,
    module_code: 'admin',
    requires_auth: true,
    requires_admin: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Modules',
    path: '/admin/modules',
    icon: 'puzzle',
    category: 'admin',
    parent_id: null,
    order: 2,
    is_visible: true,
    module_code: 'admin',
    requires_auth: true,
    requires_admin: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Utilisateurs',
    path: '/admin/users',
    icon: 'users',
    category: 'admin',
    parent_id: null,
    order: 3,
    is_visible: true,
    module_code: 'admin',
    requires_auth: true,
    requires_admin: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // User section
  {
    id: uuidv4(),
    name: 'Mon profil',
    path: '/profile',
    icon: 'user',
    category: 'user',
    parent_id: null,
    order: 1,
    is_visible: true,
    module_code: 'user',
    requires_auth: true,
    requires_admin: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Paramètres',
    path: '/settings',
    icon: 'settings',
    category: 'user',
    parent_id: null,
    order: 2,
    is_visible: true,
    module_code: 'user',
    requires_auth: true,
    requires_admin: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Déconnexion',
    path: '/logout',
    icon: 'log-out',
    category: 'user',
    parent_id: null,
    order: 3,
    is_visible: true,
    module_code: 'auth',
    requires_auth: true,
    requires_admin: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Shop section
  {
    id: uuidv4(),
    name: 'Boutique',
    path: '/shop',
    icon: 'shopping-bag',
    category: 'shop',
    parent_id: null,
    order: 1,
    is_visible: true,
    module_code: 'shop',
    requires_auth: false,
    requires_admin: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Panier',
    path: '/cart',
    icon: 'shopping-cart',
    category: 'shop',
    parent_id: null,
    order: 2,
    is_visible: true,
    module_code: 'cart',
    requires_auth: true,
    requires_admin: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    name: 'Commandes',
    path: '/orders',
    icon: 'package',
    category: 'shop',
    parent_id: null,
    order: 3,
    is_visible: true,
    module_code: 'shop',
    requires_auth: true,
    requires_admin: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Seeder pour les éléments de menu
 * Initialise les menus standard dans la base de données
 */
export const seedMenuItems = async (): Promise<void> => {
  try {
    // Vérifier si les éléments de menu existent déjà
    const { data: existingMenuItems, error: checkError } = await supabase
      .from('menu_items')
      .select('id')
      .limit(1);
      
    if (checkError) {
      console.error('Error checking existing menu items:', checkError);
      throw checkError;
    }
    
    // Si des éléments de menu existent déjà, ne pas réinitialiser
    if (existingMenuItems && existingMenuItems.length > 0) {
      console.log('Menu items already exist, skipping initialization');
      return;
    }
    
    console.log('Initializing menu items...');
    
    // Insérer les éléments de menu standard
    const { error } = await supabase
      .from('menu_items')
      .insert(standardMenuItems);
      
    if (error) {
      console.error('Error seeding menu items:', error);
      throw error;
    }
    
    console.log('Menu items initialized successfully');
  } catch (error) {
    console.error('Error in seedMenuItems:', error);
    throw error;
  }
};

// Fonction pour supprimer et réinitialiser les éléments de menu (à utiliser avec précaution)
export const resetMenuItems = async (): Promise<void> => {
  try {
    // Supprimer tous les éléments de menu existants
    const { error: deleteError } = await supabase
      .from('menu_items')
      .delete()
      .neq('id', '0');  // Condition de sécurité pour s'assurer qu'il y a une condition
      
    if (deleteError) {
      console.error('Error deleting existing menu items:', deleteError);
      throw deleteError;
    }
    
    // Réinitialiser les éléments de menu
    await seedMenuItems();
    
    console.log('Menu items reset successfully');
  } catch (error) {
    console.error('Error in resetMenuItems:', error);
    throw error;
  }
};
