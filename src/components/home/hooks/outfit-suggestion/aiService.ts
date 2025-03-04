
/**
 * Ce fichier est maintenu pour la compatibilité avec le code existant.
 * Il re-exporte simplement le service refactorisé.
 */

import { generateAISuggestion } from './services/aiSuggestionService';
import { determineConditionFromDescription } from './utils/weatherUtils';

// Re-export pour la compatibilité avec le code existant
export { generateAISuggestion, determineConditionFromDescription };
