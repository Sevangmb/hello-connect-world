import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: session } = await supabase.auth.getSession();
      setUser(session?.session?.user ?? null);
      setLoading(false);

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
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
    setUser(user);
    setLoading(false);
    if (error) throw error;
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  };

  return { user, loading, signIn, signOut };
};
