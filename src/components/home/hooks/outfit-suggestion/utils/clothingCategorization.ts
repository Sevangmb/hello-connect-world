
import { ClothingItem } from "../types/aiTypes";

interface CategorizedClothes {
  tops: ClothingItem[];
  bottoms: ClothingItem[];
  shoes: ClothingItem[];
  outerwear: ClothingItem[];
  accessories: ClothingItem[];
  dresses: ClothingItem[];
}

export const categorizeClothes = (clothes: ClothingItem[]): CategorizedClothes => {
  const initialCategories: CategorizedClothes = {
    tops: [],
    bottoms: [],
    shoes: [],
    outerwear: [],
    accessories: [],
    dresses: []
  };
  
  return clothes.reduce((acc, item) => {
    const category = item.category?.toLowerCase() || "";
    
    // Top categories
    if (category === "hauts" || 
        category === "tops" || 
        category.includes("t-shirt") || 
        category.includes("chemise") ||
        category.includes("polo") ||
        category.includes("blouse") ||
        category.includes("pull") ||
        category.includes("sweat")) {
      acc.tops.push(item);
    }
    // Bottom categories
    else if (category === "bas" || 
             category === "bottoms" || 
             category.includes("pantalon") || 
             category.includes("jeans") ||
             category.includes("short") ||
             category.includes("jupe")) {
      acc.bottoms.push(item);
    }
    // Shoe categories
    else if (category === "chaussures" || 
             category === "shoes" || 
             category.includes("sneakers") || 
             category.includes("bottes") ||
             category.includes("sandales") ||
             category.includes("mocassins")) {
      acc.shoes.push(item);
    }
    // Outerwear categories
    else if (category === "vestes" || 
             category === "manteaux" || 
             category.includes("veste") || 
             category.includes("manteau") ||
             category.includes("blouson") ||
             category.includes("parka") ||
             category.includes("trench")) {
      acc.outerwear.push(item);
    }
    // Accessory categories
    else if (category === "accessoires" || 
             category === "accessories" || 
             category.includes("bijou") || 
             category.includes("sac") ||
             category.includes("ceinture") ||
             category.includes("écharpe") ||
             category.includes("gants")) {
      acc.accessories.push(item);
    }
    // Dress categories
    else if (category === "robes" || 
             category === "dresses" || 
             category.includes("robe")) {
      acc.dresses.push(item);
    }
    // Default to tops if we can't categorize
    else {
      console.warn(`Uncategorized clothing item: ${item.name}, category: ${category}`);
      acc.tops.push(item);
    }
    
    return acc;
  }, initialCategories);
};

// Alias pour assurer la compatibilité avec le code existant
export const categorizeClothingItems = categorizeClothes;

// Fonctions supplémentaires requises par d'autres modules
export const handleMissingCategories = (categorizedClothes: CategorizedClothes, allClothes: ClothingItem[]): CategorizedClothes => {
  // Si une catégorie est vide, on essaie de la remplir avec des vêtements au hasard
  if (categorizedClothes.tops.length === 0 && allClothes.length > 0) {
    categorizedClothes.tops = allClothes.slice(0, Math.min(3, allClothes.length));
  }
  
  if (categorizedClothes.bottoms.length === 0 && allClothes.length > 0) {
    categorizedClothes.bottoms = allClothes.slice(0, Math.min(3, allClothes.length));
  }
  
  if (categorizedClothes.shoes.length === 0 && allClothes.length > 0) {
    categorizedClothes.shoes = allClothes.slice(0, Math.min(3, allClothes.length));
  }
  
  return categorizedClothes;
};

export const getRandomItem = (items: ClothingItem[]): ClothingItem | null => {
  if (!items || items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
};
