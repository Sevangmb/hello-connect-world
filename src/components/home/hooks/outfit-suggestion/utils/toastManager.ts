
import { Toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ToastOptions {
  title: string;
  description: string;
  duration?: number;
}

export const showLoadingToast = (toast: Toast, options: ToastOptions) => {
  const { title, description, duration = 10000 } = options;
  
  // Créer un toast avec un indicateur de chargement
  const toastObject = toast({
    title,
    description,
    duration,
    icon: { 
      type: "icon", 
      icon: Loader2, 
      className: "h-4 w-4 animate-spin"
    }
  });
  
  return {
    id: toastObject.id,
    dismiss: toastObject.dismiss
  };
};

export const showErrorToast = (toast: Toast, options: ToastOptions) => {
  const { title, description, duration = 5000 } = options;
  
  toast({
    variant: "destructive",
    title,
    description,
    duration
  });
};

export const showSuccessToast = (toast: Toast, options: ToastOptions) => {
  const { title, description, duration = 3000 } = options;
  
  toast({
    title,
    description,
    duration
  });
};

export const updateToast = (toast: Toast, id: string, options: ToastOptions) => {
  const { title, description, duration } = options;
  
  toast({
    id,
    title,
    description,
    duration
  });
};
