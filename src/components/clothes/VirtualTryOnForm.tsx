
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploader } from "./components/ImageUploader";

export const VirtualTryOnForm = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File, type: 'person' | 'clothing') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non connecté");

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
        setResultImage(null);
      } else {
        setClothingImage(publicUrl);
        setResultImage(null);
      }
    } catch (error: any) {
      console.error("Erreur lors du téléchargement:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de télécharger l'image: ${error.message}`
      });
    }
  };

  const handleTryOn = async () => {
    if (!personImage || !clothingImage) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner une photo de vous et un vêtement"
      });
      return;
    }

    try {
      setLoading(true);
      const response = await supabase.functions.invoke('virtual-tryon', {
        body: {
          personImage,
          clothingImage
        }
      });

      if (response.error) throw response.error;
      
      setResultImage(response.data.resultImage);
      toast({
        title: "Succès",
        description: "L'essayage virtuel a été généré avec succès"
      });
    } catch (error: any) {
      console.error("Erreur lors de l'essayage virtuel:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Impossible de générer l'essayage virtuel: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <ImageUploader
          label="Votre photo"
          imageUrl={personImage}
          onImageUpload={(file) => handleImageUpload(file, 'person')}
        />

        <ImageUploader
          label="Le vêtement à essayer"
          imageUrl={clothingImage}
          onImageUpload={(file) => handleImageUpload(file, 'clothing')}
        />
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
          <h3 className="text-lg font-semibold mb-2">Résultat</h3>
          <div className="aspect-square">
            <img 
              src={resultImage} 
              alt="Résultat de l'essayage virtuel" 
              className="w-full h-full object-cover rounded-lg" 
            />
          </div>
        </div>
      )}
    </Card>
  );
};
