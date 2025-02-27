
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: settingsArray, isLoading: isSettingsLoading } = useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      console.log("Fetching site settings...");
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .order('key');
      
      if (error) {
        console.error("Error fetching settings:", error);
        throw error;
      }
      
      console.log("Settings fetched:", data);
      return data || [];
    },
  });

  const settings = settingsArray?.reduce((acc: { [key: string]: any }, setting) => {
    try {
      if (setting && setting.key && setting.value) {
        acc[setting.key] = setting.value;
      }
      return acc;
    } catch (error) {
      console.error(`Error processing setting ${setting?.key}:`, error);
      return acc;
    }
  }, {});

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["site-categories"],
    queryFn: async () => {
      console.log("Fetching site categories...");
      const { data, error } = await supabase
        .from("site_categories")
        .select("*")
        .order('type')
        .order('order_index');
      
      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      
      console.log("Categories fetched:", data);
      return data || [];
    },
  });

  const handleSave = async (key: string, value: any) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      console.log("Saving setting:", { key, value });
      const { error } = await supabase
        .from("site_settings")
        .upsert({ 
          key, 
          value, 
          updated_by: user.id 
        })
        .eq("key", key);

      if (error) throw error;

      toast({
        title: "Paramètres mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    settings,
    categories,
    isLoading: isLoading || isSettingsLoading || isCategoriesLoading,
    handleSave
  };
}
