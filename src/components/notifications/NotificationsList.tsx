
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, MessageSquare, Heart, UserPlus, Check, AtSign, ShoppingBag } from "lucide-react";
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
  actor: {
    username: string | null;
    avatar_url: string | null;
  } | null;
  post?: {
    content: string;
  };
};

export const NotificationsList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Configure realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('Realtime notification update:', payload);
          queryClient.invalidateQueries({ queryKey: ["notifications"] });

          // Show toast for new notifications
          if (payload.eventType === 'INSERT') {
            toast({
              title: "Nouvelle notification",
              description: "Vous avez reçu une nouvelle notification",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      console.log("Fetching notifications...");
      const { data, error } = await supabase
        .from("notifications")
        .select(`
          *,
          actor:profiles!notifications_actor_id_fkey(username, avatar_url),
          post:posts(content)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }

      // Cast to unknown first, then to Notification[] to avoid type issues
      return (data as unknown as Notification[]) || [];
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
          message: `${notification.actor?.username || "Quelqu'un"} a aimé votre publication`,
        };
      case "comment":
        return {
          icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
          message: `${notification.actor?.username || "Quelqu'un"} a commenté votre publication`,
        };
      case "follow":
        return {
          icon: <UserPlus className="h-4 w-4 text-green-500" />,
          message: `${notification.actor?.username || "Quelqu'un"} vous suit désormais`,
        };
      case "mention":
        return {
          icon: <AtSign className="h-4 w-4 text-indigo-500" />,
          message: `${notification.actor?.username || "Quelqu'un"} vous a mentionné`,
        };
      case "order_update":
        return {
          icon: <ShoppingBag className="h-4 w-4 text-purple-500" />,
          message: `Mise à jour de votre commande`,
        };
      case "private_message":
        return {
          icon: <MessageSquare className="h-4 w-4 text-cyan-500" />,
          message: `${notification.actor?.username || "Quelqu'un"} vous a envoyé un message privé`,
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
              className={`p-4 ${!notification.read ? "border-l-4 border-l-primary" : ""}`}
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={notification.actor?.avatar_url || ""} />
                  <AvatarFallback>
                    {notification.actor?.username?.[0]?.toUpperCase() || "?"}
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

