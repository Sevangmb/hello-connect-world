
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Conversation } from "@/types/messages";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    
    getCurrentUser();
  }, []);

  /**
   * Récupère toutes les conversations de l'utilisateur
   */
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
          sender_id,
          receiver_id,
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

      // Regrouper les messages par conversation
      const conversationsMap = new Map<string, Conversation>();
      
      data?.forEach(message => {
        // Déterminer l'autre participant de la conversation
        const isMessageSender = message.sender_id === user.id;
        const partner = isMessageSender ? message.receiver : message.sender;
        
        if (!conversationsMap.has(partner.id)) {
          conversationsMap.set(partner.id, {
            user: partner,
            lastMessage: message,
          });
        } else {
          // Mettre à jour uniquement si ce message est plus récent
          const existingConversation = conversationsMap.get(partner.id)!;
          const existingDate = new Date(existingConversation.lastMessage.created_at);
          const newDate = new Date(message.created_at);
          
          if (newDate > existingDate) {
            conversationsMap.set(partner.id, {
              ...existingConversation,
              lastMessage: message,
            });
          }
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

  /**
   * Gestionnaire d'événements pour les changements en temps réel
   */
  const handleRealtimeChanges = (payload: RealtimePostgresChangesPayload<any>) => {
    console.log("Realtime change detected:", payload);
    
    // Actualiser les conversations lorsqu'un nouveau message est inséré
    if (payload.eventType === 'INSERT') {
      fetchConversations();
    }
  }

  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
  
      // Abonnement aux changements en temps réel avec un gestionnaire unique
      const channel = supabase
        .channel('private_messages_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'private_messages',
            filter: `sender_id=eq.${currentUserId},receiver_id=eq.${currentUserId}`
          },
          handleRealtimeChanges
        )
        .subscribe((status) => {
          console.log("Supabase realtime subscription status:", status);
        });
  
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUserId]);

  return {
    conversations,
    loading,
    refreshConversations: fetchConversations,
    currentUserId
  };
};
