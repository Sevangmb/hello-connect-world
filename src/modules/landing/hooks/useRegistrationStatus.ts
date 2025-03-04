
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useRegistrationStatus = () => {
  const [waitlistOpen, setWaitlistOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'registration_open')
          .single();
        
        if (error) {
          console.error("Erreur lors de la vérification du statut des inscriptions:", error);
          return;
        }
        
        if (data && typeof data.value === 'object' && data.value !== null && !Array.isArray(data.value)) {
          // Ensure the value is an object and not an array before accessing is_open
          const settingsValue = data.value as { is_open?: boolean };
          setWaitlistOpen(settingsValue.is_open === false);
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkRegistrationStatus();
  }, []);

  return { waitlistOpen, isLoading };
};
