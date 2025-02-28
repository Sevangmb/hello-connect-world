
import { AlertCircle, Loader2, Shirt } from "lucide-react";
import { ToastOptions } from "@/hooks/use-toast";
import { Toast } from "@/hooks/use-toast";

export interface ToastConfig {
  id?: string;
  title: string;
  description: string;
  icon?: any;
  duration?: number;
  variant?: "default" | "destructive";
}

export function showLoadingToast(
  toast: Toast,
  config: Omit<ToastConfig, "variant" | "icon" | "duration">
): { id: string; dismiss: () => void } {
  const { id, dismiss } = toast({
    title: config.title,
    description: config.description,
    icon: { type: "icon", icon: Loader2, className: "h-4 w-4 animate-spin" },
    duration: 60000, // 1 minute max
  });
  
  return { id, dismiss };
}

export function showErrorToast(
  toast: Toast,
  config: Omit<ToastConfig, "variant" | "icon">
): void {
  toast({
    variant: "destructive",
    title: config.title,
    description: config.description,
    icon: { type: "icon", icon: AlertCircle, className: "h-4 w-4" },
    duration: config.duration || 5000,
  });
}

export function showSuccessToast(
  toast: Toast,
  config: Omit<ToastConfig, "variant" | "icon">
): void {
  toast({
    title: config.title,
    description: config.description,
    icon: { type: "icon", icon: Shirt, className: "h-4 w-4 text-green-500" },
    duration: config.duration || 5000,
  });
}

export function updateLoadingToast(
  toast: Toast,
  id: string,
  config: Omit<ToastConfig, "variant" | "icon" | "duration">
): void {
  toast({
    id,
    title: config.title,
    description: config.description,
    icon: { type: "icon", icon: Loader2, className: "h-4 w-4 animate-spin" },
    duration: 60000,
  });
}
