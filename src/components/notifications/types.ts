
export type Notification = {
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
  message?: string; // Message personnalisé optionnel
  data?: Record<string, any>; // Données supplémentaires pour contexte
};

export type NotificationType = 
  | 'like'
  | 'comment' 
  | 'follow'
  | 'mention'
  | 'order_update'
  | 'private_message'
  | 'badge_earned'
  | 'rating'
  | 'challenge_accepted'
  | 'challenge_won'
  | 'outfit_shared'
  | 'friend_request'
  | 'friend_accepted'
  | 'system';

// État de traitement pour les notifications toast
export type ToastStatus = 'idle' | 'loading' | 'success' | 'error';

// Notification toast contextuelle
export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  status: ToastStatus;
  icon?: React.ReactNode;
  duration?: number;
  action?: React.ReactNode;
}
