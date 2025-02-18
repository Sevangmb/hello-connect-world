
import React from "react";

interface TechniquesMetricsProps {
  avgLoadingTime: number;
  errorRate: number;
  serverResourceUsage: string;
  concurrentUsers: number;
}

const TechniquesMetrics = ({
  avgLoadingTime,
  errorRate,
  serverResourceUsage,
  concurrentUsers,
}: TechniquesMetricsProps) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Performances Techniques</h3>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <p className="text-sm">Temps de chargement moyen:</p>
        <p className="font-bold">{avgLoadingTime}ms</p>
      </div>
      <div>
        <p className="text-sm">Taux d'erreur:</p>
        <p className="font-bold">{errorRate}%</p>
      </div>
      <div>
        <p className="text-sm">Utilisation des ressources:</p>
        <p className="font-bold">{serverResourceUsage}</p>
      </div>
      <div>
        <p className="text-sm">Utilisateurs simultanés:</p>
        <p className="font-bold">{concurrentUsers}</p>
      </div>
    </div>
  </div>
);

export default TechniquesMetrics;
