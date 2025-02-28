
import { toast as toastFunction } from "@/hooks/use-toast";
import { OutfitSuggestionError } from "../types/suggestionTypes";

export const manageErrorResponse = (toast: typeof toastFunction, error: Error | unknown, toastId?: string): OutfitSuggestionError => {
  console.error("Error in outfit suggestion:", error);
  
  let errorMessage = "Une erreur est survenue lors de la génération de votre suggestion de tenue.";
  let errorCode = "UNKNOWN_ERROR";
  
  // Handle specific error types
  if (error instanceof Error) {
    errorMessage = error.message;
    
    if (error.message.includes("User not authenticated")) {
      errorCode = "AUTH_ERROR";
      errorMessage = "Veuillez vous connecter pour utiliser cette fonctionnalité.";
    } 
    else if (error.message.includes("No clothes available")) {
      errorCode = "NO_CLOTHES";
      errorMessage = "Vous n'avez pas encore ajouté de vêtements à votre garde-robe.";
    }
    else if (error.message.includes("API rate limit")) {
      errorCode = "RATE_LIMIT";
      errorMessage = "Limite de requêtes atteinte. Veuillez réessayer plus tard.";
    }
    else if (error.message.includes("Network")) {
      errorCode = "NETWORK_ERROR";
      errorMessage = "Problème de connexion réseau. Vérifiez votre connexion internet.";
    }
  }
  
  // Update or create a new error toast
  if (toastId) {
    toast({
      id: toastId,
      variant: "destructive",
      title: "Erreur",
      description: errorMessage,
    });
  } else {
    toast({
      variant: "destructive",
      title: "Erreur",
      description: errorMessage,
    });
  }
  
  return {
    error: new Error(errorMessage),
    errorCode,
    message: errorMessage
  };
};

// Ajout des fonctions manquantes utilisées dans aiService.ts
export const exponentialDelay = async (attempt: number): Promise<void> => {
  const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
  return new Promise(resolve => setTimeout(resolve, delay));
};

export const generateFallbackSuggestion = async (
  clothes: any[],
  temperature: number,
  description: string,
  categorizedClothes: any
) => {
  try {
    // Sélection aléatoire de vêtements par catégorie
    const getRandomItem = (items: any[]) => {
      if (!items || items.length === 0) return null;
      return items[Math.floor(Math.random() * items.length)];
    };
    
    const top = getRandomItem(categorizedClothes.tops);
    const bottom = getRandomItem(categorizedClothes.bottoms);
    const shoes = getRandomItem(categorizedClothes.shoes);
    
    if (!top || !bottom || !shoes) {
      throw new Error("Impossible de générer une tenue de secours avec les vêtements disponibles");
    }
    
    return {
      suggestion: {
        top,
        bottom,
        shoes,
        explanation: "Voici une tenue générée à partir de votre garde-robe.",
        temperature,
        description
      },
      error: null
    };
  } catch (error) {
    return {
      suggestion: null,
      error: error instanceof Error ? error : new Error("Échec de génération de tenue de secours")
    };
  }
};
