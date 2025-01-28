import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

export default function AdminSettings() {
  const [stats, setStats] = useState({
    dailyUsers: [],
    postsByCategory: [],
    userGrowth: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupérer les utilisateurs par jour
        const { data: dailyUsers } = await supabase
          .from('profiles')
          .select('created_at')
          .order('created_at');

        // Récupérer les posts par catégorie
        const { data: posts } = await supabase
          .from('posts')
          .select('created_at, visibility');

        // Transformer les données pour les graphiques
        const usersByDay = processUserData(dailyUsers || []);
        const postCategories = processPostData(posts || []);
        const growthData = calculateGrowth(dailyUsers || []);

        setStats({
          dailyUsers: usersByDay,
          postsByCategory: postCategories,
          userGrowth: growthData,
        });

      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error);
      }
    };

    fetchStats();
  }, []);

  // Fonction pour traiter les données utilisateurs par jour
  const processUserData = (users: any[]) => {
    const usersByDay: { [key: string]: number } = {};
    users.forEach(user => {
      const date = new Date(user.created_at).toLocaleDateString();
      usersByDay[date] = (usersByDay[date] || 0) + 1;
    });

    return Object.entries(usersByDay).map(([date, count]) => ({
      date,
      users: count,
    }));
  };

  // Fonction pour traiter les données des posts
  const processPostData = (posts: any[]) => {
    const categories: { [key: string]: number } = {};
    posts.forEach(post => {
      const visibility = post.visibility || 'unknown';
      categories[visibility] = (categories[visibility] || 0) + 1;
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Fonction pour calculer la croissance
  const calculateGrowth = (users: any[]) => {
    const monthlyGrowth: { [key: string]: number } = {};
    users.forEach(user => {
      const month = new Date(user.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
      monthlyGrowth[month] = (monthlyGrowth[month] || 0) + 1;
    });

    return Object.entries(monthlyGrowth).map(([month, users]) => ({
      month,
      users,
    }));
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Paramètres et Statistiques</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Graphique des utilisateurs quotidiens */}
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs par jour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  users: {
                    theme: {
                      light: "#2563eb",
                      dark: "#3b82f6",
                    },
                  },
                }}
              >
                <AreaChart data={stats.dailyUsers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="var(--color-users)"
                    fill="var(--color-users)"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Graphique des posts par catégorie */}
        <Card>
          <CardHeader>
            <CardTitle>Posts par visibilité</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  value: {
                    theme: {
                      light: "#16a34a",
                      dark: "#22c55e",
                    },
                  },
                }}
              >
                <BarChart data={stats.postsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip />
                  <Bar dataKey="value" fill="var(--color-value)" />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Graphique de croissance */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Croissance mensuelle des utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  users: {
                    theme: {
                      light: "#9333ea",
                      dark: "#a855f7",
                    },
                  },
                }}
              >
                <LineChart data={stats.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="var(--color-users)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}