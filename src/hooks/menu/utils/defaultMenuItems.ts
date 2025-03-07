
import { MenuItem } from '@/services/menu/types';

// Fonction pour générer des éléments de menu par défaut
// Ces éléments seront utilisés si aucun n'est trouvé en base de données
export const getDefaultMenuItems = (): MenuItem[] => {
  return [
    // Menu principal
    {
      id: 'home-main',
      name: 'Accueil',
      path: '/',
      icon: 'Home',
      category: 'main',
      is_visible: true,
      is_active: true,
      requires_admin: false,
      position: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'explore-main',
      name: 'Explorer',
      path: '/explore',
      icon: 'Search',
      category: 'explore',
      is_visible: true,
      is_active: true,
      requires_admin: false,
      position: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'personal-main',
      name: 'Ma Garde-robe',
      path: '/wardrobe',
      icon: 'ShirtIcon',
      category: 'personal',
      is_visible: true,
      is_active: true,
      requires_admin: false,
      position: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'outfits-personal',
      name: 'Mes Tenues',
      path: '/outfits',
      icon: 'Layers',
      category: 'personal',
      is_visible: true,
      is_active: true,
      requires_admin: false,
      position: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'suitcases-personal',
      name: 'Mes Valises',
      path: '/suitcases',
      icon: 'Briefcase',
      category: 'personal',
      is_visible: true,
      is_active: true,
      requires_admin: false,
      position: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'social-main',
      name: 'Communauté',
      path: '/community',
      icon: 'Users',
      category: 'social',
      is_visible: true,
      is_active: true,
      requires_admin: false,
      position: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'messages-social',
      name: 'Messages',
      path: '/messages',
      icon: 'MessageSquare',
      category: 'social',
      is_visible: true,
      is_active: true,
      requires_admin: false,
      position: 7,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'friends-social',
      name: 'Amis',
      path: '/friends',
      icon: 'UserPlus',
      category: 'social',
      is_visible: true,
      is_active: true,
      requires_admin: false,
      position: 8,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'profile-main',
      name: 'Profil',
      path: '/profile',
      icon: 'User',
      category: 'profile',
      is_visible: true,
      is_active: true,
      requires_admin: false,
      position: 9,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'settings-profile',
      name: 'Paramètres',
      path: '/settings',
      icon: 'Settings',
      category: 'profile',
      is_visible: true,
      is_active: true,
      requires_admin: false,
      position: 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    // Admin menu
    {
      id: 'admin-main',
      name: 'Administration',
      path: '/admin',
      icon: 'Shield',
      category: 'admin',
      is_visible: true,
      is_active: true,
      requires_admin: true,
      position: 11,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'admin-dashboard',
      name: 'Tableau de bord',
      path: '/admin/dashboard',
      icon: 'LayoutDashboard',
      category: 'admin',
      is_visible: true,
      is_active: true,
      requires_admin: true,
      parent_id: 'admin-main',
      position: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'admin-users',
      name: 'Utilisateurs',
      path: '/admin/users',
      icon: 'Users',
      category: 'admin',
      is_visible: true,
      is_active: true,
      requires_admin: true,
      parent_id: 'admin-main',
      position: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'admin-modules',
      name: 'Modules',
      path: '/admin/modules',
      icon: 'Layers',
      category: 'admin',
      is_visible: true,
      is_active: true,
      requires_admin: true,
      parent_id: 'admin-main',
      position: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};
