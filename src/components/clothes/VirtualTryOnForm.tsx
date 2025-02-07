
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const VirtualTryOnForm = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File, type: 'person' | 'clothing') => {
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

      if (type === 'person') {
        setPersonImage(publicUrl);
      } else {
        setClothingImage(publicUrl);
      }
    } catch (error: any) {
      console.error("Error uploading image:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger l'image",
      });
    }
  };

  const handleTryOn = async () => {
    if (!personImage || !clothingImage) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une photo de vous et un vêtement",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await supabase.functions.invoke('virtual-tryon', {
        body: { personImage, clothingImage }
      });

      if (response.error) throw response.error;

      setResultImage(response.data.resultImage);
      toast({
        title: "Succès",
        description: "L'essayage virtuel a été généré avec succès",
      });
    } catch (error: any) {
      console.error("Error during virtual try-on:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer l'essayage virtuel",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Label>Votre photo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, 'person');
              }}
              className="hidden"
              id="person-upload"
            />
            {personImage ? (
              <div className="relative aspect-square">
                <img
                  src={personImage}
                  alt="Votre photo"
                  className="w-full h-full object-cover rounded-lg"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-2 right-2"
                  asChild
                >
                  <label htmlFor="person-upload">
                    <Upload className="h-4 w-4" />
                  </label>
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full aspect-square"
                asChild
              >
                <label htmlFor="person-upload" className="cursor-pointer">
                  Télécharger votre photo
                </label>
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <Label>Le vêtement à essayer</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file, 'clothing');
              }}
              className="hidden"
              id="clothing-upload"
            />
            {clothingImage ? (
              <div className="relative aspect-square">
                <img
                  src={clothingImage}
                  alt="Vêtement"
                  className="w-full h-full object-cover rounded-lg"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-2 right-2"
                  asChild
                >
                  <label htmlFor="clothing-upload">
                    <Upload className="h-4 w-4" />
                  </label>
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="w-full aspect-square"
                asChild
              >
                <label htmlFor="clothing-upload" className="cursor-pointer">
                  Télécharger un vêtement
                </label>
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleTryOn}
            disabled={loading || !personImage || !clothingImage}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              "Essayer virtuellement"
            )}
          </Button>
        </div>

        {resultImage && (
          <div className="mt-6">
            <Label>Résultat</Label>
            <div className="mt-2 aspect-square">
              <img
                src={resultImage}
                alt="Résultat de l'essayage virtuel"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
