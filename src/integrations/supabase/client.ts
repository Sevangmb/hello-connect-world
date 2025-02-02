// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jvmmgamfdbgdjjptfkgy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2bW1nYW1mZGJnZGpqcHRma2d5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwMzk5NjAsImV4cCI6MjA1MzYxNTk2MH0._51Uk0LRRB-r2UI7bJZp0rpotbxage6hULlPrWZhskk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

const defaultFetch = fetch;
const customFetch = async (url: RequestInfo, options?: RequestInit): Promise<Response> => {
  const response = await defaultFetch(url, options);
  if (!response.ok) {
    let errorMessage = "An error occurred while fetching.";
    try {
      const errorData = await response.clone().json();
      if (errorData && errorData.code === "invalid_credentials") {
        errorMessage = "Identifiants invalides. Veuillez vérifier votre email et mot de passe.";
      }
    } catch (e) {}
    throw new Error(errorMessage);
  }
  return response;
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  fetch: customFetch,
});

export const adminQueries = {
  fetchAdminStats: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, is_admin, created_at', { count: 'exact' });
    if (error) {
      throw error;
    }
    return data;
  },
  fetchAnalytics: async () => {
    const { data, error } = await supabase
      .from('analytics')
      .select('*');
    if (error) {
      throw error;
    }
    return data;
  },
};