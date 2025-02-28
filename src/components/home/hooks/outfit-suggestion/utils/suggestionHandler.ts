
import { Toast } from "@/hooks/use-toast";
import { OutfitSuggestionState, OutfitSuggestionResult } from "../types/suggestionTypes";
import { fetchUserClothes } from "./api";
import { generateSuggestion } from "../aiService";
import { ClothingItem, OutfitSuggestion } from "../types/aiTypes";
import { manageErrorResponse } from "./errorHandling";
import { categorizeClothingItems } from "./clothingCategorization";
import { getCurrentUser } from "../../outfit-suggestion/utils/authManager";

export async function handleSuggestionProcess(
  toast: Toast,
  temperature: number,
  description: string,
  toastId: string,
  dismissToast: () => void
): Promise<OutfitSuggestionResult> {
  try {
    // Étape 1: Vérifier l'authentification
    const user = await getCurrentUser(toast);
    if (!user) {
      dismissToast();
      return {
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
        error: new Error("No clothes available"),
        errorCode: "NO_CLOTHES_ERROR"
      };
    }

    // Étape 4: Mettre à jour le toast pour indiquer l'analyse
    toast({
      id: toastId,
      title: "Analyse des conditions météo",
      description: "Nous analysons la température et les conditions..."
    });

    // Étape 5: Catégoriser les vêtements
    const categorizedClothes = categorizeClothingItems(clothes);

    // Étape 6: Mettre à jour le toast pour indiquer la génération
    toast({
      id: toastId,
      title: "Création de la tenue",
      description: "Notre IA génère une tenue adaptée à votre style et à la météo..."
    });

    // Étape 7: Générer la suggestion de tenue
    const suggestion = await generateSuggestion({
      userId: user.id,
      temperature,
      weatherDescription: description,
      clothes: categorizedClothes,
    });

    // Étape 8: Fermer le toast et retourner le résultat
    dismissToast();
    
    return {
      suggestion: {
        id: `suggestion-${Date.now()}`,
        temperature: temperature,
        description: description,
        explanation: suggestion.explanation,
        top: suggestion.top,
        bottom: suggestion.bottom,
        shoes: suggestion.shoes,
        // outerwear est un champ optionnel qui n'est pas dans le type OutfitSuggestion
        // Nous l'omettons pour éviter l'erreur TypeScript
      }
    };
  } catch (error) {
    dismissToast();
    return manageErrorResponse(toast, error);
  }
}
