
import { useQuery } from '@tanstack/react-query';
import { getMenuService } from '@/services/menu/infrastructure/menuServiceProvider';
import { MenuItem, MenuItemCategory } from '@/services/menu/types';
import { useToast } from '@/hooks/use-toast';

// Function to get all menu items
export const useAllMenuItems = () => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['menuItems', 'all'],
    queryFn: async () => {
      try {
        console.log('Fetching all menu items');
        const menuService = getMenuService();
        const items = await menuService.getAllMenuItems();
        console.log(`Retrieved ${items.length} menu items`);
        
        // Si aucun élément n'est retourné, essayons d'afficher des éléments par défaut
        if (!items || items.length === 0) {
          console.warn('No menu items returned from database, using default items');
          return getDefaultMenuItems();
        }
        
        return items;
      } catch (error) {
        console.error('Erreur lors de la récupération de tous les éléments de menu:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les éléments de menu",
          variant: "destructive"
        });
        // En cas d'erreur, retourner des éléments par défaut
        return getDefaultMenuItems();
      }
    },
    staleTime: 60000, // 1 minute
    retry: 3,
    retryDelay: attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)
  });
};

// Function to get menu items by category
export const useMenuItemsByCategory = (category: MenuItemCategory) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['menuItems', 'category', category],
    queryFn: async () => {
      try {
        console.log(`Fetching menu items for category: ${category}`);
        const menuService = getMenuService();
        const items = await menuService.getMenuItemsByCategory(category);
        console.log(`Retrieved ${items.length} items for category ${category}`);
        
        // Si aucun élément n'est retourné pour la catégorie, utiliser des éléments par défaut
        if (!items || items.length === 0) {
          console.warn(`No menu items for category ${category}, using defaults`);
          const defaultItems = getDefaultMenuItems();
          return defaultItems.filter(item => item.category === category);
        }
        
        return items;
      } catch (error) {
        console.error(`Erreur lors de la récupération des éléments de menu pour la catégorie ${category}:`, error);
        toast({
          title: "Erreur de chargement",
          description: `Impossible de charger les éléments de la catégorie ${category}`,
          variant: "destructive"
        });
        // En cas d'erreur, filtrer les éléments par défaut pour cette catégorie
        const defaultItems = getDefaultMenuItems();
        return defaultItems.filter(item => item.category === category);
      }
    },
    enabled: !!category,
    staleTime: 60000, // 1 minute
    retry: 3,
    retryDelay: attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)
  });
};

// Function to get menu items by module
export const useMenuItemsByModule = (moduleCode: string, isAdmin: boolean = false) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['menuItems', 'module', moduleCode, isAdmin],
    queryFn: async () => {
      try {
        console.log(`Fetching menu items for module: ${moduleCode}, isAdmin: ${isAdmin}`);
        const menuService = getMenuService();
        const items = await menuService.getMenuItemsByModule(moduleCode, isAdmin);
        console.log(`Retrieved ${items.length} items for module ${moduleCode}`);
        return items;
      } catch (error) {
        console.error(`Erreur lors de la récupération des éléments de menu pour le module ${moduleCode}:`, error);
        toast({
          title: "Erreur de chargement",
          description: `Impossible de charger les éléments du module ${moduleCode}`,
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!moduleCode,
    staleTime: 60000, // 1 minute
    retry: 3,
    retryDelay: attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)
  });
};

// Function to get menu items by parent
export const useMenuItemsByParent = (parentId: string | null) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['menuItems', 'parent', parentId],
    queryFn: async () => {
      try {
        console.log(`Fetching menu items with parent_id: ${parentId}`);
        const menuService = getMenuService();
        const items = await menuService.getMenuItemsByParent(parentId);
        console.log(`Retrieved ${items.length} child items for parent ${parentId}`);
        return items;
      } catch (error) {
        console.error(`Erreur lors de la récupération des éléments de menu pour le parent ${parentId}:`, error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les sous-éléments de menu",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: parentId !== undefined,
    staleTime: 60000, // 1 minute
    retry: 3,
    retryDelay: attempt => Math.min(attempt > 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)
  });
};

// Fonction pour générer des éléments de menu par défaut
// Ces éléments seront utilisés si aucun n'est trouvé en base de données
const getDefaultMenuItems = (): MenuItem[] => {
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
