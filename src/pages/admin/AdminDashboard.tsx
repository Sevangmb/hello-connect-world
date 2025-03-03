
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";
import { AreaChart, BarChart, DonutChart } from "@tremor/react";
import { AdminCheck } from "@/components/admin/settings/AdminCheck";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart2, 
  Users, 
  TrendingUp, 
  ShoppingBag,
  Bell,
  Smartphone,
  PersonStanding,
  Laptop
} from "lucide-react";

const metrics = [
  {
    month: "Jan",
    "Utilisateurs": 2890,
    "Visites": 6800,
  },
  {
    month: "Fév",
    "Utilisateurs": 2756,
    "Visites": 7100,
  },
  {
    month: "Mar",
    "Utilisateurs": 3322,
    "Visites": 8500,
  },
  {
    month: "Avr",
    "Utilisateurs": 3470,
    "Visites": 9100,
  },
  {
    month: "Mai",
    "Utilisateurs": 3475,
    "Visites": 8700,
  },
  {
    month: "Juin",
    "Utilisateurs": 3129,
    "Visites": 7600,
  },
];

const deviceData = [
  {
    name: "Mobile",
    value: 68,
  },
  {
    name: "Desktop",
    value: 27,
  },
  {
    name: "Tablette",
    value: 5,
  },
];

export default function AdminDashboard() {
  const { metrics: adminMetrics, loading } = useAdminMetrics();

  return (
    <AdminCheck>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
          <Badge variant="outline" className="text-xs">
            Dernière mise à jour: {new Date().toLocaleDateString()}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Utilisateurs Totaux
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : adminMetrics.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +{loading ? "..." : adminMetrics.newUsers} nouveaux ce mois
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taux de rétention
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : adminMetrics.retentionRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? "..." : adminMetrics.activeUsers} utilisateurs actifs
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Nouvelles commandes
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+23.1%</div>
              <p className="text-xs text-muted-foreground">
                Depuis le mois dernier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Notifications
              </CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+9%</div>
              <p className="text-xs text-muted-foreground">
                Taux d'engagement
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="analytics">Analytique</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Utilisateurs et visites</CardTitle>
                  <CardDescription>
                    Tendances mensuelles
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <AreaChart
                    className="h-72"
                    data={metrics}
                    index="month"
                    categories={["Utilisateurs", "Visites"]}
                    colors={["indigo", "cyan"]}
                    valueFormatter={(value) => new Intl.NumberFormat("fr").format(value)}
                    yAxisWidth={60}
                  />
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Appareils utilisés</CardTitle>
                  <CardDescription>
                    Répartition des connexions
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <DonutChart
                    className="h-52"
                    data={deviceData}
                    category="value"
                    index="name"
                    valueFormatter={(value) => `${value}%`}
                    colors={["cyan", "indigo", "emerald"]}
                  />
                </CardContent>
                <div className="flex justify-center gap-8 px-8 py-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-cyan-500" />
                    <span className="text-xs font-medium">Mobile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-indigo-500" />
                    <span className="text-xs font-medium">Desktop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PersonStanding className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-medium">Tablette</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytique</CardTitle>
                <CardDescription>
                  Performances détaillées de la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  className="h-72"
                  data={metrics}
                  index="month"
                  categories={["Utilisateurs", "Visites"]}
                  colors={["indigo", "cyan"]}
                  valueFormatter={(value) => new Intl.NumberFormat("fr").format(value)}
                  yAxisWidth={60}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analyse des utilisateurs</CardTitle>
                <CardDescription>
                  Données démographiques et comportementales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Les données détaillées des utilisateurs seront disponibles prochainement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>
                  Journal des dernières actions sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Les données d'activité détaillées seront disponibles prochainement.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminCheck>
  );
}
