
import { useState } from "react";
import { Header } from "@/components/Header";
import MainSidebar from "@/components/MainSidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Bell, Globe, Shield, CloudOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useQueryClient } from "@tanstack/react-query";

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  
  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
        <Header />
        <MainSidebar />
        <main className="pt-24 px-4 md:pl-72 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <BottomNav />
      </div>
    );
  }

  const handleToggleNotifications = (checked: boolean) => {
    updateProfile({ ...profile, email_notifications: checked });
  };

  const handleChangeLanguage = (language: string) => {
    updateProfile({ ...profile, preferred_language: language });
  };

  const handleVisibilityChange = (visibility: "public" | "private") => {
    updateProfile({ ...profile, visibility: visibility });
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-16 md:pb-0">
      <Header />
      <MainSidebar />
      <main className="pt-24 px-4 md:pl-72">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Paramètres du compte</h1>
          
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Gérez vos préférences de notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="email_notifications">Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez des emails pour les activités importantes
                    </p>
                  </div>
                  <Switch
                    id="email_notifications"
                    checked={profile.email_notifications}
                    onCheckedChange={handleToggleNotifications}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Langue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Langue et Localisation
                </CardTitle>
                <CardDescription>
                  Définissez vos préférences linguistiques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Langue préférée</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={profile.preferred_language === "fr" ? "default" : "outline"}
                        onClick={() => handleChangeLanguage("fr")}
                      >
                        Français
                      </Button>
                      <Button
                        variant={profile.preferred_language === "en" ? "default" : "outline"}
                        onClick={() => handleChangeLanguage("en")}
                      >
                        English
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Confidentialité */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Confidentialité
                </CardTitle>
                <CardDescription>
                  Gérez qui peut voir votre profil et vos activités
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Visibilité du profil</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={profile.visibility === "public" ? "default" : "outline"}
                        onClick={() => handleVisibilityChange("public")}
                      >
                        Public
                      </Button>
                      <Button
                        variant={profile.visibility === "private" ? "default" : "outline"}
                        onClick={() => handleVisibilityChange("private")}
                      >
                        Privé
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {profile.visibility === "public" 
                        ? "Votre profil est visible par tous les utilisateurs"
                        : "Votre profil n'est visible que par vos amis"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Données */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudOff className="h-5 w-5" />
                  Données
                </CardTitle>
                <CardDescription>
                  Gérez vos données et votre compte
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Télécharger mes données
                  </Button>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    Supprimer mon compte
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default Settings;
