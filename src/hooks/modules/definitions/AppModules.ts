
import { defineModule } from "../services/ModuleRegistry";

// Définition du module Admin (core)
export const AdminModule = defineModule({
  code: 'admin',
  name: 'Administration',
  description: 'Module d\'administration de l\'application',
  dependencies: [],
  isCore: true,
  features: ['settings', 'users', 'modules']
});

// Modules Utilisateur
export const ProfileModule = defineModule({
  code: 'profile',
  name: 'Profil Utilisateur',
  description: 'Gestion du profil utilisateur',
  dependencies: [],
  features: ['settings', 'avatar', 'preferences']
});

export const NotificationsModule = defineModule({
  code: 'notifications',
  name: 'Notifications',
  description: 'Système de notifications',
  dependencies: ['profile'],
  features: ['push', 'email', 'settings']
});

// Modules Social
export const SuggestionsModule = defineModule({
  code: 'suggestions',
  name: 'Suggestions',
  description: 'Suggestions de contenu basées sur les préférences',
  dependencies: ['profile'],
  features: []
});

export const AIModule = defineModule({
  code: 'ai',
  name: 'Intelligence Artificielle',
  description: 'Recommandations et assistance par IA',
  dependencies: [],
  features: ['recommendations', 'assistant']
});

// Modules Exploration
export const SearchModule = defineModule({
  code: 'search',
  name: 'Recherche',
  description: 'Fonctionnalité de recherche',
  dependencies: [],
  features: ['advanced_filters', 'saved_searches']
});

export const TrendingModule = defineModule({
  code: 'trending',
  name: 'Tendances',
  description: 'Contenu populaire et tendances',
  dependencies: [],
  features: ['daily', 'weekly', 'personalized']
});

export const HashtagsModule = defineModule({
  code: 'hashtags',
  name: 'Hashtags',
  description: 'Exploration par hashtags',
  dependencies: ['search'],
  features: ['trending_tags', 'follow_tags']
});

export const MarketplaceModule = defineModule({
  code: 'marketplace',
  name: 'Marketplace',
  description: 'Place de marché pour les vêtements',
  dependencies: [],
  features: ['buy', 'sell', 'exchange']
});

// Autres modules
export const ChallengesModule = defineModule({
  code: 'challenges',
  name: 'Défis',
  description: 'Challenges et compétitions',
  dependencies: ['profile'],
  features: ['create', 'participate', 'vote']
});

// Exporter la liste complète des modules pour référence
export const AppModules = [
  AdminModule,
  ProfileModule,
  NotificationsModule,
  SuggestionsModule,
  AIModule,
  SearchModule,
  TrendingModule,
  HashtagsModule,
  MarketplaceModule,
  ChallengesModule
];
