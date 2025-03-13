
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
import { MessageSquare, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <div className="flex flex-grow min-h-screen">
        <MainSidebar />
        <main className="flex-1 pt-16 pb-16 md:pb-0 px-4 md:px-6 md:pl-72">
          <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
              {/* Liste des conversations - Mobile: plein écran ou masqué, Desktop: toujours visible */}
              <div className={`md:block ${currentConversation ? 'hidden' : 'block'} md:col-span-1`}>
                <Card className="h-full p-4 flex flex-col overflow-hidden shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Messages</h2>
                  
                  <Tabs defaultValue="conversations" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                    <TabsList className="w-full mb-4 bg-gray-100 p-1">
                      <TabsTrigger value="conversations" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Conversations
                        {unreadCount > 0 && (
                          <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="contacts" className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Users className="h-4 w-4 mr-2" />
                        Contacts
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="conversations" className="flex-1 overflow-auto mt-0">
                      <ConversationsList
                        conversations={conversations}
                        loading={loading}
                        currentConversation={currentConversation}
                        onSelectConversation={handleSelectChat}
                      />
                    </TabsContent>
                    
                    <TabsContent value="contacts" className="flex-1 overflow-auto mt-0">
                      <SearchFriends onSelect={handleSelectFriend} />
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>

              {/* Zone de conversation - Mobile: plein écran ou masqué, Desktop: toujours visible */}
              <div className={`md:block ${currentConversation ? 'block' : 'hidden'} md:col-span-2`}>
                <Card className="h-full shadow-md flex flex-col">
                  {currentConversation && selectedPartner ? (
                    <div className="flex flex-col h-full">
                      <div className="p-4 border-b flex items-center gap-3 bg-white">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="mr-2 md:hidden" 
                          onClick={handleBack}
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h3 className="font-semibold flex-1">
                          {selectedPartner.username || 'Conversation'}
                        </h3>
                      </div>
                      <div className="flex-1 overflow-hidden">
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
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center p-6">
                        <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-lg font-medium">Sélectionnez une conversation</p>
                        <p className="text-sm">Choisissez un contact pour commencer à discuter</p>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};

export default Messages;
