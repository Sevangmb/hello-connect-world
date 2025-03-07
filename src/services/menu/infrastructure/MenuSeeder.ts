
import { supabase } from '@/integrations/supabase/client';
import { MenuItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const seedMenuItems = async () => {
  try {
    // Vérifier si le menu a déjà été initialisé
    const { count, error: countError } = await supabase
      .from('menu_items')
      .select('*', { count: 'exact' });
      
    if (countError) throw countError;
    
    // Si des éléments existent déjà, ne pas réinitialiser
    if (count && count > 0) {
      console.log('Menu items already exist, skipping seed');
      return;
    }
    
    // Créer les éléments de menu pour chaque module
    const menuItems: Partial<MenuItem>[] = [
      // Main Module
      {
        id: uuidv4(),
        name: 'Accueil',
        path: '/',
        icon: 'Home',
        category: 'main',
        module_code: 'core',
        position: 1,
        is_visible: true,
        requires_auth: false,
        requires_admin: false
      },
      {
        id: uuidv4(),
        name: 'Explorer',
        path: '/explore',
        icon: 'Compass',
        category: 'main',
        module_code: 'core',
        position: 2,
        is_visible: true,
        requires_auth: false,
        requires_admin: false
      },
      {
        id: uuidv4(),
        name: 'Univers',
        path: '/personal',
        icon: 'User',
        category: 'main',
        module_code: 'core',
        position: 3,
        is_visible: true,
        requires_auth: true,
        requires_admin: false
      },
      {
        id: uuidv4(),
        name: 'Recherche',
        path: '/search',
        icon: 'Search',
        category: 'main',
        module_code: 'core',
        position: 4,
        is_visible: true,
        requires_auth: false,
        requires_admin: false
      },
      
      // Social Module
      {
        id: uuidv4(),
        name: 'Défis',
        path: '/social/challenges',
        icon: 'Trophy',
        category: 'social',
        module_code: 'social',
        position: 1,
        is_visible: true,
        requires_auth: true,
        requires_admin: false
      },
      {
        id: uuidv4(),
        name: 'Amis',
        path: '/social/friends',
        icon: 'Users',
        category: 'social',
        module_code: 'social',
        position: 2,
        is_visible: true,
        requires_auth: true,
        requires_admin: false
      },
      {
        id: uuidv4(),
        name: 'Messages',
        path: '/social/messages',
        icon: 'MessageSquare',
        category: 'social',
        module_code: 'social',
        position: 3,
        is_visible: true,
        requires_auth: true,
        requires_admin: false
      },
      {
        id: uuidv4(),
        name: 'Notifications',
        path: '/notifications',
        icon: 'Bell',
        category: 'social',
        module_code: 'social',
        position: 4,
        is_visible: true,
        requires_auth: true,
        requires_admin: false
      },
      
      // Wardrobe Module
      {
        id: uuidv4(),
        name: 'Tenues',
        path: '/wardrobe/outfits',
        icon: 'Shirt',
        category: 'wardrobe',
        module_code: 'wardrobe',
        position: 1,
        is_visible: true,
        requires_auth: true,
        requires_admin: false
      },
      {
        id: uuidv4(),
        name: 'Valises',
        path: '/wardrobe/suitcases',
        icon: 'Briefcase',
        category: 'wardrobe',
        module_code: 'wardrobe',
        position: 2,
        is_visible: true,
        requires_auth: true,
        requires_admin: false
      },
      
      // Shop Module
      {
        id: uuidv4(),
        name: 'Boutiques',
        path: '/boutiques',
        icon: 'Store',
        category: 'marketplace',
        module_code: 'shop',
        position: 1,
        is_visible: true,
        requires_auth: false,
        requires_admin: false
      },
      {
        id: uuidv4(),
        name: 'Panier',
        path: '/cart',
        icon: 'ShoppingCart',
        category: 'marketplace',
        module_code: 'shop',
        position: 2,
        is_visible: true,
        requires_auth: true,
        requires_admin: false
      },
      
      // Admin Module
      {
        id: uuidv4(),
        name: 'Tableau de bord',
        path: '/admin/dashboard',
        icon: 'LayoutDashboard',
        category: 'admin',
        module_code: 'admin',
        position: 1,
        is_visible: true,
        requires_auth: true,
        requires_admin: true
      },
      {
        id: uuidv4(),
        name: 'Modules',
        path: '/admin/modules',
        icon: 'Layers',
        category: 'admin',
        module_code: 'admin',
        position: 2,
        is_visible: true,
        requires_auth: true,
        requires_admin: true
      },
      {
        id: uuidv4(),
        name: 'Boutiques',
        path: '/admin/shops',
        icon: 'Store',
        category: 'admin',
        module_code: 'admin',
        position: 3,
        is_visible: true,
        requires_auth: true,
        requires_admin: true
      },
      
      // System Module
      {
        id: uuidv4(),
        name: 'Profil',
        path: '/profile',
        icon: 'User',
        category: 'system',
        module_code: 'core',
        position: 1,
        is_visible: true,
        requires_auth: true,
        requires_admin: false
      },
      {
        id: uuidv4(),
        name: 'Paramètres',
        path: '/profile/settings',
        icon: 'Settings',
        category: 'system',
        module_code: 'core',
        position: 2,
        is_visible: true,
        requires_auth: true,
        requires_admin: false
      },
      {
        id: uuidv4(),
        name: 'À propos',
        path: '/about',
        icon: 'Info',
        category: 'system',
        module_code: 'core',
        position: 3,
        is_visible: true,
        requires_auth: false,
        requires_admin: false
      },
      {
        id: uuidv4(),
        name: 'Mentions légales',
        path: '/legal',
        icon: 'FileText',
        category: 'system',
        module_code: 'core',
        position: 4,
        is_visible: true,
        requires_auth: false,
        requires_admin: false
      }
    ];
    
    // Insérer les éléments de menu dans la base de données
    const { error } = await supabase
      .from('menu_items')
      .insert(menuItems);
      
    if (error) throw error;
    
    console.log('Menu items seeded successfully');
  } catch (error) {
    console.error('Error seeding menu items:', error);
  }
};
