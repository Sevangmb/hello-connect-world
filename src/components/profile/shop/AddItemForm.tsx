
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShopItem, ShopItemStatus } from "@/core/shop/domain/types";
import { useCreateShopItem } from "@/hooks/useShop";

interface AddItemFormProps {
  shopId?: string;
  selectedCloth?: any;
  onSuccess?: () => void;
}

export function AddItemForm({ shopId, selectedCloth, onSuccess }: AddItemFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState<string>(selectedCloth?.name || "");
  const [description, setDescription] = useState<string>(selectedCloth?.description || "");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const createShopItem = useCreateShopItem();

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setStock("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!shopId) {
        toast({
          title: "Erreur",
          description: "Veuillez d'abord créer une boutique",
          variant: "destructive",
        });
        return;
      }
      
      const itemData: Partial<ShopItem> = {
        shop_id: shopId,
        clothes_id: selectedCloth?.id,
        name: name || selectedCloth?.name || "Article sans nom",
        description: description || selectedCloth?.description || "",
        price: Number(price),
        original_price: selectedCloth?.price ? Number(selectedCloth.price) : undefined,
        stock: Number(stock),
        image_url: selectedCloth?.image_url,
        status: "available" as ShopItemStatus
      };
      
      // Use execute instead of mutateAsync
      await createShopItem.execute(itemData);
      
      resetForm();
      toast({
        title: "Article ajouté",
        description: "L'article a été ajouté à votre boutique avec succès"
      });
      
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de l'ajout de l'article",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom de l'article</Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={selectedCloth?.name || "Nom de l'article"}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={selectedCloth?.description || "Description"}
        />
      </div>
      <div>
        <Label htmlFor="price">Prix</Label>
        <Input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Prix"
          required
        />
      </div>
      <div>
        <Label htmlFor="stock">Stock</Label>
        <Input
          type="number"
          id="stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={createShopItem.creating}>
        {createShopItem.creating ? "Ajout en cours..." : "Ajouter l'article"}
      </Button>
    </form>
  );
}
