import React from "react";

const EngagementMetrics = ({
  outfitsCreated,
  looksShared,
  votesCount,
  commentsCount,
  challengesCreated,
  challengesCompleted,
  privateMessagesCount,
  reportsCount,
  timeSpent,
  productPageViews,
  wishlistAdds,
  contentShares,
}) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Engagement et Activité</h3>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <p className="text-sm">Nombre de tenues créées:</p>
        <p className="font-bold">{outfitsCreated}</p>
      </div>
      <div>
        <p className="text-sm">Nombre de looks partagés:</p>
        <p className="font-bold">{looksShared}</p>
      </div>
      <div>
        <p className="text-sm">Nombre de votes (likes):</p>
        <p className="font-bold">{votesCount}</p>
      </div>
      <div>
        <p className="text-sm">Nombre de commentaires:</p>
        <p className="font-bold">{commentsCount}</p>
      </div>
      <div>
        <p className="text-sm">Défis créés:</p>
        <p className="font-bold">{challengesCreated}</p>
      </div>
      <div>
        <p className="text-sm">Défis complétés:</p>
        <p className="font-bold">{challengesCompleted}</p>
      </div>
      <div>
        <p className="text-sm">Messages envoyés (privé):</p>
        <p className="font-bold">{privateMessagesCount}</p>
      </div>
      <div>
        <p className="text-sm">Signalements effectués:</p>
        <p className="font-bold">{reportsCount}</p>
      </div>
      <div>
        <p className="text-sm">Temps moyen passé par utilisateur:</p>
        <p className="font-bold">{timeSpent} min</p>
      </div>
      <div>
        <p className="text-sm">Vues des pages produit:</p>
        <p className="font-bold">{productPageViews}</p>
      </div>
      <div>
        <p className="text-sm">Nombre d'ajouts à la liste de souhaits:</p>
        <p className="font-bold">{wishlistAdds}</p>
      </div>
      <div>
        <p className="text-sm">Nombre de partages de contenu:</p>
        <p className="font-bold">{contentShares}</p>
      </div>
    </div>
  </div>
);

export default EngagementMetrics;
