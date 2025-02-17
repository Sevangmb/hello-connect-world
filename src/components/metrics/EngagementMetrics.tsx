
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
}) => {
  const [calculatedMetrics, setCalculatedMetrics] = useState({
    outfitsCreated: 0,
    looksShared: 0,
    votesCount: 0,
    commentsCount: 0,
    challengesCreated: 0,
    challengesCompleted: 0,
    privateMessagesCount: 0,
    reportsCount: 0,
    timeSpent: 0,
    productPageViews: 0,
    wishlistAdds: 0,
    contentShares: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Remplacez les valeurs ci-dessous par les requêtes réelles pour chaque métrique
        const outfitsCreatedCount = 0;
        const looksSharedCount = 0;
        const votesCountValue = 0;
        const commentsCountValue = 0;
        const challengesCreatedCount = 0;
        const challengesCompletedCount = 0;
        const privateMessagesCountValue = 0;
        const reportsCountValue = 0;
        const timeSpentValue = 0;
        const productPageViewsCount = 0;
        const wishlistAddsCount = 0;
        const contentSharesCount = 0;

        setCalculatedMetrics({
          outfitsCreated: outfitsCreatedCount,
          looksShared: looksSharedCount,
          votesCount: votesCountValue,
          commentsCount: commentsCountValue,
          challengesCreated: challengesCreatedCount,
          challengesCompleted: challengesCompletedCount,
          privateMessagesCount: privateMessagesCountValue,
          reportsCount: reportsCountValue,
          timeSpent: timeSpentValue,
          productPageViews: productPageViewsCount,
          wishlistAdds: wishlistAddsCount,
          contentShares: contentSharesCount,
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Engagement et Activité</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-sm">Nombre de tenues créées:</p>
          <p className="font-bold">{calculatedMetrics.outfitsCreated}</p>
        </div>
        <div>
          <p className="text-sm">Nombre de looks partagés:</p>
          <p className="font-bold">{calculatedMetrics.looksShared}</p>
        </div>
        <div>
          <p className="text-sm">Nombre de votes (likes):</p>
          <p className="font-bold">{calculatedMetrics.votesCount}</p>
        </div>
        <div>
          <p className="text-sm">Nombre de commentaires:</p>
          <p className="font-bold">{calculatedMetrics.commentsCount}</p>
        </div>
        <div>
          <p className="text-sm">Défis créés:</p>
          <p className="font-bold">{calculatedMetrics.challengesCreated}</p>
        </div>
        <div>
          <p className="text-sm">Défis complétés:</p>
          <p className="font-bold">{calculatedMetrics.challengesCompleted}</p>
        </div>
        <div>
          <p className="text-sm">Messages envoyés (privé):</p>
          <p className="font-bold">{calculatedMetrics.privateMessagesCount}</p>
        </div>
        <div>
          <p className="text-sm">Signalements effectués:</p>
          <p className="font-bold">{calculatedMetrics.reportsCount}</p>
        </div>
        <div>
          <p className="text-sm">Temps moyen passé par utilisateur:</p>
          <p className="font-bold">{calculatedMetrics.timeSpent} min</p>
        </div>
        <div>
          <p className="text-sm">Vues des pages produit:</p>
          <p className="font-bold">{calculatedMetrics.productPageViews}</p>
        </div>
        <div>
          <p className="text-sm">Nombre d'ajouts à la liste de souhaits:</p>
          <p className="font-bold">{calculatedMetrics.wishlistAdds}</p>
        </div>
        <div>
          <p className="text-sm">Nombre de partages de contenu:</p>
          <p className="font-bold">{calculatedMetrics.contentShares}</p>
        </div>
      </div>
    </div>
  );
};

export default EngagementMetrics;