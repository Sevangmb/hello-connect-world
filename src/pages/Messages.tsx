
import React, { useState } from 'react';
import { MessagesList } from '@/components/messages/MessagesList';
import { PrivateChat } from '@/components/messages/PrivateChat';
import { GroupChat } from '@/components/messages/GroupChat';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<{ id: string; type: 'private' | 'group' } | null>(null);

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 overflow-hidden bg-white rounded-lg shadow">
          <MessagesList 
            onSelectChat={(id, type) => setSelectedChat({ id, type })}
            selectedChatId={selectedChat?.id}
          />
        </div>
        
        <div className="md:col-span-2 bg-white rounded-lg shadow min-h-[400px]">
          {!selectedChat ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Sélectionnez une conversation pour commencer
            </div>
          ) : selectedChat.type === 'private' ? (
            <PrivateChat chatId={selectedChat.id} />
          ) : (
            <GroupChat groupId={selectedChat.id} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
