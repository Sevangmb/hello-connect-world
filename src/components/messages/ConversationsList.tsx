
import React, { useState } from 'react';
import { Conversation } from '@/types/messages';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, User, MessageCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface ConversationsListProps {
  conversations: Conversation[];
  loading: boolean;
  currentConversation: string | null;
  onSelectConversation: (friendId: string) => void;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  loading,
  currentConversation,
  onSelectConversation
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  const filteredConversations = conversations.filter(
    (conv) => conv.user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3 h-full flex flex-col">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Rechercher une conversation..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
            {searchTerm ? (
              <>
                <Search className="h-10 w-10 mb-2 text-gray-300" />
                <p>Aucune conversation trouvée</p>
              </>
            ) : (
              <>
                <MessageCircle className="h-10 w-10 mb-2 text-gray-300" />
                <p>Aucune conversation</p>
                <p className="text-sm mt-1">Commencez par contacter un ami</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  currentConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border shadow-sm">
                      <AvatarImage src={conversation.user.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {conversation.user.username?.[0]?.toUpperCase() || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.user.is_online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{conversation.user.username}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {conversation.lastMessage?.created_at && 
                          format(new Date(conversation.lastMessage.created_at), 'HH:mm', { locale: fr })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage?.content || 'Aucun message'}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="primary" className="ml-2">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
