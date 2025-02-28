
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { PrivateMessage, Profile } from "@/types/messages";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

interface PrivateChatProps {
  recipientId: string;
  recipientName: string;
}

export const PrivateChat = ({ recipientId, recipientName }: PrivateChatProps) => {
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Faire défiler vers le bas quand de nouveaux messages apparaissent
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Charger l'utilisateur actuel
    const getUserProfile = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setCurrentUser({ id: data.user.id });
      }
    };
    
    getUserProfile();
    
    // Charger les messages initiaux
    fetchMessages();

    // Configurer l'abonnement aux nouveaux messages
    const setupRealtimeSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('private_chat_messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'private_messages',
            filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user.id}))`,
          },
          handleNewMessage
        )
        .subscribe((status) => {
          console.log("Realtime subscription status:", status);
        });

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupRealtimeSubscription();
    return () => {
      cleanup.then(unsubscribe => unsubscribe && unsubscribe());
    };
  }, [recipientId]);

  // Faire défiler vers le bas après le rendu des messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour voir les messages",
        });
        return;
      }

      console.log("Fetching messages between", user.id, "and", recipientId);

      const { data, error } = await supabase
        .from("private_messages")
        .select(`
          *,
          sender:profiles!private_messages_sender_id_fkey(id, username, avatar_url),
          receiver:profiles!private_messages_receiver_id_fkey(id, username, avatar_url)
        `)
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }

      console.log("Fetched messages:", data);
      setMessages(data as PrivateMessage[] || []);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les messages",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (payload: RealtimePostgresChangesPayload<PrivateMessage>) => {
    console.log("New message received:", payload);
    
    // Optimisation: ajouter directement le nouveau message au lieu de refaire une requête
    if (payload.new) {
      // Nous devons récupérer les infos sur l'expéditeur pour l'affichage
      fetchMessages();
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    try {
      console.log("Sending message to:", recipientId, "from:", currentUser.id);
      
      const { error } = await supabase.from("private_messages").insert({
        content: newMessage,
        receiver_id: recipientId,
        sender_id: currentUser.id,
      });

      if (error) {
        console.error("Error sending message:", error);
        throw error;
      }

      // Pas besoin de refetcher les messages grâce au canal realtime
      setNewMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'envoyer le message",
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Grouper les messages par date
  const groupMessagesByDate = (messages: PrivateMessage[]) => {
    const groups: { [date: string]: PrivateMessage[] } = {};
    
    messages.forEach(message => {
      const dateKey = formatDate(message.created_at);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(message);
    });
    
    return groups;
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{recipientName}</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Aucun message pour le moment</p>
            <p className="text-sm">Envoyez votre premier message à {recipientName}</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date} className="space-y-4">
              <div className="flex justify-center">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">
                  {date}
                </span>
              </div>
              
              {dateMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === currentUser?.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender_id === currentUser?.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <p className="break-words">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 inline-block">
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          className="flex-1"
          disabled={loading || !currentUser}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={loading || !newMessage.trim() || !currentUser}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
