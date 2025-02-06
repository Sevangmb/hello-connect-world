import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface SiteStat {
  id: number;
  category: string;
  metric: string;
  value: number;
  updated_at: string;
}

export default function AdminStats() {
  const [stats, setStats] = useState<SiteStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("Fetching site stats...");
        const { data, error } = await supabase
          .from('site_stats')
          .select('*')
          .order('category', { ascending: true });

        if (error) throw error;
        console.log("Stats fetched:", data);
        setStats(data || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Statistiques du Site</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Métrique</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead>Mise à jour</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell className="capitalize">{stat.category}</TableCell>
                    <TableCell>{stat.metric}</TableCell>
                    <TableCell>{stat.value}</TableCell>
                    <TableCell>{format(new Date(stat.updated_at), "dd/MM/yyyy HH:mm")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
