
/**
 * Registre central de tous les modules de l'application
 * Permet de facilement localiser les composants et fonctionnalités
 */

export interface ModuleDefinition {
  code: string;
  name: string;
  description: string;
  isCore: boolean;
  isAdmin: boolean;
  dependencies: string[];
}

// Définition de tous les modules de l'application
export const MODULES: Record<string, ModuleDefinition> = {
  // Modules core
  core: {
    code: 'core',
    name: 'Core',
    description: 'Fonctionnalités de base et services partagés',
    isCore: true,
    isAdmin: false,
    dependencies: []
  },
  auth: {
    code: 'auth',
    name: 'Authentication',
    description: 'Authentification et gestion des sessions',
    isCore: true,
    isAdmin: false,
    dependencies: ['core']
  },
  navigation: {
    code: 'navigation',
    name: 'Navigation',
    description: 'Composants de navigation et menus',
    isCore: true,
    isAdmin: false,
    dependencies: ['core']
  },
  
  // Modules fonctionnels
  admin: {
    code: 'admin',
    name: 'Administration',
    description: 'Panneau d\'administration et gestion du système',
    isCore: false,
    isAdmin: true,
    dependencies: ['core', 'auth', 'navigation']
  },
  profile: {
    code: 'profile',
    name: 'Profile',
    description: 'Profil utilisateur et paramètres personnels',
    isCore: false,
    isAdmin: false,
    dependencies: ['core', 'auth']
  },
  clothes: {
    code: 'clothes',
    name: 'Vêtements',
    description: 'Gestion des vêtements et de la garde-robe',
    isCore: false,
    isAdmin: false,
    dependencies: ['core']
  },
  outfits: {
    code: 'outfits',
    name: 'Tenues',
    description: 'Création et gestion des tenues',
    isCore: false,
    isAdmin: false,
    dependencies: ['core', 'clothes']
  },
  suitcases: {
    code: 'suitcases',
    name: 'Valises',
    description: 'Création et gestion des valises de voyage',
    isCore: false,
    isAdmin: false,
    dependencies: ['core', 'clothes']
  },
  shop: {
    code: 'shop',
    name: 'Boutique',
    description: 'Boutique en ligne et commerce',
    isCore: false,
    isAdmin: false,
    dependencies: ['core', 'clothes']
  },
  cart: {
    code: 'cart',
    name: 'Panier',
    description: 'Panier d\'achat et processus de commande',
    isCore: false,
    isAdmin: false,
    dependencies: ['core', 'shop']
  },
  challenges: {
    code: 'challenges',
    name: 'Défis',
    description: 'Défis et compétitions',
    isCore: false,
    isAdmin: false,
    dependencies: ['core', 'clothes', 'outfits']
  },
  friends: {
    code: 'friends',
    name: 'Amis',
    description: 'Gestion des amis et contacts',
    isCore: false,
    isAdmin: false,
    dependencies: ['core', 'auth']
  },
  groups: {
    code: 'groups',
    name: 'Groupes',
    description: 'Groupes et communautés',
    isCore: false,
    isAdmin: false,
    dependencies: ['core', 'friends']
  },
  messages: {
    code: 'messages',
    name: 'Messages',
    description: 'Messagerie et chat',
    isCore: false,
    isAdmin: false,
    dependencies: ['core', 'auth']
  },
  posts: {
    code: 'posts',
    name: 'Publications',
    description: 'Publications et contenu social',
    isCore: false,
    isAdmin: false,
    dependencies: ['core', 'auth']
  },
  notifications: {
    code: 'notifications',
    name: 'Notifications',
    description: 'Système de notifications',
    isCore: false,
    isAdmin: false,
    dependencies: ['core']
  },
  search: {
    code: 'search',
    name: 'Recherche',
    description: 'Fonctionnalités de recherche',
    isCore: false,
    isAdmin: false,
    dependencies: ['core']
  },
  stores: {
    code: 'stores',
    name: 'Magasins',
    description: 'Carte des magasins et points de vente',
    isCore: false,
    isAdmin: false,
    dependencies: ['core']
  },
  landing: {
    code: 'landing',
    name: 'Landing',
    description: 'Pages d\'accueil et d\'onboarding',
    isCore: false,
    isAdmin: false,
    dependencies: ['core', 'auth']
  },
  home: {
    code: 'home',
    name: 'Home',
    description: 'Page d\'accueil principale',
    isCore: false,
    isAdmin: false,
    dependencies: ['core', 'auth', 'clothes', 'outfits']
  },
  hashtags: {
    code: 'hashtags',
    name: 'Hashtags',
    description: 'Gestion des hashtags et tags',
    isCore: false,
    isAdmin: false,
    dependencies: ['core']
  },
  virtual_dressing: {
    code: 'virtual_dressing',
    name: 'Dressing Virtuel',
    description: 'Essayage virtuel et visualisation',
    isCore: false,
    isAdmin: false,
    dependencies: ['core', 'clothes']
  },
  settings: {
    code: 'settings',
    name: 'Paramètres',
    description: 'Paramètres et configuration',
    isCore: false,
    isAdmin: true,
    dependencies: ['core', 'admin']
  },
  users: {
    code: 'users',
    name: 'Utilisateurs',
    description: 'Gestion des utilisateurs',
    isCore: false,
    isAdmin: true,
    dependencies: ['core', 'auth', 'admin']
  }
};

// Liste des modules essentiels qui doivent toujours être disponibles
export const CORE_MODULES = Object.values(MODULES)
  .filter(module => module.isCore)
  .map(module => module.code);

// Liste des modules administratifs
export const ADMIN_MODULES = Object.values(MODULES)
  .filter(module => module.isAdmin)
  .map(module => module.code);

// Fonction pour obtenir la définition d'un module par son code
export const getModuleDefinition = (moduleCode: string): ModuleDefinition | undefined => {
  return MODULES[moduleCode];
};

// Fonction pour vérifier si un module est un module core
export const isModuleCore = (moduleCode: string): boolean => {
  const module = MODULES[moduleCode];
  return module ? module.isCore : false;
};

// Fonction pour vérifier si un module est un module administratif
export const isModuleAdmin = (moduleCode: string): boolean => {
  const module = MODULES[moduleCode];
  return module ? module.isAdmin : false;
};

// Fonction pour obtenir les dépendances d'un module
export const getModuleDependencies = (moduleCode: string): string[] => {
  const module = MODULES[moduleCode];
  return module ? module.dependencies : [];
};
