import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = [
  "Hauts",
  "Bas",
  "Robes",
  "Manteaux",
  "Chaussures",
  "Accessoires",
];

export const AddClothesForm = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image_url: null as string | null,
  });

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
        .from("clothes")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("clothes")
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { error } = await supabase
        .from("clothes")
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          image_url: formData.image_url,
        });

      if (error) throw error;

      toast({
        title: "Vêtement ajouté",
        description: "Le vêtement a été ajouté à votre garde-robe",
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        image_url: null,
      });
    } catch (error: any) {
      console.error("Error adding clothes:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le vêtement",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Ajouter un vêtement</h2>
        <p className="text-muted-foreground">
          Ajoutez un nouveau vêtement à votre garde-robe
        </p>
      </div>

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

        <div className="space-y-2">
          <Label>Image</Label>
          <div className="flex items-center gap-4">
            {formData.image_url && (
              <img
                src={formData.image_url}
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
                      <Loader2 className="animate-spin" />
                      Chargement...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      {formData.image_url ? "Changer l'image" : "Ajouter une image"}
                    </>
                  )}
                </label>
              </Button>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading || !formData.category}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Ajouter le vêtement"
          )}
        </Button>
      </form>
    </div>
  );
};