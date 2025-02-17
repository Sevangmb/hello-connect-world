import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const BoutiquesMetrics = ({
  registeredShops,
  activeShopsCount,
  itemsOnline,
  shopViewCount,
  favoritesCount,
  subscriptionsCount,
  shopMessages,
  clickAndCollectCount,
  itemReservations,
  appointmentBookings,
  storeConversionRate,
}) => {
  const [calculatedMetrics, setCalculatedMetrics] = useState({
    registeredShops: 0,
    activeShopsCount: 0,
    itemsOnline: 0,
    shopViewCount: 0,
    favoritesCount: 0,
    subscriptionsCount: 0,
    shopMessages: 0,
    clickAndCollectCount: 0,
    itemReservations: 0,
    appointmentBookings: 0,
    storeConversionRate: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Remplacez les valeurs ci-dessous par les requêtes réelles pour chaque métrique
        const registeredShopsCount = 0;
        const activeShopsCountValue = 0;
        const itemsOnlineCount = 0;
        const shopViewCountValue = 0;
        const favoritesCountValue = 0;
        const subscriptionsCountValue = 0;
        const shopMessagesCount = 0;
        const clickAndCollectCountValue = 0;
        const itemReservationsCount = 0;
        const appointmentBookingsCount = 0;
        const storeConversionRateValue = 0;

        setCalculatedMetrics({
          registeredShops: registeredShopsCount,
          activeShopsCount: activeShopsCountValue,
          itemsOnline: itemsOnlineCount,
          shopViewCount: shopViewCountValue,
          favoritesCount: favoritesCountValue,
          subscriptionsCount: subscriptionsCountValue,
          shopMessages: shopMessagesCount,
          clickAndCollectCount: clickAndCollectCountValue,
          itemReservations: itemReservationsCount,
          appointmentBookings: appointmentBookingsCount,
          storeConversionRate: storeConversionRateValue,
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Boutiques Locales</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-sm">Boutiques inscrites:</p>
          <p className="font-bold">{calculatedMetrics.registeredShops}</p>
        </div>
        <div>
          <p className="text-sm">Boutiques actives:</p>
          <p className="font-bold">{calculatedMetrics.activeShopsCount}</p>
        </div>
        <div>
          <p className="text-sm">Articles en ligne:</p>
          <p className="font-bold">{calculatedMetrics.itemsOnline}</p>
        </div>
        <div>
          <p className="text-sm">Vues des vitrines:</p>
          <p className="font-bold">{calculatedMetrics.shopViewCount}</p>
        </div>
        <div>
          <p className="text-sm">Favoris:</p>
          <p className="font-bold">{calculatedMetrics.favoritesCount}</p>
        </div>
        <div>
          <p className="text-sm">Abonnements:</p>
          <p className="font-bold">{calculatedMetrics.subscriptionsCount}</p>
        </div>
        <div>
          <p className="text-sm">Messages aux boutiques:</p>
          <p className="font-bold">{calculatedMetrics.shopMessages}</p>
        </div>
        <div>
          <p className="text-sm">Click-and-collect:</p>
          <p className="font-bold">{calculatedMetrics.clickAndCollectCount}</p>
        </div>
        <div>
          <p className="text-sm">Réservations d'article:</p>
          <p className="font-bold">{calculatedMetrics.itemReservations}</p>
        </div>
        <div>
          <p className="text-sm">Prises de rendez-vous:</p>
          <p className="font-bold">{calculatedMetrics.appointmentBookings}</p>
        </div>
        <div>
          <p className="text-sm">Taux de conversion (vitrine {'->'} magasin):</p>
          <p className="font-bold">{calculatedMetrics.storeConversionRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default BoutiquesMetrics;
