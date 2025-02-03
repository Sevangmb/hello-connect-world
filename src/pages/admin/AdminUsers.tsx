import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  created_at: string;
  status: string;
  clothesCount: number;
  outfitsCount: number;
  followersCount: number;
  followingsCount: number;
  accountType: string;
  lastLogin: string;
  reportCount: number;
  is_admin: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching users...");
        const { data, error } = await supabase
          .from('profiles')
          .select('id, user_id, username, full_name, email, avatar_url, created_at, status, clothesCount, outfitsCount, followersCount, followingsCount, accountType, lastLogin, reportCount, is_admin')
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

  const handleToggleRole = async (id: string, current: boolean) => {
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
              <option value="">Statut du compte</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="banni">Banni</option>
            </select>
            <select className="border p-2 rounded">
              <option value="">Type de compte</option>
              <option value="Gratuit">Gratuit</option>
              <option value="Premium">Premium</option>
            </select>
          </div>
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer">ID Utilisateur</TableHead>
                    <TableHead className="cursor-pointer">Nom d'utilisateur</TableHead>
                    <TableHead className="cursor-pointer">Adresse email</TableHead>
                    <TableHead>Photo de profil</TableHead>
                    <TableHead className="cursor-pointer">Date d'inscription</TableHead>
                    <TableHead className="cursor-pointer">Statut du compte</TableHead>
                    <TableHead className="cursor-pointer">Nombre de vêtements</TableHead>
                    <TableHead className="cursor-pointer">Nombre de tenues créées</TableHead>
                    <TableHead className="cursor-pointer">Nombre d'abonnés</TableHead>
                    <TableHead className="cursor-pointer">Nombre d'abonnements</TableHead>
                    <TableHead className="cursor-pointer">Type de compte</TableHead>
                    <TableHead className="cursor-pointer">Dernière connexion</TableHead>
                    <TableHead className="cursor-pointer">Nombre de signalements</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.user_id || "Non défini"}</TableCell>
                      <TableCell>{user.username || "Non défini"}</TableCell>
                      <TableCell>{user.email ? `${user.email.substring(0, 3)}***${user.email.substring(user.email.indexOf("@"))}` : "Non défini"}</TableCell>
                      <TableCell>
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="Avatar" className="h-8 w-8 rounded-full" />
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>{format(new Date(user.created_at), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{user.status || "Non défini"}</TableCell>
                      <TableCell>{user.clothesCount}</TableCell>
                      <TableCell>{user.outfitsCount}</TableCell>
                      <TableCell>{user.followersCount}</TableCell>
                      <TableCell>{user.followingsCount}</TableCell>
                      <TableCell>{user.accountType}</TableCell>
                      <TableCell>{format(new Date(user.lastLogin), "dd/MM/yyyy")}</TableCell>
                      <TableCell>{user.reportCount}</TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" variant="outline">Modifier le profil</Button>
                        <Button size="sm" variant="outline">Suspendre/Bannir</Button>
                        <Button size="sm" variant="outline">Réinitialiser le mot de passe</Button>
                        <Button size="sm" variant="outline">Envoyer un message</Button>
                        <Button size="sm" variant="outline">Forcer le passage en Premium</Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">Supprimer</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                Confirmer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button size="sm" variant="outline">Exporter les données</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" className="rounded-l">Précédent</Button>
                <Button variant="outline" className="rounded-none">1</Button>
                <Button variant="outline" className="rounded-none">2</Button>
                <Button variant="outline" className="rounded-none">3</Button>
                <Button variant="outline" className="rounded-r">Suivant</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}