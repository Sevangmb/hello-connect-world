import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, UserMinus } from "lucide-react";

interface UserProfileProps {
  userId: string;
}

export const UserProfile = ({ userId }: UserProfileProps) => {
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    loadProfile();
    checkFollowStatus();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_follows")
        .select("*")
        .eq("follower_id", user.id)
        .eq("following_id", userId)
        .maybeSingle();

      if (error) throw error;
      setIsFollowing(!!data);
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollow = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (!isFollowing) {
        const { error } = await supabase
          .from("user_follows")
          .insert({
            follower_id: user.id,
            following_id: userId,
          });

        if (error) throw error;
        setIsFollowing(true);
        toast({
          title: "Abonnement réussi",
          description: "Vous suivez maintenant cet utilisateur",
        });
      } else {
        const { error } = await supabase
          .from("user_follows")
          .delete()
          .match({
            follower_id: user.id,
            following_id: userId,
          });

        if (error) throw error;
        setIsFollowing(false);
        toast({
          title: "Désabonnement réussi",
          description: "Vous ne suivez plus cet utilisateur",
        });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier l'abonnement",
      });
    }
  };

  if (!profile) return null;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.username}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-muted" />
        )}
        <div>
          <h3 className="font-semibold">{profile.username || "Utilisateur"}</h3>
          {profile.full_name && (
            <p className="text-sm text-muted-foreground">{profile.full_name}</p>
          )}
        </div>
      </div>

      <Button
        variant={isFollowing ? "destructive" : "default"}
        size="sm"
        onClick={handleFollow}
      >
        {isFollowing ? (
          <>
            <UserMinus className="h-4 w-4 mr-2" />
            Se désabonner
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            S'abonner
          </>
        )}
      </Button>
    </div>
  );
};