import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploadProps {
  currentImageUrl: string | null;
  onImageUploaded: (url: string) => void;
  bucket: string;
}

export const ImageUpload = ({ currentImageUrl, onImageUploaded, bucket }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Vous devez sélectionner une image");
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onImageUploaded(publicUrl);
      
      toast({
        title: "Image téléchargée",
        description: "L'image a été téléchargée avec succès",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger l'image",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Image</Label>
      <div className="flex items-center gap-4">
        {currentImageUrl && (
          <img
            src={currentImageUrl}
            alt="Preview"
            className="w-20 h-20 object-cover rounded-md"
          />
        )}
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={uploadImage}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <Button
            type="button"
            variant="outline"
            asChild
            disabled={uploading}
          >
            <label htmlFor="image-upload" className="cursor-pointer">
              {uploading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Chargement...
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 mr-2" />
                  {currentImageUrl ? "Changer l'image" : "Ajouter une image"}
                </>
              )}
            </label>
          </Button>
        </div>
      </div>
    </div>
  );
};