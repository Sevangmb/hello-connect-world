
"use client"

import * as React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const useAuthCheck = () => {
  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking auth status:", error);
          toast({
            variant: "destructive",
            title: "Authentication error",
            description: "Please sign in again",
          });
          setAuthenticated(false);
          return;
        }

        setAuthenticated(!!session);
      } catch (error) {
        console.error("Error in auth check:", error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (event === 'SIGNED_OUT') {
        setAuthenticated(false);
      } else if (session) {
        setAuthenticated(true);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return { loading, authenticated };
};

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { loading, authenticated } = useAuthCheck();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
