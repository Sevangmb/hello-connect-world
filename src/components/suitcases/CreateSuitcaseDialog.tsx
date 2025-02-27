
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreateSuitcaseForm } from "./forms/CreateSuitcaseForm";

export const CreateSuitcaseDialog = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (values: any) => {
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("suitcases")
        .insert({
          name: values.name,
          description: values.description || null,
          start_date: values.startDate ? values.startDate.toISOString() : null,
          end_date: values.endDate ? values.endDate.toISOString() : null,
          user_id: user.id,
          status: "active"
        });

      if (error) throw error;

      toast({
        title: "Valise créée",
        description: "Votre valise a été créée avec succès",
      });

      queryClient.invalidateQueries({ queryKey: ["suitcases"] });
      setOpen(false);
    } catch (error: any) {
      console.error("Error creating suitcase:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer la valise",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Créer une valise
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle valise</DialogTitle>
          <DialogDescription>
            Remplissez les champs ci-dessous pour créer une nouvelle valise
          </DialogDescription>
        </DialogHeader>
        <CreateSuitcaseForm onSubmit={handleSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
};
