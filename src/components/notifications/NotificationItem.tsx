
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, Bell, Trash } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Notification } from "./types";
import { NotificationIcon } from "./NotificationIcon";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => Promise<void>;
  onDelete?: (id: string) => void;
  isNew?: boolean;
}

export const NotificationItem = ({ notification, onMarkAsRead, onDelete, isNew = false }: NotificationItemProps) => {
  const { message, icon } = NotificationIcon.getNotificationContent(notification);
  const navigate = useNavigate();
  const [showNewBadge, setShowNewBadge] = useState(isNew);
  
  // Animation pour les nouvelles notifications
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => {
        setShowNewBadge(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);
  
  // Fonction pour naviguer vers le contenu pertinent (post, profil, etc.)
  const goToContent = () => {
    if (notification.type === 'follow' && notification.actor_id) {
      navigate(`/profile/${notification.actor_id}`);
    } else if (notification.type === 'friend_request' && notification.actor_id) {
      navigate(`/friends`);
    } else if (notification.type === 'challenge_accepted' || notification.type === 'challenge_won') {
      navigate(`/challenges`);
    } else if (notification.type === 'order_update' && notification.data?.order_id) {
      navigate(`/profile/purchases`);
    } else if (notification.post_id) {
      navigate(`/posts/${notification.post_id}`);
    }
  };

  return (
    <motion.div
      initial={isNew ? { opacity: 0, y: -20, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        key={notification.id}
        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer 
          ${!notification.read ? "border-l-4 border-l-primary" : ""}
          ${showNewBadge ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
        onClick={goToContent}
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            {notification.actor?.avatar_url ? (
              <AvatarImage src={notification.actor.avatar_url} alt={notification.actor?.username || ""} />
            ) : (
              <AvatarFallback className="bg-primary/10">
                {notification.actor?.username?.[0]?.toUpperCase() || <Bell className="h-4 w-4" />}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {icon}
              <p className="text-sm font-medium">{message}</p>
              {showNewBadge && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  Nouveau
                </span>
              )}
            </div>
            {notification.post && (
              <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md mt-1 line-clamp-2">
                {notification.post.content}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
              {notification.post_id && <ExternalLink className="h-3 w-3" />}
            </p>
          </div>
          <div className="flex gap-1">
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-primary/10 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-red-100 text-red-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
