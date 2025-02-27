
import { parseAIResponse } from "./utils.ts";

export async function generateOpenAISuggestions(
  startDate: string,
  endDate: string,
  tripDays: number,
  currentClothes: any[],
  availableClothes: any[],
  weatherInfo: string,
  openaiApiKey: string
) {
  console.log("Utilisation de l'API OpenAI pour les suggestions");
  
  // Préparer le contexte pour l'IA
  const systemPrompt = getSystemPrompt(startDate, endDate, tripDays, weatherInfo);
  const userPrompt = getUserPrompt(currentClothes, availableClothes, tripDays);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Erreur OpenAI:", errorData);
    throw new Error(`Erreur OpenAI: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const aiOutput = data.choices[0].message.content;
  
  console.log("Réponse de l'IA:", aiOutput);
  
  // Analyser la réponse JSON de l'IA et valider les suggestions
  return parseAIResponse(aiOutput, availableClothes, tripDays, weatherInfo);
}

function getSystemPrompt(startDate: string, endDate: string, tripDays: number, weatherInfo: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return `
Tu es un assistant spécialisé dans la mode et l'organisation de valises. Ta tâche est de suggérer des vêtements pour un voyage en fonction du nombre de jours, des vêtements déjà sélectionnés, des vêtements disponibles et des prévisions météo.

Voici des informations importantes:
- Le voyage dure ${tripDays} jours, du ${start.toLocaleDateString()} au ${end.toLocaleDateString()}
- Prévisions météo: ${weatherInfo}

Règles générales:
1. Ne suggère pas de vêtements déjà sélectionnés
2. Adapte tes suggestions au nombre de jours (ex: plus de hauts et de bas pour un voyage plus long)
3. Prends en compte la météo pour suggérer des vêtements appropriés
4. Pense à la cohérence des styles et des couleurs pour créer des tenues complètes
5. Suggère entre 3 et 10 articles, selon la durée du voyage
`;
}

function getUserPrompt(currentClothes: any[], availableClothes: any[], tripDays: number): string {
  return `
Voici les vêtements déjà sélectionnés:
${JSON.stringify(currentClothes, null, 2)}

Voici les vêtements disponibles:
${JSON.stringify(availableClothes, null, 2)}

Suggère-moi des vêtements supplémentaires en fonction de la durée du voyage (${tripDays} jours) et de la météo.
Réponds uniquement avec un objet JSON au format suivant:
{
  "suggestedClothes": [
    {"id": "id_du_vêtement", "name": "nom_du_vêtement", "category": "catégorie_du_vêtement"},
    ...
  ],
  "explanation": "Explication de tes suggestions"
}
`;
}
