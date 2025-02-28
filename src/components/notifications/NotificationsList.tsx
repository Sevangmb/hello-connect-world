
import { useState, useEffect } from "react";
import { Bell, Loader2 } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const NotificationsList = () => {
  const { notifications, isLoading, markAsRead, subscribeToNotifications } = useNotifications();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Configure realtime subscription
  useEffect(() => {
    const unsubscribe = subscribeToNotifications();
    return unsubscribe;
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Attendre un peu pour l'animation
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-facebook-primary mb-2" />
          <p className="text-sm text-muted-foreground">Chargement des notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out pb-4 mb-4 border-b", 
          isRefreshing ? "opacity-50" : "opacity-100"
        )}
      >
        <button 
          onClick={handleRefresh}
          className="w-full py-2 px-4 text-sm text-facebook-primary flex items-center justify-center gap-2 rounded-md hover:bg-gray-50 transition-colors"
          disabled={isRefreshing}
        >
          <Loader2 className={cn("h-4 w-4", isRefreshing ? "animate-spin" : "")} />
          <span>{isRefreshing ? "Actualisation..." : "Tirer pour actualiser"}</span>
        </button>
      </div>

      {!notifications?.length ? (
        <Card className="p-8 text-center bg-gray-50/50 border border-gray-100">
          <Bell className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-40" />
          <p className="text-muted-foreground font-medium">Aucune notification</p>
          <p className="text-xs text-muted-foreground mt-1">
            Les notifications apparaîtront ici
          </p>
        </Card>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {notifications.map((notification) => (
            <NotificationItem 
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
};
