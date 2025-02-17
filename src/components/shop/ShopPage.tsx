import React from "react";
import { CheckoutButton } from "./CheckoutButton";

const ShopPage = () => {
  const items = [
    { id: "1", name: "Produit 1", price: 100, quantity: 1, shop_id: "shop1", seller_id: "seller1" },
    { id: "2", name: "Produit 2", price: 200, quantity: 2, shop_id: "shop1", seller_id: "seller1" }
  ];

  return (
    <div>
      <CheckoutButton items={items} />
    </div>
  );
};

export default ShopPage;
