
import React from 'react';
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function AuthStatus() {
  const { user, loading, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-2">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="ml-2 text-sm">Vérification...</span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="p-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/auth")}
        >
          Se connecter
        </Button>
      </div>
    );
  }

  return (
    <div className="p-2 flex flex-col items-start">
      <div className="text-sm font-medium mb-1">
        {user.user_metadata?.full_name || user.email}
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleSignOut}
        className="text-xs text-red-500 hover:text-red-700 p-0"
      >
        Déconnexion
      </Button>
    </div>
  );
}
