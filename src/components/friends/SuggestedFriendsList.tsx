
import React from 'react';
import { SuggestedUser } from '@/hooks/useSuggestedFriends';
import { SuggestedUserCard } from './SuggestedUserCard';
import { Skeleton } from '@/components/ui/skeleton';

interface SuggestedFriendsListProps {
  users: SuggestedUser[];
  isLoading?: boolean;
  onSelectUser: (user: SuggestedUser) => void;
  onAddFriend?: (user: SuggestedUser) => void;
}

export const SuggestedFriendsList: React.FC<SuggestedFriendsListProps> = ({
  users,
  isLoading = false,
  onSelectUser,
  onAddFriend
}) => {
  // Show skeleton loaders while loading
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="border rounded-lg p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-8 w-full mt-4" />
          </div>
        ))}
      </div>
    );
  }

  // If no users found
  if (users.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">Aucune suggestion d'amis pour le moment.</p>
      </div>
    );
  }

  // Show the list of suggested users
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {users.map((user) => (
        <SuggestedUserCard
          key={user.id}
          user={user}
          onSelect={() => onSelectUser(user)}
          onAddFriend={onAddFriend ? () => onAddFriend(user) : undefined}
        />
      ))}
    </div>
  );
};
