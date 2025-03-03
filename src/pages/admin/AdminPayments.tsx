
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminPayments() {
  const transactions = [
    { id: "TX-1234", user: "Martin Dupont", amount: 49.99, status: "completed", method: "card", date: "2023-05-10" },
    { id: "TX-1235", user: "Sophie Martin", amount: 29.99, status: "pending", method: "paypal", date: "2023-05-09" },
    { id: "TX-1236", user: "Jean Leroy", amount: 99.99, status: "completed", method: "bank", date: "2023-05-08" },
    { id: "TX-1237", user: "Alice Dubois", amount: 19.99, status: "failed", method: "card", date: "2023-05-07" },
    { id: "TX-1238", user: "Thomas Bernard", amount: 59.99, status: "refunded", method: "paypal", date: "2023-05-06" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Paiements et Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Rechercher..." className="pl-8" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Transaction</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-mono">{transaction.id}</TableCell>
                  <TableCell>{transaction.user}</TableCell>
                  <TableCell>{transaction.amount} €</TableCell>
                  <TableCell>
                    <Badge variant={
                      transaction.status === "completed" ? "default" :
                      transaction.status === "pending" ? "outline" :
                      transaction.status === "failed" ? "destructive" :
                      "secondary"
                    }>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.method}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
