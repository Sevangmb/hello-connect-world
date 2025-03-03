
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, Trash, Bell, MessageSquare, Heart, UserPlus, AtSign, ShoppingBag, Award, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Notification } from "./types";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => Promise<void>;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export const NotificationItem = ({ notification, onMarkAsRead, onDelete, compact = false }: NotificationItemProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // Fonction pour obtenir l'icône et le contenu de la notification en fonction de son type
  const getNotificationContent = () => {
    // Utiliser le message personnalisé s'il existe
    const customMessage = notification.message;

    switch (notification.type) {
      case "like":
        return {
          icon: <Heart className="h-4 w-4 text-red-500" />,
          message: customMessage || `${notification.actor?.username || "Quelqu'un"} a aimé votre publication`,
        };
      case "comment":
        return {
          icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
          message: customMessage || `${notification.actor?.username || "Quelqu'un"} a commenté votre publication`,
        };
      case "follow":
        return {
          icon: <UserPlus className="h-4 w-4 text-green-500" />,
          message: customMessage || `${notification.actor?.username || "Quelqu'un"} vous suit désormais`,
        };
      case "mention":
        return {
          icon: <AtSign className="h-4 w-4 text-indigo-500" />,
          message: customMessage || `${notification.actor?.username || "Quelqu'un"} vous a mentionné`,
        };
      case "order_update":
        return {
          icon: <ShoppingBag className="h-4 w-4 text-purple-500" />,
          message: customMessage || `Mise à jour de votre commande`,
        };
      case "private_message":
        return {
          icon: <MessageSquare className="h-4 w-4 text-cyan-500" />,
          message: customMessage || `${notification.actor?.username || "Quelqu'un"} vous a envoyé un message privé`,
        };
      case "badge_earned":
        return {
          icon: <Award className="h-4 w-4 text-amber-500" />,
          message: customMessage || `Vous avez obtenu un nouveau badge !`,
        };
      case "rating":
        return {
          icon: <Star className="h-4 w-4 text-yellow-500" />,
          message: customMessage || `${notification.actor?.username || "Quelqu'un"} a noté votre tenue`,
        };
      default:
        return {
          icon: <Bell className="h-4 w-4 text-gray-500" />,
          message: customMessage || "Nouvelle notification",
        };
    }
  };

  const { icon, message } = getNotificationContent();
  
  // Fonction pour naviguer vers le contenu pertinent (post, profil, etc.)
  const goToContent = async () => {
    // Marquer comme lu avant de naviguer
    setIsLoading(true);
    try {
      if (!notification.read) {
        await onMarkAsRead(notification.id);
      }

      // Rediriger en fonction du type de notification
      if (notification.type === 'follow' && notification.actor_id) {
        navigate(`/profile/${notification.actor_id}`);
      } else if (notification.type === 'order_update' && notification.data?.order_id) {
        navigate(`/profile/purchases`);
      } else if (notification.post_id) {
        navigate(`/posts/${notification.post_id}`);
      } else if (notification.type === 'private_message' && notification.actor_id) {
        navigate(`/messages?user=${notification.actor_id}`);
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await onMarkAsRead(notification.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(notification.id);
    }
  };

  return (
    <Card
      key={notification.id}
      className={cn(
        "p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer",
        !notification.read ? "border-l-4 border-l-primary" : "",
        compact ? "p-2" : "p-4"
      )}
      onClick={goToContent}
    >
      <div className={cn("flex items-center gap-3", compact ? "gap-2" : "gap-4")}>
        <Avatar className={cn("flex-shrink-0", compact ? "h-8 w-8" : "h-10 w-10")}>
          {notification.actor?.avatar_url ? (
            <AvatarImage src={notification.actor.avatar_url} alt={notification.actor?.username || ""} />
          ) : (
            <AvatarFallback className="bg-primary/10">
              {notification.actor?.username?.[0]?.toUpperCase() || <Bell className="h-4 w-4" />}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {icon}
            <p className={cn("font-medium truncate", compact ? "text-xs" : "text-sm")}>
              {message}
            </p>
          </div>
          {notification.post && notification.post.content && !compact && (
            <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md mt-1 line-clamp-2">
              {notification.post.content}
            </p>
          )}
          <p className={cn("text-muted-foreground", compact ? "text-[10px]" : "text-xs")}>
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
            {notification.post_id && <ExternalLink className="inline-block ml-1 h-3 w-3" />}
          </p>
        </div>
        <div className="flex gap-1">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-primary/10 transition-colors h-7 w-7 p-0"
              onClick={handleMarkAsRead}
              disabled={isLoading}
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Marquer comme lu</span>
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-red-100 text-red-500 transition-colors h-7 w-7 p-0"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash className="h-4 w-4" />
              <span className="sr-only">Supprimer</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
