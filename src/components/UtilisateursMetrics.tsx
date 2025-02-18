
import React from "react";

interface UtilisateursMetricsProps {
  usersCount: number;
  activeUsers: number;
  newUsers: number;
  growthRate: number;
  retentionRate: number;
  churnRate: number;
  avgSessionDuration: number;
  demographicDistribution: string;
  premiumUsers: number;
  conversionRate: number;
}

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
}: UtilisateursMetricsProps) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Utilisateurs</h3>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <p className="text-sm">Nombre total d'utilisateurs:</p>
        <p className="font-bold">{usersCount}</p>
      </div>
      <div>
        <p className="text-sm">Utilisateurs actifs:</p>
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
        <p className="text-sm">Taux d'attrition:</p>
        <p className="font-bold">{churnRate}%</p>
      </div>
      <div>
        <p className="text-sm">Durée moyenne de session:</p>
        <p className="font-bold">{avgSessionDuration} min</p>
      </div>
      <div>
        <p className="text-sm">Distribution démographique:</p>
        <p className="font-bold">{demographicDistribution}</p>
      </div>
      <div>
        <p className="text-sm">Utilisateurs premium:</p>
        <p className="font-bold">{premiumUsers}</p>
      </div>
      <div>
        <p className="text-sm">Taux de conversion:</p>
        <p className="font-bold">{conversionRate}%</p>
      </div>
    </div>
  </div>
);

export default UtilisateursMetrics;
