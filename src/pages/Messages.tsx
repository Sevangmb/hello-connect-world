
import React, { useState, useEffect } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { Header } from '@/components/Header';
import MainSidebar from '@/components/MainSidebar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { ConversationsList } from '@/components/messages/ConversationsList';
import { PrivateChat } from '@/components/messages/PrivateChat';
import { SearchFriends } from '@/components/friends/SearchFriends';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users, Hash, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Liste des canaux de discussion simulés
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filtrer les conversations en fonction de la recherche
  const filteredConversations = conversations.filter(conv => 
    conv.user.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtrer les canaux en fonction de la recherche
  const filteredChannels = MOCK_CHANNELS.filter(channel => 
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    setIsMobileMenuOpen(false);
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
    setIsMobileMenuOpen(false);
  };

  const handleSelectChannel = (channelId: string) => {
    setSelectedChannel(channelId);
    clearCurrentConversation();
    setSelectedPartner(null);
    setIsMobileMenuOpen(false);
  };

  const handleBack = () => {
    clearCurrentConversation();
    setSelectedPartner(null);
    setSelectedChannel(null);
  };

  // Détecter si on est sur mobile
  const isMobile = window.innerWidth < 768;
  const showSidebar = !isMobile || (isMobile && !currentConversation && !selectedChannel);
  const showChat = !isMobile || (isMobile && (currentConversation || selectedChannel));

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* MainSidebar à gauche, fixe en desktop */}
      <MainSidebar className="hidden md:block fixed left-0 top-0 h-screen z-40" />
      
      {/* Contenu principal - à côté du menu */}
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <Header className="shrink-0 z-50" />
        
        {/* Zone principale de messagerie - occupe tout l'espace restant */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar de messagerie - visible conditionnellement sur mobile */}
          {showSidebar && (
            <div className={cn(
              "w-full md:w-64 border-r bg-gray-50 flex flex-col overflow-hidden z-10 shrink-0",
              isMobile ? "absolute inset-0 z-20 md:relative" : ""
            )}>
              {/* Barre supérieure */}
              <div className="bg-gray-100 border-b p-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="font-medium">Messagerie</span>
                </div>
              </div>
              
              {/* Barre de recherche */}
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Rechercher..." 
                    className="pl-9 h-9 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Tabs pour les différentes sections */}
              <Tabs defaultValue="private" className="flex flex-col h-full">
                <TabsList className="grid grid-cols-3 h-9 rounded-none border-b bg-gray-50">
                  <TabsTrigger value="channels" className="text-xs">
                    <Hash className="h-3.5 w-3.5 mr-1" />
                    Canaux
                  </TabsTrigger>
                  <TabsTrigger value="private" className="text-xs">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    Privé
                    {unreadCount > 0 && (
                      <Badge variant="primary" className="ml-1 text-[10px] h-4 min-w-4">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="friends" className="text-xs">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    Amis
                  </TabsTrigger>
                </TabsList>
                
                {/* Liste des canaux */}
                <TabsContent value="channels" className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div className="p-1.5">
                      {filteredChannels.length > 0 ? (
                        filteredChannels.map(channel => (
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
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                          Aucun canal ne correspond à votre recherche
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                {/* Conversations privées */}
                <TabsContent value="private" className="flex-1 p-0 overflow-hidden">
                  {loading && filteredConversations.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    <ConversationsList 
                      conversations={filteredConversations}
                      loading={false}
                      currentConversation={currentConversation}
                      onSelectConversation={handleSelectChat}
                      emptyMessage={
                        searchQuery 
                          ? "Aucune conversation ne correspond à votre recherche" 
                          : "Commencez une nouvelle conversation"
                      }
                    />
                  )}
                </TabsContent>
                
                {/* Liste des amis */}
                <TabsContent value="friends" className="flex-1 p-0 overflow-hidden">
                  <SearchFriends 
                    onSelect={handleSelectFriend} 
                    initialSearchTerm={searchQuery}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Zone de conversation - conditionnellement visible sur mobile */}
          {showChat && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {/* Bouton retour pour mobile */}
              {isMobile && (currentConversation || selectedChannel) && (
                <div className="bg-gray-100 border-b p-2 flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleBack}
                    className="mr-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">
                    {selectedPartner?.username || 
                     MOCK_CHANNELS.find(c => c.id === selectedChannel)?.name || 
                     "Conversation"}
                  </span>
                </div>
              )}

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
                  onBack={isMobile ? handleBack : undefined}
                />
              ) : selectedChannel ? (
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
                  </div>
                  
                  {/* Zone principale avec les messages et liste des utilisateurs */}
                  <div className="flex flex-1 overflow-hidden">
                    {/* Zone des messages */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                      {/* Topic du canal */}
                      <div className="bg-gray-50 px-3 py-1.5 border-b text-xs text-gray-600 shrink-0">
                        <p>Bienvenue dans le canal #{MOCK_CHANNELS.find(c => c.id === selectedChannel)?.name}. Veuillez respecter les règles.</p>
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
                    <p className="text-base font-medium">Bienvenue dans votre messagerie</p>
                    <p className="text-sm mt-2">Sélectionnez une conversation pour commencer à discuter</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation mobile - en bas sur mobile uniquement */}
      <BottomNav className="md:hidden" />
    </div>
  );
};

export default Messages;
