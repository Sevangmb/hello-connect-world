
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

export interface PostProps {
  id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    full_name?: string;
    avatar_url?: string;
  };
  likes_count?: number;
  comments_count?: number;
}

export function Post(props: PostProps) {
  const { content, created_at, user, likes_count = 0, comments_count = 0 } = props;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-10 w-10">
          {user.avatar_url && <img src={user.avatar_url} alt={user.full_name || 'User'} />}
        </Avatar>
        <div>
          <p className="font-semibold">{user.full_name}</p>
          <p className="text-sm text-muted-foreground">
            {formatDistance(new Date(created_at), new Date(), { 
              addSuffix: true,
              locale: fr 
            })}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button variant="ghost" size="sm">
          {likes_count} J'aime
        </Button>
        <Button variant="ghost" size="sm">
          {comments_count} Commentaires
        </Button>
      </CardFooter>
    </Card>
  );
}
