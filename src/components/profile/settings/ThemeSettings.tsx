
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PaintBucket } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface ThemeSettingsProps {
  userId: string;
  initialTheme?: string;
  onThemeChange: (theme: string) => void;
}

const THEME_OPTIONS = [
  { value: "light", label: "Clair" },
  { value: "dark", label: "Sombre" }, 
  { value: "system", label: "Système" },
  { value: "blue", label: "Bleu" },
  { value: "green", label: "Vert" },
  { value: "purple", label: "Violet" }
];

export const ThemeSettings = ({ userId, initialTheme = "system", onThemeChange }: ThemeSettingsProps) => {
  const { toast } = useToast();
  const [theme, setTheme] = useState(initialTheme);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Appliquer le thème à l'élément HTML
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeChange = (value: string) => {
    setTheme(value);
    onThemeChange(value);
  };

  const saveThemePreference = async () => {
    if (!userId) return;
    
    try {
      setIsSaving(true);
      // Utilisons preferences pour stocker le thème car theme_preference n'existe pas directement
      const { error } = await supabase
        .from("profiles")
        .update({ 
          preferences: { theme: theme } 
        })
        .eq("id", userId);
        
      if (error) throw error;
      
      toast({
        title: "Thème enregistré",
        description: "Votre préférence de thème a été enregistrée"
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du thème:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer le thème"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <PaintBucket className="h-5 w-5 text-muted-foreground" />
        <p className="font-medium">Thème</p>
      </div>
      
      <RadioGroup value={theme} onValueChange={handleThemeChange} className="grid grid-cols-2 gap-4">
        {THEME_OPTIONS.map(option => (
          <div key={option.value} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-accent/20 transition-colors">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value} className="flex-grow cursor-pointer">{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
      
      <div className="pt-4">
        <Button 
          variant="outline" 
          onClick={saveThemePreference}
          disabled={isSaving}
          size="sm"
        >
          Enregistrer le thème
        </Button>
      </div>
    </div>
  );
};
