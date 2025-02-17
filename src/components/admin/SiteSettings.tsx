import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import ThemeSettings from "./ThemeSettings";
import LogoSettings from "./LogoSettings";
import MessagesSettings from "./MessagesSettings";
import CategoriesSettings from "./CategoriesSettings";
import SocialSettings from "./SocialSettings";

// ...autres imports et utilitaires si nécessaire...

export function SiteSettings() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("No session");

        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .maybeSingle();

        if (!profile?.is_admin) {
          throw new Error("Not an admin");
        }
      } catch (error) {
        console.error("Auth error:", error);
        toast({
          variant: "destructive",
          title: "Accès non autorisé",
          description: "Veuillez vous connecter avec un compte administrateur.",
        });
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

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

  const [localTheme, setLocalTheme] = useState(
    settings?.theme || {
      primary: "#69d2e7",
      secondary: "#a7dbd8",
      accent: "#f38630",
      background: "#ffffff",
      text: "#333333",
    }
  );

  useEffect(() => {
    if (settings?.theme) {
      setLocalTheme(settings.theme);
    }
  }, [settings?.theme]);

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

      if (key === "theme") {
        document.documentElement.style.setProperty('--color-primary', value.primary || "#69d2e7");
        document.documentElement.style.setProperty('--color-secondary', value.secondary || "#a7dbd8");
        document.documentElement.style.setProperty('--color-accent', value.accent || "#f38630");
        document.documentElement.style.setProperty('--color-background', value.background || "#ffffff");
        document.documentElement.style.setProperty('--color-text', value.text || "#333333");
      }

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

  if (isSettingsLoading || isCategoriesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres du site</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="theme" className="space-y-4">
            <TabsList>
              <TabsTrigger value="theme" className="flex items-center gap-2">
                {/* ...icône et libellé */}
                Thème
              </TabsTrigger>
              <TabsTrigger value="logo" className="flex items-center gap-2">
                {/* ...icône */}
                Logo
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                {/* ...icône */}
                Messages
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                {/* ...icône */}
                Catégories
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                {/* ...icône */}
                Réseaux sociaux
              </TabsTrigger>
            </TabsList>

            <TabsContent value="theme">
              <ThemeSettings 
                localTheme={localTheme} 
                setLocalTheme={setLocalTheme} 
                isLoading={isLoading} 
                handleSave={handleSave} 
              />
            </TabsContent>
            <TabsContent value="logo">
              <LogoSettings 
                settings={settings} 
                isLoading={isLoading} 
                handleSave={handleSave} 
              />
            </TabsContent>
            <TabsContent value="messages">
              <MessagesSettings 
                settings={settings} 
                isLoading={isLoading} 
                handleSave={handleSave} 
              />
            </TabsContent>
            <TabsContent value="categories">
              <CategoriesSettings 
                categories={categories} 
                isLoading={isLoading} 
              />
            </TabsContent>
            <TabsContent value="social">
              <SocialSettings 
                settings={settings} 
                isLoading={isLoading} 
                handleSave={handleSave} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
