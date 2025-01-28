import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const AddFriend = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      // Rechercher l'utilisateur par son nom d'utilisateur
      const { data: foundUser, error: searchError } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('username', username)
        .single();

      if (searchError || !foundUser) {
        throw new Error("Utilisateur non trouvé");
      }

      if (foundUser.id === user.id) {
        throw new Error("Vous ne pouvez pas vous ajouter vous-même");
      }

      // Vérifier si une demande d'ami existe déjà
      const { data: existingFriendship, error: checkError } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${foundUser.id}),and(user_id.eq.${foundUser.id},friend_id.eq.${user.id})`)
        .single();

      if (existingFriendship) {
        throw new Error("Une demande d'ami existe déjà avec cet utilisateur");
      }

      // Créer la demande d'ami
      const { error: createError } = await supabase
        .from('friendships')
        .insert({
          user_id: user.id,
          friend_id: foundUser.id,
          status: 'pending'
        });

      if (createError) throw createError;

      toast({
        title: "Demande envoyée",
        description: `Demande d'ami envoyée à ${username}`,
      });

      setUsername("");
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout d\'ami:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-2xl font-bold mb-4">Ajouter un ami</h2>
      <form onSubmit={handleAddFriend} className="flex gap-2">
        <Input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </form>
    </Card>
  );
};