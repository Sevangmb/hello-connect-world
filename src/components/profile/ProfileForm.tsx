
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, User, Loader2, Eye, EyeOff, MapPin, Phone, Mail, Globe } from "lucide-react";
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
    phone: string | null;
    address: string | null;
    preferred_language: string;
    email_notifications: boolean;
  } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");
      setUserId(user.id);

      const { data, error } = await supabase
        .from("profiles")
        .select("username, full_name, avatar_url, visibility, phone, address, preferred_language, email_notifications")
        .eq("id", user.id)
        .maybeSingle();

      if (error) throw error;
      console.log("Profile fetched:", data);
      
      const visibility = data?.visibility === "private" ? "private" : "public";
      setProfile(data ? {
        ...data,
        visibility,
        username: data.username || "",
        full_name: data.full_name || "",
        phone: data.phone || "",
        address: data.address || "",
        preferred_language: data.preferred_language || "fr",
        email_notifications: data.email_notifications ?? true,
      } : null);
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
          phone: profile.phone,
          address: profile.address,
          preferred_language: profile.preferred_language,
          email_notifications: profile.email_notifications,
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
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations Personnelles</CardTitle>
            <CardDescription>
              Gérez vos informations personnelles et votre photo de profil
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
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
              <div className="grid gap-4 md:grid-cols-2">
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
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile?.phone || ""}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                    placeholder="Votre numéro de téléphone"
                    icon={<Phone className="w-4 h-4" />}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Langue préférée</Label>
                  <Select
                    value={profile.preferred_language}
                    onValueChange={(value) => 
                      setProfile(prev => prev ? { ...prev, preferred_language: value } : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          {profile.preferred_language === "fr" ? "Français" : "English"}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          Français
                        </div>
                      </SelectItem>
                      <SelectItem value="en">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2" />
                          English
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Textarea
                  id="address"
                  value={profile?.address || ""}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, address: e.target.value } : null)}
                  placeholder="Votre adresse complète"
                  className="min-h-[100px]"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

