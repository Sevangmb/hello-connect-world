
export function generateFallbackSuggestions(
  availableClothes: any[],
  tripDays: number,
  weatherInfo: string
) {
  // Catégoriser les vêtements disponibles
  const categorizedClothes = availableClothes.reduce((acc: any, item: any) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});
  
  // Logique simple basée sur les catégories et le nombre de jours
  const suggestedClothes = [];
  const essentialCategories = ["Hauts", "Bas", "Chaussures", "Accessoires"];
  
  for (const category of essentialCategories) {
    if (categorizedClothes[category]) {
      const itemsCount = category === "Hauts" || category === "Bas" 
        ? Math.min(tripDays, categorizedClothes[category].length)
        : Math.min(2, categorizedClothes[category].length);
      
      for (let i = 0; i < itemsCount; i++) {
        if (categorizedClothes[category][i]) {
          suggestedClothes.push({
            id: categorizedClothes[category][i].id,
            name: categorizedClothes[category][i].name,
            category: categorizedClothes[category][i].category
          });
        }
      }
    }
  }
  
  return {
    suggestedClothes,
    explanation: `Suggestions basées sur votre voyage de ${tripDays} jours. ${weatherInfo}`
  };
}
