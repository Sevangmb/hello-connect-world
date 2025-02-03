import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [activeShopsCount, setActiveShopsCount] = useState(0);
  const [salesData, setSalesData] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [mauCount, setMauCount] = useState(0);
  const [newUsersCount, setNewUsersCount] = useState(0);
  const [premiumUsers, setPremiumUsers] = useState({ premium: 0, free: 0 });
  const [conversionRate, setConversionRate] = useState("N/A");

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
  
        // Fetch Monthly Active Users (MAU) - users active in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { count: activeCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('last_active', thirtyDaysAgo.toISOString());
  
        // Fetch New Users in the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const { count: newUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo.toISOString());
  
        // Fetch Premium Users count (assuming is_premium boolean column)
        const { count: premiumCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_premium', true);
        const freeCount = (userCount || 0) - (premiumCount || 0);
  
        // Calculate conversion rate: percentage of free users converted to premium
        let conversion = "N/A";
        if ((userCount || 0) - (premiumCount || 0) > 0) {
          conversion = (((premiumCount || 0) / ((userCount || 0) - (premiumCount || 0))) * 100).toFixed(2) + "%";
        }
  
        setUsersCount(userCount || 0);
        setActiveShopsCount(shopCount || 0);
        setSalesData(totalSales);
        setMauCount(activeCount || 0);
        setNewUsersCount(newUsers || 0);
        setPremiumUsers({ premium: premiumCount || 0, free: freeCount });
        setConversionRate(conversion);
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Total des utilisateurs inscrits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usersCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Utilisateurs actifs (MAU)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mauCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Nouveaux utilisateurs (7 derniers jours)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{newUsersCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Utilisateurs Premium vs. Gratuits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {premiumUsers.premium} / {premiumUsers.free}
                  </div>
                  <p className="text-xs text-muted-foreground">Premium / Gratuits</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Taux de conversion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{conversionRate}</div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}