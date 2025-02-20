
import { supabase } from "@/integrations/supabase/client";

export type NotificationType = 
  | "like"
  | "comment"
  | "follow"
  | "mention"
  | "order_update"
  | "private_message";

export async function createNotification({
  userId,
  actorId,
  type,
  postId,
}: {
  userId: string;
  actorId?: string;
  type: NotificationType;
  postId?: string;
}) {
  try {
    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      actor_id: actorId,
      type,
      post_id: postId,
      read: false,
    });

    if (error) throw error;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}
