import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserSearch } from "@/components/users/UserSearch";
import { PrivateChat } from "./PrivateChat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const MessagesList = () => {
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    username: string;
    avatar_url: string | null;
  } | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
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

      if (error) {
        console.error("Error fetching conversations:", error);
        return;
      }

      // Group messages by conversation partner
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
    };

    fetchConversations();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-4">
        <UserSearch 
          onSelect={setSelectedUser}
          placeholder="Nouvelle conversation..."
        />
        <ScrollArea className="h-[500px]">
          {conversations.map(({ user: partner, lastMessage }) => (
            <Card
              key={partner.id}
              className="p-4 mb-2 cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedUser(partner)}
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={partner.avatar_url || ""} />
                  <AvatarFallback>{partner.username?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{partner.username}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {lastMessage.content}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </ScrollArea>
      </div>

      <div className="md:col-span-2">
        {selectedUser ? (
          <PrivateChat
            recipientId={selectedUser.id}
            recipientName={selectedUser.username}
          />
        ) : (
          <div className="h-[600px] flex items-center justify-center text-gray-500">
            Sélectionnez une conversation ou démarrez-en une nouvelle
          </div>
        )}
      </div>
    </div>
  );
};