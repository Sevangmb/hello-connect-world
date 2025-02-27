
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, Bell, Globe, Check, PaintBucket } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export const ProfileSettings = () => {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading || !profile) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const toggleEmailNotifications = () => {
    updateProfile({ ...profile, email_notifications: !profile.email_notifications });
  };

  const handleLanguageChange = (value: string) => {
    updateProfile({ ...profile, preferred_language: value });
  };

  const handleLogout = async () => {
    try {
      setIsSaving(true);
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      queryClient.clear();
      navigate("/auth");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vous déconnecter"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }
      
      // Récupération des données de l'utilisateur
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
        
      const { data: clothesData } = await supabase
        .from("clothes")
        .select("*")
        .eq("user_id", user.id);
        
      const { data: outfitsData } = await supabase
        .from("outfits")
        .select("*")
        .eq("user_id", user.id);
      
      // Création d'un objet contenant toutes les données
      const exportData = {
        profile: profileData,
        clothes: clothesData,
        outfits: outfitsData,
        exportDate: new Date().toISOString()
      };
      
      // Conversion en JSON et téléchargement
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `my-profile-export-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Exportation réussie",
        description: "Vos données ont été exportées avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de l'exportation des données:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'exporter vos données"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Préférences</CardTitle>
          <CardDescription>
            Gérez vos préférences et paramètres personnels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Notifications par email</p>
                  <p className="text-sm text-muted-foreground">
                    Recevez des notifications par email
                  </p>
                </div>
              </div>
              <Switch
                checked={profile.email_notifications}
                onCheckedChange={toggleEmailNotifications}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">Langue préférée</p>
              </div>
              <Select 
                value={profile.preferred_language}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-full md:w-[240px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <PaintBucket className="h-5 w-5 text-muted-foreground" />
                <p className="font-medium">Thème</p>
              </div>
              <RadioGroup defaultValue="system">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Clair</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Sombre</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">Système</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
          <CardDescription>
            Gérez les paramètres de sécurité de votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Changement de mot de passe</p>
                <p className="text-sm text-muted-foreground">
                  Modifiez votre mot de passe
                </p>
              </div>
            </div>
            <Button variant="outline">Modifier</Button>
          </div>
          <Separator />
          <div className="pt-2">
            <Button variant="outline" onClick={handleExportData} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exportation...
                </>
              ) : (
                "Exporter mes données"
              )}
            </Button>
          </div>
          <div className="pt-2">
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Déconnexion...
                </>
              ) : (
                "Se déconnecter"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
