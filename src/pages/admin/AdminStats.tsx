import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminStats() {
  const [chartData, setChartData] = useState({});
  useEffect(() => {
    const data = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Utilisateurs',
          data: [65, 59, 80, 81, 56, 55],
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
        {
          label: 'Posts',
          data: [28, 48, 40, 19, 86, 27],
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
      ],
    };
    setChartData(data);
  }, []);
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Statistiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Bar 
              data={chartData} 
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Analyse mensuelle' },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}