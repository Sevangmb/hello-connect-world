
import { Notification as UINotification } from "@/components/notifications/types";

export interface NotificationData {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data: any;
  is_read: boolean;
  created_at: string;
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  notification_type: string;
  enabled: boolean;
}

export interface NotificationCallbacks {
  onNewNotification?: (notification: NotificationData) => void;
}
