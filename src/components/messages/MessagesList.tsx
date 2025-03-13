
import React, { useEffect, useRef } from 'react';
import { Message } from '@/types/messages';
import { MessageItem } from './MessageItem';
import { Loader2, MessageSquare } from 'lucide-react';

interface MessagesListProps {
  messages: Message[];
  currentUserId: string | null;
  loading: boolean;
}

export const MessagesList: React.FC<MessagesListProps> = ({ 
  messages, 
  currentUserId,
  loading
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Faire défiler automatiquement jusqu'au dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-sm text-gray-500">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium">Aucun message</p>
          <p className="text-sm text-gray-500">Commencez la conversation en envoyant un message</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2 py-4">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          isCurrentUser={message.sender_id === currentUserId}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
