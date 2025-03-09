
import { useState, useCallback, useMemo } from "react";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ThemeSettings } from "./settings/ThemeSettings";
import { NotificationSettings } from "./settings/NotificationSettings";
import { SecuritySettings } from "./settings/SecuritySettings";
import { LanguageSettings } from "./settings/LanguageSettings";
import { ActiveSessions } from "./settings/ActiveSessions";
import { UserProfile } from "@/core/users/domain/types";

export const ProfileSettings = () => {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("general");

  // Mémoriser les données du profil pour éviter des re-rendus inutiles
  const userProfile = useMemo(() => profile, [profile]);

  const handleUpdateProfile = useCallback((updatedData: Partial<UserProfile>) => {
    if (!profile) return;
    updateProfile({ ...profile, ...updatedData });
  }, [profile, updateProfile]);

  const handleThemeChange = useCallback((theme: string) => {
    // Appliquer le thème immédiatement
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      queryClient.clear();
      navigate("/auth");
      return true;
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vous déconnecter"
      });
      return false;
    }
  }, [toast, queryClient, navigate]);

  if (isLoading || !profile) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full mb-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences générales</CardTitle>
              <CardDescription>
                Gérez vos préférences personnelles d'affichage et de langue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <LanguageSettings 
                profile={userProfile} 
                onUpdate={handleUpdateProfile} 
              />
              
              <Separator />
              
              <ThemeSettings 
                userId={userProfile.id}
                initialTheme={userProfile.theme_preference || "system"}
                onThemeChange={handleThemeChange}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Gérez comment et quand vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettings 
                profile={userProfile} 
                onUpdate={handleUpdateProfile} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
              <CardDescription>
                Gérez les paramètres de sécurité de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SecuritySettings 
                profile={userProfile} 
                onLogout={handleLogout} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sessions actives</CardTitle>
              <CardDescription>
                Gérez vos sessions actives sur tous vos appareils
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActiveSessions />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
