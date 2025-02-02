// Added necessary hooks, table components and supabase integration for fetching stats
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
 
export default function AdminStats() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from("site_stats")
        .select("*");
      if (error) {
        setError(error.message);
      } else {
        setStats(data);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);
 
  if (loading) {
    return <div>Chargement...</div>;
  }
 
  if (error) {
    return <div>Erreur: {error}</div>;
  }
 
  const websiteStats = stats.filter((stat) => stat.category === "website");
  const contentStats = stats.filter((stat) => stat.category === "content");
 
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Statistiques du Site Web</CardTitle>
        </CardHeader>
        <CardContent>
          {websiteStats.length === 0 ? (
            <p>Aucune statistique disponible pour le site web.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Métrique</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead>Mise à jour</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {websiteStats.map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell>{stat.metric}</TableCell>
                    <TableCell>{stat.value}</TableCell>
                    <TableCell>{new Date(stat.updated_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Statistiques du Contenu</CardTitle>
        </CardHeader>
        <CardContent>
          {contentStats.length === 0 ? (
            <p>Aucune statistique disponible pour le contenu.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Métrique</TableHead>
                  <TableHead>Valeur</TableHead>
                  <TableHead>Mise à jour</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentStats.map((stat) => (
                  <TableRow key={stat.id}>
                    <TableCell>{stat.metric}</TableCell>
                    <TableCell>{stat.value}</TableCell>
                    <TableCell>{new Date(stat.updated_at).toLocaleString()}</TableCell>
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