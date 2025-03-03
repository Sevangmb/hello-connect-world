
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Check, X, Flag, MessageSquare, Image } from "lucide-react";

export default function AdminModeration() {
  const contentItems = [
    { id: "post-123", type: "post", creator: "user123", status: "flagged", reason: "Contenu inapproprié", reports: 3, date: "2023-05-08" },
    { id: "comment-456", type: "comment", creator: "user456", status: "pending", reason: "Langage offensant", reports: 2, date: "2023-05-07" },
    { id: "image-789", type: "image", creator: "user789", status: "approved", reason: "Violence", reports: 1, date: "2023-05-06" },
    { id: "post-234", type: "post", creator: "user234", status: "rejected", reason: "Information erronée", reports: 4, date: "2023-05-05" }
  ];

  const pendingUsers = [
    { id: "user-123", username: "fashion_lover", email: "user123@example.com", violations: 0, registeredDate: "2023-05-08" },
    { id: "user-456", username: "style_guru", email: "user456@example.com", violations: 1, registeredDate: "2023-05-07" },
    { id: "user-789", username: "trend_setter", email: "user789@example.com", violations: 0, registeredDate: "2023-05-06" }
  ];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Flag className="h-4 w-4" />
            Contenu signalé
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Images
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenu en attente de modération</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Créateur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Raison du signalement</TableHead>
                    <TableHead>Nombre de signalements</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contentItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono">{item.id}</TableCell>
                      <TableCell>
                        {item.type === "post" && <Badge>Publication</Badge>}
                        {item.type === "comment" && <Badge variant="outline">Commentaire</Badge>}
                        {item.type === "image" && <Badge variant="secondary">Image</Badge>}
                      </TableCell>
                      <TableCell>{item.creator}</TableCell>
                      <TableCell>
                        <Badge variant={
                          item.status === "flagged" ? "destructive" :
                          item.status === "pending" ? "outline" :
                          item.status === "approved" ? "default" :
                          "secondary"
                        }>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.reason}</TableCell>
                      <TableCell>{item.reports}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-green-600">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs en attente de vérification</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom d'utilisateur</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Violations</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono">{user.id}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.violations}</TableCell>
                      <TableCell>{user.registeredDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-green-600">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="images" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Modération des images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="bg-gray-200 rounded-lg h-48 mb-3 flex items-center justify-center">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ID: img-123</span>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="bg-gray-200 rounded-lg h-48 mb-3 flex items-center justify-center">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ID: img-456</span>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="bg-gray-200 rounded-lg h-48 mb-3 flex items-center justify-center">
                    <Image className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ID: img-789</span>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
