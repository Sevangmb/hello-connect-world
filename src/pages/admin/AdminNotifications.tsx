
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Check, 
  Filter, 
  MoreHorizontal, 
  Plus as PlusIcon, 
  Trash2, 
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function AdminNotifications() {
  const [selectedType, setSelectedType] = useState("all");
  const { toast } = useToast();
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationContent, setNotificationContent] = useState("");
  const [notificationType, setNotificationType] = useState("info");
  const [targetAudience, setTargetAudience] = useState("all_users");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "Nouvelle fonctionnalité",
      content: "Le module de paiement a été mis à jour",
      type: "info",
      recipients: "all_users",
      sent: "2023-05-10",
      status: "delivered",
      opens: 245,
      clicks: 120,
    },
    {
      id: 2,
      title: "Maintenance prévue",
      content: "Le système sera indisponible le 15 mai de 2h à 4h",
      type: "warning",
      recipients: "shop_owners",
      sent: "2023-05-09",
      status: "scheduled",
      opens: 0,
      clicks: 0,
    },
    {
      id: 3,
      title: "Problème résolu",
      content: "Le problème avec les images de profil a été résolu",
      type: "success",
      recipients: "admins",
      sent: "2023-05-08",
      status: "delivered",
      opens: 15,
      clicks: 8,
    },
    {
      id: 4,
      title: "Erreur système",
      content: "Une erreur est survenue lors du traitement des paiements",
      type: "error",
      recipients: "all_users",
      sent: "2023-05-07",
      status: "failed",
      opens: 0,
      clicks: 0,
    },
  ];

  const handleSendNotification = () => {
    toast({
      title: "Notification envoyée",
      description: "La notification a été envoyée avec succès",
    });
    setIsDialogOpen(false);
    setNotificationTitle("");
    setNotificationContent("");
  };

  const filteredNotifications = selectedType === "all" 
    ? notifications 
    : notifications.filter(n => n.type === selectedType);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notifications du système
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="info">Information</SelectItem>
                <SelectItem value="warning">Avertissement</SelectItem>
                <SelectItem value="success">Succès</SelectItem>
                <SelectItem value="error">Erreur</SelectItem>
              </SelectContent>
            </Select>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Nouvelle notification
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Créer une notification</DialogTitle>
                  <DialogDescription>
                    Envoyez une notification aux utilisateurs de la plateforme
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="title" className="text-right">
                      Titre
                    </label>
                    <Input
                      id="title"
                      value={notificationTitle}
                      onChange={(e) => setNotificationTitle(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="type" className="text-right">
                      Type
                    </label>
                    <Select value={notificationType} onValueChange={setNotificationType}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Information</SelectItem>
                        <SelectItem value="warning">Avertissement</SelectItem>
                        <SelectItem value="success">Succès</SelectItem>
                        <SelectItem value="error">Erreur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="audience" className="text-right">
                      Destinataires
                    </label>
                    <Select value={targetAudience} onValueChange={setTargetAudience}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Sélectionnez les destinataires" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_users">Tous les utilisateurs</SelectItem>
                        <SelectItem value="shop_owners">Propriétaires de boutiques</SelectItem>
                        <SelectItem value="admins">Administrateurs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="content" className="text-right">
                      Contenu
                    </label>
                    <Textarea
                      id="content"
                      value={notificationContent}
                      onChange={(e) => setNotificationContent(e.target.value)}
                      className="col-span-3"
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="button" onClick={handleSendNotification}>
                    Envoyer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Destinataires</TableHead>
                <TableHead>Date d'envoi</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Ouvertures</TableHead>
                <TableHead>Clics</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        notification.type === "info" ? "default" :
                        notification.type === "warning" ? "warning" :
                        notification.type === "success" ? "success" :
                        "destructive"
                      }
                    >
                      {notification.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {notification.recipients === "all_users" ? "Tous les utilisateurs" :
                       notification.recipients === "shop_owners" ? "Boutiques" : "Admins"}
                    </Badge>
                  </TableCell>
                  <TableCell>{notification.sent}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        notification.status === "delivered" ? "bg-green-100 text-green-800" :
                        notification.status === "scheduled" ? "bg-blue-100 text-blue-800" :
                        notification.status === "failed" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {notification.status}
                    </span>
                  </TableCell>
                  <TableCell>{notification.opens}</TableCell>
                  <TableCell>{notification.clicks}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                        <DropdownMenuItem>Renvoyer</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
