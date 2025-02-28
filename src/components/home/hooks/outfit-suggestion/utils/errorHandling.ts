
import { OutfitSuggestionError } from "../types/suggestionTypes";

// Définition des codes d'erreur spécifiques
export const ErrorCodes = {
  NETWORK_ERROR: "network_error",
  API_ERROR: "api_error",
  VALIDATION_ERROR: "validation_error",
  WEATHER_DATA_MISSING: "weather_data_missing",
  USER_DATA_MISSING: "user_data_missing",
  LOCATION_MISSING: "location_missing",
  CLOTHES_MISSING: "clothes_missing",
  SERVER_ERROR: "server_error",
  UNKNOWN_ERROR: "unknown_error"
};

/**
 * Crée une structure d'erreur standardisée pour les suggestions de tenues
 */
export function createSuggestionError(
  error: Error,
  errorCode: string = ErrorCodes.UNKNOWN_ERROR,
  message?: string
): OutfitSuggestionError {
  return {
    error,
    errorCode,
    message: message || error.message,
    suggestion: null
  };
}

/**
 * Détermine le code d'erreur approprié basé sur l'erreur
 */
export function determineErrorCode(error: Error): string {
  if (error.message.includes("network") || error.message.includes("connexion")) {
    return ErrorCodes.NETWORK_ERROR;
  }
  
  if (error.message.includes("weather") || error.message.includes("météo")) {
    return ErrorCodes.WEATHER_DATA_MISSING;
  }
  
  if (error.message.includes("location") || error.message.includes("localisation")) {
    return ErrorCodes.LOCATION_MISSING;
  }
  
  if (error.message.includes("server") || error.message.includes("serveur")) {
    return ErrorCodes.SERVER_ERROR;
  }
  
  return ErrorCodes.UNKNOWN_ERROR;
}
