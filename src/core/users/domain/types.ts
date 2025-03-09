
// Types pour le domaine des utilisateurs
export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  visibility: 'public' | 'private' | 'friends';
  phone: string | null;
  address: string | null;
  preferred_language: string;
  email_notifications: boolean;
  is_admin: boolean;
  stripe_customer_id?: string;
  default_payment_method_id?: string;
  billing_address?: BillingAddress;
  theme_preference?: string;
  push_notifications?: boolean;
  marketing_emails?: boolean;
}

export interface UserUpdateData {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  visibility?: 'public' | 'private' | 'friends';
  phone?: string | null;
  address?: string | null;
  preferred_language?: string;
  email_notifications?: boolean;
  billing_address?: BillingAddress;
  theme_preference?: string;
  push_notifications?: boolean;
  marketing_emails?: boolean;
}

export interface BillingAddress {
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
}
