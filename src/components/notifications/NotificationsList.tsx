
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";

export const NotificationsList = () => {
  const { notifications, isLoading, markAsRead, subscribeToNotifications } = useNotifications();
  
  // Configure realtime subscription
  useEffect(() => {
    const unsubscribe = subscribeToNotifications();
    return unsubscribe;
  }, []);

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
        notifications.map((notification) => (
          <NotificationItem 
            key={notification.id}
            notification={notification}
            onMarkAsRead={markAsRead}
          />
        ))
      )}
    </div>
  );
};
