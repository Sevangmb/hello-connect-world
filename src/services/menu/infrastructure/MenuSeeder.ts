
import { supabase } from '@/integrations/supabase/client';
import { MenuItem, MenuItemCategory } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Cette fonction semine les éléments de menu de base dans la base de données
export const seedMenuItems = async () => {
  try {
    // Vérifier si les éléments de menu existent déjà
    const { count, error } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error checking menu items:', error);
      return;
    }

    // Si des éléments existent déjà, ne pas réinsérer
    if (count && count > 0) {
      console.log('Menu items already exist. Skipping seed.');
      return;
    }

    // Créer les éléments de base du menu
    const menuItems: Omit<MenuItem, 'position' | 'children'>[] = [
      // Menu principal
      {
        id: uuidv4(),
        name: 'Accueil',
        path: '/',
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
        name: 'Explorer',
        path: '/explore',
        icon: 'compass',
        category: 'main',
        parent_id: null,
        order: 2,
        is_visible: true,
        module_code: 'explore',
        requires_auth: false,
        requires_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Ma Garde-robe',
        path: '/wardrobe',
        icon: 'shirt',
        category: 'main',
        parent_id: null,
        order: 3,
        is_visible: true,
        module_code: 'wardrobe',
        requires_auth: true,
        requires_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      
      // Sous-menu Garde-robe
      {
        id: uuidv4(),
        name: 'Vêtements',
        path: '/clothes',
        icon: 'tshirt',
        category: 'main',
        parent_id: null, // À remplacer par l'ID du parent
        order: 1,
        is_visible: true,
        module_code: 'wardrobe',
        requires_auth: true,
        requires_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Tenues',
        path: '/outfits',
        icon: 'gallery',
        category: 'main',
        parent_id: null, // À remplacer par l'ID du parent
        order: 2,
        is_visible: true,
        module_code: 'outfits',
        requires_auth: true,
        requires_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Valises',
        path: '/suitcases',
        icon: 'luggage',
        category: 'main',
        parent_id: null, // À remplacer par l'ID du parent
        order: 3,
        is_visible: true,
        module_code: 'suitcases',
        requires_auth: true,
        requires_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      
      // Menu Social
      {
        id: uuidv4(),
        name: 'Social',
        path: '/social',
        icon: 'users',
        category: 'main',
        parent_id: null,
        order: 4,
        is_visible: true,
        module_code: 'social',
        requires_auth: true,
        requires_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Amis',
        path: '/friends',
        icon: 'user-plus',
        category: 'social',
        parent_id: null, // À remplacer par l'ID du parent
        order: 1,
        is_visible: true,
        module_code: 'friends',
        requires_auth: true,
        requires_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Messages',
        path: '/messages',
        icon: 'message-circle',
        category: 'social',
        parent_id: null, // À remplacer par l'ID du parent
        order: 2,
        is_visible: true,
        module_code: 'messages',
        requires_auth: true,
        requires_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Défis',
        path: '/social/challenges',
        icon: 'trophy',
        category: 'social',
        parent_id: null, // À remplacer par l'ID du parent
        order: 3,
        is_visible: true,
        module_code: 'challenges',
        requires_auth: true,
        requires_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      
      // Menu Marketplace
      {
        id: uuidv4(),
        name: 'Boutiques',
        path: '/shops',
        icon: 'shopping-bag',
        category: 'marketplace',
        parent_id: null,
        order: 5,
        is_visible: true,
        module_code: 'marketplace',
        requires_auth: false,
        requires_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Magasins',
        path: '/stores',
        icon: 'store',
        category: 'marketplace',
        parent_id: null, // À remplacer par l'ID du parent
        order: 1,
        is_visible: true,
        module_code: 'marketplace',
        requires_auth: false,
        requires_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Carte',
        path: '/stores/map',
        icon: 'map-pin',
        category: 'marketplace',
        parent_id: null, // À remplacer par l'ID du parent
        order: 2,
        is_visible: true,
        module_code: 'marketplace',
        requires_auth: false,
        requires_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      
      // Menu Admin
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
      
      // Menu Utility
      {
        id: uuidv4(),
        name: 'Profil',
        path: '/profile',
        icon: 'user',
        category: 'utility',
        parent_id: null,
        order: 1,
        is_visible: true,
        module_code: 'core',
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
        category: 'utility',
        parent_id: null,
        order: 2,
        is_visible: true,
        module_code: 'core',
        requires_auth: true,
        requires_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        name: 'Notifications',
        path: '/notifications',
        icon: 'bell',
        category: 'utility',
        parent_id: null,
        order: 3,
        is_visible: true,
        module_code: 'notifications',
        requires_auth: true,
        requires_admin: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];

    // Insérer les éléments de menu
    const { error: insertError } = await supabase
      .from('menu_items')
      .insert(menuItems);

    if (insertError) {
      console.error('Error seeding menu items:', insertError);
      return;
    }

    console.log('Menu items seeded successfully.');
  } catch (error) {
    console.error('Exception in seedMenuItems:', error);
  }
};
