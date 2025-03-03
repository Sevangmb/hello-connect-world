
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Upload, 
  Database, 
  Calendar, 
  Check, 
  Clock, 
  AlertCircle,
  HardDrive,
  FileArchive
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

export default function AdminBackup() {
  const { toast } = useToast();
  const [restoreInProgress, setRestoreInProgress] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);

  const backups = [
    { 
      id: "backup-20230510", 
      name: "Sauvegarde complète", 
      date: "2023-05-10 02:00", 
      size: "1.2 GB", 
      status: "success", 
      type: "auto" 
    },
    { 
      id: "backup-20230509", 
      name: "Sauvegarde complète", 
      date: "2023-05-09 02:00", 
      size: "1.1 GB", 
      status: "success", 
      type: "auto" 
    },
    { 
      id: "backup-20230508", 
      name: "Sauvegarde manuelle", 
      date: "2023-05-08 15:30", 
      size: "1.1 GB", 
      status: "success", 
      type: "manual" 
    },
    { 
      id: "backup-20230507", 
      name: "Sauvegarde complète", 
      date: "2023-05-07 02:00", 
      size: "1.1 GB", 
      status: "success", 
      type: "auto" 
    },
    { 
      id: "backup-20230506", 
      name: "Sauvegarde complète", 
      date: "2023-05-06 02:00", 
      size: "1.0 GB", 
      status: "failed", 
      type: "auto" 
    }
  ];

  const startRestoreSimulation = () => {
    setRestoreInProgress(true);
    setRestoreProgress(0);
    
    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRestoreInProgress(false);
          toast({
            title: "Restauration terminée",
            description: "La base de données a été restaurée avec succès.",
          });
          return 100;
        }
        return prev + 5;
      });
    }, 500);
  };

  const handleStartBackup = () => {
    toast({
      title: "Sauvegarde lancée",
      description: "Une nouvelle sauvegarde a été démarrée. Vous serez notifié une fois terminée."
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Dernière sauvegarde</CardDescription>
            <CardTitle className="text-lg font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              10 Mai 2023, 02:00
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-sm text-green-600 flex items-center">
              <Check className="h-4 w-4 mr-1" /> Réussie
            </span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taille totale</CardDescription>
            <CardTitle className="text-lg font-medium flex items-center">
              <HardDrive className="h-4 w-4 mr-2 text-gray-500" />
              5.5 GB
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-sm text-gray-600 flex items-center">
              <Clock className="h-4 w-4 mr-1" /> 5 sauvegardes conservées
            </span>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>État du stockage</CardDescription>
            <CardTitle className="text-lg font-medium flex items-center">
              <Database className="h-4 w-4 mr-2 text-gray-500" />
              73% utilisé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={73} className="h-2" />
            <span className="text-sm text-gray-600 mt-2 block">
              14.6 GB disponibles
            </span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Sauvegardes de la base de données</CardTitle>
            <CardDescription>Historique et gestion des sauvegardes</CardDescription>
          </div>
          <Button onClick={handleStartBackup}>
            <Database className="mr-2 h-4 w-4" />
            Nouvelle sauvegarde
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sauvegarde</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Taille</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileArchive className="h-4 w-4 mr-2 text-gray-500" />
                      {backup.name}
                    </div>
                  </TableCell>
                  <TableCell>{backup.date}</TableCell>
                  <TableCell>{backup.size}</TableCell>
                  <TableCell>
                    <Badge variant={backup.type === "auto" ? "outline" : "default"}>
                      {backup.type === "auto" ? "Automatique" : "Manuelle"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {backup.status === "success" ? (
                      <span className="flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        Réussie
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Échouée
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={backup.status !== "success"}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
                      </Button>
                      <Button
                        variant={backup.id === "backup-20230510" ? "default" : "outline"}
                        size="sm"
                        disabled={backup.status !== "success" || restoreInProgress}
                        onClick={() => backup.id === "backup-20230510" && startRestoreSimulation()}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Restaurer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {restoreInProgress && (
            <div className="mt-6 p-4 border rounded-lg bg-blue-50">
              <h3 className="text-sm font-medium mb-2 text-blue-700">Restauration en cours...</h3>
              <Progress value={restoreProgress} className="h-2 mb-2" />
              <p className="text-sm text-blue-600">
                {restoreProgress}% - Veuillez ne pas fermer cette page ou interrompre le processus.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres de sauvegarde</CardTitle>
          <CardDescription>Configuration des sauvegardes automatiques</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fréquence</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Quotidienne</option>
                  <option>Hebdomadaire</option>
                  <option>Mensuelle</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Heure</label>
                <select className="w-full p-2 border rounded-md">
                  <option>02:00</option>
                  <option>04:00</option>
                  <option>06:00</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rétention</label>
              <select className="w-full p-2 border rounded-md">
                <option>Conserver les 5 dernières sauvegardes</option>
                <option>Conserver les 10 dernières sauvegardes</option>
                <option>Conserver les sauvegardes des 30 derniers jours</option>
              </select>
            </div>

            <div className="flex justify-end">
              <Button>Enregistrer les paramètres</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
