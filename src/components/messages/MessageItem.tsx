
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@/types/messages';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, isCurrentUser }) => {
  const user = isCurrentUser ? message.sender : message.receiver;
  
  return (
    <div className={cn(
      "flex gap-2 mb-4",
      isCurrentUser ? "justify-end" : "justify-start"
    )}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar_url || undefined} alt={user.username || 'Avatar'} />
          <AvatarFallback>{user.username?.[0] || 'U'}</AvatarFallback>
        </Avatar>
      )}

      <div className={cn(
        "max-w-[80%] rounded-lg p-3",
        isCurrentUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted"
      )}>
        <p className="text-sm">{message.content}</p>
        <div className="text-xs text-right mt-1 opacity-70">
          {format(new Date(message.created_at), 'HH:mm', { locale: fr })}
        </div>
      </div>

      {isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.avatar_url || undefined} alt={user.username || 'Avatar'} />
          <AvatarFallback>{user.username?.[0] || 'U'}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
