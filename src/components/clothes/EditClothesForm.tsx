import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORIES = [
  "Hauts",
  "Bas",
  "Robes",
  "Manteaux",
  "Chaussures",
  "Accessoires",
];

interface ClothesFormData {
  name: string;
  description: string;
  category: string;
  image_url: string | null;
}

interface EditClothesFormProps {
  clothesId: string;
  initialData: ClothesFormData;
  onSuccess: () => void;
}

export const EditClothesForm = ({ clothesId, initialData, onSuccess }: EditClothesFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { error } = await supabase
        .from("clothes")
        .update({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          image_url: formData.image_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", clothesId);

      if (error) throw error;

      toast({
        title: "Vêtement modifié",
        description: "Le vêtement a été modifié avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ["clothes"] });
      onSuccess();
    } catch (error: any) {
      console.error("Error updating clothes:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le vêtement",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Ex: T-shirt blanc"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Description du vêtement..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ImageUpload
        currentImageUrl={formData.image_url}
        onImageUploaded={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
        bucket="clothes"
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer"
          )}
        </Button>
      </div>
    </form>
  );
};
