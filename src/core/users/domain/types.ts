
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
  billing_address?: BillingAddress;
  stripe_customer_id?: string;
  default_payment_method_id?: string;
  theme_preference?: string;
  push_notifications?: boolean;
  marketing_emails?: boolean;
  two_factor_enabled?: boolean;
  last_login_at?: string;
  active_sessions?: UserSession[];
}

export interface UserSession {
  id: string;
  user_id: string;
  device_name: string;
  ip_address: string;
  last_active: string;
  created_at: string;
  location?: string;
  browser?: string;
  os?: string;
}

export interface BillingAddress {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  state?: string;
}

export type UserUpdateData = Partial<Omit<UserProfile, 'id'>>;

export interface UserProfileResult {
  profile: UserProfile | null;
  error?: string;
}
