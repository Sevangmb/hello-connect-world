
import React, { useState, useEffect } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { Header } from '@/components/Header';
import MainSidebar from '@/components/MainSidebar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Card } from '@/components/ui/card';
import { ConversationsList } from '@/components/messages/ConversationsList';
import { PrivateChat } from '@/components/messages/PrivateChat';
import { SearchFriends } from '@/components/friends/SearchFriends';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users } from 'lucide-react';

const Messages = () => {
  const {
    conversations,
    messages,
    loading,
    unreadCount,
    sendingMessage,
    currentConversation,
    currentUserId,
    fetchMessages,
    sendMessage,
    clearCurrentConversation
  } = useMessages();

  const [activeTab, setActiveTab] = useState('conversations');
  const [selectedPartner, setSelectedPartner] = useState<{
    id: string;
    username: string;
    avatar_url: string | null;
    is_online?: boolean;
  } | null>(null);

  // Trouver le profil de l'utilisateur partenaire actuel
  useEffect(() => {
    if (currentConversation) {
      const partner = conversations.find(c => c.id === currentConversation)?.user;
      if (partner) {
        setSelectedPartner({
          id: partner.id,
          username: partner.username || '',
          avatar_url: partner.avatar_url,
          is_online: partner.is_online
        });
      }
    }
  }, [currentConversation, conversations]);

  const handleSelectChat = (friendId: string) => {
    fetchMessages(friendId);
  };

  const handleSelectFriend = (friend: { id: string; username: string; avatar_url?: string | null }) => {
    fetchMessages(friend.id);
    setSelectedPartner({
      id: friend.id,
      username: friend.username,
      avatar_url: friend.avatar_url || null,
      is_online: false
    });
    setActiveTab('conversations');
  };

  const handleBack = () => {
    clearCurrentConversation();
    setSelectedPartner(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-grow">
        <MainSidebar />
        <main className="flex-1 pt-20 pb-16 md:pb-0 px-4 md:px-6 md:pl-72">
          <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
              {/* Liste des conversations */}
              <Card className={`p-4 h-full flex flex-col overflow-hidden ${
                currentConversation && 'md:block hidden'
              }`}>
                <h2 className="text-xl font-semibold mb-4">Messages</h2>
                
                <Tabs defaultValue="conversations" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="conversations" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Conversations
                      {unreadCount > 0 && (
                        <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="contacts" className="flex-1">
                      <Users className="h-4 w-4 mr-2" />
                      Contacts
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="conversations" className="flex-1 overflow-auto">
                    <ConversationsList
                      conversations={conversations}
                      loading={loading}
                      currentConversation={currentConversation}
                      onSelectConversation={handleSelectChat}
                    />
                  </TabsContent>
                  
                  <TabsContent value="contacts" className="flex-1 overflow-auto">
                    <SearchFriends onSelect={handleSelectFriend} />
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Zone de conversation */}
              <Card className={`md:col-span-2 flex flex-col h-full ${
                !currentConversation && 'md:flex hidden'
              }`}>
                {currentConversation && selectedPartner ? (
                  <PrivateChat
                    partnerId={currentConversation}
                    partnerProfile={{
                      id: selectedPartner.id,
                      username: selectedPartner.username,
                      avatar_url: selectedPartner.avatar_url,
                      is_online: selectedPartner.is_online || false
                    }}
                    currentUserId={currentUserId || ''}
                    onBack={handleBack}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-lg font-medium">Sélectionnez une conversation</p>
                      <p className="text-sm">Choisissez un contact pour commencer à discuter</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default Messages;
