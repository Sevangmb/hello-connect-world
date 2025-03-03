
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Eye, Flag } from "lucide-react";

export default function AdminReports() {
  const reports = [
    { id: 1, type: "Contenu inapproprié", submitter: "user123", target: "post_456", status: "En attente", date: "2023-05-10" },
    { id: 2, type: "Harcèlement", submitter: "user789", target: "comment_123", status: "Examiné", date: "2023-05-09" },
    { id: 3, type: "Spam", submitter: "user456", target: "user_789", status: "Résolu", date: "2023-05-08" },
    { id: 4, type: "Violation de copyright", submitter: "user234", target: "article_567", status: "En attente", date: "2023-05-07" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            Rapports et Signalements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Signalé par</TableHead>
                <TableHead>Cible</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.id}</TableCell>
                  <TableCell>{report.type}</TableCell>
                  <TableCell>{report.submitter}</TableCell>
                  <TableCell>{report.target}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      report.status === "En attente" ? "bg-yellow-100 text-yellow-800" :
                      report.status === "Examiné" ? "bg-blue-100 text-blue-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
