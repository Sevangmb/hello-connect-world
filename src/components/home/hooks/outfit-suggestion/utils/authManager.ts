
import { supabase } from "@/integrations/supabase/client";
import { Toast } from "@/hooks/use-toast";
import { showErrorToast } from "./toastManager";

export async function checkAuthentication(toast: Toast): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    showErrorToast(toast, {
      title: "Non connecté",
      description: "Vous devez être connecté pour voir les suggestions de tenues."
    });
    
    return null;
  }
  
  return user.id;
}
