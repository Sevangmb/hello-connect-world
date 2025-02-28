
import { OutfitSuggestionError } from "../types/suggestionTypes";
import { ClothingItem } from "../types/aiTypes";
import { toast as toastFunction } from "@/hooks/use-toast";

// Définition des codes d'erreur spécifiques
export const ErrorCodes = {
  NETWORK_ERROR: "network_error",
  API_ERROR: "api_error",
  VALIDATION_ERROR: "validation_error",
  WEATHER_DATA_MISSING: "weather_data_missing",
  USER_DATA_MISSING: "user_data_missing",
  LOCATION_MISSING: "location_missing",
  CLOTHES_MISSING: "clothes_missing",
  SERVER_ERROR: "server_error",
  UNKNOWN_ERROR: "unknown_error"
};

/**
 * Crée une structure d'erreur standardisée pour les suggestions de tenues
 */
export function createSuggestionError(
  error: Error,
  errorCode: string = ErrorCodes.UNKNOWN_ERROR,
  message?: string
): OutfitSuggestionError {
  return {
    error,
    errorCode,
    message: message || error.message,
    suggestion: null
  };
}

/**
 * Détermine le code d'erreur approprié basé sur l'erreur
 */
export function determineErrorCode(error: Error): string {
  if (error.message.includes("network") || error.message.includes("connexion")) {
    return ErrorCodes.NETWORK_ERROR;
  }
  
  if (error.message.includes("weather") || error.message.includes("météo")) {
    return ErrorCodes.WEATHER_DATA_MISSING;
  }
  
  if (error.message.includes("location") || error.message.includes("localisation")) {
    return ErrorCodes.LOCATION_MISSING;
  }
  
  if (error.message.includes("server") || error.message.includes("serveur")) {
    return ErrorCodes.SERVER_ERROR;
  }
  
  return ErrorCodes.UNKNOWN_ERROR;
}

/**
 * Délai exponentiel pour les tentatives répétées
 */
export async function exponentialDelay(attempt: number): Promise<void> {
  const delay = Math.min(100 * Math.pow(2, attempt), 10000); // Maximum 10 secondes
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Génère une suggestion de secours en cas d'échec de l'IA
 */
export async function generateFallbackSuggestion(
  clothes: ClothingItem[],
  temperature: number,
  description: string,
  fallbackCategories: {
    tops: ClothingItem[];
    bottoms: ClothingItem[];
    shoes: ClothingItem[];
  }
) {
  try {
    // Sélectionner aléatoirement un vêtement dans chaque catégorie
    const randomTop = fallbackCategories.tops.length > 0 
      ? fallbackCategories.tops[Math.floor(Math.random() * fallbackCategories.tops.length)]
      : null;
      
    const randomBottom = fallbackCategories.bottoms.length > 0 
      ? fallbackCategories.bottoms[Math.floor(Math.random() * fallbackCategories.bottoms.length)]
      : null;
      
    const randomShoes = fallbackCategories.shoes.length > 0 
      ? fallbackCategories.shoes[Math.floor(Math.random() * fallbackCategories.shoes.length)]
      : null;
    
    // Vérifier que tous les éléments nécessaires sont disponibles
    if (!randomTop || !randomBottom || !randomShoes) {
      throw new Error("Impossible de créer une tenue complète avec vos vêtements disponibles");
    }
    
    return {
      suggestion: {
        top: randomTop,
        bottom: randomBottom,
        shoes: randomShoes,
        explanation: "Voici une sélection aléatoire de vêtements pour aujourd'hui.",
        temperature,
        description
      },
      error: null
    };
  } catch (error) {
    console.error("Erreur lors de la génération de secours:", error);
    return {
      suggestion: null,
      error: error instanceof Error ? error : new Error("Échec de la génération de secours")
    };
  }
}

/**
 * Gère et standardise les réponses d'erreur
 */
export function manageErrorResponse(toast: typeof toastFunction, error: unknown) {
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
