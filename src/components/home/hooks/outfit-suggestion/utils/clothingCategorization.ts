
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
    const subcategory = item.subcategory?.toLowerCase() || "";
    
    // Top categories
    if (category === "hauts" || 
        category === "tops" || 
        subcategory.includes("t-shirt") || 
        subcategory.includes("chemise") ||
        subcategory.includes("polo") ||
        subcategory.includes("blouse") ||
        subcategory.includes("pull") ||
        subcategory.includes("sweat")) {
      acc.tops.push(item);
    }
    // Bottom categories
    else if (category === "bas" || 
             category === "bottoms" || 
             subcategory.includes("pantalon") || 
             subcategory.includes("jeans") ||
             subcategory.includes("short") ||
             subcategory.includes("jupe")) {
      acc.bottoms.push(item);
    }
    // Shoe categories
    else if (category === "chaussures" || 
             category === "shoes" || 
             subcategory.includes("sneakers") || 
             subcategory.includes("bottes") ||
             subcategory.includes("sandales") ||
             subcategory.includes("mocassins")) {
      acc.shoes.push(item);
    }
    // Outerwear categories
    else if (category === "vestes" || 
             category === "manteaux" || 
             subcategory.includes("veste") || 
             subcategory.includes("manteau") ||
             subcategory.includes("blouson") ||
             subcategory.includes("parka") ||
             subcategory.includes("trench")) {
      acc.outerwear.push(item);
    }
    // Accessory categories
    else if (category === "accessoires" || 
             category === "accessories" || 
             subcategory.includes("bijou") || 
             subcategory.includes("sac") ||
             subcategory.includes("ceinture") ||
             subcategory.includes("écharpe") ||
             subcategory.includes("gants")) {
      acc.accessories.push(item);
    }
    // Dress categories
    else if (category === "robes" || 
             category === "dresses" || 
             subcategory.includes("robe")) {
      acc.dresses.push(item);
    }
    // Default to tops if we can't categorize
    else {
      console.warn(`Uncategorized clothing item: ${item.name}, category: ${category}, subcategory: ${subcategory}`);
      acc.tops.push(item);
    }
    
    return acc;
  }, initialCategories);
};

// Alias pour assurer la compatibilité avec le code existant
export const categorizeClothingItems = categorizeClothes;
