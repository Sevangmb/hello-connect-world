import React, { useState, useEffect }, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [activeShopsCount, setActiveShopsCount] = useState(0);
  const [salesData, setSalesData] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        const { count: shopCount } = await supabase
          .from('shops')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');

        const { data: salesRows, error: salesError } = await supabase
          .from('sales')
          .select('amount');
        let totalSales = 0;
        if (!salesError && salesRows) {
          totalSales = salesRows.reduce((acc: number, row: any) => acc + (row.amount || 0), 0);
        }
        setUsersCount(userCount || 0);
        setActiveShopsCount(shopCount || 0);
        setSalesData(totalSales);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Tableau de Bord</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <Tabs defaultValue="utilisateurs" className="w-full">
              <TabsList>
                <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
                <TabsTrigger value="engagement">Engagement et Activité</TabsTrigger>
                <TabsTrigger value="vide-dressing">Vide-Dressing</TabsTrigger>
                <TabsTrigger value="boutiques">Boutiques Locales</TabsTrigger>
                <TabsTrigger value="revenus">Revenus et Monétisation</TabsTrigger>
                <TabsTrigger value="techniques">Performances Techniques</TabsTrigger>
                <TabsTrigger value="marketing">Marketing</TabsTrigger>
              </TabsList>
              <TabsContent value="utilisateurs">
                <div className="text-2xl font-bold">{usersCount}</div>
                <p className="text-xs text-muted-foreground">Total des utilisateurs inscrits</p>
              </TabsContent>
              <TabsContent value="engagement">
                <p>En cours de développement</p>
              </TabsContent>
              <TabsContent value="vide-dressing">
                <p>En cours de développement</p>
              </TabsContent>
              <TabsContent value="boutiques">
                <div className="text-2xl font-bold">{activeShopsCount}</div>
                <p className="text-xs text-muted-foreground">Boutiques actives</p>
              </TabsContent>
              <TabsContent value="revenus">
                <div className="text-2xl font-bold">{salesData !== null ? salesData : "N/A"}</div>
                <p className="text-xs text-muted-foreground">Chiffre d'affaires total</p>
              </TabsContent>
              <TabsContent value="techniques">
                <p>En cours de développement</p>
              </TabsContent>
              <TabsContent value="marketing">
                <p>En cours de développement</p>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}