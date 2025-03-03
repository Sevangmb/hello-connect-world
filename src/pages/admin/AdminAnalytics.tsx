
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon, Calendar } from "lucide-react";

export default function AdminAnalytics() {
  const visitorData = [
    { name: "Jan", visitors: 4000, pageViews: 2400 },
    { name: "Fév", visitors: 3000, pageViews: 1398 },
    { name: "Mar", visitors: 2000, pageViews: 9800 },
    { name: "Avr", visitors: 2780, pageViews: 3908 },
    { name: "Mai", visitors: 1890, pageViews: 4800 },
    { name: "Juin", visitors: 2390, pageViews: 3800 },
    { name: "Juil", visitors: 3490, pageViews: 4300 }
  ];

  const conversionData = [
    { name: "Jan", rate: 3.2 },
    { name: "Fév", rate: 3.5 },
    { name: "Mar", rate: 2.8 },
    { name: "Avr", rate: 4.1 },
    { name: "Mai", rate: 3.9 },
    { name: "Juin", rate: 3.3 },
    { name: "Juil", rate: 4.5 }
  ];

  const kpiCards = [
    { title: "Utilisateurs actifs", value: "12,543", change: "+12.3%", trend: "up" },
    { title: "Nouveaux utilisateurs", value: "2,350", change: "+5.7%", trend: "up" },
    { title: "Taux de rebond", value: "42.8%", change: "-2.1%", trend: "down" },
    { title: "Durée moyenne de session", value: "3m 42s", change: "+0.8%", trend: "up" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardDescription>{card.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className={`text-xs ${card.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {card.change} par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="visitors">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="visitors" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Visiteurs
            </TabsTrigger>
            <TabsTrigger value="conversions" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              Conversions
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Engagement
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            Derniers 7 mois
          </div>
        </div>

        <TabsContent value="visitors">
          <Card>
            <CardHeader>
              <CardTitle>Visiteurs et pages vues</CardTitle>
              <CardDescription>Analyse du trafic sur l'application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={visitorData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visitors" name="Visiteurs" fill="#8884d8" />
                    <Bar dataKey="pageViews" name="Pages vues" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions">
          <Card>
            <CardHeader>
              <CardTitle>Taux de conversion</CardTitle>
              <CardDescription>Pourcentage de visiteurs qui complètent une action</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={conversionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="rate" name="Taux (%)" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Engagement utilisateur</CardTitle>
              <CardDescription>Comment les utilisateurs interagissent avec l'application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                Données d'engagement en cours de chargement...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
