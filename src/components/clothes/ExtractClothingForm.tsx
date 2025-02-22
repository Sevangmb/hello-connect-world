
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Scissors } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploader } from "./components/ImageUploader";

export const ExtractClothingForm = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [extractedImage, setExtractedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("virtual-tryon")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("virtual-tryon")
        .getPublicUrl(filePath);

      setSourceImage(publicUrl);
      setExtractedImage(null);
    } catch (error: any) {
      console.error("Error uploading image:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger l'image",
      });
    }
  };

  const handleExtractClothing = async () => {
    if (!sourceImage) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez d'abord sélectionner une photo",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await supabase.functions.invoke('extract-clothing', {
        body: { image: sourceImage }
      });

      if (response.error) throw response.error;

      setExtractedImage(response.data.maskImage);
      toast({
        title: "Succès",
        description: "Le vêtement a été extrait avec succès",
      });
    } catch (error: any) {
      console.error("Error extracting clothing:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'extraire le vêtement",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <ImageUploader
            label="Photo avec le vêtement à extraire"
            imageUrl={sourceImage}
            onImageUpload={handleImageUpload}
          />
          
          {sourceImage && (
            <Button
              variant="outline"
              onClick={handleExtractClothing}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Extraction en cours...
                </>
              ) : (
                <>
                  <Scissors className="h-4 w-4 mr-2" />
                  Extraire le vêtement
                </>
              )}
            </Button>
          )}
        </div>

        {extractedImage && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vêtement extrait</h3>
            <div className="aspect-square">
              <img
                src={extractedImage}
                alt="Vêtement extrait"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
