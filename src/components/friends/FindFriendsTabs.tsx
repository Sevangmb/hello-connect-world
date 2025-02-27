
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search } from "lucide-react";
import { SuggestedFriendsList } from "./SuggestedFriendsList";
import { UserSearch } from "@/components/users/UserSearch";
import { SuggestedUser } from "@/hooks/useSuggestedFriends";

interface FindFriendsTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  suggestedUsers: SuggestedUser[] | undefined;
  isLoading: boolean;
  onSelectUser: (user: { id: string; username: string; avatar_url: string | null }) => void;
}

export const FindFriendsTabs = ({
  activeTab,
  onTabChange,
  suggestedUsers,
  isLoading,
  onSelectUser
}: FindFriendsTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="discover" className="data-[state=active]:bg-blue-100">
          <Users className="mr-2 h-4 w-4" />
          Découvrir
        </TabsTrigger>
        <TabsTrigger value="search" className="data-[state=active]:bg-blue-100">
          <Search className="mr-2 h-4 w-4" />
          Rechercher
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="discover" className="space-y-4">
        <h2 className="text-lg font-medium text-blue-800">Suggestions d'amis</h2>
        <SuggestedFriendsList
          users={suggestedUsers}
          isLoading={isLoading}
          onAddFriend={onSelectUser}
        />
      </TabsContent>
      
      <TabsContent value="search">
        <div className="space-y-6">
          <h2 className="text-lg font-medium text-blue-800">Rechercher un utilisateur</h2>
          <p className="text-gray-600">
            Vous cherchez quelqu'un en particulier ? Entrez son nom d'utilisateur ci-dessous.
          </p>
          <UserSearch 
            onSelect={onSelectUser}
            placeholder="Rechercher par nom d'utilisateur..."
            className="bg-blue-50 hover:bg-blue-100 focus:ring-blue-500 border-blue-100"
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};
