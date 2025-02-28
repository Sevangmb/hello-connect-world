
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Notification } from "./types";
import { NotificationIcon } from "./NotificationIcon";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => Promise<void>;
}

export const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const { message, icon } = NotificationIcon.getNotificationContent(notification);
  
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
            onClick={() => onMarkAsRead(notification.id)}
          >
            <Check className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
};
