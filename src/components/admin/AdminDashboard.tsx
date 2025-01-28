import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShoppingBag, MessageSquare, TrendingUp } from "lucide-react";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalShops: 0,
    totalPosts: 0,
    activeUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total users
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Fetch total posts
        const { count: postsCount } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true });

        // Update stats
        setStats({
          totalUsers: usersCount || 0,
          totalShops: 0, // To be implemented when shops table is created
          totalPosts: postsCount || 0,
          activeUsers: 0, // To be implemented with user activity tracking
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Utilisateurs",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Boutiques",
      value: stats.totalShops,
      icon: ShoppingBag,
      color: "text-green-600",
    },
    {
      title: "Publications",
      value: stats.totalPosts,
      icon: MessageSquare,
      color: "text-purple-600",
    },
    {
      title: "Utilisateurs actifs",
      value: stats.activeUsers,
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Tableau de bord</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for future charts and detailed statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Les graphiques d'activité seront affichés ici
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques détaillées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Les statistiques détaillées seront affichées ici
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}