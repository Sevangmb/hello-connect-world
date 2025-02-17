import React from "react";

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
}) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Boutiques Locales</h3>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <p className="text-sm">Boutiques inscrites:</p>
        <p className="font-bold">{registeredShops}</p>
      </div>
      <div>
        <p className="text-sm">Boutiques actives:</p>
        <p className="font-bold">{activeShopsCount}</p>
      </div>
      <div>
        <p className="text-sm">Articles en ligne:</p>
        <p className="font-bold">{itemsOnline}</p>
      </div>
      <div>
        <p className="text-sm">Vues des vitrines:</p>
        <p className="font-bold">{shopViewCount}</p>
      </div>
      <div>
        <p className="text-sm">Favoris:</p>
        <p className="font-bold">{favoritesCount}</p>
      </div>
      <div>
        <p className="text-sm">Abonnements:</p>
        <p className="font-bold">{subscriptionsCount}</p>
      </div>
      <div>
        <p className="text-sm">Messages aux boutiques:</p>
        <p className="font-bold">{shopMessages}</p>
      </div>
      <div>
        <p className="text-sm">Click-and-collect:</p>
        <p className="font-bold">{clickAndCollectCount}</p>
      </div>
      <div>
        <p className="text-sm">Réservations d'article:</p>
        <p className="font-bold">{itemReservations}</p>
      </div>
      <div>
        <p className="text-sm">Prises de rendez-vous:</p>
        <p className="font-bold">{appointmentBookings}</p>
      </div>
      <div>
        <p className="text-sm">Taux de conversion (vitrine {'->'} magasin):</p>
        <p className="font-bold">{storeConversionRate}%</p>
      </div>
    </div>
  </div>
);

export default BoutiquesMetrics;
