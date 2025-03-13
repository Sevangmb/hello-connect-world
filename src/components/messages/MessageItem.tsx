
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@/types/messages';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User } from 'lucide-react';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, isCurrentUser }) => {
  const user = isCurrentUser ? message.sender : message.receiver;
  const timeFormatted = format(new Date(message.created_at), 'HH:mm', { locale: fr });
  
  return (
    <div className={cn(
      "flex gap-2 mb-4 px-4",
      isCurrentUser ? "justify-end" : "justify-start"
    )}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={user.avatar_url || undefined} alt={user.username || 'Avatar'} />
          <AvatarFallback className="bg-gray-200">
            {user.username?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      )}

      <div className="max-w-[70%]">
        <div className={cn(
          "rounded-2xl px-4 py-2",
          isCurrentUser 
            ? "bg-primary text-white rounded-tr-none" 
            : "bg-gray-200 text-gray-800 rounded-tl-none"
        )}>
          <p className="text-sm break-words">{message.content}</p>
        </div>
        <div className={cn(
          "text-xs mt-1 opacity-70",
          isCurrentUser ? "text-right" : "text-left"
        )}>
          {timeFormatted}
        </div>
      </div>

      {isCurrentUser && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarImage src={user.avatar_url || undefined} alt={user.username || 'Avatar'} />
          <AvatarFallback className="bg-primary-100 text-primary-700">
            {user.username?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
