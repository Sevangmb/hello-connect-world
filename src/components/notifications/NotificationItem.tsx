
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Notification } from "./types";
import { NotificationIcon } from "./NotificationIcon";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => Promise<void>;
}

export const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const { message, icon } = NotificationIcon.getNotificationContent(notification);
  const navigate = useNavigate();
  
  // Fonction pour naviguer vers le contenu pertinent (post, profil, etc.)
  const goToContent = () => {
    if (notification.type === 'follow' && notification.actor_id) {
      navigate(`/profile/${notification.actor_id}`);
    } else if (notification.post_id) {
      navigate(`/posts/${notification.post_id}`);
    }
  };

  return (
    <Card
      key={notification.id}
      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? "border-l-4 border-l-primary" : ""}`}
      onClick={goToContent}
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={notification.actor?.avatar_url || ""} />
          <AvatarFallback>
            {notification.actor?.username?.[0]?.toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {icon}
            <p className="text-sm font-medium">{message}</p>
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
        {!notification.read && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
};
