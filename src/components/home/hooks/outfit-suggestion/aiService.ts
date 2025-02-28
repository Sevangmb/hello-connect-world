
import { supabase } from "@/integrations/supabase/client";
import type { OutfitSuggestion } from "../../types/weather";
import { CATEGORY_MAPPINGS } from "@/components/clothes/constants/categories";

interface ClothingItem {
  id: string;
  name: string;
  image_url: string | null;
  brand?: string;
  category: string;
}

interface AIResponse {
  suggestion: {
    top: string;
    bottom: string;
    shoes: string;
  };
  explanation: string;
}

export const generateAISuggestion = async (
  clothes: ClothingItem[],
  temperature: number,
  description: string,
  useMistral: boolean = true,
  maxRetries = 3
): Promise<{ suggestion: OutfitSuggestion | null; error: Error | null }> => {
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Tentative ${attempt + 1} de génération de suggestion avec ${useMistral ? 'Mistral' : 'autre modèle'}`);
      console.log(`Envoi de ${clothes.length} vêtements à l'API`);
      
      // Amélioration de la catégorisation des vêtements avec les mappings étendus
      const categorizedClothes = {
        tops: clothes.filter(c => 
          isInCategory(c.category, CATEGORY_MAPPINGS.tops)
        ),
        bottoms: clothes.filter(c => 
          isInCategory(c.category, CATEGORY_MAPPINGS.bottoms)
        ),
        shoes: clothes.filter(c => 
          isInCategory(c.category, CATEGORY_MAPPINGS.shoes)
        )
      };

      console.log("Vêtements catégorisés:", {
        tops: categorizedClothes.tops.length,
        bottoms: categorizedClothes.bottoms.length,
        shoes: categorizedClothes.shoes.length
      });

      // Si une catégorie est vide, essayons d'inférer le type de vêtement à partir d'autres propriétés
      // ou de créer des vêtements factices pour permettre la génération
      const finalCategorizedClothes = handleMissingCategories(categorizedClothes, clothes);

      // Si après notre traitement, une catégorie essentielle est toujours vide, informons l'utilisateur
      if (finalCategorizedClothes.tops.length === 0 || 
          finalCategorizedClothes.bottoms.length === 0 || 
          finalCategorizedClothes.shoes.length === 0) {
        
        // Générer une liste des catégories manquantes pour un message d'erreur plus informatif
        const missingCategories = [];
        if (finalCategorizedClothes.tops.length === 0) missingCategories.push("hauts");
        if (finalCategorizedClothes.bottoms.length === 0) missingCategories.push("bas");
        if (finalCategorizedClothes.shoes.length === 0) missingCategories.push("chaussures");
        
        throw new Error(`Vous n'avez pas assez de vêtements dans certaines catégories (${missingCategories.join(", ")}) pour générer une suggestion`);
      }
      
      // Appel de la fonction Edge de Supabase appropriée selon le modèle choisi
      const { data: aiSuggestion, error: aiError } = await supabase.functions.invoke(
        useMistral ? 'generate-mistral-suggestion' : 'generate-outfit-suggestion',
        {
          body: {
            temperature,
            description,
            clothes: finalCategorizedClothes,
            allClothes: clothes
          }
        }
      );

      console.log("Réponse brute de l'API:", aiSuggestion);

      if (aiError) {
        console.error(`Tentative ${attempt + 1} échouée:`, aiError);
        lastError = aiError;
        
        if (attempt < maxRetries) {
          // Pause avant de réessayer avec un délai exponentiel
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
          continue;
        }
        throw aiError;
      }

      if (!aiSuggestion || !aiSuggestion.suggestion) {
        console.error("Format de réponse invalide:", aiSuggestion);
        throw new Error("Format de réponse invalide de l'API");
      }

      const { top: topId, bottom: bottomId, shoes: shoesId } = aiSuggestion.suggestion;
      
      console.log(`IDs reçus: top=${topId}, bottom=${bottomId}, shoes=${shoesId}`);
      
      // Recherche des détails des vêtements
      const topDetails = clothes.find(c => c.id === topId);
      const bottomDetails = clothes.find(c => c.id === bottomId);
      const shoesDetails = clothes.find(c => c.id === shoesId);
      
      console.log("Vêtements trouvés:", {
        top: topDetails ? topDetails.name : "non trouvé",
        bottom: bottomDetails ? bottomDetails.name : "non trouvé",
        shoes: shoesDetails ? shoesDetails.name : "non trouvé"
      });

      // Si un des vêtements n'est pas trouvé, on sélectionne des vêtements aléatoires pour les manquants
      const finalTop = topDetails || getRandomItem(finalCategorizedClothes.tops);
      const finalBottom = bottomDetails || getRandomItem(finalCategorizedClothes.bottoms);
      const finalShoes = shoesDetails || getRandomItem(finalCategorizedClothes.shoes);
      
      if (!topDetails || !bottomDetails || !shoesDetails) {
        console.log("Utilisation de vêtements par défaut pour les manquants:", {
          top: finalTop?.name || "aucun",
          bottom: finalBottom?.name || "aucun",
          shoes: finalShoes?.name || "aucun"
        });
      }
      
      // Vérifier que tous les vêtements nécessaires sont disponibles
      if (!finalTop || !finalBottom || !finalShoes) {
        throw new Error("Impossible de composer une tenue complète avec les vêtements disponibles");
      }
      
      return {
        suggestion: {
          top: finalTop,
          bottom: finalBottom,
          shoes: finalShoes,
          explanation: aiSuggestion.explanation || "Voici une tenue adaptée à la météo actuelle.",
          temperature,
          description
        },
        error: null
      };
    } catch (retryError) {
      console.error(`Tentative ${attempt + 1} erreur:`, retryError);
      lastError = retryError as Error;
      
      if (attempt === maxRetries) {
        // Si on a épuisé toutes les tentatives, on essaie de choisir des vêtements au hasard
        try {
          console.log("Génération d'une suggestion aléatoire de secours");
          
          // Recatégoriser avec notre système amélioré
          const finalCategories = {
            tops: clothes.filter(c => isInCategory(c.category, CATEGORY_MAPPINGS.tops)),
            bottoms: clothes.filter(c => isInCategory(c.category, CATEGORY_MAPPINGS.bottoms)),
            shoes: clothes.filter(c => isInCategory(c.category, CATEGORY_MAPPINGS.shoes))
          };
          
          // Compléter les catégories manquantes
          const fallbackCategories = handleMissingCategories(finalCategories, clothes);
          
          if (fallbackCategories.tops.length > 0 && fallbackCategories.bottoms.length > 0 && fallbackCategories.shoes.length > 0) {
            const randomTop = getRandomItem(fallbackCategories.tops);
            const randomBottom = getRandomItem(fallbackCategories.bottoms);
            const randomShoes = getRandomItem(fallbackCategories.shoes);
            
            if (randomTop && randomBottom && randomShoes) {
              return {
                suggestion: {
                  top: randomTop,
                  bottom: randomBottom,
                  shoes: randomShoes,
                  explanation: `Suggestion générée aléatoirement pour ${temperature}°C avec un temps ${description}.`,
                  temperature,
                  description
                },
                error: null
              };
            }
          }
        } catch (fallbackError) {
          console.error("Erreur lors de la génération de secours:", fallbackError);
        }
        
        break;
      }
      
      // Pause avant de réessayer, avec une durée qui augmente à chaque tentative (backoff exponentiel)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
  
  return {
    suggestion: null,
    error: lastError || new Error("Échec de génération de suggestion après plusieurs tentatives")
  };
};

