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

interface GroupViewProps {
  groupId: string;
  onBack: () => void;
}

export const GroupView = ({ groupId, onBack }: GroupViewProps) => {
  const [group, setGroup] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  const fetchGroup = async () => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      if (error) throw error;
      console.log("Détails du groupe:", data);
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

  if (!group) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold">{group.name}</h2>
        </div>

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

      <GroupChat groupId={groupId} groupName={group.name} />
    </div>
  );
};