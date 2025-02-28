
import { Toast } from "@/hooks/use-toast";
import { OutfitSuggestionError } from "../types/suggestionTypes";

export const manageErrorResponse = (toast: Toast, error: Error | unknown, toastId?: string): OutfitSuggestionError => {
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
