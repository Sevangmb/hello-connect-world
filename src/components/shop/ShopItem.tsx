import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const ShopItem = ({ item, setItems, items }) => {
  const { toast } = useToast();

  const addItemToCart = async () => {
    const { error } = await supabase
      .from("cart")
      .insert(item);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'article au panier",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Succès",
        description: "Article ajouté au panier",
        variant: "success",
      });
      setItems([...items, item]);
    }
  };

  return (
    <li>
      {item.name}
      <button onClick={addItemToCart}>Ajouter au panier</button>
    </li>
  );
};
