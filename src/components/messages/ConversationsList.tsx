
import React from 'react';
import { Conversation } from '@/types/messages';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Loader2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ConversationsListProps {
  conversations: Conversation[];
  loading: boolean;
  currentConversation: string | null;
  onSelectConversation: (userId: string) => void;
  emptyMessage?: string;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  loading,
  currentConversation,
  onSelectConversation,
  emptyMessage = "Aucune conversation"
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 h-full">
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-500">Chargement des conversations...</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full">
        <div className="text-center">
          <MessageSquare className="h-8 w-8 mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-medium">{emptyMessage}</p>
          <p className="text-xs text-gray-500 mb-4">Vous pouvez démarrer une conversation avec vos amis</p>
          <Button variant="outline" size="sm">
            <User className="h-3.5 w-3.5 mr-1.5" />
            Trouver des contacts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-1">
        {conversations.map((conversation) => {
          const formattedDate = format(
            new Date(conversation.lastMessage.created_at),
            'HH:mm',
            { locale: fr }
          );

          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                "w-full text-left p-2 hover:bg-gray-100 transition-colors rounded-sm flex items-center gap-2",
                currentConversation === conversation.id && "bg-gray-100"
              )}
            >
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={conversation.user.avatar_url || undefined} 
                    alt={conversation.user.username || 'Avatar'} 
                  />
                  <AvatarFallback className="bg-gray-200">
                    {conversation.user.username?.[0]?.toUpperCase() || <User className="h-3.5 w-3.5" />}
                  </AvatarFallback>
                </Avatar>
                {conversation.user.is_online && (
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium text-sm truncate">
                    {conversation.user.username || 'Utilisateur'}
                  </p>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-1">
                    {formattedDate}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <p className="text-xs text-gray-500 truncate flex-1">
                    {conversation.lastMessage.content}
                  </p>
                  
                  {(conversation.unreadCount && conversation.unreadCount > 0) ? (
                    <Badge 
                      variant="primary" 
                      className="ml-1 h-4 min-w-4 text-[10px]"
                    >
                      {conversation.unreadCount}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
};
