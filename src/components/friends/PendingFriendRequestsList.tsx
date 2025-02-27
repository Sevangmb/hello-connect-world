
import React from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export interface PendingFriendRequest {
  id: string;
  friend_profile: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

interface PendingFriendRequestsListProps {
  requests: PendingFriendRequest[];
  isLoading: boolean;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export const PendingFriendRequestsList = ({ 
  requests, 
  isLoading, 
  onAccept, 
  onReject 
}: PendingFriendRequestsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-40" />
              <div className="ml-auto flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-blue-900">Demandes d'ami en attente</h2>
      {requests.map((request) => (
        <Card key={request.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={request.friend_profile.avatar_url || ""} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{request.friend_profile.username}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => onAccept(request.id)}>
                Accepter
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject(request.id)}
              >
                Refuser
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
