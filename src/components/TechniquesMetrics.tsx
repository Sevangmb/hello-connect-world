import React from "react";

const TechniquesMetrics = ({
  avgLoadingTime,
  errorRate,
  serverResourceUsage,
  concurrentUsers,
}) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Performances Techniques</h3>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <p className="text-sm">Temps de chargement moyen:</p>
        <p className="font-bold">{avgLoadingTime} s</p>
      </div>
      <div>
        <p className="text-sm">Taux d'erreur/crash:</p>
        <p className="font-bold">{errorRate}%</p>
      </div>
      <div>
        <p className="text-sm">Utilisation des ressources serveur:</p>
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
