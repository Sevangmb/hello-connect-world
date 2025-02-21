
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GroupChat } from "@/components/messages/GroupChat";
import { GroupDetails } from "./GroupDetails";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GroupViewProps {
  groupId: string;
  onBack: () => void;
}

export const GroupView = ({ groupId, onBack }: GroupViewProps) => {
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchGroup();
    fetchMembers();
  }, [groupId]);

  const fetchGroup = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (error) throw error;
      setGroup(data);
    } catch (error) {
      console.error('Erreur lors de la récupération du groupe:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les détails du groupe",
      });
    }
  };

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          *,
          profiles(username, avatar_url)
        `)
        .eq('group_id', groupId);

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des membres:', error);
    }
  };

  if (!group) return null;

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* Liste des membres */}
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="font-bold">{group.name}</h2>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Paramètres du groupe</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <GroupDetails groupId={groupId} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-2 pr-4">
              {members.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.profiles.avatar_url || ""} />
                      <AvatarFallback>
                        {member.profiles.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {member.profiles.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        {member.role === 'admin' ? 'Administrateur' : 'Membre'}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Zone de chat */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm">
          <GroupChat groupId={groupId} groupName={group.name} />
        </div>
      </div>
    </div>
  );
};
