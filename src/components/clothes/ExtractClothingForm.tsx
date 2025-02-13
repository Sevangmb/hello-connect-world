import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Upload, Scissors } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
          <Label>Photo avec le vêtement à extraire</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            className="hidden"
            id="source-upload"
          />
          {sourceImage ? (
            <div className="relative aspect-square">
              <img
                src={sourceImage}
                alt="Image source"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute bottom-2 right-2 flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleExtractClothing}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Scissors className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <label htmlFor="source-upload">
                    <Upload className="h-4 w-4" />
                  </label>
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full aspect-square"
              asChild
            >
              <label htmlFor="source-upload" className="cursor-pointer">
                Télécharger une photo
              </label>
            </Button>
          )}
        </div>

        {extractedImage && (
          <div className="space-y-4">
            <Label>Vêtement extrait</Label>
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
