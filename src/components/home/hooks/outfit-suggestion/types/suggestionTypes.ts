
import { OutfitSuggestion } from "../../../types/weather";

export interface ToastConfig {
  id?: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  duration?: number;
  variant?: "default" | "destructive";
}

export interface OutfitSuggestionState {
  toastId: string | null;
}

export interface OutfitSuggestionResult {
  suggestion: OutfitSuggestion | null;
  error: Error | null;
}
