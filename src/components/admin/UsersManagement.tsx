import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  UserCheck,
  UserX,
  Shield,
  ShieldOff,
  Trash,
  Edit,
} from "lucide-react";

type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  is_admin: boolean | null;
  created_at: string;
};

export function UsersManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des utilisateurs",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_admin: !currentStatus })
        .eq("id", userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, is_admin: !currentStatus }
          : user
      ));

      toast({
        title: "Succès",
        description: `Statut administrateur ${!currentStatus ? 'accordé' : 'retiré'}`,
      });
    } catch (error) {
      console.error("Error toggling admin status:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le statut administrateur",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur",
      });
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestion des utilisateurs</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom d'utilisateur</TableHead>
            <TableHead>Nom complet</TableHead>
            <TableHead>Date d'inscription</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username || "Non défini"}</TableCell>
              <TableCell>{user.full_name || "Non défini"}</TableCell>
              <TableCell>
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {user.is_admin ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Utilisateur
                  </span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                    title={user.is_admin ? "Retirer les droits admin" : "Donner les droits admin"}
                  >
                    {user.is_admin ? (
                      <ShieldOff className="h-4 w-4 text-red-500" />
                    ) : (
                      <Shield className="h-4 w-4 text-green-500" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteUser(user.id)}
                    title="Supprimer l'utilisateur"
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}