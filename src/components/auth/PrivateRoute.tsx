
"use client"

import * as React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAuthService } from "@/core/auth/infrastructure/authDependencyProvider";

const useAuthCheck = () => {
  const [loading, setLoading] = React.useState(true);
  const [authenticated, setAuthenticated] = React.useState(false);
  const { toast } = useToast();
  const authService = getAuthService();

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        setAuthenticated(!!user);
      } catch (error) {
        console.error("Error in auth check:", error);
        toast({
          variant: "destructive",
          title: "Authentication error",
          description: "Please sign in again",
        });
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth state changes
    const unsubscribe = authService.subscribeToAuthChanges((user) => {
      setAuthenticated(!!user);
      setLoading(false);
    });

    return () => {
      unsubscribe();
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
