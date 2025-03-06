/**
 * Définitions des modules de l'application
 * Ce fichier centralise les informations sur les modules disponibles
 */

export interface ModuleDefinition {
  code: string;
  name: string;
  description?: string;
  isCore?: boolean;
  dependencies?: {
    code: string;
    required: boolean;
  }[];
  features?: {
    code: string;
    name: string;
    description?: string;
    enabledByDefault?: boolean;
  }[];
}

import OutfitsModule from '@/modules/outfits';

export const APP_MODULES: Record<string, ModuleDefinition> = {
  // Module d'administration - toujours actif
  ADMIN: {
    code: 'admin',
    name: 'Administration',
    description: 'Module d\'administration principal',
    isCore: true,
    features: [
      {
        code: 'modules_management',
        name: 'Gestion des modules',
        description: 'Permet de gérer les modules de l\'application',
        enabledByDefault: true
      },
      {
        code: 'users_management',
        name: 'Gestion des utilisateurs',
        description: 'Permet de gérer les utilisateurs de l\'application',
        enabledByDefault: true
      }
    ]
  },
  
  // Module de profil utilisateur
  PROFILE: {
    code: 'profile',
    name: 'Profil utilisateur',
    description: 'Gestion du profil utilisateur',
    isCore: true,
    features: [
      {
        code: 'edit_profile',
        name: 'Édition du profil',
        enabledByDefault: true
      },
      {
        code: 'avatar_upload',
        name: 'Téléchargement d\'avatar',
        enabledByDefault: true
      }
    ]
  },
  
  // Module de notifications
  NOTIFICATIONS: {
    code: 'notifications',
    name: 'Notifications',
    description: 'Système de notifications',
    dependencies: [
      {
        code: 'profile',
        required: true
      }
    ],
    features: [
      {
        code: 'push_notifications',
        name: 'Notifications push',
        enabledByDefault: false
      },
      {
        code: 'email_notifications',
        name: 'Notifications par email',
        enabledByDefault: true
      }
    ]
  },
  
  // Module de suggestions
  SUGGESTIONS: {
    code: 'suggestions',
    name: 'Suggestions',
    description: 'Système de suggestions personnalisées',
    dependencies: [
      {
        code: 'profile',
        required: true
      }
    ]
  },
  
  // Module d'intelligence artificielle
  AI: {
    code: 'ai',
    name: 'Intelligence artificielle',
    description: 'Fonctionnalités d\'IA et recommandations',
    dependencies: [
      {
        code: 'profile',
        required: true
      },
      {
        code: 'suggestions',
        required: false
      }
    ],
    features: [
      {
        code: 'outfit_recommendations',
        name: 'Recommandations de tenues',
        enabledByDefault: true
      },
      {
        code: 'style_analysis',
        name: 'Analyse de style',
        enabledByDefault: true
      }
    ]
  },
  
  // Ajouter le module de tenues
  OUTFITS: OutfitsModule,
};

// Exporter les codes de module comme constantes pour faciliter l'utilisation
export const MODULE_CODES = Object.fromEntries(
  Object.entries(APP_MODULES).map(([key, module]) => [key, module.code])
);

// Fonction utilitaire pour obtenir une définition de module par son code
export function getModuleDefinitionByCode(code: string): ModuleDefinition | undefined {
  return Object.values(APP_MODULES).find(module => module.code === code);
}

// Fonction utilitaire pour vérifier si un module dépend d'un autre
export function moduleDepends(moduleCode: string, dependencyCode: string): boolean {
  const module = getModuleDefinitionByCode(moduleCode);
  if (!module || !module.dependencies) return false;
  
  return module.dependencies.some(dep => dep.code === dependencyCode);
}

// Fonction utilitaire pour obtenir toutes les dépendances d'un module
export function getModuleDependencies(moduleCode: string): string[] {
  const module = getModuleDefinitionByCode(moduleCode);
  if (!module || !module.dependencies) return [];
  
  return module.dependencies.map(dep => dep.code);
}

// Fonction utilitaire pour obtenir toutes les dépendances requises d'un module
export function getRequiredModuleDependencies(moduleCode: string): string[] {
  const module = getModuleDefinitionByCode(moduleCode);
  if (!module || !module.dependencies) return [];
  
  return module.dependencies
    .filter(dep => dep.required)
    .map(dep => dep.code);
}
