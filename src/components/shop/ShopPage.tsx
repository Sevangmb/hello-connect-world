import React, { useEffect, useState } from "react";
import { CheckoutButton } from "./CheckoutButton";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const ShopPage = () => {
  const [items, setItems] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCartItems = async () => {
      const { data: cartItems, error } = await supabase
        .from("cart")
        .select("*");

      if (error) {
        console.error("Erreur lors de la récupération des éléments du panier:", error);
      } else {
        setItems(cartItems);
      }
    };

    fetchCartItems();
  }, []);

  const addItemToCart = async (item) => {
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
    <div>
      <h1>Mon panier</h1>
      {items.length === 0 ? (
        <p>Votre panier est vide</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
      <button onClick={() => addItemToCart({ id: "1", name: "Article 1" })}>
        Ajouter un article
      </button>
      <CheckoutButton items={items} />
    </div>
  );
};

export default ShopPage;
