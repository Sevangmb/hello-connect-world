
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@/types/messages';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, isCurrentUser }) => {
  const user = isCurrentUser ? message.sender : message.receiver;
  const timeFormatted = format(new Date(message.created_at), 'HH:mm', { locale: fr });
  const username = user.username || 'Anonyme';
  
  return (
    <div className={cn(
      "px-2 py-1 hover:bg-gray-100/50 transition-colors",
      isCurrentUser ? "text-blue-700" : "text-gray-800"
    )}>
      <div className="flex items-start gap-1.5">
        <span className="text-xs whitespace-nowrap font-semibold truncate" style={{ maxWidth: '80px' }}>
          {`[${timeFormatted}] `}
        </span>
        
        <span className={cn(
          "font-semibold text-xs mr-1",
          isCurrentUser ? "text-blue-600" : "text-green-600"
        )}>
          {`<${username}>`}
        </span>
        
        <span className="text-sm break-words flex-1">
          {message.content}
        </span>
      </div>
    </div>
  );
};
