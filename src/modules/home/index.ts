
/**
 * Module de la page d'accueil - Point d'entrée unique
 * Exporte tous les composants, hooks et utilitaires liés à la page d'accueil
 */

// Composants
export { AIRecommendations } from '@/components/home/AIRecommendations';
export { ActiveChallenge } from '@/components/home/ActiveChallenge';
export { PrelaunchRedirect } from '@/components/home/PrelaunchRedirect';
export { WeatherOutfitSuggestion } from '@/components/home/WeatherOutfitSuggestion';
export { WeatherSection } from '@/components/home/WeatherSection';
export { ClothingItemCard } from '@/components/home/components/ClothingItemCard';

// Hooks
export { useOutfitSuggestion } from '@/components/home/hooks/useOutfitSuggestion';
export { useWeatherData } from '@/components/home/hooks/useWeatherData';

// Types
export * from '@/components/home/types/weather';

// Services et utilitaires
export * from '@/components/home/hooks/outfit-suggestion';
