
import React from "react";
import { UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SuggestedUser } from "@/hooks/useSuggestedFriends";

interface SuggestedUserCardProps {
  user: SuggestedUser;
  onAddFriend: (user: SuggestedUser) => void;
}

export const SuggestedUserCard = ({ user, onAddFriend }: SuggestedUserCardProps) => {
  return (
    <Card className="p-4 hover:bg-blue-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-blue-100">
            <AvatarImage src={user.avatar_url || ""} />
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {user.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-blue-900">{user.username}</span>
        </div>
        <Button 
          size="sm"
          className="bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800"
          onClick={() => onAddFriend(user)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>
    </Card>
  );
};
