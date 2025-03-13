
import React, { useState, useEffect, useRef } from 'react';
import { MessagesList } from './MessagesList';
import { Profile, PrivateMessage } from '@/types/messages';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2, ArrowLeft } from 'lucide-react';
import { messagesService } from '@/services/messages/messagesService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="flex flex-col h-full">
      {/* Header avec les informations du partenaire */}
      <div className="p-4 border-b flex items-center gap-3">
        {onBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 md:hidden" 
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Avatar className="h-8 w-8">
          <AvatarImage src={partnerProfile.avatar_url || undefined} />
          <AvatarFallback>{partnerProfile.username?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{partnerProfile.username || 'Utilisateur'}</h3>
          <p className="text-xs text-muted-foreground">
            {partnerProfile.is_online ? 'En ligne' : 'Hors ligne'}
          </p>
        </div>
      </div>

      {/* Liste des messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <MessagesList 
          messages={messages} 
          currentUserId={currentUserId} 
          loading={loading} 
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Saisie de message */}
      <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
        <Input
          ref={inputRef}
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
