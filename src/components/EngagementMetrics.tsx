
import React from "react";

interface EngagementMetricsProps {
  outfitsCreated: number;
  looksShared: number;
  votesCount: number;
  commentsCount: number;
  challengesCreated: number;
  challengesCompleted: number;
  privateMessagesCount: number;
  reportsCount: number;
  timeSpent: number;
  productPageViews: number;
  wishlistAdds: number;
  contentShares: number;
}

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
}: EngagementMetricsProps) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Engagement et Activité</h3>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <p className="text-sm">Tenues créées:</p>
        <p className="font-bold">{outfitsCreated}</p>
      </div>
      <div>
        <p className="text-sm">Looks partagés:</p>
        <p className="font-bold">{looksShared}</p>
      </div>
      <div>
        <p className="text-sm">Votes:</p>
        <p className="font-bold">{votesCount}</p>
      </div>
      <div>
        <p className="text-sm">Commentaires:</p>
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
        <p className="text-sm">Messages privés:</p>
        <p className="font-bold">{privateMessagesCount}</p>
      </div>
      <div>
        <p className="text-sm">Signalements:</p>
        <p className="font-bold">{reportsCount}</p>
      </div>
      <div>
        <p className="text-sm">Temps passé sur la plateforme:</p>
        <p className="font-bold">{timeSpent} min</p>
      </div>
      <div>
        <p className="text-sm">Vues des pages produit:</p>
        <p className="font-bold">{productPageViews}</p>
      </div>
      <div>
        <p className="text-sm">Ajouts en liste de souhaits:</p>
        <p className="font-bold">{wishlistAdds}</p>
      </div>
      <div>
        <p className="text-sm">Partages de contenu:</p>
        <p className="font-bold">{contentShares}</p>
      </div>
    </div>
  </div>
);

export default EngagementMetrics;
