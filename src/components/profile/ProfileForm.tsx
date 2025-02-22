
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ProfileStats } from "./ProfileStats";
import { ProfileAvatar } from "./components/ProfileAvatar";
import { ProfileBasicInfo } from "./components/ProfileBasicInfo";
import { ProfileVisibility } from "./components/ProfileVisibility";

export const ProfileForm = () => {
  const [loading, setLoading] = useState(false);
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

  const handleFieldChange = (field: string, value: string) => {
    setProfile(prev => prev ? { ...prev, [field]: value } : null);
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
            <ProfileAvatar
              userId={userId}
              avatarUrl={profile.avatar_url}
              onAvatarUploaded={(url) => setProfile(prev => prev ? { ...prev, avatar_url: url } : null)}
            />

            <form onSubmit={updateProfile} className="space-y-4">
              <ProfileBasicInfo
                username={profile.username}
                fullName={profile.full_name}
                phone={profile.phone || ""}
                address={profile.address || ""}
                preferredLanguage={profile.preferred_language}
                onFieldChange={handleFieldChange}
              />

              <ProfileVisibility
                visibility={profile.visibility}
                onVisibilityChange={(value) => handleFieldChange("visibility", value)}
              />

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
