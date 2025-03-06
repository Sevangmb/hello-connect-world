
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Shop } from "@/core/shop/domain/types";
import { useShop } from "@/hooks/useShop";
import { supabase } from "@/integrations/supabase/client";

// Create a simple MultiSelect component since we don't have the one from import
function MultiSelect({ options, selected, onChange }: any) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map((option: any) => (
        <Button
          key={option.value}
          type="button"
          variant={selected.includes(option.value) ? "default" : "outline"}
          onClick={() => {
            const newSelected = selected.includes(option.value)
              ? selected.filter((v: string) => v !== option.value)
              : [...selected, option.value];
            onChange(newSelected);
          }}
          className="text-sm"
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}

export function CreateShopForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const { createShop } = useShop();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  // Mock categories for the MultiSelect
  const categoryOptions = [
    { label: "Vêtements", value: "clothing" },
    { label: "Chaussures", value: "shoes" },
    { label: "Accessoires", value: "accessories" },
    { label: "Vintage", value: "vintage" },
    { label: "Sport", value: "sports" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
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
        address,
        phone,
        website,
        categories,
        user_id: user.id,
        status: 'pending',
      };
      
      await createShop.mutate(shopData);
      
      toast({
        title: "Boutique créée",
        description: "Votre boutique a été créée avec succès"
      });
      
      // Reset form
      setName("");
      setDescription("");
      setAddress("");
      setPhone("");
      setWebsite("");
      setCategories([]);
      
      // Call success callback
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite lors de la création de la boutique",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom de la boutique</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de votre boutique"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrivez votre boutique"
          rows={4}
        />
      </div>
      
      <div>
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Adresse physique (optionnel)"
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Numéro de téléphone (optionnel)"
        />
      </div>
      
      <div>
        <Label htmlFor="website">Site web</Label>
        <Input
          id="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="Site web (optionnel)"
        />
      </div>
      
      <div>
        <Label>Catégories</Label>
        <MultiSelect
          options={categoryOptions}
          selected={categories}
          onChange={setCategories}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={createShop.isPending}
      >
        {createShop.isPending ? "Création en cours..." : "Créer ma boutique"}
      </Button>
    </form>
  );
}
