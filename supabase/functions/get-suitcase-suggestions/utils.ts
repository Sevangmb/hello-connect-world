
export function parseAIResponse(
  aiOutput: string, 
  availableClothes: any[], 
  tripDays: number, 
  weatherInfo: string
) {
  try {
    let suggestions;
    
    // L'IA pourrait renvoyer soit une chaîne JSON, soit du texte avec JSON
    if (aiOutput.includes('{') && aiOutput.includes('}')) {
      const jsonMatch = aiOutput.match(/{[\s\S]*}/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Format JSON invalide dans la réponse de l'IA");
      }
    } else {
      suggestions = JSON.parse(aiOutput);
    }
    
    // Valider que les vêtements suggérés existent réellement dans les vêtements disponibles
    const validSuggestions = suggestions.suggestedClothes.filter((item: any) => 
      availableClothes.some((cloth: any) => cloth.id === item.id)
    );
    
    const finalResponse = {
      suggestedClothes: validSuggestions,
      explanation: suggestions.explanation || `Suggestions adaptées pour votre voyage de ${tripDays} jours. ${weatherInfo}`
    };
    
    console.log("Suggestions finales:", finalResponse);
    return finalResponse;
  } catch (parseError) {
    console.error("Erreur lors de l'analyse de la réponse de l'IA:", parseError);
    throw parseError;
  }
}
