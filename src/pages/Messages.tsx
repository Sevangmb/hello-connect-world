
import React, { useState, useEffect } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { Header } from '@/components/Header';
import MainSidebar from '@/components/MainSidebar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { ConversationsList } from '@/components/messages/ConversationsList';
import { PrivateChat } from '@/components/messages/PrivateChat';
import { SearchFriends } from '@/components/friends/SearchFriends';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Hash, Settings, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Liste des canaux de discussion simulés pour mIRC
const MOCK_CHANNELS = [
  { id: 'general', name: 'General', userCount: 15 },
  { id: 'help', name: 'Aide', userCount: 7 },
  { id: 'fashion', name: 'Mode', userCount: 12 },
  { id: 'tech', name: 'Tech', userCount: 9 },
  { id: 'music', name: 'Musique', userCount: 5 },
];

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

  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
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
    setSelectedChannel(null);
  };

  const handleSelectFriend = (friend: { id: string; username: string; avatar_url?: string | null }) => {
    fetchMessages(friend.id);
    setSelectedPartner({
      id: friend.id,
      username: friend.username,
      avatar_url: friend.avatar_url || null,
      is_online: false
    });
    setSelectedChannel(null);
  };

  const handleSelectChannel = (channelId: string) => {
    setSelectedChannel(channelId);
    clearCurrentConversation();
    setSelectedPartner(null);
  };

  const handleBack = () => {
    clearCurrentConversation();
    setSelectedPartner(null);
    setSelectedChannel(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Header className="fixed top-0 left-0 right-0 z-50" />
      <MainSidebar className="hidden md:block fixed left-0 top-0 h-screen z-40" />
      
      <main className="flex-1 pt-16 md:pl-64 h-screen overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Barre supérieure de style mIRC */}
          <div className="bg-gray-100 border-b p-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="font-medium">mIRC-Style Messenger</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-7 text-xs hidden md:flex">
                <Settings className="h-3.5 w-3.5 mr-1.5" />
                Préférences
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs hidden md:flex">
                <Info className="h-3.5 w-3.5 mr-1.5" />
                Aide
              </Button>
            </div>
          </div>
          
          {/* Container principal - occupe tout l'espace restant */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar avec tabs pour canaux, conversations privées et amis */}
            <div className="w-64 border-r bg-gray-50 flex flex-col overflow-hidden shrink-0 md:block">
              <Tabs defaultValue="channels" className="flex flex-col h-full">
                <TabsList className="grid grid-cols-3 h-9 rounded-none border-b bg-gray-50">
                  <TabsTrigger value="channels" className="text-xs">
                    <Hash className="h-3.5 w-3.5 mr-1.5" />
                    Canaux
                  </TabsTrigger>
                  <TabsTrigger value="private" className="text-xs">
                    <Users className="h-3.5 w-3.5 mr-1.5" />
                    Privé
                    {unreadCount > 0 && (
                      <Badge variant="primary" className="ml-1.5 text-[10px] h-4 min-w-4">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="friends" className="text-xs">
                    <Users className="h-3.5 w-3.5 mr-1.5" />
                    Amis
                  </TabsTrigger>
                </TabsList>
                
                {/* Canaux de style mIRC */}
                <TabsContent value="channels" className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-1.5">
                      {MOCK_CHANNELS.map(channel => (
                        <button
                          key={channel.id}
                          onClick={() => handleSelectChannel(channel.id)}
                          className={`w-full text-left py-1.5 px-2 rounded-sm text-sm flex items-center gap-1.5 hover:bg-gray-100 transition-colors ${
                            selectedChannel === channel.id ? 'bg-gray-100 font-medium' : ''
                          }`}
                        >
                          <Hash className="h-3.5 w-3.5 text-gray-500" />
                          <span>{channel.name}</span>
                          <Badge variant="outline" className="ml-auto text-[10px] py-0">
                            {channel.userCount}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                {/* Conversations privées */}
                <TabsContent value="private" className="flex-1 p-0 overflow-hidden">
                  <ConversationsList 
                    conversations={conversations}
                    loading={loading}
                    currentConversation={currentConversation}
                    onSelectConversation={handleSelectChat}
                  />
                </TabsContent>
                
                {/* Liste des amis */}
                <TabsContent value="friends" className="flex-1 p-0 overflow-hidden">
                  <SearchFriends onSelect={handleSelectFriend} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Zone de conversation - occupe tout l'espace restant */}
            <div className="flex-1 flex flex-col overflow-hidden">
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
              ) : selectedChannel ? (
                // Afficher un canal mIRC simulé
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Header du canal */}
                  <div className="bg-gray-100 border-b px-3 py-2 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-sm">
                        {MOCK_CHANNELS.find(c => c.id === selectedChannel)?.name || 'Canal'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {MOCK_CHANNELS.find(c => c.id === selectedChannel)?.userCount || 0} utilisateurs
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Settings className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  
                  {/* Zone principale avec les messages et liste des utilisateurs */}
                  <div className="flex flex-1 overflow-hidden">
                    {/* Zone des messages */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {/* Topic du canal */}
                      <div className="bg-gray-50 px-3 py-1.5 border-b text-xs text-gray-600 shrink-0">
                        <p>Bienvenue dans le canal #{MOCK_CHANNELS.find(c => c.id === selectedChannel)?.name}. Veuillez respecter les règles de la communauté.</p>
                      </div>
                      
                      {/* Zone des messages avec défilement */}
                      <ScrollArea className="flex-1 font-mono text-sm">
                        <div className="p-2">
                          <div className="px-2 py-1 text-gray-500 text-xs">
                            [10:05] <span className="text-gray-800 font-medium">*** Vous avez rejoint le canal #{MOCK_CHANNELS.find(c => c.id === selectedChannel)?.name}</span>
                          </div>
                          <div className="px-2 py-1">
                            <span className="text-xs whitespace-nowrap font-semibold">[10:05] </span>
                            <span className="text-green-600 font-semibold text-xs mr-1">&lt;System&gt;</span>
                            <span className="text-sm">Bienvenue dans le canal de discussion!</span>
                          </div>
                          <div className="px-2 py-1">
                            <span className="text-xs whitespace-nowrap font-semibold">[10:06] </span>
                            <span className="text-red-600 font-semibold text-xs mr-1">&lt;Admin&gt;</span>
                            <span className="text-sm">N'oubliez pas de respecter les règles de la communauté.</span>
                          </div>
                          <div className="px-2 py-1">
                            <span className="text-xs whitespace-nowrap font-semibold">[10:08] </span>
                            <span className="text-blue-600 font-semibold text-xs mr-1">&lt;JeanDupont&gt;</span>
                            <span className="text-sm">Bonjour tout le monde! Comment allez-vous aujourd'hui?</span>
                          </div>
                        </div>
                      </ScrollArea>
                      
                      {/* Zone de saisie */}
                      <form className="border-t p-2 flex gap-2 bg-gray-50 shrink-0">
                        <Input
                          type="text"
                          placeholder="Tapez votre message..."
                          className="flex-grow h-8 text-sm"
                        />
                        <Button size="sm" className="h-8 px-3">
                          <span className="text-xs">Envoyer</span>
                        </Button>
                      </form>
                    </div>
                    
                    {/* Liste des utilisateurs - visible uniquement sur desktop */}
                    <div className="w-48 border-l bg-gray-50 flex flex-col overflow-hidden hidden md:block shrink-0">
                      <div className="p-2 border-b bg-gray-100">
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-xs font-medium">Utilisateurs ({MOCK_CHANNELS.find(c => c.id === selectedChannel)?.userCount || 0})</span>
                        </div>
                      </div>
                      <ScrollArea className="flex-1">
                        <div className="p-1">
                          <div className="px-2 py-1.5 text-xs flex items-center gap-1.5 rounded hover:bg-gray-100">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="font-medium text-red-600">Admin</span>
                          </div>
                          {Array.from({ length: Math.min(15, MOCK_CHANNELS.find(c => c.id === selectedChannel)?.userCount || 0) }).map((_, i) => (
                            <div 
                              key={i} 
                              className="px-2 py-1.5 text-xs flex items-center gap-1.5 rounded hover:bg-gray-100"
                            >
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              <span className="font-medium">Utilisateur{i+1}</span>
                              {i === 2 && (
                                <Badge variant="outline" className="ml-auto text-[9px] py-0 px-1">vous</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center p-6">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-base font-medium">Bienvenue sur mIRC-Style Messenger</p>
                    <p className="text-sm mt-2">Rejoignez un canal ou sélectionnez une conversation privée pour commencer</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <BottomNav className="md:hidden" />
    </div>
  );
};

export default Messages;
