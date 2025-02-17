import React from "react";

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
}) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Utilisateurs</h3>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <p className="text-sm">Utilisateurs inscrits:</p>
        <p className="font-bold">{usersCount}</p>
      </div>
      <div>
        <p className="text-sm">Utilisateurs actifs (MAU):</p>
        <p className="font-bold">{activeUsers}</p>
      </div>
      <div>
        <p className="text-sm">Nouveaux utilisateurs:</p>
        <p className="font-bold">{newUsers}</p>
      </div>
      <div>
        <p className="text-sm">Taux de croissance:</p>
        <p className="font-bold">{growthRate}%</p>
      </div>
      <div>
        <p className="text-sm">Taux de rétention:</p>
        <p className="font-bold">{retentionRate}%</p>
      </div>
      <div>
        <p className="text-sm">Taux de churn:</p>
        <p className="font-bold">{churnRate}%</p>
      </div>
      <div>
        <p className="text-sm">Durée moyenne des sessions:</p>
        <p className="font-bold">{avgSessionDuration} min</p>
      </div>
      <div>
        <p className="text-sm">Répartition démographique:</p>
        <p className="font-bold">{demographicDistribution}</p>
      </div>
      <div>
        <p className="text-sm">Utilisateurs Premium:</p>
        <p className="font-bold">{premiumUsers}</p>
      </div>
      <div>
        <p className="text-sm">Taux de conversion (Gratuits {'->'} Premium):</p>
        <p className="font-bold">{conversionRate}%</p>
      </div>
    </div>
  </div>
);

export default UtilisateursMetrics;
