
import React from "react";

interface AdminMetricsOverviewProps {
  metrics: {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    retentionRate: number;
    growthRate: number;
    churnRate: number;
  };
}

export function AdminMetricsOverview({ metrics }: AdminMetricsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-muted-foreground">Utilisateurs</h3>
        <p className="text-2xl font-bold">{metrics.totalUsers}</p>
        <p className="text-xs text-muted-foreground">
          <span className="text-green-500">+{metrics.newUsers}</span> nouveaux ce mois
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-muted-foreground">Actifs</h3>
        <p className="text-2xl font-bold">{metrics.activeUsers}</p>
        <p className="text-xs text-muted-foreground">
          Taux de rétention: {metrics.retentionRate}%
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-muted-foreground">Croissance</h3>
        <p className="text-2xl font-bold">{metrics.growthRate}%</p>
        <p className="text-xs text-muted-foreground">
          Par rapport au mois précédent
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-sm font-medium text-muted-foreground">Taux d'abandon</h3>
        <p className="text-2xl font-bold">{metrics.churnRate}%</p>
        <p className="text-xs text-muted-foreground">
          Utilisateurs inactifs
        </p>
      </div>
    </div>
  );
}
