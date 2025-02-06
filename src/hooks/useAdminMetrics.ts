import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminMetrics {
  totalUsers: number;
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

export const useAdminMetrics = () => {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalUsers: 0,
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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        console.log("Fetching admin metrics...");
        
        // Fetch total users
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch new users (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { count: newUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', thirtyDaysAgo.toISOString());

        // Calculate growth rate
        const { count: previousPeriodUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .lt('created_at', thirtyDaysAgo.toISOString());

        const growthRate = previousPeriodUsers ? ((newUsers || 0) / previousPeriodUsers) * 100 : 0;

        // Fetch active users (users who logged in in the last 30 days)
        const { count: activeUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('updated_at', thirtyDaysAgo.toISOString());

        // Calculate retention rate
        const retentionRate = totalUsers ? (activeUsers || 0) / totalUsers * 100 : 0;

        // Calculate churn rate
        const churnRate = 100 - retentionRate;

        // Set the metrics
        setMetrics({
          totalUsers: totalUsers || 0,
          activeUsers: activeUsers || 0,
          newUsers: newUsers || 0,
          growthRate: parseFloat(growthRate.toFixed(2)),
          retentionRate: parseFloat(retentionRate.toFixed(2)),
          churnRate: parseFloat(churnRate.toFixed(2)),
          avgSessionDuration: 0, // Nécessite une implémentation de tracking côté client
          demographicDistribution: "N/A", // Nécessite des données démographiques
          premiumUsers: 0, // Nécessite une implémentation premium
          conversionRate: 0, // Nécessite une implémentation premium
        });

      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  return { metrics, loading };
};
