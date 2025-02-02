<code>
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalOutfits: number;
  totalChallenges: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  try {
    const [usersRes, postsRes, outfitsRes, challengesRes] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('outfits').select('*', { count: 'exact', head: true }),
      supabase.from('challenges').select('*', { count: 'exact', head: true })
    ]);

    return {
      totalUsers: usersRes.count || 0,
      totalPosts: postsRes.count || 0,
      totalOutfits: outfitsRes.count || 0,
      totalChallenges: challengesRes.count || 0
    };
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    throw error;
  }
}

export function transformStatsToChartData(stats: DashboardStats): Array<{ name: string; value: number }> {
  return [
    { name: "Utilisateurs", value: stats.totalUsers },
    { name: "Posts", value: stats.totalPosts },
    { name: "Tenues", value: stats.totalOutfits },
    { name: "Défis", value: stats.totalChallenges }
  ];
}
</code>
