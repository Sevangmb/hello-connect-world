
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Loader2, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileAvatarProps {
  userId: string;
  avatarUrl: string | null;
  onAvatarUploaded: (url: string) => void;
}

export const ProfileAvatar = ({ userId, avatarUrl, onAvatarUploaded }: ProfileAvatarProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Vous devez sélectionner une image");
      }

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

      onAvatarUploaded(publicUrl);
      
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

  return (
    <div className="flex items-center gap-4 mb-6">
      <Avatar className="w-20 h-20">
        <AvatarImage src={avatarUrl || undefined} />
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
  );
};
