import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, Heart, UserPlus, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Notification = {
  id: string;
  type: string;
  actor_id: string | null;
  post_id: string | null;
  read: boolean;
  created_at: string;
  actor?: {
    username: string;
    avatar_url: string | null;
  };
  post?: {
    content: string;
  };
};

export const NotificationsList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      console.log("Fetching notifications...");
      const { data: notifications, error } = await supabase
        .from("notifications")
        .select(`
          *,
          actor:profiles!notifications_actor_id_fkey(username, avatar_url),
          post:posts(content)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      console.log("Notifications fetched:", notifications);
      return notifications as Notification[];
    },
  });

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue",
      });
    }
  };

  const getNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case "like":
        return {
          icon: <Heart className="h-4 w-4 text-red-500" />,
          message: `${notification.actor?.username} a aimé votre publication`,
        };
      case "comment":
        return {
          icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
          message: `${notification.actor?.username} a commenté votre publication`,
        };
      case "follow":
        return {
          icon: <UserPlus className="h-4 w-4 text-green-500" />,
          message: `${notification.actor?.username} vous suit désormais`,
        };
      default:
        return {
          icon: <Bell className="h-4 w-4" />,
          message: "Nouvelle notification",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Bell className="h-8 w-8 animate-pulse mx-auto text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!notifications?.length ? (
        <div className="text-center py-8 text-muted-foreground">
          Aucune notification
        </div>
      ) : (
        notifications.map((notification) => {
          const { icon, message } = getNotificationContent(notification);
          return (
            <Card
              key={notification.id}
              className={`p-4 ${
                !notification.read ? "border-l-4 border-l-primary" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={notification.actor?.avatar_url || ""} />
                  <AvatarFallback>
                    {notification.actor?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">{message}</p>
                  {notification.post && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.post.content}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
};