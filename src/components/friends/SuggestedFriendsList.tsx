
import React from "react";
import { SuggestedUserCard } from "./SuggestedUserCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { UserX } from "lucide-react";
import { SuggestedUser } from "@/hooks/useSuggestedFriends";

interface SuggestedFriendsListProps {
  users: SuggestedUser[] | undefined;
  isLoading: boolean;
  onAddFriend: (user: SuggestedUser) => void;
}

export const SuggestedFriendsList = ({ users, isLoading, onAddFriend }: SuggestedFriendsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8">
        <UserX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">Aucune suggestion pour le moment</p>
        <p className="text-sm text-gray-400 mt-2">
          Utilisez la recherche pour trouver des amis
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        {users.map((user) => (
          <SuggestedUserCard
            key={user.id}
            user={user}
            onAddFriend={onAddFriend}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
