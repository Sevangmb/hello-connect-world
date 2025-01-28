import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, User, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileStats } from "./ProfileStats";

export const ProfileForm = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [profile, setProfile] = useState<{
    username: string;
    full_name: string;
    avatar_url: string | null;
    visibility: "public" | "private";
  } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");
      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url, visibility")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      console.log("Profile fetched:", data);
      setProfile(data);
    } catch (error: any) {
      console.error("Error fetching profile:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger votre profil",
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile || !userId) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          full_name: profile.full_name,
          visibility: profile.visibility,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Vous devez sélectionner une image");
      }

      if (!userId) throw new Error("User not found");

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      
      toast({
        title: "Avatar mis à jour",
        description: "Votre photo de profil a été mise à jour avec succès",
      });
    } catch (error: any) {
      console.error("Error uploading avatar:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour votre photo de profil",
      });
    } finally {
      setUploading(false);
    }
  };

  if (!profile || !userId) return null;

  return (
    <div className="space-y-6">
      {userId && <ProfileStats userId={userId} />}
      
      <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Mon Profil</h2>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et votre photo de profil
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback>
              <User className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
              disabled={uploading}
              className="hidden"
              id="avatar-upload"
            />
            <Button
              asChild
              variant="outline"
              disabled={uploading}
            >
              <label htmlFor="avatar-upload" className="cursor-pointer">
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Chargement...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Changer la photo
                  </>
                )}
              </label>
            </Button>
          </div>
        </div>

        <form onSubmit={updateProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              value={profile?.username || ""}
              onChange={(e) => setProfile(prev => prev ? { ...prev, username: e.target.value } : null)}
              placeholder="Votre nom d'utilisateur"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Nom complet</Label>
            <Input
              id="full_name"
              value={profile?.full_name || ""}
              onChange={(e) => setProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
              placeholder="Votre nom complet"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibilité du profil</Label>
            <Select
              value={profile.visibility}
              onValueChange={(value: "public" | "private") => 
                setProfile(prev => prev ? { ...prev, visibility: value } : null)
              }
            >
              <SelectTrigger>
                <SelectValue>
                  {profile.visibility === "public" ? (
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Public
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <EyeOff className="w-4 h-4 mr-2" />
                      Privé
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Public
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div className="flex items-center">
                    <EyeOff className="w-4 h-4 mr-2" />
                    Privé
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {profile.visibility === "public" 
                ? "Votre profil est visible par tous les utilisateurs"
                : "Votre profil n'est visible que par vos amis"}
            </p>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};