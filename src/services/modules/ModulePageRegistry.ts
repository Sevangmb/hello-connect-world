
import { AppModule } from "@/hooks/modules/types";
import { useModuleRegistry } from "@/hooks/modules/useModuleRegistry";
import { ReactNode } from "react";

// Structure de données pour associer les pages aux modules
export interface ModulePageDefinition {
  path: string;
  name: string;
  description: string;
  icon: string;
  moduleCode: string;
  category: 'main' | 'admin' | 'utility' | 'marketplace' | 'social';
  component: React.ComponentType<any>;
  showInMenu: boolean;
  menuOrder?: number;
  requireAuth?: boolean;
}

// Définition du mapping des pages aux modules
const modulePages: ModulePageDefinition[] = [
  // Module notifications
  {
    path: '/notifications',
    name: 'Notifications',
    description: 'Gérer vos notifications',
    icon: 'Bell',
    moduleCode: 'notifications',
    category: 'main',
    component: () => import('@/pages/Notifications').then(m => m.default),
    showInMenu: true,
    menuOrder: 50,
    requireAuth: true
  },
  
  // Module social
  {
    path: '/feed',
    name: 'Fil d\'actualité',
    description: 'Voir les dernières publications',
    icon: 'Activity',
    moduleCode: 'social_feed',
    category: 'social',
    component: () => import('@/pages/Feed').then(m => m.default),
    showInMenu: true,
    menuOrder: 10,
    requireAuth: true
  },
  {
    path: '/friends',
    name: 'Amis',
    description: 'Gérer vos amis',
    icon: 'Users',
    moduleCode: 'friends',
    category: 'social',
    component: () => import('@/pages/Friends').then(m => m.default),
    showInMenu: true,
    menuOrder: 20,
    requireAuth: true
  },
  {
    path: '/messages',
    name: 'Messages',
    description: 'Consulter vos messages',
    icon: 'MessageSquare',
    moduleCode: 'messaging',
    category: 'social',
    component: () => import('@/pages/Messages').then(m => m.default),
    showInMenu: true,
    menuOrder: 30,
    requireAuth: true
  },
  
  // Module marketplace
  {
    path: '/boutiques',
    name: 'Boutiques',
    description: 'Découvrir des boutiques',
    icon: 'Store',
    moduleCode: 'marketplace',
    category: 'marketplace',
    component: () => import('@/pages/Boutiques').then(m => m.default),
    showInMenu: true,
    menuOrder: 10,
    requireAuth: true
  },
  {
    path: '/shops',
    name: 'Magasins',
    description: 'Explorer les magasins',
    icon: 'ShoppingBag',
    moduleCode: 'marketplace',
    category: 'marketplace',
    component: () => import('@/pages/Shops').then(m => m.default),
    showInMenu: false,
    requireAuth: true
  },
  {
    path: '/cart',
    name: 'Panier',
    description: 'Votre panier d\'achats',
    icon: 'ShoppingCart',
    moduleCode: 'shopping',
    category: 'marketplace',
    component: () => import('@/pages/Cart').then(m => m.default),
    showInMenu: true,
    menuOrder: 20,
    requireAuth: true
  },
  
  // Module wardrobe (garde-robe)
  {
    path: '/clothes',
    name: 'Vêtements',
    description: 'Gérer vos vêtements',
    icon: 'Shirt',
    moduleCode: 'wardrobe',
    category: 'main',
    component: () => import('@/pages/Clothes').then(m => m.default),
    showInMenu: true,
    menuOrder: 10,
    requireAuth: true
  },
  {
    path: '/outfits',
    name: 'Tenues',
    description: 'Créer et gérer vos tenues',
    icon: 'Palette',
    moduleCode: 'outfits',
    category: 'main',
    component: () => import('@/pages/Outfits').then(m => m.default),
    showInMenu: true,
    menuOrder: 20,
    requireAuth: true
  },
  
  // Module challenges
  {
    path: '/challenges',
    name: 'Défis',
    description: 'Participer à des défis de mode',
    icon: 'Award',
    moduleCode: 'challenges',
    category: 'social',
    component: () => import('@/pages/Challenges').then(m => m.default),
    showInMenu: true,
    menuOrder: 40,
    requireAuth: true
  },
  
  // Module calendar
  {
    path: '/calendar',
    name: 'Calendrier',
    description: 'Planifier vos tenues',
    icon: 'Calendar',
    moduleCode: 'calendar',
    category: 'utility',
    component: () => import('@/pages/Calendar').then(m => m.default),
    showInMenu: true,
    menuOrder: 30,
    requireAuth: true
  },
  
  // Module explore
  {
    path: '/explore',
    name: 'Explorer',
    description: 'Découvrir de nouvelles tendances',
    icon: 'Globe',
    moduleCode: 'explore',
    category: 'main',
    component: () => import('@/pages/Explore').then(m => m.default),
    showInMenu: true,
    menuOrder: 5,
    requireAuth: true
  },
  
  // Module profile
  {
    path: '/profile',
    name: 'Profil',
    description: 'Gérer votre profil',
    icon: 'User',
    moduleCode: 'profile',
    category: 'main',
    component: () => import('@/pages/Profile').then(m => m.default),
    showInMenu: false,
    requireAuth: true
  },
  {
    path: '/profile/settings',
    name: 'Paramètres',
    description: 'Modifier vos paramètres',
    icon: 'Settings',
    moduleCode: 'profile',
    category: 'utility',
    component: () => import('@/pages/Settings').then(m => m.default),
    showInMenu: false,
    requireAuth: true
  },
  
  // Module help
  {
    path: '/help',
    name: 'Aide',
    description: 'Obtenir de l\'aide',
    icon: 'HelpCircle',
    moduleCode: 'help',
    category: 'utility',
    component: () => import('@/pages/HelpAndSupport').then(m => m.default),
    showInMenu: false,
    requireAuth: false
  }
];

