import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  visibility: string;
  is_admin: boolean | null;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        console.log("Users fetched:", data);
        setUsers(data || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les utilisateurs",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleToggleRole = async (id: string, current: boolean | null) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !current })
        .eq('id', id);
      if (error) throw error;
      setUsers(users.map(user => user.id === id ? { ...user, is_admin: !current } : user));
      toast({
        title: "Rôle mis à jour",
        description: `L'utilisateur a été ${!current ? "promu" : "rétrogradé"}`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setUsers(users.filter(user => user.id !== id));
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
      });
    }
  };
  
  const handleEditProfile = (id: string) => {
    toast({
      title: "Modifier le profil",
      description: `Modification du profil pour l'utilisateur ${id} simulée.`,
    });
  };
  
  const handleSuspendUser = (id: string) => {
    toast({
      title: "Suspendre le compte",
      description: `Le compte de l'utilisateur ${id} a été suspendu (simulation).`,
    });
  };
  
  const handleBanUser = (id: string) => {
    toast({
      title: "Bannir le compte",
      description: `L'utilisateur ${id} a été banni (simulation).`,
    });
  };
  
  const handleResetPassword = (id: string) => {
    toast({
      title: "Réinitialiser le mot de passe",
      description: `Réinitialisation du mot de passe pour l'utilisateur ${id} simulée.`,
    });
  };
  
  const handleSendMessage = (id: string) => {
    toast({
      title: "Envoyer un message",
      description: `Message envoyé à l'utilisateur ${id} (simulation).`,
    });
  };
  
  const handleForcePremium = (id: string) => {
    toast({
      title: "Forcer le passage en Premium",
      description: `L'utilisateur ${id} est forcé à passer en Premium (simulation).`,
    });
  };
  
  const handleExportData = (id: string) => {
    toast({
      title: "Exporter les données",
      description: `Les données de l'utilisateur ${id} ont été exportées (simulation).`,
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col md:flex-row gap-2">
            <input 
              type="text" 
              placeholder="Rechercher un utilisateur..." 
              className="border p-2 rounded"
            />
            <select className="border p-2 rounded">
              <option value="">Visibilité</option>
              <option value="public">Public</option>
              <option value="private">Privé</option>
            </select>
          </div>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom d'utilisateur</TableHead>
                    <TableHead>Nom complet</TableHead>
                    <TableHead>Avatar</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead>Visibilité</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>{user.username || "Non défini"}</TableCell>
                      <TableCell>{user.full_name || "Non défini"}</TableCell>
                      <TableCell>
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="Avatar" className="h-8 w-8 rounded-full" />
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(user.created_at), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{user.visibility}</TableCell>
                      <TableCell>{user.is_admin ? "Oui" : "Non"}</TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditProfile(user.id)}>
                          Modifier le profil
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSuspendUser(user.id)}>
                          Suspendre le compte
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleBanUser(user.id)}>
                          Bannir le compte
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleResetPassword(user.id)}>
                          Réinitialiser le mot de passe
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleSendMessage(user.id)}>
                          Envoyer un message
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleForcePremium(user.id)}>
                          Forcer le passage en Premium
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleExportData(user.id)}>
                          Exporter les données
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline">Précédent</Button>
                <Button variant="outline">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Suivant</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;