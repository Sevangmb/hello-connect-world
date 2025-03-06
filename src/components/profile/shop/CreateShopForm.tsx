import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Category } from "@/components/admin/settings/categories/useCategoryForm";
import { useCategories } from "@/hooks/useCategories";
import { MultiSelect } from "@/components/ui/multi-select";
import { Shop } from "@/core/shop/domain/types";
import { useCreateShop } from "@/hooks/useShop";
import { useAuth } from "@/modules/auth";

interface CreateShopFormProps {
  onSuccess?: () => void;
}

export function CreateShopForm({ onSuccess }: CreateShopFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  const useCreateShopResult = useCreateShop();

  const categoryOptions = categories ? categories.map((category: Category) => ({
    label: category.name,
    value: category.id,
  })) : [];

  const handleCategoryChange = (values: string[]) => {
    setSelectedCategories(values);
  };

  // Replace mutateAsync with execute and isPending with creating
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour créer une boutique",
          variant: "destructive",
        });
        return;
      }
      
      const shopData: Partial<Shop> = {
        name,
        description,
        user_id: user.id,
        address,
        phone,
        website,
        categories: selectedCategories,
        status: "pending",
      };
      
      // Use execute instead of mutateAsync
      await useCreateShopResult.execute(shopData);
      
      toast({
        title: "Boutique créée",
        description: "Votre boutique a été créée avec succès et est en attente de validation"
      });
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la création de la boutique",
        variant: "destructive"
      });
    }
  };

  // Change isPending to creating in button
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom de la boutique</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="address">Adresse</Label>
        <Input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="website">Site web</Label>
        <Input
          type="url"
          id="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div>
        <Label>Catégories</Label>
        <MultiSelect
          options={categoryOptions}
          value={selectedCategories}
          onChange={handleCategoryChange}
          isLoading={categoriesLoading}
          error={categoriesError}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full" 
        disabled={useCreateShopResult.creating || !name}>
        {useCreateShopResult.creating ? "Création en cours..." : "Créer ma boutique"}
      </Button>
    </form>
  );
}
