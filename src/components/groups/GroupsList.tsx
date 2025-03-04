
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GroupView } from "./GroupView";

interface GroupsListProps {
  onChatSelect?: (group: { id: string; name: string }) => void;
}

export const GroupsList = ({ onChatSelect }: GroupsListProps) => {
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<{ id: string; name: string } | null>(null);
  const { toast } = useToast();

  const fetchGroups = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          members:group_members(
            profiles(username, avatar_url),
            role
          )
        `);

      if (error) throw error;
      console.log("Groupes récupérés:", data);
      setGroups(data || []);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des groupes:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les groupes",
      });
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleGroupSelect = (group: { id: string; name: string }) => {
    if (onChatSelect) {
      onChatSelect(group);
    } else {
      setSelectedGroup(group);
    }
  };

  if (selectedGroup && !onChatSelect) {
    return (
      <GroupView
        groupId={selectedGroup.id}
        onBack={() => setSelectedGroup(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button onClick={() => window.dispatchEvent(new CustomEvent('create-group'))}>
          <Plus className="h-4 w-4 mr-2" />
          Créer un groupe
        </Button>
      </div>

      {groups.length === 0 ? (
        <p className="text-muted-foreground">Aucun groupe trouvé</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Card 
              key={group.id} 
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => handleGroupSelect(group)}
            >
              <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
              {group.description && (
                <p className="text-muted-foreground mb-4">{group.description}</p>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{group.members?.length || 0} membres</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
