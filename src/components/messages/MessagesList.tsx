
import React, { useEffect, useRef } from 'react';
import { Message } from '@/types/messages';
import { MessageItem } from './MessageItem';

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
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse space-y-2">
          <div className="h-10 w-64 bg-gray-200 rounded"></div>
          <div className="h-10 w-48 bg-gray-200 rounded"></div>
          <div className="h-10 w-56 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-center text-gray-500">
        <div>
          <p className="text-lg font-medium">Aucun message</p>
          <p className="text-sm">Commencez la conversation en envoyant un message</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2 p-4 overflow-y-auto">
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
