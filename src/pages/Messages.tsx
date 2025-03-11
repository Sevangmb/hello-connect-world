import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMessages } from '@/hooks/useMessages';
import { MessagesList } from '@/components/messages/MessagesList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Messages = () => {
  const { 
    conversations, 
    messages, 
    loading, 
    currentConversation,
    currentUserId,
    fetchMessages,
    sendMessage,
    sendingMessage
  } = useMessages();
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversation) return;
    
    sendMessage(currentConversation, newMessage)
      .then(() => {
        setNewMessage('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(error => {
        console.error('Erreur lors de l\'envoi du message:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer votre message",
          variant: "destructive"
        });
      });
  };

  const selectedConversation = conversations.find(c => c.id === currentConversation);

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Liste des conversations */}
        <div className="md:col-span-1 overflow-hidden bg-white rounded-lg shadow">
          {loading && conversations.length === 0 ? (
            <div className="p-4">
              <div className="flex items-center space-x-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span>Chargement des conversations...</span>
              </div>
            </div>
          ) : (
            <div className="p-4">
              {conversations.length > 0 ? (
                <ul className="space-y-2">
                  {conversations.map(chat => (
                    <li 
                      key={chat.id}
                      className={`p-3 rounded cursor-pointer hover:bg-gray-100 ${
                        currentConversation === chat.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => fetchMessages(chat.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={chat.user.avatar_url || undefined} alt={chat.user.username || 'Avatar'} />
                          <AvatarFallback>{chat.user.username?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{chat.user.username || 'Sans nom'}</div>
                          <div className="text-sm text-gray-500 truncate">
                            {chat.lastMessage?.content || 'Pas de messages'}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {chat.lastMessage && format(new Date(chat.lastMessage.created_at), 'dd/MM/yyyy', { locale: fr })}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Aucune conversation trouvée</p>
                  <p className="text-sm mt-2">Commencez à discuter avec d'autres utilisateurs</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Zone de conversation */}
        <div className="md:col-span-2 bg-white rounded-lg shadow min-h-[500px] flex flex-col">
          {!currentConversation ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p className="text-lg">Sélectionnez une conversation pour commencer</p>
                <p className="text-sm mt-2">Ou démarrez une nouvelle discussion</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              {/* En-tête de la conversation */}
              <div className="p-4 border-b">
                {selectedConversation && (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={selectedConversation.user.avatar_url || undefined} 
                        alt={selectedConversation.user.username || 'Avatar'} 
                      />
                      <AvatarFallback>
                        {selectedConversation.user.username?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold">
                        {selectedConversation.user.username || 'Utilisateur'}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.user.full_name || ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Liste des messages */}
              <div className="flex-grow overflow-y-auto bg-gray-50">
                <MessagesList 
                  messages={messages} 
                  currentUserId={currentUserId}
                  loading={loading} 
                />
              </div>
              
              {/* Formulaire d'envoi de message */}
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
                  <span className="ml-2">Envoyer</span>
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
