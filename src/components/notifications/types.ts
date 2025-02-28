
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
};
