
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Lock, Shield, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/core/users/domain/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SecuritySettingsProps {
  profile: UserProfile;
  onLogout: () => Promise<void>;
}

export const SecuritySettings = ({ profile, onLogout }: SecuritySettingsProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(profile.two_factor_enabled ?? false);

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Utilisateur non authentifié");
      }
      
      const [
        { data: profileData }, 
        { data: clothesData }, 
        { data: outfitsData },
        { data: favoritesData }
      ] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("clothes").select("*").eq("user_id", user.id),
        supabase.from("outfits").select("*").eq("user_id", user.id),
        supabase.from("favorite_clothes").select("*").eq("user_id", user.id)
      ]);
      
      const exportData = {
        profile: profileData,
        clothes: clothesData,
        outfits: outfitsData,
        favorites: favoritesData,
        exportDate: new Date().toISOString()
      };
      
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
      setIsExporting(false);
    }
  };

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas"
      });
      return;
    }

    try {
      setIsSaving(true);
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès"
      });
      
      setIsChangePasswordOpen(false);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier votre mot de passe"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-muted-foreground" />
        <p className="font-medium">Sécurité du compte</p>
      </div>

      <div className="space-y-4">
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsChangePasswordOpen(true)}
          >
            Modifier
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Exportation des données</p>
              <p className="text-sm text-muted-foreground">
                Téléchargez une copie de vos données
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleExportData} 
            disabled={isExporting} 
            size="sm"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exportation...
              </>
            ) : "Exporter"}
          </Button>
        </div>
      </div>

      <div className="pt-2">
        <Button 
          variant="destructive" 
          onClick={handleLogout}
          disabled={isLoggingOut}
          size="sm"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Déconnexion...
            </>
          ) : "Se déconnecter"}
        </Button>
      </div>

      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer votre mot de passe</DialogTitle>
            <DialogDescription>
              Entrez votre nouveau mot de passe ci-dessous.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nouveau mot de passe"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer le mot de passe"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleChangePassword} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
