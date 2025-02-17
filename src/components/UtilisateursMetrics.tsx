import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const UtilisateursMetrics = ({
  usersCount,
  activeUsers,
  newUsers,
  growthRate,
  retentionRate,
  churnRate,
  avgSessionDuration,
  demographicDistribution,
  premiumUsers,
  conversionRate,
}) => {
  const [calculatedMetrics, setCalculatedMetrics] = useState({
    usersCount: 0,
    activeUsers: 0,
    newUsers: 0,
    growthRate: 0,
    retentionRate: 0,
    churnRate: 0,
    avgSessionDuration: 0,
    demographicDistribution: "N/A",
    premiumUsers: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        const { count: newUsersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(new Date().setDate(new Date().getDate() - 30)).toISOString());

        // Remplacez les valeurs ci-dessous par les requêtes réelles pour chaque métrique
        const activeUsersCount = 0;
        const growthRateValue = 0;
        const retentionRateValue = 0;
        const churnRateValue = 0;
        const avgSessionDurationValue = 0;
        const demographicDistributionValue = "N/A";
        const premiumUsersCount = 0;
        const conversionRateValue = 0;

        setCalculatedMetrics({
          usersCount: userCount || 0,
          activeUsers: activeUsersCount,
          newUsers: newUsersCount || 0,
          growthRate: growthRateValue,
          retentionRate: retentionRateValue,
          churnRate: churnRateValue,
          avgSessionDuration: avgSessionDurationValue,
          demographicDistribution: demographicDistributionValue,
          premiumUsers: premiumUsersCount,
          conversionRate: conversionRateValue,
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Utilisateurs</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-sm">Utilisateurs inscrits:</p>
          <p className="font-bold">{calculatedMetrics.usersCount}</p>
        </div>
        <div>
          <p className="text-sm">Utilisateurs actifs (MAU):</p>
          <p className="font-bold">{calculatedMetrics.activeUsers}</p>
        </div>
        <div>
          <p className="text-sm">Nouveaux utilisateurs:</p>
          <p className="font-bold">{calculatedMetrics.newUsers}</p>
        </div>
        <div>
          <p className="text-sm">Taux de croissance:</p>
          <p className="font-bold">{calculatedMetrics.growthRate}%</p>
        </div>
        <div>
          <p className="text-sm">Taux de rétention:</p>
          <p className="font-bold">{calculatedMetrics.retentionRate}%</p>
        </div>
        <div>
          <p className="text-sm">Taux de churn:</p>
          <p className="font-bold">{calculatedMetrics.churnRate}%</p>
        </div>
        <div>
          <p className="text-sm">Durée moyenne des sessions:</p>
          <p className="font-bold">{calculatedMetrics.avgSessionDuration} min</p>
        </div>
        <div>
          <p className="text-sm">Répartition démographique:</p>
          <p className="font-bold">{calculatedMetrics.demographicDistribution}</p>
        </div>
        <div>
          <p className="text-sm">Utilisateurs Premium:</p>
          <p className="font-bold">{calculatedMetrics.premiumUsers}</p>
        </div>
        <div>
          <p className="text-sm">Taux de conversion (Gratuits {'->'} Premium):</p>
          <p className="font-bold">{calculatedMetrics.conversionRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default UtilisateursMetrics;
