import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [activeShopsCount, setActiveShopsCount] = useState(0);
  const [salesData, setSalesData] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch total users
        const { count: users } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        // Fetch active shops (status 'approved')
        const { count: shops } = await supabase
          .from('shops')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');
        // Fetch sales data and sum the 'amount' field
        const { data: salesRows, error: salesError } = await supabase
          .from('sales')
          .select('amount');
        let totalSales = 0;
        if (!salesError && salesRows) {
          totalSales = salesRows.reduce((acc: number, row: any) => acc + (row.amount || 0), 0);
        }
        setUsersCount(users || 0);
        setActiveShopsCount(shops || 0);
        setSalesData(totalSales);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMetrics();
  }, []);
  
  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersCount}</div>
              <p className="text-xs text-muted-foreground">Total des utilisateurs</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Boutiques Actives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeShopsCount}</div>
              <p className="text-xs text-muted-foreground">Boutiques approuvées</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ventes Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesData !== null ? salesData : "N/A"}</div>
              <p className="text-xs text-muted-foreground">Montant total des ventes</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}