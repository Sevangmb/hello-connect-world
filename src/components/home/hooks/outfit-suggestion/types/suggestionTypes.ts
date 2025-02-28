
import { OutfitSuggestion } from "../../../types/weather";
import { LucideIcon } from "lucide-react";

export interface ToastConfig {
  id?: string;
  title: string;
  description: string;
  icon?: { type: "icon"; icon: LucideIcon; className?: string } | React.ReactNode;
  duration?: number;
  variant?: "default" | "destructive";
}

export interface OutfitSuggestionState {
  toastId: string | null;
}

export interface OutfitSuggestionResult {
  suggestion: OutfitSuggestion | null;
  error: Error | null;
  errorCode?: string;
}

export interface OutfitSuggestionError {
  error: Error;
  errorCode: string;
  message: string;
}
