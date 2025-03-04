
/**
 * Utilities pour la gestion des conditions météorologiques
 */

/**
 * Détermine la condition météo à partir de la description si non fournie
 */
export function determineConditionFromDescription(description: string): 'clear' | 'rain' | 'clouds' | 'snow' | 'extreme' | 'other' {
  const desc = description.toLowerCase();
  
  if (desc.includes('pluie') || desc.includes('averse')) return 'rain';
  if (desc.includes('neige')) return 'snow';
  if (desc.includes('nuage')) return 'clouds';
  if (desc.includes('clair') || desc.includes('dégagé') || desc.includes('soleil')) return 'clear';
  if (desc.includes('orage') || desc.includes('tempête')) return 'extreme';
  
  return 'other';
}

/**
 * Enrichit les données météo avec des informations supplémentaires
 */
export function enrichWeatherData(
  temperature: number,
  description: string,
  condition?: 'clear' | 'rain' | 'clouds' | 'snow' | 'extreme' | 'other',
  windSpeed?: number,
  humidity?: number
) {
  return {
    temperature,
    description,
    condition: condition || determineConditionFromDescription(description),
    windSpeed,
    humidity
  };
}
