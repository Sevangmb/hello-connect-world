
import { supabase } from "@/integrations/supabase/client";
import { OutfitSuggestion } from "@/components/home/types/weather";
import { showErrorToast, showLoadingToast, showSuccessToast, updateLoadingToast } from "./toastManager";
import { checkUserAuthenticated } from "./authManager";
import { manageErrorResponse } from "./errorHandling";
import { categorizeClothingItems } from "./clothingCategorization";
import { Toast } from "@/hooks/use-toast";

export async function fetchOutfitSuggestion(
  weatherData: any,
  toast: Toast,
  setState: (value: React.SetStateAction<{
    toastId: string | null;
  }>) => void
): Promise<OutfitSuggestion | null> {
  if (!weatherData) {
    showErrorToast(toast, {
      title: "Données météo manquantes",
      description: "Impossible de générer une suggestion sans données météo."
    });
    return null;
  }

  // Check if user is authenticated
  const isAuthenticated = await checkUserAuthenticated(toast);
  if (!isAuthenticated) return null;

  // Show initial loading toast
  const { id: toastId, dismiss } = showLoadingToast(toast, {
    title: "Création de suggestion",
    description: "Analyse des données météo en cours..."
  });

  setState({ toastId });

  try {
    // Update toast with new status
    updateLoadingToast(toast, toastId, {
      title: "Analyse en cours",
      description: "Recherche des vêtements adaptés à la météo actuelle..."
    });

    // Fetch user's clothing items
    const { data: clothingItems, error: clothingError } = await supabase
      .from('clothes')
      .select('*')
      .eq('archived', false);

    if (clothingError) throw clothingError;

    if (!clothingItems || clothingItems.length === 0) {
      dismiss();
      showErrorToast(toast, {
        title: "Garde-robe vide",
        description: "Vous n'avez pas encore ajouté de vêtements dans votre garde-robe."
      });
      return null;
    }

    // Categorize clothing items
    const categorizedItems = categorizeClothingItems(clothingItems);

    // Update toast with AI generation status
    updateLoadingToast(toast, toastId, {
      title: "Génération en cours",
      description: "Notre IA analyse la météo et votre garde-robe pour créer un ensemble adapté..."
    });

    // Mocked suggestion result for now
    const suggestion: OutfitSuggestion = {
      top: categorizedItems.tops[0] || null,
      bottom: categorizedItems.bottoms[0] || null,
      outerwear: categorizedItems.outerwear[0] || null,
      shoes: categorizedItems.shoes[0] || null,
      description: `Tenue adaptée pour ${weatherData.current.weather[0].description} et ${Math.round(weatherData.current.temp)}°C`,
      temperature: weatherData.current.temp,
    };

    // Success toast
    dismiss();
    showSuccessToast(toast, {
      title: "Suggestion créée",
      description: "Votre tenue pour aujourd'hui est prête!"
    });

    return suggestion;
  } catch (error) {
    console.error("Error generating outfit suggestion:", error);
    dismiss();
    manageErrorResponse(error, toast);
    return null;
  }
}
