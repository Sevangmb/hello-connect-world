import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: session, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        setLoading(false);
        return;
      }
      setUser(session?.session?.user ?? null);
      setLoading(false);

      const { data: authListener, error: authListenerError } = supabase.auth.onAuthStateChange((_event, session) => {
        if (authListenerError) {
          console.error("Error with auth listener:", authListenerError);
          return;
        }
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => {
        authListener?.subscription.unsubscribe();
      };
    };

    fetchData();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Error signing in:", error);
      setLoading(false);
      throw error;
    }
    setUser(user);
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      setLoading(false);
      throw error;
    }
    setUser(null);
    setLoading(false);
  };

  return { user, loading, signIn, signOut };
};
