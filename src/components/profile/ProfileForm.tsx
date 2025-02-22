
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProfileStats } from "./ProfileStats";
import { ProfileAvatar } from "./components/ProfileAvatar";
import { ProfileBasicInfo } from "./components/ProfileBasicInfo";
import { ProfileVisibility } from "./components/ProfileVisibility";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

export const ProfileForm = () => {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile();
  
  if (isLoading || !profile) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile(profile);
  };

  const handleFieldChange = (field: string, value: string) => {
    updateProfile({ ...profile, [field]: value });
  };

  return (
    <div className="space-y-6">
      <ProfileStats userId={profile.id} />
      
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
              userId={profile.id}
              avatarUrl={profile.avatar_url}
              onAvatarUploaded={(url) => updateProfile({ avatar_url: url })}
            />

            <form onSubmit={handleSubmit} className="space-y-4">
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

              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
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
