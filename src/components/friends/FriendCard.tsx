
import React from "react";
import { User, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface FriendProfile {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface FriendCardProps {
  friend: FriendProfile;
  onSelect?: (friend: FriendProfile) => void;
}

export const FriendCard = ({ friend, onSelect }: FriendCardProps) => {
  return (
    <Card 
      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" 
      onClick={() => onSelect?.(friend)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={friend.avatar_url || ""} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{friend.username}</span>
        </div>
        {onSelect && (
          <MessageCircle className="h-4 w-4 text-gray-400 hover:text-blue-500" />
        )}
      </div>
    </Card>
  );
};
