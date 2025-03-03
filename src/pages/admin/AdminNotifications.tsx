
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Bell, Send, History, Settings, Smartphone, Mail, Globe } from "lucide-react";

export default function AdminNotifications() {
  const notificationTemplates = [
    { id: 1, name: "Bienvenue", type: "email", lastUpdated: "2023-05-01", status: true },
    { id: 2, name: "Réinitialisation de mot de passe", type: "email", lastUpdated: "2023-04-15", status: true },
    { id: 3, name: "Commande confirmée", type: "push", lastUpdated: "2023-04-10", status: true },
    { id: 4, name: "Nouvel article en stock", type: "push", lastUpdated: "2023-03-22", status: false },
    { id: 5, name: "Rappel d'événement", type: "sms", lastUpdated: "2023-03-15", status: true }
  ];

  const notificationHistory = [
    { id: 1, type: "push", recipients: 1243, title: "Nouvelle collection", sentAt: "2023-05-10 14:30", status: "delivered" },
    { id: 2, type: "email", recipients: 856, title: "Promotion printemps", sentAt: "2023-05-05 09:15", status: "delivered" },
    { id: 3, type: "sms", recipients: 412, title: "Événement exclusif", sentAt: "2023-04-28 16:45", status: "partial" },
    { id: 4, type: "push", recipients: 2156, title: "Mise à jour application", sentAt: "2023-04-20 11:30", status: "delivered" },
    { id: 5, type: "email", recipients: 1895, title: "Newsletter mensuelle", sentAt: "2023-04-01 10:00", status: "failed" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardDescription>Notifications envoyées (30j)</CardDescription>
            <CardTitle className="text-2xl">14,592</CardTitle>
          </CardHeader>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardDescription>Taux d'ouverture</CardDescription>
            <CardTitle className="text-2xl">68.3%</CardTitle>
          </CardHeader>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardDescription>Taux de désinscription</CardDescription>
            <CardTitle className="text-2xl">1.2%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="send">
        <TabsList>
          <TabsTrigger value="send" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Envoyer
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Modèles
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Envoyer une notification</CardTitle>
              <CardDescription>Créez et envoyez une notification aux utilisateurs de l'application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="notification-type">Type de notification</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="push">Notification push</option>
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="in-app">Dans l'application</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="audience">Audience</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="all">Tous les utilisateurs</option>
                      <option value="active">Utilisateurs actifs</option>
                      <option value="inactive">Utilisateurs inactifs</option>
                      <option value="new">Nouveaux utilisateurs</option>
                      <option value="custom">Segment personnalisé</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input id="title" placeholder="Titre de la notification" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Contenu</Label>
                  <Textarea
                    id="content"
                    placeholder="Contenu de la notification"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="schedule" />
                    <Label htmlFor="schedule">Programmer l'envoi</Label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" className="mr-2">Prévisualiser</Button>
                  <Button>Envoyer la notification</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Modèles de notification</CardTitle>
              <CardDescription>Gérez les modèles utilisés pour les notifications automatiques</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-end">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau modèle
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dernière mise à jour</TableHead>
                    <TableHead>Actif</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificationTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        {template.type === "email" && <Mail className="h-4 w-4 inline mr-1" />}
                        {template.type === "push" && <Bell className="h-4 w-4 inline mr-1" />}
                        {template.type === "sms" && <Smartphone className="h-4 w-4 inline mr-1" />}
                        {template.type}
                      </TableCell>
                      <TableCell>{template.lastUpdated}</TableCell>
                      <TableCell>
                        <Switch checked={template.status} />
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Modifier</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historique des notifications</CardTitle>
              <CardDescription>Consultez les notifications envoyées précédemment</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Destinataires</TableHead>
                    <TableHead>Date d'envoi</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notificationHistory.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        {notification.type === "email" && <Mail className="h-4 w-4 inline mr-1" />}
                        {notification.type === "push" && <Bell className="h-4 w-4 inline mr-1" />}
                        {notification.type === "sms" && <Smartphone className="h-4 w-4 inline mr-1" />}
                        {notification.type}
                      </TableCell>
                      <TableCell className="font-medium">{notification.title}</TableCell>
                      <TableCell>{notification.recipients}</TableCell>
                      <TableCell>{notification.sentAt}</TableCell>
                      <TableCell>
                        <Badge variant={
                          notification.status === "delivered" ? "default" :
                          notification.status === "partial" ? "outline" :
                          "destructive"
                        }>
                          {notification.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Détails</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notification</CardTitle>
              <CardDescription>Configurez les paramètres globaux pour les notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Canaux de notification</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-gray-500" />
                        <Label htmlFor="email-enabled">Email</Label>
                      </div>
                      <Switch id="email-enabled" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-5 w-5 text-gray-500" />
                        <Label htmlFor="push-enabled">Notifications push</Label>
                      </div>
                      <Switch id="push-enabled" checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-5 w-5 text-gray-500" />
                        <Label htmlFor="sms-enabled">SMS</Label>
                      </div>
                      <Switch id="sms-enabled" checked={false} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-5 w-5 text-gray-500" />
                        <Label htmlFor="in-app-enabled">Notifications in-app</Label>
                      </div>
                      <Switch id="in-app-enabled" checked={true} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Limites d'envoi</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rate-limit">Limite de débit (par minute)</Label>
                      <Input id="rate-limit" type="number" defaultValue="500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="daily-limit">Limite quotidienne par utilisateur</Label>
                      <Input id="daily-limit" type="number" defaultValue="5" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Enregistrer les paramètres</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
