import React, { useEffect, useState } from "react";
import { CheckoutButton } from "./CheckoutButton";
import { supabase } from "@/integrations/supabase/client";

const ShopPage = () => {
  const [items, setItems] = useState([]);

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
      <CheckoutButton items={items} />
    </div>
  );
};

export default ShopPage;
