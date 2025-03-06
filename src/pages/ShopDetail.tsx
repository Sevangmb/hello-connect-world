
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { useShop } from "@/hooks/useShop";
import { ShopSettings } from "@/core/shop/domain/types";

export default function ShopDetail() {
  const { shopId } = useParams<{ shopId: string }>();
  const { getShopById, getShopSettings } = useShop();
  const shopQuery = getShopById(shopId || "");
  const settingsQuery = getShopSettings(shopId || "");
  
  const [settings, setSettings] = useState<ShopSettings | null>(null);

  useEffect(() => {
    if (settingsQuery.data) {
      setSettings(settingsQuery.data);
    }
  }, [settingsQuery.data]);

  if (shopQuery.isLoading) {
    return <div>Chargement de la boutique...</div>;
  }

  if (shopQuery.error) {
    return <div>Erreur lors du chargement de la boutique: {shopQuery.error.message}</div>;
  }

  if (!shopQuery.data) {
    return <div>Boutique non trouvée</div>;
  }

  const shop = shopQuery.data;

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-3xl font-bold mb-4">{shop.name}</h1>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">À propos de la boutique</h2>
          <p className="text-gray-700 mb-4">{shop.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-medium text-gray-900">Contact</h3>
              <p className="text-gray-700">
                {shop.phone ? `Téléphone: ${shop.phone}` : "Aucun téléphone spécifié"}
              </p>
              <p className="text-gray-700">
                {shop.address ? `Adresse: ${shop.address}` : "Aucune adresse spécifiée"}
              </p>
              <p className="text-gray-700">
                {shop.website ? (
                  <a href={shop.website} className="text-blue-600 hover:underline">
                    Site web: {shop.website}
                  </a>
                ) : (
                  "Aucun site web spécifié"
                )}
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900">Méthodes de paiement</h3>
              <ul className="list-disc list-inside text-gray-700">
                {settings?.payment_methods?.map((method) => (
                  <li key={method}>
                    {method === "card"
                      ? "Carte bancaire"
                      : method === "paypal"
                      ? "PayPal"
                      : method === "bank_transfer"
                      ? "Virement bancaire"
                      : "Espèces"}
                  </li>
                ))}
                {(!settings?.payment_methods || settings.payment_methods.length === 0) && (
                  <li>Aucune méthode de paiement spécifiée</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
