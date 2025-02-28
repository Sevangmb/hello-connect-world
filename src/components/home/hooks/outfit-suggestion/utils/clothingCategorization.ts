
import { CATEGORY_MAPPINGS } from "@/components/clothes/constants/categories";

interface ClothingItem {
  id: string;
  name: string;
  image_url: string | null;
  brand?: string;
  category: string;
}

export interface CategorizedClothes {
  tops: ClothingItem[];
  bottoms: ClothingItem[];
  shoes: ClothingItem[];
}

// Fonction pour vérifier si une catégorie appartient à un groupe
export function isInCategory(category: string, categoryGroup: string[]): boolean {
  if (!category) return false;
  return categoryGroup.some(c => 
    category.toLowerCase() === c.toLowerCase() || 
    category.toLowerCase().includes(c.toLowerCase())
  );
}

// Fonction pour catégoriser les vêtements
export function categorizeClothes(clothes: ClothingItem[]): CategorizedClothes {
  return {
    tops: clothes.filter(c => isInCategory(c.category, CATEGORY_MAPPINGS.tops)),
    bottoms: clothes.filter(c => isInCategory(c.category, CATEGORY_MAPPINGS.bottoms)),
    shoes: clothes.filter(c => isInCategory(c.category, CATEGORY_MAPPINGS.shoes))
  };
}

// Fonction pour compléter les catégories manquantes
export function handleMissingCategories(
  categorizedClothes: CategorizedClothes,
  allClothes: ClothingItem[]
): CategorizedClothes {
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
export function getRandomItem<T>(items: T[]): T | undefined {
  if (!items || items.length === 0) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}
