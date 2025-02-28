
import { supabase } from "@/integrations/supabase/client";
import { showErrorToast } from "./toastManager";
import { Toast } from "@/hooks/use-toast";

export async function getCurrentUser(toast: Toast) {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Auth error:", error);
      showErrorToast(toast, {
        title: "Erreur d'authentification",
        description: "Merci de vous reconnecter pour accéder à cette fonctionnalité."
      });
      return null;
    }
    
    return data.user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    showErrorToast(toast, {
      title: "Erreur d'authentification",
      description: "Une erreur est survenue lors de la récupération de votre profil."
    });
    return null;
  }
}

export async function checkUserAuthenticated(toast: Toast) {
  const user = await getCurrentUser(toast);
  return !!user;
}
