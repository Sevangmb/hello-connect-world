import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Loader2, ScanLine, Euro } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";

const CATEGORIES = [
  "Hauts",
  "Bas",
  "Robes",
  "Manteaux",
  "Chaussures",
  "Accessoires",
];

const STYLES = [
  "Casual",
  "Formel",
  "Sport",
  "Soirée",
  "Vacances",
  "Business",
];

export const AddClothesForm = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image_url: null as string | null,
    brand: "",
    size: "",
    material: "",
    color: "",
    style: "",
    price: "",
    purchase_date: "",
    is_for_sale: false,
    needs_alteration: false,
  });

  const scanLabel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setScanning(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Vous devez sélectionner une image de l'étiquette");
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      // Upload l'image de l'étiquette
      const { error: uploadError, data } = await supabase.storage
        .from("clothes")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from("clothes")
        .getPublicUrl(filePath);

      // Analyser l'étiquette avec notre fonction Edge
      const response = await supabase.functions.invoke('scan-label', {
        body: { imageUrl: publicUrl }
      });

      if (response.error) throw response.error;

      const { brand, size, material, color, category } = response.data;

      // Mettre à jour le formulaire avec les informations extraites
      setFormData(prev => ({
        ...prev,
        brand: brand || prev.brand,
        size: size || prev.size,
        material: material || prev.material,
        color: color || prev.color,
        category: category || prev.category,
      }));

      toast({
        title: "Étiquette analysée",
        description: "Les informations ont été extraites avec succès",
      });
    } catch (error: any) {
      console.error("Error scanning label:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'analyser l'étiquette",
      });
    } finally {
      setScanning(false);
    }
  };

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

      // Insérer le vêtement
      const { data: clothingData, error: clothingError } = await supabase
        .from("clothes")
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          image_url: formData.image_url,
          brand: formData.brand,
          size: formData.size,
          material: formData.material,
          color: formData.color,
          style: formData.style,
          price: formData.price ? parseFloat(formData.price) : null,
          purchase_date: formData.purchase_date || null,
          is_for_sale: formData.is_for_sale,
          needs_alteration: formData.needs_alteration,
        })
        .select()
        .single();

      if (clothingError) throw clothingError;

      // Si le vêtement est à vendre, l'ajouter à la boutique
      if (formData.is_for_sale && clothingData) {
        // Récupérer la boutique de l'utilisateur
        const { data: shopData, error: shopError } = await supabase
          .from("shops")
          .select()
          .eq("user_id", user.id)
          .single();

        if (shopError) throw new Error("Vous devez d'abord créer une boutique");

        // Mettre à jour le vêtement avec l'ID de la boutique
        const { error: updateError } = await supabase
          .from("clothes")
          .update({ shop_id: shopData.id })
          .eq("id", clothingData.id);

        if (updateError) throw updateError;

        // Ajouter l'article à la boutique
        const { error: shopItemError } = await supabase
          .from("shop_items")
          .insert({
            shop_id: shopData.id,
            clothes_id: clothingData.id,
            price: parseFloat(formData.price),
            status: "available"
          });

        if (shopItemError) throw shopItemError;
      }

      toast({
        title: "Vêtement ajouté",
        description: "Le vêtement a été ajouté à votre garde-robe" + 
          (formData.is_for_sale ? " et mis en vente dans votre boutique" : ""),
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        category: "",
        image_url: null,
        brand: "",
        size: "",
        material: "",
        color: "",
        style: "",
        price: "",
        purchase_date: "",
        is_for_sale: false,
        needs_alteration: false,
      });
    } catch (error: any) {
      console.error("Error adding clothes:", error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
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

        <div className="grid grid-cols-2 gap-4">
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
            <Label htmlFor="style">Style</Label>
            <Select
              value={formData.style}
              onValueChange={(value) => setFormData(prev => ({ ...prev, style: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un style" />
              </SelectTrigger>
              <SelectContent>
                {STYLES.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Marque</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              placeholder="Ex: Nike"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Taille</Label>
            <Input
              id="size"
              value={formData.size}
              onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
              placeholder="Ex: M"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="material">Matière</Label>
            <Input
              id="material"
              value={formData.material}
              onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
              placeholder="Ex: 100% Coton"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Couleur</Label>
            <Input
              id="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              placeholder="Ex: Bleu"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="purchase_date">Date d'achat</Label>
            <Input
              id="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={(e) => setFormData(prev => ({ ...prev, purchase_date: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Prix d'achat</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="Ex: 29.99"
            />
          </div>
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_for_sale"
              checked={formData.is_for_sale}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_for_sale: checked }))}
            />
            <Label htmlFor="is_for_sale" className="cursor-pointer">À vendre</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="needs_alteration"
              checked={formData.needs_alteration}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, needs_alteration: checked }))}
            />
            <Label htmlFor="needs_alteration" className="cursor-pointer">Nécessite des retouches</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Images</Label>
          <div className="flex items-center gap-4">
            {formData.image_url && (
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-md"
              />
            )}
            <div className="flex gap-2">
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
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Chargement...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4 mr-2" />
                        {formData.image_url ? "Changer l'image" : "Ajouter une image"}
                      </>
                    )}
                  </label>
                </Button>
              </div>

              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={scanLabel}
                  disabled={scanning}
                  className="hidden"
                  id="label-scan"
                />
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  disabled={scanning}
                >
                  <label htmlFor="label-scan" className="cursor-pointer">
                    {scanning ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyse...
                      </>
                    ) : (
                      <>
                        <ScanLine className="w-4 h-4 mr-2" />
                        Scanner l'étiquette
                      </>
                    )}
                  </label>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading || !formData.category}>
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
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
