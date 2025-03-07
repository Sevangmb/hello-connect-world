
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { SuggestedUser } from '@/hooks/useSuggestedFriends';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserPlus } from 'lucide-react';

interface SuggestedUserCardProps {
  user: SuggestedUser;
  onSelect: () => void;
  onAddFriend?: () => void;
}

export const SuggestedUserCard: React.FC<SuggestedUserCardProps> = ({ user, onSelect, onAddFriend }) => {
  const handleAction = () => {
    if (onAddFriend) {
      onAddFriend();
    } else {
      onSelect();
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.avatar_url || ''} alt={user.username} />
            <AvatarFallback>
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-lg">{user.username || 'Utilisateur'}</div>
            <div className="text-sm text-gray-500">Suggestions pour vous</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleAction}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </CardFooter>
    </Card>
  );
};
