
import React, { useState, useEffect, useRef } from 'react';
import { MessagesList } from './MessagesList';
import { Profile, PrivateMessage } from '@/types/messages';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2, Users, Hash } from 'lucide-react';
import { messagesService } from '@/services/messages/messagesService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface OnlineUser {
  id: string;
  username: string;
  avatar_url: string | null;
  is_online: boolean;
}

interface PrivateChatProps {
  partnerId: string;
  partnerProfile: Profile;
  currentUserId: string;
  onBack?: () => void;
}

export const PrivateChat: React.FC<PrivateChatProps> = ({
  partnerId,
  partnerProfile,
  currentUserId,
  onBack
}) => {
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Simuler des utilisateurs en ligne
  useEffect(() => {
    const mockUsers: OnlineUser[] = [
      { id: partnerId, username: partnerProfile.username || 'Utilisateur', avatar_url: partnerProfile.avatar_url, is_online: true },
      { id: 'user1', username: 'JeanDupont', avatar_url: null, is_online: true },
      { id: 'user2', username: 'MarieMartin', avatar_url: null, is_online: true },
      { id: 'user3', username: 'PierreDurand', avatar_url: null, is_online: false },
      { id: 'user4', username: 'SophieLeroy', avatar_url: null, is_online: true },
      { id: 'user5', username: 'LucRobert', avatar_url: null, is_online: true },
    ];
    setOnlineUsers(mockUsers);
  }, [partnerId, partnerProfile]);

  useEffect(() => {
    fetchMessages();
    // Focus l'input lorsque la conversation est chargée
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    
    // Marquer les messages comme lus quand la conversation est ouverte
    messagesService.markMessagesAsRead(partnerId).catch(console.error);
    
    // Configurer la souscription en temps réel pour les nouveaux messages
    const channel = supabase
      .channel('private_chat_updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'private_messages',
        filter: `sender_id=eq.${partnerId},receiver_id=eq.${currentUserId}`
      }, () => {
        fetchMessages();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [partnerId, currentUserId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const fetchedMessages = await messagesService.fetchMessages(partnerId);
      setMessages(fetchedMessages as PrivateMessage[]);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger les messages'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSendingMessage(true);
      const sentMessage = await messagesService.sendMessage(partnerId, newMessage);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      // Focus l'input après l'envoi du message
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible d\'envoyer le message'
      });
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header de chat style mIRC */}
      <div className="bg-gray-100 border-b px-3 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-sm">{partnerProfile.username || 'Discussion'}</span>
          <Badge variant="outline" className="text-xs">5 utilisateurs</Badge>
        </div>
      </div>

      {/* Main chat area with sidebar - mIRC style */}
      <div className="flex flex-1 overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topic area */}
          <div className="bg-gray-50 px-3 py-1.5 border-b text-xs text-gray-600 shrink-0">
            <p>Bienvenue dans le canal de discussion avec {partnerProfile.username || 'cet utilisateur'}. Soyez courtois.</p>
          </div>
          
          {/* Messages list with mIRC style */}
          <ScrollArea className="flex-1">
            <MessagesList 
              messages={messages} 
              currentUserId={currentUserId} 
              loading={loading}
              className="px-2 pt-1 font-mono text-sm"
            />
          </ScrollArea>

          {/* Input area */}
          <form onSubmit={handleSendMessage} className="border-t p-2 flex gap-2 bg-gray-50 shrink-0">
            <Input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-grow h-8 text-sm"
              disabled={sendingMessage}
            />
            <Button 
              type="submit" 
              disabled={sendingMessage || !newMessage.trim()}
              size="sm"
              className="h-8 px-3"
            >
              {sendingMessage ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
            </Button>
          </form>
        </div>

        {/* Users sidebar - mIRC style */}
        <div className="w-48 border-l bg-gray-50 flex flex-col overflow-hidden hidden md:block shrink-0">
          <div className="p-2 border-b bg-gray-100">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs font-medium">Utilisateurs</span>
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-1">
              {onlineUsers.map(user => (
                <div 
                  key={user.id} 
                  className={cn(
                    "px-2 py-1.5 text-xs flex items-center gap-1.5 rounded hover:bg-gray-100",
                    user.is_online ? "text-gray-900" : "text-gray-500"
                  )}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    user.is_online ? "bg-green-500" : "bg-gray-400"
                  )} />
                  <span className="font-medium">
                    {user.username}
                  </span>
                  {user.id === currentUserId && (
                    <Badge variant="outline" className="ml-auto text-[9px] py-0 px-1">vous</Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
