
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/core/users/domain/types";

interface LanguageSettingsProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: Partial<UserProfile>) => void;
}

const LANGUAGES = [
  { value: "fr", label: "Français" },
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" }
];

export const LanguageSettings = ({ profile, onUpdate }: LanguageSettingsProps) => {
  const { toast } = useToast();
  const [language, setLanguage] = useState(profile.preferred_language || "fr");
  const [isSaving, setIsSaving] = useState(false);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
  };

  const saveLanguagePreference = async () => {
    try {
      setIsSaving(true);
      
      onUpdate({ 
        preferred_language: language 
      });
      
      toast({
        title: "Langue enregistrée",
        description: "Votre préférence de langue a été mise à jour"
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la langue:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'enregistrer la langue"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-5 w-5 text-muted-foreground" />
        <p className="font-medium">Langue préférée</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select 
          value={language}
          onValueChange={handleLanguageChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une langue" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map(lang => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          onClick={saveLanguagePreference}
          disabled={isSaving}
          size="sm"
        >
          Enregistrer
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground mt-2">
        La langue sélectionnée sera appliquée lors de votre prochaine connexion.
      </p>
    </div>
  );
};
