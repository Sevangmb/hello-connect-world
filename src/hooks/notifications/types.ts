
import { LucideIcon } from "lucide-react";

export interface NotificationData {
  id: string;
  user_id: string;
  actor_id: string | null;
  post_id: string | null;
  is_read: boolean;
  read: boolean; // Alias pour is_read pour assurer la compatibilité
  created_at: string;
  type: string;
  title?: string;
  message?: string;
  data?: Record<string, any>;
  actor?: {
    username: string | null;
    avatar_url: string | null;
  };
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  notification_type: string;
  enabled: boolean;
  created_at: string;
}

export interface IconConfig {
  type: "icon";
  icon: LucideIcon;
  className?: string;
}

export interface NotificationSubscription {
  userId: string;
  connected: boolean;
  error: Error | null;
  subscribeToNotifications: () => void;
  unsubscribeFromNotifications: () => void;
}

// Définition des types pour les callbacks de notification
export interface NotificationCallbacks {
  onNewNotification?: (notification: NotificationData) => void;
  onConnectionStateChange?: (connected: boolean) => void;
  onError?: (error: Error) => void;
}
