
import React, { useEffect, useRef } from 'react';
import { Message } from '@/types/messages';
import { MessageItem } from './MessageItem';
import { Loader2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessagesListProps {
  messages: Message[];
  currentUserId: string | null;
  loading: boolean;
  className?: string;
}

export const MessagesList: React.FC<MessagesListProps> = ({ 
  messages, 
  currentUserId,
  loading,
  className
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Faire défiler automatiquement jusqu'au dernier message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-xs text-gray-500">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <div className="text-center">
          <MessageSquare className="h-8 w-8 mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-medium">Aucun message</p>
          <p className="text-xs text-gray-500">Commencez la conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col space-y-1 py-2", className)}>
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
