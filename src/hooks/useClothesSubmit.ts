
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ClothesFormData } from "@/components/clothes/types";

export const useClothesSubmit = (onSuccess: () => void) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submitClothes = async (formData: ClothesFormData) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

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
          price: Number(formData.price),
          purchase_date: formData.purchase_date || null,
          is_for_sale: formData.is_for_sale,
          needs_alteration: formData.needs_alteration,
        })
        .select()
        .single();

      if (clothingError) throw clothingError;

      if (formData.is_for_sale && clothingData) {
        const { data: shopData, error: shopError } = await supabase
          .from("shops")
          .select()
          .eq("user_id", user.id)
          .single();

        if (shopError) throw new Error("Vous devez d'abord créer une boutique");

        const { error: updateError } = await supabase
          .from("clothes")
          .update({ shop_id: shopData.id })
          .eq("id", clothingData.id);

        if (updateError) throw updateError;

        const { error: shopItemError } = await supabase
          .from("shop_items")
          .insert({
            shop_id: shopData.id,
            clothes_id: clothingData.id,
            price: Number(formData.price),
            status: "available"
          });

        if (shopItemError) throw shopItemError;
      }

      toast({
        title: "Vêtement ajouté",
        description: "Le vêtement a été ajouté à votre garde-robe" + 
          (formData.is_for_sale ? " et mis en vente dans votre boutique" : ""),
      });

      onSuccess();
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

  return { submitClothes, loading };
};
