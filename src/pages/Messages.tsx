
import React, { useState } from 'react';
import { FriendsList } from '@/components/friends/FriendsList';
import { MessagesList } from '@/components/messages/MessagesList';
import { useMessages } from '@/hooks/useMessages';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { MessageItem } from '@/components/messages/MessageItem';
import { Card } from '@/components/ui/card';

const Messages = () => {
  const {
    conversations,
    messages,
    loading,
    sendingMessage,
    currentConversation,
    currentUserId,
    fetchMessages,
    sendMessage,
  } = useMessages();

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentConversation) return;

    await sendMessage(currentConversation, newMessage);
    setNewMessage('');
  };

  const handleSelectChat = (friend: { id: string; username: string }) => {
    fetchMessages(friend.id);
  };

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Liste des amis et conversations */}
        <Card className="p-4 h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
          <h2 className="text-xl font-semibold mb-4">Conversations</h2>
          <div className="flex-1 overflow-y-auto">
            <FriendsList onChatSelect={handleSelectChat} />
          </div>
        </Card>

        {/* Zone de conversation */}
        <Card className="md:col-span-2 flex flex-col h-[calc(100vh-8rem)]">
          {currentConversation ? (
            <>
              {/* En-tête de la conversation */}
              <div className="p-4 border-b">
                {conversations.find(c => c.id === currentConversation)?.user.username}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto bg-gray-50">
                <MessagesList
                  messages={messages}
                  currentUserId={currentUserId}
                  loading={loading}
                />
              </div>

              {/* Formulaire d'envoi */}
              <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                <Input
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
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Sélectionnez une conversation pour commencer</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
