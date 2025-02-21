
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateChannelDialogProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChannelCreated: () => void;
}

export const CreateChannelDialog = ({
  groupId,
  open,
  onOpenChange,
  onChannelCreated,
}: CreateChannelDialogProps) => {
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDescription, setNewChannelDescription] = useState("");
  const { toast } = useToast();

  const createChannel = async () => {
    try {
      const { error } = await supabase
        .from('group_channels')
        .insert({
          group_id: groupId,
          name: newChannelName,
          description: newChannelDescription
        });

      if (error) throw error;

      toast({
        title: "Canal créé",
        description: "Le canal a été créé avec succès",
      });

      onOpenChange(false);
      setNewChannelName("");
      setNewChannelDescription("");
      onChannelCreated();
    } catch (error) {
      console.error('Error creating channel:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le canal",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouveau canal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Input
              placeholder="Nom du canal"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Description (optionnelle)"
              value={newChannelDescription}
              onChange={(e) => setNewChannelDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={createChannel} disabled={!newChannelName.trim()}>
              Créer le canal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
