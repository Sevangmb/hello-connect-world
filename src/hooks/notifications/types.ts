
import { LucideIcon } from "lucide-react";

export interface NotificationData {
  id: string;
  user_id: string;
  actor_id: string | null;
  post_id: string | null;
  is_read: boolean;
  created_at: string;
  type: string;
  title?: string;
  message?: string;
  data?: Record<string, any>;
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
