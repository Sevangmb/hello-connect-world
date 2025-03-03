
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Key, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminApiKeys() {
  const { toast } = useToast();
  
  const apiKeys = [
    { id: "key_1", name: "Production API", key: "sk_prod_2f8d7e1c9b3a", created: "2023-01-15", lastUsed: "2023-05-10", status: "active" },
    { id: "key_2", name: "Testing API", key: "sk_test_5e8f3a2b1d9c", created: "2023-02-20", lastUsed: "2023-05-09", status: "active" },
    { id: "key_3", name: "Développement", key: "sk_dev_7a1b9c3d5e", created: "2023-03-05", lastUsed: "2023-04-28", status: "inactive" },
    { id: "key_4", name: "Intégration externe", key: "sk_int_4d2e6f8a0c", created: "2023-04-10", lastUsed: "2023-05-01", status: "active" }
  ];

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Clé copiée",
      description: "La clé API a été copiée dans le presse-papier."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Gestion des clés API</CardTitle>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle clé API
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Clé</TableHead>
                <TableHead>Créée le</TableHead>
                <TableHead>Dernière utilisation</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Key className="h-4 w-4 text-gray-500" />
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {apiKey.key.substring(0, 8)}...
                      </code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleCopyKey(apiKey.key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{apiKey.created}</TableCell>
                  <TableCell>{apiKey.lastUsed}</TableCell>
                  <TableCell>
                    <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>
                      {apiKey.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-600">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-sm font-medium mb-2">Note de sécurité</h3>
            <p className="text-sm text-gray-600">
              Les clés API donnent un accès complet à votre compte. Ne les partagez pas dans des environnements publics ou ne les committez pas dans votre code source.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