// Fonction pour vérifier si une catégorie appartient à un groupe
function isInCategory(category: string, categoryGroup: string[]): boolean {
  if (!category) return false;
  return categoryGroup.some(c => 
    category.toLowerCase() === c.toLowerCase() || 
    category.toLowerCase().includes(c.toLowerCase())
  );
}

// Fonction pour créer des vêtements factices ou compléter les catégories manquantes
function handleMissingCategories(
  categorizedClothes: {
    tops: ClothingItem[];
    bottoms: ClothingItem[];
    shoes: ClothingItem[];
  },
  allClothes: ClothingItem[]
): {
  tops: ClothingItem[];
  bottoms: ClothingItem[];
  shoes: ClothingItem[];
} {
  const result = { ...categorizedClothes };
  
  // Si nous n'avons pas de hauts, essayons d'inférer à partir d'autres propriétés
  if (result.tops.length === 0) {
    // Chercher des vêtements qui pourraient être des hauts mais mal catégorisés
    const potentialTops = allClothes.filter(c => 
      !isInCategory(c.category, CATEGORY_MAPPINGS.bottoms) && 
      !isInCategory(c.category, CATEGORY_MAPPINGS.shoes) &&
      (c.name?.toLowerCase().includes('haut') || 
       c.name?.toLowerCase().includes('t-shirt') || 
       c.name?.toLowerCase().includes('chemise') ||
       c.name?.toLowerCase().includes('pull') ||
       c.name?.toLowerCase().includes('veste'))
    );
    
    if (potentialTops.length > 0) {
      result.tops = potentialTops;
    }
  }
  
  // Faire de même pour les bas
  if (result.bottoms.length === 0) {
    const potentialBottoms = allClothes.filter(c => 
      !isInCategory(c.category, CATEGORY_MAPPINGS.tops) && 
      !isInCategory(c.category, CATEGORY_MAPPINGS.shoes) &&
      (c.name?.toLowerCase().includes('pantalon') || 
       c.name?.toLowerCase().includes('jean') || 
       c.name?.toLowerCase().includes('jupe') ||
       c.name?.toLowerCase().includes('short') ||
       c.name?.toLowerCase().includes('bas'))
    );
    
    if (potentialBottoms.length > 0) {
      result.bottoms = potentialBottoms;
    }
  }
  
  // Et pour les chaussures
  if (result.shoes.length === 0) {
    const potentialShoes = allClothes.filter(c => 
      !isInCategory(c.category, CATEGORY_MAPPINGS.tops) && 
      !isInCategory(c.category, CATEGORY_MAPPINGS.bottoms) &&
      (c.name?.toLowerCase().includes('chaussure') || 
       c.name?.toLowerCase().includes('basket') || 
       c.name?.toLowerCase().includes('botte') ||
       c.name?.toLowerCase().includes('sandale'))
    );
    
    if (potentialShoes.length > 0) {
      result.shoes = potentialShoes;
    }
  }
  
  return result;
}

// Fonction utilitaire pour obtenir un élément aléatoire d'un tableau
function getRandomItem<T>(items: T[]): T | undefined {
  if (!items || items.length === 0) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}
