
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useMessages = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('private_messages')
        .select(`
          id,
          content,
          created_at,
          sender:profiles!private_messages_sender_id_fkey(
            id, username, avatar_url
          ),
          receiver:profiles!private_messages_receiver_id_fkey(
            id, username, avatar_url
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const conversationsMap = new Map();
      data?.forEach(message => {
        const partner = message.sender.id === user.id ? message.receiver : message.sender;
        if (!conversationsMap.has(partner.id)) {
          conversationsMap.set(partner.id, {
            user: partner,
            lastMessage: message,
          });
        }
      });

      setConversations(Array.from(conversationsMap.values()));
    } catch (error: any) {
      console.error("Error fetching conversations:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les conversations",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();

    // Abonnement aux changements en temps réel
    const channel = supabase
      .channel('private_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'private_messages'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    conversations,
    loading,
    refreshConversations: fetchConversations
  };
};
