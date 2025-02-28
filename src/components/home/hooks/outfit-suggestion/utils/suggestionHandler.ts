
import { showSuccessToast, showErrorToast, updateLoadingToast } from "./toastManager";
import { checkAuthentication } from "./authManager";
import { fetchExistingSuggestion, fetchUserClothes, createOutfitWithSuggestion } from "../api";
import { generateAISuggestion } from "../aiService";
import { OutfitSuggestion } from "../../../types/weather";
import { Toast } from "@/hooks/use-toast";
import { OutfitSuggestionResult } from "../types/suggestionTypes";
import { AlertCircle } from "lucide-react";

export async function handleSuggestionProcess(
  toast: Toast,
  temperature: number,
  description: string,
  toastId: string | null,
  dismiss: () => void
): Promise<OutfitSuggestionResult> {
  try {
    // Vérifier si l'utilisateur est connecté
    const userId = await checkAuthentication(toast);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Recherche de suggestions existantes
    updateLoadingToast(toast, toastId!, {
      title: "Analyse de vos vêtements",
      description: "Analyse de votre garde-robe pour la météo actuelle..."
    });

    const { existingSuggestion, suggestionError } = await fetchExistingSuggestion(userId, temperature, description);
    
    if (!suggestionError && existingSuggestion?.outfits) {
      console.log("Using existing suggestion:", existingSuggestion);
      
      dismiss();
      showSuccessToast(toast, {
        title: "Tenue trouvée",
        description: "Voici une tenue adaptée à la météo actuelle",
        duration: 5000
      });
      
      return {
        suggestion: {
          top: existingSuggestion.outfits.top,
          bottom: existingSuggestion.outfits.bottom,
          shoes: existingSuggestion.outfits.shoes,
          explanation: existingSuggestion.outfits.description || 
            `Pour ${temperature}°C avec un temps ${description}, cette tenue est appropriée.`,
          temperature,
          description
        } as OutfitSuggestion,
        error: null
      };
    }

    // Récupération des vêtements
    updateLoadingToast(toast, toastId!, {
      title: "Accès à votre garde-robe",
      description: "Récupération de vos vêtements..."
    });

    const { data: clothes, error: clothesError } = await fetchUserClothes(userId);

    if (clothesError) {
      console.error("Error fetching clothes:", clothesError);
      dismiss();
      showErrorToast(toast, {
        title: "Erreur",
        description: "Impossible d'accéder à votre garde-robe"
      });
      throw clothesError;
    }

    if (!clothes || clothes.length === 0) {
      dismiss();
      showErrorToast(toast, {
        title: "Aucun vêtement",
        description: "Vous devez d'abord ajouter des vêtements à votre garde-robe."
      });
      throw new Error("No clothes available");
    }

    // Génération de suggestion par l'IA
    updateLoadingToast(toast, toastId!, {
      title: "Création d'une tenue",
      description: "Notre IA génère une suggestion adaptée à la météo..."
    });

    const { suggestion, error: aiError } = await generateAISuggestion(
      clothes,
      temperature,
      description
    );

    if (aiError || !suggestion) {
      dismiss();
      showErrorToast(toast, {
        title: "Erreur de suggestion",
        description: "Impossible de générer une suggestion de tenue"
      });
      throw aiError || new Error("Failed to generate suggestion");
    }

    // Enregistrement de la suggestion
    updateLoadingToast(toast, toastId!, {
      title: "Finalisation",
      description: "Enregistrement de votre tenue personnalisée..."
    });

    const { outfit, error: saveError } = await createOutfitWithSuggestion(
      userId,
      temperature,
      description,
      suggestion.explanation,
      suggestion.top?.id || null,
      suggestion.bottom?.id || null,
      suggestion.shoes?.id || null
    );

    if (saveError) {
      console.error("Error saving suggestion:", saveError);
      dismiss();
      showErrorToast(toast, {
        title: "Erreur d'enregistrement",
        description: "Impossible d'enregistrer la suggestion de tenue"
      });
      throw saveError;
    }

    // Succès
    dismiss();
    showSuccessToast(toast, {
      title: "Tenue créée",
      description: "Voici votre tenue idéale pour aujourd'hui !"
    });

    return {
      suggestion: {
        top: outfit?.top || null,
        bottom: outfit?.bottom || null,
        shoes: outfit?.shoes || null,
        explanation: suggestion.explanation,
        temperature,
        description
      } as OutfitSuggestion,
      error: null
    };
  } catch (error) {
    console.error("Error in suggestion process:", error);
    if (toastId) {
      toast({
        id: toastId,
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération de la suggestion.",
        icon: { type: "icon", icon: AlertCircle, className: "h-4 w-4" }
      });
    }
    return {
      suggestion: null,
      error: error instanceof Error ? error : new Error("Unknown error")
    };
  }
}
