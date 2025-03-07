
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<{ id: string; type: 'private' | 'group' } | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        // Example query - adjust based on your database structure
        const { data, error } = await supabase
          .from('chats')
          .select('*')
          .limit(10);
          
        if (error) throw error;
        setChats(data || []);
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchChats();
  }, []);

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 overflow-hidden bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-4">Chargement des conversations...</div>
          ) : (
            <div className="p-4">
              {chats.length > 0 ? (
                <ul className="space-y-2">
                  {chats.map(chat => (
                    <li 
                      key={chat.id}
                      className={`p-3 rounded cursor-pointer hover:bg-gray-100 ${
                        selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedChat({ 
                        id: chat.id, 
                        type: chat.is_group ? 'group' : 'private' 
                      })}
                    >
                      <div className="font-medium">{chat.name || 'Chat sans nom'}</div>
                      <div className="text-sm text-gray-500">
                        {chat.last_message || 'Pas de messages'}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aucune conversation trouvée
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="md:col-span-2 bg-white rounded-lg shadow min-h-[400px]">
          {!selectedChat ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Sélectionnez une conversation pour commencer
            </div>
          ) : (
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">
                {selectedChat.type === 'private' ? 'Conversation privée' : 'Conversation de groupe'}
              </h2>
              <div className="bg-gray-100 rounded-lg p-4 h-64 overflow-y-auto">
                {/* Messages content would go here */}
                <div className="text-center text-gray-500">
                  Aucun message pour l'instant
                </div>
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Tapez votre message..."
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
