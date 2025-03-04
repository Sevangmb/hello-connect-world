
import { toast as toastFunction } from "@/hooks/use-toast";
import { OutfitSuggestionState, OutfitSuggestionResult } from "../types/suggestionTypes";
import { fetchUserClothes } from "./api";
import { generateAISuggestion } from "../aiService";
import { ClothingItem } from "../types/aiTypes";
import { createSuggestionError, determineErrorCode } from "./errorHandling";
import { categorizeClothingItems } from "./clothingCategorization";
import { getCurrentUser } from "./authManager";

export interface WeatherConditions {
  temperature: number;
  description: string;
  condition?: 'clear' | 'rain' | 'clouds' | 'snow' | 'extreme' | 'other';
  windSpeed?: number;
  humidity?: number;
}

export async function handleSuggestionProcess(
  toast: typeof toastFunction,
  weatherConditions: WeatherConditions,
  toastId: string,
  dismissToast: () => void
): Promise<OutfitSuggestionResult> {
  try {
    // Étape 1: Vérifier l'authentification
    const user = await getCurrentUser(toast);
    if (!user) {
      dismissToast();
      return {
        suggestion: null,
        error: new Error("User not authenticated"),
        errorCode: "AUTH_ERROR"
      };
    }

    // Étape 2: Mettre à jour le toast pour indiquer le progrès
    toast({
      id: toastId,
      title: "Analyse de votre garde-robe",
      description: "Nous récupérons vos vêtements..."
    });

    // Étape 3: Récupérer les vêtements de l'utilisateur
    const clothes = await fetchUserClothes(user.id);
    if (!clothes || clothes.length === 0) {
      dismissToast();
      return {
        suggestion: null,
        error: new Error("No clothes available"),
        errorCode: "NO_CLOTHES_ERROR"
      };
    }

    // Étape 4: Mettre à jour le toast pour indiquer l'analyse
    toast({
      id: toastId,
      title: "Analyse des conditions météo",
      description: `Nous analysons la température (${weatherConditions.temperature}°C) et les conditions (${weatherConditions.condition || 'standard'})...`
    });

    // Étape 5: Catégoriser les vêtements
    const categorizedClothes = categorizeClothingItems(clothes);

    // Étape 6: Mettre à jour le toast pour indiquer la génération
    toast({
      id: toastId,
      title: "Création de la tenue",
      description: "Notre IA génère une tenue adaptée à votre style et à la météo..."
    });

    // Étape 7: Générer la suggestion de tenue avec conditions météo enrichies
    const result = await generateAISuggestion(
      clothes,
      weatherConditions.temperature,
      weatherConditions.description,
      true, // Use Mistral by default
      3, // Max retries
      weatherConditions.condition,
      weatherConditions.windSpeed,
      weatherConditions.humidity
    );

    if (result.error) {
      throw result.error;
    }

    // Étape 8: Fermer le toast et retourner le résultat
    dismissToast();

    // Ajout de l'id manquant pour la compatibilité
    const suggestion = result.suggestion ? {
      ...result.suggestion,
      id: `suggestion-${Date.now()}`
    } : null;
    
    return {
      suggestion,
      error: null
    };
  } catch (error) {
    dismissToast();
    
    // Gestion standardisée des erreurs
    console.error("Error in suggestion process:", error);
  
    const errorObject = error instanceof Error ? error : new Error("Erreur inconnue");
    const errorCode = determineErrorCode(errorObject);
    
    // Optionally show an error toast
    toast({
      variant: "destructive",
      title: "Erreur",
      description: errorObject.message || "Une erreur s'est produite lors de la génération de la suggestion",
    });
    
    return {
      error: errorObject,
      errorCode,
      suggestion: null
    };
  }
}