/**
 * Service pour gérer le registre des pages associées aux modules
 */
export class ModulePageRegistry {
  /**
   * Récupère toutes les pages enregistrées
   */
  static getAllPages(): ModulePageDefinition[] {
    return [...modulePages];
  }
  
  /**
   * Récupère les pages d'un module spécifique
   */
  static getModulePages(moduleCode: string): ModulePageDefinition[] {
    return modulePages.filter(page => page.moduleCode === moduleCode);
  }
  
  /**
   * Récupère les pages qui doivent apparaître dans le menu
   */
  static getMenuPages(): ModulePageDefinition[] {
    return modulePages.filter(page => page.showInMenu)
      .sort((a, b) => (a.menuOrder || 100) - (b.menuOrder || 100));
  }
  
  /**
   * Récupère les pages par catégorie
   */
  static getPagesByCategory(category: string): ModulePageDefinition[] {
    return modulePages.filter(page => page.category === category)
      .sort((a, b) => (a.menuOrder || 100) - (b.menuOrder || 100));
  }
  
  /**
   * Vérifie si une page est accessible (module actif)
   */
  static async isPageAccessible(path: string): Promise<boolean> {
    const page = modulePages.find(p => p.path === path);
    if (!page) return false;
    
    // Si c'est un module admin, la vérification est faite ailleurs
    if (page.moduleCode.startsWith('admin_')) return true;
    
    // Utiliser useModuleRegistry pour vérifier si le module est actif
    const { isModuleActive } = useModuleRegistry();
    return await isModuleActive(page.moduleCode);
  }
}

/**
 * Fonction pour obtenir l'icône d'une page à partir de lucide-react
 */
export const getPageIcon = (iconName: string): React.ElementType | null => {
  try {
    // Import dynamique de l'icône depuis lucide-react
    return require(`lucide-react`)[iconName];
  } catch (error) {
    console.error(`Icône '${iconName}' non trouvée dans lucide-react:`, error);
    return null;
  }
};
