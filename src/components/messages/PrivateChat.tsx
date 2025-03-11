
import React, { useState, useEffect } from 'react';
import { MessagesList } from './MessagesList';
import { Message, Profile, PrivateMessage } from '@/types/messages';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { messagesService } from '@/services/messages/messagesService';
import { useToast } from '@/hooks/use-toast';

interface PrivateChatProps {
  partnerId: string;
  partnerProfile: Profile;
  currentUserId: string;
}

export const PrivateChat: React.FC<PrivateChatProps> = ({
  partnerId,
  partnerProfile,
  currentUserId
}) => {
  const [messages, setMessages] = useState<PrivateMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    // Mark messages as read when conversation is opened
    messagesService.markMessagesAsRead(partnerId).catch(console.error);
  }, [partnerId]);

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
      await messagesService.sendMessage(partnerId, newMessage);
      setNewMessage('');
      // Messages will be updated via the subscription in useMessages hook
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
    <div className="flex flex-col h-full">
      {/* Header with partner info */}
      <div className="p-4 border-b">
        <h3 className="font-semibold">{partnerProfile.username || 'Utilisateur'}</h3>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <MessagesList 
          messages={messages} 
          currentUserId={currentUserId} 
          loading={loading} 
        />
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Tapez votre message..."
          className="flex-grow"
          disabled={sendingMessage}
        />
        <Button type="submit" disabled={sendingMessage || !newMessage.trim()}>
          {sendingMessage ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};
