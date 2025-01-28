import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserPlus, Users, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchFriends } from "@/components/friends/SearchFriends";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GroupDetailsProps {
  groupId: string;
}

export const GroupDetails = ({ groupId }: GroupDetailsProps) => {
  const [members, setMembers] = useState<any[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
    fetchCurrentUserRole();
  }, [groupId]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          *,
          profiles:user_id(
            id,
            username,
            avatar_url
          )
        `)
        .eq('group_id', groupId);

      if (error) throw error;
      console.log("Membres du groupe:", data);
      setMembers(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des membres:', error);
    }
  };

  const fetchCurrentUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('group_members')
        .select('role')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setCurrentUserRole(data?.role);
    } catch (error) {
      console.error('Erreur lors de la récupération du rôle:', error);
    }
  };

  const handleAddMember = async (friend: { id: string; username: string }) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: friend.id,
          role: 'member'
        });

      if (error) throw error;

      toast({
        title: "Membre ajouté",
        description: `${friend.username} a été ajouté au groupe`,
      });

      fetchMembers();
      setShowAddMember(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du membre:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le membre",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', memberId);

      if (error) throw error;

      toast({
        title: "Membre retiré",
        description: "Le membre a été retiré du groupe",
      });

      fetchMembers();
    } catch (error) {
      console.error('Erreur lors du retrait du membre:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de retirer le membre",
      });
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Membres du groupe</h3>
        {currentUserRole === 'admin' && (
          <Button onClick={() => setShowAddMember(true)} variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Ajouter un membre
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.user_id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={member.profiles.avatar_url} />
                <AvatarFallback>
                  {member.profiles.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{member.profiles.username}</p>
                <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
              </div>
            </div>
            {currentUserRole === 'admin' && member.role !== 'admin' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveMember(member.user_id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un membre</DialogTitle>
          </DialogHeader>
          <SearchFriends onSelect={handleAddMember} />
        </DialogContent>
      </Dialog>
    </Card>
  );
};