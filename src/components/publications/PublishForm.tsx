
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export const PublishForm = () => {
  const [content, setContent] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("");
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  // Fetch available groups for the user
  const { data: groups } = useQuery({
    queryKey: ["user-groups"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data: groups, error } = await supabase
        .from("groups")
        .select(`
          id,
          name,
          group_members!inner (user_id)
        `)
        .eq("group_members.user_id", user.id);

      if (error) throw error;
      return groups;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !selectedGroup) return;

    try {
      setIsPublishing(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { error } = await supabase
        .from("publications")
        .insert({
          content: content.trim(),
          user_id: user.id,
          group_id: selectedGroup,
        });

      if (error) throw error;

      setContent("");
      toast({
        title: "Publication créée",
        description: "Votre message a été publié avec succès",
      });
    } catch (error: any) {
      console.error("Erreur lors de la publication:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Select
          value={selectedGroup}
          onValueChange={setSelectedGroup}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choisir où publier" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {groups?.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Textarea
        placeholder="Que voulez-vous partager ?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[100px]"
      />

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPublishing || !content.trim() || !selectedGroup}
        >
          {isPublishing ? "Publication en cours..." : "Publier"}
        </Button>
      </div>
    </form>
  );
};
