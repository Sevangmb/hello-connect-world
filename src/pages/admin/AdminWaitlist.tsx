
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Mail, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  reason: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

const AdminWaitlist = () => {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEntries, setFilteredEntries] = useState<WaitlistEntry[]>([]);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isTogglingRegistration, setIsTogglingRegistration] = useState(false);

  useEffect(() => {
    fetchWaitlist();
    fetchRegistrationStatus();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEntries(entries);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = entries.filter(
        entry => 
          (entry.email && entry.email.toLowerCase().includes(query)) ||
          (entry.name && entry.name.toLowerCase().includes(query)) ||
          (entry.reason && entry.reason.toLowerCase().includes(query))
      );
      setFilteredEntries(filtered);
    }
  }, [searchQuery, entries]);

  const fetchWaitlist = async () => {
    try {
      setLoading(true);
      // Récupération des entrées de la liste d'attente
      const { data, error } = await supabase
        .from("waitlist")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setEntries(data as WaitlistEntry[]);
      setFilteredEntries(data as WaitlistEntry[]);
    } catch (error) {
      console.error("Erreur lors de la récupération de la liste d'attente:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer la liste d'attente",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'registration_open')
        .single();
      
      if (error) {
        // Si le paramètre n'existe pas, on le crée avec une valeur par défaut
        if (error.code === 'PGRST116') {
          await supabase
            .from('site_settings')
            .insert({ 
              key: 'registration_open', 
              value: { is_open: false } 
            });
          setIsRegistrationOpen(false);
        } else {
          console.error("Erreur lors de la récupération du statut des inscriptions:", error);
        }
        return;
      }
      
      if (data && typeof data.value === 'object' && data.value !== null && !Array.isArray(data.value)) {
        // Ensure the value is an object and not an array before accessing is_open
        const settingsValue = data.value as { is_open?: boolean };
        setIsRegistrationOpen(settingsValue.is_open === true);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const toggleRegistrationStatus = async () => {
    try {
      setIsTogglingRegistration(true);
      
      const newStatus = !isRegistrationOpen;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilisateur non authentifié");
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({ 
          key: 'registration_open', 
          value: { is_open: newStatus },
          updated_by: user.id 
        });

      if (error) throw error;

      setIsRegistrationOpen(newStatus);
      toast({
        title: "Statut mis à jour",
        description: `Les inscriptions sont maintenant ${newStatus ? "ouvertes" : "fermées"}`,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut des inscriptions:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut des inscriptions",
      });
    } finally {
      setIsTogglingRegistration(false);
    }
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("waitlist")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `Le statut a été changé pour "${status}"`,
      });

      setEntries(prevEntries =>
        prevEntries.map(entry =>
          entry.id === id ? { ...entry, status } : entry
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("waitlist")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Entrée supprimée",
        description: "L'entrée a été supprimée avec succès",
      });

      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'entrée",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion de la liste d'attente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch 
                id="registration-status" 
                checked={isRegistrationOpen}
                onCheckedChange={toggleRegistrationStatus}
                disabled={isTogglingRegistration}
              />
              <Label htmlFor="registration-status" className="font-medium">
                {isRegistrationOpen ? "Inscriptions ouvertes" : "Inscriptions fermées (liste d'attente active)"}
              </Label>
              {isTogglingRegistration && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            <Button onClick={() => fetchWaitlist()} variant="outline">
              Actualiser
            </Button>
          </div>
          
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par email, nom ou message..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Aucune inscription trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        {entry.email}
                      </div>
                    </TableCell>
                    <TableCell>{entry.name || "Non spécifié"}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {entry.reason || "Non spécifié"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(entry.created_at), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        entry.status === "approved" 
                          ? "bg-green-100 text-green-800" 
                          : entry.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {entry.status === "approved" 
                          ? "Approuvé" 
                          : entry.status === "rejected"
                          ? "Rejeté"
                          : "En attente"
                        }
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant={entry.status === "approved" ? "default" : "outline"}
                          onClick={() => updateStatus(entry.id, "approved")}
                          disabled={entry.status === "approved"}
                        >
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant={entry.status === "rejected" ? "destructive" : "outline"}
                          onClick={() => updateStatus(entry.id, "rejected")}
                          disabled={entry.status === "rejected"}
                        >
                          Rejeter
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">Supprimer</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer cette entrée ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(entry.id)}>
                                Confirmer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWaitlist;
