import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User, Settings, Camera } from "lucide-react";
import { ProfileStats } from "./ProfileStats";

export const ProfileHeader = () => {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Photo de profil */}
          <div className="relative group">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {/* Informations utilisateur */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  {profile?.username || "Utilisateur"}
                </h1>
                <p className="text-muted-foreground">
                  {profile?.full_name || ""}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        {profile && <ProfileStats userId={profile.id} />}
      </div>
    </div>
  );
};
