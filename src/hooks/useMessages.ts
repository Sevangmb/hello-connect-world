
import { useState, useEffect, useCallback } from "react";
import { Conversation, Message } from "@/types/messages";
import { messagesService } from "@/services/messages/messagesService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();

  // Récupérer l'utilisateur courant
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    
    getCurrentUser();
  }, []);

  // Récupérer les conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const conversationsData = await messagesService.fetchConversations();
      setConversations(conversationsData);
    } catch (error: any) {
      console.error("Erreur lors du chargement des conversations:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les conversations",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Charger les conversations au montage du composant
  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId, fetchConversations]);

  // Récupérer les messages d'une conversation spécifique
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setLoading(true);
      const messagesData = await messagesService.fetchMessages(conversationId);
      setMessages(messagesData);
      
      // Marquer les messages comme lus
      await messagesService.markMessagesAsRead(conversationId);
      
      // Mettre à jour la conversation actuelle
      setCurrentConversation(conversationId);
    } catch (error: any) {
      console.error("Erreur lors du chargement des messages:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les messages",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Envoyer un nouveau message
  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    if (!content.trim()) return;
    
    try {
      setSendingMessage(true);
      await messagesService.sendMessage(receiverId, content);
      // Les messages seront mis à jour via la souscription en temps réel
    } catch (error: any) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le message",
      });
    } finally {
      setSendingMessage(false);
    }
  }, [toast]);

  // Gestionnaire pour les changements en temps réel des messages
  const handleRealtimeChanges = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    console.log("Changement en temps réel détecté:", payload);
    
    if (payload.eventType === 'INSERT' && payload.table === 'private_messages') {
      // Si un nouveau message est inséré
      const newMessage = payload.new as Message;
      
      // Si le message concerne la conversation actuelle, l'ajouter à la liste des messages
      if (currentConversation === newMessage.sender_id || currentConversation === newMessage.receiver_id) {
        setMessages(prev => [...prev, newMessage]);
      }
      
      // Rafraîchir la liste des conversations pour mettre à jour le dernier message
      fetchConversations();
    }
  }, [currentConversation, fetchConversations]);

  // Abonnement aux changements en temps réel
  useEffect(() => {
    if (currentUserId) {
      const channel = supabase
        .channel('messages_changes')
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
          console.log("Statut de l'abonnement aux messages en temps réel:", status);
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [currentUserId, handleRealtimeChanges]);

  return {
    conversations,
    messages,
    loading,
    sendingMessage,
    currentConversation,
    currentUserId,
    fetchMessages,
    sendMessage,
    refreshConversations: fetchConversations
  };
};
