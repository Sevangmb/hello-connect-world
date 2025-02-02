<code>
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const Stats: React.FC = () => {
  // Dummy data for stat cards
  const statCards = [
    { title: "Utilisateurs Total", value: 1200 },
    { title: "Boutiques Total", value: 300 },
    { title: "Posts Total", value: 800 },
    { title: "Défis Total", value: 50 }
  ];

  // Dummy monthly bar chart data
  const barChartData = [
    { name: "Janvier", utilisateurs: 100, boutiques: 20 },
    { name: "Février", utilisateurs: 120, boutiques: 25 },
    { name: "Mars", utilisateurs: 150, boutiques: 30 },
    { name: "Avril", utilisateurs: 180, boutiques: 35 },
    { name: "Mai", utilisateurs: 170, boutiques: 40 },
    { name: "Juin", utilisateurs: 200, boutiques: 45 }
  ];

  // Dummy weekly line chart data
  const lineChartData = [
    { name: "S1", valeur: 400 },
    { name: "S2", valeur: 300 },
    { name: "S3", valeur: 500 },
    { name: "S4", valeur: 700 },
    { name: "S5", valeur: 600 },
    { name: "S6", valeur: 800 }
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bar Chart Card */}
      <Card>
        <CardHeader>
          <CardTitle>Croissance Mensuelle des Utilisateurs & Boutiques</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="utilisateurs" name="Utilisateurs" fill="#8884d8" />
              <Bar dataKey="boutiques" name="Boutiques" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Line Chart Card */}
      <Card>
        <CardHeader>
          <CardTitle>Croissance Hebdomadaire des Utilisateurs & Boutiques</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="valeur" name="Valeur" stroke="#ff7300" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
</code>