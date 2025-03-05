
/**
 * Types pour le domaine des utilisateurs
 */

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  visibility: "public" | "private" | "friends";
  phone: string | null;
  address: string | null;
  preferred_language: string;
  email_notifications: boolean;
  is_admin?: boolean;
}

export type UserUpdateData = Partial<Omit<UserProfile, 'id'>>;

export interface UserProfileResult {
  profile: UserProfile | null;
  error?: string;
}
