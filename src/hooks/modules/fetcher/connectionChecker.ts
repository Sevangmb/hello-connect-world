
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ConnectionStatus } from "./types";

/**
 * Hook to check the connection to Supabase
 */
export function useConnectionChecker() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('checking');
  const [error, setError] = useState<string | null>(null);

  // Check Supabase connection on startup
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Make a simple query to check the connection
        const { data, error } = await supabase
          .from('app_modules')
          .select('id')
          .limit(1);
          
        if (error) {
          console.error("Error connecting to Supabase:", error);
          setConnectionStatus('disconnected');
          setError("Problem connecting to the database");
        } else {
          console.log("Connection to Supabase established successfully");
          setConnectionStatus('connected');
        }
      } catch (err) {
        console.error("Exception when checking connection:", err);
        setConnectionStatus('disconnected');
        setError("Problem connecting to the database");
      }
    };
    
    checkConnection();
  }, []);

  return { connectionStatus, error };
}
